import type { CSSProperties } from "react";
import { BackgroundKey, DocumentData, DocumentType, MergeField } from "@/types/document";
import { createFieldId, createFieldsForDocumentType } from "./document-types";

export const accentPalette = [
  "#0ea5e9",
  "#22d3ee",
  "#14b8a6",
  "#f97316",
  "#f43f5e",
  "#a855f7",
  "#facc15",
] as const;

export const backgroundGradients: Record<BackgroundKey, string> = {
  sky: "linear-gradient(135deg, #e0f2fe, #fff1f2 45%, #dbeafe 90%)",
  sunset: "linear-gradient(135deg, #fef3c7, #fed7aa 50%, #fbcfe8 95%)",
  charcoal: "linear-gradient(145deg, #020617, #0f172a 55%, #1e293b 95%)",
};

export const getBackgroundStyle = (
  doc: Pick<DocumentData, "background" | "customBackground">,
): CSSProperties =>
  doc.background === "custom"
    ? { backgroundColor: doc.customBackground, backgroundImage: "none" }
    : { backgroundColor: "transparent", backgroundImage: backgroundGradients[doc.background] };

export const alignToClass: Record<DocumentData["textAlign"], string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// Replace {{FieldName}} placeholders with values from a dataset row.
// [^}]+ matches any characters, including spaces, inside the braces.
export const resolveFieldText = (
  text: string,
  data?: Record<string, string>,
): string =>
  data
    ? text.replace(/\{\{([^}]+)\}\}/g, (match, name) => data[name.trim()] ?? match)
    : text;

export const clampPercent = (value: number) =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 50;

export const createDefaultDocument = (type: DocumentType = "label"): DocumentData => ({
  documentType: type,
  fields: createFieldsForDocumentType(type),
  accent: accentPalette[0],
  background: "sky",
  customBackground: "#f8fafc",
  textAlign: "center",
});

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
