"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/layout/auth-provider";
import {
  listUserDesigns,
  deleteDesignFromFirebase,
  persistDocument,
  type SavedDesign,
} from "@/lib/tag-storage";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="pn-noise relative w-full max-w-md border border-ink bg-cream p-8 text-center shadow-paper sm:p-10">
          <p className="pn-eyebrow mb-4 text-muted-ink">
            Archive — Access required
          </p>
          <h1 className="pn-display-m mb-4 text-ink">
            Log in to see your documents
          </h1>
          <p className="mb-8 text-sm text-muted-ink">
            You need to be logged in to save and view your mail merge designs.
          </p>
          <Button onClick={() => router.push("/login")} size="lg">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Editorial title block */}
        <header className="mb-12">
          <p className="pn-eyebrow mb-4 text-muted-ink">
            Archive — Your documents
          </p>
          <h1 className="pn-display-l mb-4 text-ink">My Documents</h1>
          <p className="max-w-[62ch] text-base text-ink">
            All your saved mail merge designs, filed in one place.
          </p>
          <div className="mt-8 h-px w-full bg-ink" aria-hidden="true" />
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-ink" />
            <p className="pn-eyebrow text-muted-ink">
              Loading your documents…
            </p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-lg border border-ink bg-cream p-8 text-center">
            <p className="pn-annotation mb-4 inline-flex items-center gap-1.5 text-ink">
              <span
                className="h-2 w-2 border border-ink bg-yellow"
                aria-hidden="true"
              />
              Press error
            </p>
            <p className="mb-6 text-sm text-ink">{error}</p>
            <Button variant="outline" onClick={() => void fetchDesigns()}>
              Try Again
            </Button>
          </div>
        ) : designs.length === 0 ? (
          <div className="flex flex-col items-center border border-dashed border-ink px-6 py-16 text-center">
            <Image
              src="/press-notes/mascot-production-runner.png"
              alt="Mail Buddy mascot running with a stack of freshly printed labels"
              width={130}
              height={195}
              className="mb-6"
            />
            <p className="pn-hand mb-3 -rotate-2 text-ink">
              nothing on the press yet…
            </p>
            <p className="mb-8 max-w-md text-sm text-muted-ink">
              You haven&apos;t saved any mail merge documents yet.
            </p>
            <Button onClick={() => router.push("/create")} size="lg">
              Create New Document
            </Button>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {designs.map((design, i) => (
              <DesignCard
                key={design.id}
                design={design}
                onLoadDesign={handleLoadDesign}
                onDeleteDesign={handleDeleteDesign}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
