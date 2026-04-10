import { AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cardClass } from "./styles";

const issues = [
  {
    title: "Settings Not Saving",
    severity: "critical",
    actionType: "settings",
    solutions: [
      "Enable Auto-Save or click Save",
      "Check localStorage persistence"
    ]
  },
  {
    title: "Scan Not Completing",
    severity: "warning",
    actionType: "scan",
    solutions: [
      "Verify target connectivity",
      "Check scan logs"
    ]
  }
];

const severityStyles = {
  critical: "border-red-500/40 bg-red-500/10 text-red-500",
  warning: "border-yellow-500/40 bg-yellow-500/10 text-yellow-500",
  info: "border-blue-500/40 bg-blue-500/10 text-blue-500"
};

export function CommonIssues() {
  const navigate = useNavigate();

  const handleFixIssue = (type: string) => {
    switch (type) {
      case "settings":
        toast.info("Opening Settings to verify auto-save...");
        navigate("/settings");
        break;
      case "scan":
        toast.info("Opening Vulnerability Scan module...");
        navigate("/scan");
        break;
      default:
        toast.error("No automated fix available for this issue.");
    }
  };

  if (issues.length === 0) {
    return (
      <div className={cardClass}>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          Common Issues
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-gray-900/60 dark:text-white/60">
          <span className="text-3xl mb-3">🎉</span>
          <p className="font-medium">No active issues</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardClass} space-y-4`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-red-400" />
        Common Issues
      </h2>
      <div className="space-y-3">
        {issues.map((issue, idx) => (
          <div key={idx} className={`p-4 rounded-lg border ${severityStyles[issue.severity as keyof typeof severityStyles]} flex flex-col sm:flex-row sm:items-start justify-between gap-4`}>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{issue.title}</h3>
              <ul className="text-sm text-gray-900/70 dark:text-white/70 space-y-1">
                {issue.solutions.map((sol, sIdx) => (
                  <li key={sIdx} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 opacity-50 shrink-0" />
                    {sol}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => handleFixIssue(issue.actionType)}
              className="shrink-0 bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:bg-white/20 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-900/5 dark:border-white/5"
            >
              Fix Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
