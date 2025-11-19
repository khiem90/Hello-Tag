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
        // Reset form and close modal on success
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-[32px] border border-white/50 bg-white/95 p-8 shadow-[0_35px_120px_-45px_rgba(15,23,42,0.8)] backdrop-blur">
        <header className="mb-6 space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Save Design
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Name your creation
          </h2>
          <p className="text-sm text-slate-500">
            Give your design a memorable name and optional description to find
            it later.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-left text-sm font-medium text-slate-700">
            Design name
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Conference Badge 2024"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              disabled={isSaving}
              autoFocus
              required
            />
          </label>

          <label className="block text-left text-sm font-medium text-slate-700">
            Description (optional)
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Blue theme with large name field for annual tech conference"
              rows={3}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              disabled={isSaving}
            />
          </label>

          {error && (
            <p
              className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:bg-slate-900/60"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
