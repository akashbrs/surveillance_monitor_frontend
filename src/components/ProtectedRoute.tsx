import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Guards all authenticated routes.
// Shows a full-screen loader during session restore (prevents flash of login page).
// Redirects to "/" if not authenticated.
export function ProtectedRoute({ children }: ProtectedRouteProps) {
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

  if (!is2FAVerified) {
    return <Navigate to="/2fa" replace />;
  }

  return <>{children}</>;
}
