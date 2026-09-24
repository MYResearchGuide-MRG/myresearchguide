"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { slugify } from "@/data/researchers";
import { assertOwnedStorageUrl } from "@/lib/supabase/uploads";

export type SaveResult = { ok: boolean; error?: string };

// --- shared helpers ---------------------------------------------------------

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

// --- password ---------------------------------------------------------------

export async function changePassword(newPassword: string): Promise<SaveResult> {
  const { supabase, user } = await requireUser();
  if (newPassword.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };

  await supabase
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", user.id);

  return { ok: true };
}

// --- researcher profile -----------------------------------------------------

export async function saveResearcherProfile(input: {
  name: string;
  tagline: string;
  universities: string[];
  field: string[];
  level: string;
  research: string;
  image: string;
  linkedin: string;
  scholar: string;
  website: string;
  twitter: string;
  github: string;
}): Promise<SaveResult> {
  const { supabase, user } = await requireUser();

  // Avatar ownership: admins may reference any image; everyone else must only
  // point at files in their own avatars/<uid> folder (RLS-protected).
  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (caller?.role !== "admin") {
    const check = await assertOwnedStorageUrl(supabase, input.image, "avatars", user.id);
    if (!check.ok) return { ok: false, error: check.error };
  }

  const clean = (s: string) => s.trim();
  const name = clean(input.name) || user.email;
  const { error: nameError } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id);
  if (nameError) return { ok: false, error: nameError.message };

  const { error } = await supabase
    .from("researcher_profiles")
    .upsert(
      {
        profile_id: user.id,
        tagline: clean(input.tagline),
        universities: input.universities.map(clean).filter(Boolean),
        field: input.field.map(clean).filter(Boolean),
        level: input.level || null,
        research: clean(input.research),
        image: clean(input.image),
        linkedin: clean(input.linkedin),
        scholar: clean(input.scholar),
        website: clean(input.website),
        twitter: clean(input.twitter),
        github: clean(input.github),
      },
      { onConflict: "profile_id" }
    );

  if (error) return { ok: false, error: error.message };

  revalidatePath("/researchers");
  revalidatePath(`/researchers/${slugify(name)}`);
  revalidatePath("/");
  return { ok: true };
}

// --- team profile -----------------------------------------------------------

export async function saveTeamProfile(input: {
  name: string;
  title: string;
  tier: string;
  departments: string[];
  image: string;
  links: { label: string; url: string }[];
}): Promise<SaveResult> {
  const { supabase, user } = await requireUser();

  // Avatar ownership: admins may reference any image; everyone else must only
  // point at files in their own avatars/<uid> folder (RLS-protected).
  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (caller?.role !== "admin") {
    const check = await assertOwnedStorageUrl(supabase, input.image, "avatars", user.id);
    if (!check.ok) return { ok: false, error: check.error };
  }

  const clean = (s: string) => s.trim();
  const { error: nameError } = await supabase
    .from("profiles")
    .update({ name: clean(input.name) || user.email })
    .eq("id", user.id);
  if (nameError) return { ok: false, error: nameError.message };

  const { error } = await supabase
    .from("team_profiles")
    .upsert(
      {
        profile_id: user.id,
        title: clean(input.title),
        tier: clean(input.tier),
        departments: input.departments.map(clean).filter(Boolean),
        image: clean(input.image),
        links: input.links.filter((l) => l.label && l.url),
      },
      { onConflict: "profile_id" }
    );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// --- session ------------------------------------------------------------------

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
