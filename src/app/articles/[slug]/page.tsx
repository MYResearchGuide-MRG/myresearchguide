/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewNav from "@/components/NewNav";
import Foot from "@/components/Foot";
import Markdown from "@/components/Markdown";
import { createClient } from "@/lib/supabase/server";
import { formatLong } from "@/lib/dates";
import { slugify } from "@/data/researchers";

export const dynamic = "force-dynamic";

const chipClass =
  "!text-[10px] !uppercase !tracking-[0.2em] !border !border-zinc-700 !rounded-full !px-2.5 !py-1 !text-zinc-400";

async function getArticle(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "id,title,subtitle,slug,excerpt,cover_image,tags,status,published_at,author_id,body_md"
    )
    .eq("slug", slug)
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article || article.status !== "published") {
    return { title: "Article | MYResearchGuide" };
  }
  return { title: `${article.title} | MYResearchGuide` };
}

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article || article.status !== "published") notFound();

  const supabase = await createClient();
  const { data: author } = article.author_id
    ? await supabase
        .from("public_profiles")
        .select("id,name,role,username")
        .eq("id", article.author_id)
        .single()
    : { data: null };

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <NewNav />
      <section className="!px-4 md:!px-8 !pt-40 !pb-24 !bg-black !text-white">
        <div className="!max-w-3xl !mx-auto">
          <Link
            href="/articles"
            className="!inline-flex !items-center !gap-2 !text-zinc-500 hover:!text-white !text-sm !mb-10 !no-underline !transition-colors"
          >
            <ArrowLeft size={15} />
            All articles
          </Link>

          <h1 className="!text-4xl md:!text-5xl !font-bold !tracking-tighter !mb-4 !text-white">
            {article.title}
          </h1>

          {article.subtitle ? (
            <p className="!font-serif !text-xl !text-zinc-400 !mb-6">
              {article.subtitle}
            </p>
          ) : null}

          <div className="!flex !flex-wrap !items-center !gap-3 !text-sm !text-zinc-500 !mb-8">
            {author?.name ? (
              author.role === "researcher" ? (
                <Link
                  href={`/researchers/${slugify(author.name)}`}
                  className="hover:!text-white !transition-colors !no-underline"
                >
                  {author.name}
                </Link>
              ) : (
                <span>{author.name}</span>
              )
            ) : null}
            {author?.name ? <span>·</span> : null}
            <span>{formatLong(article.published_at)}</span>
            {(article.tags ?? []).map((t: string) => (
              <span key={t} className={chipClass}>
                {t}
              </span>
            ))}
          </div>

          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              className="!w-full !rounded-3xl !border !border-zinc-800 !mb-10"
            />
          ) : null}

          <Markdown>{article.body_md ?? ""}</Markdown>
        </div>
      </section>
      <Foot />
    </main>
  );
}
