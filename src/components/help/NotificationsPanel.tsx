import { Bell } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import type { AppSettings } from "@/contexts/DashboardContext";
import { cardClass } from "./styles";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function NotificationsPanel() {
  const { settings, updateSettings } = useDashboard();
  const navigate = useNavigate();

  const handleToggle = (key: keyof AppSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      updateSettings({ [key]: e.target.checked });
      toast.success(`${key} updated`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update setting");
    }
  };

  return (
    <div className={`${cardClass} space-y-4`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Bell className="h-4 w-4 text-amber-400" />
        Alerts Configuration
      </h2>
      
      <div className="space-y-3">
        <label className="flex items-center justify-between text-sm cursor-pointer group">
          <span className="text-gray-900/70 dark:text-white/70 group-hover:text-gray-900 dark:text-white transition-colors">Email Alerts</span>
          <input 
            type="checkbox" 
            checked={settings.emailNotifications ?? true} 
            onChange={handleToggle('emailNotifications')}
            className="rounded border-gray-900/20 dark:border-white/20 bg-gray-900/5 dark:bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-black"
          />
        </label>
        
        <label className="flex items-center justify-between text-sm cursor-pointer group">
          <span className="text-gray-900/70 dark:text-white/70 group-hover:text-gray-900 dark:text-white transition-colors">In-App Notifications</span>
          <input 
            type="checkbox" 
            checked={settings.inAppNotifications ?? true} 
            onChange={handleToggle('inAppNotifications')}
            className="rounded border-gray-900/20 dark:border-white/20 bg-gray-900/5 dark:bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-black"
          />
        </label>
        
        <label className="flex items-center justify-between text-sm cursor-pointer group disabled:opacity-50">
          <span className="text-gray-900/70 dark:text-white/70 group-hover:text-gray-900 dark:text-white transition-colors">Slack Integration</span>
          <input 
            type="checkbox" 
            checked={settings.slackConnected ?? false} 
            onChange={handleToggle('slackConnected')}
            className="rounded border-gray-900/20 dark:border-white/20 bg-gray-900/5 dark:bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-black"
          />
        </label>
      </div>

      <button onClick={() => navigate('/settings')} className="w-full text-center py-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
        → Manage Settings →
      </button>
    </div>
  );
}
