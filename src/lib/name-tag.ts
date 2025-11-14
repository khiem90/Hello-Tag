import {
  NameTagBackgroundKey,
  NameTagData,
  NameTagField,
  NameTagFieldKey,
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

export const fieldOrder: NameTagFieldKey[] = [
  "greeting",
  "name",
  "pronouns",
  "role",
  "tagline",
];

const defaultFieldSettings: Record<
  NameTagFieldKey,
  Omit<NameTagField, "id" | "label">
> = {
  greeting: {
    text: "Hello, my name is",
    fontSize: 18,
    color: "#475569",
    x: 50,
    y: 22,
    visible: true,
  },
  name: {
    text: "Jordan Avery",
    fontSize: 48,
    color: "#0f172a",
    x: 50,
    y: 45,
    visible: true,
  },
  pronouns: {
    text: "they/them",
    fontSize: 20,
    color: "#475569",
    x: 50,
    y: 58,
    visible: true,
  },
  role: {
    text: "Product Designer / Research Ops",
    fontSize: 20,
    color: "#475569",
    x: 50,
    y: 68,
    visible: true,
  },
  tagline: {
    text: "Ask me about prototyping with low/no code tools.",
    fontSize: 18,
    color: "#475569",
    x: 50,
    y: 80,
    visible: true,
  },
};

const fieldLabels: Record<NameTagFieldKey, string> = {
  greeting: "Greeting",
  name: "Display name",
  pronouns: "Pronouns",
  role: "Role or team",
  tagline: "Tagline",
};

export const clampPercent = (value: number) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 50;
  }
  return Math.min(100, Math.max(0, value));
};

export const createFields = (): Record<
  NameTagFieldKey,
  NameTagField
> => {
  const entries = fieldOrder.map((key) => {
    const base = defaultFieldSettings[key];
    return [
      key,
      {
        id: key,
        label: fieldLabels[key],
        ...base,
      } satisfies NameTagField,
    ] as const;
  });
  return Object.fromEntries(entries) as Record<
    NameTagFieldKey,
    NameTagField
  >;
};

export const createDefaultTag = (): NameTagData => ({
  fields: createFields(),
  accent: accentPalette[0],
  background: "sky",
  customBackground: "#f8fafc",
  textAlign: "center",
});

export const cloneTag = (tag: NameTagData): NameTagData => ({
  accent: tag.accent,
  background: tag.background,
  customBackground: tag.customBackground,
  textAlign: tag.textAlign,
  fields: fieldOrder.reduce(
    (acc, key) => ({
      ...acc,
      [key]: { ...tag.fields[key] },
    }),
    {} as Record<NameTagFieldKey, NameTagField>,
  ),
});
