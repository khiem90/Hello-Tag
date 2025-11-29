"use client";

import {
  AlignmentType,
  Document,
  HeightRule,
  Packer,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { backgroundThemes } from "@/lib/name-tag";
import { getDocumentTypeConfig, isMultiLabelDocument } from "@/lib/document-types";
import { DocumentData, MergeField, DocumentType } from "@/types/document";

// Conversion constants
const TWIPS_PER_INCH = 1440;

// Get document dimensions based on type
const getPageDimensions = (type: DocumentType) => {
  const config = getDocumentTypeConfig(type);
  const { width, height, orientation } = config.dimensions;
  
  return {
    width: width * TWIPS_PER_INCH,
    height: height * TWIPS_PER_INCH,
    orientation: orientation === "landscape" ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
  };
};

// Get labels per page config for label document type
const getLabelsConfig = (type: DocumentType) => {
  const config = getDocumentTypeConfig(type);
  const dims = config.dimensions;
  
  return {
    labelsPerPage: dims.labelsPerPage ?? 1,
    labelsPerRow: dims.labelsPerRow ?? 1,
    rowsPerPage: dims.rowsPerPage ?? 1,
  };
};

// Convert hex color to docx format
const hexToDocxColor = (hex: string): string => {
  const cleaned = hex.replace("#", "");
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return cleaned.toUpperCase();
  }
  if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    return cleaned.split("").map((c) => c + c).join("").toUpperCase();
  }
  return "000000";
};

// Get background color
const getBackgroundColor = (doc: DocumentData): string => {
  if (doc.background === "custom") {
    return doc.customBackground || "#f8fafc";
  }
  const theme = backgroundThemes[doc.background];
  if (!theme || !theme.stops.length) {
    return "#ffffff";
  }
  return theme.stops[0].color;
};

const chunk = <T,>(input: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < input.length; i += size) {
    result.push(input.slice(i, i + size));
  }
  return result;
};

// Y threshold for grouping fields on the same line (5% of cell height)
const Y_GROUP_THRESHOLD = 5;

// Group fields by similar Y position
type FieldGroup = {
  yPosition: number;
  fields: MergeField[];
};

const groupFieldsByLine = (fields: MergeField[]): FieldGroup[] => {
  if (fields.length === 0) return [];

  const sorted = [...fields].sort((a, b) => a.y - b.y);
  const groups: FieldGroup[] = [];
  let currentGroup: MergeField[] = [sorted[0]];
  let groupStartY = sorted[0].y;

  for (let i = 1; i < sorted.length; i++) {
    const field = sorted[i];
    if (Math.abs(field.y - groupStartY) <= Y_GROUP_THRESHOLD) {
      currentGroup.push(field);
    } else {
      const avgY = currentGroup.reduce((sum, f) => sum + f.y, 0) / currentGroup.length;
      groups.push({
        yPosition: avgY,
        fields: currentGroup.sort((a, b) => a.x - b.x),
      });
      currentGroup = [field];
      groupStartY = field.y;
    }
  }

  const avgY = currentGroup.reduce((sum, f) => sum + f.y, 0) / currentGroup.length;
  groups.push({
    yPosition: avgY,
    fields: currentGroup.sort((a, b) => a.x - b.x),
  });

  return groups;
};

// Create text content for a group of fields on the same line
const createLineContent = (group: FieldGroup): TextRun[] => {
  const runs: TextRun[] = [];

  group.fields.forEach((field, index) => {
    const color = field.color || "#0f172a";
    const textColor = hexToDocxColor(color);
    const fontSize = Math.max(8, Math.min(200, field.fontSize));

    // Add spacing between fields on the same line
    if (index > 0) {
      const prevField = group.fields[index - 1];
      const gap = field.x - prevField.x;
      const spaces = Math.max(2, Math.round(gap / 10));
      runs.push(new TextRun({ text: " ".repeat(spaces) }));
    }

    runs.push(
      new TextRun({
        text: field.text || " ",
        color: textColor,
        size: fontSize * 2,
        font: "Arial",
        bold: true,
      })
    );
  });

  return runs;
};

// Estimate line height in twips based on font size
const estimateLineHeight = (fontSize: number): number => {
  // Font size is in half-points, line height is typically 1.2x font size
  // Convert to twips (1 point = 20 twips)
  return Math.round(fontSize * 20 * 1.2);
};

// Create paragraphs from fields with absolute positioning
const createParagraphsFromFields = (
  fields: MergeField[],
  docType: DocumentType,
  cellHeightTwips: number = 4800, // Default cell height ~3.33 inches
): Paragraph[] => {
  const visibleFields = fields.filter((f) => f.visible);
  
  if (visibleFields.length === 0) {
    return [new Paragraph({ children: [] })];
  }

  const groups = groupFieldsByLine(visibleFields);
  
  // Track cumulative height used (in twips)
  let cumulativeHeight = 0;
  
  return groups.map((group, index) => {
    const runs = createLineContent(group);
    
    // Determine alignment based on field positions
    const avgX = group.fields.reduce((sum, f) => sum + f.x, 0) / group.fields.length;
    let alignment: (typeof AlignmentType)[keyof typeof AlignmentType];
    
    if (group.fields.length === 1) {
      if (avgX < 35) alignment = AlignmentType.LEFT;
      else if (avgX > 65) alignment = AlignmentType.RIGHT;
      else alignment = AlignmentType.CENTER;
    } else {
      const minX = Math.min(...group.fields.map(f => f.x));
      const maxX = Math.max(...group.fields.map(f => f.x));
      if (maxX - minX > 40) {
        alignment = AlignmentType.LEFT;
      } else {
        alignment = AlignmentType.CENTER;
      }
    }

    // Calculate ABSOLUTE position from top based on Y percentage
    const targetPositionTwips = Math.round((group.yPosition / 100) * cellHeightTwips);
    
    // Calculate spacing needed to reach target position from current position
    // Subtract some offset to account for text being centered on the Y position
    const avgFontSize = group.fields.reduce((sum, f) => sum + f.fontSize, 0) / group.fields.length;
    const lineHeight = estimateLineHeight(avgFontSize);
    const centerOffset = Math.round(lineHeight / 2);
    
    let spacingBefore = Math.max(0, targetPositionTwips - cumulativeHeight - centerOffset);
    
    // Update cumulative height: current spacing + estimated line height
    cumulativeHeight = targetPositionTwips + centerOffset;

    return new Paragraph({
      alignment,
      spacing: { before: spacingBefore, after: 0 },
      children: runs,
    });
  });
};

