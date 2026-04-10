import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, RefreshCw, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AuthBackground } from "@/components/AuthBackground";
import { sendOTPRequest, verifyOTPRequest } from "@/services/apiHandlers";

export default function TwoFactorPage() {
  const navigate = useNavigate();
  const { set2FAVerified, logout } = useAuth();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(58);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Automatically send an OTP code when hitting the page
    const requestOTP = async () => {
      try {
        await sendOTPRequest();
        toast.info("A 6-digit code has been sent to your email.");
      } catch {
        toast.error("Failed to send OTP code.");
      }
    };
    requestOTP();

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTPRequest(fullCode);
      if (res.success) {
        set2FAVerified(true);
        toast.success("Identity verified successfully.");
        navigate("/dashboard");
      } else {
        toast.error("Invalid or expired OTP.");
      }
    } catch {
      toast.error("Server error. Could not verify code.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="login-premium-bg font-inter text-zinc-900 dark:text-zinc-100">
      <AuthBackground />
      
      <div className="login-card-premium group z-10">
        <div className="login-card-content">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400 opacity-100 dark:opacity-0" />

          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-zinc-950 rounded-xl shadow-lg dark:shadow-blue-500/10">
                <Logo size="sm" className="filter brightness-110" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Core <span className="text-blue-500">Sentinel</span>
              </h1>
            </div>
            
            <h2 className="text-[22px] font-bold text-zinc-900 dark:text-white mb-2 text-center">Two-Factor Authentication</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-[280px]">
              Enter the 6 digit code sent to your email address to verify your identity.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-3 max-w-[340px] mx-auto">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                  className="w-12 h-14 text-center text-xl font-bold bg-white dark:bg-[#0f172a] border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none transition-all duration-300 focus:border-blue-500/50 dark:focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/5 dark:focus:ring-blue-400/5 dark:text-white dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] shadow-sm"
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-[14px] text-zinc-500 dark:text-zinc-400 font-medium">
                Didn't receive a code?{" "}
                <button
                  type="button"
                  onClick={async () => {
                    setTimer(58);
                    try {
                      await sendOTPRequest();
                      toast.success("A new code has been sent to your email.");
                    } catch {
                      toast.error("Failed to resend code.");
                    }
                  }}
                  className="text-blue-600 dark:text-blue-500 font-bold hover:underline transition-all"
                >
                  Resend
                </button>
              </p>
              
              <div className="text-sm font-mono text-zinc-400 dark:text-zinc-500 tracking-[0.2em] opacity-80">
                - {formatTime(timer)} -
              </div>
            </div>

            <button type="submit" className="login-submit-btn py-6" disabled={loading}>
              {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify"}
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="w-full text-center text-[14px] font-bold text-zinc-500 dark:text-blue-400/80 hover:text-blue-600 dark:hover:text-blue-300 transition-all flex items-center justify-center gap-2 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
