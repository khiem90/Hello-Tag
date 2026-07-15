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
    <div className="pn-noise relative w-full rounded-none border border-ink bg-cream p-6 shadow-paper sm:p-8">
      <div className="mb-8 border-b border-ink pb-4">
        <p className="pn-eyebrow text-muted-ink">Form 02 — Create account</p>
        <h2 className="pn-display-m mt-2 text-ink">Create account</h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
          <div>
            <label className="pn-eyebrow mb-2 block text-ink">
              First name
            </label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange(setFirstName)}
              className="w-full rounded-none border-0 border-b border-ink bg-transparent px-0 py-2 text-base text-ink transition-colors duration-[160ms] placeholder:text-muted-ink/60 focus:border-pink disabled:opacity-50"
              placeholder="Alex"
              required
              aria-label="First name"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="pn-eyebrow mb-2 block text-ink">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleChange(setLastName)}
              className="w-full rounded-none border-0 border-b border-ink bg-transparent px-0 py-2 text-base text-ink transition-colors duration-[160ms] placeholder:text-muted-ink/60 focus:border-pink disabled:opacity-50"
              placeholder="Morgan"
              required
              aria-label="Last name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="pn-eyebrow mb-2 block text-ink">
            Phone number
          </label>
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={handleChange(setPhone)}
            className="w-full rounded-none border-0 border-b border-ink bg-transparent px-0 py-2 text-base text-ink transition-colors duration-[160ms] placeholder:text-muted-ink/60 focus:border-pink disabled:opacity-50"
            placeholder="(555) 123-4567"
            required
            aria-label="Phone number"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="pn-eyebrow mb-2 block text-ink">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange(setEmail)}
            autoComplete="email"
            className="w-full rounded-none border-0 border-b border-ink bg-transparent px-0 py-2 text-base text-ink transition-colors duration-[160ms] placeholder:text-muted-ink/60 focus:border-pink disabled:opacity-50"
            placeholder="you@example.com"
            required
            aria-label="Email address"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="pn-eyebrow mb-2 block text-ink">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange(setPassword)}
            autoComplete="new-password"
            className="w-full rounded-none border-0 border-b border-ink bg-transparent px-0 py-2 text-base text-ink transition-colors duration-[160ms] placeholder:text-muted-ink/60 focus:border-pink disabled:opacity-50"
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
          className="mt-2 w-full"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Create account
        </Button>
      </form>

      <div className="mt-6 space-y-3 text-sm">
        {error ? (
          <div
            className="flex items-start gap-2 border-l-2 border-yellow pl-3 text-ink"
            role="alert"
            aria-live="assertive"
          >
            <span
              className="mt-[7px] block h-1.5 w-1.5 shrink-0 bg-yellow"
              aria-hidden
            />
            <p>{error}</p>
          </div>
        ) : null}
        {statusMessage ? (
          <div
            className="flex items-start gap-2 border-l-2 border-green pl-3 text-ink"
            role="status"
            aria-live="polite"
          >
            <span
              className="mt-[7px] block h-1.5 w-1.5 shrink-0 bg-green"
              aria-hidden
            />
            <p>{statusMessage}</p>
          </div>
        ) : null}
      </div>

      <p className="pn-hand mt-6 inline-block -rotate-2 text-ink">
        fresh sheet, fresh start
      </p>

      <p className="pn-annotation mt-6 flex items-center justify-between border-t border-ink pt-3 text-muted-ink">
        <span>Press Notes · Form A-2</span>
        <span>Mail Buddy</span>
      </p>
    </div>
  );
}
