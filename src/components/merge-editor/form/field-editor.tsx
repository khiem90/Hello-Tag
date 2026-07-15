"use client";

import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { MergeField } from "@/types/document";

type FieldEditorProps = {
  field: MergeField | null;
  canRemove: boolean;
  onFieldChange: (id: string, update: Partial<MergeField>) => void;
  onRemoveField: (id: string) => void;
};

const underlineInputBase =
  "rounded-none border-0 border-b border-ink bg-transparent px-0 py-1.5 text-sm text-ink placeholder:text-muted-ink/60 transition-colors duration-[160ms] focus:border-pink focus:outline-none";
const underlineInput = `w-full ${underlineInputBase}`;

export function FieldEditor({
  field,
  canRemove,
  onFieldChange,
  onRemoveField,
}: FieldEditorProps) {
  if (!field) {
    return (
      <section className="p-5">
        <div className="flex h-32 flex-col items-center justify-center border border-dashed border-ink p-6 text-center">
          <p className="pn-eyebrow text-muted-ink">
            No field selected — click a field above to edit
          </p>
        </div>
      </section>
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
    <section className="p-5">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <p className="pn-eyebrow text-ink">Edit field</p>
        <p className="pn-annotation text-pink">
          {`{{ ${field.name || "Field"} }}`}
        </p>
      </div>

      <div className="space-y-5">
        {/* Name & Visibility */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="pn-eyebrow mb-1 block text-muted-ink">
              Field name
            </label>
            <input
              className={underlineInput}
              value={field.name}
              onChange={handleFieldNameChange}
            />
          </div>
          <button
            type="button"
            onClick={() => onFieldChange(field.id, { visible: !field.visible })}
            className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-none border border-ink transition-colors duration-[160ms] ${
              field.visible
                ? "bg-cream text-ink"
                : "bg-transparent text-muted-ink/60"
            }`}
            aria-label={field.visible ? "Hide field" : "Show field"}
            aria-pressed={field.visible}
          >
            {field.visible ? (
              <Eye className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Text Input with placeholder hint */}
        <div>
          <label className="mb-1 flex items-baseline justify-between gap-2">
            <span className="pn-eyebrow text-muted-ink">Content</span>
            <span className="pn-annotation text-pink">
              {"{{ Field Name }} merges data"}
            </span>
          </label>
          {useTextarea ? (
            <textarea
              rows={3}
              className={`${underlineInput} resize-none font-mono`}
              value={field.text}
              onChange={handleTextChange}
              placeholder="{{FirstName}} or static text..."
            />
          ) : (
            <input
              className={`${underlineInput} font-mono`}
              value={field.text}
              onChange={handleTextChange}
              placeholder="{{FirstName}} or static text..."
            />
          )}
        </div>

        {/* Styles: Font Size & Color */}
        <div className="flex gap-4">
          <div className="min-w-0 flex-1">
            <label className="pn-eyebrow mb-1 block text-muted-ink">
              Size (px)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={8}
                max={120}
                value={field.fontSize}
                onChange={handleFontSizeChange}
                className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-none bg-sage accent-pink"
              />
              <input
                type="number"
                min={8}
                max={200}
                value={field.fontSize}
                onChange={handleFontSizeChange}
                className={`${underlineInputBase} w-14 shrink-0 text-center font-mono`}
              />
            </div>
          </div>
          <div className="shrink-0">
            <label className="pn-eyebrow mb-1 block text-muted-ink">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={field.color}
                onChange={handleColorChange}
                className="h-9 w-9 cursor-pointer overflow-hidden rounded-none border border-ink p-0.5"
              />
              <span className="pn-annotation text-muted-ink">
                {field.color}
              </span>
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
          onClick={() => onRemoveField(field.id)}
          disabled={!canRemove}
          className="w-full gap-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete Field
        </Button>
      </div>
    </section>
  );
}
