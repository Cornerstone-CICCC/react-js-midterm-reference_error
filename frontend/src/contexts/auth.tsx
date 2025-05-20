"use client";

import { getCurrentUser } from "@/app/actions/auth";
import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext<{
  user: {
    id: string;
    email: string;
  } | null;
  loading: boolean;
  updateAuthState: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("User data loaded:", userData);
        setUser(userData);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // コンテキストの更新関数を提供
  const updateAuthState = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
  };

  return (
    <authContext.Provider value={{ user, loading, updateAuthState }}>
      {children}
    </authContext.Provider>
  );
}

// biome-ignore lint/nursery/useComponentExportOnlyModules: <explanation>
export const useAuth = () => useContext(authContext);
