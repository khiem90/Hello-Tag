import type { ComponentPropsWithRef } from "react";

export const underlineInputClass =
  "w-full rounded-none border-0 border-b border-ink bg-transparent px-0 py-2 text-base text-ink transition-colors duration-[160ms] placeholder:text-muted-ink/60 focus:border-pink focus:outline-none disabled:opacity-50";

type UnderlineFieldProps = ComponentPropsWithRef<"input"> & {
  label: string;
};

/** A labeled underline-style text input in the Press Notes form language. */
export function UnderlineField({ label, ...props }: UnderlineFieldProps) {
  return (
    <label className="block">
      <span className="pn-eyebrow mb-2 block text-ink">{label}</span>
      <input className={underlineInputClass} {...props} />
    </label>
  );
}

type FormStatusProps = {
  error?: string | null;
  status?: string | null;
};

/** Inline error/success feedback rows shared by the auth forms. */
export function FormStatus({ error, status }: FormStatusProps) {
  return (
    <div className="mt-6 space-y-3 text-sm">
      {error && (
        <div
          className="flex items-start gap-2 border-l-2 border-yellow pl-3 text-ink"
          role="alert"
          aria-live="assertive"
        >
          <span className="mt-[7px] block h-1.5 w-1.5 shrink-0 bg-yellow" aria-hidden />
          <p>{error}</p>
        </div>
      )}
      {status && (
        <div
          className="flex items-start gap-2 border-l-2 border-green pl-3 text-ink"
          role="status"
          aria-live="polite"
        >
          <span className="mt-[7px] block h-1.5 w-1.5 shrink-0 bg-green" aria-hidden />
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}
