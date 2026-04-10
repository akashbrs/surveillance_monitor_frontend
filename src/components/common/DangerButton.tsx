import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface DangerButtonProps {
  label: string;
  onConfirm: () => void;
  expectedText: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string; // allow overrides (e.g. w-full)
}

export default function DangerButton({
  label,
  onConfirm,
  expectedText,
  title,
  description,
  icon,
  className
}: DangerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`gap-2 border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 active:scale-[0.98] rounded-md px-4 py-2 flex items-center justify-center font-medium ${className || ""}`}
        onClick={() => setOpen(true)}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </button>

      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        title={title}
        description={description}
        confirmText={label}
        expectedText={expectedText}
      />
    </>
  );
}
