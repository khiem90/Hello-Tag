import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign in | Label Buddy",
  description:
    "Access your saved label layouts or start a new project after signing in.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-warm-cloud px-4 py-14 sm:px-6 lg:px-10 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 lg:flex-row lg:items-center">
        <div className="w-full max-w-xl space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center rounded-full border-2 border-black bg-bubble-blue px-4 py-1.5 font-heading text-sm font-bold text-white shadow-cartoon-sm mb-2 transform -rotate-2">
            <Sparkles className="mr-2 h-4 w-4" />
            Welcome Back!
          </div>
          
          <h1 className="font-heading text-5xl font-extrabold tracking-tight text-soft-graphite">
            Ready to make more <span className="text-pop-purple underline decoration-4 decoration-wavy decoration-mint-gelato underline-offset-4">magic?</span>
          </h1>
          
          <p className="text-lg text-slate-600 font-medium">
            Sign in to access your sticker wall, create new masterpieces, and export your labels in a snap.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
            <Link
              href="/"
              className="group flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-slate-500 transition-all hover:border-black hover:text-soft-graphite hover:shadow-cartoon-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Studio
            </Link>
            <Link
              href="/signup"
              className="text-sm font-bold uppercase tracking-widest text-bubble-blue transition hover:text-pop-purple hover:underline decoration-2 underline-offset-4"
            >
              New here? Join the fun!
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md">
           <LoginForm redirectPath="/" />
        </div>
      </div>
    </main>
  );
}
