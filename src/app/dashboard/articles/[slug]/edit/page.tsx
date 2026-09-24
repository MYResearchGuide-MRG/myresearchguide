import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Editor from "../../Editor";

export const metadata = {
  title: "Edit Article | MYResearchGuide",
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: article } = await supabase
    .from("articles")
    .select(
      "id, title, subtitle, slug, body_md, cover_image, tags, status, author_id, updated_at"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!article) redirect("/dashboard/articles");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin = profile?.role === "admin";

  if (article.author_id !== user.id && !isAdmin) {
    redirect("/dashboard/articles");
  }

  const { data: author } = await supabase
    .from("public_profiles")
    .select("name")
    .eq("id", article.author_id)
    .maybeSingle();

  return (
    <div className="!max-w-7xl !mx-auto">
      <Editor initial={article} isNew={false} authorName={author?.name ?? ""} />
    </div>
  );
}
