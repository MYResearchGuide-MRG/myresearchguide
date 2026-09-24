"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { deleteArticle } from "./actions";
import { Stagger, StaggerItem } from "@/components/dashboard/Stagger";

export type Article = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  status: string;
  updated_at: string;
  author_id: string;
};

type StatusFilter = "all" | "draft" | "published";
type ScopeFilter = "all-members" | "mine";

// Compact relative timestamp ("just now", "2h ago", "3d ago") for the
// "Edited …" meta line.
function formatRelative(input: string | Date | null | undefined): string {
  if (!input) return "";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  const seconds = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000));
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="!inline-flex !rounded-xl !border !border-zinc-800 !bg-zinc-900/50 !p-1 !text-sm">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`!rounded-lg !px-3.5 !py-1.5 !transition-colors !cursor-pointer ${
            value === o.value
              ? "!bg-white !text-black !font-bold"
              : "!text-zinc-400 hover:!text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function ArticleList({
  articles,
  authorNames,
  isAdmin,
}: {
  articles: Article[];
  authorNames: Record<string, string>;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [scope, setScope] = useState<ScopeFilter>("all-members");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setCurrentUserId(data.user?.id ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  // Scope first (owner), then status — status counts reflect the active scope.
  const scoped = useMemo(() => {
    if (!isAdmin || scope === "all-members") return articles;
    return currentUserId
      ? articles.filter((a) => a.author_id === currentUserId)
      : [];
  }, [articles, isAdmin, scope, currentUserId]);

  const counts = useMemo(() => {
    const draft = scoped.filter((a) => a.status !== "published").length;
    return { all: scoped.length, draft, published: scoped.length - draft };
  }, [scoped]);

  const visible = useMemo(() => {
    if (statusFilter === "all") return scoped;
    return scoped.filter((a) =>
      statusFilter === "published"
        ? a.status === "published"
        : a.status !== "published"
    );
  }, [scoped, statusFilter]);

  function remove(article: Article) {
    if (!window.confirm(`Delete "${article.title}" permanently?`)) return;
    startTransition(async () => {
      const result = await deleteArticle(article.id);
      if (result?.ok) router.refresh();
    });
  }

  if (articles.length === 0) {
    return (
      <div className="!rounded-3xl !border !border-dashed !border-zinc-800 !p-16 !text-center">
        <p className="!text-zinc-500 !text-sm !mb-4">
          No articles yet — write your first one.
        </p>
        <Link
          href="/dashboard/articles/new"
          className="!inline-block !no-underline !bg-white !text-black !rounded-xl !px-5 !py-2.5 !text-sm !font-bold hover:!bg-zinc-200 disabled:!opacity-50 !transition-colors !cursor-pointer"
        >
          New article
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="!mb-6 !flex !flex-wrap !items-center !gap-3">
        <Segmented
          options={[
            { value: "all", label: `All ${counts.all}` },
            { value: "draft", label: `Drafts ${counts.draft}` },
            { value: "published", label: `Published ${counts.published}` },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        {isAdmin ? (
          <Segmented
            options={[
              { value: "all-members", label: "All members" },
              { value: "mine", label: "Mine" },
            ]}
            value={scope}
            onChange={setScope}
          />
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p className="!text-sm !text-zinc-500 !text-center !py-16">
          No articles match this filter.
        </p>
      ) : (
        <Stagger>
          <ul className="!rounded-3xl !border !border-zinc-800 !bg-zinc-900/50 !divide-y !divide-zinc-800/60">
            {visible.map((a) => (
              <StaggerItem key={a.id}>
                <li className="!flex !items-center !gap-4 !px-6 !py-4 !transition-colors hover:!bg-zinc-800/30">
              <div className="!min-w-0 !flex-1">
                <Link
                  href={`/dashboard/articles/${a.slug}/edit`}
                  className="!block !no-underline !font-semibold !text-white !truncate"
                >
                  {a.title}
                </Link>
                <p className="!text-xs !text-zinc-500 !truncate !mt-0.5">
                  {[
                    a.subtitle,
                    isAdmin ? authorNames[a.author_id] : "",
                    `Edited ${formatRelative(a.updated_at)}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <span
                className={`!shrink-0 !text-[10px] !uppercase !tracking-[0.2em] !rounded-full !border !px-2.5 !py-1 ${
                  a.status === "published"
                    ? "!text-emerald-300/90 !border-emerald-500/30 !bg-emerald-500/10"
                    : "!text-amber-300/90 !border-amber-500/30 !bg-amber-500/10"
                }`}
              >
                {a.status}
              </span>
              {a.status === "published" ? (
                <Link
                  href={`/articles/${a.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!shrink-0 !text-xs !text-zinc-400 hover:!text-white !no-underline !transition-colors"
                >
                  View
                </Link>
              ) : null}
              <Link
                href={`/dashboard/articles/${a.slug}/edit`}
                className="!shrink-0 !text-xs !text-zinc-400 hover:!text-white !no-underline !transition-colors"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => remove(a)}
                disabled={isPending}
                className="!shrink-0 !text-xs !text-red-400 hover:!text-red-300 !transition-colors disabled:!opacity-50 !cursor-pointer"
              >
                Delete
              </button>
              </li>
              </StaggerItem>
            ))}
          </ul>
        </Stagger>
      )}
    </>
  );
}
