"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { ApiUser } from "@/lib/api";
import { login as apiLogin, logout as apiLogout, refreshToken } from "@/lib/api";

const STORAGE_KEY = "aceepci_auth";

interface AuthState {
  user: ApiUser | null;
  token: string | null;
  expiresAt: number | null;
}

interface AuthContextValue {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredAuth(): AuthState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as AuthState;
    if (!data.token || !data.user) return null;
    return data;
  } catch {
    return null;
  }
}

function saveAuth(state: AuthState | null) {
  if (typeof window === "undefined") return;
  if (state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, expiresAt: null });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshAuth = useCallback(async () => {
    const stored = loadStoredAuth();
    if (!stored?.token) {
      setState({ user: null, token: null, expiresAt: null });
      setIsLoading(false);
      return;
    }
    const now = Date.now();
    const expiresAt = stored.expiresAt ?? 0;
    if (expiresAt > now + 60000) {
      setState(stored);
      setIsLoading(false);
      return;
    }
    try {
      const res = await refreshToken(stored.token);
      if (res.status !== "success" || !res.data) throw new Error("Refresh failed");
      const data = typeof res.data === "object" ? res.data : null;
      if (!data || typeof data === "string") throw new Error("Invalid refresh response");
      const newState: AuthState = {
        user: data.user ?? stored.user,
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
      };
      setState(newState);
      saveAuth(newState);
    } catch {
      setState({ user: null, token: null, expiresAt: null });
      saveAuth(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = useCallback(
    async (loginId: string, password: string) => {
      try {
        const res = await apiLogin(loginId, password);
        if (res.status !== "success" || !res.data) throw new Error(res.message || "Connexion échouée");
        const { access_token, expires_in, user } = res.data;
        const newState: AuthState = {
          user,
          token: access_token,
          expiresAt: Date.now() + (expires_in ?? 3600) * 1000,
        };
        setState(newState);
        saveAuth(newState);
        router.push("/admin");
      } catch (e) {
        throw e;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    const { token } = state;
    if (token) {
      try {
        await apiLogout(token);
      } catch {
        // Ignorer les erreurs réseau, on déconnecte quand même
      }
    }
    setState({ user: null, token: null, expiresAt: null });
    saveAuth(null);
    router.push("/");
  }, [state.token, router]);

  const value: AuthContextValue = {
    user: state.user,
    token: state.token,
    isAuthenticated: !!state.token && !!state.user,
    isLoading,
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
