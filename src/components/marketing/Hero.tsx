"use client";

import Link from "next/link";
import { Flame, Droplets } from "lucide-react";
import CalorieRing from "@/components/CalorieRing";
import { useInViewFade } from "@/hooks/useInViewFade";

export default function Hero() {
  const { ref, inView } = useInViewFade<HTMLDivElement>(0.1);
  const progress = inView ? 0.62 : 0;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-8 items-center">
        {/* Left: copy */}
        <div className="max-w-lg">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
            Know what fuels you.
          </h1>
          <p className="text-base text-muted-2 mt-5 leading-relaxed">
            Track meals, movement, sleep and hydration in one calm place — without
            turning your day into a spreadsheet.
          </p>
          <div className="flex items-center flex-wrap gap-3 mt-8">
            <Link
              href="/signup"
              className="h-12 px-6 rounded-full bg-cta text-background text-sm font-medium flex items-center hover:opacity-90 transition-opacity"
            >
              Start tracking free
            </Link>
            <Link
              href="/login"
              className="h-12 px-6 rounded-full text-sm font-medium text-foreground flex items-center hover:bg-black/[0.04] transition-colors"
            >
              I already have an account
            </Link>
          </div>
        </div>

        {/* Right: layered product composition */}
        <div ref={ref} className="relative h-[420px] sm:h-[460px]">
          {/* Main calorie card */}
          <div className="absolute right-0 top-0 w-[280px] sm:w-[300px] bg-surface rounded-[28px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/[0.03]">
            <p className="text-sm font-semibold mb-2">Calories</p>
            <div className="flex flex-col items-center py-1">
              <div className="relative">
                <CalorieRing progress={progress} size={180} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Flame size={16} className="text-yellow-accent mb-1" />
                  <span className="text-2xl font-bold tracking-tight">760</span>
                  <span className="text-[11px] text-muted mt-0.5">Remaining</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating meal card */}
          <div
            className={`absolute left-0 top-10 sm:top-16 w-56 bg-surface rounded-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.08)] border border-black/[0.03] flex items-center gap-3 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="h-10 w-10 rounded-full bg-yellow-bg flex items-center justify-center text-lg shrink-0">
              🥗
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">Chicken bowl</p>
              <p className="text-xs text-muted">12:40 PM</p>
            </div>
            <p className="text-sm font-semibold shrink-0 ml-auto">410 kcal</p>
          </div>

          {/* Floating water card */}
          <div
            className={`absolute left-4 sm:left-10 bottom-4 w-40 bg-blue-bg rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="h-8 w-8 rounded-full bg-white/60 flex items-center justify-center mb-2">
              <Droplets size={15} className="text-blue-accent" />
            </div>
            <p className="text-[11px] text-muted-2">Water</p>
            <p className="text-base font-bold">1.4L</p>
          </div>
        </div>
      </div>
    </section>
  );
}
