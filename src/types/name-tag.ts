export type TextAlignOption = "left" | "center" | "right";
export type Axis = "x" | "y";

export type LabelPositions = {
  greeting: { x: number; y: number };
  name: { x: number; y: number };
  role: { x: number; y: number };
  tagline: { x: number; y: number };
};

export type NameTag = {
  id: string;
  fullName: string;
  role: string;
  tagline: string;
  accent: string;
  textAlign: TextAlignOption;
  positions: LabelPositions;
};

export type NameTagDraft = Omit<NameTag, "id">;
export type PositionKey = keyof LabelPositions;
