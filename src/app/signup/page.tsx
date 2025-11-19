import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Sparkles, ArrowLeft, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Create account | Label Buddy",
  description:
    "Create a Label Buddy account to save your layouts and export labels faster.",
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
    <main className="min-h-screen bg-warm-cloud px-4 py-14 sm:px-6 lg:px-10 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 lg:flex-row lg:items-center">
        <div className="w-full max-w-xl space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center rounded-full border-2 border-black bg-sunshine-yellow px-4 py-1.5 font-heading text-sm font-bold text-soft-graphite shadow-cartoon-sm mb-2 transform rotate-2">
            <Star className="mr-2 h-4 w-4" />
            Join the Club
          </div>
          
          <h1 className="font-heading text-5xl font-extrabold tracking-tight text-soft-graphite">
            Let's get you <span className="text-candy-coral underline decoration-4 decoration-wavy decoration-bubble-blue underline-offset-4">organized!</span>
          </h1>
          
          <p className="text-lg text-slate-600 font-medium">
            Create an account to save your cute designs, build your sticker collection, and speed up your label making process.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
            <Link
              href={redirectPath && redirectPath !== "/" ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login"}
              className="group flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-slate-500 transition-all hover:border-black hover:text-soft-graphite hover:shadow-cartoon-sm"
            >
              Already have an account?
            </Link>
             <Link
              href="/"
              className="text-sm font-bold uppercase tracking-widest text-slate-400 transition hover:text-soft-graphite hover:underline decoration-2 underline-offset-4"
            >
              Just browsing?
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
