"use client";

import {
  accentPalette,
  backgroundThemes,
} from "@/lib/name-tag";
import type { ImportSummary } from "@/types/import";
import { NameTagData, NameTagField } from "@/types/name-tag";
import { ChangeEvent, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  RotateCcw, 
  Save, 
  Upload, 
  Download, 
  Type, 
  Palette, 
  Eye, 
  EyeOff, 
  Trash2, 
  FileText 
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

const importStatusTokens: Record<
  ImportSummary["status"],
  {
    label: string;
    pill: string;
    text: string;
  }
> = {
  match: {
    label: "Perfect Match",
    pill: "border border-sage/30 bg-sage-light text-ink",
    text: "text-ink",
  },
  "needs-layers": {
    label: "Needs Layers",
    pill: "border border-amber-200 bg-amber-50 text-amber-700",
    text: "text-amber-700",
  },
  "unused-layers": {
    label: "Extra Layers",
    pill: "border border-sky-200 bg-sky-50 text-sky-700",
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
    <aside className="flex flex-col gap-6">
      {/* Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/5 bg-white p-4 shadow-soft-sm">
        <div className="flex flex-col">
          <p className="text-xs font-medium text-ink-light tracking-wide">
            Toolkit
          </p>
          <h2 className="font-heading text-lg tracking-tight text-ink">
            Design Controls
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onAddField} size="sm" variant="secondary" className="gap-1">
            <Plus className="h-4 w-4" />
            Add Layer
          </Button>
          <Button onClick={onReset} size="sm" variant="outline" className="gap-1">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          {isAuthenticated && onSaveDesign && (
            <Button onClick={onSaveDesign} size="sm" variant="primary" className="gap-1">
              <Save className="h-4 w-4" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Roster Import Card */}
      <Card variant="elevated" className="bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage/10 text-sage">
                <FileText className="h-4 w-4" />
              </div>
              <CardTitle>Roster Import</CardTitle>
             </div>
          </div>
        </CardHeader>
        <CardContent>
           <p className="mb-4 text-sm text-ink-light">
            Upload CSV or Excel files to create labels in bulk.
           </p>
           
           <div className="flex flex-col gap-3">
             <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={handleDatasetChange}
                />
                <Button 
                  onClick={handleDatasetButton} 
                  disabled={isImportingDataset}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isImportingDataset ? "Reading..." : "Upload File"}
                </Button>

                <Button
                  onClick={onExportLabels}
                  disabled={exportDisabled}
                  variant="primary"
                  size="sm"
                  className="gap-2 ml-auto sm:ml-0"
                >
                  <Download className="h-4 w-4" />
                  {exportButtonLabel}
                </Button>
             </div>

             {importError && (
               <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                 {importError}
               </div>
             )}
             {exportError && (
               <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                 {exportError}
               </div>
             )}

             {importSummary && (
               <div className="mt-2 space-y-3 rounded-xl border border-ink/5 bg-stone/30 p-4">
                 <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                   <div>
                     <p className="font-medium text-sm text-ink">{importSummary.fileName}</p>
                     {importTimestamp && <p className="text-xs text-ink-light">{importTimestamp}</p>}
                   </div>
                   {importStatus && (
                     <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${importStatus.pill}`}>
                       {importStatus.label}
                     </span>
                   )}
                 </div>
                 
                 {importDescription && (
                   <p className="text-sm text-ink-light">{importDescription}</p>
                 )}
                 
                 <div className="grid grid-cols-3 gap-2 text-center">
                   <div className="rounded-lg bg-white p-2">
                     <div className="text-xs text-ink-light">Headers</div>
                     <div className="font-heading text-lg text-ink">{importSummary.headerCount}</div>
                   </div>
                   <div className="rounded-lg bg-white p-2">
                     <div className="text-xs text-ink-light">Layers</div>
                     <div className="font-heading text-lg text-ink">{importSummary.layerCount}</div>
                   </div>
                   <div className="rounded-lg bg-white p-2">
                     <div className="text-xs text-ink-light">Rows</div>
                     <div className="font-heading text-lg text-ink">{importSummary.rowCount}</div>
                   </div>
                 </div>
               </div>
             )}
           </div>
        </CardContent>
      </Card>

      {/* Layers List */}
      <div className="space-y-2">
        <p className="px-1 text-xs font-medium text-ink-light tracking-wide">
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
                className={`group relative w-full overflow-hidden rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? "border-terracotta bg-terracotta/10 text-ink"
                    : "border-ink/10 bg-white text-ink-light hover:border-ink/20 hover:text-ink"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">
                    {field.name || `Layer ${index + 1}`}
                  </p>
                  {field.visible ? (
                     <Eye className={`h-4 w-4 ${isActive ? "text-terracotta" : "text-ink-light/50 group-hover:text-ink-light"}`} />
                  ) : (
                     <EyeOff className={`h-4 w-4 ${isActive ? "text-ink-light" : "text-ink-light/30"}`} />
                  )}
                </div>
                <p className={`mt-1 truncate text-xs ${isActive ? "text-ink-light" : "text-ink-light/70"}`}>
                  {field.text.trim() || "Empty text"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Layer Properties */}
      {activeLayer ? (
        <Card variant="elevated" className="overflow-visible bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/5 text-ink">
                <Type className="h-4 w-4" />
              </div>
              <CardTitle>Edit Layer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Name & Visibility */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-ink">Layer Name</label>
                <input
                  className="w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
                  value={activeLayer.name}
                  onChange={handleLayerNameChange}
                />
              </div>
              <div className="flex flex-col items-center pt-6">
                 <button
                    type="button"
                    onClick={() => onFieldChange(activeLayer.id, { visible: !activeLayer.visible })}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                      activeLayer.visible 
                        ? "border-sage bg-sage-light text-sage" 
                        : "border-ink/10 bg-stone text-ink-light/50"
                    }`}
                 >
                   {activeLayer.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                 </button>
              </div>
            </div>

            {/* Text Input */}
            <div>
               <label className="mb-2 block text-sm font-medium text-ink">Text Content</label>
               {activeLayer.name.toLowerCase().includes("tagline") || activeLayer.text.length > 50 ? (
                 <textarea
                   rows={3}
                   className="w-full resize-none rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
                   value={activeLayer.text}
                   onChange={handleTextChange}
                   placeholder="Type something..."
                 />
               ) : (
                 <input
                   className="w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
                   value={activeLayer.text}
                   onChange={handleTextChange}
                   placeholder="Type something..."
                 />
               )}
            </div>

            {/* Styles: Font Size & Color */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="mb-2 flex items-center justify-between text-sm font-medium text-ink">
                   <span>Size</span>
                   <span className="text-ink-light">{activeLayer.fontSize}px</span>
                 </label>
                 <input
                   type="range"
                   min={14}
                   max={96}
                   value={activeLayer.fontSize}
                   onChange={handleFontSizeChange}
                   className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone accent-terracotta"
                 />
               </div>
               <div>
                 <label className="mb-2 block text-sm font-medium text-ink">Color</label>
                 <div className="flex items-center gap-2">
                   <input
                     type="color"
                     value={activeLayer.color}
                     onChange={handleColorChange}
                     className="h-9 w-9 cursor-pointer overflow-hidden rounded-lg border border-ink/10 p-0.5"
                   />
                   <span className="text-xs font-mono text-ink-light">{activeLayer.color}</span>
                 </div>
               </div>
            </div>

            {/* Position */}
            <div className="rounded-lg bg-stone/50 p-3">
               <p className="mb-3 text-sm font-medium text-ink">Position (%)</p>
               <div className="space-y-3">
                 {/* X Position */}
                 <div className="flex items-center gap-3">
                   <span className="w-6 text-xs font-medium text-ink-light">X</span>
                   <input
                     type="range"
                     min={0}
                     max={100}
                     value={activeCoordinateValue("x")}
                     onChange={(e) => handleCoordinateChange("x", e)}
                     className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-white accent-terracotta"
                   />
                   <input
                     type="number"
                     value={activeCoordinateValue("x")}
                     onChange={(e) => handleCoordinateChange("x", e)}
                     min={0}
                     max={100}
                     className="w-14 rounded-lg border border-ink/10 bg-white py-1.5 px-2 text-center text-sm text-ink focus:border-terracotta/50 focus:outline-none"
                   />
                 </div>
                 {/* Y Position */}
                 <div className="flex items-center gap-3">
                   <span className="w-6 text-xs font-medium text-ink-light">Y</span>
                   <input
                     type="range"
                     min={0}
                     max={100}
                     value={activeCoordinateValue("y")}
                     onChange={(e) => handleCoordinateChange("y", e)}
                     className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-white accent-terracotta"
                   />
                   <input
                     type="number"
                     value={activeCoordinateValue("y")}
                     onChange={(e) => handleCoordinateChange("y", e)}
                     min={0}
                     max={100}
                     className="w-14 rounded-lg border border-ink/10 bg-white py-1.5 px-2 text-center text-sm text-ink focus:border-terracotta/50 focus:outline-none"
                   />
                 </div>
               </div>
               <p className="mt-2 text-xs text-ink-light">
                 Use arrow keys for fine control (Shift for smaller steps)
               </p>
            </div>

            <Button 
              variant="danger" 
              onClick={() => onRemoveField(activeLayer.id)}
              disabled={!canRemove}
              className="w-full gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Layer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-ink/10 bg-stone/30 p-6 text-center">
          <p className="text-sm text-ink-light">
            No layer selected. Click a layer above to edit.
          </p>
        </div>
      )}

      {/* Global Theme Controls */}
      <Card variant="elevated" className="bg-white">
         <CardHeader className="pb-3">
           <div className="flex items-center gap-2">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-terracotta/10 text-terracotta">
               <Palette className="h-4 w-4" />
             </div>
             <CardTitle>Theme</CardTitle>
           </div>
         </CardHeader>
         <CardContent className="space-y-5">
           {/* Accent Color */}
           <div>
             <p className="mb-2 text-sm font-medium text-ink">Accent Color</p>
             <div className="flex flex-wrap gap-2">
               {accentPalette.map((color) => {
                 const isActive = tag.accent === color;
                 return (
                   <button
                     key={color}
                     type="button"
                     onClick={() => onThemeChange({ accent: color })}
                     className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                       isActive ? "border-ink ring-2 ring-ink/10 scale-110" : "border-transparent"
                     }`}
                     style={{ backgroundColor: color }}
                     aria-pressed={isActive}
                   />
                 );
               })}
               <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-ink/10 bg-white hover:border-ink/30">
                 <span className="absolute inset-0 flex items-center justify-center text-ink-light">+</span>
                 <input
                   type="color"
                   value={tag.accent}
                   onChange={(event) => onThemeChange({ accent: event.target.value })}
                   className="absolute -inset-full h-[200%] w-[200%] cursor-pointer opacity-0"
                 />
               </label>
             </div>
           </div>

           {/* Background Theme */}
           <div>
              <p className="mb-2 text-sm font-medium text-ink">Background</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(backgroundThemes).map(([key, theme]) => {
                   const typedKey = key as keyof typeof backgroundThemes;
                   const isActive = tag.background === typedKey;
                   return (
                     <button
                       key={key}
                       type="button"
                       onClick={() => onThemeChange({ background: typedKey })}
                       className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                         isActive
                           ? "border-ink bg-ink text-white"
                           : "border-ink/10 text-ink-light hover:border-ink/20 hover:text-ink"
                       }`}
                     >
                       {theme.label}
                     </button>
                   );
                })}
                <button
                   type="button"
                   onClick={() => onThemeChange({ background: "custom", customBackground: tag.customBackground || "#ffffff" })}
                   className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                     tag.background === "custom"
                       ? "border-ink bg-ink text-white"
                       : "border-ink/10 text-ink-light hover:border-ink/20 hover:text-ink"
                   }`}
                >
                  Custom
                </button>
              </div>
              {tag.background === "custom" && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-ink/5 bg-stone/30 p-2">
                   <input
                     type="color"
                     value={tag.customBackground || "#ffffff"}
                     onChange={(e) => onThemeChange({ background: "custom", customBackground: e.target.value })}
                     className="h-8 w-8 rounded-lg border border-ink/10 p-0.5"
                   />
                   <span className="text-xs text-ink-light">Pick a solid color</span>
                </div>
              )}
           </div>

           {/* Text Alignment */}
           <div>
             <p className="mb-2 text-sm font-medium text-ink">Alignment</p>
             <div className="flex rounded-lg border border-ink/10 p-1">
               {alignOptions.map((align) => {
                 const isActive = tag.textAlign === align;
                 return (
                   <button
                     key={align}
                     type="button"
                     onClick={() => onThemeChange({ textAlign: align })}
                     className={`flex-1 rounded-md py-1.5 text-sm capitalize transition-all ${
                       isActive
                         ? "bg-ink text-white"
                         : "text-ink-light hover:bg-stone/50 hover:text-ink"
                     }`}
                   >
                     {align}
                   </button>
                 );
               })}
             </div>
           </div>
         </CardContent>
      </Card>
    </aside>
  );
}
