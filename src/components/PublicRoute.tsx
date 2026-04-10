import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

// Guards public routes (Login, Signup).
// If user is already logged in, redirect forward.
export function PublicRoute({ children }: PublicRouteProps) {
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

  if (user && is2FAVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
