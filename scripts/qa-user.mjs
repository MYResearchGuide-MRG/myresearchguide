// QA user helper for browser-level verification. Not for production use.
//
//   npm run qa-user -- create admin qa-admin1 secret123
//   npm run qa-user -- delete <user-id>
//   npm run qa-user -- cleanup            (deletes every @qa.mrg.local user)
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
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const [action, ...args] = process.argv.slice(2);

if (action === "create") {
  const [role, username, password] = args;
  const email = `${username}@qa.mrg.local`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username, name: `QA ${role}`, role },
  });
  if (error) {
    console.error("create failed:", error.message);
    process.exit(1);
  }
  console.log(JSON.stringify({ id: data.user.id, username, email, password, role }));
} else if (action === "delete") {
  const { error } = await admin.auth.admin.deleteUser(args[0]);
  if (error) {
    console.error("delete failed:", error.message);
    process.exit(1);
  }
  console.log("deleted", args[0]);
} else if (action === "cleanup") {
  const { data: { users }, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) {
    console.error("list failed:", error.message);
    process.exit(1);
  }
  const qa = users.filter((u) => u.email?.endsWith("@qa.mrg.local"));
  for (const u of qa) {
    await admin.auth.admin.deleteUser(u.id);
  }
  console.log(`deleted ${qa.length} qa users`);
} else {
  console.error("usage: qa-user create <role> <username> <password> | delete <id> | cleanup");
  process.exit(1);
}
