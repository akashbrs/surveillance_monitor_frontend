import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { toast } from "sonner";
import { AuthBackground } from "@/components/AuthBackground";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.trim()) {
        toast.error("Please enter your email address.");
        return;
      }

      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Reset link sent to your email.");
        // Redirect or show success state
      } catch {
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email]
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
            
            <h2 className="text-[22px] font-bold text-zinc-900 dark:text-white mb-2">Forgot Password?</h2>
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">Enter your email address to reset your password</p>
          </div>

          {/* Form */}
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

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={() => navigate("/")}
              className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
