"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { backgroundThemes } from "@/lib/name-tag";
import { getAspectRatio } from "@/lib/document-types";
import { DocumentData, MergeField } from "@/types/document";
import { FloatingField } from "./floating-field";

type DocumentCanvasProps = {
  document: DocumentData;
  activeField: string;
  previewMode?: boolean;
  previewData?: Record<string, string>;
  onSelectField: (key: string) => void;
  onFieldPositionChange: (
    key: string,
    position: Pick<MergeField, "x" | "y">
  ) => void;
};

const alignToClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

// Replace {{FieldName}} placeholders with actual values
// Use [^}]+ to match any characters including spaces inside the braces
const resolveFieldText = (
  text: string,
  previewData?: Record<string, string>
): string => {
  if (!previewData) return text;

  return text.replace(/\{\{([^}]+)\}\}/g, (match, fieldName) => {
    const trimmedName = fieldName.trim();
    const value = previewData[trimmedName];
    return value !== undefined ? value : match;
  });
};

export function DocumentCanvas({
  document,
  activeField,
  previewMode = false,
  previewData,
  onSelectField,
  onFieldPositionChange,
}: DocumentCanvasProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    width: 0,
    height: 0,
    left: 0,
  });

  const theme =
    document.background === "custom"
      ? null
      : backgroundThemes[document.background];

  const visibleFields = document.fields.filter((field) => field.visible);
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

  useEffect(() => {
    const handleScroll = () => {
      if (!placeholderRef.current) {
        setIsFloating(false);
        return;
      }
      const { top } = placeholderRef.current.getBoundingClientRect();
      setIsFloating(top < 16);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateMetrics = () => {
      const node = sectionRef.current;
      if (!node) {
        return;
      }
      const rect = node.getBoundingClientRect();
      setMetrics({
        width: rect.width,
        height: rect.height,
        left: rect.left,
      });
    };
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateMetrics)
        : null;
    if (observer && sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      window.removeEventListener("resize", updateMetrics);
      observer?.disconnect();
    };
  }, []);

  const floatingStyles =
    isFloating && metrics.width
      ? {
          position: "fixed" as const,
          top: "5rem",
          left: metrics.left,
          width: metrics.width,
          zIndex: 30,
        }
      : undefined;

  const containerClasses = [
    "rounded-xl border border-ink/5 bg-white p-6 shadow-soft transition-all duration-300",
    isFloating ? "z-30" : "sticky top-24 self-start",
  ].join(" ");

  const handleDragStart = useCallback((id: string) => {
    setDraggingId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
  }, []);

  const documentTypeLabel = {
    letter: "Letter",
    certificate: "Certificate",
    label: "Label",
    envelope: "Envelope",
  }[document.documentType];

  return (
    <>
      <div
        ref={placeholderRef}
        style={{ height: isFloating ? metrics.height : 0 }}
        aria-hidden
      />
      <section
        ref={(node) => {
          sectionRef.current = node;
        }}
        className={containerClasses}
        style={floatingStyles}
      >
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-terracotta tracking-wide">
              {previewMode ? "Preview Mode" : "Template Editor"}
            </p>
            <h2 className="font-heading text-2xl tracking-tight text-ink">
              {documentTypeLabel} Preview
            </h2>
            <p className="text-sm text-ink-light">
              {previewMode
                ? "Viewing merged data"
                : "Drag fields to reposition"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {previewMode && (
              <span className="inline-flex items-center rounded-md border border-sage/30 bg-sage-light px-2.5 py-1 text-xs font-medium text-ink">
                Live Data
              </span>
            )}
            <span className="inline-flex items-center rounded-md border border-ink/10 bg-stone px-3 py-1 text-sm font-medium text-ink">
              {visibleFields.length} field{visibleFields.length === 1 ? "" : "s"}
            </span>
          </div>
        </header>

        <div className="flex items-center justify-center bg-stone/50 rounded-xl p-4 border border-ink/5">
          <div
            ref={cardRef}
            className="relative w-full max-w-md overflow-hidden rounded-lg border border-ink/10 shadow-soft"
            style={{
              ...cardBackgroundStyle,
              aspectRatio: aspectRatio,
            }}
          >
            {/* Content area with padding */}
            <div className="absolute inset-0 p-4">
              {visibleFields.map((field) => (
                <FloatingField
                  key={field.id}
                  field={field}
                  displayText={
                    previewMode
                      ? resolveFieldText(field.text, previewData)
                      : field.text
                  }
                  alignClass={alignToClass[document.textAlign]}
                  isActive={activeField === field.id}
                  isInteractionDisabled={
                    previewMode ||
                    (draggingId !== null && draggingId !== field.id)
                  }
                  onSelect={onSelectField}
                  onDrag={onFieldPositionChange}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  cardRef={cardRef}
                  previewMode={previewMode}
                />
              ))}

              {/* Empty state */}
              {visibleFields.length === 0 && (
                <div className="flex h-full items-center justify-center text-ink-light">
                  <p className="text-sm">No visible fields</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info about the preview */}
        <p className="mt-4 text-center text-xs text-ink-light">
          {previewMode
            ? "Showing how merged document will appear"
            : "Preview matches Word document export format"}
        </p>
      </section>
    </>
  );
}
