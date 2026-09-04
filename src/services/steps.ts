import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { StepLog } from "@/types/models";

type Client = SupabaseClient<Database>;

export async function getStepLogForDate(
  supabase: Client,
  userId: string,
  date: string
): Promise<StepLog | null> {
  const { data, error } = await supabase
    .from("step_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("logged_date", date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getStepLogsForDateRange(
  supabase: Client,
  userId: string,
  startDate: string,
  endDate: string
): Promise<StepLog[]> {
  const { data, error } = await supabase
    .from("step_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("logged_date", startDate)
    .lte("logged_date", endDate)
    .order("logged_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertStepLog(
  supabase: Client,
  userId: string,
  date: string,
  steps: number
): Promise<StepLog> {
  const { data, error } = await supabase
    .from("step_logs")
    .upsert({ user_id: userId, logged_date: date, steps }, { onConflict: "user_id,logged_date" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
