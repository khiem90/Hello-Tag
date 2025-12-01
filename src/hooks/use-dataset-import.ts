"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readDataset, type DatasetRow } from "@/lib/dataset";
import type { ImportSummary } from "@/types/import";

type UseDatasetImportOptions = {
  fieldCount: number;
  onHeadersImported?: (headers: string[]) => void;
};

type UseDatasetImportReturn = {
  datasetRows: DatasetRow[];
  importSummary: ImportSummary | null;
  importError: string | null;
  isImportingDataset: boolean;
  handleDatasetImport: (file: File) => Promise<void>;
  clearDataset: () => void;
};

const resolveImportStatus = (
  headerCount: number,
  fieldCount: number
): ImportSummary["status"] => {
  if (headerCount === fieldCount) {
    return "match";
  }
  return headerCount > fieldCount ? "needs-layers" : "unused-layers";
};

export const useDatasetImport = (
  options: UseDatasetImportOptions
): UseDatasetImportReturn => {
  const { fieldCount, onHeadersImported } = options;

  const [datasetRows, setDatasetRows] = useState<DatasetRow[]>([]);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImportingDataset, setIsImportingDataset] = useState(false);

  // Update import summary when field count changes
  useEffect(() => {
    setImportSummary((previous) => {
      if (!previous) {
        return previous;
      }
      if (previous.layerCount === fieldCount) {
        return previous;
      }
      return {
        ...previous,
        layerCount: fieldCount,
        status: resolveImportStatus(previous.headerCount, fieldCount),
      };
    });
  }, [fieldCount]);

  // Update import summary when row count changes
  const datasetRowCount = datasetRows.length;
  useEffect(() => {
    setImportSummary((previous) => {
      if (!previous) {
        return previous;
      }
      if (previous.rowCount === datasetRowCount) {
        return previous;
      }
      return {
        ...previous,
        rowCount: datasetRowCount,
      };
    });
  }, [datasetRowCount]);

  const handleDatasetImport = useCallback(
    async (file: File) => {
      setImportError(null);
      setIsImportingDataset(true);

      try {
        const dataset = await readDataset(file);
        const headerCount = dataset.headers.length;
        const rowCount = dataset.rows.length;

        setDatasetRows(dataset.rows);

        if (headerCount > 0 && onHeadersImported) {
          onHeadersImported(dataset.headers);
        }

        const resultingFieldCount = headerCount > 0 ? headerCount : fieldCount;

        setImportSummary({
          fileName: file.name,
          headers: dataset.headers,
          headerCount,
          layerCount: resultingFieldCount,
          rowCount,
          status: resolveImportStatus(headerCount, resultingFieldCount),
          importedAt: new Date().toISOString(),
        });
      } catch (error) {
        setImportSummary(null);
        setDatasetRows([]);
        setImportError(
          error instanceof Error
            ? error.message
            : "Sorry, we couldn't read that file."
        );
      } finally {
        setIsImportingDataset(false);
      }
    },
    [fieldCount, onHeadersImported]
  );

  const clearDataset = useCallback(() => {
    setDatasetRows([]);
    setImportSummary(null);
    setImportError(null);
  }, []);

  return {
    datasetRows,
    importSummary,
    importError,
    isImportingDataset,
    handleDatasetImport,
    clearDataset,
  };
};

