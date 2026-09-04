import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { ExerciseLog, WeightLog } from "@/types/models";
import { toDateOnly } from "@/lib/dateRange";
import { getMealsForRange } from "@/services/meals";
import { getWaterLogsForRange } from "@/services/water";
import { getExerciseLogsForRange } from "@/services/exercise";
import { getWeightHistory } from "@/services/weight";

type Client = SupabaseClient<Database>;

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  label: string; // "Mon", "Tue", ...
  value: number;
}

export interface WeightPoint {
  date: string;
  weightKg: number;
}

export interface AnalyticsData {
  weeklyCalories: DailyPoint[];
  weeklyWater: DailyPoint[];
  weightHistory: WeightPoint[];
  exerciseHistory: ExerciseLog[];
  nutritionAverages: {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFat: number;
  };
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function lastNDates(n: number, now: Date = new Date()): Date[] {
  const dates: Date[] = [];
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(start);
    d.setDate(d.getDate() - i);
    dates.push(d);
  }
  return dates;
}

export async function getAnalyticsData(supabase: Client, userId: string): Promise<AnalyticsData> {
  const days = lastNDates(7);
  const startIso = new Date(days[0]).toISOString();
  const endExclusive = new Date(days[days.length - 1]);
  endExclusive.setDate(endExclusive.getDate() + 1);
  const endIso = endExclusive.toISOString();

  const [meals, waterLogs, exerciseLogs, weightLogs] = await Promise.all([
    getMealsForRange(supabase, userId, startIso, endIso),
    getWaterLogsForRange(supabase, userId, startIso, endIso),
    getExerciseLogsForRange(supabase, userId, startIso, endIso),
    getWeightHistory(supabase, userId, 30),
  ]);

  const caloriesByDate = new Map<string, number>();
  const proteinByDate = new Map<string, number>();
  const carbsByDate = new Map<string, number>();
  const fatByDate = new Map<string, number>();
  for (const meal of meals) {
    const key = toDateOnly(new Date(meal.consumed_at));
    caloriesByDate.set(key, (caloriesByDate.get(key) ?? 0) + meal.calories);
    proteinByDate.set(key, (proteinByDate.get(key) ?? 0) + (meal.protein ?? 0));
    carbsByDate.set(key, (carbsByDate.get(key) ?? 0) + (meal.carbs ?? 0));
    fatByDate.set(key, (fatByDate.get(key) ?? 0) + (meal.fat ?? 0));
  }

  const waterByDate = new Map<string, number>();
  for (const log of waterLogs) {
    const key = toDateOnly(new Date(log.logged_at));
    waterByDate.set(key, (waterByDate.get(key) ?? 0) + log.amount_ml);
  }

  const weeklyCalories: DailyPoint[] = days.map((d) => {
    const key = toDateOnly(d);
    return { date: key, label: WEEKDAY_LABELS[d.getDay()], value: Math.round(caloriesByDate.get(key) ?? 0) };
  });

  const weeklyWater: DailyPoint[] = days.map((d) => {
    const key = toDateOnly(d);
    return { date: key, label: WEEKDAY_LABELS[d.getDay()], value: waterByDate.get(key) ?? 0 };
  });

  const daysWithMeals = new Set(meals.map((m) => toDateOnly(new Date(m.consumed_at))));
  const loggedDayCount = Math.max(daysWithMeals.size, 1);
  const totalCalories = Array.from(caloriesByDate.values()).reduce((a, b) => a + b, 0);
  const totalProtein = Array.from(proteinByDate.values()).reduce((a, b) => a + b, 0);
  const totalCarbs = Array.from(carbsByDate.values()).reduce((a, b) => a + b, 0);
  const totalFat = Array.from(fatByDate.values()).reduce((a, b) => a + b, 0);

  const weightHistory: WeightPoint[] = weightLogs
    .slice()
    .reverse()
    .map((w) => ({ date: toDateOnly(new Date(w.logged_at)), weightKg: w.weight_kg }));

  return {
    weeklyCalories,
    weeklyWater,
    weightHistory,
    exerciseHistory: exerciseLogs,
    nutritionAverages: {
      avgCalories: Math.round(totalCalories / loggedDayCount),
      avgProtein: Math.round(totalProtein / loggedDayCount),
      avgCarbs: Math.round(totalCarbs / loggedDayCount),
      avgFat: Math.round(totalFat / loggedDayCount),
    },
  };
}
