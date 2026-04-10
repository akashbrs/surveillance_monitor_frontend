import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  Search,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Threat Detection", path: "/threats", icon: Shield },
  { title: "Vulnerability Scan", path: "/scan", icon: Search },
  { title: "Incident Response", path: "/incidents", icon: AlertTriangle },
];

const bottomItems = [
  { title: "Settings", path: "/settings", icon: Settings },
  { title: "Help", path: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col border-r border-gray-900/10 dark:border-white/5 bg-white/70 dark:bg-[#020617]/40 backdrop-blur-xl transition-all duration-300 ease-in-out z-30 ${
        collapsed ? "w-[72px]" : "w-[220px]"
      }`}
    >
      {/* Portal Glowing Separator */}
      <div className="portal-sidebar-border" />
      {/* Logo */}
      <div className="flex h-[72px] items-center gap-3 px-5">
        <Logo size="sm" />
        {!collapsed && (
          <h1 className="text-xl lg:text-3xl font-extrabold tracking-wide text-gray-900 dark:text-white">
            Core <span className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]">Sentinel</span>
          </h1>
        )}
      </div>

      {/* Main Nav */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        <p className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground ${collapsed ? "hidden" : ""}`}>
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/25 shadow-[0_0_10px_-2px_hsl(82_85%_55%/0.3)] text-glow-lime"
                  : "text-sidebar-foreground hover:bg-gray-900/[0.05] dark:bg-white/[0.05] hover:text-foreground"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="space-y-1 border-t border-gray-900/10 dark:border-white/10 px-3 py-3">
        {bottomItems.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-gray-900/60 dark:text-white/60 transition-colors hover:bg-gray-900/[0.05] dark:bg-white/[0.05] hover:text-gray-900 dark:text-white ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full border border-gray-900/10 dark:border-white/10 bg-white dark:bg-gray-900 text-gray-900/60 dark:text-white/60 shadow-lg transition-all duration-200 hover:text-gray-900 dark:text-white hover:border-primary/30 hover:scale-110"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
