"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Edit3 } from "lucide-react";
import { DocumentType } from "@/types/document";
import { type SavedDesign } from "@/lib/tag-storage";

type DesignCardProps = {
  design: SavedDesign;
  onLoadDesign: (design: SavedDesign) => void;
  onDeleteDesign: (designId: string) => void;
  index?: number;
};

const documentTypeLabels: Record<DocumentType, string> = {
  letter: "Letter",
  certificate: "Certificate",
  label: "Label",
  envelope: "Envelope",
};

const documentTypeAccents: Record<DocumentType, string> = {
  letter: "bg-green",
  certificate: "bg-pink",
  label: "bg-yellow",
  envelope: "bg-green",
};

const formatDate = (timestamp: Date | { toDate: () => Date }) => {
  if (!timestamp) return "";
  const date = "toDate" in timestamp ? timestamp.toDate() : timestamp;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export function DesignCard({
  design,
  onLoadDesign,
  onDeleteDesign,
  index,
}: DesignCardProps) {
  const docType = design.data.documentType || "label";
  const tilted = index !== undefined && index % 2 === 1;

  return (
    <div
      className={`group flex flex-col rounded-none border border-ink bg-cream transition-all duration-[160ms] ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-px hover:shadow-paper ${
        tilted ? "rotate-[-0.4deg]" : ""
      }`}
    >
      {/* Specimen header: index number + document type tag */}
      <div className="flex items-center justify-between border-b border-ink px-4 py-2">
        <span className="pn-eyebrow text-ink">
          {index !== undefined
            ? `No. ${String(index + 1).padStart(2, "0")}`
            : "No. —"}
        </span>
        <span className="pn-annotation inline-flex items-center gap-1.5 text-ink">
          <span
            className={`h-2 w-2 border border-ink ${documentTypeAccents[docType]}`}
            aria-hidden="true"
          />
          {documentTypeLabels[docType]}
        </span>
      </div>

      {/* Preview framed like a document proof */}
      <div className="border-b border-ink p-3">
        <div
          className="aspect-4/3 relative w-full overflow-hidden border border-ink"
          style={{
            backgroundColor:
              design.data.background === "custom"
                ? design.data.customBackground
                : "#fafaf8",
            backgroundImage:
              design.data.background !== "custom"
                ? "linear-gradient(135deg, #f5f5f3 0%, #f0ede8 100%)"
                : undefined,
          }}
        >
          {/* Simplified Mini Preview */}
          {design.data.fields
            .filter((field) => field.visible)
            .slice(0, 4)
            .map((field, i) => (
              <div
                key={i}
                className="absolute truncate px-1"
                style={{
                  top: `${field.y}%`,
                  left: `${field.x}%`,
                  transform: "translate(-50%, -50%)",
                  fontSize: `${Math.max(8, field.fontSize / 3)}px`,
                  color: field.color === "#FFFFFF" ? "#2d2d2d" : field.color,
                  fontWeight: "500",
                  opacity: 0.7,
                  maxWidth: "90%",
                }}
              >
                {field.text}
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <h3
            className="line-clamp-1 font-body text-lg font-semibold tracking-[-0.02em] text-ink"
            title={design.name}
          >
            {design.name}
          </h3>
          <p className="pn-annotation mt-1 text-muted-ink">
            {formatDate(design.updatedAt)} · {design.data.fields.length} field
            {design.data.fields.length === 1 ? "" : "s"}
          </p>
          {design.description && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-ink">
              {design.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => onLoadDesign(design)}
          >
            <Edit3 className="mr-1 h-3 w-3" /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="px-3"
            onClick={() => onDeleteDesign(design.id)}
            aria-label="Delete design"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
