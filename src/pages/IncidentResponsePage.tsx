import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { LogDetailModal } from "@/components/LogDetailModal";
import { LogEntry } from "@/lib/mock-data";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export default function IncidentResponsePage() {
  const {
    filteredLogs,
    blockIP,
    ignoreIncident,
  } = useDashboard();

  const [blockTarget, setBlockTarget] = useState<LogEntry | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // tracks which row is loading

  // Filter for incidents only
  const incidents = filteredLogs.filter(
    (l) =>
      l.status === "Active" ||
      l.status === "Investigating" ||
      l.status === "Blocked" ||
      l.status === "Ignored"
  );

  const confirmBlock = async () => {
    if (!blockTarget) return;
    setActionLoading(blockTarget.id);
    try {
      await blockIP(blockTarget.ip, blockTarget.id);
    } finally {
      setBlockTarget(null);
      setActionLoading(null);
    }
  };

  const handleIgnore = async (entry: LogEntry) => {
    setActionLoading(entry.id);
    try {
      await ignoreIncident(entry.id);
    } finally {
      setActionLoading(null);
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

  const statusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-destructive/15 text-destructive";
      case "Blocked": return "bg-success/15 text-success";
      case "Ignored": return "bg-muted text-muted-foreground";
      default: return "bg-warning/15 text-warning";
    }
  };

  const activeIncidents = incidents.filter(
    (i) => i.status === "Active" || i.status === "Investigating"
  );
  const resolvedIncidents = incidents.filter(
    (i) => i.status === "Blocked" || i.status === "Ignored"
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-slide-up">
        <h1 className="text-lg font-bold text-foreground">Incident Response</h1>

        {/* Active incidents */}
        <div className="card-glass rounded-2xl p-6">
          <h3 className="section-title mb-5">Active Incidents</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                    IP Address
                  </th>
                  <th className="pb-3 pr-4 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                    Attack Type
                  </th>
                  <th className="pb-3 pr-4 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 pr-4 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                    Time
                  </th>
                  <th className="pb-3 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeIncidents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No active incidents — all threats have been handled.
                    </td>
                  </tr>
                ) : (
                  activeIncidents.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-border/30 transition-all duration-200 hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <td
                        onClick={() => setSelectedLog(entry)}
                        className="cursor-pointer py-4 pr-4 font-mono text-[13px] text-foreground hover:text-primary transition-colors"
                      >
                        {entry.ip}
                      </td>
                      <td
                        className={`py-4 pr-4 text-[13px] font-semibold ${threatColor(
                          entry.attackType
                        )}`}
                      >
                        {entry.attackType}
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold ${statusColor(
                            entry.status
                          )}`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-[13px] text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="flex gap-2 py-3.5">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setBlockTarget(entry)}
                          disabled={actionLoading === entry.id}
                          className="h-7 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:brightness-110"
                        >
                          {actionLoading === entry.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Block IP"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleIgnore(entry)}
                          disabled={actionLoading === entry.id}
                          className="h-7 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:brightness-110"
                        >
                          Ignore
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resolved incidents */}
        {resolvedIncidents.length > 0 && (
          <div className="card-glass rounded-2xl p-6">
            <h3 className="section-title mb-5">Resolved Incidents</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                      IP Address
                    </th>
                    <th className="pb-3 pr-4 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                      Attack Type
                    </th>
                    <th className="pb-3 pr-4 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                      Resolution
                    </th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-[1px] text-muted-foreground">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedIncidents.map((entry) => (
                    <tr
                      key={entry.id}
                      onClick={() => setSelectedLog(entry)}
                      className="cursor-pointer border-b border-border/30 opacity-60 transition-all duration-200 hover:opacity-100 hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <td className="py-4 pr-4 font-mono text-[13px] text-foreground">
                        {entry.ip}
                      </td>
                      <td
                        className={`py-4 pr-4 text-[13px] font-semibold ${threatColor(
                          entry.attackType
                        )}`}
                      >
                        {entry.attackType}
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold ${statusColor(
                            entry.status
                          )}`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-4 text-[13px] text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        open={!!blockTarget}
        onOpenChange={() => setBlockTarget(null)}
      >
        <AlertDialogContent
          className="border-border bg-card"
          style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Block IP Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block{" "}
              <span className="font-mono text-foreground">
                {blockTarget?.ip}
              </span>
              ? This will prevent all future traffic from this IP.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-border">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBlock}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LogDetailModal
        log={selectedLog}
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      />
    </DashboardLayout>
  );
}
