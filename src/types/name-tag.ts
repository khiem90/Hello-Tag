export type NameTagFieldKey =
  | "greeting"
  | "name"
  | "pronouns"
  | "role"
  | "tagline";

export type NameTagField = {
  id: NameTagFieldKey;
  label: string;
  text: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  visible: boolean;
};

export type NameTagData = {
  fields: Record<NameTagFieldKey, NameTagField>;
  accent: string;
  background: NameTagBackgroundKey;
  textAlign: "left" | "center" | "right";
};

export type NameTagBackgroundKey = "sky" | "sunset" | "charcoal";

export type NameTagFieldUpdate = Partial<
  Omit<NameTagField, "id" | "label">
>;
