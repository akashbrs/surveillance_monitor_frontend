import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { loginUser, logoutUser, loginWithGoogleRequest, signupUser } from "@/services/apiHandlers";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  is2FAVerified: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGoogle: (token: string) => Promise<boolean>;
  logout: () => void;
  set2FAVerified: (verified: boolean) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [is2FAVerified, setIs2FAVerifiedState] = useState(false);
  const [loading, setLoading] = useState(true); // true during initial session restore

  // ── Helper to persist 2FA State ───────────────────────────────────────────────
  const set2FAVerified = useCallback((verified: boolean) => {
    setIs2FAVerifiedState(verified);
    if (verified) {
      localStorage.setItem("coresentinel_2fa_verified", "true");
    } else {
      localStorage.removeItem("coresentinel_2fa_verified");
    }
  }, []);

  // Auto-restore session on app load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("coresentinel_token");
      const storedUser = localStorage.getItem("coresentinel_user");
      const stored2FA = localStorage.getItem("coresentinel_2fa_verified");
      
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email) {
          setToken(storedToken);
          setUser(parsedUser);
          if (stored2FA === "true") {
            setIs2FAVerifiedState(true);
          }
        } else {
          // Incomplete data — clear it
          localStorage.removeItem("coresentinel_token");
          localStorage.removeItem("coresentinel_user");
          localStorage.removeItem("coresentinel_2fa_verified");
        }
      }
    } catch {
      // Corrupted storage — clear it
      localStorage.removeItem("coresentinel_token");
      localStorage.removeItem("coresentinel_user");
      localStorage.removeItem("coresentinel_2fa_verified");
    } finally {
      setLoading(false);
    }
  }, []);

  // login() — calls API, stores token, returns success flag
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("coresentinel_token", data.token);
      localStorage.setItem("coresentinel_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      set2FAVerified(false);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.displayMessage || "Login failed";
      toast.error(msg);
      throw err;
    }
  }, [set2FAVerified]);

  const signup = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const data = await signupUser(email, password, name);
      localStorage.setItem("coresentinel_token", data.token);
      localStorage.setItem("coresentinel_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      set2FAVerified(false);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.displayMessage || "Signup failed";
      toast.error(msg);
      throw err;
    }
  }, [set2FAVerified]);

  const loginWithGoogle = useCallback(async (googleToken: string): Promise<boolean> => {
    try {
      const data = await loginWithGoogleRequest(googleToken);
      localStorage.setItem("coresentinel_token", data.token);
      localStorage.setItem("coresentinel_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      set2FAVerified(false);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.displayMessage || "Google login failed";
      toast.error(msg);
      throw err;
    }
  }, [set2FAVerified]);

  // logout() — clears session and redirects to login
  const logout = useCallback(() => {
    try {
      logoutUser(); // best-effort, don't await
    } catch {
      // ignore
    }
    localStorage.removeItem("coresentinel_token");
    localStorage.removeItem("coresentinel_user");
    localStorage.removeItem("coresentinel_2fa_verified");
    setToken(null);
    setUser(null);
    setIs2FAVerifiedState(false);
    toast.info("Logged out successfully.");
  }, []);


  return (
    <AuthContext.Provider value={{ user, token, loading, is2FAVerified, login, signup, loginWithGoogle, logout, set2FAVerified }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
