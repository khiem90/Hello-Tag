"use client";

import { documentTypeList } from "@/lib/document-types";
import { DocumentType } from "@/types/document";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Award, Tag, Mail } from "lucide-react";

type DocumentTypeSelectorProps = {
  selectedType: DocumentType;
  onTypeChange: (type: DocumentType) => void;
};

const documentTypeIcons: Record<DocumentType, React.ReactNode> = {
  letter: <FileText className="h-4 w-4" />,
  certificate: <Award className="h-4 w-4" />,
  label: <Tag className="h-4 w-4" />,
  envelope: <Mail className="h-4 w-4" />,
};

export function DocumentTypeSelector({
  selectedType,
  onTypeChange,
}: DocumentTypeSelectorProps) {
  return (
    <Card variant="elevated" className="bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-terracotta/10 text-terracotta">
            <FileText className="h-4 w-4" />
          </div>
          <CardTitle>Document Type</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {documentTypeList.map((docType) => {
            const isActive = selectedType === docType.id;
            return (
              <button
                key={docType.id}
                type="button"
                onClick={() => onTypeChange(docType.id)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer ${
                  isActive
                    ? "border-terracotta bg-terracotta/10 text-ink"
                    : "border-ink/10 bg-white text-ink-light hover:border-ink/20 hover:text-ink"
                }`}
              >
                <span className={isActive ? "text-terracotta" : "text-ink-light"}>
                  {documentTypeIcons[docType.id]}
                </span>
                <div>
                  <p className="font-medium text-sm">{docType.label}</p>
                  <p
                    className={`text-xs ${isActive ? "text-ink-light" : "text-ink-light/70"}`}
                  >
                    {docType.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

