import {
  LabelPositions,
  NameTag,
  NameTagDraft,
  PositionKey,
  TextAlignOption,
} from "@/types/name-tag";

export const accentPalette = [
  "#0ea5e9",
  "#22d3ee",
  "#14b8a6",
  "#f97316",
  "#f43f5e",
  "#a855f7",
] as const;

export const textAlignOptions: Array<{
  value: TextAlignOption;
  label: string;
  description: string;
}> = [
  { value: "left", label: "Left", description: "Classic name badge layout" },
  {
    value: "center",
    label: "Center",
    description: "Perfect for short names",
  },
  {
    value: "right",
    label: "Right",
    description: "Modern offset treatment",
  },
];

export type PositionControl = {
  key: PositionKey;
  label: string;
  helper: string;
};

export const positionControls: PositionControl[] = [
  {
    key: "greeting",
    label: "Greeting banner",
    helper: '"Hello / my name is" label',
  },
  {
    key: "name",
    label: "Name",
    helper: "Primary name text",
  },
  {
    key: "role",
    label: "Role or team",
    helper: "Subtitle line",
  },
  {
    key: "tagline",
    label: "Icebreaker",
    helper: "Fun fact or conversation starter",
  },
];

export const axisText: Record<
  "x" | "y",
  { label: string; helper: string }
> = {
  x: {
    label: "Horizontal",
    helper: "0% hugs the left edge, 100% snaps to the right.",
  },
  y: {
    label: "Vertical",
    helper: "0% is the top edge, 100% the bottom edge.",
  },
};

export const createDefaultPositions = (): LabelPositions => ({
  greeting: { x: 50, y: 16 },
  name: { x: 50, y: 46 },
  role: { x: 50, y: 58 },
  tagline: { x: 50, y: 78 },
});

export const clonePositions = (
  positions: LabelPositions,
): LabelPositions => ({
  greeting: { ...positions.greeting },
  name: { ...positions.name },
  role: { ...positions.role },
  tagline: { ...positions.tagline },
});

export const createBlankDraft = (): NameTagDraft => ({
  fullName: "",
  role: "",
  tagline: "",
  accent: accentPalette[0],
  textAlign: "left",
  positions: createDefaultPositions(),
});

export const starterTags: NameTag[] = [
  {
    id: "tag-alex",
    fullName: "Alex Kim",
    role: "Product Designer",
    tagline: "Coffee snob & prototyper",
    accent: "#14b8a6",
    textAlign: "left",
    positions: {
      greeting: { x: 20, y: 18 },
      name: { x: 48, y: 46 },
      role: { x: 49, y: 58 },
      tagline: { x: 48, y: 80 },
    },
  },
  {
    id: "tag-samira",
    fullName: "Samira Patel",
    role: "Developer Advocate",
    tagline: "Ask me about DX",
    accent: "#a855f7",
    textAlign: "center",
    positions: {
      greeting: { x: 50, y: 15 },
      name: { x: 52, y: 40 },
      role: { x: 52, y: 52 },
      tagline: { x: 52, y: 75 },
    },
  },
  {
    id: "tag-lena",
    fullName: "Lena Flores",
    role: "Ops Lead",
    tagline: "Team puzzle master",
    accent: "#f97316",
    textAlign: "right",
    positions: {
      greeting: { x: 80, y: 18 },
      name: { x: 55, y: 50 },
      role: { x: 55, y: 63 },
      tagline: { x: 62, y: 82 },
    },
  },
];
