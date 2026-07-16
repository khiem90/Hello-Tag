"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { alignToClass, getBackgroundStyle, resolveFieldText } from "@/lib/document";
import { getAspectRatio, getDocumentTypeConfig } from "@/lib/document-types";
import { DocumentData, MergeField } from "@/types/document";
import { FloatingField } from "./floating-field";

type DocumentCanvasProps = {
  document: DocumentData;
  activeField: string;
  previewMode?: boolean;
  previewData?: Record<string, string>;
  /** Annotation layer toggle — pink field-name notes on every field */
  notesVisible?: boolean;
  onSelectField: (key: string) => void;
  onFieldPositionChange: (
    key: string,
    position: Pick<MergeField, "x" | "y">
  ) => void;
};

export function DocumentCanvas({
  document,
  activeField,
  previewMode = false,
  previewData,
  notesVisible = false,
  onSelectField,
  onFieldPositionChange,
}: DocumentCanvasProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const visibleFields = document.fields.filter((field) => field.visible);
  const config = getDocumentTypeConfig(document.documentType);

  // The sheet sits alone on the sage board; size it by orientation so tall
  // formats (letter) don't blow the studio height out.
  const maxWidth =
    document.documentType === "letter"
      ? 380
      : config.dimensions.orientation === "portrait"
        ? 460
        : 620;

  const handleDragStart = useCallback((id: string) => setDraggingId(id), []);
  const handleDragEnd = useCallback(() => setDraggingId(null), []);

  return (
    <div
      ref={cardRef}
      className="relative w-full overflow-visible border border-ink shadow-paper"
      style={{
        ...getBackgroundStyle(document),
        aspectRatio: getAspectRatio(document.documentType),
        maxWidth: `${maxWidth}px`,
      }}
    >
      {/* Content area with padding */}
      <div className="absolute inset-0 overflow-hidden p-4">
        {visibleFields.map((field) => (
          <FloatingField
            key={field.id}
            field={field}
            displayText={
              previewMode ? resolveFieldText(field.text, previewData) : field.text
            }
            alignClass={alignToClass[document.textAlign]}
            isActive={activeField === field.id}
            isInteractionDisabled={
              previewMode || (draggingId !== null && draggingId !== field.id)
            }
            showNote={notesVisible}
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
  );
}
