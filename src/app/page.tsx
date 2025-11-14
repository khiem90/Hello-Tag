"use client";

import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";
import { NameTag, NameTagCard } from "@/components/name-tag-card";

type NameTagDraft = Omit<NameTag, "id">;

const starterTags: NameTag[] = [
  {
    id: "tag-alex",
    fullName: "Alex Kim",
    role: "Product Designer",
    tagline: "Coffee snob & prototyper",
    accent: "#14b8a6",
    textAlign: "left",
    namePlacement: "middle",
  },
  {
    id: "tag-samira",
    fullName: "Samira Patel",
    role: "Developer Advocate",
    tagline: "Ask me about DX",
    accent: "#a855f7",
    textAlign: "center",
    namePlacement: "top",
  },
  {
    id: "tag-lena",
    fullName: "Lena Flores",
    role: "Ops Lead",
    tagline: "Team puzzle master",
    accent: "#f97316",
    textAlign: "right",
    namePlacement: "bottom",
  },
];

const accentPalette = [
  "#0ea5e9",
  "#22d3ee",
  "#14b8a6",
  "#f97316",
  "#f43f5e",
  "#a855f7",
];

const textAlignOptions: Array<{
  value: NameTag["textAlign"];
  label: string;
  description: string;
}> = [
  { value: "left", label: "Left", description: "Classic name badge layout" },
  {
    value: "center",
    label: "Center",
    description: "Perfect for short names",
  },
  {
    value: "right",
    label: "Right",
    description: "Modern offset treatment",
  },
];

const placementOptions: Array<{
  value: NameTag["namePlacement"];
  label: string;
  description: string;
}> = [
  { value: "top", label: "Top", description: "Keep names near the greeting" },
  {
    value: "middle",
    label: "Middle",
    description: "Balances the white space",
  },
  {
    value: "bottom",
    label: "Bottom",
    description: "Align with the tagline",
  },
];

const createBlankDraft = (): NameTagDraft => ({
  fullName: "",
  role: "",
  tagline: "",
  accent: "#0ea5e9",
  textAlign: "left",
  namePlacement: "middle",
});

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

  const livePreview: NameTag = useMemo(
    () => ({
      id: editingId ?? "preview",
      fullName: form.fullName,
      role: form.role,
      tagline: form.tagline,
      accent: form.accent,
      textAlign: form.textAlign,
      namePlacement: form.namePlacement,
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

  const handleAccentPick = (value: string) => {
    setForm((prev) => ({ ...prev, accent: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed: NameTagDraft = {
      fullName: form.fullName.trim(),
      role: form.role.trim(),
      tagline: form.tagline.trim(),
      accent: form.accent,
      textAlign: form.textAlign,
      namePlacement: form.namePlacement,
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
      namePlacement: tag.namePlacement ?? "middle",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm(createBlankDraft());
  };

  const disableSubmit = form.fullName.trim().length === 0;

  return (
    <main className="min-h-screen bg-slate-100/60 px-4 py-12 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
            Name Tag Studio
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
          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {isEditing ? "Edit tag" : "New tag"}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {isEditing ? "Update name tag" : "Add a name tag"}
                </h2>
                <p className="text-sm text-slate-500">
                  Fill out the details below. You can always edit later.
                </p>
              </div>
              {isEditing ? (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>

            <div className="mt-6 space-y-5">
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Full name
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleFieldChange}
                  placeholder="e.g. Jordan Avery"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Role or team
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  name="role"
                  value={form.role}
                  onChange={handleFieldChange}
                  placeholder="Product Manager"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Icebreaker or fun fact
                <textarea
                  className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  name="tagline"
                  maxLength={90}
                  value={form.tagline}
                  onChange={handleFieldChange}
                  placeholder="Ask me about..."
                />
              </label>

              <div className="space-y-3 text-sm font-medium text-slate-700">
                Accent color
                <div className="flex flex-wrap items-center gap-3">
                  {accentPalette.map((color) => {
                    const isSelected = form.accent === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        aria-label={`Select ${color} accent`}
                        aria-pressed={isSelected}
                        onClick={() => handleAccentPick(color)}
                        className={`h-10 w-10 rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 ${
                          isSelected
                            ? "border-slate-900 ring-2 ring-slate-900/10"
                            : "border-transparent ring-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    );
                  })}
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    Custom
                    <input
                      type="color"
                      name="accent"
                      value={form.accent}
                      onChange={handleFieldChange}
                      className="h-10 w-16 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                      aria-label="Pick a custom accent color"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Text placement
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Horizontal alignment
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {textAlignOptions.map((option) => {
                        const isActive = form.textAlign === option.value;
                        return (
                          <button
                            type="button"
                            key={option.value}
                            aria-pressed={isActive}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                textAlign: option.value,
                              }))
                            }
                            className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 ${
                              isActive
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-500">
                      {textAlignOptions.find(
                        (alignment) => alignment.value === form.textAlign,
                      )?.description ?? ""}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Vertical focus
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {placementOptions.map((option) => {
                        const isActive = form.namePlacement === option.value;
                        return (
                          <button
                            type="button"
                            key={option.value}
                            aria-pressed={isActive}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                namePlacement: option.value,
                              }))
                            }
                            className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 ${
                              isActive
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-500">
                      {placementOptions.find(
                        (placement) => placement.value === form.namePlacement,
                      )?.description ?? ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={disableSubmit}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isEditing ? "Save changes" : "Add name tag"}
              </button>
              <button
                type="button"
                onClick={() => setForm(createBlankDraft())}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
              >
                Clear form
              </button>
            </div>
          </form>

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
            <NameTagCard tag={livePreview} isPreview />
          </div>
        </section>

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
                <NameTagCard key={tag.id} tag={tag} onEdit={startEditing} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center text-slate-500">
              <p className="text-base font-semibold text-slate-600">
                No name tags yet
              </p>
              <p className="text-sm">
                Use the form above to craft your first badge. It will appear
                here ready to edit.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
