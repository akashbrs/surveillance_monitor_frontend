import { Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import { cardClass } from "./styles";

const tips = [
  "Run scans weekly for better coverage.",
  "Enable real-time alerts for immediate response.",
  "Monitor unusual traffic spikes.",
  "Keep your SOC dashboard open in a dedicated monitor."
];

export function SmartTips() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % tips.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${cardClass} space-y-4`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-yellow-400" />
        Smart Tips
      </h2>
      
      <div className="h-10 flex items-center">
        <p className="text-sm text-gray-900/70 dark:text-white/70 transition-opacity duration-300" key={index}>
          • {tips[index]}
        </p>
      </div>

      <button className="w-full text-center py-2 text-xs font-medium text-gray-900/40 dark:text-white/40 hover:text-gray-900/70 dark:text-white/70 transition-colors border border-dashed border-gray-900/10 dark:border-white/10 rounded-lg hover:border-gray-900/20 dark:border-white/20">
        Show More Tips
      </button>
    </div>
  );
}
