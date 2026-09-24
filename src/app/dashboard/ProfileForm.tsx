/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Type,
  GraduationCap,
  FlaskConical,
  ChevronDown,
  BookOpen,
  Linkedin,
  BookMarked,
  Globe,
  Twitter,
  Github,
  Image,
  Briefcase,
  Crown,
  Building2,
  Link2,
  Lock,
  LockKeyhole,
} from "lucide-react";
import { changePassword, saveResearcherProfile, saveTeamProfile } from "./actions";
import { FormField } from "@/components/dashboard/FormField";
import UploadControl from "@/components/dashboard/UploadControl";

const fieldClass =
  "!w-full !bg-zinc-950 !text-zinc-100 !border !border-zinc-800 !rounded-xl !px-3.5 !py-2.5 !pr-11 !text-sm !outline-none focus:!border-white/40 focus-visible:!ring-2 focus-visible:!ring-white/20 !transition-colors !placeholder-zinc-600";

function commaValue(value: string[] | undefined) {
  return (value ?? []).join(", ");
}

function parseComma(value: string) {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function parseLinks(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx < 0) return { label: "", url: line };
      return { label: line.slice(0, idx).trim(), url: line.slice(idx + 1).trim() };
    })
    .filter((l) => l.label && l.url);
}

function linksText(links: { label: string; url: string }[] | undefined) {
  return (links ?? []).map((l) => `${l.label}: ${l.url}`).join("\n");
}

// --- forms -------------------------------------------------------------------

