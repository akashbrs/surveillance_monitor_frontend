import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AuthBackground } from "@/components/AuthBackground";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, user, loading: authLoading, is2FAVerified } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setError("Please fill out all fields.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setLoading(true);
      try {
        const success = await signup(email, password, name);
        if (success) {
          toast.success("Account created! Welcome back to Core Sentinel.");
          navigate("/2fa");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.displayMessage || "Failed to create account. Please try again.");
      } finally {
        setLoading(false);
      }

    },
    [name, email, password, confirmPassword, signup, navigate]
  );

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
            
            <h2 className="text-[22px] font-bold text-zinc-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Start securing your applications today</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Full Name</label>
              <div className="login-input-wrapper">
                <User className="absolute left-4 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="login-input-premium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
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

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Confirm Password</label>
              <div className="login-input-wrapper">
                <Lock className="absolute left-4 h-4 w-4 text-zinc-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  className="login-input-premium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="text-xs font-medium text-red-500 text-center animate-shake">{error}</div>}

            <p className="text-[12px] text-zinc-400 dark:text-zinc-500 text-center py-2 px-1">
              By signing up, you agree to our{" "}
              <button
                type="button"
                onClick={() => navigate("/terms")}
                className="text-zinc-700 dark:text-zinc-300 font-semibold hover:underline"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => navigate("/privacy")}
                className="text-zinc-700 dark:text-zinc-300 font-semibold hover:underline"
              >
                Privacy Policy
              </button>.
            </p>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
