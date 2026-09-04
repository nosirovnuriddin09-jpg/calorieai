"use server";

import { createClient } from "@/lib/supabase/server";
import type { MealType } from "@/types/models";

export interface ActionResult {
  error?: string;
}

async function requireUserId(): Promise<{ userId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };
  return { userId: user.id };
}

export async function addMealAction(input: {
  name: string;
  mealType: MealType;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  consumedAt?: string;
  imageUrl?: string;
}): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  if (!input.name.trim() || !Number.isFinite(input.calories) || input.calories < 0) {
    return { error: "Please provide a meal name and a valid calorie amount." };
  }

  const consumedAt = input.consumedAt ? new Date(input.consumedAt) : new Date();
  if (Number.isNaN(consumedAt.getTime())) {
    return { error: "Invalid date/time." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("meals").insert({
    user_id: auth.userId,
    name: input.name.trim(),
    meal_type: input.mealType,
    calories: input.calories,
    protein: input.protein ?? null,
    carbs: input.carbs ?? null,
    fat: input.fat ?? null,
    fiber: input.fiber ?? null,
    consumed_at: consumedAt.toISOString(),
    image_url: input.imageUrl ?? null,
  });

  if (error) return { error: error.message };
  return {};
}

export async function updateMealAction(
  mealId: string,
  input: {
    name: string;
    mealType: MealType;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    consumedAt?: string;
  }
): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  if (!input.name.trim() || !Number.isFinite(input.calories) || input.calories < 0) {
    return { error: "Please provide a meal name and a valid calorie amount." };
  }

  const consumedAt = input.consumedAt ? new Date(input.consumedAt) : undefined;
  if (input.consumedAt && Number.isNaN(consumedAt!.getTime())) {
    return { error: "Invalid date/time." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("meals")
    .update({
      name: input.name.trim(),
      meal_type: input.mealType,
      calories: input.calories,
      protein: input.protein ?? null,
      carbs: input.carbs ?? null,
      fat: input.fat ?? null,
      fiber: input.fiber ?? null,
      ...(consumedAt ? { consumed_at: consumedAt.toISOString() } : {}),
    })
    .eq("id", mealId)
    .eq("user_id", auth.userId);

  if (error) return { error: error.message };
  return {};
}

export async function deleteMealAction(mealId: string): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const supabase = await createClient();
  const { error } = await supabase.from("meals").delete().eq("id", mealId).eq("user_id", auth.userId);

  if (error) return { error: error.message };
  return {};
}

export async function addWaterAction(amountMl: number): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  if (!Number.isFinite(amountMl) || amountMl === 0) {
    return { error: "Invalid water amount." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("water_logs").insert({
    user_id: auth.userId,
    amount_ml: amountMl,
  });

  if (error) return { error: error.message };
  return {};
}

export async function addExerciseAction(input: {
  exerciseName: string;
  durationMinutes: number;
  caloriesBurned: number;
  notes?: string;
  performedAt?: string;
}): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  if (!input.exerciseName.trim() || input.durationMinutes < 0 || input.caloriesBurned < 0) {
    return { error: "Please provide a valid exercise name, duration, and calories." };
  }

  const performedAt = input.performedAt ? new Date(input.performedAt) : new Date();
  if (Number.isNaN(performedAt.getTime())) {
    return { error: "Invalid date/time." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("exercise_logs").insert({
    user_id: auth.userId,
    exercise_name: input.exerciseName.trim(),
    duration_minutes: input.durationMinutes,
    calories_burned: input.caloriesBurned,
    notes: input.notes?.trim() || null,
    performed_at: performedAt.toISOString(),
  });

  if (error) return { error: error.message };
  return {};
}

export async function deleteExerciseAction(logId: string): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const supabase = await createClient();
  const { error } = await supabase
    .from("exercise_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", auth.userId);

  if (error) return { error: error.message };
  return {};
}

export async function upsertStepsAction(steps: number, date: string): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  if (!Number.isFinite(steps) || steps < 0) {
    return { error: "Invalid step count." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("step_logs")
    .upsert(
      { user_id: auth.userId, logged_date: date, steps },
      { onConflict: "user_id,logged_date" }
    );

  if (error) return { error: error.message };
  return {};
}

export async function addSleepAction(input: {
  sleepStart: string;
  sleepEnd: string;
  sleepQuality?: number;
}): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const start = new Date(input.sleepStart);
  const end = new Date(input.sleepEnd);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return { error: "Sleep end time must be after the start time." };
  }

  const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);

  const supabase = await createClient();
  const { error } = await supabase.from("sleep_logs").insert({
    user_id: auth.userId,
    sleep_start: start.toISOString(),
    sleep_end: end.toISOString(),
    sleep_duration_minutes: durationMinutes,
    sleep_quality: input.sleepQuality ?? null,
  });

  if (error) return { error: error.message };
  return {};
}
