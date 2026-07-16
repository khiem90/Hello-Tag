import { DocumentData, DocumentType, MergeField } from "@/types/document";
import { accentPalette } from "./document";

export type Template = {
  id: string;
  name: string;
  documentType: DocumentType;
  data: DocumentData;
};

// Compact field literal: id, name, text, position, size, color.
const field = (
  id: string,
  name: string,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  color: string,
): MergeField => ({ id, name, text, x, y, fontSize, color, visible: true });

const template = (
  id: string,
  name: string,
  documentType: DocumentType,
  data: Partial<Omit<DocumentData, "documentType" | "fields">> &
    Pick<DocumentData, "fields">,
): Template => ({
  id,
  name,
  documentType,
  data: {
    documentType,
    accent: accentPalette[0],
    background: "sky",
    customBackground: "#f8fafc",
    textAlign: "center",
    ...data,
  },
});

export const templates: Template[] = [
  // Letters
  template("welcome-letter", "Welcome Letter", "letter", {
    accent: "#5BC8FF",
    background: "custom",
    customBackground: "#FFFFFF",
    textAlign: "left",
    fields: [
      field("l1", "Date", "{{Date}}", 85, 5, 14, "#64748b"),
      field("l2", "Recipient", "Dear {{FirstName}},", 10, 15, 18, "#0f172a"),
      field("l3", "Welcome", "Welcome to {{Company}}!", 10, 25, 24, "#0ea5e9"),
      field("l4", "Body", "We're thrilled to have you join our team...", 50, 45, 14, "#475569"),
      field("l5", "Closing", "Best regards,\nThe {{Company}} Team", 10, 85, 14, "#0f172a"),
    ],
  }),
  template("thank-you-letter", "Thank You Letter", "letter", {
    accent: "#f97316",
    background: "custom",
    customBackground: "#fffbeb",
    textAlign: "left",
    fields: [
      field("ty1", "Greeting", "Dear {{Name}},", 10, 15, 18, "#0f172a"),
      field("ty2", "Title", "Thank You!", 50, 30, 36, "#f97316"),
      field("ty3", "Message", "Your support means everything to us...", 50, 50, 16, "#475569"),
    ],
  }),

  // Certificates
  template("achievement-cert", "Achievement Award", "certificate", {
    accent: "#a855f7",
    fields: [
      field("c1", "Title", "Certificate of Achievement", 50, 15, 32, "#0f172a"),
      field("c2", "Subtitle", "This is to certify that", 50, 30, 16, "#64748b"),
      field("c3", "Recipient", "{{FullName}}", 50, 45, 42, "#a855f7"),
      field("c4", "Description", "has successfully completed {{Course}}", 50, 60, 18, "#475569"),
      field("c5", "Date", "Awarded on {{Date}}", 50, 80, 14, "#64748b"),
    ],
  }),
  template("completion-cert", "Course Completion", "certificate", {
    accent: "#14b8a6",
    background: "charcoal",
    fields: [
      field("cc1", "Header", "CERTIFICATE", 50, 10, 24, "#14b8a6"),
      field("cc2", "Of", "OF COMPLETION", 50, 20, 16, "#94a3b8"),
      field("cc3", "Name", "{{Name}}", 50, 45, 48, "#FFFFFF"),
      field("cc4", "Course", "{{CourseName}}", 50, 65, 20, "#14b8a6"),
    ],
  }),

  // Labels
  template("hello-badge", "Hello Badge", "label", {
    accent: "#FF7865",
    background: "sunset",
    fields: [
      field("h1", "Header", "HELLO", 50, 20, 28, "#FFFFFF"),
      field("h2", "Subheader", "my name is", 50, 35, 14, "#FFFFFF"),
      field("h3", "Name", "{{Name}}", 50, 55, 36, "#FFFFFF"),
      field("h4", "Title", "{{Title}}", 50, 75, 16, "#FED7AA"),
    ],
  }),
  template("conference-badge", "Conference Badge", "label", {
    accent: "#5BC8FF",
    textAlign: "left",
    fields: [
      field("cb1", "Name", "{{Name}}", 15, 35, 32, "#0f172a"),
      field("cb2", "Title", "{{Title}}", 15, 55, 18, "#475569"),
      field("cb3", "Company", "{{Company}}", 15, 70, 16, "#0ea5e9"),
    ],
  }),
  template("minimal-label", "Minimal Label", "label", {
    accent: "#4A4A4A",
    background: "custom",
    customBackground: "#FFFFFF",
    fields: [
      field("ml1", "Name", "{{Name}}", 50, 45, 28, "#000000"),
      field("ml2", "Detail", "{{Detail}}", 50, 65, 14, "#64748b"),
    ],
  }),

  // Envelopes
  template("business-envelope", "Business Envelope", "envelope", {
    accent: "#0ea5e9",
    background: "custom",
    customBackground: "#FFFFFF",
    textAlign: "left",
    fields: [
      field("e1", "Return Name", "{{SenderName}}", 8, 15, 12, "#0f172a"),
      field("e2", "Return Address", "{{SenderAddress}}", 8, 28, 10, "#64748b"),
      field("e3", "Recipient Name", "{{RecipientName}}", 55, 50, 14, "#0f172a"),
      field("e4", "Recipient Address", "{{RecipientAddress}}", 55, 65, 12, "#475569"),
      field("e5", "City State Zip", "{{City}}, {{State}} {{Zip}}", 55, 78, 12, "#475569"),
    ],
  }),
  template("personal-envelope", "Personal Envelope", "envelope", {
    accent: "#f43f5e",
    background: "custom",
    customBackground: "#fef2f2",
    textAlign: "left",
    fields: [
      field("pe1", "From", "From: {{YourName}}", 8, 18, 11, "#475569"),
      field("pe2", "To", "{{RecipientName}}", 55, 50, 16, "#0f172a"),
      field("pe3", "Address", "{{Address}}\n{{City}}, {{State}} {{Zip}}", 55, 68, 12, "#475569"),
    ],
  }),
];
