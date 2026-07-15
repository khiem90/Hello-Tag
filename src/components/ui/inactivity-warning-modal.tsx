"use client";

import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

type InactivityWarningModalProps = {
  isOpen: boolean;
  timeRemaining: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const InactivityWarningModal = ({
  isOpen,
  timeRemaining,
  onStayLoggedIn,
  onLogout,
}: InactivityWarningModalProps) => {
  const stayButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onStayLoggedIn();
      }
    },
    [onStayLoggedIn]
  );

  useEffect(() => {
    if (isOpen) {
      stayButtonRef.current?.focus();
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inactivity-modal-title"
      aria-describedby="inactivity-modal-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in bg-ink/60"
        aria-hidden="true"
      />

      {/* Modal — cream sheet, yellow warning marker */}
      <div className="pn-noise relative w-full max-w-md animate-fade-up rounded-none border border-ink bg-cream p-8 shadow-paper">
        {/* Warning marker */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-none border border-ink bg-yellow">
          <svg
            className="h-7 w-7 text-ink"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <header className="mb-6 text-center">
          <p className="pn-eyebrow inline-block bg-yellow px-2 py-0.5 text-ink">
            ! Session timeout
          </p>
          <h2
            id="inactivity-modal-title"
            className="pn-display-m mt-3 text-ink"
          >
            Still there?
          </h2>
          <p
            id="inactivity-modal-description"
            className="mt-3 text-sm text-muted-ink"
          >
            You&apos;ve been inactive for a while. For your security, you&apos;ll
            be logged out soon.
          </p>
        </header>

        {/* Countdown Timer */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center border border-ink bg-yellow/50 px-6 py-4">
            <span className="font-mono text-4xl tabular-nums text-ink">
              {formatTime(timeRemaining)}
            </span>
          </div>
          <p className="pn-annotation mt-2 text-muted-ink">
            Time remaining before automatic logout
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="flex-1"
            tabIndex={0}
            aria-label="Log out now"
          >
            Log Out
          </Button>
          <Button
            ref={stayButtonRef}
            type="button"
            variant="primary"
            onClick={onStayLoggedIn}
            className="flex-1"
            tabIndex={0}
            aria-label="Stay logged in and continue session"
          >
            Stay Logged In
          </Button>
        </div>
      </div>
    </div>
  );
};
