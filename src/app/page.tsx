"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NameTagCanvas } from "@/components/name-tag/name-tag-canvas";
import { NameTagForm } from "@/components/name-tag/name-tag-form";
import {
  clampPercent,
  createBlankField,
  createDefaultTag,
} from "@/lib/name-tag";
import {
  clearStoredTag,
  loadStoredTag,
  persistTag,
  saveDesignToFirebase,
} from "@/lib/tag-storage";
import { SaveDesignModal } from "@/components/ui/save-design-modal";
import { SavedDesignsList } from "@/components/ui/saved-designs-list";
import {
  readDataset,
  type DatasetRow,
} from "@/lib/dataset";
import {
  buildDocumentFromLabels,
  buildLabelSvg,
  svgToPngArrayBuffer,
} from "@/lib/export";
import { NameTagData, NameTagField } from "@/types/name-tag";
import type { ExportFormat, ImportSummary } from "@/types/import";
import { useAuth } from "@/components/layout/auth-provider";

const resolveImportStatus = (
  headerCount: number,
  layerCount: number,
): ImportSummary["status"] => {
  if (headerCount === layerCount) {
    return "match";
  }
  return headerCount > layerCount ? "needs-layers" : "unused-layers";
};

const mapFieldsToRow = (
  fields: NameTagField[],
  row: DatasetRow,
): NameTagField[] =>
  fields.map((field) => {
    const value = row[field.name];
    if (typeof value !== "string" || value.length === 0) {
      return field;
    }
    return {
      ...field,
      text: value,
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
  fields: NameTagField[],
  headers: string[],
): {
  fields: NameTagField[];
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
      return `Layer ${index + 1}`;
    }
    const trimmed = header.trim();
    return trimmed.length ? trimmed : `Layer ${index + 1}`;
  });

  const nextFields: NameTagField[] = normalized.map(
    (label, index) => {
      const existing = fields[index];
      if (existing) {
        return {
          ...existing,
          name: label,
          text: label,
        };
      }
      const placeholder = createBlankField(label);
      return {
        ...placeholder,
        name: label,
        text: label,
      };
    },
  );

  return {
    fields: nextFields,
    activeId: nextFields[0]?.id ?? "",
  };
};

