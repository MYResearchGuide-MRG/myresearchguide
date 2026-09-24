"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// Session-aware nav link: shows "Dashboard" when signed in, "Sign in"
// otherwise. Renders the signed-out variant on the server and first
// client paint (hydration-safe), then resolves the real state on mount.
export default function SessionLink() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    try {
      const supabase = createClient();

      supabase.auth.getUser().then(({ data }) => {
        if (mounted) setSignedIn(Boolean(data.user));
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) setSignedIn(Boolean(session?.user));
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } catch {
      // Supabase env not configured on this host — stay signed-out rather
      // than crashing the nav for every visitor.
      return;
    }
  }, []);

  return (
    <Link
      href={signedIn ? "/dashboard" : "/login"}
      className="!relative !inline-block !text-zinc-400 hover:!text-white !transition-all !duration-300 !text-[15px] !font-medium !no-underline"
    >
      {signedIn ? "Dashboard" : "Sign in"}
    </Link>
  );
}
