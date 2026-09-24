import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ArticleList, { type Article } from "./ArticleList";

export const metadata = {
  title: "My Articles | MYResearchGuide",
};

export default async function ArticlesListPage() {
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
  const isAdmin = profile?.role === "admin";

  // Admins manage every member's articles; everyone else sees their own.
  let articles: Article[] = [];
  let authorNames: Record<string, string> = {};
  if (isAdmin) {
    const [{ data: all }, { data: names }] = await Promise.all([
      supabase
        .from("articles")
        .select("id, title, slug, subtitle, status, updated_at, author_id")
        .order("updated_at", { ascending: false }),
      supabase.from("public_profiles").select("id, name"),
    ]);
    articles = (all ?? []) as Article[];
    authorNames = Object.fromEntries((names ?? []).map((n) => [n.id, n.name]));
  } else {
    const { data: own } = await supabase
      .from("articles")
      .select("id, title, slug, subtitle, status, updated_at, author_id")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false });
    articles = (own ?? []) as Article[];
  }

  return (
    <section className="!max-w-5xl !mx-auto !px-4 md:!px-8 !py-10 md:!py-14">
      <div className="!flex !items-end !justify-between !mb-10 !gap-4">
        <div>
          <h1 className="!font-serif !text-4xl md:!text-5xl !font-bold !tracking-tight !text-white !mb-2">
            Articles
          </h1>
          <p className="!text-zinc-500 !text-sm">
            Drafts and published posts, written in markdown with LaTeX support.
          </p>
        </div>
        <Link
          href="/dashboard/articles/new"
          className="!shrink-0 !no-underline !bg-white !text-black !rounded-xl !px-5 !py-2.5 !text-sm !font-bold hover:!bg-zinc-200 disabled:!opacity-50 !transition-colors !cursor-pointer"
        >
          New article
        </Link>
      </div>

      <ArticleList articles={articles} authorNames={authorNames} isAdmin={isAdmin} />
    </section>
  );
}
