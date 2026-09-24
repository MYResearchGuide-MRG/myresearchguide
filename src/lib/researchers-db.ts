import { createClient } from "@/lib/supabase/server";
import { researchers as staticResearchers, slugify } from "@/data/researchers";

// Shape mirrors the entries of src/data/researchers.js so the grid, filters,
// and detail pages work identically against DB-backed data.
export type Researcher = {
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
  interview: string;
};

// Authority model: the DB row is the truth once it exists (seeded for all
// researchers) — empty means empty, so clearing a field actually sticks.
// The static file is only the fallback for researchers WITHOUT a profile row
// yet, plus DB-only people are always included.
export async function fetchPublicResearchers(): Promise<Researcher[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return staticResearchers;
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    // Supabase env missing/misconfigured on this host — the directory still
    // renders from the static file instead of 500ing the whole page.
    return staticResearchers;
  }

  type ProfileRow = { id: string; name: string; role: string };
  type ResearcherRow = {
    profile_id: string;
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
    interview: string;
  };

  let profiles: ProfileRow[] = [];
  let rows: ResearcherRow[] = [];
  try {
    const [p, r] = await Promise.all([
      supabase.from("public_profiles").select("id, name, role"),
      supabase
        .from("researcher_profiles")
        .select(
          "profile_id, tagline, universities, field, level, research, image, linkedin, scholar, website, twitter, github, interview"
        ),
    ]);
    profiles = (p.data ?? []) as ProfileRow[];
    rows = (r.data ?? []) as ResearcherRow[];
  } catch {
    return staticResearchers;
  }

  const dbByName = new Map<string, Researcher>();
  for (const row of rows) {
    const profile = profiles.find((p) => p.id === row.profile_id);
    if (!profile) continue; // orphaned row — no profile to source the name from
    dbByName.set(slugify(profile.name), {
      name: profile.name,
      tagline: row.tagline ?? "",
      universities: row.universities ?? [],
      field: row.field ?? [],
      level: row.level ?? "",
      research: row.research ?? "",
      image: row.image ?? "",
      linkedin: row.linkedin ?? "",
      scholar: row.scholar ?? "",
      website: row.website ?? "",
      twitter: row.twitter ?? "",
      github: row.github ?? "",
      interview: row.interview ?? "",
    });
  }

  const seen = new Set<string>();
  const out: Researcher[] = [];
  for (const [slug, db] of dbByName) {
    out.push(db);
    seen.add(slug);
  }
  for (const r of staticResearchers) {
    if (!seen.has(slugify(r.name))) out.push(r);
  }

  // Deterministic order (grid re-floats completed profiles anyway).
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
