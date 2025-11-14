"use client";

import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";
import {
  Axis,
  NameTag,
  NameTagDraft,
  PositionKey,
} from "@/types/name-tag";
import {
  clonePositions,
  createBlankDraft,
  createDefaultPositions,
  starterTags,
} from "@/lib/name-tag-config";
import { NameTagForm } from "@/components/name-tags/name-tag-form";
import { NameTagPreviewPanel } from "@/components/name-tags/name-tag-preview-panel";
import { SavedTagsSection } from "@/components/name-tags/saved-tags-section";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `tag-${Date.now().toString(36)}-${Math.random()
        .toString(16)
        .slice(2, 8)}`;

export default function Home() {
  const [tags, setTags] = useState<NameTag[]>(starterTags);
  const [form, setForm] = useState<NameTagDraft>(() => createBlankDraft());
  const [editingId, setEditingId] = useState<string | null>(null);

  const isEditing = Boolean(editingId);
  const disableSubmit = form.fullName.trim().length === 0;

  const livePreview: NameTag = useMemo(
    () => ({
      id: editingId ?? "preview",
      fullName: form.fullName,
      role: form.role,
      tagline: form.tagline,
      accent: form.accent,
      textAlign: form.textAlign,
      positions: form.positions,
    }),
    [editingId, form],
  );

  const handleFieldChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccentPick = (color: string) => {
    setForm((prev) => ({ ...prev, accent: color }));
  };

  const handleTextAlignChange = (value: NameTag["textAlign"]) => {
    setForm((prev) => ({ ...prev, textAlign: value }));
  };

  const adjustPosition = (key: PositionKey, axis: Axis, rawValue: number) => {
    if (Number.isNaN(rawValue)) {
      return;
    }
    const clamped = Math.min(100, Math.max(0, rawValue));

    setForm((prev) => ({
      ...prev,
      positions: {
        ...prev.positions,
        [key]: {
          ...prev.positions[key],
          [axis]: clamped,
        },
      },
    }));
  };

  const resetPosition = (key: PositionKey) => {
    const defaults = createDefaultPositions();
    setForm((prev) => ({
      ...prev,
      positions: {
        ...prev.positions,
        [key]: { ...defaults[key] },
      },
    }));
  };

  const resetAllPositions = () => {
    setForm((prev) => ({
      ...prev,
      positions: createDefaultPositions(),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed: NameTagDraft = {
      fullName: form.fullName.trim(),
      role: form.role.trim(),
      tagline: form.tagline.trim(),
      accent: form.accent,
      textAlign: form.textAlign,
      positions: clonePositions(form.positions),
    };

    if (!trimmed.fullName) {
      return;
    }

    setTags((prev) => {
      if (!editingId) {
        return [{ id: createId(), ...trimmed }, ...prev];
      }

      return prev.map((tag) =>
        tag.id === editingId ? { ...tag, ...trimmed } : tag,
      );
    });

    setForm(createBlankDraft());
    setEditingId(null);
  };

  const startEditing = (tag: NameTag) => {
    setEditingId(tag.id);
    setForm({
      fullName: tag.fullName,
      role: tag.role,
      tagline: tag.tagline,
      accent: tag.accent,
      textAlign: tag.textAlign ?? "left",
      positions: clonePositions(
        tag.positions ?? createDefaultPositions(),
      ),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm(createBlankDraft());
  };

  const clearForm = () => setForm(createBlankDraft());

  return (
    <main className="min-h-screen bg-slate-100/60 px-4 py-12 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
            Hello Tag
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Create memorable name tags in seconds.
          </h1>
          <p className="text-base text-slate-600 sm:max-w-3xl">
            Capture the essentials for each person, add a splash of color, and
            jump back into any tag to keep editing. The live preview updates as
            you type so you know exactly what will print.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <NameTagForm
            form={form}
            isEditing={isEditing}
            disableSubmit={disableSubmit}
            onFieldChange={handleFieldChange}
            onAccentPick={handleAccentPick}
            onSubmit={handleSubmit}
            onClear={clearForm}
            onCancelEdit={cancelEditing}
            onTextAlignChange={handleTextAlignChange}
            onAdjustPosition={adjustPosition}
            onResetPosition={resetPosition}
            onResetAllPositions={resetAllPositions}
          />

          <NameTagPreviewPanel tag={livePreview} isEditing={isEditing} />
        </section>

        <SavedTagsSection tags={tags} onEdit={startEditing} />
      </div>
    </main>
  );
}
