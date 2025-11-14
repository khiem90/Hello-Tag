"use client";

import {
  accentPalette,
  backgroundThemes,
  fieldOrder,
} from "@/lib/name-tag";
import {
  NameTagData,
  NameTagFieldKey,
} from "@/types/name-tag";
import {
  ChangeEvent,
  useMemo,
} from "react";

type NameTagFormProps = {
  tag: NameTagData;
  activeField: NameTagFieldKey;
  onSelectField: (key: NameTagFieldKey) => void;
  onFieldChange: (
    key: NameTagFieldKey,
    update: Partial<NameTagData["fields"][NameTagFieldKey]>,
  ) => void;
  onThemeChange: (
    update: Partial<
      Pick<NameTagData, "accent" | "background" | "textAlign" | "customBackground">
    >,
  ) => void;
  onReset: () => void;
};

const alignOptions: Array<NameTagData["textAlign"]> = [
  "left",
  "center",
  "right",
];

export function NameTagForm({
  tag,
  activeField,
  onSelectField,
  onFieldChange,
  onThemeChange,
  onReset,
}: NameTagFormProps) {
  const active = tag.fields[activeField];
  const fieldList = useMemo(
    () => fieldOrder.map((key) => tag.fields[key]),
    [tag.fields],
  );

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onFieldChange(activeField, { text: event.target.value });
  };

  const handleFontSizeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onFieldChange(activeField, { fontSize: Number(event.target.value) });
  };

  const handleColorChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onFieldChange(activeField, { color: event.target.value });
  };

  const handleCoordinateChange = (
    axis: "x" | "y",
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onFieldChange(activeField, { [axis]: Number(event.target.value) });
  };

  const handleVisibilityToggle = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onFieldChange(activeField, { visible: event.target.checked });
  };

  return (
    <aside className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/70 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Name tag maker
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Customize every field
          </h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
        >
          Reset tag
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Layers
          </p>
          <div className="flex flex-col gap-2">
            {fieldList.map((field) => {
              const isActive = field.id === activeField;
              return (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => onSelectField(field.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{field.label}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
                        field.visible
                          ? isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-600"
                          : isActive
                            ? "bg-white/10 text-white/70"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {field.visible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      isActive ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    {field.text.trim() || "Empty text"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {active ? (
          <div className="space-y-5 rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-600">
                {active.label}
              </p>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                <input
                  type="checkbox"
                  checked={active.visible}
                  onChange={handleVisibilityToggle}
                />
                Show field
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Text
              {active.id === "tagline" ? (
                <textarea
                  rows={3}
                  className="w-full rounded-2xl border border-white bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  value={active.text}
                  onChange={handleTextChange}
                  placeholder="Type anything..."
                />
              ) : (
                <input
                  className="w-full rounded-2xl border border-white bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  value={active.text}
                  onChange={handleTextChange}
                  placeholder="Type anything..."
                />
              )}
            </label>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <span>Font size</span>
                <span className="tracking-tight text-slate-700">
                  {active.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min={14}
                max={72}
                value={active.fontSize}
                onChange={handleFontSizeChange}
                className="w-full accent-slate-900"
              />
            </div>

            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Color
              <input
                type="color"
                value={active.color}
                onChange={handleColorChange}
                className="h-10 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-1"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              {(["x", "y"] as const).map((axis) => (
                <label
                  key={axis}
                  className="space-y-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                >
                  {axis.toUpperCase()} (%)
                  <input
                    type="number"
                    value={active[axis].toFixed(0)}
                    onChange={(event) =>
                      handleCoordinateChange(axis, event)
                    }
                    min={0}
                    max={100}
                    className="w-full rounded-2xl border border-white bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-4 rounded-3xl border border-slate-100 bg-white/70 p-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Accent color
            </p>
            <div className="flex flex-wrap gap-3">
              {accentPalette.map((color) => {
                const isActive = tag.accent === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onThemeChange({ accent: color })}
                    className={`h-10 w-10 rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 ${
                      isActive
                        ? "border-slate-900 ring-1 ring-slate-900/30"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-pressed={isActive}
                  />
                );
              })}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                Custom
                <input
                  type="color"
                  value={tag.accent}
                  onChange={(event) =>
                    onThemeChange({ accent: event.target.value })
                  }
                  className="h-10 w-16 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Background
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(backgroundThemes).map(
                ([key, theme]) => {
                  const typedKey = key as keyof typeof backgroundThemes;
                  const isActive = tag.background === typedKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        onThemeChange({
                          background: typedKey,
                        })
                      }
                      className={`rounded-2xl border px-3 py-2 text-xs font-semibold text-slate-600 transition ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      {theme.label}
                    </button>
                  );
                },
              )}
              <button
                type="button"
                onClick={() =>
                  onThemeChange({
                    background: "custom",
                    customBackground: tag.customBackground || "#f8fafc",
                  })
                }
                className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                  tag.background === "custom"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                Custom
              </button>
            </div>
            {tag.background === "custom" ? (
              <label className="mt-3 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Custom color
                <input
                  type="color"
                  value={tag.customBackground || "#f8fafc"}
                  onChange={(event) =>
                    onThemeChange({
                      background: "custom",
                      customBackground: event.target.value,
                    })
                  }
                  className="h-10 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-1"
                />
              </label>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Text alignment
            </p>
            <div className="grid grid-cols-3 gap-2">
              {alignOptions.map((align) => {
                const isActive = tag.textAlign === align;
                return (
                  <button
                    key={align}
                    type="button"
                    onClick={() => onThemeChange({ textAlign: align })}
                    aria-pressed={isActive}
                    className={`rounded-2xl border px-3 py-2 text-sm font-semibold capitalize transition ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {align}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
