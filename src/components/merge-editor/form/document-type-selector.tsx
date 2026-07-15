"use client";

import { documentTypeList } from "@/lib/document-types";
import { DocumentType } from "@/types/document";

type DocumentTypeSelectorProps = {
  selectedType: DocumentType;
  onTypeChange: (type: DocumentType) => void;
};

export function DocumentTypeSelector({
  selectedType,
  onTypeChange,
}: DocumentTypeSelectorProps) {
  return (
    <section className="p-5">
      <p className="pn-eyebrow mb-3 text-ink">01 — Document type</p>
      <div className="flex flex-col">
        {documentTypeList.map((docType, index) => {
          const isActive = selectedType === docType.id;
          return (
            <button
              key={docType.id}
              type="button"
              onClick={() => onTypeChange(docType.id)}
              aria-pressed={isActive}
              className={`flex cursor-pointer items-baseline gap-3 rounded-none border-b px-1 py-2.5 text-left transition-colors duration-[160ms] ${
                isActive
                  ? "border-b-2 border-ink text-ink"
                  : "border-ink/20 text-muted-ink hover:border-ink hover:text-ink"
              }`}
            >
              <span
                className={`pn-eyebrow ${isActive ? "text-pink" : "text-muted-ink"}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="pn-eyebrow">{docType.label}</span>
              <span className="pn-annotation ml-auto hidden text-right text-muted-ink sm:block">
                {docType.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
