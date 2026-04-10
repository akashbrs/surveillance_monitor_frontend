import { Search, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function HelpHeader() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search bar on "/"
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        // Only prevent default if we're not inside another input
        if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) return;
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = () => {
    if (!query) return;

    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("settings") || lowerQuery.includes("config")) {
      toast("Navigating to Settings...");
      navigate("/settings");
    } else if (lowerQuery.includes("scan") || lowerQuery.includes("vuln")) {
      toast("Navigating to Scan module...");
      navigate("/scan");
    } else if (lowerQuery.includes("threat") || lowerQuery.includes("attack")) {
      toast("Navigating to Threats...");
      navigate("/threats");
    } else {
      toast.error("No direct results found. Try asking AI.");
    }
  };

  return (
    <div className="flex gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-900/40 dark:text-white/40" />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search issues, docs, features... (Press '/')"
          className="w-full bg-white/60 dark:bg-gray-950/60 border border-gray-900/10 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-900/40 dark:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
      </div>
      <button 
        onClick={() => toast("AI Assistant engine building... Check back soon!")}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <Sparkles className="h-4 w-4" />
        Ask AI
      </button>
    </div>
  );
}
