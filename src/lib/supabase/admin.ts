import { createClient } from "@supabase/supabase-js";

// Service-role (secret-key) client. Server-only, never imported by client
// components. Bypasses RLS — used for username->email resolution at login,
// invite/reset token generation, and admin operations.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
