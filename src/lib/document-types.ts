import { MergeField, DocumentType } from "@/types/document";

// Document dimensions in inches
export type DocumentDimensions = {
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  labelsPerPage?: number;
  labelsPerRow?: number;
  rowsPerPage?: number;
};

export type DocumentTypeConfig = {
  id: DocumentType;
  label: string;
  description: string;
  icon: string;
  dimensions: DocumentDimensions;
  defaultFields: Omit<MergeField, "id">[];
  aspectRatio: string;
};

const createFieldId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `field-${Date.now().toString(36)}-${Math.random()
        .toString(16)
        .slice(2, 8)}`;

export const documentTypes: Record<DocumentType, DocumentTypeConfig> = {
  letter: {
    id: "letter",
    label: "Letter",
    description: "Full-page letters and documents",
    icon: "FileText",
    dimensions: {
      width: 8.5,
      height: 11,
      orientation: "portrait",
    },
    defaultFields: [
      {
        name: "Date",
        text: "{{Date}}",
        fontSize: 14,
        color: "#475569",
        x: 85,
        y: 5,
        visible: true,
      },
      {
        name: "Recipient Name",
        text: "{{FirstName}} {{LastName}}",
        fontSize: 16,
        color: "#0f172a",
        x: 15,
        y: 12,
        visible: true,
      },
      {
        name: "Address",
        text: "{{Address}}",
        fontSize: 14,
        color: "#475569",
        x: 15,
        y: 17,
        visible: true,
      },
      {
        name: "Greeting",
        text: "Dear {{FirstName}},",
        fontSize: 16,
        color: "#0f172a",
        x: 15,
        y: 25,
        visible: true,
      },
      {
        name: "Body",
        text: "Thank you for your continued support...",
        fontSize: 14,
        color: "#475569",
        x: 50,
        y: 50,
        visible: true,
      },
      {
        name: "Closing",
        text: "Best regards,",
        fontSize: 14,
        color: "#0f172a",
        x: 15,
        y: 85,
        visible: true,
      },
    ],
    aspectRatio: "8.5 / 11",
  },
  certificate: {
    id: "certificate",
    label: "Certificate",
    description: "Awards and recognition certificates",
    icon: "Award",
    dimensions: {
      width: 11,
      height: 8.5,
      orientation: "landscape",
    },
    defaultFields: [
      {
        name: "Title",
        text: "Certificate of Achievement",
        fontSize: 36,
        color: "#0f172a",
        x: 50,
        y: 15,
        visible: true,
      },
      {
        name: "Subtitle",
        text: "This is to certify that",
        fontSize: 16,
        color: "#475569",
        x: 50,
        y: 30,
        visible: true,
      },
      {
        name: "Recipient",
        text: "{{FullName}}",
        fontSize: 42,
        color: "#0ea5e9",
        x: 50,
        y: 45,
        visible: true,
      },
      {
        name: "Description",
        text: "has successfully completed {{Course}}",
        fontSize: 18,
        color: "#475569",
        x: 50,
        y: 60,
        visible: true,
      },
      {
        name: "Date",
        text: "Awarded on {{Date}}",
        fontSize: 14,
        color: "#64748b",
        x: 50,
        y: 75,
        visible: true,
      },
      {
        name: "Signature",
        text: "{{Signature}}",
        fontSize: 16,
        color: "#0f172a",
        x: 50,
        y: 90,
        visible: true,
      },
    ],
    aspectRatio: "11 / 8.5",
  },
  label: {
    id: "label",
    label: "Labels",
    description: "Name tags and address labels",
    icon: "Tag",
    dimensions: {
      width: 8.5,
      height: 11,
      orientation: "portrait",
      labelsPerPage: 6,
      labelsPerRow: 2,
      rowsPerPage: 3,
    },
    defaultFields: [
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
    ],
    aspectRatio: "3.25 / 3",
  },
  envelope: {
    id: "envelope",
    label: "Envelope",
    description: "#10 business envelopes",
    icon: "Mail",
    dimensions: {
      width: 9.5,
      height: 4.125,
      orientation: "landscape",
    },
    defaultFields: [
      {
        name: "Return Name",
        text: "Your Company Name",
        fontSize: 12,
        color: "#475569",
        x: 10,
        y: 15,
        visible: true,
      },
      {
        name: "Return Address",
        text: "123 Main Street, City, ST 12345",
        fontSize: 10,
        color: "#64748b",
        x: 10,
        y: 25,
        visible: true,
      },
      {
        name: "Recipient Name",
        text: "{{FirstName}} {{LastName}}",
        fontSize: 16,
        color: "#0f172a",
        x: 55,
        y: 50,
        visible: true,
      },
      {
        name: "Recipient Address",
        text: "{{Address}}",
        fontSize: 14,
        color: "#475569",
        x: 55,
        y: 65,
        visible: true,
      },
      {
        name: "City State Zip",
        text: "{{City}}, {{State}} {{Zip}}",
        fontSize: 14,
        color: "#475569",
        x: 55,
        y: 78,
        visible: true,
      },
    ],
    aspectRatio: "9.5 / 4.125",
  },
};

export const documentTypeList = Object.values(documentTypes);

export const getDocumentTypeConfig = (type: DocumentType): DocumentTypeConfig => {
  return documentTypes[type];
};

export const createFieldsForDocumentType = (type: DocumentType): MergeField[] => {
  const config = documentTypes[type];
  return config.defaultFields.map((preset) => ({
    id: createFieldId(),
    ...preset,
  }));
};

export const getAspectRatio = (type: DocumentType): string => {
  return documentTypes[type].aspectRatio;
};

export const isMultiLabelDocument = (type: DocumentType): boolean => {
  const config = documentTypes[type];
  return config.dimensions.labelsPerPage !== undefined;
};

