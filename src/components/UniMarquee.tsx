/* eslint-disable @next/next/no-img-element */
"use client";

import { uniLogo, uniShort } from "@/data/universities";
import UniLogo from "@/components/UniLogo";

// Subtle auto-scrolling strip of the university logos represented in the
// directory. Reuses the `.animate-marquee` keyframe from globals.css (it
// translates the track by -50%, so we render the list twice for a seamless loop).
export default function UniMarquee({
  names,
  onSelect,
  activeName,
}: {
  names: string[];
  onSelect?: (name: string) => void;
  activeName?: string;
}) {
  const items = names
    .map((n) => ({ name: n, logo: uniLogo(n) }))
    .filter((x) => x.logo);

  if (items.length === 0) return null;

  const track = [...items, ...items];

  return (
    <div
      className="!relative !w-full !overflow-hidden !py-2"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="!flex !w-max animate-marquee !gap-3">
        {track.map((it, i) => {
          const active = activeName === it.name;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect?.(it.name)}
              aria-label={`Filter by ${uniShort(it.name)}`}
              className={`!flex !items-center !gap-2.5 !border !rounded-full !pl-1.5 !pr-4 !py-1.5 !shrink-0 !cursor-pointer !transition-all ${
                active
                  ? "!bg-white/10 !border-white/40 !opacity-100"
                  : "!bg-zinc-900/60 !border-zinc-800/80 !opacity-70 hover:!opacity-100 hover:!border-zinc-600"
              }`}
            >
              <UniLogo name={it.name} size={32} />
              <span
                className={`!text-sm !font-medium !whitespace-nowrap ${
                  active ? "!text-white" : "!text-zinc-400"
                }`}
              >
                {uniShort(it.name)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
