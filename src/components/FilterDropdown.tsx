/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export type DropdownOption = {
  value: string;
  label: string;
  logo?: string | null; // image path (rendered in a tile)
  logoFit?: "contain" | "cover";
  logoBg?: string;
};

export default function FilterDropdown({
  value,
  onChange,
  options,
  icon,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: DropdownOption[];
  icon?: React.ReactNode;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={ref} className="!relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="!flex !items-center !gap-2 !w-full lg:!w-56 !bg-zinc-900 !text-zinc-200 !border !border-zinc-800 !rounded-xl !px-3.5 !py-3 !text-sm !outline-none hover:!border-zinc-600 focus:!border-white/40 !transition-colors"
      >
        {icon ? <span className="!text-zinc-500 !shrink-0">{icon}</span> : null}
        {selected?.logo ? (
          <LogoTile
            src={selected.logo}
            size={18}
            fit={selected.logoFit}
            bg={selected.logoBg}
          />
        ) : null}
        <span className="!truncate !flex-1 !text-left">{selected?.label}</span>
        <ChevronDown
          size={16}
          className={`!text-zinc-500 !shrink-0 !transition-transform ${
            open ? "!rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="!absolute !z-50 !mt-2 !w-full !max-h-72 !overflow-auto !bg-zinc-900 !border !border-zinc-800 !rounded-xl !p-1.5 !shadow-2xl !shadow-black/60"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`!flex !items-center !gap-2.5 !w-full !text-left !px-2.5 !py-2 !rounded-lg !text-sm !transition-colors ${
                    active
                      ? "!bg-zinc-800 !text-white"
                      : "!text-zinc-300 hover:!bg-zinc-800/70"
                  }`}
                >
                  {o.logo ? (
                    <LogoTile src={o.logo} size={20} fit={o.logoFit} bg={o.logoBg} />
                  ) : (
                    <span className="!w-5 !h-5 !shrink-0" />
                  )}
                  <span className="!truncate !flex-1">{o.label}</span>
                  {active ? (
                    <Check size={15} className="!text-zinc-400 !shrink-0" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function LogoTile({
  src,
  size,
  fit = "contain",
  bg = "#ffffff",
}: {
  src: string;
  size: number;
  fit?: "contain" | "cover";
  bg?: string;
}) {
  const cover = fit === "cover";
  return (
    <span
      className="!shrink-0 !inline-flex !items-center !justify-center !rounded-full !overflow-hidden"
      style={{ width: size, height: size, background: bg }}
    >
      <img
        src={src}
        alt=""
        className={`!w-full !h-full ${cover ? "!object-cover" : "!object-contain"}`}
        style={{ padding: cover ? 0 : Math.max(1, Math.round(size * 0.12)) }}
      />
    </span>
  );
}
