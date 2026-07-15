"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useState,
} from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type SaveDesignModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description?: string) => Promise<void>;
  initialName?: string;
};

const underlineInput =
  "mt-2 w-full rounded-none border-0 border-b border-ink bg-transparent px-0 py-2 text-base text-ink placeholder:text-muted-ink/60 transition-colors duration-[160ms] focus:border-pink focus:outline-none disabled:opacity-60";

export function SaveDesignModal({
  isOpen,
  onClose,
  onSave,
  initialName = "",
}: SaveDesignModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError(null);
  }, []);

  const handleDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!name.trim()) {
        setError("Please enter a name for your design");
        return;
      }

      try {
        setIsSaving(true);
        setError(null);
        await onSave(name.trim(), description.trim());
        setName("");
        setDescription("");
        onClose();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save design. Please try again.",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [name, description, onSave, onClose],
  );

  const handleClose = useCallback(() => {
    if (!isSaving) {
      setName(initialName);
      setDescription("");
      setError(null);
      onClose();
    }
  }, [isSaving, initialName, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in bg-ink/60"
        onClick={handleClose}
        aria-hidden
      />

      {/* Modal — cream sheet on ink overlay */}
      <div className="pn-noise relative w-full max-w-md animate-fade-up rounded-none border border-ink bg-cream p-8 shadow-paper">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSaving}
          className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-none border border-ink text-ink transition-colors duration-[160ms] hover:bg-sage/40 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Close save dialog"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <header className="mb-8 pr-12">
          <p className="pn-eyebrow text-muted-ink">Save design</p>
          <h2 className="pn-display-m mt-2 text-ink">
            Name your creation
          </h2>
          <p className="mt-3 text-sm text-muted-ink">
            Give your design a memorable name and optional description.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="pn-eyebrow block text-left text-ink">
            Design name
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Conference Badge 2024"
              className={underlineInput}
              disabled={isSaving}
              autoFocus
              required
            />
          </label>

          <label className="pn-eyebrow block text-left text-ink">
            Description (optional)
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Blue theme with large name field for annual tech conference"
              rows={3}
              className={`${underlineInput} resize-none`}
              disabled={isSaving}
            />
          </label>

          {error && (
            <p
              className="rounded-none border border-ink bg-yellow/50 px-4 py-3 text-sm font-medium text-ink"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
