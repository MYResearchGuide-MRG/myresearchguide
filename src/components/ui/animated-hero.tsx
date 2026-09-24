"use client";

import { motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

const HANDBOOK_URL =
  "https://myresearchguide.notion.site/MYResearchGuide-2ef8941036278000abe7de2f682a4414";

function Hero() {
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  return (
    <div className="!w-full !block">
      <div className="container !mx-auto !px-4 sm:!px-6">
        <div className="!flex !gap-6 md:!gap-8 !items-center !justify-center !flex-col">
          <div>
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 bg-black items-center">
              {/* Handbook CTA — static pill, no word animation */}
              <motion.div
                className="
          !pointer-events-auto
          cursor-pointer
          !select-none
          !relative
          !px-6
          sm:!px-8
          !py-3
          !rounded-full
          !border
          !border-white/20
          !bg-white/10
          !backdrop-blur-md
          !text-white
          !font-semibold
          !mt-6
          md:!mt-0
          !text-sm
          sm:!text-base
          md:!text-lg
          !shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.4),0_10px_20px_rgba(0,0,0,0.5)]
          !overflow-hidden
          !max-w-[min(100%,22rem)]
          sm:!max-w-none
          !text-center
        "
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        boxShadow: [
                          "inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.5)",
                          "inset 0 1px 1px rgba(255,255,255,0.45), inset 0 -1px 1px rgba(0,0,0,0.4), 0 10px 28px rgba(255,255,255,0.12)",
                          "inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.5)",
                        ],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              >
                <a
                  href={HANDBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!text-white !no-underline !relative !z-10"
                >
                  <div className="!absolute !bottom-0 !left-1/2 !-translate-x-1/2 !w-3/4 !h-[1px] !bg-gradient-to-r !from-transparent !via-white/40 !to-transparent" />
                  Click Here to Open the Research Handbook
                </a>
                {!prefersReducedMotion && (
                  <motion.span
                    className="!pointer-events-none !absolute !inset-y-0 !left-0 !w-1/3 !bg-gradient-to-r !from-transparent !via-white/20 !to-transparent"
                    initial={{ x: "-120%", opacity: 0 }}
                    animate={{ x: "320%", opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 0.6,
                    }}
                    aria-hidden
                  />
                )}
              </motion.div>
            </div>
          </div>
          <div className="!flex !flex-col !items-center !w-full">
            <h1 className="!text-3xl sm:!text-4xl md:!text-5xl lg:!text-[5rem] !max-w-none !text-center !leading-tight !px-1">
              <span className="!text-spektr-cyan">
                Malaysia&apos;s #1 Guide to{" "}
              </span>
              <span className="!font-semibold !whitespace-nowrap bg-gradient-to-r from-stone-400 to-slate-300 bg-clip-text text-transparent md:!text-[5.5rem] lg:!text-[6rem]">
                Science Research
              </span>
            </h1>

            <motion.p
              className="!text-base sm:!text-lg md:!text-xl !leading-relaxed !tracking-tight !text-muted-foreground !max-w-2xl !text-center !mx-auto !mt-4 !px-2"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }
              }
            >
              MYResearchGuide is a free, beginner-friendly platform that helps
              Malaysian students start and grow in science research — with
              practical steps, researcher insight, and a community built by
              Malaysians for Malaysians.
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
