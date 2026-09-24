"use client";

import { useState } from "react";
import AuthShell, { inputClass, primaryBtnClass } from "@/components/AuthShell";
import { requestReset } from "./actions";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await requestReset(username);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to set a new one."
    >
      {sent ? (
        <div className="!space-y-4">
          <p className="!text-sm !text-zinc-300">
            If an account exists for that username, a reset link is on its way
            to the email on file.
          </p>
          <p className="!text-xs !text-zinc-500">
            Didn't get it? Check spam, or ask an MRG admin to resend the link.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="!space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            required
            className={inputClass}
          />
          {error ? (
            <p className="!text-sm !text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={busy} className={primaryBtnClass}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
