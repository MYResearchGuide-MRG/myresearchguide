import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Editor from "../Editor";

export const metadata = {
  title: "New Article | MYResearchGuide",
};

export default async function NewArticlePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="!max-w-7xl !mx-auto">
      <Editor isNew authorName={profile?.name ?? ""} />
    </div>
  );
}
