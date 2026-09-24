// One-off bootstrap: creates the first admin account so the invite UI is
// reachable. Run AFTER the migration is applied:
//
//   npm run bootstrap-admin -- "admin@example.com" "jay" "Jay Chooi"
//
// Prints a password-reset link — open it to set the admin password.
// Idempotent: if the email already exists, it just re-emits a reset link.
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function loadEnv(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = loadEnv(new URL("../.env.local", import.meta.url).pathname);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const [emailArg, usernameArg, nameArg] = process.argv.slice(2);
const email = (emailArg ?? "").trim().toLowerCase();
const username = (usernameArg ?? "").trim().toLowerCase();
const name = (nameArg ?? "").trim() || username;
if (!email || !username || !/^[a-z0-9._-]{3,32}$/.test(username)) {
  console.error("Usage: npm run bootstrap-admin -- <email> <username> <name>");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Try creating the admin; fall back to updating metadata if the email exists.
const { error: createError } = await admin.auth.admin.createUser({
  email,
  password: randomBytes(16).toString("hex"),
  email_confirm: true,
  user_metadata: { username, name, role: "admin" },
});
if (createError && !createError.message.includes("already registered")) {
  console.error("createUser failed:", createError.message);
  process.exit(1);
}
if (createError) {
  const {
    data: { users },
  } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = users.find((u) => u.email === email);
  if (existing) {
    await admin.auth.admin.updateUserById(existing.id, {
      user_metadata: { username, name, role: "admin" },
    });
  }
}

const { data, error: linkError } = await admin.auth.admin.generateLink({
  type: "recovery",
  email,
});
if (linkError) {
  console.error("generateLink failed:", linkError.message);
  process.exit(1);
}

console.log(`Admin @${username} (${email}) ready.`);
console.log("Set the password by opening this link (valid ~1h):");
console.log(data.properties.action_link);
