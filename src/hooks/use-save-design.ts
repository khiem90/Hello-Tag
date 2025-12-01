"use client";

import { useCallback, useState } from "react";
import { saveDesignToFirebase } from "@/lib/tag-storage";
import { DocumentData } from "@/types/document";

type UseSaveDesignOptions = {
  document: DocumentData;
};

type UseSaveDesignReturn = {
  showSaveModal: boolean;
  savingStatus: string | null;
  handleOpenSaveModal: () => void;
  handleCloseSaveModal: () => void;
  handleSaveSubmit: (name: string, description?: string) => Promise<void>;
};

export const useSaveDesign = (
  options: UseSaveDesignOptions
): UseSaveDesignReturn => {
  const { document } = options;

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);

  const handleOpenSaveModal = useCallback(() => {
    setShowSaveModal(true);
  }, []);

  const handleCloseSaveModal = useCallback(() => {
    setShowSaveModal(false);
  }, []);

  const handleSaveSubmit = useCallback(
    async (name: string, description?: string) => {
      try {
        setSavingStatus("Saving your design...");
        await saveDesignToFirebase(name, document, description);
        setSavingStatus("Design saved successfully!");
        setTimeout(() => setSavingStatus(null), 3000);
      } catch (error) {
        console.error("Failed to save design", error);
        throw error;
      }
    },
    [document]
  );

  return {
    showSaveModal,
    savingStatus,
    handleOpenSaveModal,
    handleCloseSaveModal,
    handleSaveSubmit,
  };
};

