"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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
    "pn-noise relative rounded-none border border-ink bg-cream p-6 shadow-paper transition-all duration-300",
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
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-ink pb-4">
          <div>
            <p className={previewMode ? "pn-annotation text-pink" : "pn-eyebrow text-muted-ink"}>
              {previewMode ? "Preview mode" : "The working file"}
            </p>
            <h2 className="pn-display-m mt-1 text-ink">
              {documentTypeLabel} sheet
            </h2>
            <p className="pn-eyebrow mt-2 text-muted-ink">
              {previewMode ? "Viewing merged data" : "Drag fields to reposition"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {previewMode && (
              <span className="pn-annotation inline-flex items-center gap-1 border border-green px-2.5 py-1 text-green">
                ● Live data
              </span>
            )}
            <span className="pn-eyebrow inline-flex items-center border border-ink bg-cream px-3 py-1 text-ink">
              {visibleFields.length} field{visibleFields.length === 1 ? "" : "s"}
            </span>
          </div>
        </header>

        <div className="flex items-center justify-center border border-ink bg-sage p-5 sm:p-8">
          <div
            ref={cardRef}
            className="relative w-full max-w-md overflow-hidden rounded-none border border-ink shadow-paper-sm"
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
                <div className="flex h-full flex-col items-center justify-center gap-3 border border-dashed border-ink bg-cream p-6 text-center">
                  <Image
                    src="/press-notes/mascot-production-runner.png"
                    alt="Mail Buddy mascot running with a stack of freshly printed labels"
                    width={110}
                    height={165}
                  />
                  <p className="pn-hand -rotate-2 text-ink">
                    nothing on the press yet!
                  </p>
                  <p className="pn-eyebrow text-muted-ink">
                    Add a field to start setting type
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info about the preview */}
        <p className="pn-annotation mt-4 text-center text-muted-ink">
          {previewMode
            ? "Showing how the merged document will appear"
            : "Preview matches Word document export format"}
        </p>
      </section>
    </>
  );
}
