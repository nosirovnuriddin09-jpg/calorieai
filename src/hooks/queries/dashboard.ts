import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getDateRange } from "@/lib/dateRange";
import { getMealsForRange } from "@/services/meals";
import { getWaterLogsForRange } from "@/services/water";
import { getExerciseLogsForRange } from "@/services/exercise";
import { getSleepLogsForRange } from "@/services/sleep";
import { getStepLogsForDateRange } from "@/services/steps";
import { queryKeys } from "@/lib/queryKeys";
import type { DashboardData } from "@/lib/dashboardData";
import type { Profile, TimeRange } from "@/types/models";

const DEFAULT_CALORIE_GOAL = 2000;
const DEFAULT_WATER_GOAL_ML = 2500;
const DEFAULT_STEPS_GOAL = 10000;
const DEFAULT_SLEEP_GOAL_MINUTES = 480;
const DEFAULT_ACTIVITY_GOAL_MINUTES = 60;

/**
 * "today" changes every time the user logs something, so it's kept fairly
 * fresh. "weekly"/"monthly" mostly cover days that are already over and
 * don't change once logged, so they can be cached longer — switching
 * between ranges and back shouldn't force a refetch of data that hasn't
 * changed.
 */
const STALE_TIME_BY_RANGE: Record<TimeRange, number> = {
  today: 15_000,
  weekly: 60_000,
  monthly: 5 * 60_000,
};

/**
 * Composed from 5 independently-cached queries (meals/water/exercise/
 * sleep/steps), each keyed by domain + range, rather than one combined
 * fetch. This is what makes targeted invalidation possible: adding a
 * meal invalidates only queryKeys.mealsByRange(...) and leaves the
 * water/exercise/sleep/steps queries (and their cached data) untouched.
 * It's also what lets the Dashboard and Diary share the same cached
 * "today" meals instead of fetching them twice.
 */
export function useDashboardData(userId: string, profile: Profile | null, range: TimeRange) {
  const { startIso, endIso, startDate, endDate, days } = useMemo(() => getDateRange(range), [range]);
  const staleTime = STALE_TIME_BY_RANGE[range];
  const enabled = Boolean(userId);

  const results = useQueries({
    queries: [
      {
        queryKey: queryKeys.mealsByRange(userId, range),
        queryFn: () => getMealsForRange(createClient(), userId, startIso, endIso),
        staleTime,
        enabled,
      },
      {
        queryKey: queryKeys.waterByRange(userId, range),
        queryFn: () => getWaterLogsForRange(createClient(), userId, startIso, endIso),
        staleTime,
        enabled,
      },
      {
        queryKey: queryKeys.exerciseByRange(userId, range),
        queryFn: () => getExerciseLogsForRange(createClient(), userId, startIso, endIso),
        staleTime,
        enabled,
      },
      {
        queryKey: queryKeys.sleepByRange(userId, range),
        queryFn: () => getSleepLogsForRange(createClient(), userId, startIso, endIso),
        staleTime,
        enabled,
      },
      {
        queryKey: queryKeys.stepsByRange(userId, range),
        queryFn: () => getStepLogsForDateRange(createClient(), userId, startDate, endDate),
        staleTime,
        enabled,
      },
    ],
  });

  const [mealsQuery, waterQuery, exerciseQuery, sleepQuery, stepsQuery] = results;

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);
  const error = results.find((r) => r.error)?.error ?? null;

  const data: DashboardData | null = useMemo(() => {
    if (
      !mealsQuery.data ||
      !waterQuery.data ||
      !exerciseQuery.data ||
      !sleepQuery.data ||
      !stepsQuery.data
    ) {
      return null;
    }

    const meals = mealsQuery.data;
    const waterLogs = waterQuery.data;
    const exerciseLogs = exerciseQuery.data;
    const sleepLogs = sleepQuery.data;
    const stepLogs = stepsQuery.data;

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
  }, [mealsQuery.data, waterQuery.data, exerciseQuery.data, sleepQuery.data, stepsQuery.data, profile, range, days]);

  return {
    data,
    loading: isLoading && !data,
    error: isError ? (error instanceof Error ? error.message : "Failed to load dashboard data.") : null,
  };
}
