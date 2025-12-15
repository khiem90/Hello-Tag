"use client";

import { ChangeEvent, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Eye, FileSpreadsheet } from "lucide-react";
import type { ImportSummary } from "@/types/import";

type DataSourceCardProps = {
  onImportDataset: (file: File) => void;
  importSummary: ImportSummary | null;
  importError: string | null;
  isImportingDataset: boolean;
  canPrint: boolean;
  onOpenPrintPreview: () => void;
};

const importStatusTokens: Record<
  ImportSummary["status"],
  {
    label: string;
    pill: string;
    text: string;
  }
> = {
  match: {
    label: "Perfect Match",
    pill: "border border-sage/30 bg-sage-light text-ink",
    text: "text-ink",
  },
  "needs-layers": {
    label: "Needs Fields",
    pill: "border border-amber-200 bg-amber-50 text-amber-700",
    text: "text-amber-700",
  },
  "unused-layers": {
    label: "Extra Fields",
    pill: "border border-sky-200 bg-sky-50 text-sky-700",
    text: "text-sky-700",
  },
};

const describeImportSummary = (summary: ImportSummary) => {
  const { headerCount, layerCount } = summary;
  if (headerCount === layerCount) {
    return "Each column in your data maps to a merge field.";
  }
  if (headerCount > layerCount) {
    const difference = headerCount - layerCount;
    return `The file has ${headerCount} columns but only ${layerCount} fields. Add ${difference} more field${difference > 1 ? "s" : ""} to use all data.`;
  }
  const difference = layerCount - headerCount;
  return `Your document has ${layerCount} fields but the file only contains ${headerCount} columns. Remove ${difference} field${difference > 1 ? "s" : ""} or add more data columns.`;
};

export function DataSourceCard({
  onImportDataset,
  importSummary,
  importError,
  isImportingDataset,
  canPrint,
  onOpenPrintPreview,
}: DataSourceCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDatasetButton = () => {
    fileInputRef.current?.click();
  };

  const handleDatasetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportDataset(file);
    }
    event.target.value = "";
  };

  const importDescription = useMemo(() => {
    if (!importSummary) {
      return "";
    }
    return describeImportSummary(importSummary);
  }, [importSummary]);

  const importStatus = importSummary
    ? importStatusTokens[importSummary.status]
    : null;

  const importTimestamp = useMemo(() => {
    if (!importSummary) {
      return "";
    }
    const timestamp = new Date(importSummary.importedAt);
    if (Number.isNaN(timestamp.getTime())) {
      return "";
    }
    return timestamp.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [importSummary]);

  const printButtonLabel = importSummary?.rowCount
    ? `Preview & Print (${importSummary.rowCount})`
    : "Preview & Print";

  return (
    <Card variant="elevated" className="bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage/10 text-sage">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <CardTitle>Data Source</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-ink-light">
          Upload CSV or Excel files with your recipient data.
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleDatasetChange}
            />
            <Button
              onClick={handleDatasetButton}
              disabled={isImportingDataset}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isImportingDataset ? "Reading..." : "Upload File"}
            </Button>

            <Button
              onClick={onOpenPrintPreview}
              disabled={!canPrint}
              variant="primary"
              size="sm"
              className="gap-2 ml-auto sm:ml-0"
            >
              <Eye className="h-4 w-4" />
              {printButtonLabel}
            </Button>
          </div>

          {importError && (
            <div
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {importError}
            </div>
          )}

          {importSummary && (
            <div className="mt-2 space-y-3 rounded-xl border border-ink/5 bg-stone/30 p-4">
              <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                <div>
                  <p className="font-medium text-sm text-ink">
                    {importSummary.fileName}
                  </p>
                  {importTimestamp && (
                    <p className="text-xs text-ink-light">{importTimestamp}</p>
                  )}
                </div>
                {importStatus && (
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${importStatus.pill}`}
                  >
                    {importStatus.label}
                  </span>
                )}
              </div>

              {importDescription && (
                <p className="text-sm text-ink-light">{importDescription}</p>
              )}

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-white p-2">
                  <div className="text-xs text-ink-light">Columns</div>
                  <div className="font-heading text-lg text-ink">
                    {importSummary.headerCount}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-2">
                  <div className="text-xs text-ink-light">Fields</div>
                  <div className="font-heading text-lg text-ink">
                    {importSummary.layerCount}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-2">
                  <div className="text-xs text-ink-light">Records</div>
                  <div className="font-heading text-lg text-ink">
                    {importSummary.rowCount}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

