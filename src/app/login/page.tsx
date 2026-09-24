"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock } from "lucide-react";
import AuthShell, { inputClass, primaryBtnClass } from "@/components/AuthShell";
import { login } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await login(username, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in with your MRG username.">
      <form onSubmit={onSubmit} className="!space-y-4">
        <div className="!relative">
          <User
            size={16}
            className="!absolute !left-3.5 !top-1/2 !-translate-y-1/2 !text-zinc-500"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            required
            className={inputClass + " !pl-10"}
          />
        </div>
        <div className="!relative">
          <Lock
            size={16}
            className="!absolute !left-3.5 !top-1/2 !-translate-y-1/2 !text-zinc-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className={inputClass + " !pl-10"}
          />
        </div>

        {error ? (
          <p className="!text-sm !text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={busy} className={primaryBtnClass}>
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <div className="!flex !items-center !justify-between !text-sm">
          <Link
            href="/forgot-password"
            className="!text-zinc-500 hover:!text-white !no-underline !transition-colors"
          >
            Forgot password?
          </Link>
          <span className="!text-zinc-600 !text-xs">
            Accounts are provided by MRG admin.
          </span>
        </div>
      </form>
    </AuthShell>
  );
}
