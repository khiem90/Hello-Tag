"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import {
  listUserDesigns,
  deleteDesignFromFirebase,
  persistDocument,
  type SavedDesign,
} from "@/lib/tag-storage";
import { Button } from "@/components/ui/button";
import { Loader2, FolderOpen, FileText } from "lucide-react";
import { DesignCard } from "@/components/cards";

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
      setIsLoading(false);
      return;
    }
    void fetchDesigns();
  }, [isAuthenticated, fetchDesigns]);

  const handleLoadDesign = (design: SavedDesign) => {
    persistDocument(design.data);
    router.push("/create");
  };

  const handleDeleteDesign = async (designId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this design? This can't be undone!"
      )
    ) {
      return;
    }

    try {
      await deleteDesignFromFirebase(designId);
      setDesigns((prev) => prev.filter((d) => d.id !== designId));
    } catch (err) {
      console.error("Failed to delete design", err);
      setError("Failed to delete this design.");
      void fetchDesigns();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-xl bg-stone">
          <FolderOpen className="h-8 w-8 text-ink-light" />
        </div>
        <h1 className="font-heading text-2xl tracking-tight text-ink mb-3">
          Log in to see your documents
        </h1>
        <p className="text-ink-light mb-8 max-w-md">
          You need to be logged in to save and view your mail merge designs.
        </p>
        <Button onClick={() => router.push("/login")} size="lg">
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium text-terracotta mb-3 tracking-wide">
            Your collection
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight text-ink mb-6">
            My Documents
          </h1>
          <p className="text-lg text-ink-light leading-relaxed">
            All your saved mail merge designs in one place.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta mb-4" />
            <p className="text-ink-light">Loading your documents...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <Button variant="outline" onClick={() => void fetchDesigns()}>
              Try Again
            </Button>
          </div>
        ) : designs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/10 bg-stone/30 py-20 text-center">
            <div className="mb-6 h-16 w-16 rounded-xl bg-stone flex items-center justify-center">
              <FileText className="h-7 w-7 text-ink-light" />
            </div>
            <h3 className="font-heading text-xl tracking-tight text-ink mb-2">
              No designs yet
            </h3>
            <p className="text-ink-light mb-8 max-w-md">
              You haven&apos;t saved any mail merge documents yet.
            </p>
            <Button onClick={() => router.push("/create")} size="lg">
              Create New Document
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {designs.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                onLoadDesign={handleLoadDesign}
                onDeleteDesign={handleDeleteDesign}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
