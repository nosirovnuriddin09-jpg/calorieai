import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { Meal, MealType } from "@/types/models";
import { getMealsForRange } from "@/services/meals";

type Client = SupabaseClient<Database>;

export const MEAL_TYPE_ORDER: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export interface DiaryDay {
  date: string; // YYYY-MM-DD
  meals: Meal[];
  totalCalories: number;
  groups: Record<MealType, Meal[]>;
}

/** date is YYYY-MM-DD in the caller's local timezone. */
export async function getDiaryDay(supabase: Client, userId: string, date: string): Promise<DiaryDay> {
  const [year, month, day] = date.split("-").map(Number);
  const startOfDay = new Date(year, month - 1, day);
  const endOfDay = new Date(year, month - 1, day + 1);

  const meals = await getMealsForRange(supabase, userId, startOfDay.toISOString(), endOfDay.toISOString());

  const groups: Record<MealType, Meal[]> = { breakfast: [], lunch: [], dinner: [], snack: [] };
  for (const meal of meals) {
    groups[meal.meal_type].push(meal);
  }

  return {
    date,
    meals,
    totalCalories: meals.reduce((sum, m) => sum + m.calories, 0),
    groups,
  };
}
