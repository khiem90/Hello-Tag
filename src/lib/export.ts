"use client";

import {
  AlignmentType,
  Document,
  HeightRule,
  ImageRun,
  Packer,
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
import { NameTagData, NameTagField } from "@/types/name-tag";
import type { ExportFormat } from "@/types/import";

type ParagraphAlignmentValue =
  (typeof AlignmentType)[keyof typeof AlignmentType];

const LABEL_CANVAS_WIDTH = 800;
const LABEL_CANVAS_HEIGHT = 500;
const FIELD_WIDTH_RATIO = 0.82;
const LABELS_PER_PAGE = 6;
const LABELS_PER_ROW = 2;
const ROWS_PER_PAGE = 3;
const TWIPS_PER_INCH = 1440;
const PIXELS_PER_INCH = 72;
const PAGE_MARGIN_IN = 0.15;
const PAGE_WIDTH_TWIPS = 8.5 * TWIPS_PER_INCH;
const PAGE_HEIGHT_TWIPS = 11 * TWIPS_PER_INCH;
const PAGE_MARGIN_TWIPS = PAGE_MARGIN_IN * TWIPS_PER_INCH;
const PRINTABLE_WIDTH_TWIPS =
  PAGE_WIDTH_TWIPS - PAGE_MARGIN_TWIPS * 2;
const PRINTABLE_HEIGHT_TWIPS =
  PAGE_HEIGHT_TWIPS - PAGE_MARGIN_TWIPS * 2;
const LABEL_CELL_WIDTH_TWIPS = Math.floor(
  PRINTABLE_WIDTH_TWIPS / LABELS_PER_ROW,
);

// Google Docs typically enforces 1" margins even when we request less. We keep a slight buffer
// below that (0.9") to reclaim vertical space while still guaranteeing six labels fit on a page.
const SAFE_MARGIN_IN = 0.9;
const SAFE_MARGIN_TWIPS = SAFE_MARGIN_IN * TWIPS_PER_INCH;
const EFFECTIVE_VERTICAL_MARGIN_TWIPS = Math.max(
  PAGE_MARGIN_TWIPS,
  SAFE_MARGIN_TWIPS,
);
const SAFE_PRINTABLE_HEIGHT_TWIPS = Math.min(
  PRINTABLE_HEIGHT_TWIPS,
  PAGE_HEIGHT_TWIPS - EFFECTIVE_VERTICAL_MARGIN_TWIPS * 2,
);
const LABEL_ROW_HEIGHT_TWIPS = Math.floor(
  SAFE_PRINTABLE_HEIGHT_TWIPS / ROWS_PER_PAGE,
);
const CELL_MARGIN_TWIPS = 8;
const AVAILABLE_CELL_WIDTH_TWIPS =
  LABEL_CELL_WIDTH_TWIPS - CELL_MARGIN_TWIPS * 2;
const AVAILABLE_CELL_HEIGHT_TWIPS =
  LABEL_ROW_HEIGHT_TWIPS - CELL_MARGIN_TWIPS * 2;
const LABEL_EXPORT_WIDTH_IN = AVAILABLE_CELL_WIDTH_TWIPS / TWIPS_PER_INCH;
const LABEL_EXPORT_HEIGHT_IN = AVAILABLE_CELL_HEIGHT_TWIPS / TWIPS_PER_INCH;
const LABEL_EXPORT_WIDTH = Math.round(LABEL_EXPORT_WIDTH_IN * PIXELS_PER_INCH);
const LABEL_EXPORT_HEIGHT = Math.round(
  LABEL_EXPORT_HEIGHT_IN * PIXELS_PER_INCH,
);
const LABEL_IMAGE_WIDTH_IN = LABEL_EXPORT_WIDTH_IN.toFixed(3);
const LABEL_IMAGE_HEIGHT_IN = LABEL_EXPORT_HEIGHT_IN.toFixed(3);

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const textAlignToAnchor: Record<NameTagData["textAlign"], string> = {
  left: "start",
  center: "middle",
  right: "end",
};

const computeX = (
  percent: number,
  align: NameTagData["textAlign"],
): number => {
  const center = (percent / 100) * LABEL_CANVAS_WIDTH;
  const offset = (LABEL_CANVAS_WIDTH * FIELD_WIDTH_RATIO) / 2;
  if (align === "left") {
    return center - offset;
  }
  if (align === "right") {
    return center + offset;
  }
  return center;
};

const buildGradient = (
  tag: NameTagData,
): {
  defs: string;
  fill: string;
} => {
  if (tag.background === "custom") {
    return {
      defs: "",
      fill: tag.customBackground || "#f8fafc",
    };
  }
  const theme = backgroundThemes[tag.background];
  if (!theme) {
    return {
      defs: "",
      fill: "#ffffff",
    };
  }
  const gradientId = `grad-${tag.background}`;
  const stops = theme.stops
    .map(
      (stop) =>
        `<stop offset="${stop.offset}%" stop-color="${stop.color}" />`,
    )
    .join("");
  const defs = `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" gradientTransform="rotate(${theme.angle})">
      ${stops}
    </linearGradient>`;
  return {
    defs,
    fill: `url(#${gradientId})`,
  };
};

const splitLines = (value: string): string[] =>
  value.split(/\r?\n/).filter((line) => line.length > 0);

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

// Convert hex color to format expected by docx (hex without #)
const hexToDocxColor = (hex: string): string => {
  // Remove # if present
  const cleaned = hex.replace("#", "");
  // Validate it's a 6-character hex color
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return cleaned.toUpperCase();
  }
  // Try to parse as 3-character hex
  if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    return cleaned
      .split("")
      .map((char) => char + char)
      .join("")
      .toUpperCase();
  }
  return "000000"; // Default to black
};

