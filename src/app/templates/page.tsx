"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { templates, TemplateCategory } from "@/lib/templates";
import { persistDocument } from "@/lib/tag-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, FileText, Award, Tag, Mail } from "lucide-react";

const categories: { id: TemplateCategory; label: string; icon: React.ReactNode }[] = [
  { id: "Letter", label: "Letters", icon: <FileText className="h-4 w-4" /> },
  { id: "Certificate", label: "Certificates", icon: <Award className="h-4 w-4" /> },
  { id: "Label", label: "Labels", icon: <Tag className="h-4 w-4" /> },
  { id: "Envelope", label: "Envelopes", icon: <Mail className="h-4 w-4" /> },
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
    <div className="min-h-screen bg-warm-cloud py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center rounded-full border-2 border-black bg-pop-purple px-4 py-1.5 font-heading text-sm font-bold text-white shadow-cartoon-sm mb-6">
            <Sparkles className="mr-2 h-4 w-4" />
            Template Gallery
          </div>
          <h1 className="font-heading text-5xl font-extrabold text-soft-graphite mb-6">
            Start With a Template
          </h1>
          <p className="text-xl text-slate-600">
            Choose a pre-designed template and customize it with your data. All templates support mail merge fields!
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border-2 px-5 py-2 font-heading text-sm font-bold transition-all ${
              activeCategory === "all"
                ? "border-black bg-bubble-blue text-white shadow-cartoon-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-bubble-blue hover:text-bubble-blue"
            }`}
          >
            All Templates
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 rounded-full border-2 px-5 py-2 font-heading text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? "border-black bg-bubble-blue text-white shadow-cartoon-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-bubble-blue hover:text-bubble-blue"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => {
            const categoryInfo = categories.find(c => c.id === template.category);
            
            return (
              <Card 
                key={template.id} 
                variant="sticker" 
                hoverEffect 
                className="flex flex-col h-full group"
              >
                {/* Preview Area */}
                <div 
                  className="aspect-[4/3] w-full relative overflow-hidden border-b-2 border-slate-100 transition-colors"
                  style={{
                    backgroundColor: template.data.background === 'custom' 
                      ? template.data.customBackground 
                      : '#f8fafc',
                  }}
                >
                  {/* Background gradient preview */}
                  {template.data.background !== 'custom' && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: template.data.background === 'sky' 
                          ? 'linear-gradient(135deg, #e0f2fe, #fff1f2 45%, #dbeafe 90%)'
                          : template.data.background === 'sunset'
                            ? 'linear-gradient(135deg, #fef3c7, #fed7aa 50%, #fbcfe8 95%)'
                            : 'linear-gradient(145deg, #020617, #0f172a 55%, #1e293b 95%)',
                      }}
                    />
                  )}
                  
                  {/* Simplified representation of fields */}
                  <div className="absolute inset-4 transform group-hover:scale-[1.02] transition-transform duration-300">
                    {template.data.fields
                      .filter(field => field.visible)
                      .slice(0, 5) // Limit preview fields
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
                              color: field.color === '#FFFFFF' && !isDark ? '#000' : field.color,
                              fontWeight: 'bold',
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
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-soft-graphite shadow-sm">
                    {categoryInfo?.icon}
                    <span>{template.category}</span>
                  </div>

                  {/* Document Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-black/70 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                      {template.documentType}
                    </span>
                  </div>
                </div>

                <CardContent className="flex flex-col flex-1 pt-5">
                  <div className="mb-4">
                    <h3 className="font-heading text-xl font-bold text-soft-graphite mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {template.data.fields.length} merge field{template.data.fields.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  {/* Field preview tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {template.data.fields
                      .filter(f => f.visible)
                      .slice(0, 4)
                      .map((field, i) => (
                        <span 
                          key={i}
                          className="rounded-full bg-pop-purple/10 px-2 py-0.5 text-[0.65rem] font-bold text-pop-purple"
                        >
                          {field.name}
                        </span>
                      ))}
                    {template.data.fields.filter(f => f.visible).length > 4 && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-bold text-slate-400">
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
                      Use Template <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-slate-500">No templates found in this category.</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 pt-12 border-t-2 border-slate-200">
          <p className="text-lg text-slate-600 mb-4">
            Want to start from scratch instead?
          </p>
          <Button 
            onClick={() => router.push("/create")}
            variant="outline"
            size="lg"
          >
            Create Blank Document
          </Button>
        </div>
      </div>
    </div>
  );
}
