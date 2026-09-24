// Seeds login accounts + profile rows for every researcher in
// src/data/researchers.js. Researchers without a known email get a placeholder
// (`<username>@mrg.my`) — swap to real emails via the admin dashboard's Email
// edit on /dashboard/admin once available (password reset needs a real inbox).
//
//   npm run seed-researchers
//
// Writes credentials-researchers.txt (gitignored): username / email / temp
// password per person. Temp passwords are single-use in effect: first login
// forces a password change. Idempotent: existing usernames are skipped.
import { readFileSync, writeFileSync, copyFileSync, unlinkSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const out = {};
  try {
    for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
  return out;
}

const env = { ...loadEnvLocal(), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

// researchers.js is ESM in a CJS-default package — load it via a temp .mjs copy.
const src = new URL("../src/data/researchers.js", import.meta.url).pathname;
const tmp = new URL(".seed-researchers.tmp.mjs", import.meta.url).pathname;
copyFileSync(src, tmp);
const { researchers } = await import(tmp);
unlinkSync(tmp);

// Real emails known so far (from researcher-data.csv).
const KNOWN_EMAILS = {
  "Prof. Kim Siang Khaw": "kimsiang84@sjtu.edu.cn",
  "Prof. Mathias Foo": "M.Foo@warwick.ac.uk",
  "Prof. Yuan-Sen Ting": "ting.74@osu.edu",
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Existing usernames (idempotency).
const { data: existingProfiles } = await admin.from("profiles").select("username");
const used = new Set((existingProfiles ?? []).map((p) => p.username));

const lines = [];
let created = 0;
let skipped = 0;

for (const r of researchers) {
  const username = slugify(r.name);
  if (used.has(username)) {
    skipped++;
    continue;
  }
  used.add(username);

  const email = KNOWN_EMAILS[r.name] ?? `${username}@researchers.invalid`;
  const tempPassword = randomBytes(9).toString("base64url");

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { username, name: r.name, role: "researcher" },
  });
  if (error) {
    lines.push(`${r.name}\tSKIPPED: ${error.message}`);
    continue;
  }

  const { error: profileError } = await admin.from("researcher_profiles").upsert(
    {
      profile_id: data.user.id,
      tagline: r.tagline ?? "",
      universities: r.universities ?? [],
      field: r.field ?? [],
      level: r.level ?? "",
      research: r.research ?? "",
      image: r.image ?? "",
      linkedin: r.linkedin ?? "",
      scholar: r.scholar ?? "",
      website: r.website ?? "",
      twitter: r.twitter ?? "",
      github: r.github ?? "",
      interview: r.interview ?? "",
    },
    { onConflict: "profile_id" }
  );
  if (profileError) {
    lines.push(`${r.name}\tPROFILE ERROR: ${profileError.message}`);
    continue;
  }

  lines.push(`${r.name}\t${username}\t${email}\t${tempPassword}`);
  created++;
}

const credPath = new URL("../credentials-researchers.txt", import.meta.url).pathname;
writeFileSync(credPath, "Name\tUsername\tEmail\tTemp password\n" + lines.join("\n") + "\n");

console.log(`Created ${created}, skipped ${skipped}. Credentials -> credentials-researchers.txt`);

// Verify the login path for the first seeded account.
const first = researchers[0];
const firstUsername = slugify(first.name);
const firstEmail = KNOWN_EMAILS[first.name] ?? `${firstUsername}@researchers.invalid`;
const anon = createClient(url, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data: p } = await admin
  .from("profiles")
  .select("email")
  .eq("username", firstUsername)
  .maybeSingle();
if (p) {
  const { error } = await anon.auth.signInWithPassword({
    email: p.email,
    password: lines.find((l) => l.includes(firstUsername))?.split("\t")[3] ?? "",
  });
  console.log(`login verify (${firstUsername}):`, error ? "FAIL " + error.message : "OK");
}