// Get background color for label cell
const getBackgroundColor = (tag: NameTagData): string => {
  if (tag.background === "custom") {
    return tag.customBackground || "#f8fafc";
  }
  const theme = backgroundThemes[tag.background];
  if (!theme || !theme.stops.length) {
    return "#ffffff";
  }
  // Use the first stop color as the background
  return theme.stops[0].color;
};

const convertYToCellPosition = (
  yPercent: number,
  cellHeightTwips: number,
): number => {
  return (yPercent / 100) * cellHeightTwips;
};

export const buildLabelSvg = (
  tag: NameTagData,
  fields: NameTagField[],
): string => {
  const visibleFields = fields.filter((field) => field.visible);
  const gradient = buildGradient(tag);
  const fieldAlign = tag.textAlign;

  const fieldSvg = visibleFields
    .map((field) => {
      const x = computeX(field.x, fieldAlign);
      const y = (field.y / 100) * LABEL_CANVAS_HEIGHT;
      const lines = splitLines(field.text || " ");
      const anchor = textAlignToAnchor[fieldAlign];
      const fontSize = Math.max(12, field.fontSize);
      const color = field.color || "#0f172a";
      const tspans = lines
        .map((line, index) => {
          const dy = index === 0 ? "0" : "1.2em";
          return `<tspan x="${x}" dy="${dy}">${escapeXml(line)}</tspan>`;
        })
        .join("");
      return `<text
          x="${x}"
          y="${y}"
          fill="${color}"
          font-size="${fontSize}"
          font-family="Inter, 'Segoe UI', system-ui, sans-serif"
          font-weight="600"
          text-anchor="${anchor}"
          dominant-baseline="middle"
        >${tspans}</text>`;
    })
    .join("");

  return `<svg width="${LABEL_CANVAS_WIDTH}" height="${LABEL_CANVAS_HEIGHT}" viewBox="0 0 ${LABEL_CANVAS_WIDTH} ${LABEL_CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${gradient.defs}
    </defs>
    <rect
      x="0"
      y="0"
      width="${LABEL_CANVAS_WIDTH}"
      height="${LABEL_CANVAS_HEIGHT}"
      rx="40"
      fill="${gradient.fill}"
    />
    ${fieldSvg}
  </svg>`;
};

