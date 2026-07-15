"use client";

import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileEdit,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

type PreviewNavigationProps = {
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  currentRecord: number;
  totalRecords: number;
  onRecordChange: (index: number) => void;
  hasData: boolean;
};

const padRecord = (value: number) => String(value).padStart(3, "0");

export function PreviewNavigation({
  isPreviewMode,
  onTogglePreview,
  currentRecord,
  totalRecords,
  onRecordChange,
  hasData,
}: PreviewNavigationProps) {
  const canGoPrev = currentRecord > 0;
  const canGoNext = currentRecord < totalRecords - 1;

  const handlePrev = useCallback(() => {
    if (canGoPrev) {
      onRecordChange(currentRecord - 1);
    }
  }, [canGoPrev, currentRecord, onRecordChange]);

  const handleNext = useCallback(() => {
    if (canGoNext) {
      onRecordChange(currentRecord + 1);
    }
  }, [canGoNext, currentRecord, onRecordChange]);

  const handleFirst = useCallback(() => {
    onRecordChange(0);
  }, [onRecordChange]);

  const handleLast = useCallback(() => {
    onRecordChange(totalRecords - 1);
  }, [onRecordChange, totalRecords]);

  // Keyboard navigation
  useEffect(() => {
    if (!isPreviewMode || !hasData) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && event.ctrlKey) {
        event.preventDefault();
        handleFirst();
      } else if (event.key === "ArrowRight" && event.ctrlKey) {
        event.preventDefault();
        handleLast();
      } else if (event.key === "[" || (event.key === "ArrowLeft" && event.altKey)) {
        event.preventDefault();
        handlePrev();
      } else if (event.key === "]" || (event.key === "ArrowRight" && event.altKey)) {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewMode, hasData, handlePrev, handleNext, handleFirst, handleLast]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-none border border-ink bg-cream px-4 py-3 shadow-paper-sm">
      {/* Toggle Preview Mode */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onTogglePreview}
          disabled={!hasData}
          variant={isPreviewMode ? "accent" : "secondary"}
          size="sm"
          className="gap-2"
          aria-pressed={isPreviewMode}
        >
          {isPreviewMode ? (
            <>
              <Eye className="h-4 w-4" aria-hidden="true" />
              Preview mode
            </>
          ) : (
            <>
              <FileEdit className="h-4 w-4" aria-hidden="true" />
              Template mode
            </>
          )}
        </Button>

        {!hasData && (
          <p className="pn-annotation text-muted-ink">
            Import data to preview
          </p>
        )}
      </div>

      {/* Record Navigation — connected-sheet rail */}
      {isPreviewMode && hasData && totalRecords > 0 && (
        <div className="flex items-center gap-2">
          {/* First */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleFirst}
            disabled={!canGoPrev}
            aria-label="First record"
          >
            <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* Previous */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="Previous record"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* Record Counter */}
          <div className="pn-eyebrow flex items-center gap-1 border border-ink bg-cream px-3 py-[11px] text-ink">
            <span>Record</span>
            <span className="bg-pink/20 px-1 text-ink">{padRecord(currentRecord + 1)}</span>
            <span className="text-muted-ink">/</span>
            <span>{padRecord(totalRecords)}</span>
          </div>

          {/* Next */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Next record"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* Last */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleLast}
            disabled={!canGoNext}
            aria-label="Last record"
          >
            <ChevronsRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {isPreviewMode && hasData && (
        <p className="pn-annotation hidden text-muted-ink lg:block">
          <kbd className="border border-ink bg-cream px-1 font-mono text-[0.65rem]">Alt</kbd>
          {" + "}
          <kbd className="border border-ink bg-cream px-1 font-mono text-[0.65rem]">←</kbd>
          <kbd className="border border-ink bg-cream px-1 font-mono text-[0.65rem]">→</kbd>
          {" to navigate"}
        </p>
      )}
    </div>
  );
}
