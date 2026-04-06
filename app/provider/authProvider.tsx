"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import apiClient from "../lib/apiClient";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Runs once on mount — handles page refresh & direct URL visits
  useEffect(() => {
    apiClient
      .getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  // Re-fetches only when navigating into a dashboard route
  // This catches the post-login redirect without re-fetching on every page
  useEffect(() => {
    if (!pathname.startsWith("/dashboard")) return;
    apiClient
      .getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
