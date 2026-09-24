"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell, { inputClass, primaryBtnClass } from "@/components/AuthShell";

// Landing page for password-reset links. Supabase emits three shapes and we
// handle all of them:
//   ?code=...&next=...           (PKCE flow)      -> exchangeCodeForSession
//   ?token_hash=...&type=recovery (magic-link flow) -> verifyOtp
//   #access_token=...&type=recovery (implicit flow) -> auto-detected on mount
// The submit button enables when a session (any flow) is present.
export default function ResetForm({
  code,
  tokenHash,
}: {
  code?: string;
  tokenHash?: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // Implicit flow: token arrives in the URL hash; detectSessionInUrl
      // (default on) parses it and fires this event.
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setBusy(true);
    const supabase = createClient();

    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
        code
      );
      if (exchangeError) {
        setBusy(false);
        setError(
          "This reset link is invalid or has expired. Request a new one."
        );
        return;
      }
    } else if (tokenHash) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });
      if (verifyError) {
        setBusy(false);
        setError(
          "This reset link is invalid or has expired. Request a new one."
        );
        return;
      }
    } else if (!sessionReady) {
      setBusy(false);
      setError(
        "No reset session found. Open the link from your email, or request a new one."
      );
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message || "Could not update your password.");
      return;
    }

    // Password set via reset link — no forced change needed anymore. Update
    // through the same client that owns the new session (a server action here
    // races cookie propagation after verifyOtp/exchangeCodeForSession).
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", user.id);
    }

    router.push("/dashboard");
    router.refresh();
  }

  const canSubmit = sessionReady || !!code || !!tokenHash;

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password.">
      <form onSubmit={onSubmit} className="!space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (min. 8 characters)"
          autoComplete="new-password"
          required
          className={inputClass}
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          autoComplete="new-password"
          required
          className={inputClass}
        />
        {error ? (
          <p className="!text-sm !text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        {!canSubmit ? (
          <p className="!text-xs !text-zinc-500">
            Waiting for the reset session… open the link from your email if this
            page was loaded directly.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || !canSubmit}
          className={primaryBtnClass}
        >
          {busy ? "Saving…" : "Set password"}
        </button>
      </form>
    </AuthShell>
  );
}
