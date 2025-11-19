import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | Name Tag Studio",
  description:
    "Access your saved name tag layouts or start a new project after signing in with email or Google.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-100 via-slate-50 to-white px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 lg:flex-row lg:items-center">
        <div className="w-full max-w-xl space-y-6 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">
            Name Tag Studio
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Save your layouts, sync datasets, and export anywhere.
          </h1>
          <p className="text-base text-slate-600">
            Sign in to keep iterating on your tags, import attendee data, and
            export polished labels in a single click. Choose a secure email
            login or connect with Google to get started faster.
          </p>
          <div className="flex flex-col items-center gap-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 sm:flex-row sm:justify-start">
            <Link
              href="/"
              className="flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-xs uppercase tracking-[0.4em] text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            >
              Back to Studio
            </Link>
            <Link
              href="/signup"
              className="text-xs uppercase tracking-[0.4em] text-slate-400 transition hover:text-slate-900"
            >
              Need an account? Sign up
            </Link>
          </div>
        </div>

        <LoginForm redirectPath="/" />
      </div>
    </main>
  );
}

