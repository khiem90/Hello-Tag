"use client";

import { MergeField } from "@/types/document";
import { Eye, EyeOff } from "lucide-react";

type FieldsListProps = {
  fields: MergeField[];
  activeFieldId: string;
  onSelectField: (id: string) => void;
};

export function FieldsList({
  fields,
  activeFieldId,
  onSelectField,
}: FieldsListProps) {
  return (
    <section className="p-5">
      <p className="pn-eyebrow mb-3 text-ink">03 — Fields</p>
      <div className="flex flex-col border-t border-ink/20">
        {fields.map((field, index) => {
          const isActive = field.id === activeFieldId;
          const hasPlaceholder = /\{\{.*\}\}/.test(field.text);
          return (
            <button
              key={field.id}
              type="button"
              onClick={() => onSelectField(field.id)}
              aria-pressed={isActive}
              className={`group relative w-full cursor-pointer rounded-none border-b border-ink/20 px-2 py-3 text-left transition-colors duration-[160ms] ${
                isActive
                  ? "border-l-2 border-l-pink bg-pink/15 text-ink"
                  : "border-l-2 border-l-transparent text-muted-ink hover:bg-sage/40 hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-baseline gap-2">
                  <span
                    className={`pn-eyebrow ${isActive ? "text-ink" : "text-muted-ink"}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-ink">
                    {field.name || `Field ${index + 1}`}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {hasPlaceholder && (
                    <span className="pn-annotation border border-ink bg-cream px-1.5 py-0.5 text-ink">
                      Merge
                    </span>
                  )}
                  {field.visible ? (
                    <Eye
                      className={`h-4 w-4 ${isActive ? "text-ink" : "text-muted-ink"}`}
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeOff
                      className="h-4 w-4 text-muted-ink/50"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </div>
              <p className="mt-1 truncate font-mono text-xs text-muted-ink">
                {field.text.trim() || "Empty field"}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
