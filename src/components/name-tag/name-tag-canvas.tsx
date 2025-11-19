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
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
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
  }, [tag]);

  const floatingStyles =
    isFloating && metrics.width
      ? {
          position: "fixed" as const,
          top: "5rem", // Adjusted for sticky header
          left: metrics.left,
          width: metrics.width,
          zIndex: 30,
        }
      : undefined;

  const containerClasses = [
    "rounded-[32px] border-2 border-black bg-white p-6 shadow-cartoon transition-all duration-300",
    isFloating ? "z-30" : "sticky top-24 self-start",
  ].join(" ");

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
          <p className="font-heading text-lg font-bold uppercase tracking-wide text-bubble-blue">
            Live Canvas
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-soft-graphite">
            Drag & Drop
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Click text to edit. Drag to move!
          </p>
        </div>
        <span className="animate-bounce-hover inline-flex items-center rounded-full border-2 border-black bg-sunshine-yellow px-4 py-1 font-heading text-sm font-bold text-soft-graphite shadow-cartoon-sm">
          {visibleFields.length} item{visibleFields.length === 1 ? "" : "s"}
        </span>
      </header>

      <div className="flex items-center justify-center bg-slate-100 rounded-3xl p-4 border-2 border-slate-200 border-dashed">
        <div
          ref={cardRef}
          className="relative aspect-3/2 w-full max-w-3xl overflow-hidden rounded-[36px] border-2 border-black shadow-lg"
          style={cardBackgroundStyle}
        >
          {/* Inner border for print safe area visualization - optional but helpful */}
          <div
            className="pointer-events-none absolute inset-4 rounded-[24px] border-2 border-dashed border-black/10"
          />

          {tag.fields.map((field) =>
            field.visible ? (
              <FloatingField
                key={field.id}
                field={field}
                alignClass={alignToClass[tag.textAlign]}
                accent={tag.accent}
                isActive={activeField === field.id}
                onSelect={() => onSelectField(field.id)}
                onDrag={(position) =>
                  onFieldPositionChange(field.id, position)
                }
                cardRef={cardRef}
              />
            ) : null,
          )}
        </div>
      </div>
      </section>
    </>
  );
}

type FloatingFieldProps = {
  field: NameTagField;
  alignClass: string;
  accent: string;
  isActive: boolean;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onDrag: (position: Pick<NameTagField, "x" | "y">) => void;
};

const FloatingField = memo(function FloatingField({
  field,
  alignClass,
  accent,
  isActive,
  cardRef,
  onSelect,
  onDrag,
}: FloatingFieldProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(
    () => () => {
      document.body.classList.remove("cursor-grabbing");
    },
    [],
  );

  const updatePosition = useCallback(
    (deltaX: number, deltaY: number) => {
      const root = cardRef.current;
      if (!root) {
        return;
      }
      const { width, height } = root.getBoundingClientRect();
      onDrag({
        x: clampPercent(field.x + (deltaX / width) * 100),
        y: clampPercent(field.y + (deltaY / height) * 100),
      });
    },
    [cardRef, field.x, field.y, onDrag],
  );

  const handleDrag = useCallback(
    (_event: DraggableEvent, data: DraggableData) => {
      updatePosition(data.deltaX, data.deltaY);
    },
    [updatePosition],
  );

  const handleStart = useCallback(() => {
    setIsDragging(true);
    onSelect();
    document.body.classList.add("cursor-grabbing");
  }, [onSelect]);

  const handleStop = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove("cursor-grabbing");
  }, []);

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
    onDrag({
      x: clampPercent(field.x + dx),
      y: clampPercent(field.y + dy),
    });
  };

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
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        style={{
          left: `${field.x}%`,
          top: `${field.y}%`,
          color: field.color,
          fontSize: `${field.fontSize}px`,
          transform: "translate(-50%, -50%)",
          lineHeight: 1.1,
        }}
        className={`group absolute w-[82%] max-w-[82%] whitespace-pre-wrap px-4 py-2 font-semibold tracking-tight outline-none ${
          isDragging ? "z-50 cursor-grabbing scale-105" : "cursor-grab hover:scale-[1.02]"
        } ${alignClass} transition-transform duration-200 ${
          isActive
            ? "ring-2 ring-black ring-offset-2 rounded-xl bg-white/20"
            : "hover:bg-white/10 rounded-xl"
        }`}
      >
        {field.text || "Empty text"}
        
        {/* Drag Handle / Indicator */}
        <div
          className={`absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border-2 border-black bg-bubble-blue px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-sm transition-opacity duration-200 ${
             isActive || isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Move className="w-3 h-3" />
          <span>Move</span>
        </div>
      </div>
    </DraggableCore>
  );
});
