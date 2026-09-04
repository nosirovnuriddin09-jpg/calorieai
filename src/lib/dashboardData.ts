import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { Meal, Profile, TimeRange } from "@/types/models";
import { getDateRange } from "@/lib/dateRange";
import { getMealsForRange } from "@/services/meals";
import { getWaterLogsForRange } from "@/services/water";
import { getExerciseLogsForRange } from "@/services/exercise";
import { getSleepLogsForRange } from "@/services/sleep";
import { getStepLogsForDateRange } from "@/services/steps";

type Client = SupabaseClient<Database>;

export interface DashboardData {
  range: TimeRange;
  days: number;
  meals: Meal[];
  calories: {
    goal: number;
    food: number;
    exercise: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  steps: {
    total: number;
    goal: number;
  };
  sleep: {
    totalMinutes: number;
    goalMinutes: number;
    nightsLogged: number;
  };
  water: {
    totalMl: number;
    goalMl: number;
  };
  activity: {
    totalMinutes: number;
    goalMinutes: number;
    caloriesBurned: number;
  };
}

const DEFAULT_CALORIE_GOAL = 2000;
const DEFAULT_WATER_GOAL_ML = 2500;
const DEFAULT_STEPS_GOAL = 10000;
const DEFAULT_SLEEP_GOAL_MINUTES = 480;
const DEFAULT_ACTIVITY_GOAL_MINUTES = 60;

export async function getDashboardData(
  supabase: Client,
  userId: string,
  profile: Profile | null,
  range: TimeRange
): Promise<DashboardData> {
  const { startIso, endIso, startDate, endDate, days } = getDateRange(range);

  const [meals, waterLogs, exerciseLogs, sleepLogs, stepLogs] = await Promise.all([
    getMealsForRange(supabase, userId, startIso, endIso),
    getWaterLogsForRange(supabase, userId, startIso, endIso),
    getExerciseLogsForRange(supabase, userId, startIso, endIso),
    getSleepLogsForRange(supabase, userId, startIso, endIso),
    getStepLogsForDateRange(supabase, userId, startDate, endDate),
  ]);

  const calorieGoalPerDay = profile?.daily_calorie_goal ?? DEFAULT_CALORIE_GOAL;
  const waterGoalPerDay = profile?.default_water_goal_ml ?? DEFAULT_WATER_GOAL_ML;
  const stepsGoalPerDay = profile?.default_steps_goal ?? DEFAULT_STEPS_GOAL;
  const sleepGoalPerDay = profile?.default_sleep_goal_minutes ?? DEFAULT_SLEEP_GOAL_MINUTES;

  const foodCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const protein = meals.reduce((sum, m) => sum + (m.protein ?? 0), 0);
  const carbs = meals.reduce((sum, m) => sum + (m.carbs ?? 0), 0);
  const fat = meals.reduce((sum, m) => sum + (m.fat ?? 0), 0);

  const exerciseCalories = exerciseLogs.reduce((sum, e) => sum + e.calories_burned, 0);
  const exerciseMinutes = exerciseLogs.reduce((sum, e) => sum + e.duration_minutes, 0);

  const totalWaterMl = waterLogs.reduce((sum, w) => sum + w.amount_ml, 0);
  const totalSteps = stepLogs.reduce((sum, s) => sum + s.steps, 0);
  const totalSleepMinutes = sleepLogs.reduce((sum, s) => sum + s.sleep_duration_minutes, 0);

  return {
    range,
    days,
    meals,
    calories: {
      goal: calorieGoalPerDay * days,
      food: foodCalories,
      exercise: exerciseCalories,
      protein,
      carbs,
      fat,
    },
    steps: {
      total: totalSteps,
      goal: stepsGoalPerDay * days,
    },
    sleep: {
      totalMinutes: totalSleepMinutes,
      goalMinutes: sleepGoalPerDay * days,
      nightsLogged: sleepLogs.length,
    },
    water: {
      totalMl: totalWaterMl,
      goalMl: waterGoalPerDay * days,
    },
    activity: {
      totalMinutes: exerciseMinutes,
      goalMinutes: DEFAULT_ACTIVITY_GOAL_MINUTES * days,
      caloriesBurned: exerciseCalories,
    },
  };
}
