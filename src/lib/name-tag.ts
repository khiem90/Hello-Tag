import {
  NameTagBackgroundKey,
  NameTagData,
  NameTagField,
} from "@/types/name-tag";

export const accentPalette = [
  "#0ea5e9",
  "#22d3ee",
  "#14b8a6",
  "#f97316",
  "#f43f5e",
  "#a855f7",
  "#facc15",
] as const;

export const backgroundThemes: Record<
  NameTagBackgroundKey,
  {
    label: string;
    gradient: string;
  }
> = {
  sky: {
    label: "Sky",
    gradient:
      "linear-gradient(135deg, #e0f2fe, #fff1f2 45%, #dbeafe 90%)",
  },
  sunset: {
    label: "Sunset",
    gradient:
      "linear-gradient(135deg, #fef3c7, #fed7aa 50%, #fbcfe8 95%)",
  },
  charcoal: {
    label: "Charcoal",
    gradient:
      "linear-gradient(145deg, #020617, #0f172a 55%, #1e293b 95%)",
  },
};

const createLayerId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `layer-${Date.now().toString(36)}-${Math.random()
        .toString(16)
        .slice(2, 8)}`;

type FieldPreset = Omit<NameTagField, "id">;

const defaultFieldPresets: FieldPreset[] = [
  {
    name: "Greeting",
    text: "Hello, my name is",
    fontSize: 18,
    color: "#475569",
    x: 50,
    y: 22,
    visible: true,
  },
  {
    name: "Display name",
    text: "Jordan Avery",
    fontSize: 48,
    color: "#0f172a",
    x: 50,
    y: 45,
    visible: true,
  },
  {
    name: "Pronouns",
    text: "they/them",
    fontSize: 20,
    color: "#475569",
    x: 50,
    y: 58,
    visible: true,
  },
  {
    name: "Role or team",
    text: "Product Designer / Research Ops",
    fontSize: 20,
    color: "#475569",
    x: 50,
    y: 68,
    visible: true,
  },
  {
    name: "Tagline",
    text: "Ask me about prototyping with low/no code tools.",
    fontSize: 18,
    color: "#475569",
    x: 50,
    y: 80,
    visible: true,
  },
];

const createFieldFromPreset = (preset: FieldPreset): NameTagField => ({
  id: createLayerId(),
  ...preset,
});

export const clampPercent = (value: number) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 50;
  }
  return Math.min(100, Math.max(0, value));
};

export const createDefaultTag = (): NameTagData => ({
  fields: defaultFieldPresets.map(createFieldFromPreset),
  accent: accentPalette[0],
  background: "sky",
  customBackground: "#f8fafc",
  textAlign: "center",
});

export const createBlankField = (label?: string): NameTagField => ({
  id: createLayerId(),
  name: label ?? "New layer",
  text: "New text",
  fontSize: 28,
  color: "#0f172a",
  x: 50,
  y: 50,
  visible: true,
});

export const cloneTag = (tag: NameTagData): NameTagData => ({
  accent: tag.accent,
  background: tag.background,
  customBackground: tag.customBackground,
  textAlign: tag.textAlign,
  fields: tag.fields.map((field) => ({ ...field })),
});
