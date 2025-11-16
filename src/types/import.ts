export type ImportSummaryStatus =
  | "match"
  | "needs-layers"
  | "unused-layers";

export type ImportSummary = {
  fileName: string;
  headers: string[];
  headerCount: number;
  layerCount: number;
  rowCount: number;
  status: ImportSummaryStatus;
  importedAt: string;
};

export type ExportFormat = "doc" | "docx";
