import NewNav from "@/components/NewNav";
import Foot from "@/components/Foot";
import { createClient } from "@/lib/supabase/server";
import { ArrowUpRight } from "lucide-react";
import ArticleCard, { type ArticleSummary } from "./ArticleCard";

const MYSSP_URL = "https://myssp.myresearchguide.org";

export const metadata = {
  title: "Events | MYResearchGuide",
  description:
    "Workshops, programmes and announcements from the MRG community, including MYSSP.",
};

export default async function EventsPage() {
  // Without Supabase env (e.g. local dev) still render the page and the MYSSP
  // feature; there are just no posts to list.
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  let articles: unknown[] | null = null;
  if (hasSupabase) {
    const supabase = await createClient();
    ({ data: articles } = await supabase
      .from("articles")
      .select(
        "id,title,slug,excerpt,cover_image,tags,status,published_at,author_id"
      )
      .eq("status", "published")
      .order("published_at", { ascending: false }));
  }

  const list: ArticleSummary[] = (articles ?? []) as ArticleSummary[];

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <NewNav />
      <section className="!px-4 md:!px-8 !py-12 sm:!py-16 md:!py-24 !bg-black !text-white">
        <div className="!text-center !mb-12 sm:!mb-16">
          <h1 className="!text-5xl md:!text-[5rem] !tracking-tighter !mb-4 !text-white">
            Events.
          </h1>
          <p className="!text-lg !max-w-2xl !mx-auto !text-gray-400">
            Workshops, programmes and announcements from the MRG community.
          </p>
        </div>

        {/* Featured: MYSSP */}
        <a
          href={MYSSP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="!group !block !max-w-3xl !mx-auto !mb-16 !rounded-2xl !border !border-white/10 !bg-white/[0.03] hover:!bg-white/[0.06] hover:!border-white/20 !transition-colors !p-6 md:!p-10 !no-underline"
        >
          <span className="!inline-block !rounded-full !border !border-white/20 !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.14em] !text-zinc-300 !mb-5">
            Now running
          </span>
          <h2 className="!text-2xl md:!text-4xl !font-semibold !tracking-tight !text-white !leading-tight !mb-4">
            MYSSP 2026, Malaysia&apos;s 1st Science Research Programme has
            officially commenced!
          </h2>
          <span className="!inline-flex !items-center !gap-1.5 !text-sm md:!text-base !font-semibold !text-white group-hover:!underline">
            Visit the MYSSP website
            <ArrowUpRight size={18} aria-hidden />
          </span>
        </a>

        {list.length === 0 ? null : (
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
