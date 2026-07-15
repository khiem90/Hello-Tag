"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DraggableCore,
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { backgroundThemes, clampPercent } from "@/lib/name-tag";
import { NameTagData, NameTagField } from "@/types/name-tag";
import { Move } from "lucide-react";

type NameTagCanvasProps = {
  tag: NameTagData;
  activeField: string;
  onSelectField: (key: string) => void;
  onFieldPositionChange: (
    key: string,
    position: Pick<NameTagField, "x" | "y">,
  ) => void;
};

const alignToClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function NameTagCanvas({
  tag,
  activeField,
  onSelectField,
  onFieldPositionChange,
}: NameTagCanvasProps) {
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
    tag.background === "custom"
      ? null
      : backgroundThemes[tag.background];

  const visibleFields = tag.fields.filter((field) => field.visible);

  const cardBackgroundStyle =
    tag.background === "custom"
      ? {
          backgroundColor: tag.customBackground,
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
            <p className="pn-eyebrow text-muted-ink">
              The working file
            </p>
            <h2 className="pn-display-m mt-1 text-ink">
              Label sheet
            </h2>
            <p className="pn-eyebrow mt-2 text-muted-ink">
              Drag layers to reposition
            </p>
          </div>
          <span className="pn-eyebrow inline-flex items-center border border-ink bg-cream px-3 py-1 text-ink">
            {visibleFields.length} item{visibleFields.length === 1 ? "" : "s"}
          </span>
        </header>

        <div className="flex items-center justify-center border border-ink bg-sage p-5 sm:p-8">
          <div
            ref={cardRef}
            className="relative w-full max-w-md overflow-hidden rounded-none border border-ink shadow-paper-sm"
            style={{
              ...cardBackgroundStyle,
              aspectRatio: "3.25 / 3", // Match Word label cell ratio
            }}
          >
            {/* Content area with padding to match Word cell margins */}
            <div className="absolute inset-0 p-4">
              {visibleFields.map((field) => (
                <FloatingField
                  key={field.id}
                  field={field}
                  alignClass={alignToClass[tag.textAlign]}
                  isActive={activeField === field.id}
                  isInteractionDisabled={draggingId !== null && draggingId !== field.id}
                  onSelect={onSelectField}
                  onDrag={onFieldPositionChange}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  cardRef={cardRef}
                />
              ))}

              {/* Empty state */}
              {visibleFields.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-2 border border-dashed border-ink bg-cream p-6 text-center">
                  <p className="pn-hand -rotate-2 text-ink">
                    a blank label, waiting
                  </p>
                  <p className="pn-eyebrow text-muted-ink">
                    Add a layer to start setting type
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info about the preview */}
        <p className="pn-annotation mt-4 text-center text-muted-ink">
          Preview matches Word document export format
        </p>
      </section>
    </>
  );
}

type FloatingFieldProps = {
  field: NameTagField;
  alignClass: string;
  isActive: boolean;
  isInteractionDisabled?: boolean;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (id: string) => void;
  onDrag: (id: string, position: Pick<NameTagField, "x" | "y">) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
};

const FloatingField = memo(function FloatingField({
  field,
  alignClass,
  isActive,
  isInteractionDisabled,
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
    [],
  );

  const handleUpdatePosition = useCallback(
    (newPos: Pick<NameTagField, "x" | "y">) => {
      onDrag(fieldRef.current.id, newPos);
    },
    [onDrag],
  );

  const updatePosition = useCallback(
    (deltaX: number, deltaY: number) => {
      const root = cardRef.current;
      if (!root) {
        return;
      }
      const { width, height } = root.getBoundingClientRect();

      const newX = clampPercent(dragPositionRef.current.x + (deltaX / width) * 100);
      const newY = clampPercent(dragPositionRef.current.y + (deltaY / height) * 100);

      const newPos = { x: newX, y: newY };
      dragPositionRef.current = newPos;
      setLocalPos(newPos);

      handleUpdatePosition(newPos);
    },
    [cardRef, handleUpdatePosition],
  );

  const handleDrag = useCallback(
    (_event: DraggableEvent, data: DraggableData) => {
      updatePosition(data.deltaX, data.deltaY);
    },
    [updatePosition],
  );

  const handleStart = useCallback(() => {
    setIsDragging(true);
    dragPositionRef.current = { x: field.x, y: field.y };
    setLocalPos({ x: field.x, y: field.y });
    const id = fieldRef.current.id;
    onSelect(id);
    onDragStart?.(id);
    document.body.classList.add("cursor-grabbing");
  }, [onSelect, onDragStart, field.x, field.y]);

  const handleStop = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.();
    document.body.classList.remove("cursor-grabbing");
  }, [onDragEnd]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
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

  // Check if this is a data-bound layer (contains {{...}})
  const isPlaceholder = /\{\{.*\}\}/.test(field.text);

  const isSelected = isDragging || isActive;

  const stateClasses = isDragging
    ? "z-50 cursor-grabbing pn-field-selected"
    : isInteractionDisabled
      ? "pointer-events-none opacity-50"
      : isActive
        ? "pn-field-selected cursor-grab"
        : isPlaceholder
          ? "pn-field-outline cursor-grab"
          : "cursor-grab hover:outline-1 hover:outline-dashed hover:outline-ink hover:outline-offset-2";

  return (
    <DraggableCore
      nodeRef={nodeRef}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(field.id)}
        onKeyDown={handleKeyDown}
        style={{
          position: "absolute",
          left: `${currentX}%`,
          top: `${currentY}%`,
          transform: "translate(-50%, -50%)",
          color: field.color,
          fontSize: `${Math.min(field.fontSize, 48)}px`,
          lineHeight: 1.2,
        }}
        className={`group max-w-[90%] whitespace-pre-wrap rounded-none px-2 py-1 font-semibold tracking-tight outline-none ${stateClasses} ${alignClass} ${
          isDragging
            ? "transition-none"
            : "transition-all duration-[160ms] ease-[cubic-bezier(.2,.8,.2,1)]"
        }`}
      >
        {field.text || "Empty text"}

        {/* Solid pink handle with the layer name as a real-text annotation */}
        <div
          className={`pn-annotation absolute -top-5 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap border border-ink bg-pink px-2 py-0.5 text-ink transition-opacity duration-[160ms] ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Move className="h-3 w-3" aria-hidden="true" />
          <span>{field.name || "Layer"}</span>
        </div>
      </div>
    </DraggableCore>
  );
});
