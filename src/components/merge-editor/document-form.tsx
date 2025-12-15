"use client";

import type { ImportSummary } from "@/types/import";
import { DocumentData, MergeField, DocumentType } from "@/types/document";
import {
  DocumentTypeSelector,
  FormToolbar,
  DataSourceCard,
  FieldsList,
  FieldEditor,
  ThemeControls,
} from "./form";

type DocumentFormProps = {
  document: DocumentData;
  activeFieldId: string;
  onSelectField: (id: string) => void;
  onFieldChange: (id: string, update: Partial<MergeField>) => void;
  onAddField: () => void;
  onRemoveField: (id: string) => void;
  onThemeChange: (
    update: Partial<
      Pick<DocumentData, "accent" | "background" | "textAlign" | "customBackground">
    >
  ) => void;
  onDocumentTypeChange: (type: DocumentType) => void;
  onReset: () => void;
  onImportDataset: (file: File) => void;
  importSummary: ImportSummary | null;
  importError: string | null;
  isImportingDataset: boolean;
  canPrint: boolean;
  onOpenPrintPreview: () => void;
  isAuthenticated?: boolean;
  onSaveDesign?: () => void;
};

export function DocumentForm({
  document,
  activeFieldId,
  onSelectField,
  onFieldChange,
  onAddField,
  onRemoveField,
  onThemeChange,
  onDocumentTypeChange,
  onReset,
  onImportDataset,
  importSummary,
  importError,
  isImportingDataset,
  canPrint,
  onOpenPrintPreview,
  isAuthenticated = false,
  onSaveDesign,
}: DocumentFormProps) {
  const activeField =
    document.fields.find((field) => field.id === activeFieldId) ??
    document.fields[0] ??
    null;
  const canRemove = document.fields.length > 1 && activeField !== null;

  return (
    <aside className="flex flex-col gap-6">
      <DocumentTypeSelector
        selectedType={document.documentType}
        onTypeChange={onDocumentTypeChange}
      />

      <FormToolbar
        onAddField={onAddField}
        onReset={onReset}
        isAuthenticated={isAuthenticated}
        onSaveDesign={onSaveDesign}
      />

      <DataSourceCard
        onImportDataset={onImportDataset}
        importSummary={importSummary}
        importError={importError}
        isImportingDataset={isImportingDataset}
        canPrint={canPrint}
        onOpenPrintPreview={onOpenPrintPreview}
      />

      <FieldsList
        fields={document.fields}
        activeFieldId={activeFieldId}
        onSelectField={onSelectField}
      />

      <FieldEditor
        field={activeField}
        canRemove={canRemove}
        onFieldChange={onFieldChange}
        onRemoveField={onRemoveField}
      />

      <ThemeControls
        accent={document.accent}
        background={document.background}
        customBackground={document.customBackground}
        textAlign={document.textAlign}
        onThemeChange={onThemeChange}
      />
    </aside>
  );
}
