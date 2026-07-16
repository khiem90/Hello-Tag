"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore } from "@/lib/firebase-client";
import { Button } from "@/components/ui/button";
import { FormStatus, UnderlineField } from "@/components/ui/form";

type SignUpFormProps = {
  redirectPath?: string;
  postCreatePath?: string;
};

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatusMessage(null);
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
      const credential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password,
      );
      await updateProfile(credential.user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
      });
      await setDoc(doc(getFirebaseFirestore(), "users", credential.user.uid), {
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
      router.replace(postCreatePath ?? redirectPath ?? "/");
    } catch (signupError) {
      setError(
        signupError instanceof Error
          ? signupError.message
          : "We couldn't create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pn-noise relative w-full rounded-none border border-ink bg-cream p-6 shadow-paper sm:p-8">
      <div className="mb-8 border-b border-ink pb-4">
        <p className="pn-kicker text-muted-ink">Form 02 / Create account</p>
        <h2 className="pn-display-m mt-2 text-ink">Create account</h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
          <UnderlineField
            label="First name"
            type="text"
            name="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Alex"
            required
            disabled={isSubmitting}
          />
          <UnderlineField
            label="Last name"
            type="text"
            name="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Morgan"
            required
            disabled={isSubmitting}
          />
        </div>

        <UnderlineField
          label="Phone number"
          type="tel"
          name="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="(555) 123-4567"
          required
          disabled={isSubmitting}
        />

        <UnderlineField
          label="Email address"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          required
          disabled={isSubmitting}
        />

        <UnderlineField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          placeholder="Create a password"
          required
          disabled={isSubmitting}
        />

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

      <FormStatus error={error} status={statusMessage} />

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
