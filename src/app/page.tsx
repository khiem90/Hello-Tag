"use client";

import { useState } from "react";
import { NameTagCanvas } from "@/components/name-tag/name-tag-canvas";
import { NameTagForm } from "@/components/name-tag/name-tag-form";
import {
  clampPercent,
  createDefaultTag,
} from "@/lib/name-tag";
import {
  NameTagData,
  NameTagField,
  NameTagFieldKey,
} from "@/types/name-tag";

export default function Home() {
  const [tag, setTag] = useState<NameTagData>(() => createDefaultTag());
  const [activeField, setActiveField] =
    useState<NameTagFieldKey>("name");

  const updateField = (
    key: NameTagFieldKey,
    patch: Partial<NameTagField>,
  ) => {
    setTag((prev) => {
      const current = prev.fields[key];
      const nextField: NameTagField = {
        ...current,
        ...patch,
      };
      if (patch.x !== undefined) {
        nextField.x = clampPercent(patch.x);
      }
      if (patch.y !== undefined) {
        nextField.y = clampPercent(patch.y);
      }
      return {
        ...prev,
        fields: {
          ...prev.fields,
          [key]: nextField,
        },
      };
    });
  };

  const handleThemeChange = (
    update: Partial<
      Pick<NameTagData, "accent" | "background" | "textAlign">
    >,
  ) => {
    setTag((prev) => ({ ...prev, ...update }));
  };

  const handleReset = () => {
    const defaults = createDefaultTag();
    setTag(defaults);
    setActiveField("name");
  };

  const ensureActiveField = (key: NameTagFieldKey) => {
    setActiveField(key);
  };

  return (
    <main className="min-h-screen bg-slate-100/60 px-4 py-12 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-4 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Custom label studio
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Build name tag labels you can drag, edit, and print.
          </h1>
          <p className="text-base text-slate-600 sm:max-w-3xl">
            Fill out the fields, then drag each text block inside the preview
            window. Every change updates instantly so you can explore layouts
            and color combinations without leaving the browser.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(320px,360px)_minmax(0,1fr)]">
          <NameTagForm
            tag={tag}
            activeField={activeField}
            onSelectField={ensureActiveField}
            onFieldChange={(key, patch) => {
              ensureActiveField(key);
              updateField(key, patch);
            }}
            onThemeChange={handleThemeChange}
            onReset={handleReset}
          />

          <NameTagCanvas
            tag={tag}
            activeField={activeField}
            onSelectField={ensureActiveField}
            onFieldPositionChange={(key, position) =>
              updateField(key, position)
            }
          />
        </section>
      </div>
    </main>
  );
}
