import { DashboardLayout } from "@/components/DashboardLayout";
import { HelpCircle } from "lucide-react";
import {
  HelpHeader,
  QuickActions,
  CommonIssues,
  Guides,
  SystemStatus,
  NotificationsPanel,
  SupportPanel,
  SmartTips
} from "@/components/help";

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="w-full max-w-6xl space-y-8 animate-slide-up pb-10">
        
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Help & Support</h1>
            <p className="text-sm text-gray-900/50 dark:text-white/50 mt-1">Documentation, troubleshooting, and AI assistance for the Core Sentinel platform.</p>
          </div>
        </div>

        {/* Top Section - Search + Quick Actions */}
        <div className="flex flex-col gap-4">
          <HelpHeader />
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT - 70% */}
          <div className="lg:col-span-8 space-y-6">
            <CommonIssues />
            <Guides />
          </div>

          {/* RIGHT - 30% */}
          <div className="lg:col-span-4 space-y-6">
            <SystemStatus />
            <NotificationsPanel />
            <SupportPanel />
            <SmartTips />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
