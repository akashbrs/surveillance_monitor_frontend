import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";
import { AuthBackground } from "./AuthBackground";

interface DashboardLayoutProps {
  children: ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
}

export function DashboardLayout({ children, onRefresh, loading }: DashboardLayoutProps) {
  return (
    <div className="portal-main-layout font-inter">
      {/* Global Background Effect */}
      <AuthBackground />
      
      <AppSidebar />
      
      <div className="portal-content-area">
        <TopNavbar onRefresh={onRefresh} loading={loading} />
        <main className="flex-1 overflow-auto p-5 scrollbar-hide">
          <div className="max-w-[1536px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
