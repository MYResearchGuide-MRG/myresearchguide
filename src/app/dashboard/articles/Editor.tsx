"use client";

import { useCallback, useEffect, useRef, useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Copy, Settings, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import Markdown from "@/components/Markdown";
import { createClient } from "@/lib/supabase/client";
import { formatLong, formatRelative } from "@/lib/dates";
import { createArticle, updateArticle, deleteArticle } from "./actions";
import { RichBody } from "./EditorToolbar";
import TagInput from "./TagInput";

type Draft = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  body_md: string;
  cover_image: string;
  tags: string[];
  status: "draft" | "published";
  updated_at?: string;
};

const primaryBtn =
  "!bg-white !text-black !rounded-xl !px-5 !py-2.5 !text-sm !font-bold hover:!bg-zinc-200 disabled:!opacity-50 !transition-colors !cursor-pointer";
const secondaryBtn =
  "!border !border-zinc-700 !text-zinc-200 !rounded-xl !px-5 !py-2.5 !text-sm !font-bold hover:!border-zinc-500 !transition-colors disabled:!opacity-50 !cursor-pointer";
const canvasClass = "!py-6";
const cardClass = "!border-t !border-zinc-800/60 !pt-6";
const cardLabel = "!text-xs !uppercase !tracking-wider !text-zinc-500 !mb-3";

