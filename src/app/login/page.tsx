import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | Mail Buddy",
  description:
    "Access your saved mail merge designs or start a new project after signing in.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const redirectPath =
    typeof resolvedSearchParams.redirect === "string"
      ? resolvedSearchParams.redirect
      : "/";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col-reverse items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        <div className="w-full max-w-lg space-y-5 text-center lg:text-left">
          <p className="pn-eyebrow text-muted-ink">01 — Welcome back</p>

          <h1 className="pn-display-l text-ink">Sign in to your account</h1>

          <p className="mx-auto max-w-[52ch] text-base leading-relaxed text-muted-ink lg:mx-0">
            Access your saved designs, create personalized documents, and
            export them with ease.
          </p>

          <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/"
              className="pn-eyebrow text-ink underline decoration-1 underline-offset-4 transition-all duration-[160ms] hover:decoration-2"
            >
              ← Back to home
            </Link>
            <Link
              href={redirectPath && redirectPath !== "/" ? `/signup?redirect=${encodeURIComponent(redirectPath)}` : "/signup"}
              className="pn-eyebrow text-ink underline decoration-1 underline-offset-4 transition-all duration-[160ms] hover:decoration-2"
            >
              New here? Create an account
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md">
          <LoginForm redirectPath={redirectPath} />
        </div>
      </div>
    </main>
  );
}
