"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";
import type { LoginFormProps } from "@/types/auth";

export function LoginForm({
  redirectPath = "/",
}: LoginFormProps): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const googleProvider = useMemo(() => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return provider;
  }, []);

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    [],
  );

  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    },
    [],
  );

  const handleEmailSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setStatusMessage(null);
      if (!email.trim() || !password.trim()) {
        setError("Enter both your email and password to continue.");
        return;
      }
      try {
        setIsEmailSubmitting(true);
        await signInWithEmailAndPassword(
          getFirebaseAuth(),
          email.trim(),
          password,
        );
        setStatusMessage("Signed in. Redirecting you now…");
        router.refresh();
        router.push(redirectPath);
      } catch (authIssue) {
        setError(
          authIssue instanceof Error
            ? authIssue.message
            : "We couldn't sign you in. Please try again.",
        );
      } finally {
        setIsEmailSubmitting(false);
      }
    },
    [email, password, redirectPath, router],
  );

  const handleGoogleLogin = useCallback(async () => {
    setError(null);
    setStatusMessage(null);
    try {
      setIsGoogleSubmitting(true);
      await signInWithPopup(getFirebaseAuth(), googleProvider);
      setStatusMessage("Signed in with Google. Redirecting you now…");
      router.refresh();
      router.push(redirectPath);
    } catch (authIssue) {
      setError(
        authIssue instanceof Error
          ? authIssue.message
          : "Google sign-in failed. Please try again.",
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  }, [googleProvider, redirectPath, router]);

  return (
    <section className="w-full max-w-md rounded-[32px] border border-white/50 bg-white/90 p-8 shadow-[0_35px_120px_-45px_rgba(15,23,42,0.8)] backdrop-blur">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          Account access
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Sign in to Name Tag Studio
        </h1>
        <p className="text-sm text-slate-500">
          Use your email credentials or connect with Google to jump back into
          your workspace.
        </p>
      </header>

      <form className="mt-8 space-y-5" onSubmit={handleEmailSubmit}>
        <label className="block text-left text-sm font-medium text-slate-700">
          Email address
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="you@example.com"
            required
            aria-label="Email address"
            disabled={isEmailSubmitting || isGoogleSubmitting}
          />
        </label>

        <label className="block text-left text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="••••••••"
            required
            aria-label="Password"
            disabled={isEmailSubmitting || isGoogleSubmitting}
          />
        </label>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:bg-slate-900/60"
          disabled={isEmailSubmitting || isGoogleSubmitting}
        >
          {isEmailSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" aria-hidden />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-slate-200" aria-hidden />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isGoogleSubmitting || isEmailSubmitting}
      >
        {isGoogleSubmitting ? (
          "Redirecting…"
        ) : (
          <>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              aria-hidden
              focusable="false"
            >
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.5-.2-2.3h-11v4.4h6.3c-.3 1.6-1.3 3-2.8 3.8v3.1h4.5c2.6-2.3 4.2-5.8 4.2-9z"
              />
              <path
                fill="#34A853"
                d="M12.3 24c3.9 0 7.1-1.3 9.5-3.4l-4.5-3.1c-1.2.8-2.7 1.2-4.9 1.2-3.7 0-6.8-2.5-7.9-5.9H.8v3.2C3.2 21 7.4 24 12.3 24z"
              />
              <path
                fill="#FBBC05"
                d="M4.4 14.8c-.3-.8-.5-1.7-.5-2.6s.2-1.8.5-2.6V6.4H.8C-.3 8.6-.3 11.4.8 13.6l3.6-2.4z"
              />
              <path
                fill="#EA4335"
                d="M12.3 4.7c2.1 0 4 .7 5.5 2.1l4.1-4.1C19.4.9 16.2-.3 12.3-.3 7.4-.3 3.2 2.7.8 6.7l3.6 2.8c1.1-3.4 4.3-4.8 7.9-4.8z"
              />
            </svg>
            <span>Google</span>
          </>
        )}
      </button>

      <div className="mt-6 space-y-3 text-sm">
        {error ? (
          <p
            className="rounded-2xl bg-rose-50 px-4 py-3 font-medium text-rose-700"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        ) : null}
        {statusMessage ? (
          <p
            className="rounded-2xl bg-emerald-50 px-4 py-3 font-medium text-emerald-700"
            role="status"
            aria-live="polite"
          >
            {statusMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}

