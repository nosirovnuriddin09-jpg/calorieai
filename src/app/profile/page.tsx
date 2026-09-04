import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (error || !profile) {
    redirect("/onboarding");
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold">Profile</h1>
          <p className="text-sm text-muted mt-1">{user.email}</p>
        </div>
        <ProfileForm profile={profile} />
      </div>
    </DashboardLayout>
  );
}
