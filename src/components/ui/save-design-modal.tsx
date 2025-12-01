"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useState,
} from "react";

type SaveDesignModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description?: string) => Promise<void>;
  initialName?: string;
};

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
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-ink/5 bg-white p-8 shadow-soft-lg animate-fade-up">
        <header className="mb-8">
          <p className="text-sm font-medium text-terracotta mb-2">
            Save design
          </p>
          <h2 className="font-heading text-2xl tracking-tight text-ink">
            Name your creation
          </h2>
          <p className="text-sm text-ink-light mt-2">
            Give your design a memorable name and optional description.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-left text-sm font-medium text-ink">
            Design name
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Conference Badge 2024"
              className="mt-2 w-full rounded-lg border border-ink/10 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-light/60 focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
              disabled={isSaving}
              autoFocus
              required
            />
          </label>

          <label className="block text-left text-sm font-medium text-ink">
            Description (optional)
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Blue theme with large name field for annual tech conference"
              rows={3}
              className="mt-2 w-full resize-none rounded-lg border border-ink/10 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-light/60 focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
              disabled={isSaving}
            />
          </label>

          {error && (
            <p
              className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 rounded-lg border border-ink/10 px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-stone/50 focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-lg bg-terracotta px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
