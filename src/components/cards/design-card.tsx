"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Edit3, Calendar } from "lucide-react";
import { DocumentType } from "@/types/document";
import { type SavedDesign } from "@/lib/tag-storage";

type DesignCardProps = {
  design: SavedDesign;
  onLoadDesign: (design: SavedDesign) => void;
  onDeleteDesign: (designId: string) => void;
};

const documentTypeLabels: Record<DocumentType, string> = {
  letter: "Letter",
  certificate: "Certificate",
  label: "Label",
  envelope: "Envelope",
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
}: DesignCardProps) {
  const docType = design.data.documentType || "label";

  return (
    <div className="flex flex-col bg-white rounded-xl border border-ink/5 overflow-hidden transition-shadow hover:shadow-soft group">
      <div
        className="aspect-4/3 w-full relative overflow-hidden border-b border-ink/5"
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
              className="absolute px-1 truncate"
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

        {/* Document Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded bg-ink/70 text-[0.65rem] font-medium uppercase tracking-wider text-white">
            {documentTypeLabels[docType]}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="mb-4">
          <h3
            className="font-heading text-lg tracking-tight text-ink line-clamp-1"
            title={design.name}
          >
            {design.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-ink-light mt-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(design.updatedAt)}</span>
            <span className="text-ink/20">•</span>
            <span>{design.data.fields.length} fields</span>
          </div>
          {design.description && (
            <p className="text-xs text-ink-light mt-2 line-clamp-2">
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
            <Edit3 className="h-3 w-3 mr-1" /> Edit
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

