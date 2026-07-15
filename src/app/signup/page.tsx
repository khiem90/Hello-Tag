import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create account | Mail Buddy",
  description:
    "Create a Mail Buddy account to save your designs and export documents faster.",
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
    <main className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col-reverse items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        <div className="w-full max-w-lg space-y-5 text-center lg:text-left">
          <p className="pn-kicker text-muted-ink">Form 02 / Get started</p>

          <h1 className="pn-display-l text-ink">Create your account</h1>

          <p className="mx-auto max-w-[52ch] text-base leading-relaxed text-muted-ink lg:mx-0">
            Save your mail merge designs, build your document collection, and
            streamline your workflow.
          </p>

          <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={redirectPath && redirectPath !== "/" ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login"}
              className="pn-eyebrow text-ink underline decoration-1 underline-offset-4 transition-all duration-[160ms] hover:decoration-2"
            >
              Already have an account?
            </Link>
            <Link
              href="/"
              className="pn-eyebrow text-muted-ink underline decoration-1 underline-offset-4 transition-all duration-[160ms] hover:text-ink hover:decoration-2"
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
