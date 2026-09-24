import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  InviteForm,
  BulkInviteForm,
  AccountRow,
} from "./AdminForms";
import { Stagger, StaggerItem } from "@/components/dashboard/Stagger";

export const metadata = {
  title: "Admin | MYResearchGuide",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: accounts } = await supabase
    .from("profiles")
    .select("id, username, email, name, role, must_change_password")
    .order("name");

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden !text-white">
      <section className="!max-w-5xl !mx-auto !px-4 md:!px-8 !py-10 !space-y-8">
        <div>
          <h1 className="!text-4xl md:!text-5xl !font-bold !tracking-tighter !mb-2">
            Admin
          </h1>
          <p className="!text-zinc-500 !text-sm">
            Accounts, invites, and password reset links.
          </p>
        </div>

        <section className="!rounded-3xl !border !border-zinc-800 !bg-zinc-900/50 !p-6 !flex !items-center !justify-between !gap-4">
          <div>
            <h2 className="!text-lg !font-bold !tracking-tight">Blog management</h2>
            <p className="!text-sm !text-zinc-500 !mt-1">
              Write, edit, and publish articles (markdown + LaTeX) — you can
              edit any member&apos;s posts.
            </p>
          </div>
          <Link
            href="/dashboard/articles"
            className="!shrink-0 !bg-white !text-black !rounded-xl !px-5 !py-2.5 !text-sm !font-bold !no-underline hover:!bg-zinc-200 !transition-colors"
          >
            Manage articles
          </Link>
        </section>

        <InviteForm />
        <BulkInviteForm />

        <section className="!rounded-3xl !border !border-zinc-800 !bg-zinc-900/50 !p-6">
          <h2 className="!text-lg !font-bold !tracking-tight !mb-4">
            Accounts ({accounts?.length ?? 0})
          </h2>
          <Stagger>
            <ul>
              {(accounts ?? []).map((a) => (
                <StaggerItem key={a.id}>
                  <AccountRow {...a} />
                </StaggerItem>
              ))}
            </ul>
          </Stagger>
        </section>
      </section>
    </main>
  );
}