export const svgToPngArrayBuffer = async (
  svg: string,
  width = LABEL_CANVAS_WIDTH,
  height = LABEL_CANVAS_HEIGHT,
): Promise<ArrayBuffer> => {
  const svgBlob = new Blob([svg], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(new Error("Unable to render label preview for export."));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas rendering is not supported in this browser.");
    }
    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Unable to build PNG label for export."));
          }
        },
        "image/png",
        1,
      );
    });
    return await blob.arrayBuffer();
  } finally {
    URL.revokeObjectURL(url);
  }
};

const chunk = <T,>(input: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < input.length; i += size) {
    result.push(input.slice(i, i + size));
  }
  return result;
};

// Create a label cell with editable text elements
const createLabelCellWithText = (
  tag: NameTagData,
  fields: NameTagField[],
): TableCell => {
  const visibleFields = fields.filter((field) => field.visible);
  const backgroundColor = getBackgroundColor(tag);
  const bgColor = hexToDocxColor(backgroundColor);

  const cellWidthTwips = AVAILABLE_CELL_WIDTH_TWIPS;
  const cellHeightTwips = AVAILABLE_CELL_HEIGHT_TWIPS;
  const textAreaHalfWidth = (cellWidthTwips * FIELD_WIDTH_RATIO) / 2;
  const availableHeight = cellHeightTwips;

  // Sort fields vertically to preserve stacking order
  const sortedFields = [...visibleFields].sort((a, b) => a.y - b.y);
  let currentPosition = 0;

  const paragraphs: Paragraph[] = sortedFields.map((field) => {
    const lines = splitLines(field.text || " ");
    const color = field.color || "#0f172a";
    const textColor = hexToDocxColor(color);

    // Determine alignment based on textAlign setting
    let alignment: ParagraphAlignmentValue;
    if (tag.textAlign === "left") {
      alignment = AlignmentType.LEFT;
    } else if (tag.textAlign === "right") {
      alignment = AlignmentType.RIGHT;
    } else {
      alignment = AlignmentType.CENTER;
    }

    // Scale font to stay within available height
    const baseFontSize = Math.max(8, Math.min(72, field.fontSize));
    const maxFontSizeForLines = Math.floor(
      availableHeight / (lines.length * 25),
    );
    const fontSize = Math.max(8, Math.min(baseFontSize, maxFontSizeForLines));

    const lineHeightTwips = Math.round(fontSize * 20 * 1.2);
    const fieldHeight = lineHeightTwips * Math.max(lines.length, 1);

    // Target position within cell
    const targetTop = clamp(
      convertYToCellPosition(field.y, cellHeightTwips),
      0,
      Math.max(0, availableHeight - fieldHeight),
    );
    const desiredSpacing = targetTop - currentPosition;
    const spacingBefore = clamp(
      desiredSpacing,
      0,
      Math.max(0, availableHeight - currentPosition - fieldHeight),
    );
    currentPosition += spacingBefore + fieldHeight;

    // Horizontal indentation
    const centerPosition = (field.x / 100) * cellWidthTwips;
    const leftIndent = clamp(
      centerPosition - textAreaHalfWidth,
      0,
      Math.max(0, cellWidthTwips - textAreaHalfWidth * 2),
    );
    const rightIndent = clamp(
      cellWidthTwips - (centerPosition + textAreaHalfWidth),
      0,
      cellWidthTwips,
    );

    const textRun = new TextRun({
      text: lines.join("\n"),
      color: textColor,
      size: fontSize * 2, // docx uses half-points
      font: "Inter",
      bold: true,
    });

    return new Paragraph({
      alignment,
      spacing: {
        before: Math.round(spacingBefore),
        after: 0,
        line: Math.round(lineHeightTwips),
        lineRule: "atLeast",
      },
      indent: {
        left: tag.textAlign === "left" ? Math.round(leftIndent) : undefined,
        right: tag.textAlign === "right" ? Math.round(rightIndent) : undefined,
      },
      children: [textRun],
    });
  });

  // If no fields, add empty paragraph
  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph(""));
  }

  return new TableCell({
    width: {
      size: LABEL_CELL_WIDTH_TWIPS,
      type: WidthType.DXA,
    },
    verticalAlign: VerticalAlign.TOP,
    children: paragraphs,
    margins: {
      top: CELL_MARGIN_TWIPS,
      bottom: CELL_MARGIN_TWIPS,
      left: CELL_MARGIN_TWIPS,
      right: CELL_MARGIN_TWIPS,
    },
    shading: {
      type: ShadingType.SOLID,
      color: bgColor,
      fill: bgColor,
    },
  });
};

