import type { ReactNode } from "react";
import { DocumentType } from "@/types/document";

export const documentTypeBadges: Record<
  DocumentType,
  { label: string; accent: string }
> = {
  letter: { label: "Letter", accent: "bg-green" },
  certificate: { label: "Certificate", accent: "bg-pink" },
  label: { label: "Label", accent: "bg-yellow" },
  envelope: { label: "Envelope", accent: "bg-green" },
};

type SpecimenFrameProps = {
  docType: DocumentType;
  index?: number;
  children: ReactNode;
};

/** Shared card shell: tilted paper frame with an index number and type badge. */
export function SpecimenFrame({ docType, index, children }: SpecimenFrameProps) {
  const badge = documentTypeBadges[docType];
  const tilted = index !== undefined && index % 2 === 1;

  return (
    <div
      className={`group flex flex-col rounded-none border border-ink bg-cream transition-all duration-[160ms] ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-px hover:shadow-paper ${
        tilted ? "rotate-[-0.4deg]" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-ink px-4 py-2">
        <span className="pn-eyebrow text-ink">
          {index !== undefined
            ? `No. ${String(index + 1).padStart(2, "0")}`
            : "No. —"}
        </span>
        <span className="pn-annotation inline-flex items-center gap-1.5 text-ink">
          <span
            className={`h-2 w-2 border border-ink ${badge.accent}`}
            aria-hidden="true"
          />
          {badge.label}
        </span>
      </div>
      {children}
    </div>
  );
}