export default function Editor({
  initial,
  isNew,
  authorName = "",
}: {
  initial?: Draft | null;
  isNew: boolean;
  authorName?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"write" | "source">(
    /\$/.test(initial?.body_md ?? "") ? "source" : "write"
  );

  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [body, setBody] = useState(initial?.body_md ?? "");
  const [coverImage, setCoverImage] = useState(initial?.cover_image ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [status, setStatus] = useState<"draft" | "published">(
    initial?.status ?? "draft"
  );

  // Live math detection: computed from the current body so math typed in
  // Source mode immediately locks the Write toggle (TipTap's serializer
  // escapes `_`/`\` inside math — math bodies never enter WYSIWYG).
  const hasMath = /\$/.test(body);
  // Pristine body as of entering Write mode, so leaving Write after math was
  // typed restores the un-mangled content instead of persisting escapes.
  const writeEntrySnapshot = useRef<string | null>(null);

  // --- keystroke isolation ---------------------------------------------------
  // WYSIWYG typing updates ONLY these refs (no React state) so the editor
  // tree re-renders once per dirty burst instead of on every keystroke.
  // `body` state mirrors the ref for the source textarea / preview / hints.
  const bodyDraftRef = useRef(initial?.body_md ?? "");

  const [autosave, setAutosave] = useState<"idle" | "dirty" | "saving" | "saved">(
    "idle"
  );
  // First save on a new article creates the draft and switches the editor to
  // update mode IN PLACE (no navigation) — a route swap would remount the
  // page and kill the caret mid-typing. The URL stays /new; the created slug
  // is shown in Settings.
  const [isNewState, setIsNewState] = useState(isNew);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  // Articles that START in Write mode (new drafts) still need a pristine
  // snapshot to restore from if math gets typed and escaped.
  useEffect(() => {
    if (mode === "write") writeEntrySnapshot.current = body;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewBody, setPreviewBody] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // --- autosave plumbing -----------------------------------------------------
  // Values are mirrored into a ref so an in-flight save always writes the
  // latest keystrokes even if its closure is stale.
  const touchedRef = useRef(false);
  const savingRef = useRef(false);
  const createdRef = useRef(false);
  const queuedTargetRef = useRef<"draft" | "published" | undefined>(undefined);
  const articleIdRef = useRef<string | null>(initial?.id ?? null);

  const latest = { title, subtitle, body, coverImage, tags, status, isNew: isNewState };
  const latestRef = useRef(latest);
  latestRef.current = latest;

  function markDirty() {
    touchedRef.current = true;
    // Bail out when already dirty: one render per burst, not per keystroke.
    setAutosave((p) => (p === "dirty" ? p : "dirty"));
  }

  // WYSIWYG keystrokes: ref-only, no state update for the content itself.
  const handleBodyChange = useCallback((md: string) => {
    bodyDraftRef.current = md;
    touchedRef.current = true;
    setAutosave((p) => (p === "dirty" ? p : "dirty"));
  }, []);

  function showFlash(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2500);
  }

  async function save(targetStatus?: "draft" | "published", explicit = false) {
    if (savingRef.current) {
      // A publish request must not be downgraded by a queued plain save.
      if (targetStatus === "published" || queuedTargetRef.current === undefined) {
        queuedTargetRef.current = targetStatus;
      }
      return;
    }
    const v = latestRef.current;
    const bodyMd = bodyDraftRef.current;
    // Hard guard: WYSIWYG serialization corrupts LaTeX — never persist a body
    // containing math that was produced by the rich editor.
    if (mode === "write" && /\$/.test(bodyMd)) {
      setError(
        "LaTeX math isn't supported in WYSIWYG mode — switch to Source to keep equations intact."
      );
      setAutosave("dirty");
      return;
    }
    savingRef.current = true;
    setAutosave("saving");
    setError(null);
    try {
      const id = articleIdRef.current;
      if (v.isNew && !id && !createdRef.current) {
        // First save on a new article: create the draft, then switch the
        // editor to update mode in place (no navigation, caret survives).
        createdRef.current = true;
        const result = await createArticle({
          title: v.title,
          subtitle: v.subtitle,
          body_md: bodyMd,
          cover_image: v.coverImage,
          tags: v.tags,
          status: targetStatus ?? "draft",
        });
        if (!result.ok) {
          createdRef.current = false;
          setError(result.error ?? "Something went wrong.");
          setAutosave("dirty");
          return;
        }
        // Resolve the new id (RLS lets the owner read their own row) so any
        // save queued before the mode switch updates instead of creating twice.
        const supabase = createClient();
        const { data: created } = await supabase
          .from("articles")
          .select("id")
          .eq("slug", result.slug ?? "")
          .maybeSingle();
        if (created?.id) articleIdRef.current = created.id as string;
        // In-place switch to update mode — no navigation, caret survives.
        setCreatedSlug(result.slug ?? null);
        setIsNewState(false);
        setLastSavedAt(new Date());
        if (explicit && targetStatus === "published") showFlash("Published.");
      } else {
        const rid = id ?? initial?.id;
        if (!rid) return;
        const result = await updateArticle(rid, {
          title: v.title,
          subtitle: v.subtitle,
          body_md: bodyMd,
          cover_image: v.coverImage,
          tags: v.tags,
          status: targetStatus ?? v.status,
        });
        if (!result.ok) {
          setError(result.error ?? "Something went wrong.");
          setAutosave("dirty");
          return;
        }
        if (targetStatus && targetStatus !== v.status) {
          setStatus(targetStatus);
          if (explicit) {
            showFlash(
              targetStatus === "published" ? "Published." : "Draft saved."
            );
          }
        } else if (explicit) {
          showFlash("Draft saved.");
        }
        setLastSavedAt(new Date());
      }
      setAutosave("saved");
    } finally {
      savingRef.current = false;
    }
    const queued = queuedTargetRef.current;
    queuedTargetRef.current = undefined;
    if (queued !== undefined) {
      window.setTimeout(() => save(queued, true), 0);
    }
  }

  // Debounced autosave — fires 900ms after the last dirty change. In WYSIWYG
  // mode keystrokes only flip the dirty state once per burst, so this arms a
  // single timer per burst; in Source mode every keystroke re-arms it.
  useEffect(() => {
    if (autosave !== "dirty") return;
    const t = window.setTimeout(() => void save(), 900);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autosave, mode, title, subtitle, body, coverImage, tags]);

  // Esc closes the settings panel.
  useEffect(() => {
    if (!showSettings) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowSettings(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSettings]);

  async function uploadCoverFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to upload a cover.");
        return;
      }
      const dot = file.name.lastIndexOf(".");
      const ext = dot === -1 ? "" : file.name.slice(dot).toLowerCase();
      const path = `${user.id}/${crypto.randomUUID()}${ext}`;
      const { error } = await supabase.storage
        .from("article-covers")
        .upload(path, file);
      if (error) {
        setError(error.message);
        return;
      }
      const { data } = supabase.storage
        .from("article-covers")
        .getPublicUrl(path);
      markDirty();
      setCoverImage(data.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  async function uploadCover(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    await uploadCoverFile(file);
  }

  function onCoverDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) void uploadCoverFile(file);
  }

  function remove() {
    const id = initial?.id ?? articleIdRef.current;
    if (!id || !window.confirm("Delete this article permanently?")) return;
    startTransition(async () => {
      const result = await deleteArticle(id);
      if (!result.ok) {
        setError(result.error ?? "Could not delete.");
        return;
      }
      router.push("/dashboard/articles");
      router.refresh();
    });
  }

  async function copySlug() {
    const slug = initial?.slug ?? createdSlug;
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
      showFlash("Slug copied.");
    } catch {
      // Clipboard unavailable (permissions) — ignore.
    }
  }

  const statusPill = (
    <span
      className={`!text-[10px] !uppercase !tracking-[0.2em] !rounded-full !border !px-2.5 !py-1 ${
        status === "published"
          ? "!text-emerald-300/90 !border-emerald-500/30 !bg-emerald-500/10"
          : "!text-amber-300/90 !border-amber-500/30 !bg-amber-500/10"
      }`}
    >
      {status}
    </span>
  );

  const autosaveIndicator =
    autosave === "saving" ? (
      <span className="!flex !items-center !gap-1.5 !text-[10px] !uppercase !tracking-[0.2em] !text-zinc-400">
        <motion.span
          className="!inline-block !h-1.5 !w-1.5 !rounded-full !bg-zinc-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        Saving…
      </span>
    ) : autosave === "saved" ? (
      <span className="!text-[10px] !uppercase !tracking-[0.2em] !text-emerald-400">
        ● Saved{lastSavedAt ? ` · ${formatRelative(lastSavedAt)}` : ""}
      </span>
    ) : autosave === "dirty" ? (
      <span className="!text-[10px] !uppercase !tracking-[0.2em] !text-amber-300/90">
        Unsaved changes
      </span>
    ) : null;

  const byline = (
    <div className="!flex !items-center !gap-2 !mt-6 !text-xs !text-zinc-400">
      <span className="!inline-flex !h-6 !w-6 !items-center !justify-center !rounded-full !bg-zinc-800 !text-[11px] !font-bold !uppercase !text-zinc-300">
        {(authorName || "?").charAt(0)}
      </span>
      <span>{authorName || "you"}</span>
    </div>
  );

  return (
    <div className="!max-w-7xl !mx-auto !px-4 md:!px-10 !py-8 !space-y-5">
      {/* Top action row */}
      <div className="!space-y-3">
        <div className="!flex !items-center !justify-between !gap-4 !flex-wrap">
          <div className="!flex !items-center !gap-3 !flex-wrap">
            {statusPill}
            {autosaveIndicator}
          </div>
          <div className="!flex !items-center !gap-3 !flex-wrap">
            <button
              type="button"
              onClick={() => {
                setPreviewBody(bodyDraftRef.current);
                setShowPreview(true);
              }}
              className={secondaryBtn}
            >
              Preview
            </button>
            <motion.button
              type="button"
              disabled={isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => startTransition(() => void save("published", true))}
              className={primaryBtn}
            >
              {status === "published" ? "Update" : "Continue"}
            </motion.button>
            <button
              type="button"
              onClick={() => {
                if (mode === "source") {
                  // Entering Write: snapshot the pristine (source) body so we
                  // can restore it if math sneaks in and gets escaped.
                  writeEntrySnapshot.current = bodyDraftRef.current;
                  setMode("write");
                  return;
                }
                // Leaving Write: if the WYSIWYG serializer escaped math into
                // the body, restore the pristine snapshot — never persist it.
                if (
                  /\$/.test(bodyDraftRef.current) &&
                  writeEntrySnapshot.current !== null
                ) {
                  bodyDraftRef.current = writeEntrySnapshot.current;
                  showFlash(
                    "Math detected in WYSIWYG — reverted to pre-WYSIWYG content. Type equations in Source mode."
                  );
                }
                writeEntrySnapshot.current = null;
                // Sync the source textarea from the live ref — WYSIWYG typing
                // never touched state, so this is what makes the draft appear.
                setBody(bodyDraftRef.current);
                setMode("source");
              }}
              disabled={hasMath && mode === "source"}
              title={
                hasMath && mode === "source"
                  ? "This article contains LaTeX — Source mode keeps equations intact."
                  : undefined
              }
              className="!text-zinc-400 hover:!text-white !text-sm !transition-colors disabled:!opacity-40 disabled:!cursor-not-allowed !cursor-pointer"
            >
              {mode === "write" ? "Source" : "Write"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => startTransition(() => void save(undefined, true))}
              className="!text-zinc-400 hover:!text-white !text-sm !transition-colors disabled:!opacity-50 !cursor-pointer"
            >
              Save draft
            </button>
          </div>
        </div>

        {/* Toolbar lives inside RichBody (drives TipTap directly) */}
      </div>

      {/* The paper */}
      <div className={canvasClass}>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            markDirty();
            setTitle(e.target.value);
          }}
          placeholder="Title"
          className="!w-full !bg-transparent !border-0 !outline-none !font-[Georgia,_'Times_New_Roman',_serif] !text-4xl md:!text-5xl !font-bold !tracking-tight !text-white !placeholder-zinc-600"
        />
        <input
          type="text"
          value={subtitle}
          onChange={(e) => {
            markDirty();
            setSubtitle(e.target.value);
          }}
          placeholder="Add a subtitle…"
          className="!w-full !bg-transparent !border-0 !outline-none !font-[Georgia,_'Times_New_Roman',_serif] !text-xl !text-zinc-400 !placeholder-zinc-600 !mt-3"
        />
        {byline}
        {mode === "write" ? (
          <RichBody
            initialMarkdown={bodyDraftRef.current}
            onChange={handleBodyChange}
          />
        ) : (
          <textarea
            value={body}
            onChange={(e) => {
              bodyDraftRef.current = e.target.value;
              setBody(e.target.value);
              markDirty();
            }}
            placeholder="Start writing…"
            className="!w-full !bg-transparent !border-0 !outline-none !resize-y !min-h-[52vh] !mt-6 !font-mono !text-sm !leading-relaxed !text-zinc-200 !placeholder-zinc-600"
          />
        )}
      </div>

      <p className="!text-xs !text-zinc-500">
        {hasMath && mode === "source"
          ? "LaTeX detected — editing in Source mode so equations stay intact."
          : "LaTeX ($...$ / $$...$$) must be written in Source mode. Cmd/Ctrl+B and Cmd/Ctrl+I for bold and italic."}
      </p>

      {/* Tags */}
      <div className={cardClass}>
        <p className={cardLabel}>Tags</p>
        <TagInput
          tags={tags}
          onChange={(next) => {
            markDirty();
            setTags(next);
          }}
        />
      </div>

      {/* Cover image */}
      <div className={cardClass}>
        <p className={cardLabel}>Cover image</p>
        <div
          onDragOver={(e) => {
            if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
          }}
          onDrop={onCoverDrop}
          className="!flex !items-start !gap-4 !flex-wrap"
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt="Cover preview"
              className="!h-24 !w-40 !rounded-xl !object-cover !border !border-zinc-800"
            />
          ) : (
            <div className="!h-24 !w-40 !rounded-xl !border !border-dashed !border-zinc-700 !flex !items-center !justify-center !text-zinc-600 !text-xs !text-center !px-2">
              Drop image here
            </div>
          )}
          <div className="!flex !flex-col !items-start !gap-3 !flex-1 !min-w-[220px]">
            <label
              className={`${secondaryBtn} !inline-flex !items-center !gap-2`}
            >
              <Upload size={16} />
              {uploading ? "Uploading…" : "Choose file"}
              <input
                type="file"
                accept="image/*"
                className="!hidden"
                disabled={uploading}
                onChange={uploadCover}
              />
            </label>
            {coverImage ? (
              <button
                type="button"
                onClick={() => {
                  markDirty();
                  setCoverImage("");
                }}
                className="!flex !items-center !gap-1.5 !text-sm !text-zinc-500 hover:!text-white !transition-colors !cursor-pointer"
              >
                <X size={14} /> Remove
              </button>
            ) : null}
            <input
              type="text"
              value={coverImage}
              onChange={(e) => {
                markDirty();
                setCoverImage(e.target.value);
              }}
              placeholder="…or paste an image URL"
              className="!w-full !bg-zinc-950 !text-zinc-200 !border !border-zinc-800 !rounded-xl !px-3.5 !py-2.5 !text-sm !outline-none focus:!border-white/40 !transition-colors !placeholder-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* Settings row */}
      <div className="!flex !items-center !justify-between !mt-6">
        <span className="!text-xs !text-zinc-600">
          {autosave === "saving"
            ? "Saving…"
            : autosave === "saved" && lastSavedAt
              ? `Last saved ${formatRelative(lastSavedAt)}`
              : autosave === "dirty"
                ? "Unsaved changes"
                : ""}
        </span>
        <button
          type="button"
          onClick={() => setShowSettings((s) => !s)}
          aria-label="Settings"
          title="Settings"
          className={`!p-2 !rounded-lg !transition-colors !cursor-pointer ${
            showSettings ? "!text-white" : "!text-zinc-500 hover:!text-white"
          }`}
        >
          <Settings size={16} />
        </button>
      </div>

      {showSettings ? (
        <div className="!rounded-3xl !border !border-zinc-800 !bg-zinc-900/50 !p-5 !space-y-3">
          <div className="!flex !items-center !gap-2 !flex-wrap">
            <span className="!text-xs !uppercase !tracking-wider !text-zinc-500">
              Slug
            </span>
            <code className="!font-mono !text-xs !text-zinc-500 !break-all">
              {initial?.slug ?? createdSlug ?? ""}
            </code>
            <button
              type="button"
              onClick={copySlug}
              aria-label="Copy slug"
              title="Copy slug"
              className="!text-zinc-500 hover:!text-white !p-1 !rounded !transition-colors !cursor-pointer"
            >
              <Copy size={14} />
            </button>
          </div>
          <div className="!flex !items-center !gap-3 !flex-wrap">
            {statusPill}
            <span className="!text-xs !text-zinc-500">
              {initial?.updated_at
                ? `Updated ${formatLong(initial.updated_at)}`
                : ""}
            </span>
          </div>
          {!isNewState ? (
            <div className="!pt-2 !border-t !border-zinc-800">
              <button
                type="button"
                onClick={remove}
                disabled={isPending}
                className="!text-sm !text-red-400 hover:!text-red-300 !transition-colors disabled:!opacity-50 !cursor-pointer"
              >
                Delete article
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="!text-sm !text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {flash ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="!text-sm !text-emerald-400"
        >
          {flash}
        </motion.p>
      ) : null}

      {/* Preview overlay */}
      {showPreview ? (
        <div className="!fixed !inset-0 !z-50 !bg-black/95 !overflow-y-auto">
          <div className="!sticky !top-0 !z-10 !border-b !border-zinc-800/80 !bg-black/80 !backdrop-blur">
            <div className="!max-w-3xl !mx-auto !flex !items-center !justify-between !px-4 md:!px-8 !py-3">
              <span className="!text-sm !font-bold !text-white">Preview</span>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                aria-label="Close preview"
                className="!rounded-lg !p-2 !text-zinc-400 hover:!text-white hover:!bg-zinc-800 !transition-colors !cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="!max-w-3xl !mx-auto !py-16 !px-4 md:!px-8">
            {title ? (
              <h1 className="!font-[Georgia,_'Times_New_Roman',_serif] !text-4xl md:!text-5xl !font-bold !tracking-tight !text-white">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="!font-[Georgia,_'Times_New_Roman',_serif] !text-xl !text-zinc-400 !mt-3">
                {subtitle}
              </p>
            ) : null}
            {byline}
            {coverImage ? (
              <img
                src={coverImage}
                alt=""
                className="!mt-8 !w-full !rounded-2xl !border !border-zinc-800 !object-cover"
              />
            ) : null}
            <div className="!mt-8">
              <Markdown>{previewBody}</Markdown>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
