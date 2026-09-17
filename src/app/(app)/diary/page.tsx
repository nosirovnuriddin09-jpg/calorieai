import { redirect } from "next/navigation";
import { createClient, getVerifiedUser } from "@/lib/supabase/server";
import DiaryClient from "@/components/DiaryClient";

export default async function DiaryPage() {
  const supabase = await createClient();
  const user = await getVerifiedUser(supabase);
  if (!user) redirect("/login");

  return <DiaryClient userId={user.id} />;
}
