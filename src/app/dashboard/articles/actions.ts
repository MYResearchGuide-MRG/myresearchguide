"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/data/researchers";

export type ArticleResult = { ok: boolean; error?: string; slug?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function isAdmin(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

// Strip markdown for a plain-text excerpt: images, links, emphasis markers,
// code ticks, math delimiters, then collapse whitespace to 180 chars.
function excerptFrom(body: string): string {
  return (
    body
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[#*`$]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180) + (body.length > 180 ? "…" : "")
  );
}

async function uniqueSlug(
  supabase: SupabaseClient,
  base: string,
  excludeId?: string
): Promise<string> {
  const { data: existing } = await supabase.from("articles").select("slug");
  const taken = new Set(
    (existing ?? []).filter((a) => a.slug !== excludeId).map((a) => a.slug)
  );
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  return slug;
}

export async function createArticle(input: {
  title: string;
  subtitle?: string;
  body_md: string;
  cover_image: string;
  tags: string[];
  status?: "draft" | "published";
}): Promise<ArticleResult> {
  const { supabase, user } = await requireUser();
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required." };

  const slug = await uniqueSlug(supabase, slugify(title));
  const status = input.status ?? "draft";

  const { error } = await supabase.from("articles").insert({
    title,
    slug,
    subtitle: input.subtitle ?? "",
    body_md: input.body_md,
    cover_image: input.cover_image.trim(),
    tags: input.tags,
    excerpt: excerptFrom(input.body_md),
    status,
    author_id: user.id,
    published_at: status === "published" ? new Date().toISOString() : null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/events");
  return { ok: true, slug };
}

export async function updateArticle(
  id: string,
  input: {
    title: string;
    subtitle?: string;
    body_md: string;
    cover_image: string;
    tags: string[];
    status: "draft" | "published";
  }
): Promise<ArticleResult> {
  const { supabase, user } = await requireUser();

  const { data: article } = await supabase
    .from("articles")
    .select("id, slug, status, published_at, author_id")
    .eq("id", id)
    .maybeSingle();
  if (!article) return { ok: false, error: "Article not found." };

  const admin = await isAdmin(supabase, user.id);
  if (article.author_id !== user.id && !admin) {
    return { ok: false, error: "You can only edit your own articles." };
  }

  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required." };

  const oldSlug = article.slug;
  const slug =
    slugify(title) === oldSlug
      ? oldSlug
      : await uniqueSlug(supabase, slugify(title), id);

  const publishing =
    input.status === "published" && article.status !== "published";

  const { error } = await supabase
    .from("articles")
    .update({
      title,
      slug,
      subtitle: input.subtitle ?? "",
      body_md: input.body_md,
      cover_image: input.cover_image.trim(),
      tags: input.tags,
      excerpt: excerptFrom(input.body_md),
      status: input.status,
      published_at:
        publishing && !article.published_at ? new Date().toISOString() : article.published_at,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  if (oldSlug !== slug) revalidatePath(`/events/${oldSlug}`);
  return { ok: true, slug };
}

export async function deleteArticle(id: string): Promise<ArticleResult> {
  const { supabase, user } = await requireUser();

  const { data: article } = await supabase
    .from("articles")
    .select("id, slug, author_id")
    .eq("id", id)
    .maybeSingle();
  if (!article) return { ok: false, error: "Article not found." };

  const admin = await isAdmin(supabase, user.id);
  if (article.author_id !== user.id && !admin) {
    return { ok: false, error: "You can only delete your own articles." };
  }

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/events");
  revalidatePath(`/events/${article.slug}`);
  return { ok: true };
}