const createLabelTable = (images: ArrayBuffer[]) => {
  const rows: TableRow[] = [];
  for (let rowIndex = 0; rowIndex < ROWS_PER_PAGE; rowIndex += 1) {
    const cells: TableCell[] = [];
    for (let colIndex = 0; colIndex < LABELS_PER_ROW; colIndex += 1) {
      const imageIndex = rowIndex * LABELS_PER_ROW + colIndex;
      const asset = images[imageIndex];
      const paragraph = asset
        ? new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: asset,
                transformation: {
                  width: LABEL_EXPORT_WIDTH,
                  height: LABEL_EXPORT_HEIGHT,
                },
              } as ConstructorParameters<typeof ImageRun>[0]),
            ],
          })
        : new Paragraph("");
      cells.push(
        new TableCell({
          width: {
            size: LABEL_CELL_WIDTH_TWIPS,
            type: WidthType.DXA,
          },
          verticalAlign: VerticalAlign.CENTER,
          children: [paragraph],
          margins: {
            top: CELL_MARGIN_TWIPS,
            bottom: CELL_MARGIN_TWIPS,
            left: CELL_MARGIN_TWIPS,
            right: CELL_MARGIN_TWIPS,
          },
        }),
      );
    }
    rows.push(
      new TableRow({
        children: cells,
        height: {
          value: LABEL_ROW_HEIGHT_TWIPS,
          rule: HeightRule.EXACT,
        },
      }),
    );
  }
  return new Table({
    width: {
      size: PRINTABLE_WIDTH_TWIPS,
      type: WidthType.DXA,
    },
    columnWidths: new Array(LABELS_PER_ROW).fill(
      LABEL_CELL_WIDTH_TWIPS,
    ),
    layout: TableLayoutType.FIXED,
    rows,
  });
};

// Create a label table with editable text
const createLabelTableWithText = (
  tag: NameTagData,
  labelsData: NameTagField[][],
): Table => {
  const rows: TableRow[] = [];
  const paddedLabels = [...labelsData];
  while (paddedLabels.length < LABELS_PER_PAGE) {
    paddedLabels.push([]);
  }
  for (let rowIndex = 0; rowIndex < ROWS_PER_PAGE; rowIndex += 1) {
    const cells: TableCell[] = [];
    for (let colIndex = 0; colIndex < LABELS_PER_ROW; colIndex += 1) {
      const labelIndex = rowIndex * LABELS_PER_ROW + colIndex;
      const fields = paddedLabels[labelIndex];
      const cell =
        fields && fields.length
          ? createLabelCellWithText(tag, fields)
          : new TableCell({
              width: {
                size: LABEL_CELL_WIDTH_TWIPS,
                type: WidthType.DXA,
              },
              children: [new Paragraph("")],
              margins: {
                top: CELL_MARGIN_TWIPS,
                bottom: CELL_MARGIN_TWIPS,
                left: CELL_MARGIN_TWIPS,
                right: CELL_MARGIN_TWIPS,
              },
            });
      cells.push(cell);
    }
    rows.push(
      new TableRow({
        children: cells,
        height: {
          value: LABEL_ROW_HEIGHT_TWIPS,
          rule: HeightRule.EXACT,
        },
        cantSplit: false,
      }),
    );
  }
  return new Table({
    width: {
      size: PRINTABLE_WIDTH_TWIPS,
      type: WidthType.DXA,
    },
    columnWidths: new Array(LABELS_PER_ROW).fill(LABEL_CELL_WIDTH_TWIPS),
    layout: TableLayoutType.FIXED,
    rows,
  });
};

