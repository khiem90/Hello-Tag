"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { templates, TemplateCategory } from "@/lib/templates";
import { persistDocument } from "@/lib/tag-storage";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/cards";

const categories: { id: TemplateCategory; label: string }[] = [
  { id: "Letter", label: "Letters" },
  { id: "Certificate", label: "Certificates" },
  { id: "Label", label: "Labels" },
  { id: "Envelope", label: "Envelopes" },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<
    TemplateCategory | "all"
  >("all");

  const handleUseTemplate = (template: (typeof templates)[0]) => {
    persistDocument(template.data);
    router.push("/create");
  };

  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium text-terracotta mb-3 tracking-wide">
            Template gallery
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight text-ink mb-6">
            Start with a template
          </h1>
          <p className="text-lg text-ink-light leading-relaxed">
            Choose a pre-designed template and customize it with your data. All
            templates support mail merge fields.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            aria-pressed={activeCategory === "all"}
            className={`px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
              activeCategory === "all"
                ? "bg-ink text-white"
                : "bg-stone text-ink-light hover:text-ink hover:bg-stone/80"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={activeCategory === cat.id}
              className={`px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-ink text-white"
                  : "bg-stone text-ink-light hover:text-ink hover:bg-stone/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUseTemplate={handleUseTemplate}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-ink-light">
              No templates found in this category.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-20 pt-12 border-t border-ink/5">
          <p className="text-ink-light mb-4">
            Want to start from scratch instead?
          </p>
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
  );
}
