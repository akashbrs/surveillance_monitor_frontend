import { Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { cardClass } from "./styles";

const initialStatus = {
  detection: "active",
  scan: "running",
  notifications: "partial"
};

const statusColors = {
  active: "bg-green-500",
  running: "bg-green-500",
  partial: "bg-yellow-500",
  down: "bg-red-500",
  idle: "bg-blue-500"
};

export function SystemStatus() {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        scan: prev.scan === "running" ? "idle" : "running"
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${cardClass} space-y-4`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-400" />
          System Status
        </span>
        <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">LIVE</span>
      </h2>
      
      <div className="space-y-3">
        {Object.entries(status).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <span className="text-gray-900/70 dark:text-white/70 capitalize">{key} Engine</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900/90 dark:text-white/90 capitalize">{val}</span>
              <div className={`h-2 w-2 rounded-full ${statusColors[val as keyof typeof statusColors] || "bg-blue-500"} animate-pulse`} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-3 border-t border-gray-900/10 dark:border-white/10 text-xs text-gray-900/40 dark:text-white/40 text-right">
        Last Sync: Just now
      </div>
    </div>
  );
}
