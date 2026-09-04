"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActivityLevel, Gender, GoalType } from "@/types/models";

export interface OnboardingResult {
  error?: string;
}

export async function completeOnboarding(
  _prevState: OnboardingResult,
  formData: FormData
): Promise<OnboardingResult> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const age = Number(formData.get("age"));
  const gender = String(formData.get("gender") ?? "") as Gender;
  const heightCm = Number(formData.get("height_cm"));
  const weightKg = Number(formData.get("weight_kg"));
  const activityLevel = String(formData.get("activity_level") ?? "") as ActivityLevel;
  const goalType = String(formData.get("goal_type") ?? "") as GoalType;
  const dailyCalorieGoal = Number(formData.get("daily_calorie_goal"));

  if (!fullName || !age || !gender || !heightCm || !weightKg || !activityLevel || !goalType) {
    return { error: "Please complete every step before continuing." };
  }
  if (!Number.isFinite(dailyCalorieGoal) || dailyCalorieGoal < 800) {
    return { error: "Calorie goal looks too low — please double-check it." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      age,
      gender,
      height_cm: heightCm,
      weight_kg: weightKg,
      activity_level: activityLevel,
      goal_type: goalType,
      daily_calorie_goal: Math.round(dailyCalorieGoal),
      default_water_goal_ml: 2500,
      default_steps_goal: 10000,
      default_sleep_goal_minutes: 480,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
