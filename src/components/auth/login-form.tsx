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
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function LoginForm({
  redirectPath = "/",
}: LoginFormProps) {
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
    <div className="w-full rounded-xl border border-ink/5 bg-white p-8 shadow-soft">
      <div className="mb-8">
        <p className="text-sm font-medium text-terracotta mb-2">Welcome back</p>
        <h2 className="font-heading text-2xl tracking-tight text-ink">
          Sign in
        </h2>
      </div>
      
      <form className="space-y-5" onSubmit={handleEmailSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
            className="w-full rounded-lg border border-ink/10 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-light/60 focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
            placeholder="you@example.com"
            required
            aria-label="Email address"
            disabled={isEmailSubmitting || isGoogleSubmitting}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            className="w-full rounded-lg border border-ink/10 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-light/60 focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
            placeholder="••••••••"
            required
            aria-label="Password"
            disabled={isEmailSubmitting || isGoogleSubmitting}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isEmailSubmitting || isGoogleSubmitting}
          isLoading={isEmailSubmitting}
        >
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-medium text-ink-light/60">
        <span className="h-px flex-1 bg-ink/5" aria-hidden />
        <span>or</span>
        <span className="h-px flex-1 bg-ink/5" aria-hidden />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleGoogleLogin}
        className="w-full gap-3"
        disabled={isGoogleSubmitting || isEmailSubmitting}
      >
        {isGoogleSubmitting ? (
          "Connecting..."
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
            <span>Sign in with Google</span>
          </>
        )}
      </Button>

      <div className="mt-6 space-y-3 text-sm">
        {error ? (
          <div
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}
        {statusMessage ? (
          <div
            className="flex items-start gap-3 rounded-lg border border-sage/30 bg-sage-light p-3 text-ink"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-sage" />
            <p>{statusMessage}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
