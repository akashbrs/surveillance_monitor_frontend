import { Settings, Shield, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2">
      <button 
        onClick={() => { toast("Opening Settings..."); navigate("/settings"); }}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-900/70 dark:text-white/70 bg-gray-900/5 dark:bg-white/5 hover:bg-gray-900/10 dark:bg-white/10 border border-gray-900/10 dark:border-white/10 rounded-lg transition-colors"
      >
        <Settings className="h-4 w-4" />
        Fix Settings Issue
      </button>
      <button 
        onClick={() => { toast("Opening Scan Module..."); navigate("/scan"); }}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-900/70 dark:text-white/70 bg-gray-900/5 dark:bg-white/5 hover:bg-gray-900/10 dark:bg-white/10 border border-gray-900/10 dark:border-white/10 rounded-lg transition-colors"
      >
        <Shield className="h-4 w-4" />
        Run Scan Guide
      </button>
      <button 
        onClick={() => { window.location.href = "mailto:support@coresentinel.io"; }}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-900/70 dark:text-white/70 bg-gray-900/5 dark:bg-white/5 hover:bg-gray-900/10 dark:bg-white/10 border border-gray-900/10 dark:border-white/10 rounded-lg transition-colors"
      >
        <Mail className="h-4 w-4" />
        Contact Support
      </button>
    </div>
  );
}
