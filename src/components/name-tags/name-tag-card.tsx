"use client";

import { memo } from "react";
import {
  LabelPositions,
  NameTag,
  TextAlignOption,
} from "@/types/name-tag";

type NameTagCardProps = {
  tag: NameTag;
  onEdit?: (tag: NameTag) => void;
  isPreview?: boolean;
};

const defaultAccent = "#0ea5e9";

const fallbackPositions: LabelPositions = {
  greeting: { x: 50, y: 16 },
  name: { x: 50, y: 46 },
  role: { x: 50, y: 60 },
  tagline: { x: 50, y: 80 },
};

const clampPercent = (value: number) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 50;
  }
  return Math.min(100, Math.max(0, value));
};

const getPositionStyle = (pos: { x: number; y: number }) => ({
  left: `${clampPercent(pos.x)}%`,
  top: `${clampPercent(pos.y)}%`,
  transform: "translate(-50%, -50%)",
});

const alignToClass: Record<TextAlignOption, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

export const NameTagCard = memo(function NameTagCard({
  tag,
  onEdit,
  isPreview = false,
}: NameTagCardProps) {
  const accent = tag.accent || defaultAccent;
  const alignKey: TextAlignOption = tag.textAlign ?? "left";
  const positions: LabelPositions = {
    greeting: tag.positions?.greeting ?? fallbackPositions.greeting,
    name: tag.positions?.name ?? fallbackPositions.name,
    role: tag.positions?.role ?? fallbackPositions.role,
    tagline: tag.positions?.tagline ?? fallbackPositions.tagline,
  };

  return (
    <article
      className="relative isolate h-56 w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-6 text-slate-900 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        boxShadow:
          "0 15px 35px -25px rgba(15, 23, 42, 0.65), inset 0 0 0 1px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute flex flex-col gap-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500 ${alignToClass[alignKey]}`}
          style={{
            ...getPositionStyle(positions.greeting),
            width: "60%",
          }}
        >
          <span>Hello</span>
          <span>my name is</span>
        </div>

        <div
          className={`absolute space-y-1.5 ${alignToClass[alignKey]}`}
          style={{
            ...getPositionStyle(positions.name),
            width: "70%",
          }}
        >
          <p className="text-3xl font-semibold tracking-tight">
            {tag.fullName || "Your Name"}
          </p>
        </div>

        <div
          className={`absolute text-base text-slate-600 ${alignToClass[alignKey]}`}
          style={{
            ...getPositionStyle(positions.role),
            width: "70%",
          }}
        >
          <p>{tag.role || "What you do"}</p>
        </div>

        <div
          className={`absolute text-sm text-slate-500 ${alignToClass[alignKey]}`}
          style={{
            ...getPositionStyle(positions.tagline),
            width: "75%",
          }}
        >
          <p>{tag.tagline || "Add a fun fact or conversation starter"}</p>
        </div>
      </div>

      {onEdit && !isPreview ? (
        <button
          type="button"
          onClick={() => onEdit?.(tag)}
          className="absolute right-5 bottom-5 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-transparent hover:bg-slate-900 hover:text-white"
        >
          Edit
        </button>
      ) : null}

      {isPreview ? (
        <span className="pointer-events-none absolute right-6 top-6 rounded-full bg-slate-900/80 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-white">
          Preview
        </span>
      ) : null}

      <span
        className="absolute inset-x-6 bottom-5 h-1.5 rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <span
        className="absolute inset-0 rounded-[32px] border border-white/50"
        style={{ boxShadow: `0 0 35px -20px ${accent}` }}
        aria-hidden
      />
    </article>
  );
});
