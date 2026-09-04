import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStepLogForDate } from "@/services/steps";
import { getLocalDateString } from "@/lib/dateRange";
import AddClient from "@/components/AddClient";

const DEFAULT_STEPS_GOAL = 10000;

export default async function AddPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [stepLog, { data: profile }] = await Promise.all([
    getStepLogForDate(supabase, user.id, getLocalDateString()),
    supabase.from("profiles").select("default_steps_goal").eq("id", user.id).single(),
  ]);

  return (
    <AddClient
      userId={user.id}
      currentSteps={stepLog?.steps ?? 0}
      stepsGoal={profile?.default_steps_goal ?? DEFAULT_STEPS_GOAL}
    />
  );
}
