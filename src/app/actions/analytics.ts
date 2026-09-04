"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
}

export async function addWeightLogAction(weightKg: number): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return { error: "Please enter a valid weight." };
  }

  const { error } = await supabase.from("weight_logs").insert({
    user_id: user.id,
    weight_kg: weightKg,
  });

  if (error) return { error: error.message };
  return {};
}
