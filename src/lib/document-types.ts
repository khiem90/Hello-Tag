import { MergeField, DocumentType } from "@/types/document";

export type DocumentDimensions = {
  orientation: "portrait" | "landscape";
  labelsPerPage?: number;
  labelsPerRow?: number;
  rowsPerPage?: number;
};

export type DocumentTypeConfig = {
  id: DocumentType;
  label: string;
  dimensions: DocumentDimensions;
  defaultFields: Omit<MergeField, "id">[];
  aspectRatio: string;
};

export const createFieldId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `field-${Date.now().toString(36)}-${Math.random()
        .toString(16)
        .slice(2, 8)}`;

// Compact field literal: name, text, position, size, color.
const field = (
  name: string,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  color: string,
): Omit<MergeField, "id"> => ({ name, text, x, y, fontSize, color, visible: true });

export const documentTypes: Record<DocumentType, DocumentTypeConfig> = {
  letter: {
    id: "letter",
    label: "Letter",
    dimensions: { orientation: "portrait" },
    defaultFields: [
      field("Date", "{{Date}}", 85, 5, 14, "#475569"),
      field("Recipient Name", "{{FirstName}} {{LastName}}", 15, 12, 16, "#0f172a"),
      field("Address", "{{Address}}", 15, 17, 14, "#475569"),
      field("Greeting", "Dear {{FirstName}},", 15, 25, 16, "#0f172a"),
      field("Body", "Thank you for your continued support...", 50, 50, 14, "#475569"),
      field("Closing", "Best regards,", 15, 85, 14, "#0f172a"),
    ],
    aspectRatio: "8.5 / 11",
  },
  certificate: {
    id: "certificate",
    label: "Certificate",
    dimensions: { orientation: "landscape" },
    defaultFields: [
      field("Title", "Certificate of Achievement", 50, 15, 36, "#0f172a"),
      field("Subtitle", "This is to certify that", 50, 30, 16, "#475569"),
      field("Recipient", "{{FullName}}", 50, 45, 42, "#0ea5e9"),
      field("Description", "has successfully completed {{Course}}", 50, 60, 18, "#475569"),
      field("Date", "Awarded on {{Date}}", 50, 75, 14, "#64748b"),
      field("Signature", "{{Signature}}", 50, 90, 16, "#0f172a"),
    ],
    aspectRatio: "11 / 8.5",
  },
  label: {
    id: "label",
    label: "Labels",
    dimensions: {
      orientation: "portrait",
      labelsPerPage: 6,
      labelsPerRow: 2,
      rowsPerPage: 3,
    },
    defaultFields: [
      field("Greeting", "Hello, my name is", 50, 15, 18, "#475569"),
      field("Name", "{{Name}}", 50, 35, 48, "#0f172a"),
      field("Title", "{{Title}}", 50, 55, 20, "#475569"),
      field("Company", "{{Company}}", 50, 70, 20, "#475569"),
    ],
    aspectRatio: "3.25 / 3",
  },
  envelope: {
    id: "envelope",
    label: "Envelope",
    dimensions: { orientation: "landscape" },
    defaultFields: [
      field("Return Name", "Your Company Name", 10, 15, 12, "#475569"),
      field("Return Address", "123 Main Street, City, ST 12345", 10, 25, 10, "#64748b"),
      field("Recipient Name", "{{FirstName}} {{LastName}}", 55, 50, 16, "#0f172a"),
      field("Recipient Address", "{{Address}}", 55, 65, 14, "#475569"),
      field("City State Zip", "{{City}}, {{State}} {{Zip}}", 55, 78, 14, "#475569"),
    ],
    aspectRatio: "9.5 / 4.125",
  },
};

export const documentTypeList = Object.values(documentTypes);

export const getDocumentTypeConfig = (type: DocumentType) => documentTypes[type];

export const getAspectRatio = (type: DocumentType) => documentTypes[type].aspectRatio;

export const createFieldsForDocumentType = (type: DocumentType): MergeField[] =>
  documentTypes[type].defaultFields.map((preset) => ({ id: createFieldId(), ...preset }));
