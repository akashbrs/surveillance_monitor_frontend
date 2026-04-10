import { useState, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { LogDetailModal } from "@/components/LogDetailModal";
import { FileText, ShieldAlert, Flame, Ban } from "lucide-react";
import { attackDistribution, activityTimeline } from "@/lib/mock-data";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell,
} from "recharts";

// Semantic: red=critical, amber=warning, green=safe, blue=info
const CHART_COLORS: Record<string, string> = {
  SQLi:       "#F87171", // red     — SQL Injection is critical
  XSS:        "#FBBF24", // amber   — XSS is warning
  Bruteforce: "#4ADE80", // green   — brute force (monitored)
  DDoS:       "#60A5FA", // blue    — DDoS is informational load
};

const chartTooltipStyle = {
  background: "hsl(220 20% 7%)",
  border: "1px solid hsl(220 15% 16%)",
  borderRadius: "12px",
  color: "hsl(210 20% 92%)",
  fontSize: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
};

const getAppName = (target?: string) => {
  switch (target) {
    case "electronics":
      return "Electronics App";
    case "fashion":
      return "Fashion App";
    case "organization":
      return "Organization App";
    default:
      return "Unknown";
  }
};

export default function DashboardPage() {
  const {
    refreshKey,
    refreshData,
    loading,
    logs,
    stats,
    selectedApp,
    attackDistributionData,
    activityTimelineData,
  } = useDashboard();
  const [selectedLog, setSelectedLog] = useState<
    import("@/lib/mock-data").LogEntry | null
  >(null);

  const filteredLogs = useMemo(() => {
    if (selectedApp === "All Apps") return logs;
    return logs.filter((l) => l.app === selectedApp);
  }, [logs, selectedApp]);

  const threatColor = (type: string) => {
    switch (type) {
      case "SQLi": return "text-destructive";
      case "XSS": return "text-warning";
      case "Bruteforce": return "text-success";
      case "DDoS": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const severityColor = (sev: string) => {
    switch (sev) {
      case "Critical": return "bg-destructive/15 text-destructive";
      case "High": return "bg-warning/15 text-warning";
      case "Medium": return "bg-primary/15 text-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Wire triggerRefresh to the real refreshData that calls the API
  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  return (
    <DashboardLayout onRefresh={handleRefresh} loading={loading}>
      <div key={refreshKey} className="space-y-8 animate-slide-up">
        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <StatCard title="Total Logs" value={stats.totalLogs} icon={FileText} trend="12% from yesterday" trendUp />
          </div>
          <div className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <StatCard title="Total Attacks" value={stats.totalAttacks} icon={ShieldAlert} trend="8% from yesterday" trendUp variant="danger" />
          </div>
          <div className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <StatCard title="Active Threats" value={stats.activeThreats} icon={Flame} trend="3 new" trendUp={false} variant="warning" />
          </div>
          <div className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <StatCard title="Blocked IPs" value={stats.blockedIPs} icon={Ban} trend="15 today" trendUp variant="success" />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="portal-card portal-card-blue col-span-1 lg:col-span-2">
            <div className="portal-card-content h-full">
              <h3 className="section-title mb-8 px-1 text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px]">Attack Distribution</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attackDistributionData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff30" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#ffffff30" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={chartTooltipStyle} 
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      animationDuration={300}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {attackDistributionData.map((entry, i) => (
                        <Cell key={i} fill={CHART_COLORS[entry.name] || entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="portal-card portal-card-red backdrop-blur-3xl bg-black/40">
            <div className="portal-card-content h-full">
              <h3 className="section-title mb-8 px-1 text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px]">Activity Timeline</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A3E635" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#A3E635" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" stroke="#ffffff08" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#ffffff30" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      stroke="#ffffff30" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      tickCount={6}
                    />
                    <Tooltip 
                      contentStyle={chartTooltipStyle}
                      animationDuration={300}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="attacks" 
                      stroke="#A3E635" 
                      fill="url(#areaGradient)" 
                      strokeWidth={2.5} 
                      dot={false} 
                      activeDot={{ r: 5, fill: "#A3E635", stroke: "#000", strokeWidth: 2 }} 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="portal-card portal-card-blue">
          <div className="portal-card-content">
            <h3 className="section-title mb-6 px-1">Recent Logs</h3>
            {filteredLogs.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">No logs found for the selected filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-white/5 text-left font-bold opacity-60">
                      <th className="pb-3 pr-4 text-[11px] uppercase tracking-[2px]">IP Address</th>
                      <th className="pb-3 pr-4 text-[11px] uppercase tracking-[2px]">Application</th>
                      <th className="pb-3 pr-4 text-[11px] uppercase tracking-[2px]">Attack Type</th>
                      <th className="pb-3 pr-4 text-[11px] uppercase tracking-[2px]">Payload</th>
                      <th className="pb-3 pr-4 text-[11px] uppercase tracking-[2px]">Severity</th>
                      <th className="pb-3 pr-4 text-[11px] uppercase tracking-[2px]">Time</th>
                      <th className="pb-3 text-[11px] uppercase tracking-[2px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                    {filteredLogs.slice(0, 6).map((log) => (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className="cursor-pointer transition-all duration-200 hover:bg-zinc-500/5 group"
                      >
                        <td className="py-4 pr-4 font-mono text-[13px] text-zinc-600 dark:text-zinc-300 font-bold">{log.ip}</td>
                        <td className="py-4 pr-4 text-[13px] font-medium text-zinc-600 dark:text-zinc-300"><p>{log.app}</p></td>
                        <td className={`py-4 pr-4 text-[13px] font-black ${threatColor(log.attackType)}`}>{log.attackType}</td>
                        <td className="max-w-[200px] truncate py-4 pr-4 font-mono text-[11px] text-zinc-400 dark:text-zinc-500">{log.payload}</td>
                        <td className="py-4 pr-4">
                          <span className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${severityColor(log.severity)}`}>{log.severity}</span>
                        </td>
                        <td className="py-4 pr-4 text-[13px] text-zinc-500 dark:text-zinc-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="py-4 text-[13px]">
                          <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                             {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <LogDetailModal log={selectedLog} open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)} />
    </DashboardLayout>
  );
}
