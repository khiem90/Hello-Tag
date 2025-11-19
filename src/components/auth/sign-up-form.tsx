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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

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
    <Card variant="sticker" className="w-full bg-white shadow-cartoon">
      <CardHeader className="text-center pb-2">
         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sunshine-yellow border-2 border-black shadow-cartoon-sm">
             <UserPlus className="h-8 w-8 text-black" />
         </div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Get Started
        </p>
        <CardTitle className="text-3xl">Create Account</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                First name
                </label>
                <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChange(setFirstName)}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-soft-graphite placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-0"
                placeholder="Alex"
                required
                aria-label="First name"
                disabled={isSubmitting}
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Last name
                </label>
                <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChange(setLastName)}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-soft-graphite placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-0"
                placeholder="Morgan"
                required
                aria-label="Last name"
                disabled={isSubmitting}
                />
            </div>
            </div>

            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Phone number
                </label>
                <input
                type="tel"
                name="phone"
                value={phone}
                onChange={handleChange(setPhone)}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-soft-graphite placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-0"
                placeholder="(555) 123-4567"
                required
                aria-label="Phone number"
                disabled={isSubmitting}
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Email address
                </label>
                <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange(setEmail)}
                autoComplete="email"
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-soft-graphite placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-0"
                placeholder="you@example.com"
                required
                aria-label="Email address"
                disabled={isSubmitting}
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Password
                </label>
                <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange(setPassword)}
                autoComplete="new-password"
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-soft-graphite placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-0"
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
                className="w-full text-base py-6 mt-4"
                disabled={isSubmitting}
                isLoading={isSubmitting}
            >
                Create Account
            </Button>
        </form>

        <div className="mt-6 space-y-3 text-sm">
            {error ? (
            <div
                className="flex items-start gap-3 rounded-xl border-2 border-candy-coral bg-red-50 p-3 font-bold text-candy-coral"
                role="alert"
                aria-live="assertive"
            >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
            </div>
            ) : null}
            {statusMessage ? (
            <div
                className="flex items-start gap-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 p-3 font-bold text-emerald-700"
                role="status"
                aria-live="polite"
            >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p>{statusMessage}</p>
            </div>
            ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
