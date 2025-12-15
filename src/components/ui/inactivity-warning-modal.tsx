"use client";

import { useCallback, useEffect, useRef } from "react";

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
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-ink/5 bg-white p-8 shadow-soft-lg animate-fade-up">
        {/* Warning Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <svg
            className="h-8 w-8 text-amber-600"
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
          <h2
            id="inactivity-modal-title"
            className="font-heading text-2xl tracking-tight text-ink"
          >
            Session Timeout Warning
          </h2>
          <p
            id="inactivity-modal-description"
            className="text-sm text-ink-light mt-2"
          >
            You&apos;ve been inactive for a while. For your security, you&apos;ll
            be logged out soon.
          </p>
        </header>

        {/* Countdown Timer */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center rounded-lg bg-stone px-6 py-4">
            <span className="font-heading text-4xl font-semibold tabular-nums text-ink">
              {formatTime(timeRemaining)}
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-light">
            Time remaining before automatic logout
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex-1 rounded-lg border border-ink/10 px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-stone/50 focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-2"
            tabIndex={0}
            aria-label="Log out now"
          >
            Log Out
          </button>
          <button
            ref={stayButtonRef}
            type="button"
            onClick={onStayLoggedIn}
            className="flex-1 rounded-lg bg-terracotta px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-2"
            tabIndex={0}
            aria-label="Stay logged in and continue session"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

