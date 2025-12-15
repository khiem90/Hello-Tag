"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { useInactivityTimeout } from "@/hooks/use-inactivity-timeout";
import { InactivityWarningModal } from "@/components/ui/inactivity-warning-modal";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  firstName: string | null;
  email: string | null;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    await signOut(getFirebaseAuth());
  }, []);

  const isAuthenticated = Boolean(user);

  const {
    isWarningVisible,
    timeRemaining,
    handleStayLoggedIn,
    handleLogout,
  } = useInactivityTimeout({
    enabled: isAuthenticated,
    onLogout: logout,
  });

  const value = useMemo<AuthContextValue>(() => {
    const displayName = user?.displayName ?? "";
    const firstName = displayName.trim().split(" ")[0] || null;
    return {
      user,
      isAuthenticated,
      isLoading,
      firstName,
      email: user?.email ?? null,
      logout,
    };
  }, [user, isAuthenticated, isLoading, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      <InactivityWarningModal
        isOpen={isWarningVisible}
        timeRemaining={timeRemaining}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogout}
      />
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

