"use client";

import { LucideIcon } from "lucide-react";

interface DiscoverCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bgClass: string;
  accentClass: string;
  onClick?: () => void;
}

export default function DiscoverCard({
  icon: Icon,
  title,
  description,
  bgClass,
  accentClass,
  onClick,
}: DiscoverCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-[22px] p-4 bg-surface border border-black/[0.04] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow flex items-center gap-3"
    >
      <div className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center ${bgClass}`}>
        <Icon size={18} className={accentClass} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate">{title}</p>
        <p className="text-xs text-muted truncate">{description}</p>
      </div>
    </button>
  );
}
