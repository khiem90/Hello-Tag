"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  DraggableCore,
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { clampPercent } from "@/lib/name-tag";
import { MergeField } from "@/types/document";
import { Move } from "lucide-react";

type FloatingFieldProps = {
  field: MergeField;
  displayText: string;
  alignClass: string;
  isActive: boolean;
  isInteractionDisabled?: boolean;
  previewMode?: boolean;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (id: string) => void;
  onDrag: (id: string, position: Pick<MergeField, "x" | "y">) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
};

export const FloatingField = memo(function FloatingField({
  field,
  displayText,
  alignClass,
  isActive,
  isInteractionDisabled,
  previewMode,
  cardRef,
  onSelect,
  onDrag,
  onDragStart,
  onDragEnd,
}: FloatingFieldProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Local position state for smooth visual updates during drag
  const [localPos, setLocalPos] = useState({ x: field.x, y: field.y });

  // Use a ref to keep track of the latest field data
  const fieldRef = useRef(field);
  // Keep track of local drag position
  const dragPositionRef = useRef({ x: field.x, y: field.y });

  useEffect(() => {
    fieldRef.current = field;
  });

  useEffect(
    () => () => {
      document.body.classList.remove("cursor-grabbing");
    },
    []
  );

  const handleUpdatePosition = useCallback(
    (newPos: Pick<MergeField, "x" | "y">) => {
      onDrag(fieldRef.current.id, newPos);
    },
    [onDrag]
  );

  const updatePosition = useCallback(
    (deltaX: number, deltaY: number) => {
      const root = cardRef.current;
      if (!root) {
        return;
      }
      const { width, height } = root.getBoundingClientRect();

      const newX = clampPercent(
        dragPositionRef.current.x + (deltaX / width) * 100
      );
      const newY = clampPercent(
        dragPositionRef.current.y + (deltaY / height) * 100
      );

      const newPos = { x: newX, y: newY };
      dragPositionRef.current = newPos;
      setLocalPos(newPos);

      handleUpdatePosition(newPos);
    },
    [cardRef, handleUpdatePosition]
  );

  const handleDrag = useCallback(
    (_event: DraggableEvent, data: DraggableData) => {
      updatePosition(data.deltaX, data.deltaY);
    },
    [updatePosition]
  );

  const handleStart = useCallback(() => {
    if (previewMode) return;
    setIsDragging(true);
    dragPositionRef.current = { x: field.x, y: field.y };
    setLocalPos({ x: field.x, y: field.y });
    const id = fieldRef.current.id;
    onSelect(id);
    onDragStart?.(id);
    document.body.classList.add("cursor-grabbing");
  }, [onSelect, onDragStart, field.x, field.y, previewMode]);

  const handleStop = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.();
    document.body.classList.remove("cursor-grabbing");
  }, [onDragEnd]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (previewMode) return;
    const steps = event.shiftKey ? 0.5 : 2;
    const map: Record<string, [number, number]> = {
      ArrowUp: [0, -steps],
      ArrowDown: [0, steps],
      ArrowLeft: [-steps, 0],
      ArrowRight: [steps, 0],
    };
    if (!(event.key in map)) {
      return;
    }
    event.preventDefault();
    const [dx, dy] = map[event.key];
    const currentField = fieldRef.current;
    const newX = clampPercent(currentField.x + dx);
    const newY = clampPercent(currentField.y + dy);
    const newPos = { x: newX, y: newY };
    dragPositionRef.current = newPos;
    setLocalPos(newPos);
    handleUpdatePosition(newPos);
  };

  const currentX = isDragging ? localPos.x : field.x;
  const currentY = isDragging ? localPos.y : field.y;

  // Check if this is a placeholder field (contains {{...}})
  const isPlaceholder = /\{\{.*\}\}/.test(displayText);

  const isSelected = isDragging || isActive;

  const stateClasses = isDragging
    ? "z-50 cursor-grabbing pn-field-selected"
    : isInteractionDisabled
      ? "pointer-events-none"
      : isActive
        ? "pn-field-selected cursor-grab"
        : previewMode
          ? ""
          : isPlaceholder
            ? "pn-field-outline cursor-grab"
            : "cursor-grab hover:outline-1 hover:outline-dashed hover:outline-ink hover:outline-offset-2";

  return (
    <DraggableCore
      nodeRef={nodeRef}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      disabled={previewMode}
    >
      <div
        ref={nodeRef}
        role="button"
        tabIndex={previewMode ? -1 : 0}
        onClick={() => !previewMode && onSelect(field.id)}
        onKeyDown={handleKeyDown}
        style={{
          position: "absolute",
          left: `${currentX}%`,
          top: `${currentY}%`,
          transform: "translate(-50%, -50%)",
          color: field.color,
          fontSize: `${field.fontSize}px`,
          lineHeight: 1.2,
        }}
        className={`group max-w-[90%] whitespace-pre-wrap rounded-none px-2 py-1 font-semibold tracking-tight outline-none ${stateClasses} ${alignClass} ${
          isDragging
            ? "transition-none"
            : "transition-all duration-[160ms] ease-[cubic-bezier(.2,.8,.2,1)]"
        }`}
      >
        {displayText || "Empty field"}

        {/* Solid pink handle with the field name as a real-text annotation */}
        {!previewMode && (
          <div
            className={`pn-annotation absolute -top-5 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap border border-ink bg-pink px-2 py-0.5 text-ink transition-opacity duration-[160ms] ${
              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Move className="h-3 w-3" aria-hidden="true" />
            <span>{field.name || "Field"}</span>
          </div>
        )}
      </div>
    </DraggableCore>
  );
});
