import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: "default" | "danger" | "warning" | "success";
}

const variantConfig = {
  default: {
    icon: "text-primary",
    bg: "bg-primary/8",
    glow: "shadow-[0_0_20px_-4px_hsl(82_85%_55%/0.2)]",
  },
  danger: {
    icon: "text-destructive",
    bg: "bg-destructive/8",
    glow: "shadow-[0_0_20px_-4px_hsl(0_72%_55%/0.2)]",
  },
  warning: {
    icon: "text-warning",
    bg: "bg-warning/8",
    glow: "shadow-[0_0_20px_-4px_hsl(38_92%_60%/0.2)]",
  },
  success: {
    icon: "text-success",
    bg: "bg-success/8",
    glow: "shadow-[0_0_20px_-4px_hsl(142_60%_48%/0.2)]",
  },
};

export function StatCard({ title, value, icon: Icon, trend, trendUp, variant = "default" }: StatCardProps) {
  const portalVariant = 
    variant === "danger" ? "portal-card-red" : 
    variant === "warning" ? "portal-card-amber" : 
    variant === "success" ? "portal-card-green" : 
    "portal-card-blue";

  return (
    <div className={`portal-card ${portalVariant}`}>
      <div className="portal-card-content h-full flex flex-col justify-center p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-zinc-500 dark:text-zinc-400 opacity-80">{title}</p>
            <div className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
              {typeof value === "number" ? value.toLocaleString() : value}
            </div>
            {trend && (
              <p className={`flex items-center gap-1.5 text-[12px] font-bold ${trendUp ? "text-emerald-500" : "text-rose-500"}`}>
                <span className="text-[10px]">{trendUp ? "▲" : "▼"}</span>
                {trend}
              </p>
            )}
          </div>
          <div className="p-2.5 bg-zinc-900/5 dark:bg-white/5 rounded-xl border border-zinc-900/10 dark:border-white/10 shadow-inner">
            <Icon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
