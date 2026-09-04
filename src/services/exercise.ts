import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { ExerciseLog } from "@/types/models";

type Client = SupabaseClient<Database>;

export async function getExerciseLogsForRange(
  supabase: Client,
  userId: string,
  startIso: string,
  endIso: string
): Promise<ExerciseLog[]> {
  const { data, error } = await supabase
    .from("exercise_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("performed_at", startIso)
    .lt("performed_at", endIso)
    .order("performed_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addExerciseLog(
  supabase: Client,
  log: Database["public"]["Tables"]["exercise_logs"]["Insert"]
): Promise<ExerciseLog> {
  const { data, error } = await supabase.from("exercise_logs").insert(log).select("*").single();
  if (error) throw error;
  return data;
}
