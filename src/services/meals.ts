import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { Meal } from "@/types/models";

type Client = SupabaseClient<Database>;

export async function getMealsForRange(
  supabase: Client,
  userId: string,
  startIso: string,
  endIso: string
): Promise<Meal[]> {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .gte("consumed_at", startIso)
    .lt("consumed_at", endIso)
    .order("consumed_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addMeal(
  supabase: Client,
  meal: Database["public"]["Tables"]["meals"]["Insert"]
): Promise<Meal> {
  const { data, error } = await supabase.from("meals").insert(meal).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateMeal(
  supabase: Client,
  mealId: string,
  updates: Database["public"]["Tables"]["meals"]["Update"]
): Promise<Meal> {
  const { data, error } = await supabase
    .from("meals")
    .update(updates)
    .eq("id", mealId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMeal(supabase: Client, mealId: string): Promise<void> {
  const { error } = await supabase.from("meals").delete().eq("id", mealId);
  if (error) throw error;
}
