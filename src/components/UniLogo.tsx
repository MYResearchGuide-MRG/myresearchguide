/* eslint-disable @next/next/no-img-element */
import { uniLogo, uniFit, uniBg, uniShort } from "@/data/universities";

// A single university logo rendered in a circular badge. Uses the per-uni fit
// (contain/cover) and background colour so no square outline shows inside the
// circle. `ring` draws a separating outline (used when logos overlap in a stack).
export default function UniLogo({
  name,
  size = 32,
  ring,
  className = "",
}: {
  name: string;
  size?: number;
  ring?: string; // ring colour, e.g. "#18181b"
  className?: string;
}) {
  const src = uniLogo(name);
  if (!src) return null;
  const cover = uniFit(name) === "cover";
  const pad = cover ? 0 : Math.max(2, Math.round(size * 0.14));

  return (
    <span
      title={name}
      className={`!inline-flex !items-center !justify-center !rounded-full !overflow-hidden !shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: uniBg(name),
        boxShadow: ring ? `0 0 0 2px ${ring}` : undefined,
      }}
    >
      <img
        src={src}
        alt={uniShort(name)}
        className={`!w-full !h-full ${cover ? "!object-cover" : "!object-contain"}`}
        style={{ padding: pad }}
      />
    </span>
  );
}
