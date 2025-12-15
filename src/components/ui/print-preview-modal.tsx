"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { backgroundThemes } from "@/lib/name-tag";
import { getDocumentTypeConfig, getAspectRatio } from "@/lib/document-types";
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

const resolveFieldText = (
  text: string,
  rowData: DatasetRow
): string => {
  return text.replace(/\{\{([^}]+)\}\}/g, (match, fieldName) => {
    const trimmedName = fieldName.trim();
    const value = rowData[trimmedName];
    return value !== undefined ? value : match;
  });
};

const mapFieldsToRow = (
  fields: MergeField[],
  row: DatasetRow
): MergeField[] =>
  fields.map((field) => ({
    ...field,
    text: resolveFieldText(field.text, row),
  }));

const LabelCard = ({
  document,
  fields,
}: {
  document: DocumentData;
  fields: MergeField[];
}) => {
  const theme =
    document.background === "custom"
      ? null
      : backgroundThemes[document.background];

  const visibleFields = fields.filter((f) => f.visible);
  const aspectRatio = getAspectRatio(document.documentType);

  const cardBackgroundStyle =
    document.background === "custom"
      ? {
          backgroundColor: document.customBackground,
          backgroundImage: "none",
        }
      : {
          backgroundColor: "transparent",
          backgroundImage: theme?.gradient ?? "none",
        };

  const alignToClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  } as const;

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-ink/10 print:border-ink/20"
      style={{
        ...cardBackgroundStyle,
        aspectRatio: aspectRatio,
      }}
    >
      <div className="absolute inset-0 p-2 sm:p-4 print:p-3">
        {visibleFields.map((field) => (
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
};

export function PrintPreviewModal({
  isOpen,
  onClose,
  documentData,
  datasetRows,
}: PrintPreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  
  const config = getDocumentTypeConfig(documentData.documentType);
  const labelsPerRow = config.dimensions.labelsPerRow ?? 1;
  const rowsPerPage = config.dimensions.rowsPerPage ?? 1;
  const labelsPerPage = config.dimensions.labelsPerPage ?? 1;

  const mergedDocuments: MergedDocument[] = useMemo(() => {
    return datasetRows.map((row, index) => ({
      index,
      fields: mapFieldsToRow(documentData.fields, row),
    }));
  }, [documentData.fields, datasetRows]);

  // Group documents into pages
  const pages = useMemo(() => {
    const result: MergedDocument[][] = [];
    for (let i = 0; i < mergedDocuments.length; i += labelsPerPage) {
      result.push(mergedDocuments.slice(i, i + labelsPerPage));
    }
    return result;
  }, [mergedDocuments, labelsPerPage]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handlePrint();
      }
    },
    [onClose, handlePrint]
  );

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      document.body.classList.add("print-preview-active");
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.classList.remove("print-preview-active");
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !mounted) return null;

  const documentTypeLabel = {
    letter: "Letter",
    certificate: "Certificate",
    label: "Labels",
    envelope: "Envelope",
  }[documentData.documentType];

  const modalContent = (
    <div id="print-preview-root" className="print-preview-modal fixed inset-0 z-[9999] flex flex-col bg-ink/95">
      {/* Header - hidden when printing */}
      <header className="no-print flex items-center justify-between gap-4 border-b border-white/10 bg-ink px-4 py-3 sm:px-6">
        <div>
          <h2 className="font-heading text-lg text-white sm:text-xl">
            Print Preview
          </h2>
          <p className="text-sm text-white/60">
            {mergedDocuments.length} {documentTypeLabel.toLowerCase()}
            {mergedDocuments.length !== 1 ? "s" : ""} • {pages.length} page
            {pages.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePrint}
            variant="primary"
            size="sm"
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Print content area */}
      <div className="print-content flex-1 overflow-auto p-4 sm:p-8">
        <div className="mx-auto max-w-4xl">
          {pages.map((pageDocuments, pageIndex) => (
            <div
              key={pageIndex}
              className="print-page mb-8 rounded-xl bg-white p-6 shadow-soft-lg"
            >
              {/* Page number - screen only */}
              <div className="no-print mb-4 text-center text-sm text-ink-light">
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
                  if (doc) {
                    return (
                      <LabelCard
                        key={doc.index}
                        document={documentData}
                        fields={doc.fields}
                      />
                    );
                  }
                  // Empty placeholder for unfilled slots
                  return (
                    <div
                      key={`empty-${slotIndex}`}
                      className="label-placeholder rounded-lg border border-dashed border-ink/10"
                      style={{ aspectRatio: getAspectRatio(documentData.documentType) }}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {mergedDocuments.length === 0 && (
            <div className="rounded-xl bg-white p-12 text-center">
              <p className="text-lg text-ink-light">
                No data to preview. Import a CSV or Excel file first.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer hint - hidden when printing */}
      <footer className="no-print border-t border-white/10 bg-ink/50 px-4 py-2 text-center text-sm text-white/40">
        Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">Ctrl+P</kbd> to print
        or <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">Esc</kbd> to close
      </footer>
    </div>
  );

  // Render via portal directly to body
  return createPortal(modalContent, document.body);
}

