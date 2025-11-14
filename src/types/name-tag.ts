export type NameTagField = {
  id: string;
  name: string;
  text: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  visible: boolean;
};

export type NameTagData = {
  fields: NameTagField[];
  accent: string;
  background: NameTagBackgroundOption;
  customBackground: string;
  textAlign: "left" | "center" | "right";
};

export type NameTagBackgroundKey = "sky" | "sunset" | "charcoal";
export type NameTagBackgroundOption = NameTagBackgroundKey | "custom";

export type NameTagFieldUpdate = Partial<Omit<NameTagField, "id">>;
