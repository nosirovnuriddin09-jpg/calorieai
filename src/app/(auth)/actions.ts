"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export interface AuthResult {
  error?: string;
  message?: string;
}

// Server Action redirects apply their RSC payload client-side without a
// fresh top-level request, so proxy.ts's onboarding check never re-runs for
// the destination — this must be decided here, before redirecting.
async function getPostAuthDestination(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<"/dashboard" | "/onboarding"> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .single();

  return profile?.onboarding_completed ? "/dashboard" : "/onboarding";
}

export async function signUp(_prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Please fill in your name, email, and password." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Email confirmation is on for this project — no active session yet.
  if (data.user && !data.session) {
    return { message: "Check your email to confirm your account before signing in." };
  }

  redirect(await getPostAuthDestination(supabase, data.user!.id));
}

export async function signIn(_prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect(await getPostAuthDestination(supabase, data.user.id));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
