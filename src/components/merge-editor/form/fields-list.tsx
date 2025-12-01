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
    <div className="space-y-2">
      <p className="px-1 text-xs font-medium text-ink-light tracking-wide">
        Merge Fields
      </p>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => {
          const isActive = field.id === activeFieldId;
          const hasPlaceholder = /\{\{.*\}\}/.test(field.text);
          return (
            <button
              key={field.id}
              type="button"
              onClick={() => onSelectField(field.id)}
              className={`group relative w-full overflow-hidden rounded-lg border px-4 py-3 text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-terracotta bg-terracotta/10 text-ink"
                  : "border-ink/10 bg-white text-ink-light hover:border-ink/20 hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">
                  {field.name || `Field ${index + 1}`}
                </p>
                <div className="flex items-center gap-2">
                  {hasPlaceholder && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[0.6rem] font-medium uppercase ${
                        isActive
                          ? "bg-terracotta/20 text-terracotta"
                          : "bg-terracotta/10 text-terracotta"
                      }`}
                    >
                      Merge
                    </span>
                  )}
                  {field.visible ? (
                    <Eye
                      className={`h-4 w-4 ${isActive ? "text-terracotta" : "text-ink-light/50 group-hover:text-ink-light"}`}
                    />
                  ) : (
                    <EyeOff
                      className={`h-4 w-4 ${isActive ? "text-ink-light" : "text-ink-light/30"}`}
                    />
                  )}
                </div>
              </div>
              <p
                className={`mt-1 truncate text-xs ${isActive ? "text-ink-light" : "text-ink-light/70"}`}
              >
                {field.text.trim() || "Empty field"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

