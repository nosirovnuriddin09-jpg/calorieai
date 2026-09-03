"use client";

interface CalorieRingProps {
  progress: number; // 0-1
  size?: number;
}

const SEGMENTS = 36;
const ARC_DEGREES = 270;
const START_ANGLE = 135;

export default function CalorieRing({ progress, size = 220 }: CalorieRingProps) {
  const activeSegments = Math.round(SEGMENTS * Math.min(Math.max(progress, 0), 1));
  const radius = size / 2;
  const segAngle = ARC_DEGREES / SEGMENTS;
  const gap = 2.2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-0">
      {Array.from({ length: SEGMENTS }).map((_, i) => {
        const angle = START_ANGLE + i * segAngle;
        const isActive = i < activeSegments;
        const r1 = radius - 14;
        const r2 = radius - 4;
        const a1 = ((angle + gap / 2) * Math.PI) / 180;
        const a2 = ((angle + segAngle - gap / 2) * Math.PI) / 180;

        const x1 = radius + r1 * Math.cos(a1);
        const y1 = radius + r1 * Math.sin(a1);
        const x2 = radius + r2 * Math.cos(a1);
        const y2 = radius + r2 * Math.sin(a1);
        const x3 = radius + r2 * Math.cos(a2);
        const y3 = radius + r2 * Math.sin(a2);
        const x4 = radius + r1 * Math.cos(a2);
        const y4 = radius + r1 * Math.sin(a2);

        const path = `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1} Z`;

        let fill = "#eceae4";
        if (isActive) {
          const t = i / SEGMENTS;
          if (t < 0.34) fill = "#f5a623";
          else if (t < 0.67) fill = "#e8894f";
          else fill = "#8b6ee8";
        }

        return <path key={i} d={path} fill={fill} />;
      })}
    </svg>
  );
}
