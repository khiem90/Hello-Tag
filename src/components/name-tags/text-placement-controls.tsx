import {
  axisText,
  positionControls,
  textAlignOptions,
} from "@/lib/name-tag-config";
import {
  Axis,
  LabelPositions,
  PositionKey,
  TextAlignOption,
} from "@/types/name-tag";

type TextPlacementControlsProps = {
  textAlign: TextAlignOption;
  positions: LabelPositions;
  onTextAlignChange: (value: TextAlignOption) => void;
  onAdjustPosition: (key: PositionKey, axis: Axis, value: number) => void;
  onResetPosition: (key: PositionKey) => void;
  onResetAllPositions: () => void;
};

export function TextPlacementControls({
  textAlign,
  positions,
  onTextAlignChange,
  onAdjustPosition,
  onResetPosition,
  onResetAllPositions,
}: TextPlacementControlsProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            Text placement
          </p>
          <p className="text-xs text-slate-500">
            Use quick presets or dial in exact coordinates for each block.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetAllPositions}
          className="text-xs font-semibold text-slate-500 underline-offset-4 transition hover:text-slate-900 hover:underline"
        >
          Reset all positions
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Quick horizontal alignment
        </p>
        <div className="grid grid-cols-3 gap-2">
          {textAlignOptions.map((option) => {
            const isActive = textAlign === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onTextAlignChange(option.value)}
                className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500">
          {
            textAlignOptions.find(
              (alignment) => alignment.value === textAlign,
            )?.description
          }
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Fine tune coordinates
        </p>
        <div className="grid gap-4">
          {positionControls.map((control) => {
            const pos = positions[control.key];
            return (
              <div
                key={control.key}
                className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {control.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      {control.helper}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onResetPosition(control.key)}
                    className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-3">
                  {(["x", "y"] as const).map((axis) => {
                    const axisMeta = axisText[axis];
                    const sliderId = `${control.key}-${axis}`;
                    return (
                      <div key={axis} className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <label
                            htmlFor={sliderId}
                            className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                          >
                            {axisMeta.label}
                          </label>
                          <span className="text-xs text-slate-400">
                            {axisMeta.helper}
                          </span>
                        </div>
                        <input
                          id={sliderId}
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={pos[axis]}
                          onChange={(event) =>
                            onAdjustPosition(
                              control.key,
                              axis,
                              Number(event.target.value),
                            )
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.5}
                            value={Number(pos[axis].toFixed(1))}
                            onChange={(event) =>
                              onAdjustPosition(
                                control.key,
                                axis,
                                Number(event.target.value),
                              )
                            }
                            className="w-16 rounded-xl border border-slate-200 bg-white px-2 py-1 text-center text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10"
                          />
                          <span className="text-xs text-slate-500">%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
