"use client";

import { Flame } from "lucide-react";
import CalorieRing from "@/components/CalorieRing";
import FadeInSection from "./FadeInSection";
import { useInViewFade } from "@/hooks/useInViewFade";

export default function CalorieShowcase() {
  const { ref, inView } = useInViewFade<HTMLDivElement>(0.3);
  const progress = inView ? 0.59 : 0;

  const stats = [
    { label: "Goal", value: "2,000" },
    { label: "Food", value: "1,180" },
    { label: "Exercise", value: "+260" },
    { label: "Remaining", value: "1,080" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <FadeInSection className="text-center max-w-lg mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Progress you can actually see.</h2>
        <p className="text-base text-muted-2 mt-4">
          One glance tells you exactly where your day stands.
        </p>
      </FadeInSection>

      <div ref={ref} className="flex flex-col items-center mt-10">
        <div className="relative">
          <CalorieRing progress={progress} size={260} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Flame size={22} className="text-yellow-accent mb-1" />
            <span className="text-4xl font-bold tracking-tight">1,080</span>
            <span className="text-sm text-muted mt-1">Remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 sm:gap-10 mt-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xs text-muted">{stat.label}</p>
              <p className="text-lg sm:text-xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
