"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import {
  listUserDesigns,
  deleteDesignFromFirebase,
  persistTag,
  type SavedDesign,
} from "@/lib/tag-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Edit3, Calendar, FolderOpen, Sticker } from "lucide-react";

export default function MyLabelsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesigns = useCallback(async () => {
    if (!isAuthenticated) {
      setDesigns([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userDesigns = await listUserDesigns();
      setDesigns(userDesigns);
    } catch (err) {
      console.error("Failed to load designs", err);
      setError("Failed to load your saved designs.");
      setDesigns([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Optionally redirect to login, but let's show a "Please login" state
      setIsLoading(false);
      return;
    }
    void fetchDesigns();
  }, [isAuthenticated, fetchDesigns]);

  const handleLoadDesign = (design: SavedDesign) => {
    persistTag(design.data);
    router.push("/create");
  };

  const handleDeleteDesign = async (designId: string) => {
    if (!window.confirm("Are you sure you want to delete this design? This can't be undone!")) {
      return;
    }

    try {
      await deleteDesignFromFirebase(designId);
      // Optimistic update
      setDesigns((prev) => prev.filter((d) => d.id !== designId));
    } catch (err) {
      console.error("Failed to delete design", err);
      setError("Failed to delete this design.");
      void fetchDesigns(); // Revert on error
    }
  };

  const formatDate = (timestamp: Date | { toDate: () => Date }) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 border-4 border-slate-200">
            <FolderOpen className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-soft-graphite mb-4">Log In to See Your Designs</h1>
        <p className="text-lg text-slate-500 mb-8 max-w-md">
          You need to be logged in to save and view your sticker collection.
        </p>
        <Button onClick={() => router.push("/login")} size="lg">
            Log In / Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cloud py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
           <div className="inline-flex items-center rounded-full border-2 border-black bg-mint-gelato px-4 py-1.5 font-heading text-sm font-bold text-soft-graphite shadow-cartoon-sm mb-6">
            <Sticker className="mr-2 h-4 w-4" />
            Your Collection
          </div>
          <h1 className="font-heading text-5xl font-extrabold text-soft-graphite mb-6">
            My Sticker Wall
          </h1>
          <p className="text-xl text-slate-600">
            All your amazing creations in one place. Click to edit or print!
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-bubble-blue mb-4" />
            <p className="font-heading text-xl font-bold text-slate-400">Loading your stickers...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border-2 border-candy-coral bg-red-50 p-8 text-center">
            <p className="font-bold text-candy-coral text-lg mb-4">{error}</p>
            <Button variant="outline" onClick={() => void fetchDesigns()}>Try Again</Button>
          </div>
        ) : designs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 py-20 text-center">
            <div className="mb-6 h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
                <Sticker className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-soft-graphite mb-2">No designs yet!</h3>
            <p className="text-slate-500 mb-8 max-w-md">
              Your sticker wall is looking a bit empty. Go create something awesome!
            </p>
            <Button onClick={() => router.push("/create")} size="lg">
              Create New Label
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {designs.map((design) => (
              <Card key={design.id} variant="sticker" hoverEffect className="flex flex-col h-full group">
                <div 
                    className="aspect-3/2 w-full relative overflow-hidden border-b-2 border-slate-100 bg-slate-50 group-hover:bg-white transition-colors"
                    style={{
                        backgroundColor: design.data.background === 'custom' ? design.data.customBackground : undefined,
                        backgroundImage: design.data.background !== 'custom' ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : undefined
                    }}
                >
                    {/* Simplified Mini Preview */}
                    {design.data.fields.map((field, i) => (
                        field.visible && (
                            <div 
                                key={i} 
                                className="absolute w-full text-center px-2 truncate"
                                style={{ 
                                    top: `${field.y}%`, 
                                    left: `${field.x}%`, 
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: `${Math.max(8, field.fontSize / 3)}px`,
                                    color: field.color === '#FFFFFF' ? '#000' : field.color,
                                    fontWeight: 'bold',
                                    opacity: 0.7
                                }}
                            >
                                {field.text}
                            </div>
                        )
                    ))}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                
                <CardContent className="flex flex-col flex-1 pt-4 p-4">
                  <div className="mb-4">
                    <h3 className="font-heading text-xl font-bold text-soft-graphite line-clamp-1" title={design.name}>
                        {design.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(design.updatedAt)}</span>
                    </div>
                    {design.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                            {design.description}
                        </p>
                    )}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleLoadDesign(design)}
                    >
                        <Edit3 className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button 
                        variant="danger" 
                        size="sm" 
                        className="px-3"
                        onClick={() => handleDeleteDesign(design.id)}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

