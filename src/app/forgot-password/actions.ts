"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ForgotResult = { ok: boolean; error?: string };

// Username -> email -> native Supabase reset email. Always returns the same
// generic success message so the endpoint can't be used to probe accounts.
export async function requestReset(username: string): Promise<ForgotResult> {
  const name = username.trim().toLowerCase();
  if (!name) return { ok: false, error: "Enter your username." };

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("email")
    .eq("username", name)
    .maybeSingle();

  // Unknown username: no email sent, but report success (anti-enumeration).
  if (!profile) return { ok: true };

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    console.error("reset email failed:", error.message);
    // Same generic response; the user can retry or contact an admin.
  }
  return { ok: true };
}
