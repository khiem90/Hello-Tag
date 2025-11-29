export type DocumentType = "letter" | "certificate" | "label" | "envelope";

export type MergeField = {
  id: string;
  name: string;
  text: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  visible: boolean;
};

export type BackgroundKey = "sky" | "sunset" | "charcoal";
export type BackgroundOption = BackgroundKey | "custom";

export type DocumentData = {
  documentType: DocumentType;
  fields: MergeField[];
  accent: string;
  background: BackgroundOption;
  customBackground: string;
  textAlign: "left" | "center" | "right";
};

export type MergeFieldUpdate = Partial<Omit<MergeField, "id">>;

// Legacy type aliases for backward compatibility during migration
export type NameTagField = MergeField;
export type NameTagData = DocumentData;
export type NameTagBackgroundKey = BackgroundKey;
export type NameTagBackgroundOption = BackgroundOption;
export type NameTagFieldUpdate = MergeFieldUpdate;

