import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create account | MailBuddy",
  description:
    "Create a MailBuddy account to save your designs and export documents faster.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SignUpPage({ searchParams }: Props) {
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
            Get started
          </p>
          
          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight text-ink">
            Create your account
          </h1>
          
          <p className="text-lg text-ink-light leading-relaxed">
            Save your mail merge designs, build your document collection, and streamline your workflow.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start pt-2">
            <Link
              href={redirectPath && redirectPath !== "/" ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login"}
              className="rounded-lg border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium text-ink-light transition-colors hover:border-ink/20 hover:text-ink"
            >
              Already have an account?
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-ink-light transition hover:text-ink"
            >
              Just browsing
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md">
          <SignUpForm redirectPath={redirectPath} postCreatePath={redirectPath} />
        </div>
      </div>
    </main>
  );
}
