import { useState } from "react";
import { LogEntry } from "@/lib/mock-data";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ban, Loader2 } from "lucide-react";

interface LogDetailModalProps {
  log: LogEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const severityColor = (sev: string) => {
  switch (sev) {
    case "Critical": return "bg-destructive/15 text-destructive";
    case "High": return "bg-warning/15 text-warning";
    case "Medium": return "bg-primary/15 text-primary";
    default: return "bg-muted text-muted-foreground";
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

export function LogDetailModal({ log, open, onOpenChange }: LogDetailModalProps) {
  const { blockIP } = useDashboard();
  const [blocking, setBlocking] = useState(false);

  if (!log) return null;

  const handleBlockIP = async () => {
    setBlocking(true);
    try {
      await blockIP(log.ip, log.id);
      onOpenChange(false);
    } catch {
      // error already toasted inside blockIP
    } finally {
      setBlocking(false);
    }
  };

  const isAlreadyBlocked = log.status === "Blocked" || log.status === "Ignored";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card max-w-md" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
        <DialogHeader>
          <DialogTitle className="text-foreground">Threat Detail</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">IP Address</p>
              <p className="mt-1 font-mono text-sm text-foreground">{log.ip}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">Attack Type</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{log.attackType}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">Severity</p>
              <span className={`mt-1 inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold ${severityColor(log.severity)}`}>
                {log.severity}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">Status</p>
              <span className={`mt-1 inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold ${statusColor(log.status)}`}>
                {log.status}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">Payload</p>
            <pre className="mt-1 rounded-lg bg-accent/50 p-3 font-mono text-[12px] text-foreground overflow-x-auto">
              {log.payload}
            </pre>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">Timestamp</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
          {log.app && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">Application</p>
              <p className="mt-1 text-sm text-muted-foreground">{log.app}</p>
            </div>
          )}

          {/* Action button */}
          {!isAlreadyBlocked && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBlockIP}
              disabled={blocking}
              className="mt-2 w-full gap-2 rounded-xl text-[13px] font-semibold transition-all duration-200 hover:brightness-110"
            >
              {blocking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              {blocking ? "Blocking..." : "Block IP"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
