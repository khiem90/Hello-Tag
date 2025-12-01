"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { templates, TemplateCategory } from "@/lib/templates";
import { persistDocument } from "@/lib/tag-storage";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const categories: { id: TemplateCategory; label: string }[] = [
  { id: "Letter", label: "Letters" },
  { id: "Certificate", label: "Certificates" },
  { id: "Label", label: "Labels" },
  { id: "Envelope", label: "Envelopes" },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");

  const handleUseTemplate = (template: typeof templates[0]) => {
    persistDocument(template.data);
    router.push("/create");
  };

  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

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
            Choose a pre-designed template and customize it with your data. 
            All templates support mail merge fields.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            aria-pressed={activeCategory === "all"}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
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
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
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
          {filteredTemplates.map((template) => {
            return (
              <div 
                key={template.id} 
                className="group flex flex-col bg-white rounded-xl border border-ink/5 overflow-hidden transition-shadow hover:shadow-soft"
              >
                {/* Preview Area */}
                <div 
                  className="aspect-4/3 w-full relative overflow-hidden border-b border-ink/5"
                  style={{
                    backgroundColor: template.data.background === 'custom' 
                      ? template.data.customBackground 
                      : '#fafaf8',
                  }}
                >
                  {/* Background gradient preview */}
                  {template.data.background !== 'custom' && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: template.data.background === 'sky' 
                          ? 'linear-gradient(135deg, #e8f4f8, #f5f0f0 45%, #e8f0f8 90%)'
                          : template.data.background === 'sunset'
                            ? 'linear-gradient(135deg, #faf3e8, #f5ebe0 50%, #faf0f0 95%)'
                            : 'linear-gradient(145deg, #2d2d2d, #3d3d3d 55%, #4d4d4d 95%)',
                      }}
                    />
                  )}
                  
                  {/* Simplified representation of fields */}
                  <div className="absolute inset-4 transition-transform duration-300 group-hover:scale-[1.01]">
                    {template.data.fields
                      .filter(field => field.visible)
                      .slice(0, 5)
                      .map((field, i) => {
                        const isDark = template.data.background === 'charcoal';
                        return (
                          <div 
                            key={i} 
                            className="absolute px-1"
                            style={{ 
                              top: `${field.y}%`, 
                              left: `${field.x}%`,
                              transform: 'translate(-50%, -50%)',
                              fontSize: `${Math.max(8, Math.min(field.fontSize / 2.5, 18))}px`,
                              color: field.color === '#FFFFFF' && !isDark ? '#2d2d2d' : field.color,
                              fontWeight: '500',
                              maxWidth: '90%',
                              textAlign: template.data.textAlign,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {field.text}
                          </div>
                        );
                      })}
                  </div>
                   
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-xs font-medium text-ink border border-ink/5">
                      {template.category}
                    </span>
                  </div>

                  {/* Document Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded bg-ink/70 text-[0.65rem] font-medium uppercase tracking-wider text-white">
                      {template.documentType}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <div className="mb-4">
                    <h3 className="font-heading text-lg tracking-tight text-ink mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-ink-light">
                      {template.data.fields.length} merge field{template.data.fields.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  {/* Field preview tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {template.data.fields
                      .filter(f => f.visible)
                      .slice(0, 4)
                      .map((field, i) => (
                        <span 
                          key={i}
                          className="px-2 py-0.5 rounded bg-terracotta/10 text-[0.65rem] font-medium text-terracotta"
                        >
                          {field.name}
                        </span>
                      ))}
                    {template.data.fields.filter(f => f.visible).length > 4 && (
                      <span className="px-2 py-0.5 rounded bg-stone text-[0.65rem] font-medium text-ink-light">
                        +{template.data.fields.filter(f => f.visible).length - 4} more
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      onClick={() => handleUseTemplate(template)} 
                      className="w-full gap-2"
                      variant="secondary"
                    >
                      Use template <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-ink-light">No templates found in this category.</p>
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
