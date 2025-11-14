"use client";

import {
  accentPalette,
  backgroundThemes,
} from "@/lib/name-tag";
import type { ImportSummary } from "@/types/import";
import { NameTagData, NameTagField } from "@/types/name-tag";
import { ChangeEvent, useMemo, useRef } from "react";

type NameTagFormProps = {
  tag: NameTagData;
  activeFieldId: string;
  onSelectField: (id: string) => void;
  onFieldChange: (
    id: string,
    update: Partial<NameTagField>,
  ) => void;
  onAddField: () => void;
  onRemoveField: (id: string) => void;
  onThemeChange: (
    update: Partial<
      Pick<NameTagData, "accent" | "background" | "textAlign" | "customBackground">
    >,
  ) => void;
  onReset: () => void;
  onImportDataset: (file: File) => void;
  importSummary: ImportSummary | null;
  importError: string | null;
  isImportingDataset: boolean;
};

const alignOptions: Array<NameTagData["textAlign"]> = [
  "left",
  "center",
  "right",
];

const importStatusTokens: Record<
  ImportSummary["status"],
  {
    label: string;
    pill: string;
    text: string;
  }
> = {
  match: {
    label: "Headers match your layers",
    pill: "border-emerald-200 bg-emerald-50 text-emerald-700",
    text: "text-emerald-700",
  },
  "needs-layers": {
    label: "Add more layers",
    pill: "border-amber-200 bg-amber-50 text-amber-700",
    text: "text-amber-700",
  },
  "unused-layers": {
    label: "Too many layers",
    pill: "border-sky-200 bg-sky-50 text-sky-700",
    text: "text-sky-700",
  },
};

const describeImportSummary = (summary: ImportSummary) => {
  const { headerCount, layerCount } = summary;
  if (headerCount === layerCount) {
    return "Each header in your file can map to a layer.";
  }
  if (headerCount > layerCount) {
    const difference = headerCount - layerCount;
    return `The file has ${headerCount} headers but only ${layerCount} layers. Add ${difference} more layer${difference > 1 ? "s" : ""} or hide unused headers.`;
  }
  const difference = layerCount - headerCount;
  return `Your tag exposes ${layerCount} layers but the file only contains ${headerCount} headers. Hide or remove ${difference} layer${difference > 1 ? "s" : ""}.`;
};

