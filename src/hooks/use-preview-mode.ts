"use client";

import { useCallback, useMemo, useState } from "react";
import type { DatasetRow } from "@/lib/dataset";

type UsePreviewModeOptions = {
  datasetRows: DatasetRow[];
};

type UsePreviewModeReturn = {
  isPreviewMode: boolean;
  previewRecordIndex: number;
  currentPreviewData: DatasetRow | undefined;
  handleTogglePreview: () => void;
  handleRecordChange: (index: number) => void;
  resetPreview: () => void;
};

export const usePreviewMode = (
  options: UsePreviewModeOptions
): UsePreviewModeReturn => {
  const { datasetRows } = options;

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewRecordIndexRaw, setPreviewRecordIndex] = useState(0);

  // Compute a valid clamped index to avoid out-of-bounds access
  const previewRecordIndex = useMemo(() => {
    if (datasetRows.length === 0) return 0;
    return Math.min(previewRecordIndexRaw, datasetRows.length - 1);
  }, [previewRecordIndexRaw, datasetRows.length]);

  // Get current preview data
  const currentPreviewData = useMemo(() => {
    if (!isPreviewMode || datasetRows.length === 0) {
      return undefined;
    }
    return datasetRows[previewRecordIndex];
  }, [isPreviewMode, datasetRows, previewRecordIndex]);

  const handleTogglePreview = useCallback(() => {
    setIsPreviewMode((prev) => !prev);
  }, []);

  const handleRecordChange = useCallback((index: number) => {
    setPreviewRecordIndex(index);
  }, []);

  const resetPreview = useCallback(() => {
    setPreviewRecordIndex(0);
    setIsPreviewMode(false);
  }, []);

  return {
    isPreviewMode,
    previewRecordIndex,
    currentPreviewData,
    handleTogglePreview,
    handleRecordChange,
    resetPreview,
  };
};

