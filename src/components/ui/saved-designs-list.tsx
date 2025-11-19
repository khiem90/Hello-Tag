"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listUserDesigns,
  loadDesignFromFirebase,
  deleteDesignFromFirebase,
  type SavedDesign,
} from "@/lib/tag-storage";
import type { NameTagData } from "@/types/name-tag";

type SavedDesignsListProps = {
  isAuthenticated: boolean;
  onLoadDesign: (design: NameTagData) => void;
};

export function SavedDesignsList({
  isAuthenticated,
  onLoadDesign,
}: SavedDesignsListProps) {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      setError("Failed to load your saved designs");
      setDesigns([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void fetchDesigns();
  }, [fetchDesigns]);

  const handleLoadDesign = async (designId: string) => {
    try {
      const design = await loadDesignFromFirebase(designId);
      if (design) {
        onLoadDesign(design.data);
      }
    } catch (err) {
      console.error("Failed to load design", err);
      setError("Failed to load this design");
    }
  };

  const handleDeleteDesign = async (designId: string) => {
    if (!window.confirm("Are you sure you want to delete this design?")) {
      return;
    }

    try {
      await deleteDesignFromFirebase(designId);
      await fetchDesigns(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete design", err);
      setError("Failed to delete this design");
    }
  };

  const formatDate = (timestamp: Date | { toDate: () => Date }) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-4">
        <p className="text-center text-sm text-slate-500">
          Loading your saved designs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-[28px] border border-dashed border-rose-300 bg-rose-50/80 p-4">
        <p className="text-center text-sm text-rose-700">{error}</p>
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="space-y-3 rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Saved designs
          </p>
          <p className="text-sm text-slate-600">
            You haven&apos;t saved any designs yet. Click &quot;Save design&quot; to store
            your current creation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Saved designs ({designs.length})
        </p>
        <p className="text-sm text-slate-600">
          Load any of your previously saved designs.
        </p>
      </div>

      <div className="space-y-2">
        {designs.map((design) => {
          const isExpanded = expandedId === design.id;
          return (
            <div
              key={design.id}
              className="rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : design.id)}
                  className="flex-1 text-left"
                >
                  <h3 className="font-semibold text-slate-900">
                    {design.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {formatDate(design.updatedAt)}
                  </p>
                  {design.description && isExpanded && (
                    <p className="mt-2 text-sm text-slate-600">
                      {design.description}
                    </p>
                  )}
                </button>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleLoadDesign(design.id)}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDesign(design.id)}
                    className="rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-700 hover:bg-rose-700 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
