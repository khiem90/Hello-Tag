"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes x 60 seconds x 1000 milliseconds
const WARNING_COUNTDOWN_SECONDS = 60; // 1 minute

type UseInactivityTimeoutOptions = {
  enabled?: boolean;
  onLogout: () => void | Promise<void>;
};

type UseInactivityTimeoutReturn = {
  isWarningVisible: boolean;
  timeRemaining: number;
  handleStayLoggedIn: () => void;
  handleLogout: () => void;
};

export const useInactivityTimeout = ({
  enabled = true,
  onLogout,
}: UseInactivityTimeoutOptions): UseInactivityTimeoutReturn => {
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(WARNING_COUNTDOWN_SECONDS);

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onLogoutRef = useRef(onLogout);

  // Sync onLogout ref in effect to avoid stale closures
  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  const clearAllTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const executeLogout = useCallback(() => {
    const result = onLogoutRef.current();
    // Handle async logout - catch any errors to prevent unhandled rejections
    if (result instanceof Promise) {
      result.catch((error) => {
        console.error("Logout failed:", error);
      });
    }
  }, []);

  const startCountdown = useCallback(() => {
    setTimeRemaining(WARNING_COUNTDOWN_SECONDS);
    setIsWarningVisible(true);

    countdownIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearAllTimers();
          setIsWarningVisible(false);
          setTimeRemaining(WARNING_COUNTDOWN_SECONDS);
          executeLogout();
          return WARNING_COUNTDOWN_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearAllTimers, executeLogout]);

  const handleStayLoggedIn = useCallback(() => {
    clearAllTimers();
    setIsWarningVisible(false);
    setTimeRemaining(WARNING_COUNTDOWN_SECONDS);

    inactivityTimerRef.current = setTimeout(() => {
      startCountdown();
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearAllTimers, startCountdown]);

  const handleLogout = useCallback(() => {
    clearAllTimers();
    setIsWarningVisible(false);
    executeLogout();
  }, [clearAllTimers, executeLogout]);

  useEffect(() => {
    if (!enabled) {
      clearAllTimers();
      return;
    }

    let isSubscribed = true;

    const resetTimer = () => {
      clearAllTimers();

      inactivityTimerRef.current = setTimeout(() => {
        if (isSubscribed) {
          startCountdown();
        }
      }, INACTIVITY_TIMEOUT_MS);
    };

    const handleActivity = () => {
      // Only reset if countdown hasn't started
      if (!countdownIntervalRef.current) {
        resetTimer();
      }
    };

    // Add event listeners
    const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"] as const;
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Start the initial timer
    resetTimer();

    return () => {
      isSubscribed = false;
      clearAllTimers();
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, clearAllTimers, startCountdown]);

  // Derive visibility - if disabled, always hide the modal
  const derivedIsWarningVisible = enabled && isWarningVisible;

  return {
    isWarningVisible: derivedIsWarningVisible,
    timeRemaining,
    handleStayLoggedIn,
    handleLogout,
  };
};
