"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActivityLevel, Gender } from "@/types/models";

export interface ProfileFormResult {
  error?: string;
  success?: boolean;
}

export async function updateProfileDetails(
  _prevState: ProfileFormResult,
  formData: FormData
): Promise<ProfileFormResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const age = formData.get("age") ? Number(formData.get("age")) : null;
  const gender = (String(formData.get("gender") ?? "") || null) as Gender | null;
  const heightCm = formData.get("height_cm") ? Number(formData.get("height_cm")) : null;
  const weightKg = formData.get("weight_kg") ? Number(formData.get("weight_kg")) : null;
  const activityLevel = (String(formData.get("activity_level") ?? "") || null) as ActivityLevel | null;
  const dailyCalorieGoal = formData.get("daily_calorie_goal")
    ? Number(formData.get("daily_calorie_goal"))
    : null;
  const waterGoalMl = formData.get("default_water_goal_ml")
    ? Number(formData.get("default_water_goal_ml"))
    : null;
  const stepsGoal = formData.get("default_steps_goal") ? Number(formData.get("default_steps_goal")) : null;
  const sleepGoalMinutes = formData.get("default_sleep_goal_minutes")
    ? Number(formData.get("default_sleep_goal_minutes"))
    : null;

  if (!fullName) {
    return { error: "Name can't be empty." };
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
      daily_calorie_goal: dailyCalorieGoal,
      default_water_goal_ml: waterGoalMl,
      default_steps_goal: stepsGoal,
      default_sleep_goal_minutes: sleepGoalMinutes,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
