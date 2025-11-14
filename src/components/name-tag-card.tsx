"use client";

import { memo } from "react";

export type NameTag = {
  id: string;
  fullName: string;
  role: string;
  tagline: string;
  accent: string;
};

type NameTagCardProps = {
  tag: NameTag;
  onEdit?: (tag: NameTag) => void;
  isPreview?: boolean;
};

const defaultAccent = "#0ea5e9";

export const NameTagCard = memo(function NameTagCard({
  tag,
  onEdit,
  isPreview = false,
}: NameTagCardProps) {
  const accent = tag.accent || defaultAccent;

  return (
    <article
      className="relative isolate flex h-48 w-full flex-col justify-between rounded-[32px] border border-slate-200 bg-white/90 p-6 text-slate-900 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        boxShadow:
          "0 15px 35px -25px rgba(15, 23, 42, 0.65), inset 0 0 0 1px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div className="flex items-baseline justify-between text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
        <span>Hello</span>
        <span>my name is</span>
      </div>

      <div className="space-y-1.5">
        <p className="text-3xl font-semibold tracking-tight">
          {tag.fullName || "Your Name"}
        </p>
        <p className="text-base text-slate-600">
          {tag.role || "What you do"}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <p className="max-w-[70%] truncate">
          {tag.tagline || "Add a fun fact or conversation starter"}
        </p>
        {onEdit && !isPreview ? (
          <button
            type="button"
            onClick={() => onEdit?.(tag)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-transparent hover:bg-slate-900 hover:text-white"
          >
            Edit
          </button>
        ) : null}
      </div>

      {isPreview ? (
        <span className="absolute right-6 top-6 rounded-full bg-slate-900/80 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-white">
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
