"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lock, MousePointerClick } from "lucide-react";
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
    <AppWindow url="myresearchguide.notion.site">
      <div className="!flex !flex-col md:!flex-row md:!h-[600px]">
        {/* Table of contents — full-height sidebar on desktop, chip row on mobile */}
        <nav
          aria-label="Handbook table of contents"
          className="!shrink-0 md:!w-64 !border-b md:!border-b-0 md:!border-r !border-white/[0.06] !bg-[#141415] md:!overflow-y-auto !py-3 md:!py-5"
        >
          <div className="!hidden md:!flex !items-center !gap-2 !px-5 !mb-4">
            <Image
              src="/MRG2W.png"
              alt=""
              aria-hidden
              width={120}
              height={40}
              className="!h-5 !w-auto !object-contain"
            />
          </div>
          <p className="!flex !items-center !gap-1.5 !mx-3 md:!mx-4 !mb-3 md:!mb-5 !rounded-md !bg-white/[0.05] !px-2.5 !py-1.5 !text-[11px] !text-zinc-400">
            <MousePointerClick size={13} aria-hidden className="!shrink-0" />
            Click a page to preview it
          </p>
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

        {/* Page — Notion-style cover banner, the page intro, then a locked teaser */}
        <div className="!relative !flex-1 !min-w-0 !min-h-[520px] md:!min-h-0 !flex !flex-col !overflow-hidden !bg-[#191919]">
          <Image
            src="/handbook-banner.jpg"
            alt="MYResearchGuide — Start your Research Journey, with MYResearchGuide."
            width={1720}
            height={406}
            priority
            sizes="(max-width: 768px) 100vw, 900px"
            className="!block !shrink-0 !w-full !h-28 sm:!h-36 md:!h-44 !object-cover !object-[62%_50%]"
            draggable={false}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
              className="!flex-1 !min-h-0 !flex !flex-col !px-5 sm:!px-8 md:!px-12 !text-left"
            >
              <div
                className="!-mt-7 md:!-mt-9 !mb-3 !text-5xl md:!text-6xl !leading-none !relative"
                aria-hidden
              >
                {active.icon}
              </div>
              <h3 className="!text-white !text-2xl md:!text-3xl !font-bold !tracking-tight !mb-3">
                {active.title}
              </h3>
              <p className="!text-zinc-300 !text-sm md:!text-base !leading-relaxed !max-w-2xl !mb-4">
                {active.intro}
              </p>

              {/* Locked teaser: the rest of the page, blurred, behind a CTA */}
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="!group !relative !flex-1 !min-h-[190px] !block !no-underline !-mx-5 sm:!-mx-8 md:!-mx-12 !px-5 sm:!px-8 md:!px-12 !overflow-hidden"
                aria-label={`Preview only. Open “${active.title}” in the handbook`}
              >
                <div
                  aria-hidden
                  className="!select-none !pointer-events-none !max-w-2xl !pt-1 !blur-[5px] !opacity-70"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, #000 0%, #000 35%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, #000 0%, #000 35%, transparent 100%)",
                  }}
                >
                  {active.points.map((pt) => (
                    <div key={pt} className="!mb-5">
                      <p className="!text-zinc-200 !font-semibold !text-base md:!text-lg !mb-2">
                        {pt}
                      </p>
                      <div className="!space-y-2">
                        <div className="!h-2.5 !w-full !rounded-full !bg-zinc-600" />
                        <div className="!h-2.5 !w-11/12 !rounded-full !bg-zinc-600" />
                        <div className="!h-2.5 !w-2/3 !rounded-full !bg-zinc-600" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="!absolute !inset-0 !flex !items-center !justify-center !px-4">
                  <div className="!flex !flex-col !items-center !text-center !gap-2 !rounded-2xl !border !border-white/10 !bg-[#111]/80 !backdrop-blur-md !px-6 !py-5 !shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] !transition-transform !duration-300 group-hover:!-translate-y-0.5">
                    <span className="!flex !h-9 !w-9 !items-center !justify-center !rounded-full !bg-white/10 !text-white">
                      <Lock size={16} aria-hidden />
                    </span>
                    <p className="!m-0 !text-sm !font-semibold !text-white">
                      This is just a preview
                    </p>
                    <p className="!m-0 !text-xs !text-zinc-400 !max-w-[16rem]">
                      Read the full page, free, in the MYResearchGuide handbook.
                    </p>
                    <span className="!mt-1 !inline-flex !items-center !gap-1.5 !rounded-full !bg-white !text-black !px-4 !py-2 !text-sm !font-semibold group-hover:!bg-zinc-200 !transition-colors">
                      Open full page
                      <ArrowUpRight size={16} aria-hidden />
                    </span>
                  </div>
                </div>
              </a>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </AppWindow>
  );
}
