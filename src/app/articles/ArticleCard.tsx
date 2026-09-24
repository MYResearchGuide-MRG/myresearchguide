/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { formatMDYY } from "@/lib/dates";

export type ArticleSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  status: string;
  published_at: string | null;
  author_id: string | null;
};

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  const tag = article.tags?.[0] ?? "POST";
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="!group !relative !bg-zinc-900/50 !rounded-3xl !p-6 !border !border-zinc-800 !flex !flex-col hover:!border-white/40 !transition-colors !no-underline"
    >
      {article.cover_image ? (
        <img
          src={article.cover_image}
          alt={article.title}
          className="!w-full !aspect-video !object-cover !rounded-2xl !mb-4"
        />
      ) : (
        <div className="!w-full !aspect-video !rounded-2xl !mb-4 !bg-gradient-to-br !from-zinc-800 !to-zinc-950 !flex !items-center !justify-center">
          <span className="!text-white/25 !font-bold !p-4 !text-center">
            {article.title}
          </span>
        </div>
      )}
      <h3 className="!text-lg !font-bold !text-white !mb-2">{article.title}</h3>
      <p className="!text-sm !text-zinc-400 !mb-4 !line-clamp-3">
        {article.excerpt}
      </p>
      <div className="!mt-auto !flex !items-center !justify-between !gap-3">
        <span className="!text-[10px] !uppercase !tracking-[0.2em] !border !border-zinc-700 !rounded-full !px-2.5 !py-1 !text-zinc-400">
          {tag}
        </span>
        <span className="!text-xs !text-zinc-500">
          {formatMDYY(article.published_at)}
        </span>
      </div>
    </Link>
  );
}
