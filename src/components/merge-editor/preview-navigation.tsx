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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-black bg-white p-4 shadow-cartoon-sm">
      {/* Toggle Preview Mode */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePreview}
          disabled={!hasData}
          className={`relative flex items-center gap-2 rounded-xl border-2 px-4 py-2 font-heading text-sm font-bold transition-all ${
            isPreviewMode
              ? "border-mint-gelato bg-mint-gelato text-emerald-800 shadow-cartoon-sm"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-bubble-blue hover:text-bubble-blue"
          } ${!hasData ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isPreviewMode ? (
            <>
              <Eye className="h-4 w-4" />
              Preview Mode
            </>
          ) : (
            <>
              <FileEdit className="h-4 w-4" />
              Template Mode
            </>
          )}
        </button>
        
        {!hasData && (
          <p className="text-xs font-medium text-slate-400">
            Import data to preview
          </p>
        )}
      </div>

      {/* Record Navigation */}
      {isPreviewMode && hasData && totalRecords > 0 && (
        <div className="flex items-center gap-2">
          {/* First */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFirst}
            disabled={!canGoPrev}
            className="h-8 w-8 p-0"
            aria-label="First record"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="h-8 w-8 p-0"
            aria-label="Previous record"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Record Counter */}
          <div className="flex items-center gap-1 rounded-lg border-2 border-slate-200 bg-slate-50 px-3 py-1">
            <span className="font-heading text-sm font-bold text-bubble-blue">
              {currentRecord + 1}
            </span>
            <span className="text-sm text-slate-400">/</span>
            <span className="font-heading text-sm font-bold text-soft-graphite">
              {totalRecords}
            </span>
          </div>

          {/* Next */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
            className="h-8 w-8 p-0"
            aria-label="Next record"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLast}
            disabled={!canGoNext}
            className="h-8 w-8 p-0"
            aria-label="Last record"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {isPreviewMode && hasData && (
        <p className="hidden text-xs text-slate-400 lg:block">
          <kbd className="rounded border border-slate-200 bg-slate-100 px-1 font-mono">Alt</kbd>
          {" + "}
          <kbd className="rounded border border-slate-200 bg-slate-100 px-1 font-mono">←</kbd>
          <kbd className="rounded border border-slate-200 bg-slate-100 px-1 font-mono">→</kbd>
          {" to navigate"}
        </p>
      )}
    </div>
  );
}

