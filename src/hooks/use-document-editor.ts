"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clampPercent,
  createBlankField,
  createDefaultDocument,
} from "@/lib/document";
import { createFieldsForDocumentType } from "@/lib/document-types";
import {
  clearStoredDocument,
  loadStoredDocument,
  persistDocument,
} from "@/lib/storage";
import { DocumentData, MergeField, DocumentType } from "@/types/document";

const alignFieldsWithHeaders = (
  fields: MergeField[],
  headers: string[],
): MergeField[] =>
  headers.map((header, index) => {
    const trimmed = header.trim();
    const label = trimmed.length ? trimmed : `Field ${index + 1}`;
    const existing = fields[index];
    return existing
      ? { ...existing, name: label, text: `{{${label}}}` }
      : createBlankField(label);
  });

export const useDocumentEditor = () => {
  // Lazy-init from localStorage; loadStoredDocument returns null during SSR,
  // and the editor is only rendered client-side behind the auth gate.
  const [document, setDocument] = useState<DocumentData>(
    () => loadStoredDocument() ?? createDefaultDocument(),
  );
  const [activeField, setActiveField] = useState<string>(
    () => document.fields[0]?.id ?? "",
  );

  // Persist document changes, debounced
  useEffect(() => {
    const handle = window.setTimeout(() => persistDocument(document), 250);
    return () => window.clearTimeout(handle);
  }, [document]);

  const selectField = useCallback((id: string) => {
    setActiveField(id);
  }, []);

  const updateField = useCallback((id: string, patch: Partial<MergeField>) => {
    setDocument((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === id
          ? {
              ...field,
              ...patch,
              ...(patch.x !== undefined && { x: clampPercent(patch.x) }),
              ...(patch.y !== undefined && { y: clampPercent(patch.y) }),
            }
          : field,
      ),
    }));
  }, []);

  const addField = useCallback(() => {
    const newField = createBlankField(`Field ${document.fields.length + 1}`);
    setDocument((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
    setActiveField(newField.id);
  }, [document.fields.length]);

  const removeField = useCallback(
    (id: string) => {
      if (document.fields.length <= 1) {
        return;
      }
      const filtered = document.fields.filter((field) => field.id !== id);
      if (filtered.length === document.fields.length) {
        return;
      }
      setDocument((prev) => ({ ...prev, fields: filtered }));
      if (activeField === id) {
        setActiveField(filtered[filtered.length - 1]?.id ?? "");
      }
    },
    [document.fields, activeField],
  );

  const handleThemeChange = useCallback(
    (
      update: Partial<
        Pick<DocumentData, "accent" | "background" | "textAlign" | "customBackground">
      >,
    ) => {
      setDocument((prev) => ({ ...prev, ...update }));
    },
    [],
  );

  const handleDocumentTypeChange = useCallback((type: DocumentType) => {
    const fields = createFieldsForDocumentType(type);
    setDocument((prev) => ({ ...prev, documentType: type, fields }));
    setActiveField(fields[0]?.id ?? "");
  }, []);

  const handleReset = useCallback(() => {
    const defaults = createDefaultDocument(document.documentType);
    setDocument(defaults);
    setActiveField(defaults.fields[0]?.id ?? "");
    clearStoredDocument();
  }, [document.documentType]);

  const handleFieldChange = useCallback(
    (id: string, patch: Partial<MergeField>) => {
      setActiveField(id);
      updateField(id, patch);
    },
    [updateField],
  );

  const syncFieldsToHeaders = useCallback(
    (headers: string[]) => {
      if (!headers.length) {
        return;
      }
      const fields = alignFieldsWithHeaders(document.fields, headers);
      setDocument((prev) => ({ ...prev, fields }));
      setActiveField(fields[0]?.id ?? "");
    },
    [document.fields],
  );

  return {
    document,
    activeField,
    selectField,
    updateField,
    addField,
    removeField,
    handleThemeChange,
    handleDocumentTypeChange,
    handleReset,
    handleFieldChange,
    syncFieldsToHeaders,
  };
};
