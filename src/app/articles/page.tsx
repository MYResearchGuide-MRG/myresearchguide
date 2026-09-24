import NewNav from "@/components/NewNav";
import Foot from "@/components/Foot";
import { createClient } from "@/lib/supabase/server";
import ArticleCard, { type ArticleSummary } from "./ArticleCard";

export const metadata = {
  title: "Articles | MYResearchGuide",
  description:
    "Research notes and announcements from the MRG community.",
};

export default async function ArticlesPage() {
  const supabase = await createClient();

  const [{ data: articles }, { data: profiles }] = await Promise.all([
    supabase
      .from("articles")
      .select(
        "id,title,slug,excerpt,cover_image,tags,status,published_at,author_id"
      )
      .eq("status", "published")
      .order("published_at", { ascending: false }),
    supabase.from("public_profiles").select("id,name,role,username"),
  ]);

  // Author map keyed by profile id, used by the card/detail serialization.
  const authorMap: Record<string, { name: string; role: string; username: string }> = {};
  (profiles ?? []).forEach((p) => {
    if (p.id) {
      authorMap[p.id] = {
        name: p.name,
        role: p.role,
        username: p.username,
      };
    }
  });

  const list: ArticleSummary[] = (articles ?? []) as ArticleSummary[];

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <NewNav />
      <section className="!px-4 md:!px-8 !py-12 sm:!py-16 md:!py-24 !bg-black !text-white">
        <div className="!text-center !mb-12 sm:!mb-16">
          <h1 className="!text-5xl md:!text-[5rem] !tracking-tighter !mb-4 !text-white">
            Articles.
          </h1>
          <p className="!text-lg !max-w-2xl !mx-auto !text-gray-400">
            Research notes and announcements from the MRG community.
          </p>
        </div>
        {list.length === 0 ? (
          <p className="!text-center !text-zinc-500">No articles yet.</p>
        ) : (
          <div className="!max-w-7xl !mx-auto !grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-6">
            {list.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>
      <Foot />
    </main>
  );
}
