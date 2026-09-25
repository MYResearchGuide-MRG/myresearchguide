"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AppWindow from "@/components/ui/AppWindow";
import { handbookGroups } from "@/data/handbook-preview";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

const allPages = handbookGroups.flatMap((g) => g.pages);

/**
 * Interactive recreation of the Notion handbook: click a page in the table of
 * contents to preview it, then jump to the real page.
 */
export default function HandbookPreview() {
  const reduceMotion = useHydrationSafeReducedMotion();
  const [activeId, setActiveId] = useState(allPages[0].id);
  const active = allPages.find((p) => p.id === activeId) ?? allPages[0];

  return (
    <AppWindow title="MYResearchGuide’s Research Handbook">
      {/* Banner — mirrors the Notion cover */}
      <div className="!relative !h-20 md:!h-28 !overflow-hidden !border-b !border-white/[0.06] !bg-black">
        <div
          aria-hidden
          className="!absolute !inset-0 !opacity-60"
          style={{
            background:
              "repeating-radial-gradient(ellipse at 18% 120%, rgba(255,255,255,0.10) 0 1px, transparent 1px 7px)",
          }}
        />
        <div className="!absolute !inset-0 !flex !flex-col !items-end !justify-center !px-5 md:!px-10">
          <span className="!text-white !font-bold !tracking-tighter !text-xl md:!text-4xl">
            MYResearchGuide.
          </span>
          <span className="!text-white/60 !italic !text-[10px] md:!text-xs">
            [ Start your Research Journey, with MYResearchGuide. ]
          </span>
        </div>
      </div>

      <div className="!flex !flex-col md:!flex-row md:!h-[440px]">
        {/* Table of contents — chip row on mobile, sidebar on desktop */}
        <nav
          aria-label="Handbook table of contents"
          className="!shrink-0 md:!w-64 !border-b md:!border-b-0 md:!border-r !border-white/[0.06] !bg-[#0e0e0f] md:!overflow-y-auto !py-3 md:!py-4"
        >
          {handbookGroups.map((group) => (
            <div key={group.label} className="md:!mb-4 !contents md:!block">
              <p className="!hidden md:!block !px-5 !mb-1.5 !text-[10px] !font-semibold !uppercase !tracking-[0.14em] !text-zinc-500">
                {group.label}
              </p>
              <ul className="!list-none !m-0 !p-0 !flex md:!block !gap-1.5 !overflow-x-auto md:!overflow-visible !px-3 md:!px-2 [scrollbar-width:none]">
                {group.pages.map((p) => {
                  const isActive = p.id === activeId;
                  return (
                    <li key={p.id} className="!shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveId(p.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`!flex !items-center !gap-2 !w-full !text-left !rounded-md !px-3 !py-1.5 !text-[13px] !whitespace-nowrap md:!whitespace-normal !transition-colors !duration-200 !border md:!border-0 ${
                          isActive
                            ? "!bg-white/10 !text-white !border-white/20"
                            : "!bg-transparent !text-zinc-400 hover:!bg-white/5 hover:!text-zinc-200 !border-white/10"
                        }`}
                      >
                        <span aria-hidden className="!w-4 !text-center !shrink-0">
                          {p.icon}
                        </span>
                        <span className="md:!truncate">{p.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Page preview */}
        <div className="!relative !flex-1 !min-h-[320px] !overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
              className="!h-full !overflow-y-auto !px-5 sm:!px-8 md:!px-12 !py-6 md:!py-10 !text-left"
            >
              <div className="!text-3xl md:!text-4xl !mb-3" aria-hidden>
                {active.icon}
              </div>
              <h3 className="!text-white !text-2xl md:!text-3xl !font-bold !tracking-tight !mb-4">
                {active.title}
              </h3>
              <p className="!text-zinc-300 !text-sm md:!text-base !leading-relaxed !max-w-2xl !mb-6">
                {active.intro}
              </p>
              <ul className="!list-none !m-0 !p-0 !space-y-2 !mb-8 !max-w-2xl">
                {active.points.map((pt) => (
                  <li
                    key={pt}
                    className="!flex !gap-3 !items-start !rounded-lg !bg-white/[0.04] !border !border-white/[0.06] !px-4 !py-2.5 !text-sm !text-zinc-300"
                  >
                    <span aria-hidden className="!mt-[7px] !h-1.5 !w-1.5 !rounded-full !bg-zinc-400 !shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="!inline-flex !items-center !gap-1.5 !rounded-full !bg-white !text-black !px-4 !py-2 !text-sm !font-semibold !no-underline hover:!bg-zinc-200 !transition-colors"
              >
                Open in handbook
                <ArrowUpRight size={16} aria-hidden />
              </a>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </AppWindow>
  );
}
