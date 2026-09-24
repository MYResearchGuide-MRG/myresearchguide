"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { slugify, researchers } from "@/data/researchers";
import { people } from "@/app/team/organisation-data";

export type InviteResult = {
  ok: boolean;
  error?: string;
  link?: string;
  username?: string;
};

const USERNAME_RE = /^[a-z0-9._-]{3,32}$/;

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null as null };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || profile.role !== "admin") return { supabase, user: null as null };
  return { supabase, user };
}

// Best-effort email of an invite/reset link via Resend. Silently skipped when
// RESEND_API_KEY is unset (admin can copy the link from the dashboard instead).
async function emailLink(to: string, subject: string, link: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MRG Portal <onboarding@resend.dev>",
        to: [to],
        subject,
        text: `Open this link within the next hour: ${link}`,
      }),
    });
  } catch (err) {
    console.error("resend invite email failed:", err);
  }
}

// --- individual invite -------------------------------------------------------

export async function inviteUser(input: {
  username: string;
  email: string;
  name: string;
  role: "researcher" | "team";
}): Promise<InviteResult> {
  const { user } = await requireAdmin();
  if (!user) return { ok: false, error: "Admins only." };

  const username = input.username.trim().toLowerCase();
  const email = input.email.trim().toLowerCase();
  if (!USERNAME_RE.test(username)) {
    return {
      ok: false,
      error: "Username must be 3–32 chars: letters, numbers, . _ -",
    };
  }
  if (!email || !email.includes("@")) {
    return { ok: false, error: "A valid email is required (password reset uses it)." };
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();
  if (existing) return { ok: false, error: `Username "${username}" is taken.` };

  const tempPassword = randomBytes(16).toString("hex");

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      username,
      name: input.name.trim() || username,
      role: input.role,
    },
  });
  if (createError) {
    return { ok: false, error: createError.message };
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error: linkError } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${origin}/reset-password` },
  });
  if (linkError) {
    return { ok: false, error: `Account created, but reset link failed: ${linkError.message}` };
  }
  const link = data.properties.action_link;

  await emailLink(email, "Set your MRG portal password", link);

  return { ok: true, link, username };
}

// --- bulk invite: one "Name, email" per line -----------------------------------

export async function bulkInvite(text: string): Promise<{
  ok: boolean;
  error?: string;
  results: { name: string; email: string; status: string }[];
}> {
  const { user } = await requireAdmin();
  if (!user) return { ok: false, error: "Admins only.", results: [] };

  const admin = createAdminClient();
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const results: { name: string; email: string; status: string }[] = [];
  const used = new Set<string>();

  for (const line of lines) {
    const idx = line.indexOf(",");
    const name = (idx >= 0 ? line.slice(0, idx) : line).trim();
    const email = (idx >= 0 ? line.slice(idx + 1) : "").trim().toLowerCase();
    if (!email.includes("@")) {
      results.push({ name, email, status: "skipped: missing email" });
      continue;
    }

    let username = slugify(name).replace(/[^a-z0-9._-]/g, "").slice(0, 32) || "member";
    let candidate = username;
    let n = 2;
    while (used.has(candidate)) {
      candidate = `${username}-${n++}`;
    }
    used.add(candidate);

    const tempPassword = randomBytes(16).toString("hex");
    const { error } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { username: candidate, name, role: "researcher" },
    });
    if (error) {
      results.push({ name, email, status: `failed: ${error.message}` });
      continue;
    }
    results.push({ name, email, status: `created as @${candidate}` });
  }

  return { ok: true, results };
}

// --- update an account's email (syncs auth.users + profiles via trigger) ------

export async function updateAccountEmail(
  userId: string,
  email: string
): Promise<InviteResult> {
  const { user } = await requireAdmin();
  if (!user) return { ok: false, error: "Admins only." };

  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) {
    return { ok: false, error: "A valid email is required." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    email: normalized,
    email_confirm: true,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// --- reset link for an existing account ------------------------------------------

export async function makeResetLink(email: string): Promise<InviteResult> {
  const { user } = await requireAdmin();
  if (!user) return { ok: false, error: "Admins only." };

  const admin = createAdminClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email: email.trim().toLowerCase(),
    options: { redirectTo: `${origin}/reset-password` },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, link: data.properties.action_link };
}

// --- one-click temp details: seed a researcher/team profile from MRG data ------

export type GenerateTempDetailsResult = {
  ok: boolean;
  matched?: boolean;
  source?: "data" | "placeholder";
  error?: string;
};

export async function generateTempDetails(
  profileId: string
): Promise<GenerateTempDetailsResult> {
  const { user } = await requireAdmin();
  if (!user) return { ok: false, error: "Admins only." };

  const admin = createAdminClient();

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, username, name, role")
    .eq("id", profileId)
    .maybeSingle();
  if (profileError || !profile) {
    return {
      ok: false,
      error: profileError?.message ?? "Profile not found.",
    };
  }

  if (profile.role === "researcher") {
    const entry = researchers.find(
      (r) =>
        slugify(r.name) === slugify(profile.name) ||
        r.name.toLowerCase() === profile.name.toLowerCase()
    );
    const base = entry ?? {
      tagline: profile.name,
      universities: [],
      field: [],
      level: "Undergrad",
      research: "",
      image: "",
      linkedin: "",
      scholar: "",
      website: "",
      twitter: "",
      github: "",
      interview: "",
    };
    const { error } = await admin.from("researcher_profiles").upsert(
      {
        profile_id: profileId,
        tagline: base.tagline ?? "",
        universities: base.universities ?? [],
        field: base.field ?? [],
        level: base.level ?? "",
        research: base.research ?? "",
        image: base.image ?? "",
        linkedin: base.linkedin ?? "",
        scholar: base.scholar ?? "",
        website: base.website ?? "",
        twitter: base.twitter ?? "",
        github: base.github ?? "",
        interview: base.interview ?? "",
      },
      { onConflict: "profile_id" }
    );
    if (error) return { ok: false, error: error.message };
    revalidatePath("/researchers");
    return {
      ok: true,
      matched: !!entry,
      source: entry ? "data" : "placeholder",
    };
  }

  if (profile.role === "team") {
    const entry = people.find((p) => slugify(p.name) === slugify(profile.name));
    const base = entry ?? {
      title: "Member",
      tier: "",
      departments: [],
      image: "",
      links: [],
    };
    const { error } = await admin.from("team_profiles").upsert(
      {
        profile_id: profileId,
        title: base.title ?? "",
        tier: base.tier ?? "",
        departments: base.departments ?? [],
        image: base.image ?? "",
        links: base.links ?? [],
      },
      { onConflict: "profile_id" }
    );
    if (error) return { ok: false, error: error.message };
    return {
      ok: true,
      matched: !!entry,
      source: entry ? "data" : "placeholder",
    };
  }

  return {
    ok: false,
    error: `Cannot generate details for role "${profile.role}".`,
  };
}
