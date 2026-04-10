import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface TwoFactorRouteProps {
  children: ReactNode;
}

// Guards 2FA page ONLY.
// If not authenticated, redirect to login.
// If already 2FA verified, redirect to dashboard.
export function TwoFactorRoute({ children }: TwoFactorRouteProps) {
  const { user, loading, is2FAVerified } = useAuth();

  if (loading) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center"
        style={{ background: "#0A0A0F" }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (is2FAVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
