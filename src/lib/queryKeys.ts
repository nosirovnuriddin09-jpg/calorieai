import type { TimeRange } from "@/types/models";

/**
 * Centralized query-key factory. Every key starts with the user id so
 * cached data for one user can never leak into another user's session —
 * see queryClient.clear() on sign-out in QueryProvider.
 */
export const queryKeys = {
  all: (userId: string) => ["user", userId] as const,

  profile: (userId: string) => ["user", userId, "profile"] as const,

  meals: (userId: string) => ["user", userId, "meals"] as const,
  mealsByRange: (userId: string, range: TimeRange) =>
    ["user", userId, "meals", "range", range] as const,
  mealsByDate: (userId: string, date: string) =>
    ["user", userId, "meals", "date", date] as const,

  water: (userId: string) => ["user", userId, "water"] as const,
  waterByRange: (userId: string, range: TimeRange) =>
    ["user", userId, "water", "range", range] as const,

  exercise: (userId: string) => ["user", userId, "exercise"] as const,
  exerciseByRange: (userId: string, range: TimeRange) =>
    ["user", userId, "exercise", "range", range] as const,

  sleep: (userId: string) => ["user", userId, "sleep"] as const,
  sleepByRange: (userId: string, range: TimeRange) =>
    ["user", userId, "sleep", "range", range] as const,

  steps: (userId: string) => ["user", userId, "steps"] as const,
  stepsByRange: (userId: string, range: TimeRange) =>
    ["user", userId, "steps", "range", range] as const,

  weight: (userId: string) => ["user", userId, "weight"] as const,
  weightHistory: (userId: string, limit: number) =>
    ["user", userId, "weight", "history", limit] as const,

  dashboard: (userId: string, range: TimeRange) =>
    ["user", userId, "dashboard", range] as const,

  analytics: (userId: string) => ["user", userId, "analytics"] as const,
  analyticsWeekly: (userId: string) => ["user", userId, "analytics", "weekly"] as const,
} as const;
