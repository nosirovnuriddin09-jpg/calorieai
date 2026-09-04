import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { WaterLog } from "@/types/models";

type Client = SupabaseClient<Database>;

export async function getWaterLogsForRange(
  supabase: Client,
  userId: string,
  startIso: string,
  endIso: string
): Promise<WaterLog[]> {
  const { data, error } = await supabase
    .from("water_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("logged_at", startIso)
    .lt("logged_at", endIso)
    .order("logged_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addWaterLog(supabase: Client, userId: string, amountMl: number): Promise<WaterLog> {
  const { data, error } = await supabase
    .from("water_logs")
    .insert({ user_id: userId, amount_ml: amountMl })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
