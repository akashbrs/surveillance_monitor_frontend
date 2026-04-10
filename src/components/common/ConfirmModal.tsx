import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  expectedText: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  expectedText,
}: ConfirmModalProps) {
  const [input, setInput] = useState("");
  const [isReady, setIsReady] = useState(false);

  // Reset input when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setInput("");
      setIsReady(false);
      const timer = setTimeout(() => setIsReady(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValid = input === expectedText && isReady;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B1220] border border-red-500/30 rounded-xl p-6 w-[420px] shadow-[0_0_40px_rgba(239,68,68,0.15)] animate-slide-up relative overflow-hidden">
        
        {/* Warning accent top bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
        
        {/* Title */}
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="text-red-500 text-lg font-semibold tracking-wide">
            {title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Action input */}
        <div className="mb-6 space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            To confirm, type <span className="text-red-400 select-all font-mono mx-1">"{expectedText}"</span> below
          </label>
          <input
            type="text"
            placeholder={expectedText}
            className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-950/50 border border-red-500/40 text-gray-900 dark:text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-900/70 dark:text-white/70 hover:bg-gray-900/5 dark:bg-white/5 hover:text-gray-900 dark:text-white rounded-lg transition-colors border border-transparent hover:border-gray-900/10 dark:border-white/10"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            disabled={!isValid}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
              isValid
                ? "bg-red-600 hover:bg-red-500 text-gray-900 dark:text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] active:scale-95"
                : "bg-red-950/50 text-red-500/50 border-red-900/50 cursor-not-allowed"
            }`}
            onClick={() => {
              console.log("CRITICAL ACTION EXECUTED:", expectedText);
              onConfirm();
              onClose();
            }}
          >
            {isReady ? confirmText : "Wait..."}
          </button>
        </div>
      </div>
    </div>
  );
}
