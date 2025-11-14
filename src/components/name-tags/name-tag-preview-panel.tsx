import { NameTag } from "@/types/name-tag";
import { NameTagCard } from "@/components/name-tags/name-tag-card";

type NameTagPreviewPanelProps = {
  tag: NameTag;
  isEditing: boolean;
};

export function NameTagPreviewPanel({
  tag,
  isEditing,
}: NameTagPreviewPanelProps) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-gradient-to-b from-white via-white to-slate-50 p-6 shadow-inner shadow-slate-200">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Live preview
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            What you&apos;ll print
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Editing an existing tag."
              : "Drafting a brand new tag."}
          </p>
        </div>
        <div className="rounded-full bg-slate-900/80 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
          {isEditing ? "Editing" : "Draft"}
        </div>
      </div>
      <NameTagCard tag={tag} isPreview />
    </div>
  );
}
