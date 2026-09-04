import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { SleepLog } from "@/types/models";

type Client = SupabaseClient<Database>;

// Filters by sleep_end (wake-up time), not sleep_start — a session that
// starts at 10:30pm and ends at 7am "belongs" to the day the user woke up,
// which is how people actually think about "last night's sleep".
export async function getSleepLogsForRange(
  supabase: Client,
  userId: string,
  startIso: string,
  endIso: string
): Promise<SleepLog[]> {
  const { data, error } = await supabase
    .from("sleep_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("sleep_end", startIso)
    .lt("sleep_end", endIso)
    .order("sleep_end", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addSleepLog(
  supabase: Client,
  log: Database["public"]["Tables"]["sleep_logs"]["Insert"]
): Promise<SleepLog> {
  const { data, error } = await supabase.from("sleep_logs").insert(log).select("*").single();
  if (error) throw error;
  return data;
}
