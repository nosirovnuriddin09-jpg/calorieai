"use client";

import { TimeRange } from "@/types/models";

interface TimeRangeTabsProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const options: { id: TimeRange; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

export default function TimeRangeTabs({ value, onChange }: TimeRangeTabsProps) {
  return (
    <div className="inline-flex items-center bg-surface rounded-full p-1 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-black/[0.03]">
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`px-4 sm:px-5 h-9 rounded-full text-sm font-medium transition-colors ${
              isActive ? "bg-cta text-background" : "text-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
