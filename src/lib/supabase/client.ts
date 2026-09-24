import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client (anon/publishable key). Use for client
// components only — never for data that depends on RLS-scoped queries
// that must not leak the service role.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
