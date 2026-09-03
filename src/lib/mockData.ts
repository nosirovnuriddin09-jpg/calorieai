import { CalorieState, DailyStats, Meal, TimeRange } from "./types";

export const initialMeals: Meal[] = [
  { id: "m1", name: "Oatmeal & Berries", calories: 320, time: "8:15 AM", emoji: "🥣" },
  { id: "m2", name: "Grilled Chicken Salad", calories: 410, time: "12:40 PM", emoji: "🥗" },
  { id: "m3", name: "Almonds", calories: 90, time: "3:10 PM", emoji: "🥜" },
];

export const initialCalories: CalorieState = {
  goal: 2000,
  food: 820,
  exercise: 430,
};

export const initialStats: DailyStats = {
  steps: 2717,
  stepsGoal: 10000,
  sleepHours: 8,
  sleepMinutes: 40,
  sleepGoalPercent: 50,
  waterMl: 1200,
  waterGoalMl: 2500,
  activityMinutes: 35,
  activityGoal: 60,
  activityCaloriesBurned: 260,
};

export const rangeMultiplier: Record<TimeRange, number> = {
  today: 1,
  weekly: 6.4,
  monthly: 28,
};
