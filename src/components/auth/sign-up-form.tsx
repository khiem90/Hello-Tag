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
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function SignUpForm({
  redirectPath = "/",
  postCreatePath = "/",
}: SignUpFormProps) {
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
    <div className="w-full rounded-xl border border-ink/5 bg-white p-8 shadow-soft">
      <div className="mb-8">
        <p className="text-sm font-medium text-terracotta mb-2">Get started</p>
        <h2 className="font-heading text-2xl tracking-tight text-ink">
          Create account
        </h2>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              First name
            </label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange(setFirstName)}
              className="w-full rounded-lg border border-ink/10 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-light/60 focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
              placeholder="Alex"
              required
              aria-label="First name"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleChange(setLastName)}
              className="w-full rounded-lg border border-ink/10 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-light/60 focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
              placeholder="Morgan"
              required
              aria-label="Last name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Phone number
          </label>
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={handleChange(setPhone)}
            className="w-full rounded-lg border border-ink/10 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-light/60 focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
            placeholder="(555) 123-4567"
            required
            aria-label="Phone number"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange(setEmail)}
            autoComplete="email"
            className="w-full rounded-lg border border-ink/10 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-light/60 focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
            placeholder="you@example.com"
            required
            aria-label="Email address"
            disabled={isSubmitting}
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
            onChange={handleChange(setPassword)}
            autoComplete="new-password"
            className="w-full rounded-lg border border-ink/10 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-light/60 focus:border-terracotta/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors"
            placeholder="Create a password"
            required
            aria-label="Password"
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Create account
        </Button>
      </form>

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