export function NameTagForm({
  tag,
  activeFieldId,
  onSelectField,
  onFieldChange,
  onAddField,
  onRemoveField,
  onThemeChange,
  onReset,
  onImportDataset,
  importSummary,
  importError,
  isImportingDataset,
}: NameTagFormProps) {
  const activeLayer =
    tag.fields.find((field) => field.id === activeFieldId) ??
    tag.fields[0] ??
    null;
  const canRemove = tag.fields.length > 1 && activeLayer;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDatasetButton = () => {
    fileInputRef.current?.click();
  };

  const handleDatasetChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportDataset(file);
    }
    event.target.value = "";
  };

  const importDescription = useMemo(() => {
    if (!importSummary) {
      return "";
    }
    return describeImportSummary(importSummary);
  }, [importSummary]);

  const importStatus = importSummary
    ? importStatusTokens[importSummary.status]
    : null;

  const importTimestamp = useMemo(() => {
    if (!importSummary) {
      return "";
    }
    const timestamp = new Date(importSummary.importedAt);
    if (Number.isNaN(timestamp.getTime())) {
      return "";
    }
    return timestamp.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [importSummary]);

  const handleLayerNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!activeLayer) {
      return;
    }
    onFieldChange(activeLayer.id, { name: event.target.value });
  };

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!activeLayer) {
      return;
    }
    onFieldChange(activeLayer.id, { text: event.target.value });
  };

  const handleFontSizeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!activeLayer) {
      return;
    }
    onFieldChange(activeLayer.id, {
      fontSize: Number(event.target.value),
    });
  };

  const handleColorChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!activeLayer) {
      return;
    }
    onFieldChange(activeLayer.id, { color: event.target.value });
  };

  const handleCoordinateChange = (
    axis: "x" | "y",
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!activeLayer) {
      return;
    }
    onFieldChange(activeLayer.id, {
      [axis]: Number(event.target.value),
    });
  };

  const handleVisibilityToggle = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!activeLayer) {
      return;
    }
    onFieldChange(activeLayer.id, { visible: event.target.checked });
  };

  const activeCoordinateValue = (
    axis: "x" | "y",
  ): string => {
    if (!activeLayer) {
      return "0";
    }
    return Number.isFinite(activeLayer[axis])
      ? activeLayer[axis].toFixed(0)
      : "0";
  };

  return (
    <aside className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/70 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Layers & styles
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Build your label
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAddField}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
          >
            + Add layer
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
          >
            Reset tag
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div className="space-y-3 rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Roster import
              </p>
              <p className="text-sm text-slate-600">
                Upload CSV or Excel files to compare headers with the Tag Builder layers.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDatasetButton}
                disabled={isImportingDataset}
                className={`rounded-full px-4 py-2 text-xs font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
                  isImportingDataset
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-slate-900 hover:bg-slate-700"
                }`}
              >
                {isImportingDataset ? "Reading..." : "Upload file"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="sr-only"
                onChange={handleDatasetChange}
              />
            </div>
          </div>
          {importError ? (
            <p className="text-sm font-semibold text-rose-600" role="alert">
              {importError}
            </p>
          ) : null}
          {importSummary ? (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    {importSummary.fileName}
                  </p>
                  {importTimestamp ? (
                    <p className="text-xs text-slate-500">
                      Imported {importTimestamp}
                    </p>
                  ) : null}
                </div>
                {importStatus ? (
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${importStatus.pill}`}
                  >
                    {importStatus.label}
                  </span>
                ) : null}
              </div>
              {importDescription ? (
                <p
                  className={`text-sm font-medium ${
                    importStatus?.text ?? "text-slate-700"
                  }`}
                >
                  {importDescription}
                </p>
              ) : null}
              <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Headers
                  </dt>
                  <dd className="text-lg font-semibold text-slate-900">
                    {importSummary.headerCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Layers
                  </dt>
                  <dd className="text-lg font-semibold text-slate-900">
                    {importSummary.layerCount}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Rows detected
                  </dt>
                  <dd className="text-lg font-semibold text-slate-900">
                    {importSummary.rowCount}
                  </dd>
                </div>
              </dl>
              {importSummary.headers.length ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Headers found
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {importSummary.headers.map((header, index) => (
                      <span
                        key={`${header}-${index}`}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {header}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Layers
          </p>
          <div className="flex flex-col gap-2">
            {tag.fields.map((field, index) => {
              const isActive = field.id === activeFieldId;
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
                    <p className="font-semibold">
                      {field.name || `Layer ${index + 1}`}
                    </p>
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
                    className={`mt-1 line-clamp-2 text-xs ${
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

        {activeLayer ? (
          <div className="space-y-5 rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="w-full space-y-2 sm:w-auto sm:flex-1 sm:space-y-0">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Layer name
                </p>
                <input
                  className="w-full rounded-2xl border border-white bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  value={activeLayer.name}
                  onChange={handleLayerNameChange}
                />
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                <input
                  type="checkbox"
                  checked={activeLayer.visible}
                  onChange={handleVisibilityToggle}
                />
                Show layer
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Text
              {activeLayer.name.toLowerCase().includes("tagline") ||
              activeLayer.text.length > 50 ? (
                <textarea
                  rows={3}
                  className="w-full rounded-2xl border border-white bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  value={activeLayer.text}
                  onChange={handleTextChange}
                  placeholder="Type anything..."
                />
              ) : (
                <input
                  className="w-full rounded-2xl border border-white bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  value={activeLayer.text}
                  onChange={handleTextChange}
                  placeholder="Type anything..."
                />
              )}
            </label>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <span>Font size</span>
                <span className="tracking-tight text-slate-700">
                  {activeLayer.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min={14}
                max={72}
                value={activeLayer.fontSize}
                onChange={handleFontSizeChange}
                className="w-full accent-slate-900"
              />
            </div>

            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Color
              <input
                type="color"
                value={activeLayer.color}
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
                    value={activeCoordinateValue(axis)}
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

            <button
              type="button"
              disabled={!canRemove}
              onClick={() =>
                activeLayer ? onRemoveField(activeLayer.id) : undefined
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition enabled:hover:border-red-500 enabled:hover:text-red-600 disabled:opacity-40"
            >
              Remove layer
            </button>
            <p className="text-xs text-slate-500">
              Coordinates update automatically while you drag this layer
              around the preview.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
            Add your first layer to start customizing the label.
          </div>
        )}

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
