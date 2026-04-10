import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LogDetailModal } from "@/components/LogDetailModal";
import { LogEntry } from "@/lib/mock-data";
import { useDashboard } from "@/contexts/DashboardContext";
import { Search, ArrowUpDown } from "lucide-react";

const attackTypes = ["All", "SQLi", "XSS", "Bruteforce", "DDoS"] as const;

export default function ThreatDetectionPage() {
  const {
    filteredLogs,
    searchQuery,
    setSearchQuery,
    attackTypeFilter,
    setAttackTypeFilter,
    sortField,
    sortDir,
    setSort,
  } = useDashboard();

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSort(field, sortDir === "asc" ? "desc" : "asc");
    } else {
      setSort(field, "desc");
    }
  };

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

  const SortHeader = ({
    field,
    children,
  }: {
    field: typeof sortField;
    children: string;
  }) => (
    <th
      onClick={() => handleSort(field)}
      className="cursor-pointer select-none pb-3 pr-4 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown
          className={`h-3 w-3 ${sortField === field ? "text-primary" : "opacity-30"}`}
        />
      </span>
    </th>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-slide-up">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-lg font-bold text-foreground">Threat Detection</h1>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search IP or payload..."
                className="h-9 w-56 rounded-xl border border-border bg-accent/50 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
              />
            </div>
            {/* Filter pills */}
            <div className="flex gap-1.5">
              {attackTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setAttackTypeFilter(type)}
                  className={`rounded-xl px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
                    attackTypeFilter === type
                      ? "bg-primary/10 text-primary text-glow-lime border border-primary/20"
                      : "border border-transparent text-muted-foreground hover:text-foreground hover:bg-accent hover:brightness-110"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6">
          {filteredLogs.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No threats match your search or filter criteria.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <SortHeader field="ip">IP Address</SortHeader>
                    <SortHeader field="attackType">Attack Type</SortHeader>
                    <th className="pb-3 pr-4 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                      Payload
                    </th>
                    <SortHeader field="severity">Severity</SortHeader>
                    <SortHeader field="timestamp">Time</SortHeader>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="cursor-pointer border-b border-border/30 transition-all duration-200 hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <td className="py-4 pr-4 font-mono text-[13px] text-foreground">
                        {log.ip}
                      </td>
                      <td
                        className={`py-4 pr-4 text-[13px] font-semibold ${threatColor(
                          log.attackType
                        )}`}
                      >
                        {log.attackType}
                      </td>
                      <td className="max-w-[250px] truncate py-4 pr-4 font-mono text-[11px] text-muted-foreground">
                        {log.payload}
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold ${severityColor(
                            log.severity
                          )}`}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-[13px] text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-4 text-[13px] text-muted-foreground">
                        {log.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <LogDetailModal
        log={selectedLog}
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      />
    </DashboardLayout>
  );
}
