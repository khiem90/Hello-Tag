import { read, utils } from "xlsx";

export type DatasetSummary = {
  headers: string[];
  rowCount: number;
};

const sanitizeCell = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return String(value).trim();
};

export const readDatasetSummary = async (
  file: Blob,
): Promise<DatasetSummary> => {
  const buffer = await file.arrayBuffer();
  const workbook = read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("The file does not contain any sheets or rows.");
  }
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error("Unable to read the first sheet from the file.");
  }

  const rows = utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    blankrows: false,
    defval: "",
  }) as unknown[][];

  if (!rows.length) {
    return { headers: [], rowCount: 0 };
  }

  const headerRow = rows[0] ?? [];
  const headers = headerRow
    .map((cell) => sanitizeCell(cell))
    .filter((cell) => cell.length > 0);

  const rowCount = rows
    .slice(1)
    .filter((row) =>
      row.some((cell) => sanitizeCell(cell).length > 0),
    ).length;

  return {
    headers,
    rowCount,
  };
};
