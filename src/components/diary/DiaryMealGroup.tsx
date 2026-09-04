"use client";

import { Coffee, Sun, Moon, Cookie, Pencil, Trash2 } from "lucide-react";
import type { Meal, MealType } from "@/types/models";

interface DiaryMealGroupProps {
  mealType: MealType;
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (mealId: string) => void;
}

const MEAL_TYPE_META: Record<MealType, { label: string; icon: typeof Coffee }> = {
  breakfast: { label: "Breakfast", icon: Coffee },
  lunch: { label: "Lunch", icon: Sun },
  dinner: { label: "Dinner", icon: Moon },
  snack: { label: "Snack", icon: Cookie },
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function DiaryMealGroup({ mealType, meals, onEdit, onDelete }: DiaryMealGroupProps) {
  const meta = MEAL_TYPE_META[mealType];
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  return (
    <div className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <meta.icon size={16} className="text-muted-2" />
          {meta.label}
        </h2>
        {meals.length > 0 && <span className="text-sm text-muted">{totalCalories} kcal</span>}
      </div>

      {meals.length === 0 ? (
        <p className="text-sm text-muted py-2 text-center">No {meta.label.toLowerCase()} logged.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="group flex items-center gap-3 py-2.5 px-1 border-b border-black/[0.04] last:border-none"
            >
              {meal.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={meal.image_url} alt={meal.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-yellow-bg flex items-center justify-center shrink-0">
                  <meta.icon size={15} className="text-yellow-accent" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{meal.name}</p>
                <p className="text-xs text-muted">{formatTime(meal.consumed_at)}</p>
              </div>
              <p className="text-sm font-semibold shrink-0">{meal.calories} kcal</p>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(meal)}
                  aria-label="Edit meal"
                  className="h-7 w-7 rounded-full flex items-center justify-center text-muted hover:bg-black/[0.05] hover:text-foreground transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => onDelete(meal.id)}
                  aria-label="Delete meal"
                  className="h-7 w-7 rounded-full flex items-center justify-center text-muted hover:bg-pink-bg hover:text-pink-accent transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
