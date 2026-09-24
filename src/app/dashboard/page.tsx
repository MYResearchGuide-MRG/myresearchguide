import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm, ChangePasswordForm } from "./ProfileForm";

export const metadata = {
  title: "Dashboard | MYResearchGuide",
};

// Server component: loads the signed-in user's profile rows (RLS-scoped) and
// renders the editor. Middleware already guards the route; this re-checks.
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, email, role, name, must_change_password")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return (
      <main className="min-h-screen bg-black !text-white flex items-center justify-center !px-4">
        <div className="!bg-zinc-900/50 !rounded-3xl !border !border-zinc-800 !p-8 !max-w-md !text-center">
          <h1 className="!text-2xl !font-bold !mb-2">Account not provisioned</h1>
          <p className="!text-sm !text-zinc-400">
            Your login works but no profile is attached yet. Ask an MRG admin to
            provision your researcher or team profile.
          </p>
        </div>
      </main>
    );
  }

  const [researcher, team] = await Promise.all([
    supabase
      .from("researcher_profiles")
      .select("*")
      .eq("profile_id", user.id)
      .maybeSingle(),
    supabase
      .from("team_profiles")
      .select("*")
      .eq("profile_id", user.id)
      .maybeSingle(),
  ]);

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden !text-white">
      <section className="!max-w-3xl !mx-auto !px-4 md:!px-10 !py-12 md:!py-16 !space-y-10">
        {profile.must_change_password ? (
          <ChangePasswordForm />
        ) : (
          <ProfileForm
            role={profile.role}
            username={profile.username}
            name={profile.name}
            researcher={researcher.data}
            team={team.data}
          />
        )}
      </section>
    </main>
  );
}
