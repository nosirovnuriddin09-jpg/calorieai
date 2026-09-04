import type { Database, ActivityLevel, Gender, GoalType, MealType } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Meal = Database["public"]["Tables"]["meals"]["Row"];
export type WaterLog = Database["public"]["Tables"]["water_logs"]["Row"];
export type ExerciseLog = Database["public"]["Tables"]["exercise_logs"]["Row"];
export type SleepLog = Database["public"]["Tables"]["sleep_logs"]["Row"];
export type StepLog = Database["public"]["Tables"]["step_logs"]["Row"];
export type DailyGoal = Database["public"]["Tables"]["daily_goals"]["Row"];
export type WeightLog = Database["public"]["Tables"]["weight_logs"]["Row"];

export type { ActivityLevel, Gender, GoalType, MealType };

export type TimeRange = "today" | "weekly" | "monthly";

export interface FoodAnalysis {
  food_name: string;
  description: string;
  estimated_portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: "low" | "medium" | "high";
}
