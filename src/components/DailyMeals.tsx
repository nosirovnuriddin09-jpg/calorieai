"use client";

import { useState } from "react";
import { Plus, Info } from "lucide-react";
import { Meal } from "@/lib/types";

interface DailyMealsProps {
  meals: Meal[];
  onAddMeal: (meal: Omit<Meal, "id">) => void;
}

export default function DailyMeals({ meals, onAddMeal }: DailyMealsProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [cals, setCals] = useState("");

  const submit = () => {
    const n = parseInt(cals, 10);
    if (name.trim() && !Number.isNaN(n) && n > 0) {
      onAddMeal({
        name: name.trim(),
        calories: n,
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        emoji: "🍽️",
      });
      setName("");
      setCals("");
      setShowForm(false);
    }
  };

  return (
    <div className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-1.5">
          Daily meals <Info size={14} className="text-muted" />
        </h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="h-8 w-8 rounded-full bg-background flex items-center justify-center hover:bg-black/[0.04] transition-colors"
          aria-label="Add meal"
        >
          <Plus size={16} />
        </button>
      </div>

      {showForm && (
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Meal name"
            className="flex-1 h-10 rounded-full bg-background border border-black/[0.06] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-accent/40"
          />
          <input
            value={cals}
            onChange={(e) => setCals(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            type="number"
            placeholder="Calories"
            className="w-full sm:w-32 h-10 rounded-full bg-background border border-black/[0.06] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-accent/40"
          />
          <button onClick={submit} className="h-10 px-4 rounded-full bg-foreground text-background text-sm font-medium">
            Add
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1">
        {meals.length === 0 && (
          <p className="text-sm text-muted py-4 text-center">No meals logged yet today.</p>
        )}
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="flex items-center gap-3 py-2.5 px-1 border-b border-black/[0.04] last:border-none"
          >
            <div className="h-10 w-10 rounded-full bg-yellow-bg flex items-center justify-center text-lg shrink-0">
              {meal.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{meal.name}</p>
              <p className="text-xs text-muted">{meal.time}</p>
            </div>
            <p className="text-sm font-semibold shrink-0">{meal.calories} kcal</p>
          </div>
        ))}
      </div>
    </div>
  );
}
