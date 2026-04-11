import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthBackground } from "@/components/AuthBackground";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, user, loading: authLoading, is2FAVerified } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode to display the correct theme label
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    
    // Observer for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);


  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!email.trim() || !password.trim()) {
        setError("Please enter your email and password.");
        return;
      }

      setLoading(true);
      try {
        const success = await login(email, password);
        if (success) {
          toast.success("Welcome back to Core Sentinel.");
          navigate("/2fa");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.displayMessage || "Invalid credentials. Please try again.");
      } finally {
        setLoading(false);
      }

    },
    [email, password, login, navigate]
  );

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const success = await loginWithGoogle(tokenResponse.access_token);
        if (success) {
          toast.success("Welcome back to Core Sentinel.");
          navigate("/2fa");
        } else {
          toast.error("Google authentication failed. Please try again.");
        }
      } catch {
        toast.error("An unexpected error occurred during Google sign in.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login failed or was cancelled.");
    }
  });

  return (
    <div className="login-premium-bg font-inter text-zinc-900 dark:text-zinc-100">
      {/* Exact Background Effect - Perspective Grid + Circuit Traces + Glows */}
      <AuthBackground />
      
      {/* Main Card */}
      <div className="login-card-premium group z-10">
        <div className="login-card-content">
          {/* Subtle Top Gradient Bar (Light mode only, dark has full border) */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400 opacity-100 dark:opacity-0" />

          {/* Logo & Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-zinc-950 rounded-xl shadow-lg dark:shadow-blue-500/10">
                <Logo size="sm" className="filter brightness-110" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Core <span className="text-blue-500">Sentinel</span>
              </h1>
            </div>
            
            <h2 className="text-[22px] font-bold text-zinc-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to access your security dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
              <div className="login-input-wrapper">
                <Mail className="absolute left-4 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="login-input-premium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Password</label>
              <div className="login-input-wrapper">
                <Lock className="absolute left-4 h-4 w-4 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="login-input-premium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="text-xs font-medium text-red-500 text-center animate-shake">{error}</div>}

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-4 w-4 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600" />
                  <svg className="absolute h-2.5 w-2.5 text-white scale-0 transition-transform peer-checked:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[13px] text-zinc-600 dark:text-zinc-400 font-medium">Remember me</span>
              </label>
              <button 
                type="button" 
                onClick={() => navigate("/forgot-password")}
                className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign In"}
            </button>
          </form>

          {/* Social Sign In */}
          <div className="login-divider-text">or</div>
          
          <button type="button" className="login-google-btn" onClick={() => handleGoogleLogin()}>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.63l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}
