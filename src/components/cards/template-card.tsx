"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { type Template } from "@/lib/templates";
import { SpecimenFrame } from "./specimen-frame";

type TemplateCardProps = {
  template: Template;
  onUseTemplate: (template: Template) => void;
  index?: number;
};

export function TemplateCard({ template, onUseTemplate, index }: TemplateCardProps) {
  const isDark = template.data.background === "charcoal";
  const visibleFields = template.data.fields.filter((f) => f.visible);

  return (
    <SpecimenFrame docType={template.documentType} index={index}>
      {/* Preview framed like a document proof */}
      <div className="border-b border-ink p-3">
        <div
          className="aspect-4/3 relative w-full overflow-hidden border border-ink"
          style={{
            backgroundColor:
              template.data.background === "custom"
                ? template.data.customBackground
                : "#fafaf8",
          }}
        >
          {/* Muted gradient stand-in for the background theme */}
          {template.data.background !== "custom" && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  template.data.background === "sky"
                    ? "linear-gradient(135deg, #e8f4f8, #f5f0f0 45%, #e8f0f8 90%)"
                    : template.data.background === "sunset"
                      ? "linear-gradient(135deg, #faf3e8, #f5ebe0 50%, #faf0f0 95%)"
                      : "linear-gradient(145deg, #2d2d2d, #3d3d3d 55%, #4d4d4d 95%)",
              }}
            />
          )}

          {/* Simplified representation of fields */}
          <div className="absolute inset-4 transition-transform duration-[160ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.01]">
            {visibleFields.slice(0, 5).map((field) => (
              <div
                key={field.id}
                className="absolute px-1"
                style={{
                  top: `${field.y}%`,
                  left: `${field.x}%`,
                  transform: "translate(-50%, -50%)",
                  fontSize: `${Math.max(8, Math.min(field.fontSize / 2.5, 18))}px`,
                  color:
                    field.color === "#FFFFFF" && !isDark ? "#2d2d2d" : field.color,
                  fontWeight: "500",
                  maxWidth: "90%",
                  textAlign: template.data.textAlign,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {field.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <h3 className="font-body text-lg font-semibold tracking-[-0.02em] text-ink">
            {template.name}
          </h3>
          <p className="pn-annotation mt-1 text-muted-ink">
            {template.documentType} · {template.data.fields.length} merge field
            {template.data.fields.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Merge-field specimen tags, shown as literal data syntax */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {visibleFields.slice(0, 4).map((field) => (
            <span
              key={field.id}
              className="border border-dashed border-ink px-1.5 py-0.5 font-mono text-[10px] leading-[14px] text-ink"
            >
              {`{{${field.name}}}`}
            </span>
          ))}
          {visibleFields.length > 4 && (
            <span className="px-1.5 py-0.5 font-mono text-[10px] leading-[14px] text-muted-ink">
              +{visibleFields.length - 4} more
            </span>
          )}
        </div>

        <div className="mt-auto">
          <Button
            onClick={() => onUseTemplate(template)}
            className="w-full gap-2"
            variant="secondary"
          >
            Use template <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </SpecimenFrame>
  );
}
