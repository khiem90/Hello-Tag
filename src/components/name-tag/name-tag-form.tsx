"use client";

import {
  accentPalette,
  backgroundThemes,
} from "@/lib/name-tag";
import type { ImportSummary } from "@/types/import";
import { NameTagData, NameTagField } from "@/types/name-tag";
import { ChangeEvent, useMemo, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Plus,
  RotateCcw,
  Save,
  Download,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

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
  canExport: boolean;
  onExportLabels: () => void;
  isExportingLabels: boolean;
  exportError: string | null;
  isAuthenticated?: boolean;
  onSaveDesign?: () => void;
};

const alignOptions: Array<NameTagData["textAlign"]> = [
  "left",
  "center",
  "right",
];

const underlineInputBase =
  "rounded-none border-0 border-b border-ink bg-transparent px-0 py-1.5 text-sm text-ink placeholder:text-muted-ink/60 transition-colors duration-[160ms] focus:border-pink focus:outline-none";
const underlineInput = `w-full ${underlineInputBase}`;

const importStatusTokens: Record<
  ImportSummary["status"],
  {
    label: string;
    pill: string;
    text: string;
  }
> = {
  match: {
    label: "✓ Perfect Match",
    pill: "border border-green bg-green text-white-ink",
    text: "text-ink",
  },
  "needs-layers": {
    label: "! Needs Layers",
    pill: "border border-ink bg-yellow text-ink",
    text: "text-ink",
  },
  "unused-layers": {
    label: "＋ Extra Layers",
    pill: "border border-ink bg-cream text-ink",
    text: "text-ink",
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
  canExport,
  onExportLabels,
  isExportingLabels,
  exportError,
  isAuthenticated = false,
  onSaveDesign,
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

  const exportButtonLabel = isExportingLabels
    ? "Exporting..."
    : importSummary?.rowCount
      ? `Export ${importSummary.rowCount} labels`
      : "Export labels";
  const exportDisabled = !canExport || isExportingLabels;

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

  const activeCoordinateValue = (axis: "x" | "y"): string => {
    if (!activeLayer) {
      return "0";
    }
    return Number.isFinite(activeLayer[axis])
      ? activeLayer[axis].toFixed(0)
      : "0";
  };

  return (
    <aside className="flex flex-col divide-y divide-ink rounded-none border border-ink bg-cream shadow-paper">
      {/* Actions Header */}
      <section className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex flex-col">
          <p className="pn-eyebrow text-muted-ink">Properties</p>
          <h2 className="font-display text-xl tracking-[-0.02em] text-ink">
            Design controls
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onAddField} size="sm" variant="accent" className="gap-1">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Layer
          </Button>
          <Button onClick={onReset} size="sm" variant="outline" className="gap-1">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </Button>
          {isAuthenticated && onSaveDesign && (
            <Button onClick={onSaveDesign} size="sm" variant="primary" className="gap-1">
              <Save className="h-4 w-4" aria-hidden="true" />
              Save
            </Button>
          )}
        </div>
      </section>

      {/* Roster Import */}
      <section className="p-5">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <p className="pn-eyebrow text-ink">01 — Data source</p>
          <p className="pn-hand -rotate-2 text-muted-ink">design once, print many</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleDatasetChange}
          />

          {/* Drop-zone style import trigger */}
          <button
            type="button"
            onClick={handleDatasetButton}
            disabled={isImportingDataset}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-none border border-dashed border-ink bg-cream px-4 py-5 text-center transition-colors duration-[160ms] hover:bg-sage/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Image
              src="/press-notes/running-forms.svg"
              alt=""
              width={120}
              height={40}
            />
            <span className="pn-eyebrow text-ink">
              {isImportingDataset ? "Reading file…" : "Upload CSV / XLSX"}
            </span>
            <span className="pn-annotation text-muted-ink">
              Roster rows become printed labels
            </span>
          </button>

          <Button
            onClick={onExportLabels}
            disabled={exportDisabled}
            variant="primary"
            size="sm"
            className="gap-2 self-start"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {exportButtonLabel}
          </Button>

          {importError && (
            <div className="rounded-none border border-ink bg-yellow/50 p-3" role="alert">
              <p className="pn-annotation text-ink">Import error</p>
              <p className="mt-1 text-sm text-ink">{importError}</p>
            </div>
          )}
          {exportError && (
            <div className="rounded-none border border-ink bg-yellow/50 p-3" role="alert">
              <p className="pn-annotation text-ink">Export error</p>
              <p className="mt-1 text-sm text-ink">{exportError}</p>
            </div>
          )}

          {importSummary && (
            <div className="mt-1 border border-ink bg-cream">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink px-4 py-3">
                <div>
                  <p className="pn-eyebrow text-ink">{importSummary.fileName}</p>
                  {importTimestamp && (
                    <p className="pn-annotation mt-1 text-muted-ink">
                      Imported {importTimestamp}
                    </p>
                  )}
                </div>
                {importStatus && (
                  <span className={`pn-annotation px-2.5 py-1 ${importStatus.pill}`}>
                    {importStatus.label}
                  </span>
                )}
              </div>

              {importDescription && (
                <p className="border-b border-ink px-4 py-3 text-sm text-muted-ink">
                  {importDescription}
                </p>
              )}

              {/* Connected-sheet stats */}
              <div className="grid grid-cols-3 divide-x divide-ink text-center">
                <div className="px-2 py-3">
                  <div className="pn-annotation text-muted-ink">Headers</div>
                  <div className="font-display text-lg text-ink">{importSummary.headerCount}</div>
                </div>
                <div className="px-2 py-3">
                  <div className="pn-annotation text-muted-ink">Layers</div>
                  <div className="font-display text-lg text-ink">{importSummary.layerCount}</div>
                </div>
                <div className="px-2 py-3">
                  <div className="pn-annotation text-muted-ink">Rows</div>
                  <div className="font-display text-lg text-ink">{importSummary.rowCount}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Layers List */}
      <section className="p-5">
        <p className="pn-eyebrow mb-3 text-ink">02 — Layers</p>
        <div className="flex flex-col border-t border-ink/20">
          {tag.fields.map((field, index) => {
            const isActive = field.id === activeFieldId;
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
                      {field.name || `Layer ${index + 1}`}
                    </span>
                  </span>
                  {field.visible ? (
                    <Eye
                      className={`h-4 w-4 ${isActive ? "text-ink" : "text-muted-ink"}`}
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-ink/50" aria-hidden="true" />
                  )}
                </div>
                <p className="mt-1 truncate font-mono text-xs text-muted-ink">
                  {field.text.trim() || "Empty text"}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Layer Properties */}
      {activeLayer ? (
        <section className="p-5">
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <p className="pn-eyebrow text-ink">Edit layer</p>
            <p className="pn-annotation text-pink">
              {`{{ ${activeLayer.name || "Layer"} }}`}
            </p>
          </div>
          <div className="space-y-5">
            {/* Name & Visibility */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="pn-eyebrow mb-1 block text-muted-ink">Layer name</label>
                <input
                  className={underlineInput}
                  value={activeLayer.name}
                  onChange={handleLayerNameChange}
                />
              </div>
              <button
                type="button"
                onClick={() => onFieldChange(activeLayer.id, { visible: !activeLayer.visible })}
                className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-none border border-ink transition-colors duration-[160ms] ${
                  activeLayer.visible
                    ? "bg-cream text-ink"
                    : "bg-transparent text-muted-ink/60"
                }`}
                aria-label={activeLayer.visible ? "Hide layer" : "Show layer"}
                aria-pressed={activeLayer.visible}
              >
                {activeLayer.visible ? (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Text Input */}
            <div>
              <label className="pn-eyebrow mb-1 block text-muted-ink">Text content</label>
              {activeLayer.name.toLowerCase().includes("tagline") || activeLayer.text.length > 50 ? (
                <textarea
                  rows={3}
                  className={`${underlineInput} resize-none font-mono`}
                  value={activeLayer.text}
                  onChange={handleTextChange}
                  placeholder="Type something..."
                />
              ) : (
                <input
                  className={`${underlineInput} font-mono`}
                  value={activeLayer.text}
                  onChange={handleTextChange}
                  placeholder="Type something..."
                />
              )}
            </div>

            {/* Styles: Font Size & Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="pn-eyebrow text-muted-ink">Size</span>
                  <span className="pn-annotation text-muted-ink">{activeLayer.fontSize}px</span>
                </label>
                <input
                  type="range"
                  min={14}
                  max={96}
                  value={activeLayer.fontSize}
                  onChange={handleFontSizeChange}
                  className="h-2 w-full cursor-pointer appearance-none rounded-none bg-sage accent-pink"
                />
              </div>
              <div>
                <label className="pn-eyebrow mb-1 block text-muted-ink">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeLayer.color}
                    onChange={handleColorChange}
                    className="h-9 w-9 cursor-pointer overflow-hidden rounded-none border border-ink p-0.5"
                  />
                  <span className="pn-annotation text-muted-ink">{activeLayer.color}</span>
                </div>
              </div>
            </div>

            {/* Position */}
            <div className="border border-ink/20 p-3">
              <p className="pn-eyebrow mb-3 text-muted-ink">Position (%)</p>
              <div className="space-y-3">
                {/* X Position */}
                <div className="flex items-center gap-3">
                  <span className="pn-eyebrow w-6 text-ink">X</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={activeCoordinateValue("x")}
                    onChange={(e) => handleCoordinateChange("x", e)}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-none bg-sage accent-pink"
                  />
                  <input
                    type="number"
                    value={activeCoordinateValue("x")}
                    onChange={(e) => handleCoordinateChange("x", e)}
                    min={0}
                    max={100}
                    className={`${underlineInputBase} w-14 text-center font-mono`}
                  />
                </div>
                {/* Y Position */}
                <div className="flex items-center gap-3">
                  <span className="pn-eyebrow w-6 text-ink">Y</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={activeCoordinateValue("y")}
                    onChange={(e) => handleCoordinateChange("y", e)}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-none bg-sage accent-pink"
                  />
                  <input
                    type="number"
                    value={activeCoordinateValue("y")}
                    onChange={(e) => handleCoordinateChange("y", e)}
                    min={0}
                    max={100}
                    className={`${underlineInputBase} w-14 text-center font-mono`}
                  />
                </div>
              </div>
              <p className="pn-annotation mt-2 text-muted-ink">
                Arrow keys nudge — hold Shift for fine steps
              </p>
            </div>

            <Button
              variant="danger"
              onClick={() => onRemoveField(activeLayer.id)}
              disabled={!canRemove}
              className="w-full gap-2"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete Layer
            </Button>
          </div>
        </section>
      ) : (
        <section className="p-5">
          <div className="flex h-32 flex-col items-center justify-center border border-dashed border-ink p-6 text-center">
            <p className="pn-eyebrow text-muted-ink">
              No layer selected — click a layer above to edit
            </p>
          </div>
        </section>
      )}

      {/* Global Theme Controls */}
      <section className="p-5">
        <p className="pn-eyebrow mb-4 text-ink">03 — Theme</p>
        <div className="space-y-5">
          {/* Accent Color */}
          <div>
            <p className="pn-eyebrow mb-2 text-muted-ink">Accent color</p>
            <div className="flex flex-wrap items-center gap-2">
              {accentPalette.map((color) => {
                const isActive = tag.accent === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onThemeChange({ accent: color })}
                    className={`h-8 w-8 cursor-pointer rounded-none border border-ink transition-transform duration-[160ms] hover:-translate-y-px ${
                      isActive ? "outline-2 outline-offset-2 outline-ink" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    aria-pressed={isActive}
                    aria-label={`Select accent color ${color}`}
                  />
                );
              })}
              <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-none border border-dashed border-ink bg-cream hover:bg-sage/40">
                <span className="pn-eyebrow absolute inset-0 flex items-center justify-center text-ink">+</span>
                <input
                  type="color"
                  value={tag.accent}
                  onChange={(event) => onThemeChange({ accent: event.target.value })}
                  className="absolute -inset-full h-[200%] w-[200%] cursor-pointer opacity-0"
                  aria-label="Custom accent color"
                />
              </label>
            </div>
            <p className="pn-annotation mt-2 text-muted-ink">
              Selected {tag.accent}
            </p>
          </div>

          {/* Background Theme */}
          <div>
            <p className="pn-eyebrow mb-2 text-muted-ink">Background</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(backgroundThemes).map(([key, theme]) => {
                const typedKey = key as keyof typeof backgroundThemes;
                const isActive = tag.background === typedKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onThemeChange({ background: typedKey })}
                    aria-pressed={isActive}
                    className={`pn-eyebrow cursor-pointer rounded-none border border-ink px-3 py-2 transition-colors duration-[160ms] ${
                      isActive
                        ? "bg-ink text-white-ink"
                        : "bg-transparent text-ink hover:bg-sage/40"
                    }`}
                  >
                    {theme.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => onThemeChange({ background: "custom", customBackground: tag.customBackground || "#ffffff" })}
                aria-pressed={tag.background === "custom"}
                className={`pn-eyebrow cursor-pointer rounded-none border border-ink px-3 py-2 transition-colors duration-[160ms] ${
                  tag.background === "custom"
                    ? "bg-ink text-white-ink"
                    : "bg-transparent text-ink hover:bg-sage/40"
                }`}
              >
                Custom
              </button>
            </div>
            {tag.background === "custom" && (
              <div className="mt-2 flex items-center gap-2 border border-ink/20 p-2">
                <input
                  type="color"
                  value={tag.customBackground || "#ffffff"}
                  onChange={(e) => onThemeChange({ background: "custom", customBackground: e.target.value })}
                  className="h-8 w-8 cursor-pointer rounded-none border border-ink p-0.5"
                  aria-label="Custom background color"
                />
                <span className="pn-annotation text-muted-ink">Pick a solid color</span>
              </div>
            )}
          </div>

          {/* Text Alignment */}
          <div>
            <p className="pn-eyebrow mb-2 text-muted-ink">Alignment</p>
            <div className="flex border border-ink">
              {alignOptions.map((align) => {
                const isActive = tag.textAlign === align;
                return (
                  <button
                    key={align}
                    type="button"
                    onClick={() => onThemeChange({ textAlign: align })}
                    className={`pn-eyebrow flex-1 cursor-pointer rounded-none py-2 transition-colors duration-[160ms] ${
                      isActive
                        ? "bg-ink text-white-ink"
                        : "text-muted-ink hover:bg-sage/40 hover:text-ink"
                    }`}
                    aria-pressed={isActive}
                  >
                    {align}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