export function ChangePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
    const result = await changePassword(password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="!space-y-10">
      <h1 className="!font-[Georgia,_'Times_New_Roman',_serif] !text-4xl md:!text-5xl !font-bold !tracking-tight !text-white">
        Set Your Password.
      </h1>

      <div className="!rounded-2xl !border !border-amber-500/30 !bg-amber-500/5 !p-4 !text-sm !text-amber-200/90">
        Your account was created with a temporary password. Set a permanent one
        to continue.
      </div>

      <div className="!space-y-5">
        <FormField label="New password" id="password" icon={<Lock size={15} />}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            className={fieldClass}
          />
        </FormField>

        <FormField
          label="Confirm new password"
          id="confirm-password"
          icon={<LockKeyhole size={15} />}
        >
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
            className={fieldClass}
          />
        </FormField>

        {error ? (
          <p className="!text-sm !text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="!w-full !mt-2 !bg-white !text-black !rounded-2xl !py-3.5 !text-sm !font-bold hover:!bg-zinc-200 disabled:!opacity-50 !transition-colors !cursor-pointer"
        >
          {busy ? "Saving…" : "Set password"}
        </button>
      </div>
    </form>
  );
}

export function ProfileForm({
  role,
  username,
  name: initialName,
  researcher,
  team,
}: {
  role: string;
  username: string;
  name: string;
  researcher: {
    tagline?: string;
    universities?: string[];
    field?: string[];
    level?: string;
    research?: string;
    image?: string;
    linkedin?: string;
    scholar?: string;
    website?: string;
    twitter?: string;
    github?: string;
  } | null;
  team: {
    title?: string;
    tier?: string;
    departments?: string[];
    image?: string;
    links?: { label: string; url: string }[];
  } | null;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [tagline, setTagline] = useState(researcher?.tagline ?? "");
  const [universities, setUniversities] = useState(commaValue(researcher?.universities));
  const [field, setField] = useState(commaValue(researcher?.field));
  const [level, setLevel] = useState(researcher?.level ?? "");
  const [research, setResearch] = useState(researcher?.research ?? "");
  const [image, setImage] = useState(researcher?.image ?? team?.image ?? "");
  const [linkedin, setLinkedin] = useState(researcher?.linkedin ?? "");
  const [scholar, setScholar] = useState(researcher?.scholar ?? "");
  const [website, setWebsite] = useState(researcher?.website ?? "");
  const [twitter, setTwitter] = useState(researcher?.twitter ?? "");
  const [github, setGithub] = useState(researcher?.github ?? "");
  const [title, setTitle] = useState(team?.title ?? "");
  const [tier, setTier] = useState(team?.tier ?? "");
  const [departments, setDepartments] = useState(commaValue(team?.departments));
  const [links, setLinks] = useState(linksText(team?.links));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const common = {
      name: name.trim() || "Profile",
    };
    const result =
      role === "team"
        ? await saveTeamProfile({
            ...common,
            title,
            tier,
            departments: parseComma(departments),
            image,
            links: parseLinks(links),
          })
        : await saveResearcherProfile({
            ...common,
            tagline,
            universities: parseComma(universities),
            field: parseComma(field),
            level,
            research,
            image,
            linkedin,
            scholar,
            website,
            twitter,
            github,
          });

    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2500);
  }

  const isResearcher = role !== "team";
  const roleLabel =
    role === "admin" ? "Admin" : role === "team" ? "Team member" : "Researcher";
  const initial = (name.trim() || "?").charAt(0).toUpperCase();

  return (
    <form onSubmit={onSubmit} className="!space-y-10">
      <div className="!space-y-2">
        <h1 className="!font-[Georgia,_'Times_New_Roman',_serif] !text-4xl md:!text-5xl !font-bold !tracking-tight !text-white">
          Edit Your Profile.
        </h1>
        <p className="!text-sm !text-zinc-500">
          @{username} · {roleLabel}
        </p>
      </div>

      <div className="!rounded-3xl !border !border-zinc-800 !bg-zinc-900/50 !p-6 !space-y-4">
        <div className="!flex !items-center !gap-5">
          {image ? (
            <img
              src={image}
              alt="Profile photo"
              className="!h-24 !w-24 !rounded-full !object-cover !border !border-zinc-700 !bg-zinc-900"
            />
          ) : (
            <div className="!h-24 !w-24 !rounded-full !border !border-zinc-700 !bg-zinc-900 !flex !items-center !justify-center">
              <span className="!text-2xl !font-[Georgia,_'Times_New_Roman',_serif] !text-zinc-500">{initial}</span>
            </div>
          )}
          <div className="!flex-1">
            <UploadControl bucket="avatars" onUploaded={setImage} />
          </div>
        </div>

        <FormField label="Or paste a photo URL" id="image" icon={<Image size={15} />}>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="/profile/team/name.jpg or https://…"
            className={fieldClass}
          />
        </FormField>
      </div>

      <div className="!space-y-5">
        <FormField label="Display name" id="name" icon={<User size={15} />}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={fieldClass}
          />
        </FormField>

        {isResearcher ? (
          <>
            <FormField label="Tagline" id="tagline" icon={<Type size={15} />}>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Chem Eng & Biotech @ Cambridge"
                className={fieldClass}
              />
            </FormField>
            <FormField
              label="Universities (comma-separated)"
              id="universities"
              icon={<GraduationCap size={15} />}
            >
              <input
                type="text"
                value={universities}
                onChange={(e) => setUniversities(e.target.value)}
                placeholder="Harvard, MIT"
                className={fieldClass}
              />
            </FormField>
            <FormField
              label="Fields (comma-separated)"
              id="field"
              icon={<FlaskConical size={15} />}
            >
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="AI & Machine Learning, Physics"
                className={fieldClass}
              />
            </FormField>
            <FormField label="Level" id="level" icon={<ChevronDown size={15} />}>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={`${fieldClass} !appearance-none`}
              >
                <option value="">Select level</option>
                {["Undergrad", "Masters", "PhD", "Postdoc", "Industry"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Research focus" id="research" icon={<BookOpen size={15} />}>
              <textarea
                value={research}
                onChange={(e) => setResearch(e.target.value)}
                rows={3}
                placeholder="What do you work on?"
                className={fieldClass}
              />
            </FormField>
            <FormField label="LinkedIn" id="linkedin" icon={<Linkedin size={15} />}>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className={fieldClass}
              />
            </FormField>
            <FormField
              label="Google Scholar / ResearchGate"
              id="scholar"
              icon={<BookMarked size={15} />}
            >
              <input
                type="text"
                value={scholar}
                onChange={(e) => setScholar(e.target.value)}
                className={fieldClass}
              />
            </FormField>
            <FormField label="Website" id="website" icon={<Globe size={15} />}>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={fieldClass}
              />
            </FormField>
            <FormField label="X / Twitter" id="twitter" icon={<Twitter size={15} />}>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className={fieldClass}
              />
            </FormField>
            <FormField label="GitHub" id="github" icon={<Github size={15} />}>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className={fieldClass}
              />
            </FormField>
          </>
        ) : (
          <>
            <FormField label="Title" id="title" icon={<Briefcase size={15} />}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Director"
                className={fieldClass}
              />
            </FormField>
            <FormField label="Tier" id="tier" icon={<Crown size={15} />}>
              <input
                type="text"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                placeholder="e.g. executive"
                className={fieldClass}
              />
            </FormField>
            <FormField
              label="Departments (comma-separated)"
              id="departments"
              icon={<Building2 size={15} />}
            >
              <input
                type="text"
                value={departments}
                onChange={(e) => setDepartments(e.target.value)}
                placeholder="tech, media"
                className={fieldClass}
              />
            </FormField>
            <FormField
              label="Links (one per line: Label: URL)"
              id="links"
              icon={<Link2 size={15} />}
            >
              <textarea
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                rows={4}
                placeholder={"LinkedIn: https://linkedin.com/in/…\nWebsite: https://…"}
                className={fieldClass}
              />
            </FormField>
          </>
        )}

        {error ? (
          <p className="!text-sm !text-red-400" role="alert">
            {error}
          </p>
        ) : null}

      <motion.button
        type="submit"
        disabled={busy}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="!w-full !mt-2 !bg-white !text-black !rounded-2xl !py-3.5 !text-sm !font-bold hover:!bg-zinc-200 disabled:!opacity-50 !transition-colors !cursor-pointer"
      >
        {busy ? "Saving…" : "Update Profile"}
      </motion.button>

        {saved ? (
          <p className="!text-sm !text-emerald-400">Saved — live on the site.</p>
        ) : null}
      </div>
    </form>
  );
}
