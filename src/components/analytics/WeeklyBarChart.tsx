"use client";

import { useState } from "react";
import type { DailyPoint } from "@/lib/analyticsData";

interface WeeklyBarChartProps {
  data: DailyPoint[];
  color: string;
  unit?: string;
}

const CHART_HEIGHT = 140;
const BAR_MAX_WIDTH = 24;

export default function WeeklyBarChart({ data, color, unit = "" }: WeeklyBarChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="relative">
      <div className="flex items-end justify-between gap-2" style={{ height: CHART_HEIGHT }}>
        {data.map((point, i) => {
          const heightPx = Math.max((point.value / max) * (CHART_HEIGHT - 24), point.value > 0 ? 4 : 0);
          const isHovered = hoverIndex === i;
          return (
            <div
              key={point.date}
              className="flex-1 flex flex-col items-center justify-end h-full cursor-default"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="relative flex flex-col items-center justify-end flex-1 w-full">
                {isHovered && point.value > 0 && (
                  <div className="absolute -top-7 whitespace-nowrap text-xs font-semibold bg-foreground text-background px-2 py-1 rounded-lg z-10">
                    {point.value.toLocaleString("en-US")}
                    {unit}
                  </div>
                )}
                <div
                  className="rounded-t-[4px] transition-all"
                  style={{
                    width: BAR_MAX_WIDTH,
                    height: heightPx,
                    backgroundColor: color,
                    opacity: isHovered ? 1 : 0.85,
                  }}
                />
              </div>
              <span className="text-[11px] text-muted mt-2">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
