"use client";

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
} from "@/lib/tag-storage";
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
  const layerCount = tag.fields.length;
  const datasetRowCount = datasetRows.length;
  const canExport = datasetRowCount > 0;

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
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,380px)] lg:items-start">
          <div className="order-1 lg:order-none">
            <NameTagCanvas
              tag={tag}
              activeField={activeField}
              onSelectField={selectField}
              onFieldPositionChange={(id, position) =>
                updateField(id, position)
              }
            />
          </div>

          <div className="order-2 lg:order-none">
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
            />
          </div>
        </section>
      </div>
    </main>
  );
}
