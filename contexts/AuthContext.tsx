"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { ApiUser } from "@/lib/api";
import { login as apiLogin, logout as apiLogout, refreshToken, setRefreshTokenHandler, setOnApiActivity } from "@/lib/api";

const STORAGE_KEY = "aceepci_auth";

/** Rafraîchir quand il reste moins de 5 min avant expiration */
const REFRESH_BEFORE_MS = 5 * 60 * 1000;
/** Ou au plus tard toutes les 10 min tant que l'utilisateur est actif */
const REFRESH_INTERVAL_MS = 10 * 60 * 1000;
/** Vérification toutes les 60 secondes */
const CHECK_INTERVAL_MS = 60 * 1000;
/** Inactivité max avant d'arrêter le refresh (30 min) — au-delà, on laisse expirer */
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

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
  logout: (redirectTo?: string) => Promise<void>;
  /** Rafraîchit le token. Si forceRefresh, appelle l'API même si le token est encore valide. */
  refreshAuth: (forceRefresh?: boolean) => Promise<string | null>;
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
  const lastRefreshAt = useRef(0);
  const lastActivityAt = useRef(Date.now());

  const refreshAuth = useCallback(async (forceRefresh = false): Promise<string | null> => {
    const stored = loadStoredAuth();
    if (!stored?.token) {
      setState({ user: null, token: null, expiresAt: null });
      setIsLoading(false);
      return null;
    }
    const now = Date.now();
    const expiresAt = stored.expiresAt ?? 0;
    const timeLeft = expiresAt - now;
    if (!forceRefresh && timeLeft > REFRESH_BEFORE_MS) {
      setState(stored);
      setIsLoading(false);
      return stored.token;
    }
    const doRefresh = async (): Promise<string | null> => {
      if (!stored.token) throw new Error("No token to refresh");
      const res = await refreshToken(stored.token);
      if (res.status !== "success") throw new Error("Refresh failed");
      // L'API peut renvoyer data comme string (token brut) ou comme objet { access_token, expires_in, user }
      const data = res.data;
      let newToken: string;
      let expiresIn = 3600;
      let user = stored.user;
      if (typeof data === "string" && data.length > 0) {
        newToken = data;
      } else if (data && typeof data === "object" && typeof (data as { access_token?: string }).access_token === "string") {
        const obj = data as { access_token: string; expires_in?: number; user?: ApiUser };
        newToken = obj.access_token;
        expiresIn = obj.expires_in ?? 3600;
        user = obj.user ?? stored.user;
      } else {
        throw new Error("Invalid refresh response");
      }
      const newState: AuthState = {
        user,
        token: newToken,
        expiresAt: Date.now() + expiresIn * 1000,
      };
      setState(newState);
      saveAuth(newState);
      setIsLoading(false);
      return newState.token;
    };

    try {
      return await doRefresh();
    } catch {
      try {
        await new Promise((r) => setTimeout(r, 2000));
        return await doRefresh();
      } catch {
        setState({ user: null, token: null, expiresAt: null });
        saveAuth(null);
        setIsLoading(false);
        return null;
      }
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    setRefreshTokenHandler(() => refreshAuth(true));
    return () => setRefreshTokenHandler(null);
  }, [refreshAuth]);

  useEffect(() => {
    const updateActivity = () => {
      lastActivityAt.current = Date.now();
    };
    let mousemoveThrottle: ReturnType<typeof setTimeout> | null = null;
    const throttledMousemove = () => {
      if (!mousemoveThrottle) {
        updateActivity();
        mousemoveThrottle = setTimeout(() => { mousemoveThrottle = null; }, 3000);
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") updateActivity();
    };
    const events = ["mousedown", "keydown", "scroll", "touchstart", "focus"];
    events.forEach((e) => window.addEventListener(e, updateActivity));
    window.addEventListener("mousemove", throttledMousemove);
    document.addEventListener("visibilitychange", onVisibilityChange);
    setOnApiActivity(updateActivity);
    return () => {
      events.forEach((e) => window.removeEventListener(e, updateActivity));
      window.removeEventListener("mousemove", throttledMousemove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      setOnApiActivity(null);
    };
  }, []);

  useEffect(() => {
    if (!state.token || !state.expiresAt) {
      lastRefreshAt.current = 0;
      return;
    }

    const checkAndRefresh = async () => {
      const now = Date.now();
      const timeLeft = state.expiresAt! - now;
      const timeSinceLastRefresh = now - lastRefreshAt.current;
      const timeSinceLastActivity = now - lastActivityAt.current;

      if (timeSinceLastActivity > INACTIVITY_TIMEOUT_MS) {
        if (timeLeft < 0) {
          setState({ user: null, token: null, expiresAt: null });
          saveAuth(null);
        }
        return;
      }

      if (lastRefreshAt.current === 0 && timeLeft > REFRESH_BEFORE_MS) {
        lastRefreshAt.current = now;
        return;
      }

      const shouldRefresh =
        timeLeft < REFRESH_BEFORE_MS ||
        timeSinceLastRefresh > REFRESH_INTERVAL_MS;

      if (shouldRefresh) {
        const newToken = await refreshAuth(true);
        if (newToken) lastRefreshAt.current = now;
      }
    };

    const id = setInterval(checkAndRefresh, CHECK_INTERVAL_MS);
    checkAndRefresh();

    return () => clearInterval(id);
  }, [state.token, state.expiresAt, refreshAuth]);

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

  const logout = useCallback(async (redirectTo?: string) => {
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
    router.push(redirectTo ?? "/");
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
