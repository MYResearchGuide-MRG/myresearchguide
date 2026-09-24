"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buildStoragePath } from "@/lib/supabase/uploads";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Matches public storage URLs: …/storage/v1/object/public/<bucket>/<path>
const storageUrlRe = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;

export default function UploadControl({
  bucket,
  onUploaded,
  label = "Choose file",
}: {
  bucket: string;
  onUploaded: (publicUrl: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Public URL of the last file this control uploaded, so a replacement
  // upload can remove the orphaned object (same bucket only).
  const lastUrlRef = useRef<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);

    if (file.size > MAX_SIZE) {
      setError("Image must be under 5 MB.");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in to upload.");
      return;
    }

    setBusy(true);
    try {
      const semanticPath = buildStoragePath(bucket, user.id, file.name);
      // Object names inside a bucket must start with the owner's uid
      // (migration 0003 owner RLS); the bucket prefix is metadata only.
      const objectPath = semanticPath.slice(bucket.length + 1);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(objectPath, file, { upsert: false });
      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(objectPath);

      // Best-effort cleanup of the previous file this control uploaded.
      const previous = lastUrlRef.current;
      if (previous) {
        const match = previous.match(storageUrlRe);
        if (match && match[1] === bucket) {
          await supabase.storage.from(bucket).remove([match[2]]);
        }
      }
      lastUrlRef.current = publicUrlData.publicUrl;

      setFilename(file.name);
      onUploaded(publicUrlData.publicUrl);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="!sr-only"
        onChange={handleChange}
      />
      <div className="!flex !items-center !gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="!border !border-zinc-700 !text-zinc-200 !rounded-xl !px-5 !py-2.5 !text-sm !font-bold hover:!border-zinc-500 !transition-colors disabled:!opacity-50 !cursor-pointer"
        >
          <Upload size={16} className="!mr-2 !inline" />
          {busy ? "Uploading…" : label}
        </button>
        {filename ? (
          <span className="!text-xs !text-zinc-500 !truncate">{filename}</span>
        ) : null}
      </div>
      {error ? <p className="!text-xs !text-red-400 !mt-2">{error}</p> : null}
    </div>
  );
}
