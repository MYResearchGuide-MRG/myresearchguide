// End-to-end auth verification against the live project. Run AFTER the
// migration is applied:
//
//   npm run verify-auth
//
// What it checks (all against the remote Supabase project):
//   1. Create a throwaway user (known password, no email involved)
//   2. Username login via the same resolution path the app uses
//   3. RLS: the user cannot read or update another user's profile row
//   4. Recovery link generation (the /reset-password URL shape)
//   5. Cleanup: delete the throwaway user
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
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_USERNAME = `qa-${randomBytes(3).toString("hex")}`;
const TEST_EMAIL = `${TEST_USERNAME}@qa.mrg.local`;
const TEST_PASSWORD = "qa-password-123!";
let userId;

function pass(msg) {
  console.log(`  PASS  ${msg}`);
}
function fail(msg) {
  console.error(`  FAIL  ${msg}`);
  process.exitCode = 1;
}

try {
  console.log(`Test user: @${TEST_USERNAME} <${TEST_EMAIL}>`);

  // 1. create the user the way invites do (metadata -> trigger writes profiles)
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { username: TEST_USERNAME, name: "QA Test", role: "researcher" },
  });
  if (createErr) throw new Error(`createUser: ${createErr.message}`);
  userId = created.user.id;
  pass("user created; profiles row written by trigger");

  // 2. username login (same path as src/app/login/actions.ts)
  const { data: profile } = await admin
    .from("profiles")
    .select("email")
    .eq("username", TEST_USERNAME)
    .maybeSingle();
  if (!profile) throw new Error("username -> email resolution returned nothing");
  pass("username resolves to auth email");

  const userClient = createClient(url, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: loginErr } = await userClient.auth.signInWithPassword({
    email: profile.email,
    password: TEST_PASSWORD,
  });
  if (loginErr) throw new Error(`signInWithPassword: ${loginErr.message}`);
  pass("username login succeeds");

  // 3. RLS: reading someone else's row (only own rows visible for writes)
  const { data: allRows } = await userClient
    .from("researcher_profiles")
    .select("profile_id");
  const foreign = (allRows ?? []).filter((r) => r.profile_id !== userId);
  if (foreign.length > 0) {
    // Try updating a foreign row. PostgREST returns success with ZERO rows
    // when RLS filters the target — so verify by data, not error.
    const before = foreign[0].tagline;
    const { data: updated } = await userClient
      .from("researcher_profiles")
      .update({ tagline: "hacked" })
      .eq("profile_id", foreign[0].profile_id)
      .select("tagline");
    const { data: after } = await admin
      .from("researcher_profiles")
      .select("tagline")
      .eq("profile_id", foreign[0].profile_id)
      .maybeSingle();
    if ((updated ?? []).length > 0 || after?.tagline === "hacked") {
      fail("RLS: foreign row update was allowed!");
    } else {
      pass(`RLS: foreign row update blocked (${updated.length} rows affected, value intact: "${before}" -> "${after?.tagline}")`);
    }
  } else {
    pass("RLS: no foreign rows visible (select filtered)");
  }

  // 4. recovery link shape (what the admin dashboard generates)
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "recovery",
    email: TEST_EMAIL,
  });
  if (linkErr) throw new Error(`generateLink: ${linkErr.message}`);
  const link = linkData.properties.action_link;
  const token = new URL(link).searchParams.get("token");
  if (!token) throw new Error("recovery link has no token");
  pass("recovery link generated (token extracted)");

  // 5. full reset loop: verifyOtp(token_hash) -> updateUser -> login with new pw
  const resetPassword = "fresh-password-456!";
  const { error: verifyErr } = await userClient.auth.verifyOtp({
    token_hash: token,
    type: "recovery",
  });
  if (verifyErr) throw new Error(`verifyOtp: ${verifyErr.message}`);
  pass("verifyOtp (token_hash recovery) succeeds");

  const { error: updateErr } = await userClient.auth.updateUser({
    password: resetPassword,
  });
  if (updateErr) throw new Error(`updateUser: ${updateErr.message}`);
  pass("password updated via reset session");

  await userClient.auth.signOut();
  const { error: reloginErr } = await userClient.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: resetPassword,
  });
  if (reloginErr) throw new Error(`relogin with new password: ${reloginErr.message}`);
  pass("login with the NEW password succeeds");

  // 6. must_change_password flag cleared (the app clears it post-reset; verify
  //    the owner-scoped update that ResetForm performs is RLS-legal)
  const { error: flagErr } = await userClient
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", userId);
  if (flagErr) throw new Error(`flag clear: ${flagErr.message}`);
  pass("owner can clear must_change_password (RLS allows)");

  // 7. privilege escalation guard (migration 0002): self-promotion must fail.
  //    The BEFORE UPDATE trigger raises — PostgREST surfaces it as an error —
  //    and the admin-side read must show the role unchanged.
  const { error: promoteErr } = await userClient
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", userId);
  const { data: afterPromote } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (!promoteErr || afterPromote?.role !== "researcher") {
    fail(
      `RLS/trigger: self-promotion was not blocked (err=${promoteErr?.message ?? "none"}, role=${afterPromote?.role})`
    );
  } else {
    pass(`self-promotion blocked (${promoteErr.code ?? "P0001"}), role stays "${afterPromote?.role}"`);
  }

  // 8. legit self-edit (name) still allowed through the same policy path
  const { error: nameErr } = await userClient
    .from("profiles")
    .update({ name: "QA Renamed" })
    .eq("id", userId);
  if (nameErr) throw new Error(`self name edit: ${nameErr.message}`);
  pass("owner can still edit non-identity fields (name)");
} catch (err) {
  fail(err.message);
} finally {
  // 5. cleanup
  if (userId) {
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      console.error("  WARN  cleanup failed:", delErr.message);
    } else {
      pass("test user deleted");
    }
  }
  process.exit(process.exitCode ?? 0);
}