// Create a label cell for multi-label documents
const createLabelCell = (
  doc: DocumentData,
  fields: MergeField[],
  cellWidth: number,
  cellHeight: number,
): TableCell => {
  const backgroundColor = getBackgroundColor(doc);
  const bgColor = hexToDocxColor(backgroundColor);
  const cellPadding = 100;
  
  // Calculate usable height inside the cell (accounting for padding)
  const usableHeight = cellHeight - (cellPadding * 2);
  const paragraphs = createParagraphsFromFields(fields, doc.documentType, usableHeight);

  return new TableCell({
    width: { size: cellWidth, type: WidthType.DXA },
    verticalAlign: VerticalAlign.TOP,
    children: paragraphs,
    shading: { type: ShadingType.SOLID, color: bgColor, fill: bgColor },
    margins: { top: cellPadding, bottom: cellPadding, left: cellPadding, right: cellPadding },
  });
};

// Create label table for multi-label document types
const createLabelTable = (
  doc: DocumentData,
  documentsData: MergeField[][],
): Table => {
  const config = getLabelsConfig(doc.documentType);
  const pageDims = getPageDimensions(doc.documentType);
  
  const pageMargin = 0.5 * TWIPS_PER_INCH;
  const printableWidth = pageDims.width - pageMargin * 2;
  const printableHeight = pageDims.height - pageMargin * 2;
  
  const cellWidth = Math.floor(printableWidth / config.labelsPerRow);
  const rowHeight = Math.floor(printableHeight / config.rowsPerPage);
  
  const backgroundColor = getBackgroundColor(doc);
  const bgColor = hexToDocxColor(backgroundColor);

  // Pad to fill page
  const paddedData = [...documentsData];
  while (paddedData.length < config.labelsPerPage) {
    paddedData.push([]);
  }

  const rows: TableRow[] = [];
  for (let rowIndex = 0; rowIndex < config.rowsPerPage; rowIndex++) {
    const cells: TableCell[] = [];
    for (let colIndex = 0; colIndex < config.labelsPerRow; colIndex++) {
      const labelIndex = rowIndex * config.labelsPerRow + colIndex;
      const fields = paddedData[labelIndex];
      
      if (fields && fields.length) {
        cells.push(createLabelCell(doc, fields, cellWidth, rowHeight));
      } else {
        cells.push(
          new TableCell({
            width: { size: cellWidth, type: WidthType.DXA },
            children: [new Paragraph({ children: [] })],
            shading: { type: ShadingType.SOLID, color: bgColor, fill: bgColor },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
          })
        );
      }
    }

    rows.push(
      new TableRow({
        children: cells,
        height: { value: rowHeight, rule: HeightRule.ATLEAST },
      })
    );
  }

  return new Table({
    width: { size: printableWidth, type: WidthType.DXA },
    columnWidths: Array(config.labelsPerRow).fill(cellWidth),
    layout: TableLayoutType.FIXED,
    rows,
  });
};

// Create single document page (for letters, certificates, envelopes)
const createSingleDocumentPage = (
  doc: DocumentData,
  fields: MergeField[],
  pageHeight: number,
) => {
  const pageMargin = 0.5 * TWIPS_PER_INCH;
  const usableHeight = pageHeight - (pageMargin * 2);
  const paragraphs = createParagraphsFromFields(fields, doc.documentType, usableHeight);
  return paragraphs;
};

export const buildDocxWithText = async (
  doc: DocumentData,
  documentsData: MergeField[][],
): Promise<Blob> => {
  if (!documentsData.length) {
    throw new Error("No documents available to export.");
  }

  const pageDims = getPageDimensions(doc.documentType);
  const pageMargin = 0.5 * TWIPS_PER_INCH;
  const isMultiLabel = isMultiLabelDocument(doc.documentType);

  if (isMultiLabel) {
    // Multi-label documents (like name tags) - multiple per page
    const config = getLabelsConfig(doc.documentType);
    const sectionChunks = chunk(documentsData, config.labelsPerPage);
    
    const document = new Document({
      sections: sectionChunks.map((group) => ({
        properties: {
          page: {
            size: { width: pageDims.width, height: pageDims.height, orientation: pageDims.orientation },
            margin: {
              top: pageMargin,
              bottom: pageMargin,
              left: pageMargin,
              right: pageMargin,
            },
          },
        },
        children: [createLabelTable(doc, group)],
      })),
    });

    return Packer.toBlob(document);
  } else {
    // Single document per page (letters, certificates, envelopes)
    const document = new Document({
      sections: documentsData.map((fields) => ({
        properties: {
          page: {
            size: { width: pageDims.width, height: pageDims.height, orientation: pageDims.orientation },
            margin: {
              top: pageMargin,
              bottom: pageMargin,
              left: pageMargin,
              right: pageMargin,
            },
          },
        },
        children: createSingleDocumentPage(doc, fields, pageDims.height),
      })),
    });

    return Packer.toBlob(document);
  }
};
