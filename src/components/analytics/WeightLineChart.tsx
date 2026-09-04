"use client";

import { useState } from "react";
import type { WeightPoint } from "@/lib/analyticsData";

interface WeightLineChartProps {
  data: WeightPoint[];
  color: string;
}

const WIDTH = 600;
const HEIGHT = 160;
const PADDING = 20;

export default function WeightLineChart({ data, color }: WeightLineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted">
        No weight entries yet.
      </div>
    );
  }

  const weights = data.map((d) => d.weightKg);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = data.length === 1 ? WIDTH / 2 : PADDING + (i / (data.length - 1)) * (WIDTH - PADDING * 2);
    const y = HEIGHT - PADDING - ((d.weightKg - min) / range) * (HEIGHT - PADDING * 2);
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-40" preserveAspectRatio="none">
        <line
          x1={0}
          y1={HEIGHT - PADDING}
          x2={WIDTH}
          y2={HEIGHT - PADDING}
          stroke="#e1e0d9"
          strokeWidth={1}
        />
        <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={p.date}>
            <circle cx={p.x} cy={p.y} r={hoverIndex === i ? 6 : 4} fill={color} stroke="#fff" strokeWidth={2} />
            <rect
              x={p.x - 15}
              y={0}
              width={30}
              height={HEIGHT}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          </g>
        ))}
      </svg>
      {hoverIndex !== null && (
        <div
          className="absolute -top-2 -translate-x-1/2 -translate-y-full whitespace-nowrap text-xs font-semibold bg-foreground text-background px-2 py-1 rounded-lg pointer-events-none"
          style={{ left: `${(points[hoverIndex].x / WIDTH) * 100}%` }}
        >
          {points[hoverIndex].weightKg} kg
        </div>
      )}
    </div>
  );
}
