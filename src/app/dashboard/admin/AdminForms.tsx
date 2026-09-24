"use client";

import { useState, useTransition } from "react";
import {
  inviteUser,
  bulkInvite,
  makeResetLink,
  generateTempDetails,
  updateAccountEmail,
} from "./actions";

const fieldClass =
  "!w-full !bg-zinc-950 !text-zinc-100 !border !border-zinc-800 !rounded-xl !px-3.5 !py-2.5 !text-sm !outline-none focus:!border-white/40 !transition-colors !placeholder-zinc-600";
const labelClass = "!block !text-xs !uppercase !tracking-wider !text-zinc-500 !mb-1.5";
const cardClass =
  "!rounded-3xl !border !border-zinc-800 !bg-zinc-900/50 !p-6";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={cardClass}>
      <h2 className="!text-lg !font-bold !tracking-tight !mb-4">{title}</h2>
      {children}
    </section>
  );
}

export function InviteForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"researcher" | "team">("researcher");
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLink(null);
    setBusy(true);
    const result = await inviteUser({ username, email, name, role });
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Invite failed.");
      return;
    }
    setLink(result.link ?? null);
    setUsername("");
    setEmail("");
    setName("");
  }

  return (
    <Section title="Invite a member">
      <form onSubmit={onSubmit} className="!space-y-4">
        <div className="!grid !gap-4 sm:!grid-cols-2">
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. jay-chooi"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email (for password reset)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Display name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "researcher" | "team")}
              className={fieldClass}
            >
              <option value="researcher">Researcher</option>
              <option value="team">Team member</option>
            </select>
          </div>
        </div>

        {error ? (
          <p className="!text-sm !text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        {link ? (
          <div className="!rounded-xl !border !border-emerald-500/30 !bg-emerald-500/5 !p-3 !text-sm">
            <p className="!text-emerald-300 !mb-2">
              Account created. Share the reset link (or it was emailed if
              RESEND_API_KEY is set):
            </p>
            <code className="!block !break-all !text-xs !text-zinc-300">{link}</code>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="!bg-white !text-black !rounded-xl !px-5 !py-2.5 !text-sm !font-bold disabled:!opacity-50 !cursor-pointer"
        >
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
    </Section>
  );
}

export function BulkInviteForm() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<
    { name: string; email: string; status: string }[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);
    setBusy(true);
    const result = await bulkInvite(text);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Bulk invite failed.");
      return;
    }
    setResults(result.results);
  }

  return (
    <Section title="Bulk invite (Name, email per line)">
      <form onSubmit={onSubmit} className="!space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={"Alden Goh, alden@example.com\nJay Chooi, jay@example.com"}
          className={fieldClass}
        />
        {error ? (
          <p className="!text-sm !text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        {results ? (
          <ul className="!space-y-1 !text-xs !text-zinc-400 !max-h-48 !overflow-auto">
            {results.map((r, i) => (
              <li key={i}>
                <span className="!text-zinc-300">{r.name}</span> ({r.email}) —{" "}
                {r.status}
              </li>
            ))}
          </ul>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="!bg-white !text-black !rounded-xl !px-5 !py-2.5 !text-sm !font-bold disabled:!opacity-50 !cursor-pointer"
        >
          {busy ? "Creating…" : "Create accounts"}
        </button>
      </form>
    </Section>
  );
}

export function AccountRow({
  id,
  username,
  email,
  name,
  role,
  must_change_password: mustChangePassword,
}: {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  must_change_password: boolean;
}) {
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [genResult, setGenResult] = useState<{ matched: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState(email);
  const [emailMsg, setEmailMsg] = useState<string | null>(null);

  async function onReset() {
    setBusy(true);
    const result = await makeResetLink(email);
    setBusy(false);
    if (result.ok && result.link) setLink(result.link);
  }

  function onGenerate() {
    setGenResult(null);
    startTransition(async () => {
      const result = await generateTempDetails(id);
      if (result.ok) setGenResult({ matched: !!result.matched });
    });
  }

  async function onSaveEmail() {
    setEmailMsg(null);
    setBusy(true);
    const result = await updateAccountEmail(id, emailDraft);
    setBusy(false);
    if (!result.ok) {
      setEmailMsg(result.error ?? "Update failed.");
      return;
    }
    setEditingEmail(false);
    setEmailMsg("Email updated.");
  }

  return (
    <li className="!py-3 !border-b !border-zinc-800/60 last:!border-0">
      <div className="!flex !items-center !justify-between !gap-3">
        <div className="!min-w-0">
          <p className="!text-sm !font-semibold !truncate">
            {name} <span className="!text-zinc-500 !font-normal">@{username}</span>
          </p>
          {editingEmail ? (
            <div className="!flex !items-center !gap-2 !mt-1">
              <input
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                className="!w-56 !bg-zinc-950 !text-zinc-100 !border !border-zinc-800 !rounded-lg !px-2.5 !py-1 !text-xs !outline-none focus:!border-white/40"
              />
              <button
                type="button"
                onClick={onSaveEmail}
                disabled={busy}
                className="!text-xs !text-emerald-300 hover:!text-emerald-200 disabled:!opacity-50 !cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingEmail(false);
                  setEmailDraft(email);
                  setEmailMsg(null);
                }}
                className="!text-xs !text-zinc-500 hover:!text-zinc-300 !cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="!text-xs !text-zinc-500 !truncate">
              {email} · {role}
              {mustChangePassword ? " · temp password" : ""}
            </p>
          )}
          {emailMsg ? (
            <p className="!text-xs !text-emerald-400 !mt-1">{emailMsg}</p>
          ) : null}
        </div>
        <div className="!flex !items-center !gap-2 !shrink-0">
          <button
            type="button"
            onClick={() => setEditingEmail((v) => !v)}
            className="!text-xs !text-zinc-400 hover:!text-white !border !border-zinc-700 !rounded-lg !px-3 !py-1.5 !transition-colors !cursor-pointer"
          >
            Email
          </button>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isPending}
            className="!text-xs !text-zinc-400 hover:!text-white !border !border-zinc-700 !rounded-lg !px-3 !py-1.5 !transition-colors disabled:!opacity-50 !cursor-pointer"
          >
            {isPending ? "…" : "Generate"}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={busy}
            className="!text-xs !text-zinc-400 hover:!text-white !border !border-zinc-700 !rounded-lg !px-3 !py-1.5 !transition-colors disabled:!opacity-50 !cursor-pointer"
          >
            {busy ? "…" : "Reset link"}
          </button>
        </div>
      </div>
      {link ? (
        <code className="!block !break-all !text-xs !text-zinc-400 !mt-2 !bg-zinc-950 !rounded-lg !p-2">
          {link}
        </code>
      ) : null}
      {genResult ? (
        <p className="!mt-2 !text-xs !text-zinc-400">
          {genResult.matched
            ? "seeded from MRG data"
            : "placeholder details generated"}
        </p>
      ) : null}
    </li>
  );
}
