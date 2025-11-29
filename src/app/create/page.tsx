"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentCanvas, DocumentForm, PreviewNavigation } from "@/components/merge-editor";
import {
  clampPercent,
  createBlankField,
  createDefaultDocument,
} from "@/lib/name-tag";
import { createFieldsForDocumentType } from "@/lib/document-types";
import {
  clearStoredDocument,
  loadStoredDocument,
  persistDocument,
  saveDesignToFirebase,
} from "@/lib/tag-storage";
import { SaveDesignModal } from "@/components/ui/save-design-modal";
import {
  readDataset,
  type DatasetRow,
} from "@/lib/dataset";
import { buildDocxWithText } from "@/lib/export";
import { DocumentData, MergeField, DocumentType } from "@/types/document";
import type { ImportSummary } from "@/types/import";
import { useAuth } from "@/components/layout/auth-provider";

const resolveImportStatus = (
  headerCount: number,
  fieldCount: number,
): ImportSummary["status"] => {
  if (headerCount === fieldCount) {
    return "match";
  }
  return headerCount > fieldCount ? "needs-layers" : "unused-layers";
};

const mapFieldsToRow = (
  fields: MergeField[],
  row: DatasetRow,
): MergeField[] =>
  fields.map((field) => {
    // Replace {{FieldName}} placeholders with actual values
    // Use [^}]+ to match any characters including spaces inside the braces
    const resolvedText = field.text.replace(/\{\{([^}]+)\}\}/g, (match, fieldName) => {
      const trimmedName = fieldName.trim();
      const value = row[trimmedName];
      return typeof value === "string" && value.length > 0 ? value : match;
    });
    return {
      ...field,
      text: resolvedText,
    };
  });

const triggerDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

const alignFieldsWithHeaders = (
  fields: MergeField[],
  headers: string[],
): {
  fields: MergeField[];
  activeId: string;
} => {
  if (!headers.length) {
    return {
      fields,
      activeId: fields[0]?.id ?? "",
    };
  }

  const normalized = headers.map((header, index) => {
    if (typeof header !== "string") {
      return `Field ${index + 1}`;
    }
    const trimmed = header.trim();
    return trimmed.length ? trimmed : `Field ${index + 1}`;
  });

  const nextFields: MergeField[] = normalized.map(
    (label, index) => {
      const existing = fields[index];
      if (existing) {
        return {
          ...existing,
          name: label,
          text: `{{${label}}}`,
        };
      }
      const placeholder = createBlankField(label);
      return {
        ...placeholder,
        name: label,
        text: `{{${label}}}`,
      };
    },
  );

  return {
    fields: nextFields,
    activeId: nextFields[0]?.id ?? "",
  };
};

