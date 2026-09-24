import { redirect } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PageMotion from "@/components/dashboard/PageMotion";

export const metadata = {
  title: "Dashboard | MYResearchGuide",
};

// Server component: loads the signed-in user's profile row (RLS-scoped) and
// renders the shared dashboard chrome. Middleware guards the route; this
// re-checks, and individual pages still do their own authz checks.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, username, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <MotionConfig reducedMotion="user">
      <DashboardShell
        profile={
          profile ?? { name: "", username: "", role: "researcher" }
        }
      >
        <PageMotion>{children}</PageMotion>
      </DashboardShell>
    </MotionConfig>
  );
}
