import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { WeightLog } from "@/types/models";

type Client = SupabaseClient<Database>;

export async function getWeightHistory(
  supabase: Client,
  userId: string,
  limit = 30
): Promise<WeightLog[]> {
  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function addWeightLog(supabase: Client, userId: string, weightKg: number): Promise<WeightLog> {
  const { data, error } = await supabase
    .from("weight_logs")
    .insert({ user_id: userId, weight_kg: weightKg })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
