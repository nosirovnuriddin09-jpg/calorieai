"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export default function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            className="p-1 -m-1"
          >
            <Star
              size={26}
              className={filled ? "text-purple-accent fill-purple-accent" : "text-black/15"}
            />
          </button>
        );
      })}
    </div>
  );
}
