"use client";

import { useCallback, useState } from "react";

type UsePrintPreviewReturn = {
  isOpen: boolean;
  handleOpenPrintPreview: () => void;
  handleClosePrintPreview: () => void;
};

export const usePrintPreview = (): UsePrintPreviewReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPrintPreview = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClosePrintPreview = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    handleOpenPrintPreview,
    handleClosePrintPreview,
  };
};

