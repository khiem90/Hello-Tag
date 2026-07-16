"use client";

import { useCallback, useEffect, useState } from "react";
import { readDataset, type DatasetRow } from "@/lib/dataset";
import type { ImportSummary, ImportSummaryStatus } from "@/types/import";

type UseDatasetImportOptions = {
  fieldCount: number;
  onHeadersImported?: (headers: string[]) => void;
};

const resolveImportStatus = (
  headerCount: number,
  fieldCount: number,
): ImportSummaryStatus => {
  if (headerCount === fieldCount) {
    return "match";
  }
  return headerCount > fieldCount ? "needs-layers" : "unused-layers";
};

export const useDatasetImport = ({
  fieldCount,
  onHeadersImported,
}: UseDatasetImportOptions) => {
  const [datasetRows, setDatasetRows] = useState<DatasetRow[]>([]);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImportingDataset, setIsImportingDataset] = useState(false);

  // Keep the summary in sync when fields are added or removed after an import
  useEffect(() => {
    setImportSummary((previous) =>
      previous && previous.layerCount !== fieldCount
        ? {
            ...previous,
            layerCount: fieldCount,
            status: resolveImportStatus(previous.headerCount, fieldCount),
          }
        : previous,
    );
  }, [fieldCount]);

  const handleDatasetImport = useCallback(
    async (file: File) => {
      setImportError(null);
      setIsImportingDataset(true);

      try {
        const dataset = await readDataset(file);
        const headerCount = dataset.headers.length;

        setDatasetRows(dataset.rows);

        if (headerCount > 0) {
          onHeadersImported?.(dataset.headers);
        }

        const resultingFieldCount = headerCount > 0 ? headerCount : fieldCount;

        setImportSummary({
          fileName: file.name,
          headers: dataset.headers,
          headerCount,
          layerCount: resultingFieldCount,
          rowCount: dataset.rows.length,
          status: resolveImportStatus(headerCount, resultingFieldCount),
          importedAt: new Date().toISOString(),
        });
      } catch (error) {
        setImportSummary(null);
        setDatasetRows([]);
        setImportError(
          error instanceof Error
            ? error.message
            : "Sorry, we couldn't read that file.",
        );
      } finally {
        setIsImportingDataset(false);
      }
    },
    [fieldCount, onHeadersImported],
  );

  return {
    datasetRows,
    importSummary,
    importError,
    isImportingDataset,
    handleDatasetImport,
  };
};
