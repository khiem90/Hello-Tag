"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clampPercent,
  createBlankField,
  createDefaultDocument,
} from "@/lib/name-tag";
import { createFieldsForDocumentType } from "@/lib/document-types";
import {
  clearStoredDocument,
  loadStoredDocument,
  persistDocument,
} from "@/lib/tag-storage";
import { DocumentData, MergeField, DocumentType } from "@/types/document";

type UseDocumentEditorOptions = {
  initialDocumentType?: DocumentType;
};

type UseDocumentEditorReturn = {
  document: DocumentData;
  activeField: string;
  hasLoadedStoredDoc: boolean;
  selectField: (id: string) => void;
  updateField: (id: string, patch: Partial<MergeField>) => void;
  addField: () => void;
  removeField: (id: string) => void;
  handleThemeChange: (
    update: Partial<Pick<DocumentData, "accent" | "background" | "textAlign" | "customBackground">>
  ) => void;
  handleDocumentTypeChange: (type: DocumentType) => void;
  handleReset: () => void;
  handleFieldChange: (id: string, patch: Partial<MergeField>) => void;
  syncFieldsToHeaders: (headers: string[]) => void;
};

const alignFieldsWithHeaders = (
  fields: MergeField[],
  headers: string[],
): {
  fields: MergeField[];
  activeId: string;
} => {
  if (!headers.length) {
    return {
      fields,
      activeId: fields[0]?.id ?? "",
    };
  }

  const normalized = headers.map((header, index) => {
    if (typeof header !== "string") {
      return `Field ${index + 1}`;
    }
    const trimmed = header.trim();
    return trimmed.length ? trimmed : `Field ${index + 1}`;
  });

  const nextFields: MergeField[] = normalized.map((label, index) => {
    const existing = fields[index];
    if (existing) {
      return {
        ...existing,
        name: label,
        text: `{{${label}}}`,
      };
    }
    const placeholder = createBlankField(label);
    return {
      ...placeholder,
      name: label,
      text: `{{${label}}}`,
    };
  });

  return {
    fields: nextFields,
    activeId: nextFields[0]?.id ?? "",
  };
};

export const useDocumentEditor = (
  options: UseDocumentEditorOptions = {}
): UseDocumentEditorReturn => {
  const { initialDocumentType = "label" } = options;
  
  const initialDoc = useMemo(
    () => createDefaultDocument(initialDocumentType),
    [initialDocumentType]
  );
  
  const [document, setDocument] = useState<DocumentData>(initialDoc);
  const [activeField, setActiveField] = useState<string>(
    initialDoc.fields[0]?.id ?? ""
  );
  const [hasLoadedStoredDoc, setHasLoadedStoredDoc] = useState(false);

  // Load stored document on mount
  useEffect(() => {
    const loadDocument = async () => {
      const storedDoc = loadStoredDocument();
      if (storedDoc) {
        // Ensure documentType exists (backward compatibility)
        if (!storedDoc.documentType) {
          storedDoc.documentType = "label";
        }
        setDocument(storedDoc);
        setActiveField(storedDoc.fields[0]?.id ?? "");
      }
      setHasLoadedStoredDoc(true);
    };

    loadDocument();
  }, []);

  // Persist document changes
  useEffect(() => {
    if (!hasLoadedStoredDoc) {
      return;
    }
    const handle = window.setTimeout(() => {
      persistDocument(document);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [document, hasLoadedStoredDoc]);

  const selectField = useCallback((id: string) => {
    setActiveField(id);
  }, []);

  const updateField = useCallback((id: string, patch: Partial<MergeField>) => {
    setDocument((prev) => ({
      ...prev,
      fields: prev.fields.map((field) => {
        if (field.id !== id) {
          return field;
        }
        const next: MergeField = {
          ...field,
          ...patch,
        };
        if (patch.x !== undefined) {
          next.x = clampPercent(patch.x);
        }
        if (patch.y !== undefined) {
          next.y = clampPercent(patch.y);
        }
        return next;
      }),
    }));
  }, []);

  const addField = useCallback(() => {
    setDocument((prev) => {
      const newField = createBlankField(`Field ${prev.fields.length + 1}`);
      setActiveField(newField.id);
      return {
        ...prev,
        fields: [...prev.fields, newField],
      };
    });
  }, []);

  const removeField = useCallback(
    (id: string) => {
      setDocument((prev) => {
        if (prev.fields.length <= 1) {
          return prev;
        }
        const filtered = prev.fields.filter((field) => field.id !== id);
        if (filtered.length === prev.fields.length) {
          return prev;
        }
        if (activeField === id) {
          setActiveField(filtered[filtered.length - 1]?.id ?? "");
        }
        return {
          ...prev,
          fields: filtered,
        };
      });
    },
    [activeField]
  );

  const handleThemeChange = useCallback(
    (
      update: Partial<
        Pick<DocumentData, "accent" | "background" | "textAlign" | "customBackground">
      >
    ) => {
      setDocument((prev) => ({ ...prev, ...update }));
    },
    []
  );

  const handleDocumentTypeChange = useCallback((type: DocumentType) => {
    setDocument((prev) => {
      const newFields = createFieldsForDocumentType(type);
      setActiveField(newFields[0]?.id ?? "");
      return {
        ...prev,
        documentType: type,
        fields: newFields,
      };
    });
  }, []);

  const handleReset = useCallback(() => {
    const defaults = createDefaultDocument(document.documentType);
    setDocument(defaults);
    setActiveField(defaults.fields[0]?.id ?? "");
    clearStoredDocument();
  }, [document.documentType]);

  const handleFieldChange = useCallback(
    (id: string, patch: Partial<MergeField>) => {
      selectField(id);
      updateField(id, patch);
    },
    [selectField, updateField]
  );

  const syncFieldsToHeaders = useCallback((headers: string[]) => {
    if (!headers.length) {
      return;
    }

    let nextActiveId = "";
    setDocument((prev) => {
      const aligned = alignFieldsWithHeaders(prev.fields, headers);
      nextActiveId = aligned.activeId || prev.fields[0]?.id || "";
      return {
        ...prev,
        fields: aligned.fields,
      };
    });
    if (nextActiveId) {
      setActiveField(nextActiveId);
    }
  }, []);

  return {
    document,
    activeField,
    hasLoadedStoredDoc,
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

