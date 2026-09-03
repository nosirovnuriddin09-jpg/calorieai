export type TimeRange = "today" | "weekly" | "monthly";

export interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
  emoji: string;
}

export interface CalorieState {
  goal: number;
  food: number;
  exercise: number;
}

export interface DailyStats {
  steps: number;
  stepsGoal: number;
  sleepHours: number;
  sleepMinutes: number;
  sleepGoalPercent: number;
  waterMl: number;
  waterGoalMl: number;
  activityMinutes: number;
  activityGoal: number;
  activityCaloriesBurned: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}
