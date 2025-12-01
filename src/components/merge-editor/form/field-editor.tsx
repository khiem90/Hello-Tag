"use client";

import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Type, Eye, EyeOff, Trash2 } from "lucide-react";
import { MergeField } from "@/types/document";

type FieldEditorProps = {
  field: MergeField | null;
  canRemove: boolean;
  onFieldChange: (id: string, update: Partial<MergeField>) => void;
  onRemoveField: (id: string) => void;
};

export function FieldEditor({
  field,
  canRemove,
  onFieldChange,
  onRemoveField,
}: FieldEditorProps) {
  if (!field) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-ink/10 bg-stone/30 p-6 text-center">
        <p className="text-sm text-ink-light">
          No field selected. Click a field above to edit.
        </p>
      </div>
    );
  }

  const handleFieldNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFieldChange(field.id, { name: event.target.value });
  };

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onFieldChange(field.id, { text: event.target.value });
  };

  const handleFontSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFieldChange(field.id, {
      fontSize: Number(event.target.value),
    });
  };

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFieldChange(field.id, { color: event.target.value });
  };

  const handleCoordinateChange = (
    axis: "x" | "y",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onFieldChange(field.id, {
      [axis]: Number(event.target.value),
    });
  };

  const activeCoordinateValue = (axis: "x" | "y"): string => {
    return Number.isFinite(field[axis]) ? field[axis].toFixed(0) : "0";
  };

  const useTextarea =
    field.name.toLowerCase().includes("body") || field.text.length > 50;

  return (
    <Card variant="elevated" className="overflow-visible bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/5 text-ink">
            <Type className="h-4 w-4" />
          </div>
          <CardTitle>Edit Field</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Name & Visibility */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-ink">
              Field Name
            </label>
            <input
              className="w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
              value={field.name}
              onChange={handleFieldNameChange}
            />
          </div>
          <div className="flex flex-col items-center pt-6">
            <button
              type="button"
              onClick={() => onFieldChange(field.id, { visible: !field.visible })}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                field.visible
                  ? "border-sage bg-sage-light text-sage"
                  : "border-ink/10 bg-stone text-ink-light/50"
              }`}
              aria-label={field.visible ? "Hide field" : "Show field"}
            >
              {field.visible ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Text Input with placeholder hint */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium text-ink">
            <span>Content</span>
            <span className="font-normal text-xs text-terracotta">
              Use {"{{FieldName}}"} for merge
            </span>
          </label>
          {useTextarea ? (
            <textarea
              rows={3}
              className="w-full resize-none rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
              value={field.text}
              onChange={handleTextChange}
              placeholder="{{FirstName}} or static text..."
            />
          ) : (
            <input
              className="w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
              value={field.text}
              onChange={handleTextChange}
              placeholder="{{FirstName}} or static text..."
            />
          )}
        </div>

        {/* Styles: Font Size & Color */}
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <label className="mb-2 flex items-center justify-between text-sm font-medium text-ink">
              <span>Size (px)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={8}
                max={120}
                value={field.fontSize}
                onChange={handleFontSizeChange}
                className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-stone accent-terracotta"
              />
              <input
                type="number"
                min={8}
                max={200}
                value={field.fontSize}
                onChange={handleFontSizeChange}
                className="w-14 shrink-0 rounded-lg border border-ink/10 bg-paper py-1.5 px-2 text-center text-sm text-ink focus:border-terracotta/50 focus:outline-none"
              />
            </div>
          </div>
          <div className="shrink-0">
            <label className="mb-2 block text-sm font-medium text-ink">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={field.color}
                onChange={handleColorChange}
                className="h-9 w-9 cursor-pointer overflow-hidden rounded-lg border border-ink/10 p-0.5"
              />
              <span className="text-xs font-mono text-ink-light">
                {field.color}
              </span>
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
          onClick={() => onRemoveField(field.id)}
          disabled={!canRemove}
          className="w-full gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Field
        </Button>
      </CardContent>
    </Card>
  );
}

