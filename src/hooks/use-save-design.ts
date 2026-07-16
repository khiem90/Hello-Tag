"use client";

import { useCallback, useState } from "react";
import { saveDesignToFirebase } from "@/lib/storage";
import { DocumentData } from "@/types/document";

export const useSaveDesign = ({ document }: { document: DocumentData }) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);

  const handleOpenSaveModal = useCallback(() => setShowSaveModal(true), []);
  const handleCloseSaveModal = useCallback(() => setShowSaveModal(false), []);

  const handleSaveSubmit = useCallback(
    async (name: string, description?: string) => {
      setSavingStatus("Saving your design...");
      try {
        await saveDesignToFirebase(name, document, description);
        setSavingStatus("Design saved successfully!");
        setTimeout(() => setSavingStatus(null), 3000);
      } catch (error) {
        setSavingStatus(null);
        console.error("Failed to save design", error);
        throw error;
      }
    },
    [document],
  );

  return {
    showSaveModal,
    savingStatus,
    handleOpenSaveModal,
    handleCloseSaveModal,
    handleSaveSubmit,
  };
};
