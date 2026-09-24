"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type LoginResult = { ok: boolean; error?: string };

// Username-based login: resolve username -> auth email (service role,
// server-side only), then sign in with Supabase's native email+password.
// Identical error for unknown username / bad password (no enumeration).
export async function login(
  username: string,
  password: string
): Promise<LoginResult> {
  const name = username.trim().toLowerCase();
  if (!name || !password) {
    return { ok: false, error: "Enter your username and password." };
  }

  const admin = createAdminClient();
  const { data: profile, error: lookupError } = await admin
    .from("profiles")
    .select("email")
    .eq("username", name)
    .maybeSingle();

  if (lookupError) {
    console.error("login lookup failed:", lookupError.message);
    return { ok: false, error: "Invalid username or password." };
  }
  if (!profile) {
    return { ok: false, error: "Invalid username or password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password,
  });

  if (error) {
    return { ok: false, error: "Invalid username or password." };
  }
  return { ok: true };
}
