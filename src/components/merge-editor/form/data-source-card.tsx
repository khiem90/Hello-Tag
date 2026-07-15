"use client";

import { ChangeEvent, useMemo, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
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
    label: "✓ Perfect Match",
    pill: "border border-green bg-green text-white-ink",
    text: "text-ink",
  },
  "needs-layers": {
    label: "! Needs Fields",
    pill: "border border-ink bg-yellow text-ink",
    text: "text-ink",
  },
  "unused-layers": {
    label: "＋ Extra Fields",
    pill: "border border-ink bg-cream text-ink",
    text: "text-ink",
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
    <section className="p-5">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <p className="pn-eyebrow text-ink">02 — Data source</p>
        <p className="pn-hand -rotate-2 text-muted-ink">design once, print many</p>
      </div>

      <div className="flex flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleDatasetChange}
        />

        {/* Drop-zone style import trigger */}
        <button
          type="button"
          onClick={handleDatasetButton}
          disabled={isImportingDataset}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-none border border-dashed border-ink bg-cream px-4 py-5 text-center transition-colors duration-[160ms] hover:bg-sage/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Image
            src="/press-notes/running-forms.svg"
            alt=""
            width={120}
            height={40}
          />
          <span className="pn-eyebrow text-ink">
            {isImportingDataset ? "Reading file…" : "Upload CSV / XLSX"}
          </span>
          <span className="pn-annotation text-muted-ink">
            Recipient columns become merge fields
          </span>
        </button>

        <Button
          onClick={onOpenPrintPreview}
          disabled={!canPrint}
          variant="primary"
          size="sm"
          className="gap-2 self-start"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          {printButtonLabel}
        </Button>

        {importError && (
          <div
            className="rounded-none border border-ink bg-yellow/50 p-3"
            role="alert"
          >
            <p className="pn-annotation text-ink">Import error</p>
            <p className="mt-1 text-sm text-ink">{importError}</p>
          </div>
        )}

        {importSummary && (
          <div className="mt-1 border border-ink bg-cream">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink px-4 py-3">
              <div>
                <p className="pn-eyebrow text-ink">{importSummary.fileName}</p>
                {importTimestamp && (
                  <p className="pn-annotation mt-1 text-muted-ink">
                    Imported {importTimestamp}
                  </p>
                )}
              </div>
              {importStatus && (
                <span
                  className={`pn-annotation px-2.5 py-1 ${importStatus.pill}`}
                >
                  {importStatus.label}
                </span>
              )}
            </div>

            {importDescription && (
              <p className="border-b border-ink px-4 py-3 text-sm text-muted-ink">
                {importDescription}
              </p>
            )}

            {/* Connected-sheet stats */}
            <div className="grid grid-cols-3 divide-x divide-ink text-center">
              <div className="px-2 py-3">
                <div className="pn-annotation text-muted-ink">Columns</div>
                <div className="font-display text-lg text-ink">
                  {importSummary.headerCount}
                </div>
              </div>
              <div className="px-2 py-3">
                <div className="pn-annotation text-muted-ink">Fields</div>
                <div className="font-display text-lg text-ink">
                  {importSummary.layerCount}
                </div>
              </div>
              <div className="px-2 py-3">
                <div className="pn-annotation text-muted-ink">Records</div>
                <div className="font-display text-lg text-ink">
                  {importSummary.rowCount}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
