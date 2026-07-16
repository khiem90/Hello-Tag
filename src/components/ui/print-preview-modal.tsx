"use client";

import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { alignToClass, getBackgroundStyle, resolveFieldText } from "@/lib/document";
import { getDocumentTypeConfig, getAspectRatio } from "@/lib/document-types";
import { documentTypeBadges } from "@/components/cards/specimen-frame";
import type { DocumentData, MergeField } from "@/types/document";
import type { DatasetRow } from "@/lib/dataset";

type PrintPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  documentData: DocumentData;
  datasetRows: DatasetRow[];
};

type MergedDocument = {
  index: number;
  fields: MergeField[];
};

const LabelCard = ({
  document,
  fields,
}: {
  document: DocumentData;
  fields: MergeField[];
}) => (
  <div
    className="relative w-full overflow-hidden rounded-none border border-ink/10 print:border-ink/20"
    style={{
      ...getBackgroundStyle(document),
      aspectRatio: getAspectRatio(document.documentType),
    }}
  >
    <div className="absolute inset-0 p-2 sm:p-4 print:p-3">
      {fields
        .filter((field) => field.visible)
        .map((field) => (
          <div
            key={field.id}
            className={`absolute ${alignToClass[document.textAlign]}`}
            style={{
              left: `${field.x}%`,
              top: `${field.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `clamp(8px, ${field.fontSize * 0.5}px, ${field.fontSize}px)`,
              color: field.color,
              fontWeight: 600,
              lineHeight: 1.2,
              maxWidth: "90%",
              wordBreak: "break-word",
            }}
          >
            {field.text}
          </div>
        ))}
    </div>
  </div>
);

export function PrintPreviewModal({
  isOpen,
  onClose,
  documentData,
  datasetRows,
}: PrintPreviewModalProps) {
  const config = getDocumentTypeConfig(documentData.documentType);
  const labelsPerRow = config.dimensions.labelsPerRow ?? 1;
  const rowsPerPage = config.dimensions.rowsPerPage ?? 1;
  const labelsPerPage = config.dimensions.labelsPerPage ?? 1;

  const pages = useMemo(() => {
    const merged: MergedDocument[] = datasetRows.map((row, index) => ({
      index,
      fields: documentData.fields.map((field) => ({
        ...field,
        text: resolveFieldText(field.text, row),
      })),
    }));
    const result: MergedDocument[][] = [];
    for (let i = 0; i < merged.length; i += labelsPerPage) {
      result.push(merged.slice(i, i + labelsPerPage));
    }
    return result;
  }, [documentData.fields, datasetRows, labelsPerPage]);

  const documentCount = datasetRows.length;

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    document.body.classList.add("print-preview-active");
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.classList.remove("print-preview-active");
    };
  }, [isOpen, onClose]);

  // isOpen only turns true from client interaction, so document is available
  // by the time the portal renders; the guard covers SSR just in case.
  if (!isOpen || typeof document === "undefined") return null;

  const typeLabel = documentTypeBadges[documentData.documentType].label.toLowerCase();

  const modalContent = (
    <div
      id="print-preview-root"
      className="print-preview-modal fixed inset-0 z-[9999] flex flex-col bg-ink/95"
    >
      {/* Header - hidden when printing */}
      <header className="no-print flex items-center justify-between gap-4 border-b border-white-ink/20 bg-ink px-4 py-3 sm:px-6">
        <div>
          <p className="pn-eyebrow text-white-ink/60">Approved for print</p>
          <h2 className="font-display text-lg tracking-[-0.02em] text-white-ink sm:text-xl">
            Print preview
          </h2>
          <p className="pn-annotation mt-1 text-white-ink/60">
            {documentCount} {typeLabel}
            {documentCount !== 1 ? "s" : ""} · {pages.length} page
            {pages.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.print()}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-none border border-white-ink/40 text-white-ink/70 transition-colors duration-[160ms] hover:border-white-ink hover:text-white-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-white-ink"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Print content area */}
      <div className="print-content flex-1 overflow-auto p-4 sm:p-8">
        <div className="relative mx-auto max-w-4xl">
          {/* Approval stamp - screen only */}
          {documentCount > 0 && (
            <Image
              src="/press-notes/oval-stamp.svg"
              alt=""
              width={100}
              height={62}
              className="no-print pointer-events-none absolute -top-4 right-2 z-10 animate-stamp-in"
            />
          )}

          {pages.map((pageDocuments, pageIndex) => (
            <div
              key={pageIndex}
              className="print-page mb-8 rounded-none border border-ink bg-white p-6 shadow-paper print:border-0"
            >
              {/* Page number - screen only */}
              <div className="no-print pn-eyebrow mb-4 text-center text-muted-ink">
                Page {pageIndex + 1} of {pages.length}
              </div>

              {/* Labels grid */}
              <div
                className="labels-grid grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${labelsPerRow}, 1fr)`,
                  gridTemplateRows: `repeat(${rowsPerPage}, 1fr)`,
                }}
              >
                {Array.from({ length: labelsPerPage }).map((_, slotIndex) => {
                  const doc = pageDocuments[slotIndex];
                  return doc ? (
                    <LabelCard
                      key={doc.index}
                      document={documentData}
                      fields={doc.fields}
                    />
                  ) : (
                    // Empty placeholder for unfilled slots
                    <div
                      key={`empty-${slotIndex}`}
                      className="label-placeholder rounded-none border border-dashed border-ink/20"
                      style={{ aspectRatio: getAspectRatio(documentData.documentType) }}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {documentCount === 0 && (
            <div className="rounded-none border border-ink bg-cream p-12 text-center">
              <p className="pn-eyebrow text-muted-ink">
                No data to preview — import a CSV or Excel file first
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer hint - hidden when printing */}
      <footer className="no-print pn-annotation border-t border-white-ink/20 bg-ink px-4 py-2 text-center text-white-ink/50">
        Press <kbd className="border border-white-ink/40 px-1.5 py-0.5 font-mono text-xs">Ctrl+P</kbd> to print
        or <kbd className="border border-white-ink/40 px-1.5 py-0.5 font-mono text-xs">Esc</kbd> to close
      </footer>
    </div>
  );

  // Render via portal directly to body
  return createPortal(modalContent, document.body);
}
