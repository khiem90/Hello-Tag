"use client";

import { accentPalette, backgroundThemes } from "@/lib/name-tag";
import { DocumentData, BackgroundOption } from "@/types/document";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";

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
              const isActive = accent === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onThemeChange({ accent: color })}
                  className={`h-8 w-8 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${
                    isActive
                      ? "border-ink ring-2 ring-ink/10 scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-pressed={isActive}
                  aria-label={`Select accent color ${color}`}
                />
              );
            })}
            <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-ink/10 bg-white hover:border-ink/30">
              <span className="absolute inset-0 flex items-center justify-center text-ink-light">
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
        </div>

        {/* Background Theme */}
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Background</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(backgroundThemes).map(([key, theme]) => {
              const typedKey = key as keyof typeof backgroundThemes;
              const isActive = background === typedKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onThemeChange({ background: typedKey })}
                  className={`rounded-lg border px-3 py-2 text-sm transition-all cursor-pointer ${
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
              onClick={() =>
                onThemeChange({
                  background: "custom",
                  customBackground: customBackground || "#ffffff",
                })
              }
              className={`rounded-lg border px-3 py-2 text-sm transition-all cursor-pointer ${
                background === "custom"
                  ? "border-ink bg-ink text-white"
                  : "border-ink/10 text-ink-light hover:border-ink/20 hover:text-ink"
              }`}
            >
              Custom
            </button>
          </div>
          {background === "custom" && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-ink/5 bg-stone/30 p-2">
              <input
                type="color"
                value={customBackground || "#ffffff"}
                onChange={(e) =>
                  onThemeChange({ background: "custom", customBackground: e.target.value })
                }
                className="h-8 w-8 rounded-lg border border-ink/10 p-0.5 cursor-pointer"
                aria-label="Custom background color"
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
              const isActive = textAlign === align;
              return (
                <button
                  key={align}
                  type="button"
                  onClick={() => onThemeChange({ textAlign: align })}
                  className={`flex-1 rounded-md py-1.5 text-sm capitalize transition-all cursor-pointer ${
                    isActive
                      ? "bg-ink text-white"
                      : "text-ink-light hover:bg-stone/50 hover:text-ink"
                  }`}
                  aria-pressed={isActive}
                >
                  {align}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

