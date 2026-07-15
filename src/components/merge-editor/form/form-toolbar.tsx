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
    <section className="flex flex-wrap items-center justify-between gap-3 p-5">
      <div className="flex flex-col">
        <p className="pn-eyebrow text-muted-ink">Properties</p>
        <h2 className="font-display text-xl tracking-[-0.02em] text-ink">
          Merge controls
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onAddField}
          size="sm"
          variant="accent"
          className="gap-1"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Field
        </Button>
        <Button onClick={onReset} size="sm" variant="outline" className="gap-1">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </Button>
        {isAuthenticated && onSaveDesign && (
          <Button
            onClick={onSaveDesign}
            size="sm"
            variant="primary"
            className="gap-1"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save
          </Button>
        )}
      </div>
    </section>
  );
}
