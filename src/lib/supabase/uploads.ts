import type { SupabaseClient } from "@supabase/supabase-js";

// Builds a sanitized storage object path for a user upload.
//
// The returned value is a *semantic identifier* that encodes the bucket:
//   `${bucket}/${userId}/${timestamp}-${safeFilename}`
// Storage object names *inside* a bucket must NOT carry the bucket prefix —
// migration 0003's owner RLS checks `(storage.foldername(name))[1] = auth.uid()`
// — so callers strip the leading `${bucket}/` before `.upload()` / `.remove()`.
export function buildStoragePath(
  bucket: string,
  userId: string,
  filename: string
): string {
  const safe = filename.replace(/[^a-z0-9.-]+/gi, "-").toLowerCase();
  return `${bucket}/${userId}/${Date.now()}-${safe}`;
}

export type OwnershipCheck =
  | { ok: true; storagePath: string | null }
  | { ok: false; error: string };

// Validates a profile image value against storage ownership rules.
// - Non-storage URLs (or empty values) are allowed as free-form fallbacks.
// - Public storage URLs must target `bucket` AND start with the caller's uid,
//   and the object must still exist.
// Returns the bucket-relative object path on success so callers can
// delete/replace the object later.
export async function assertOwnedStorageUrl(
  supabase: SupabaseClient,
  url: string,
  bucket: string,
  uid: string
): Promise<OwnershipCheck> {
  const withoutQuery = (url ?? "").split("?")[0];
  const marker = "/storage/v1/object/public/";
  const markerIndex = withoutQuery.indexOf(marker);
  if (markerIndex < 0) {
    // Not a storage URL — free-form fallback allowed.
    return { ok: true, storagePath: null };
  }

  const rest = withoutQuery.slice(markerIndex + marker.length);
  const slash = rest.indexOf("/");
  if (slash < 0) return { ok: false, error: "Invalid storage URL." };

  const urlBucket = rest.slice(0, slash);
  const path = rest.slice(slash + 1);

  if (urlBucket !== bucket) {
    return { ok: false, error: `Image URLs must live in the "${bucket}" bucket.` };
  }
  if (path.split("/")[0] !== uid) {
    return { ok: false, error: "That file does not belong to your account." };
  }

  const { error } = await supabase.storage.from(bucket).info(path);
  if (error) return { ok: false, error: error.message };

  return { ok: true, storagePath: path };
}
