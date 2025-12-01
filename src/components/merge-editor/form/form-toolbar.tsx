"use client";

import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Save } from "lucide-react";

type FormToolbarProps = {
  onAddField: () => void;
  onReset: () => void;
  isAuthenticated?: boolean;
  onSaveDesign?: () => void;
};

export function FormToolbar({
  onAddField,
  onReset,
  isAuthenticated = false,
  onSaveDesign,
}: FormToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/5 bg-white p-4 shadow-soft-sm">
      <div className="flex flex-col">
        <p className="text-xs font-medium text-ink-light tracking-wide">
          Toolkit
        </p>
        <h2 className="font-heading text-lg tracking-tight text-ink">
          Merge Controls
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onAddField}
          size="sm"
          variant="secondary"
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
        <Button onClick={onReset} size="sm" variant="outline" className="gap-1">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        {isAuthenticated && onSaveDesign && (
          <Button
            onClick={onSaveDesign}
            size="sm"
            variant="primary"
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        )}
      </div>
    </div>
  );
}

