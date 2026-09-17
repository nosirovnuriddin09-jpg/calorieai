import { redirect } from "next/navigation";
import { createClient, getVerifiedUser } from "@/lib/supabase/server";
import { getAnalyticsData } from "@/lib/analyticsData";
import AnalyticsClient from "@/components/AnalyticsClient";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const user = await getVerifiedUser(supabase);

  if (!user) redirect("/login");

  const data = await getAnalyticsData(supabase, user.id);

  return <AnalyticsClient userId={user.id} initialData={data} />;
}
