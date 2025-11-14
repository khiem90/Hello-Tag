"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  DraggableCore,
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import {
  backgroundThemes,
  clampPercent,
  fieldOrder,
} from "@/lib/name-tag";
import {
  NameTagData,
  NameTagField,
  NameTagFieldKey,
} from "@/types/name-tag";

type NameTagCanvasProps = {
  tag: NameTagData;
  activeField: NameTagFieldKey;
  onSelectField: (key: NameTagFieldKey) => void;
  onFieldPositionChange: (
    key: NameTagFieldKey,
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
  const cardRef = useRef<HTMLDivElement>(null);
  const theme =
    tag.background === "custom"
      ? null
      : backgroundThemes[tag.background];

  const visibleFields = fieldOrder
    .map((key) => tag.fields[key])
    .filter((field) => field.visible);
  const cardBackgroundStyle =
    tag.background === "custom"
      ? { background: tag.customBackground }
      : { backgroundImage: theme?.gradient };

  return (
    <section className="rounded-[32px] border border-slate-200 bg-gradient-to-b from-white via-white to-slate-50 p-6 shadow-inner shadow-slate-200">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Live canvas
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Drag to place each field
          </h2>
          <p className="text-sm text-slate-500">
            Click any text block to focus it. Use your arrow keys to nudge the
            selection (hold Shift for small steps).
          </p>
        </div>
        <span className="rounded-full bg-slate-900/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
          {visibleFields.length} field{visibleFields.length === 1 ? "" : "s"}
        </span>
      </header>

      <div className="flex items-center justify-center">
        <div
          ref={cardRef}
          className="relative aspect-[3/2] w-full max-w-3xl overflow-hidden rounded-[36px] border border-white/60 p-10 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.65)]"
          style={cardBackgroundStyle}
        >
          <div
            className="absolute inset-10 rounded-[28px] border border-white/30"
            style={{ boxShadow: `0 0 60px -30px ${tag.accent}` }}
          />

          {fieldOrder.map((key) => {
            const field = tag.fields[key];
            if (!field.visible) {
              return null;
            }
            return (
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
            );
          })}

          <span
            className="pointer-events-none absolute left-10 right-10 bottom-8 h-1.5 rounded-full opacity-80"
            style={{ backgroundColor: tag.accent }}
          />
        </div>
      </div>
    </section>
  );
}

type FloatingFieldProps = {
  field: NameTagField;
  alignClass: string;
  accent: string;
  isActive: boolean;
  cardRef: React.RefObject<HTMLDivElement>;
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
    onSelect();
    document.body.classList.add("cursor-grabbing");
  }, [onSelect]);

  const handleStop = useCallback(() => {
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
        className={`group absolute w-[82%] max-w-[82%] cursor-grab whitespace-pre-wrap px-4 py-2 font-semibold tracking-tight outline-none transition ${
          alignClass
        } ${
          isActive
            ? "ring-2 ring-white ring-offset-4 ring-offset-transparent"
            : "ring-2 ring-transparent hover:ring-white/40"
        }`}
      >
        {field.text || "Empty text"}
        <span
          className={`pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.4em] text-white opacity-0 transition group-focus-visible:opacity-100 group-hover:opacity-100 ${
            isActive ? "opacity-100" : ""
          }`}
          style={{ backgroundColor: accent }}
        >
          Drag
        </span>
      </div>
    </DraggableCore>
  );
});
