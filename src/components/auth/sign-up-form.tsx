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
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore } from "@/lib/firebase-client";
import type { SignUpFormProps } from "@/types/auth";

export function SignUpForm({
  redirectPath = "/",
  postCreatePath = "/",
}: SignUpFormProps): JSX.Element {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const redirectTarget = useMemo(
    () => postCreatePath ?? redirectPath ?? "/",
    [postCreatePath, redirectPath],
  );

  const handleChange =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  const resetFeedback = () => {
    setError(null);
    setStatusMessage(null);
  };

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetFeedback();
      if (!firstName.trim() || !lastName.trim()) {
        setError("Enter both your first and last name.");
        return;
      }
      if (!email.trim() || !password.trim()) {
        setError("Email and password are required.");
        return;
      }
      if (!phone.trim()) {
        setError("Enter a phone number so we can reach you if needed.");
        return;
      }
      try {
        setIsSubmitting(true);
        const auth = getFirebaseAuth();
        const firestore = getFirebaseFirestore();
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        await updateProfile(credential.user, {
          displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        });
        await setDoc(doc(firestore, "users", credential.user.uid), {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          createdAt: serverTimestamp(),
        }).catch((err) => {
          console.warn("Firestore profile creation failed (ignoring):", err);
        });
        setStatusMessage("Account created. Redirecting you now…");
        router.refresh();
        router.replace(redirectTarget);
      } catch (signupError) {
        setError(
          signupError instanceof Error
            ? signupError.message
            : "We couldn't create your account. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      email,
      firstName,
      lastName,
      password,
      phone,
      redirectTarget,
      router,
    ],
  );

  return (
    <section className="w-full max-w-md rounded-[32px] border border-white/50 bg-white/95 p-8 shadow-[0_35px_120px_-45px_rgba(15,23,42,0.8)] backdrop-blur">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          Create account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Join Name Tag Studio
        </h1>
        <p className="text-sm text-slate-500">
          Add a few details so we can personalize your workspace and keep your
          exports synced.
        </p>
      </header>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-left text-sm font-medium text-slate-700">
            First name
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange(setFirstName)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="Alex"
              required
              aria-label="First name"
              disabled={isSubmitting}
            />
          </label>

          <label className="block text-left text-sm font-medium text-slate-700">
            Last name
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleChange(setLastName)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="Morgan"
              required
              aria-label="Last name"
              disabled={isSubmitting}
            />
          </label>
        </div>

        <label className="block text-left text-sm font-medium text-slate-700">
          Phone number
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={handleChange(setPhone)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="(555) 123-4567"
            required
            aria-label="Phone number"
            disabled={isSubmitting}
          />
        </label>

        <label className="block text-left text-sm font-medium text-slate-700">
          Email address
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange(setEmail)}
            autoComplete="email"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="you@example.com"
            required
            aria-label="Email address"
            disabled={isSubmitting}
          />
        </label>

        <label className="block text-left text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange(setPassword)}
            autoComplete="new-password"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="Create a password"
            required
            aria-label="Password"
            disabled={isSubmitting}
          />
        </label>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:bg-slate-900/60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

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

