import { useState, useEffect } from "react";
import { format } from "date-fns";
import { RefreshCw, User, Calendar, Bell, ChevronDown, LogOut, Settings, UserCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarWidget } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDashboard } from "@/contexts/DashboardContext";
import { useAuth } from "@/contexts/AuthContext";
import { appList, mockNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";

interface TopNavbarProps {
  onRefresh?: () => void;
  loading?: boolean;
}

export function TopNavbar({ onRefresh }: TopNavbarProps) {
  const { 
    settings, 
    selectedDate, 
    setSelectedDate, 
    selectedApp, 
    setSelectedApp, 
    refreshData, 
    loading, 
    scanStatus,
    notifications,
    markAllNotificationsRead 
  } = useDashboard();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = format(currentTime, settings.use24h ? "HH:mm:ss" : "hh:mm:ss a");

  const popoverBlack =
    "border border-gray-900/10 dark:border-white/10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200";

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRefresh = async () => {
    setRefreshing(true);
    onRefresh?.();
    try {
      await refreshData();
      // toast moved to context addNotification if desired, but here we can just keep toast
      if (settings.inAppNotifications) toast.success("Dashboard data refreshed");
    } catch {
      if (settings.inAppNotifications) toast.error("Refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  const markAllRead = () => {
    markAllNotificationsRead();
    if (settings.inAppNotifications) toast.info("All notifications marked as read");
  };

  const notifTypeColor = (type: string) => {
    switch (type) {
      case "alert": return "bg-destructive/15 text-destructive";
      case "success": return "bg-success/15 text-success";
      default: return "bg-primary/15 text-primary";
    }
  };

  return (
    <header
      className="relative flex h-[72px] items-center justify-between px-6 border-b border-gray-900/10 dark:border-white/10 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-md"
    >
      {/* LEFT: Branding + Live Status */}
      <div className="flex items-center gap-4">
        <Logo size="sm" />
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide whitespace-nowrap">
          Core <span className="text-[#22D3B6] drop-shadow-[0_0_8px_rgba(34,211,182,0.4)]">Sentinel</span> SOC Dashboard
        </h1>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${scanStatus === "scanning"
            ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
            : "border-primary/20 bg-primary/5 text-primary text-glow-lime"
            }`}
          title={scanStatus === "scanning" ? "System Monitoring Active" : "System Live"}
        >
          <span className={`live-dot ${scanStatus === "scanning" ? "amber bg-amber-500" : "bg-primary"}`} />
          {scanStatus === "scanning" ? "ACTIVE" : "LIVE"}
        </span>
      </div>

      {/* RIGHT: Controls (Clock, Date, App, Notifications, Profile) */}
      <div className="flex items-center gap-2">
        {/* Live Time Container */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-900/10 dark:border-white/10 bg-gray-900/[0.03] dark:bg-white/[0.03] px-3.5 py-2 text-[13px] text-gray-900/60 dark:text-white/60 font-mono transition-all duration-200">
          <Clock className="h-3.5 w-3.5" />
          <span className="min-w-[80px] text-center">{timeString}</span>
        </div>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-gray-900/10 dark:border-white/10 bg-gray-900/[0.03] dark:bg-white/[0.03] px-3.5 py-2 text-[13px] text-gray-900/60 dark:text-white/60 transition-all duration-200 hover:border-primary/20 hover:text-gray-900 dark:hover:text-white">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(selectedDate, "MMM dd, yyyy")}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className={`w-auto p-0 ${popoverBlack}`} align="end">
            <CalendarWidget
              mode="single"
              selected={selectedDate}
              onSelect={(d) => {
                if (d) {
                  setSelectedDate(d);
                  if (settings.inAppNotifications) toast.info(`Filtering data for ${format(d, "MMM dd, yyyy")}`);
                }
              }}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* App Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-gray-900/10 dark:border-white/10 bg-gray-900/[0.03] dark:bg-white/[0.03] px-3.5 py-2 text-[13px] text-gray-900/60 dark:text-white/60 transition-all duration-200 hover:border-primary/20 hover:text-gray-900 dark:hover:text-white">
              <span>{selectedApp}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className={`w-48 p-1.5 ${popoverBlack}`} align="end">
            {appList.map((app) => (
              <button
                key={app}
                onClick={() => {
                  setSelectedApp(app);
                  if (settings.inAppNotifications) toast.info(`Filtering: ${app}`);
                }}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-[13px] transition-all duration-200 mb-1 last:mb-0 ${selectedApp === app
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-900/60 dark:text-white/60 hover:bg-gray-900/[0.05] dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {app}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Refresh */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-80 p-0 ${popoverBlack}`} align="end">
            <div className="flex items-center justify-between border-b border-gray-900/10 dark:border-white/10 px-4 py-3 bg-gray-50/50 dark:bg-white/[0.02]">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Notifications</p>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[11px] font-bold text-blue-500 hover:text-blue-400 dark:text-blue-400 transition-colors">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 border-b border-gray-900/5 dark:border-white/[0.05] px-4 py-4 transition-colors hover:bg-gray-100/50 dark:hover:bg-white/[0.02] ${!n.read ? "bg-blue-500/[0.02] dark:bg-blue-500/[0.03]" : ""
                      }`}
                  >
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full transition-all ${!n.read ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-transparent"}`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-[13px] font-bold tracking-tight ${!n.read ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>{n.title}</p>
                        <span className={cn(
                          "rounded-[4px] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider",
                          n.type === "alert" ? "bg-red-500/10 text-red-500 border border-red-500/20" : 
                          n.type === "success" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                          "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        )}>
                          {n.type}
                        </span>
                      </div>
                      <p className="text-[12px] leading-snug text-gray-500 dark:text-gray-400">{n.message}</p>
                      <p className="text-[10px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-tighter">{n.time}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-accent transition-all duration-200 hover:border-primary/20">
              <User className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={`${popoverBlack} w-72 p-4`}
            align="end"
          >
            <div className="mb-3">
              <p className="text-base font-semibold text-gray-900 dark:text-white">{user?.name ?? "Operator"}</p>
              <p className="text-sm text-gray-400">{user?.email ?? "admin@coresentinel.io"}</p>
            </div>

            <hr className="my-3 border-gray-900/10 dark:border-white/10" />

            {/* Menu */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/profile")}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-900/5 dark:bg-white/5 hover:text-gray-900 dark:text-white transition"
              >
                <UserCircle className="h-4 w-4" />
                Profile
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-900/5 dark:bg-white/5 hover:text-gray-900 dark:text-white transition"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>

              <button
                onClick={logout}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
