"use client";

import { ReactNode } from "react";
import { useInViewFade } from "@/hooks/useInViewFade";

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

export default function FadeInSection({ children, className = "", delayMs = 0 }: FadeInSectionProps) {
  const { ref, inView } = useInViewFade<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