export default function Home() {
  const { isAuthenticated, firstName, email, logout } = useAuth();
  const initialTag = useMemo(() => createDefaultTag(), []);
  const [tag, setTag] = useState<NameTagData>(initialTag);
  const [activeField, setActiveField] = useState<string>(
    initialTag.fields[0]?.id ?? "",
  );
  const [hasLoadedStoredTag, setHasLoadedStoredTag] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImportingDataset, setIsImportingDataset] = useState(false);
  const [datasetRows, setDatasetRows] = useState<DatasetRow[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("docx");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);
  const layerCount = tag.fields.length;
  const datasetRowCount = datasetRows.length;
  const canExport = datasetRowCount > 0;
  const greeting =
    firstName ??
    (email ? email.split("@")[0] : null);
  const handleLogout = () => {
    void logout().catch((error) => {
      console.error("Failed to log out", error);
    });
  };

  useEffect(() => {
    const storedTag = loadStoredTag();
    if (storedTag) {
      setTag(storedTag);
      setActiveField(storedTag.fields[0]?.id ?? "");
    }
    setHasLoadedStoredTag(true);
  }, []);

  const selectField = (id: string) => {
    setActiveField(id);
  };

  const updateField = (id: string, patch: Partial<NameTagField>) => {
    setTag((prev) => ({
      ...prev,
      fields: prev.fields.map((field) => {
        if (field.id !== id) {
          return field;
        }
        const next: NameTagField = {
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
  };

  const addField = () => {
    setTag((prev) => {
      const newField = createBlankField(`Layer ${prev.fields.length + 1}`);
      setActiveField(newField.id);
      return {
        ...prev,
        fields: [...prev.fields, newField],
      };
    });
  };

  const removeField = (id: string) => {
    setTag((prev) => {
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
  };

  const handleThemeChange = (
    update: Partial<
      Pick<NameTagData, "accent" | "background" | "textAlign" | "customBackground">
    >,
  ) => {
    setTag((prev) => ({ ...prev, ...update }));
  };

  const handleReset = () => {
    const defaults = createDefaultTag();
    setTag(defaults);
    setActiveField(defaults.fields[0]?.id ?? "");
    clearStoredTag();
  };

  const syncLayersToHeaders = (headers: string[]) => {
    if (!headers.length) {
      return;
    }

    let nextActiveId = "";
    setTag((prev) => {
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
        syncLayersToHeaders(dataset.headers);
      }
      const resultingLayerCount =
        headerCount > 0 ? headerCount : layerCount;
      setImportSummary({
        fileName: file.name,
        headers: dataset.headers,
        headerCount,
        layerCount: resultingLayerCount,
        rowCount,
        status: resolveImportStatus(
          headerCount,
          resultingLayerCount,
        ),
        importedAt: new Date().toISOString(),
      });
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
      await saveDesignToFirebase(name, tag, description);
      setSavingStatus("Design saved successfully!");
      setTimeout(() => setSavingStatus(null), 3000);
    } catch (error) {
      console.error("Failed to save design", error);
      throw error; // Let the modal handle the error
    }
  };

  const handleLoadDesign = (design: NameTagData) => {
    setTag(design);
    setActiveField(design.fields[0]?.id ?? "");
    setSavingStatus("Design loaded successfully!");
    setTimeout(() => setSavingStatus(null), 3000);
  };

  const handleExportLabels = async () => {
    if (!datasetRows.length) {
      setExportError("Upload a CSV or Excel file before exporting.");
      return;
    }
    setIsExporting(true);
    setExportError(null);
    try {
      const labelBuffers: ArrayBuffer[] = [];
      const labelsData: NameTagField[][] = [];
      for (const row of datasetRows) {
        const rowFields = mapFieldsToRow(tag.fields, row);
        labelsData.push(rowFields);
        const svg = buildLabelSvg(tag, rowFields);
        const buffer = await svgToPngArrayBuffer(svg);
        labelBuffers.push(buffer);
      }
      if (!labelBuffers.length) {
        throw new Error("No rows were detected in the imported file.");
      }
      const docBlob = await buildDocumentFromLabels(
        exportFormat,
        labelBuffers,
        tag,
        labelsData,
      );
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-");
      triggerDownload(
        docBlob,
        `name-tags-${timestamp}.${exportFormat}`,
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

  useEffect(() => {
    setImportSummary((previous) => {
      if (!previous) {
        return previous;
      }
      if (previous.layerCount === layerCount) {
        return previous;
      }
      return {
        ...previous,
        layerCount,
        status: resolveImportStatus(previous.headerCount, layerCount),
      };
    });
  }, [layerCount]);

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
    if (!hasLoadedStoredTag) {
      return;
    }
    const handle = window.setTimeout(() => {
      persistTag(tag);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [tag, hasLoadedStoredTag]);

  return (
    <main className="min-h-screen bg-slate-100/60 px-4 py-12 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {isAuthenticated ? (
          <div className="flex justify-end">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow">
              <span>Hello, {greeting ?? "Creator"}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
                aria-label="Log out"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  focusable="false"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
        <header className="space-y-4 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Custom label studio
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Build name tag labels you can drag, edit, and print.
          </h1>
          <p className="text-base text-slate-600 sm:max-w-3xl">
            Fill out the fields, then drag each text block inside the preview
            window. Every change updates instantly so you can explore layouts
            and color combinations without leaving the browser.
          </p>
          {!isAuthenticated ? (
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              <Link
                href="/login"
                className="inline-flex items-center rounded-full border border-slate-900 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-900 transition hover:bg-slate-900 hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full border border-transparent bg-slate-900 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
              >
                Create account
              </Link>
            </div>
          ) : null}
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,380px)] lg:items-start">
          <div className="order-1 lg:order-0">
            <NameTagCanvas
              tag={tag}
              activeField={activeField}
              onSelectField={selectField}
              onFieldPositionChange={(id, position) =>
                updateField(id, position)
              }
            />
          </div>

          <div className="order-2 lg:order-0">
            <NameTagForm
              tag={tag}
              activeFieldId={activeField}
              onSelectField={selectField}
              onFieldChange={(id, patch) => {
                selectField(id);
                updateField(id, patch);
              }}
              onAddField={addField}
              onRemoveField={removeField}
              onThemeChange={handleThemeChange}
              onReset={handleReset}
              onImportDataset={handleDatasetImport}
              importSummary={importSummary}
              importError={importError}
              isImportingDataset={isImportingDataset}
              canExport={canExport}
              onExportLabels={handleExportLabels}
              isExportingLabels={isExporting}
              exportError={exportError}
              exportFormat={exportFormat}
              onExportFormatChange={setExportFormat}
              isAuthenticated={isAuthenticated}
              onSaveDesign={handleSaveDesign}
            />
            
            {/* Saved Designs List */}
            <div className="mt-6">
              <SavedDesignsList
                isAuthenticated={isAuthenticated}
                onLoadDesign={handleLoadDesign}
              />
            </div>
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
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-50 px-6 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {savingStatus}
        </div>
      )}
    </main>
  );
}
