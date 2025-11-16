import { read, utils } from "xlsx";

export type DatasetRow = Record<string, string>;

export type DatasetImport = {
  headers: string[];
  rows: DatasetRow[];
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

const ensureUniqueHeaders = (headers: string[]): string[] => {
  const counts = new Map<string, number>();
  return headers.map((header) => {
    const count = counts.get(header) ?? 0;
    counts.set(header, count + 1);
    if (count === 0) {
      return header;
    }
    return `${header} (${count + 1})`;
  });
};

export const readDataset = async (
  file: Blob,
): Promise<DatasetImport> => {
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
    return { headers: [], rows: [] };
  }

  const headerRow = rows[0] ?? [];
  const normalizedHeaders = headerRow.map((cell, index) => {
    const sanitized = sanitizeCell(cell);
    return sanitized.length ? sanitized : `Column ${index + 1}`;
  });
  const headers = ensureUniqueHeaders(normalizedHeaders);

  const dataRows = rows.slice(1).map((cells) => {
    const record: DatasetRow = {};
    headers.forEach((header, index) => {
      record[header] = sanitizeCell(cells[index]);
    });
    return record;
  });

  const filteredRows = dataRows.filter((record) =>
    Object.values(record).some((value) => value.length > 0),
  );

  return {
    headers,
    rows: filteredRows,
  };
};