const buildDocx = async (labelImages: ArrayBuffer[]): Promise<Blob> => {
  if (!labelImages.length) {
    throw new Error("No labels available to export.");
  }
  const sectionChunks = chunk(labelImages, LABELS_PER_PAGE);
  const document = new Document({
    sections: sectionChunks.map((group) => ({
      properties: {
        page: {
          size: {
            width: PAGE_WIDTH_TWIPS,
            height: PAGE_HEIGHT_TWIPS,
          },
          margin: {
            top: PAGE_MARGIN_TWIPS,
            bottom: PAGE_MARGIN_TWIPS,
            left: PAGE_MARGIN_TWIPS,
            right: PAGE_MARGIN_TWIPS,
          },
        },
      },
      children: [createLabelTable(group)],
    })),
  });
  return Packer.toBlob(document);
};

const buildDocxWithText = async (
  tag: NameTagData,
  labelsData: NameTagField[][],
): Promise<Blob> => {
  if (!labelsData.length) {
    throw new Error("No labels available to export.");
  }
  const sectionChunks = chunk(labelsData, LABELS_PER_PAGE);
  const document = new Document({
    sections: sectionChunks.map((group) => ({
      properties: {
        page: {
          size: {
            width: PAGE_WIDTH_TWIPS,
            height: PAGE_HEIGHT_TWIPS,
          },
          margin: {
            top: PAGE_MARGIN_TWIPS,
            bottom: PAGE_MARGIN_TWIPS,
            left: PAGE_MARGIN_TWIPS,
            right: PAGE_MARGIN_TWIPS,
          },
        },
      },
      children: [createLabelTableWithText(tag, group)],
    })),
  });
  return Packer.toBlob(document);
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const subset = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...subset);
  }
  return btoa(binary);
};

const buildHtmlDoc = async (
  labelImages: ArrayBuffer[],
): Promise<Blob> => {
  const base64Images = labelImages.map((buffer) =>
    arrayBufferToBase64(buffer),
  );
  const pages = chunk(base64Images, LABELS_PER_PAGE).map((group) => {
    const rows: string[] = [];
    for (let rowIndex = 0; rowIndex < ROWS_PER_PAGE; rowIndex += 1) {
      const cells: string[] = [];
      for (
        let colIndex = 0;
        colIndex < LABELS_PER_ROW;
        colIndex += 1
      ) {
        const imageIndex = rowIndex * LABELS_PER_ROW + colIndex;
        const image = group[imageIndex];
        cells.push(
          `<td class="label-cell">${
            image
              ? `<img src="data:image/png;base64,${image}" alt="Label ${imageIndex + 1}" />`
              : ""
          }</td>`,
        );
      }
      rows.push(`<tr>${cells.join("")}</tr>`);
    }
    return `<section class="label-page">
      <table class="label-grid">
        <tbody>
          ${rows.join("")}
        </tbody>
      </table>
    </section>`;
  });

  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Name tag export</title>
      <style>
        @page {
          size: letter;
          margin: 0.5in;
        }
        body {
          margin: 0;
          font-family: "Segoe UI", system-ui, sans-serif;
        }
        .label-page {
          page-break-after: always;
          min-height: 10.5in;
          display: flex;
          align-items: center;
        }
        .label-page:last-of-type {
          page-break-after: auto;
        }
        .label-grid {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0.2in;
        }
        .label-cell {
          width: 50%;
          text-align: center;
          vertical-align: middle;
        }
        .label-cell img {
          width: ${LABEL_IMAGE_WIDTH_IN}in;
          height: ${LABEL_IMAGE_HEIGHT_IN}in;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      ${pages.join("")}
    </body>
  </html>`;
  return new Blob([html], {
    type: "application/msword",
  });
};

export const buildDocumentFromLabels = async (
  format: ExportFormat,
  labelImages: ArrayBuffer[],
  tag?: NameTagData,
  labelsData?: NameTagField[][],
): Promise<Blob> => {
  if (format === "docx") {
    // Use editable text for docx if tag and labelsData are provided
    if (tag && labelsData) {
      return buildDocxWithText(tag, labelsData);
    }
    // Fallback to images if text data not available
    return buildDocx(labelImages);
  }
  return buildHtmlDoc(labelImages);
};
