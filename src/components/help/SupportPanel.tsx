import { Mail, MessageSquare, Ticket } from "lucide-react";
import { cardClass } from "./styles";

export function SupportPanel() {
  return (
    <div className={`${cardClass} space-y-4`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Mail className="h-4 w-4 text-blue-400" />
        Need Help?
      </h2>
      
      <div className="space-y-3">
        <button 
          onClick={() => window.location.href = "mailto:support@coresentinel.io"}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-900/5 dark:bg-white/5 border border-transparent hover:border-gray-900/10 dark:border-white/10 transition-colors text-sm group"
        >
          <span className="flex items-center gap-2 text-gray-900/70 dark:text-white/70 group-hover:text-gray-900 dark:text-white"><Mail className="h-4 w-4" /> support@coresentinel.io</span>
        </button>
        
        <button 
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-900/5 dark:bg-white/5 border border-transparent hover:border-gray-900/10 dark:border-white/10 transition-colors text-sm group"
        >
          <span className="flex items-center gap-2 text-gray-900/70 dark:text-white/70 group-hover:text-gray-900 dark:text-white"><MessageSquare className="h-4 w-4" /> Live Chat</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded uppercase font-bold tracking-wider">Soon</span>
        </button>

        <button 
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-900/5 dark:bg-white/5 border border-transparent hover:border-gray-900/10 dark:border-white/10 transition-colors text-sm group"
        >
          <span className="flex items-center gap-2 text-gray-900/70 dark:text-white/70 group-hover:text-gray-900 dark:text-white"><Ticket className="h-4 w-4" /> Raise Ticket</span>
        </button>
      </div>

      <button 
        onClick={() => window.location.href = "mailto:support@coresentinel.io"}
        className="w-full bg-blue-500 hover:bg-blue-600 text-gray-900 dark:text-white py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Contact Now
      </button>
    </div>
  );
}
