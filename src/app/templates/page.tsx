"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { templates, type Template } from "@/lib/templates";
import { persistDocument } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/cards/template-card";
import type { DocumentType } from "@/types/document";

type Filter = DocumentType | "all";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "letter", label: "Letters" },
  { id: "certificate", label: "Certificates" },
  { id: "label", label: "Labels" },
  { id: "envelope", label: "Envelopes" },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const handleUseTemplate = (template: Template) => {
    persistDocument(template.data);
    router.push("/create");
  };

  const filteredTemplates =
    activeFilter === "all"
      ? templates
      : templates.filter((t) => t.documentType === activeFilter);

  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Editorial title block */}
        <header className="mb-12">
          <p className="pn-kicker mb-4 text-muted-ink">
            Catalog / Design once, make many
          </p>
          <h1 className="pn-display-l mb-4 text-ink">Start with a template</h1>
          <p className="max-w-[62ch] text-base text-ink">
            Pick a pre-set sheet, then merge in your own data — every specimen
            ships with live merge fields.
          </p>
          <div className="mt-8 h-px w-full bg-ink" aria-hidden="true" />
        </header>

        {/* Category Filter */}
        <div className="mb-14 flex flex-wrap gap-2">
          {filters.map((filter, i) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={activeFilter === filter.id}
              className={`pn-eyebrow h-9 cursor-pointer rounded-none border border-ink px-4 transition-all duration-[160ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
                activeFilter === filter.id
                  ? "bg-ink text-white-ink"
                  : "bg-cream text-ink hover:-translate-y-px hover:shadow-paper-sm"
              }`}
            >
              {filter.id === "all"
                ? filter.label
                : `${String(i).padStart(2, "0")} — ${filter.label}`}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template, i) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUseTemplate={handleUseTemplate}
              index={i}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <Image
              src="/press-notes/ink-burst.svg"
              alt=""
              width={64}
              height={64}
              className="mb-5"
            />
            <p className="pn-hand -rotate-2 text-ink">
              nothing set in this category yet…
            </p>
            <p className="pn-annotation mt-3 text-muted-ink">
              No templates found in this category
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 border-t border-ink pt-12 text-center">
          <p className="pn-hand mb-6 inline-block -rotate-2 text-ink">
            or start from a blank sheet…
          </p>
          <div>
            <Button
              onClick={() => router.push("/create")}
              variant="outline"
              size="lg"
            >
              Create blank document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
