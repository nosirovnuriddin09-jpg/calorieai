import type { ActivityLevel, Gender, GoalType } from "@/types/models";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

const GOAL_ADJUSTMENTS: Record<GoalType, number> = {
  lose_weight: -500,
  maintain_weight: 0,
  gain_weight: 500,
};

export interface CalorieGoalInput {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goalType: GoalType;
}

/** Mifflin-St Jeor equation, rounded to the nearest 10 calories. */
export function calculateSuggestedCalorieGoal({
  age,
  gender,
  heightCm,
  weightKg,
  activityLevel,
  goalType,
}: CalorieGoalInput): number {
  // Mifflin-St Jeor's sex constant is +5 (male) or -161 (female); for
  // gender values outside that binary we average the two as a neutral estimate.
  const sexConstant = gender === "male" ? 5 : gender === "female" ? -161 : -78;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + sexConstant;

  const maintenance = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const target = maintenance + GOAL_ADJUSTMENTS[goalType];

  const MIN_SAFE_CALORIES = 1200;
  return Math.max(MIN_SAFE_CALORIES, Math.round(target / 10) * 10);
}
