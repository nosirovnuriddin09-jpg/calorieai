"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface HealthMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sublabel?: string;
  progress?: number; // 0-1
  bgClass: string;
  accentClass: string;
  iconWrapClass: string;
  action?: ReactNode;
}

export default function HealthMetricCard({
  icon: Icon,
  label,
  value,
  sublabel,
  progress,
  bgClass,
  accentClass,
  iconWrapClass,
  action,
}: HealthMetricCardProps) {
  return (
    <div className={`rounded-[24px] p-5 flex flex-col justify-between min-h-[150px] ${bgClass}`}>
      <div className="flex items-center justify-between">
        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${iconWrapClass}`}>
          <Icon size={17} className={accentClass} />
        </div>
        {action}
      </div>
      <div>
        <p className="text-xs text-muted-2 mb-1">{label}</p>
        <p className="text-lg font-bold leading-tight">{value}</p>
        {sublabel && <p className="text-xs text-muted-2 mt-0.5">{sublabel}</p>}
        {progress !== undefined && (
          <div className="mt-2 h-1.5 w-full rounded-full bg-black/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full ${accentClass.replace("text-", "bg-")}`}
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
