"use client";

import { useRouter } from "next/navigation";
import { templates } from "@/lib/templates";
import { persistTag } from "@/lib/tag-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();

  const handleUseTemplate = (template: typeof templates[0]) => {
    persistTag(template.data);
    router.push("/create");
  };

  return (
    <div className="min-h-screen bg-warm-cloud py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full border-2 border-black bg-pop-purple px-4 py-1.5 font-heading text-sm font-bold text-white shadow-cartoon-sm mb-6">
            <Sparkles className="mr-2 h-4 w-4" />
            Inspiration Station
          </div>
          <h1 className="font-heading text-5xl font-extrabold text-soft-graphite mb-6">
            Pick a Style to Start
          </h1>
          <p className="text-xl text-slate-600">
            Don't want to start from scratch? Grab one of these pre-made cuties and make it your own!
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              variant="sticker" 
              hoverEffect 
              className="flex flex-col h-full"
            >
              {/* Preview Area */}
              <div className="aspect-3/2 w-full bg-slate-100 relative overflow-hidden border-b-2 border-slate-100 group-hover:bg-slate-50 transition-colors">
                 <div 
                    className="absolute inset-8 rounded-xl shadow-sm transform group-hover:scale-105 transition-transform duration-300"
                    style={{ 
                        backgroundColor: template.data.background === 'custom' ? template.data.customBackground : undefined,
                        backgroundImage: template.data.background !== 'custom' ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : undefined // Simplified preview background
                    }}
                 >
                    {/* Simplified representation of fields */}
                    {template.data.fields.map((field, i) => (
                        <div 
                            key={i} 
                            className="absolute w-full text-center px-2"
                            style={{ 
                                top: `${field.y}%`, 
                                left: `${field.x}%`, 
                                transform: 'translate(-50%, -50%)',
                                fontSize: `${Math.max(10, field.fontSize / 2)}px`, // Scaled down for preview
                                color: field.color === '#FFFFFF' ? '#000' : field.color, // Ensure visibility on light preview
                                fontWeight: 'bold'
                            }}
                        >
                            {field.text}
                        </div>
                    ))}
                 </div>
                 
                 {/* Overlay Badge */}
                 <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center rounded-full border border-black bg-white px-2.5 py-0.5 text-xs font-bold text-soft-graphite shadow-sm">
                        {template.category}
                    </span>
                 </div>
              </div>

              <CardContent className="flex flex-col flex-1 pt-6">
                <div className="mb-4">
                    <h3 className="font-heading text-2xl font-bold text-soft-graphite mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-500">Perfect for {template.category.toLowerCase()} needs.</p>
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
          ))}
        </div>
      </div>
    </div>
  );
}

