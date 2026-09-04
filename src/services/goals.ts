import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { DailyGoal } from "@/types/models";

type Client = SupabaseClient<Database>;

export async function getDailyGoal(
  supabase: Client,
  userId: string,
  date: string
): Promise<DailyGoal | null> {
  const { data, error } = await supabase
    .from("daily_goals")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertDailyGoal(
  supabase: Client,
  userId: string,
  date: string,
  goals: Omit<Database["public"]["Tables"]["daily_goals"]["Insert"], "user_id" | "date">
): Promise<DailyGoal> {
  const { data, error } = await supabase
    .from("daily_goals")
    .upsert({ user_id: userId, date, ...goals }, { onConflict: "user_id,date" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
