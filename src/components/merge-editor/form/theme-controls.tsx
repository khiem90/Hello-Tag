"use client";

import { accentPalette, backgroundThemes } from "@/lib/name-tag";
import { DocumentData, BackgroundOption } from "@/types/document";

type ThemeControlsProps = {
  accent: string;
  background: BackgroundOption;
  customBackground: string;
  textAlign: DocumentData["textAlign"];
  onThemeChange: (
    update: Partial<
      Pick<DocumentData, "accent" | "background" | "textAlign" | "customBackground">
    >
  ) => void;
};

const alignOptions: Array<DocumentData["textAlign"]> = ["left", "center", "right"];

export function ThemeControls({
  accent,
  background,
  customBackground,
  textAlign,
  onThemeChange,
}: ThemeControlsProps) {
  return (
    <section className="p-5">
      <p className="pn-eyebrow mb-4 text-ink">04 — Theme</p>
      <div className="space-y-5">
        {/* Accent Color */}
        <div>
          <p className="pn-eyebrow mb-2 text-muted-ink">Accent color</p>
          <div className="flex flex-wrap items-center gap-2">
            {accentPalette.map((color) => {
              const isActive = accent === color;
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
              <span className="pn-eyebrow absolute inset-0 flex items-center justify-center text-ink">
                +
              </span>
              <input
                type="color"
                value={accent}
                onChange={(event) => onThemeChange({ accent: event.target.value })}
                className="absolute -inset-full h-[200%] w-[200%] cursor-pointer opacity-0"
                aria-label="Custom accent color"
              />
            </label>
          </div>
          <p className="pn-annotation mt-2 text-muted-ink">
            Selected {accent}
          </p>
        </div>

        {/* Background Theme */}
        <div>
          <p className="pn-eyebrow mb-2 text-muted-ink">Background</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(backgroundThemes).map(([key, theme]) => {
              const typedKey = key as keyof typeof backgroundThemes;
              const isActive = background === typedKey;
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
              onClick={() =>
                onThemeChange({
                  background: "custom",
                  customBackground: customBackground || "#ffffff",
                })
              }
              aria-pressed={background === "custom"}
              className={`pn-eyebrow cursor-pointer rounded-none border border-ink px-3 py-2 transition-colors duration-[160ms] ${
                background === "custom"
                  ? "bg-ink text-white-ink"
                  : "bg-transparent text-ink hover:bg-sage/40"
              }`}
            >
              Custom
            </button>
          </div>
          {background === "custom" && (
            <div className="mt-2 flex items-center gap-2 border border-ink/20 p-2">
              <input
                type="color"
                value={customBackground || "#ffffff"}
                onChange={(e) =>
                  onThemeChange({ background: "custom", customBackground: e.target.value })
                }
                className="h-8 w-8 cursor-pointer rounded-none border border-ink p-0.5"
                aria-label="Custom background color"
              />
              <span className="pn-annotation text-muted-ink">
                Pick a solid color
              </span>
            </div>
          )}
        </div>

        {/* Text Alignment */}
        <div>
          <p className="pn-eyebrow mb-2 text-muted-ink">Alignment</p>
          <div className="flex border border-ink">
            {alignOptions.map((align) => {
              const isActive = textAlign === align;
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
  );
}