export default function CreatePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const initialDoc = useMemo(() => createDefaultDocument("label"), []);
  const [document, setDocument] = useState<DocumentData>(initialDoc);
  const [activeField, setActiveField] = useState<string>(
    initialDoc.fields[0]?.id ?? "",
  );
  const [hasLoadedStoredDoc, setHasLoadedStoredDoc] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImportingDataset, setIsImportingDataset] = useState(false);
  const [datasetRows, setDatasetRows] = useState<DatasetRow[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);
  
  // Preview mode state
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewRecordIndex, setPreviewRecordIndex] = useState(0);
  
  const fieldCount = document.fields.length;
  const datasetRowCount = datasetRows.length;
  const canExport = datasetRowCount > 0;

  // Get current preview data
  const currentPreviewData = useMemo(() => {
    if (!isPreviewMode || datasetRows.length === 0) {
      return undefined;
    }
    return datasetRows[previewRecordIndex];
  }, [isPreviewMode, datasetRows, previewRecordIndex]);

  useEffect(() => {
    const storedDoc = loadStoredDocument();
    if (storedDoc) {
      // Ensure documentType exists (backward compatibility)
      if (!storedDoc.documentType) {
        storedDoc.documentType = "label";
      }
      setDocument(storedDoc);
      setActiveField(storedDoc.fields[0]?.id ?? "");
    }
    setHasLoadedStoredDoc(true);
  }, []);

  const selectField = useCallback((id: string) => {
    setActiveField(id);
  }, []);

  const updateField = useCallback((id: string, patch: Partial<MergeField>) => {
    setDocument((prev) => ({
      ...prev,
      fields: prev.fields.map((field) => {
        if (field.id !== id) {
          return field;
        }
        const next: MergeField = {
          ...field,
          ...patch,
        };
        if (patch.x !== undefined) {
          next.x = clampPercent(patch.x);
        }
        if (patch.y !== undefined) {
          next.y = clampPercent(patch.y);
        }
        return next;
      }),
    }));
  }, []);

  const addField = useCallback(() => {
    setDocument((prev) => {
      const newField = createBlankField(`Field ${prev.fields.length + 1}`);
      setActiveField(newField.id);
      return {
        ...prev,
        fields: [...prev.fields, newField],
      };
    });
  }, []);

  const removeField = useCallback((id: string) => {
    setDocument((prev) => {
      if (prev.fields.length <= 1) {
        return prev;
      }
      const filtered = prev.fields.filter((field) => field.id !== id);
      if (filtered.length === prev.fields.length) {
        return prev;
      }
      if (activeField === id) {
        setActiveField(filtered[filtered.length - 1]?.id ?? "");
      }
      return {
        ...prev,
        fields: filtered,
      };
    });
  }, [activeField]);

  const handleThemeChange = useCallback((
    update: Partial<
      Pick<DocumentData, "accent" | "background" | "textAlign" | "customBackground">
    >,
  ) => {
    setDocument((prev) => ({ ...prev, ...update }));
  }, []);

  const handleDocumentTypeChange = useCallback((type: DocumentType) => {
    setDocument((prev) => {
      // If switching document type, reset to default fields for that type
      const newFields = createFieldsForDocumentType(type);
      setActiveField(newFields[0]?.id ?? "");
      return {
        ...prev,
        documentType: type,
        fields: newFields,
      };
    });
  }, []);

  const handleReset = useCallback(() => {
    const defaults = createDefaultDocument(document.documentType);
    setDocument(defaults);
    setActiveField(defaults.fields[0]?.id ?? "");
    clearStoredDocument();
  }, [document.documentType]);

  const syncFieldsToHeaders = (headers: string[]) => {
    if (!headers.length) {
      return;
    }

    let nextActiveId = "";
    setDocument((prev) => {
      const aligned = alignFieldsWithHeaders(prev.fields, headers);
      nextActiveId = aligned.activeId || prev.fields[0]?.id || "";
      return {
        ...prev,
        fields: aligned.fields,
      };
    });
    if (nextActiveId) {
      setActiveField(nextActiveId);
    }
  };

  const handleDatasetImport = async (file: File) => {
    setImportError(null);
    setIsImportingDataset(true);
    setExportError(null);
    try {
      const dataset = await readDataset(file);
      const headerCount = dataset.headers.length;
      const rowCount = dataset.rows.length;
      setDatasetRows(dataset.rows);
      if (headerCount > 0) {
        syncFieldsToHeaders(dataset.headers);
      }
      const resultingFieldCount =
        headerCount > 0 ? headerCount : fieldCount;
      setImportSummary({
        fileName: file.name,
        headers: dataset.headers,
        headerCount,
        layerCount: resultingFieldCount,
        rowCount,
        status: resolveImportStatus(
          headerCount,
          resultingFieldCount,
        ),
        importedAt: new Date().toISOString(),
      });
      // Reset preview to first record
      setPreviewRecordIndex(0);
    } catch (error) {
      setImportSummary(null);
      setDatasetRows([]);
      setImportError(
        error instanceof Error
          ? error.message
          : "Sorry, we couldn't read that file.",
      );
    } finally {
      setIsImportingDataset(false);
    }
  };

  const handleSaveDesign = () => {
    setShowSaveModal(true);
  };

  const handleSaveSubmit = async (name: string, description?: string) => {
    try {
      setSavingStatus("Saving your design...");
      await saveDesignToFirebase(name, document, description);
      setSavingStatus("Design saved successfully!");
      setTimeout(() => setSavingStatus(null), 3000);
    } catch (error) {
      console.error("Failed to save design", error);
      throw error;
    }
  };

  const handleExportDocuments = async () => {
    if (!datasetRows.length) {
      setExportError("Upload a CSV or Excel file before exporting.");
      return;
    }
    setIsExporting(true);
    setExportError(null);
    try {
      const documentsData: MergeField[][] = [];
      for (const row of datasetRows) {
        const rowFields = mapFieldsToRow(document.fields, row);
        documentsData.push(rowFields);
      }
      if (!documentsData.length) {
        throw new Error("No rows were detected in the imported file.");
      }
      const docBlob = await buildDocxWithText(document, documentsData);
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-");
      const docTypeName = document.documentType;
      triggerDownload(
        docBlob,
        `mail-merge-${docTypeName}-${timestamp}.docx`,
      );
    } catch (error) {
      setExportError(
        error instanceof Error
          ? error.message
          : "Export failed. Please try again.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleTogglePreview = useCallback(() => {
    setIsPreviewMode((prev) => !prev);
  }, []);

  const handleRecordChange = useCallback((index: number) => {
    setPreviewRecordIndex(index);
  }, []);

  useEffect(() => {
    setImportSummary((previous) => {
      if (!previous) {
        return previous;
      }
      if (previous.layerCount === fieldCount) {
        return previous;
      }
      return {
        ...previous,
        layerCount: fieldCount,
        status: resolveImportStatus(previous.headerCount, fieldCount),
      };
    });
  }, [fieldCount]);

  useEffect(() => {
    setImportSummary((previous) => {
      if (!previous) {
        return previous;
      }
      if (previous.rowCount === datasetRowCount) {
        return previous;
      }
      return {
        ...previous,
        rowCount: datasetRowCount,
      };
    });
  }, [datasetRowCount]);

  useEffect(() => {
    if (!hasLoadedStoredDoc) {
      return;
    }
    const handle = window.setTimeout(() => {
      persistDocument(document);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [document, hasLoadedStoredDoc]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/create");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleFieldChange = useCallback((id: string, patch: Partial<MergeField>) => {
    selectField(id);
    updateField(id, patch);
  }, [selectField, updateField]);

  // Ensure preview record index is valid
  useEffect(() => {
    if (previewRecordIndex >= datasetRows.length && datasetRows.length > 0) {
      setPreviewRecordIndex(datasetRows.length - 1);
    }
  }, [datasetRows.length, previewRecordIndex]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-pop-purple" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        
        {/* Preview Navigation Bar */}
        <PreviewNavigation
          isPreviewMode={isPreviewMode}
          onTogglePreview={handleTogglePreview}
          currentRecord={previewRecordIndex}
          totalRecords={datasetRows.length}
          onRecordChange={handleRecordChange}
          hasData={datasetRows.length > 0}
        />
        
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,400px)] lg:items-start">
          <div className="order-1 lg:order-0">
            <DocumentCanvas
              document={document}
              activeField={activeField}
              previewMode={isPreviewMode}
              previewData={currentPreviewData}
              onSelectField={selectField}
              onFieldPositionChange={updateField}
            />
          </div>

          <div className="order-2 lg:order-0">
            <DocumentForm
              document={document}
              activeFieldId={activeField}
              onSelectField={selectField}
              onFieldChange={handleFieldChange}
              onAddField={addField}
              onRemoveField={removeField}
              onThemeChange={handleThemeChange}
              onDocumentTypeChange={handleDocumentTypeChange}
              onReset={handleReset}
              onImportDataset={handleDatasetImport}
              importSummary={importSummary}
              importError={importError}
              isImportingDataset={isImportingDataset}
              canExport={canExport}
              onExportDocuments={handleExportDocuments}
              isExportingDocuments={isExporting}
              exportError={exportError}
              isAuthenticated={isAuthenticated}
              onSaveDesign={handleSaveDesign}
            />
          </div>
        </section>
      </div>

      {/* Save Design Modal */}
      <SaveDesignModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveSubmit}
      />

      {/* Save Status Toast */}
      {savingStatus && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-hover rounded-2xl border-2 border-emerald-700 bg-emerald-100 px-6 py-3 text-sm font-bold text-emerald-800 shadow-cartoon">
          {savingStatus}
        </div>
      )}
    </div>
  );
}
