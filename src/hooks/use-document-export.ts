"use client";

import { useCallback, useState } from "react";
import { buildDocxWithText } from "@/lib/export";
import { DocumentData, MergeField } from "@/types/document";
import type { DatasetRow } from "@/lib/dataset";

type UseDocumentExportOptions = {
  document: DocumentData;
  datasetRows: DatasetRow[];
};

type UseDocumentExportReturn = {
  isExporting: boolean;
  exportError: string | null;
  canExport: boolean;
  handleExportDocuments: () => Promise<void>;
  clearExportError: () => void;
};

const mapFieldsToRow = (
  fields: MergeField[],
  row: DatasetRow
): MergeField[] =>
  fields.map((field) => {
    // Replace {{FieldName}} placeholders with actual values
    // Use [^}]+ to match any characters including spaces inside the braces
    const resolvedText = field.text.replace(
      /\{\{([^}]+)\}\}/g,
      (match, fieldName) => {
        const trimmedName = fieldName.trim();
        const value = row[trimmedName];
        return typeof value === "string" && value.length > 0 ? value : match;
      }
    );
    return {
      ...field,
      text: resolvedText,
    };
  });

const triggerDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const useDocumentExport = (
  options: UseDocumentExportOptions
): UseDocumentExportReturn => {
  const { document, datasetRows } = options;

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const canExport = datasetRows.length > 0;

  const handleExportDocuments = useCallback(async () => {
    if (!datasetRows.length) {
      setExportError("Upload a CSV or Excel file before exporting.");
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const documentsData: MergeField[][] = [];
      for (const row of datasetRows) {
        const rowFields = mapFieldsToRow(document.fields, row);
        documentsData.push(rowFields);
      }

      if (!documentsData.length) {
        throw new Error("No rows were detected in the imported file.");
      }

      const docBlob = await buildDocxWithText(document, documentsData);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const docTypeName = document.documentType;

      triggerDownload(docBlob, `mail-merge-${docTypeName}-${timestamp}.docx`);
    } catch (error) {
      setExportError(
        error instanceof Error
          ? error.message
          : "Export failed. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  }, [document, datasetRows]);

  const clearExportError = useCallback(() => {
    setExportError(null);
  }, []);

  return {
    isExporting,
    exportError,
    canExport,
    handleExportDocuments,
    clearExportError,
  };
};

