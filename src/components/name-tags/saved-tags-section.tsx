import { NameTag } from "@/types/name-tag";
import { NameTagCard } from "@/components/name-tags/name-tag-card";

type SavedTagsSectionProps = {
  tags: NameTag[];
  onEdit: (tag: NameTag) => void;
};

export function SavedTagsSection({
  tags,
  onEdit,
}: SavedTagsSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Saved tags
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            {tags.length
              ? `You have ${tags.length} tag${tags.length > 1 ? "s" : ""}`
              : "Start by adding your first tag"}
          </h2>
        </div>
      </div>

      {tags.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {tags.map((tag) => (
            <NameTagCard key={tag.id} tag={tag} onEdit={onEdit} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center text-slate-500">
          <p className="text-base font-semibold text-slate-600">
            No name tags yet
          </p>
          <p className="text-sm">
            Use the form above to craft your first badge. It will appear here
            ready to edit.
          </p>
        </div>
      )}
    </section>
  );
}
