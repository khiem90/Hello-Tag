import {
  BackgroundKey,
  DocumentData,
  DocumentType,
  MergeField,
} from "@/types/document";
import { createFieldsForDocumentType } from "./document-types";

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
  BackgroundKey,
  {
    label: string;
    gradient: string;
    angle: number;
    stops: Array<{ offset: number; color: string }>;
  }
> = {
  sky: {
    label: "Sky",
    gradient:
      "linear-gradient(135deg, #e0f2fe, #fff1f2 45%, #dbeafe 90%)",
    angle: 135,
    stops: [
      { offset: 0, color: "#e0f2fe" },
      { offset: 45, color: "#fff1f2" },
      { offset: 90, color: "#dbeafe" },
    ],
  },
  sunset: {
    label: "Sunset",
    gradient:
      "linear-gradient(135deg, #fef3c7, #fed7aa 50%, #fbcfe8 95%)",
    angle: 135,
    stops: [
      { offset: 0, color: "#fef3c7" },
      { offset: 50, color: "#fed7aa" },
      { offset: 95, color: "#fbcfe8" },
    ],
  },
  charcoal: {
    label: "Charcoal",
    gradient:
      "linear-gradient(145deg, #020617, #0f172a 55%, #1e293b 95%)",
    angle: 145,
    stops: [
      { offset: 0, color: "#020617" },
      { offset: 55, color: "#0f172a" },
      { offset: 95, color: "#1e293b" },
    ],
  },
};

const createFieldId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `field-${Date.now().toString(36)}-${Math.random()
        .toString(16)
        .slice(2, 8)}`;

type FieldPreset = Omit<MergeField, "id">;

const defaultFieldPresets: FieldPreset[] = [
  {
    name: "Greeting",
    text: "Hello, my name is",
    fontSize: 18,
    color: "#475569",
    x: 50,
    y: 15,
    visible: true,
  },
  {
    name: "Name",
    text: "{{Name}}",
    fontSize: 48,
    color: "#0f172a",
    x: 50,
    y: 35,
    visible: true,
  },
  {
    name: "Title",
    text: "{{Title}}",
    fontSize: 20,
    color: "#475569",
    x: 50,
    y: 55,
    visible: true,
  },
  {
    name: "Company",
    text: "{{Company}}",
    fontSize: 20,
    color: "#475569",
    x: 50,
    y: 70,
    visible: true,
  },
  {
    name: "Tagline",
    text: "{{Tagline}}",
    fontSize: 18,
    color: "#475569",
    x: 50,
    y: 85,
    visible: true,
  },
];

const createFieldFromPreset = (preset: FieldPreset): MergeField => ({
  id: createFieldId(),
  ...preset,
});

export const clampPercent = (value: number) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 50;
  }
  return Math.min(100, Math.max(0, value));
};

export const createDefaultDocument = (type: DocumentType = "label"): DocumentData => ({
  documentType: type,
  fields: createFieldsForDocumentType(type),
  accent: accentPalette[0],
  background: "sky",
  customBackground: "#f8fafc",
  textAlign: "center",
});

// Legacy alias
export const createDefaultTag = (): DocumentData => createDefaultDocument("label");

export const createBlankField = (label?: string): MergeField => ({
  id: createFieldId(),
  name: label ?? "New Field",
  text: `{{${label ?? "NewField"}}}`,
  fontSize: 28,
  color: "#0f172a",
  x: 50,
  y: 50,
  visible: true,
});

export const cloneDocument = (doc: DocumentData): DocumentData => ({
  documentType: doc.documentType,
  accent: doc.accent,
  background: doc.background,
  customBackground: doc.customBackground,
  textAlign: doc.textAlign,
  fields: doc.fields.map((field) => ({ ...field })),
});

// Legacy alias
export const cloneTag = cloneDocument;
