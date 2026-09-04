"use client";

import { LucideIcon } from "lucide-react";

interface OptionCardProps {
  icon?: LucideIcon;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionCard({ icon: Icon, label, description, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-4 border transition-colors flex items-center gap-3 ${
        selected
          ? "bg-cta text-background border-cta"
          : "bg-background border-black/[0.06] hover:border-black/[0.12]"
      }`}
    >
      {Icon && (
        <div
          className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${
            selected ? "bg-white/15" : "bg-surface"
          }`}
        >
          <Icon size={16} className={selected ? "text-background" : "text-muted-2"} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {description && (
          <p className={`text-xs mt-0.5 ${selected ? "text-background/70" : "text-muted"}`}>{description}</p>
        )}
      </div>
    </button>
  );
}
