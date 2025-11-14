import { accentPalette } from "@/lib/name-tag-config";
import { TextPlacementControls } from "@/components/name-tags/text-placement-controls";
import {
  Axis,
  NameTagDraft,
  PositionKey,
  TextAlignOption,
} from "@/types/name-tag";
import {
  ChangeEvent,
  FormEvent,
} from "react";

type NameTagFormProps = {
  form: NameTagDraft;
  isEditing: boolean;
  disableSubmit: boolean;
  onFieldChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onAccentPick: (color: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onCancelEdit: () => void;
  onTextAlignChange: (value: TextAlignOption) => void;
  onAdjustPosition: (key: PositionKey, axis: Axis, value: number) => void;
  onResetPosition: (key: PositionKey) => void;
  onResetAllPositions: () => void;
};

export function NameTagForm({
  form,
  isEditing,
  disableSubmit,
  onFieldChange,
  onAccentPick,
  onSubmit,
  onClear,
  onCancelEdit,
  onTextAlignChange,
  onAdjustPosition,
  onResetPosition,
  onResetAllPositions,
}: NameTagFormProps) {
  return (
    <form
      onSubmit={onSubmit}
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
            onClick={onCancelEdit}
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
            onChange={onFieldChange}
            placeholder="e.g. Jordan Avery"
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Role or team
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            name="role"
            value={form.role}
            onChange={onFieldChange}
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
            onChange={onFieldChange}
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
                  onClick={() => onAccentPick(color)}
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
                onChange={onFieldChange}
                className="h-10 w-16 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                aria-label="Pick a custom accent color"
              />
            </label>
          </div>
        </div>

        <TextPlacementControls
          textAlign={form.textAlign}
          positions={form.positions}
          onTextAlignChange={onTextAlignChange}
          onAdjustPosition={onAdjustPosition}
          onResetPosition={onResetPosition}
          onResetAllPositions={onResetAllPositions}
        />
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
          onClick={onClear}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
        >
          Clear form
        </button>
      </div>
    </form>
  );
}
