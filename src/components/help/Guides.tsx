import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { cardClass } from "./styles";

const guides = [
  { title: "Dashboard Monitoring", route: "/" },
  { title: "Run Vulnerability Scan", route: "/scan" },
  { title: "Threat Detection", route: "/threats" },
  { title: "Configure Settings", route: "/settings" }
];

export function Guides() {
  const navigate = useNavigate();

  return (
    <div className={`${cardClass} space-y-4`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-blue-400" />
        Guides
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {guides.map((guide, idx) => (
          <div key={idx} className="bg-gray-900/5 dark:bg-white/5 border border-gray-900/5 dark:border-white/5 p-4 rounded-lg flex flex-col justify-between items-start gap-4 hover:border-gray-900/20 dark:border-white/20 transition-colors">
            <h3 className="font-semibold text-gray-900/90 dark:text-white/90 text-sm">{guide.title}</h3>
            <button 
              onClick={() => navigate(guide.route)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors group"
            >
              Start Guide <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
