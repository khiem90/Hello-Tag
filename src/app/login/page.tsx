import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign in | MailBuddy",
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
    <main className="min-h-screen px-6 py-16 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-5xl flex-col-reverse items-center gap-16 lg:flex-row lg:items-center">
        <div className="w-full max-w-lg space-y-6 text-center lg:text-left">
          <p className="text-sm font-medium text-terracotta tracking-wide">
            Welcome back
          </p>
          
          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight text-ink">
            Sign in to your account
          </h1>
          
          <p className="text-lg text-ink-light leading-relaxed">
            Access your saved designs, create personalized documents, and export them with ease.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start pt-2">
            <Link
              href="/"
              className="group flex items-center justify-center rounded-lg border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium text-ink-light transition-colors hover:border-ink/20 hover:text-ink"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to home
            </Link>
            <Link
              href={redirectPath && redirectPath !== "/" ? `/signup?redirect=${encodeURIComponent(redirectPath)}` : "/signup"}
              className="text-sm font-medium text-terracotta transition hover:text-terracotta/80"
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
