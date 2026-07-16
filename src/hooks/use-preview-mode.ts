"use client";

import { useCallback, useState } from "react";
import type { DatasetRow } from "@/lib/dataset";

export const usePreviewMode = ({ datasetRows }: { datasetRows: DatasetRow[] }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [rawRecordIndex, setRawRecordIndex] = useState(0);

  // Clamp so a shrinking dataset can't leave the index out of bounds
  const previewRecordIndex = Math.min(
    rawRecordIndex,
    Math.max(datasetRows.length - 1, 0),
  );

  const currentPreviewData = isPreviewMode
    ? datasetRows[previewRecordIndex]
    : undefined;

  const handleTogglePreview = useCallback(() => {
    setIsPreviewMode((prev) => !prev);
  }, []);

  const handleRecordChange = useCallback((index: number) => {
    setRawRecordIndex(index);
  }, []);

  return {
    isPreviewMode,
    previewRecordIndex,
    currentPreviewData,
    handleTogglePreview,
    handleRecordChange,
  };
};
