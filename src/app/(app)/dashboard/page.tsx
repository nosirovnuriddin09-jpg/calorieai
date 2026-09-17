import { redirect } from "next/navigation";
import { createClient, getVerifiedUser } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = await getVerifiedUser(supabase);

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const userName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return <DashboardClient userId={user.id} userName={userName} initialProfile={profile} />;
}
