"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [previewRecordIndex, setPreviewRecordIndex] = useState(0);

  // Get current preview data
  const currentPreviewData = useMemo(() => {
    if (!isPreviewMode || datasetRows.length === 0) {
      return undefined;
    }
    return datasetRows[previewRecordIndex];
  }, [isPreviewMode, datasetRows, previewRecordIndex]);

  // Ensure preview record index is valid when dataset changes
  useEffect(() => {
    if (previewRecordIndex >= datasetRows.length && datasetRows.length > 0) {
      setPreviewRecordIndex(datasetRows.length - 1);
    }
  }, [datasetRows.length, previewRecordIndex]);

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

