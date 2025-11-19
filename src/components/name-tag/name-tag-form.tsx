"use client";

import {
  accentPalette,
  backgroundThemes,
} from "@/lib/name-tag";
import type { ExportFormat, ImportSummary } from "@/types/import";
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
  exportFormat: ExportFormat;
  onExportFormatChange: (format: ExportFormat) => void;
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
    label: "Perfect Match!",
    pill: "border-2 border-emerald-700 bg-emerald-100 text-emerald-800",
    text: "text-emerald-800",
  },
  "needs-layers": {
    label: "Needs Layers",
    pill: "border-2 border-amber-700 bg-amber-100 text-amber-800",
    text: "text-amber-800",
  },
  "unused-layers": {
    label: "Extra Layers",
    pill: "border-2 border-sky-700 bg-sky-100 text-sky-800",
    text: "text-sky-800",
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
  exportFormat,
  onExportFormatChange,
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
  const exportFormats: { label: string; value: ExportFormat }[] = [
    { label: "Word (.docx)", value: "docx" },
    { label: "Word 97-2003 (.doc)", value: "doc" },
  ];

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
    <aside className="flex flex-col gap-6">
      {/* Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-black bg-white p-4 shadow-cartoon-sm">
        <div className="flex flex-col">
          <p className="font-heading text-xs font-bold uppercase tracking-widest text-slate-400">
            Toolkit
          </p>
          <h2 className="font-heading text-xl font-bold text-soft-graphite">
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
      <Card variant="sticker" className="bg-mint-gelato/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-mint-gelato text-black">
                <FileText className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg">Roster Import</CardTitle>
             </div>
          </div>
        </CardHeader>
        <CardContent>
           <p className="mb-4 text-sm font-medium text-slate-600">
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

                <div className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1.5">
                   <span className="text-xs font-bold uppercase text-slate-500">Format</span>
                   <select
                      value={exportFormat}
                      onChange={(event) =>
                        onExportFormatChange(event.target.value as ExportFormat)
                      }
                      className="bg-transparent text-sm font-bold text-soft-graphite focus:outline-none"
                   >
                      {exportFormats.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                   </select>
                </div>

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
               <div className="rounded-xl border-2 border-candy-coral bg-red-50 p-3 text-sm font-bold text-candy-coral">
                 ⚠️ {importError}
               </div>
             )}
             {exportError && (
               <div className="rounded-xl border-2 border-candy-coral bg-red-50 p-3 text-sm font-bold text-candy-coral">
                 ⚠️ {exportError}
               </div>
             )}

             {importSummary && (
               <div className="mt-2 space-y-3 rounded-2xl border-2 border-black bg-white p-4 shadow-sm">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                   <div>
                     <p className="font-heading text-sm font-bold text-soft-graphite">{importSummary.fileName}</p>
                     {importTimestamp && <p className="text-xs text-slate-400">{importTimestamp}</p>}
                   </div>
                   {importStatus && (
                     <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${importStatus.pill}`}>
                       {importStatus.label}
                     </span>
                   )}
                 </div>
                 
                 {importDescription && (
                   <p className="text-sm font-medium text-slate-600">{importDescription}</p>
                 )}
                 
                 <div className="grid grid-cols-3 gap-2 text-center">
                   <div className="rounded-xl bg-slate-50 p-2">
                     <div className="text-xs font-bold uppercase text-slate-400">Headers</div>
                     <div className="font-heading text-xl font-bold text-soft-graphite">{importSummary.headerCount}</div>
                   </div>
                   <div className="rounded-xl bg-slate-50 p-2">
                     <div className="text-xs font-bold uppercase text-slate-400">Layers</div>
                     <div className="font-heading text-xl font-bold text-soft-graphite">{importSummary.layerCount}</div>
                   </div>
                   <div className="rounded-xl bg-slate-50 p-2">
                     <div className="text-xs font-bold uppercase text-slate-400">Rows</div>
                     <div className="font-heading text-xl font-bold text-soft-graphite">{importSummary.rowCount}</div>
                   </div>
                 </div>
               </div>
             )}
           </div>
        </CardContent>
      </Card>

      {/* Layers List */}
      <div className="space-y-2">
        <p className="px-1 font-heading text-xs font-bold uppercase tracking-widest text-slate-400">
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
                className={`group relative w-full overflow-hidden rounded-2xl border-2 px-4 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? "border-black bg-bubble-blue text-white shadow-cartoon-sm translate-x-1"
                    : "border-slate-200 bg-white text-slate-600 hover:border-bubble-blue hover:text-bubble-blue"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-heading font-bold">
                    {field.name || `Layer ${index + 1}`}
                  </p>
                  {field.visible ? (
                     <Eye className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-300 group-hover:text-bubble-blue"}`} />
                  ) : (
                     <EyeOff className={`h-4 w-4 ${isActive ? "text-white/70" : "text-slate-300"}`} />
                  )}
                </div>
                <p className={`mt-1 truncate text-xs font-medium ${isActive ? "text-white/90" : "text-slate-400"}`}>
                  {field.text.trim() || "Empty text"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Layer Properties */}
      {activeLayer ? (
        <Card variant="sticker" className="overflow-visible">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-pop-purple text-white">
                <Type className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg">Edit Layer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Name & Visibility */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400">Layer Name</label>
                <input
                  className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-bold text-soft-graphite focus:border-pop-purple focus:outline-none focus:ring-2 focus:ring-pop-purple/20"
                  value={activeLayer.name}
                  onChange={handleLayerNameChange}
                />
              </div>
              <div className="flex flex-col items-center pt-5">
                 <button
                    type="button"
                    onClick={() => onFieldChange(activeLayer.id, { visible: !activeLayer.visible })}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all ${
                      activeLayer.visible 
                        ? "border-black bg-mint-gelato text-black shadow-cartoon-sm" 
                        : "border-slate-200 bg-slate-50 text-slate-300"
                    }`}
                 >
                   {activeLayer.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                 </button>
              </div>
            </div>

            {/* Text Input */}
            <div>
               <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400">Text Content</label>
               {activeLayer.name.toLowerCase().includes("tagline") || activeLayer.text.length > 50 ? (
                 <textarea
                   rows={3}
                   className="w-full resize-none rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-medium text-soft-graphite focus:border-pop-purple focus:outline-none focus:ring-2 focus:ring-pop-purple/20"
                   value={activeLayer.text}
                   onChange={handleTextChange}
                   placeholder="Type something fun..."
                 />
               ) : (
                 <input
                   className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-medium text-soft-graphite focus:border-pop-purple focus:outline-none focus:ring-2 focus:ring-pop-purple/20"
                   value={activeLayer.text}
                   onChange={handleTextChange}
                   placeholder="Type something fun..."
                 />
               )}
            </div>

            {/* Styles: Font Size & Color */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="mb-1 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-400">
                   <span>Size</span>
                   <span>{activeLayer.fontSize}px</span>
                 </label>
                 <input
                   type="range"
                   min={14}
                   max={96}
                   value={activeLayer.fontSize}
                   onChange={handleFontSizeChange}
                   className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-pop-purple"
                 />
               </div>
               <div>
                 <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400">Color</label>
                 <div className="flex items-center gap-2">
                   <input
                     type="color"
                     value={activeLayer.color}
                     onChange={handleColorChange}
                     className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border-2 border-black p-0 shadow-sm"
                   />
                   <span className="text-xs font-mono text-slate-500">{activeLayer.color}</span>
                 </div>
               </div>
            </div>

            {/* Coordinates */}
            <div className="rounded-xl bg-slate-50 p-3">
               <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Position (%)</p>
               <div className="grid grid-cols-2 gap-3">
                 {(["x", "y"] as const).map((axis) => (
                   <div key={axis} className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">{axis}</span>
                     <input
                       type="number"
                       value={activeCoordinateValue(axis)}
                       onChange={(event) => handleCoordinateChange(axis, event)}
                       min={0}
                       max={100}
                       className="w-full rounded-lg border-2 border-slate-200 bg-white py-1.5 pl-8 pr-2 text-sm font-bold text-soft-graphite focus:border-pop-purple focus:outline-none"
                     />
                   </div>
                 ))}
               </div>
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
        <div className="flex h-40 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm font-medium text-slate-500">
            No layer selected. Click a layer above to edit!
          </p>
        </div>
      )}

      {/* Global Theme Controls */}
      <Card variant="default" className="bg-white">
         <CardHeader className="pb-2">
           <div className="flex items-center gap-2">
             <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-sunshine-yellow text-black">
               <Palette className="h-4 w-4" />
             </div>
             <CardTitle className="text-lg">Theme</CardTitle>
           </div>
         </CardHeader>
         <CardContent className="space-y-5">
           {/* Accent Color */}
           <div>
             <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Accent Color</p>
             <div className="flex flex-wrap gap-2">
               {accentPalette.map((color) => {
                 const isActive = tag.accent === color;
                 return (
                   <button
                     key={color}
                     type="button"
                     onClick={() => onThemeChange({ accent: color })}
                     className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                       isActive ? "border-black ring-2 ring-black/20 scale-110" : "border-transparent"
                     }`}
                     style={{ backgroundColor: color }}
                     aria-pressed={isActive}
                   />
                 );
               })}
               <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-slate-200 bg-white hover:border-slate-400">
                 <span className="absolute inset-0 flex items-center justify-center text-slate-400">+</span>
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
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Background</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(backgroundThemes).map(([key, theme]) => {
                   const typedKey = key as keyof typeof backgroundThemes;
                   const isActive = tag.background === typedKey;
                   return (
                     <button
                       key={key}
                       type="button"
                       onClick={() => onThemeChange({ background: typedKey })}
                       className={`rounded-xl border-2 px-3 py-2 text-xs font-bold transition-all ${
                         isActive
                           ? "border-black bg-slate-800 text-white shadow-cartoon-sm"
                           : "border-slate-200 text-slate-600 hover:border-slate-400"
                       }`}
                     >
                       {theme.label}
                     </button>
                   );
                })}
                <button
                   type="button"
                   onClick={() => onThemeChange({ background: "custom", customBackground: tag.customBackground || "#ffffff" })}
                   className={`rounded-xl border-2 px-3 py-2 text-xs font-bold transition-all ${
                     tag.background === "custom"
                       ? "border-black bg-slate-800 text-white shadow-cartoon-sm"
                       : "border-slate-200 text-slate-600 hover:border-slate-400"
                   }`}
                >
                  Custom
                </button>
              </div>
              {tag.background === "custom" && (
                <div className="mt-2 flex items-center gap-2 rounded-xl border-2 border-slate-100 p-2">
                   <input
                     type="color"
                     value={tag.customBackground || "#ffffff"}
                     onChange={(e) => onThemeChange({ background: "custom", customBackground: e.target.value })}
                     className="h-8 w-8 rounded-lg border border-slate-200 p-0.5"
                   />
                   <span className="text-xs font-medium text-slate-500">Pick a solid color</span>
                </div>
              )}
           </div>

           {/* Text Alignment */}
           <div>
             <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Alignment</p>
             <div className="flex rounded-xl border-2 border-slate-200 p-1">
               {alignOptions.map((align) => {
                 const isActive = tag.textAlign === align;
                 return (
                   <button
                     key={align}
                     type="button"
                     onClick={() => onThemeChange({ textAlign: align })}
                     className={`flex-1 rounded-lg py-1.5 text-xs font-bold capitalize transition-all ${
                       isActive
                         ? "bg-slate-800 text-white shadow-sm"
                         : "text-slate-500 hover:bg-slate-100"
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
