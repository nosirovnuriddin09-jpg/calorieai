"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLocalDateString } from "@/lib/dateRange";

interface DiaryDateNavProps {
  date: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

function addDays(date: string, delta: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day + delta);
  return getLocalDateString(d);
}

function formatDisplay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const today = getLocalDateString();
  const yesterday = addDays(today, -1);
  if (date === today) return "Today";
  if (date === yesterday) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export default function DiaryDateNav({ date, onChange }: DiaryDateNavProps) {
  const today = getLocalDateString();
  const isToday = date === today;

  return (
    <div className="flex items-center justify-between bg-surface rounded-full p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-black/[0.03]">
      <button
        onClick={() => onChange(addDays(date, -1))}
        aria-label="Previous day"
        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-black/[0.04] transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm font-semibold px-2">{formatDisplay(date)}</span>
      <button
        onClick={() => onChange(addDays(date, 1))}
        aria-label="Next day"
        disabled={isToday}
        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-black/[0.04] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
