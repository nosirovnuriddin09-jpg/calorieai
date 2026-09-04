"use client";

import { Plus, Info, Trash2, Camera } from "lucide-react";
import type { Meal, MealType } from "@/types/models";

interface DailyMealsProps {
  meals: Meal[];
  onAddClick: () => void;
  onAnalyzePhotoClick?: () => void;
  onDeleteMeal?: (mealId: string) => void | Promise<void>;
  readOnly?: boolean;
  emptyLabel?: string;
}

const MEAL_TYPE_EMOJI: Record<MealType, string> = {
  breakfast: "🥣",
  lunch: "🥗",
  dinner: "🍽️",
  snack: "🍎",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function DailyMeals({
  meals,
  onAddClick,
  onAnalyzePhotoClick,
  onDeleteMeal,
  readOnly,
  emptyLabel,
}: DailyMealsProps) {
  return (
    <div className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-1.5">
          Daily meals <Info size={14} className="text-muted" />
        </h2>
        {!readOnly && (
          <div className="flex items-center gap-2">
            {onAnalyzePhotoClick && (
              <button
                onClick={onAnalyzePhotoClick}
                className="h-8 w-8 rounded-full bg-purple-bg flex items-center justify-center hover:brightness-95 transition-all"
                aria-label="Analyze food photo"
              >
                <Camera size={14} className="text-purple-accent" />
              </button>
            )}
            <button
              onClick={onAddClick}
              className="h-8 w-8 rounded-full bg-background flex items-center justify-center hover:bg-black/[0.04] transition-colors"
              aria-label="Add meal"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {meals.length === 0 && (
          <p className="text-sm text-muted py-4 text-center">{emptyLabel ?? "No meals logged yet today."}</p>
        )}
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="group flex items-center gap-3 py-2.5 px-1 border-b border-black/[0.04] last:border-none"
          >
            {meal.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={meal.image_url}
                alt={meal.name}
                className="h-10 w-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-yellow-bg flex items-center justify-center text-lg shrink-0">
                {MEAL_TYPE_EMOJI[meal.meal_type]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{meal.name}</p>
              <p className="text-xs text-muted">{formatTime(meal.consumed_at)}</p>
            </div>
            <p className="text-sm font-semibold shrink-0">{meal.calories} kcal</p>
            {!readOnly && onDeleteMeal && (
              <button
                onClick={() => onDeleteMeal(meal.id)}
                aria-label="Delete meal"
                className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-muted hover:bg-pink-bg hover:text-pink-accent transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
