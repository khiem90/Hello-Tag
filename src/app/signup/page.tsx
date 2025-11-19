import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create account | Name Tag Studio",
  description:
    "Create a Name Tag Studio account to save your layouts, sync attendee lists, and export labels faster.",
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-slate-100 px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 lg:flex-row lg:items-center">
        <div className="w-full max-w-xl space-y-6 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">
            Name Tag Studio
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Keep every event label in sync.
          </h1>
          <p className="text-base text-slate-600">
            Store your attendee information, reuse past layouts, and export fresh
            batches of tags whenever schedules shift. Drop in your details and
            you&apos;re ready to go.
          </p>
          <div className="flex flex-col items-center gap-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 sm:flex-row sm:justify-start">
            <Link
              href="/login"
              className="flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-xs uppercase tracking-[0.4em] text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            >
              Already have an account?
            </Link>
            <span className="text-xs text-slate-400">
              Prefer to browse? Head back to the studio any time.
            </span>
          </div>
        </div>

        <SignUpForm redirectPath="/" postCreatePath="/" />
      </div>
    </main>
  );
}

