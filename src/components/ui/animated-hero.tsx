"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { HANDBOOK_URL } from "@/data/handbook-preview";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

const MYSSP_URL = "https://myssp.myresearchguide.org";

function Hero() {
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  return (
    <div className="!w-full !block">
      <div className="container !mx-auto !px-4 sm:!px-6">
        <div className="!flex !flex-col !items-center !w-full">
          <h1 className="!flex !flex-col !items-center !gap-2 !text-3xl sm:!text-4xl md:!text-[3.5rem] lg:!text-[4.25rem] xl:!text-[4.75rem] !max-w-5xl !text-center !px-1">
            <span className="!block !leading-[1.05] !text-spektr-cyan">
              Malaysia&apos;s #1 Guide to
            </span>
            <span className="!block !font-semibold !whitespace-nowrap !leading-[1.05] bg-gradient-to-r from-stone-400 to-slate-300 bg-clip-text text-transparent md:!text-[4rem] lg:!text-[4.75rem] xl:!text-[5.25rem]">
              Science Research
            </span>
          </h1>

          <motion.p
            className="!text-base sm:!text-lg md:!text-xl !leading-relaxed !tracking-tight !text-muted-foreground !max-w-2xl !text-center !mx-auto !mt-5 !px-2"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }
            }
          >
            MYResearchGuide is a free, beginner-friendly platform that helps
            Malaysian students start and grow in science research with practical
            steps, researcher insight, and a community built by
            Malaysians for Malaysians.
          </motion.p>

          <motion.div
            className="!mt-7 !flex !flex-col sm:!flex-row !items-stretch sm:!items-center !justify-center !gap-3 !w-full sm:!w-auto !px-2"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }
            }
          >
            <a
              href={MYSSP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="!inline-flex !items-center !justify-center !gap-2 !rounded-lg !bg-white !text-black !px-6 !py-3 !text-sm sm:!text-base !font-semibold !text-center !no-underline hover:!bg-zinc-200 !transition-colors"
            >
              Malaysia Science Scholar&apos;s Programme (MYSSP)
              <ArrowUpRight size={18} aria-hidden />
            </a>
            <a
              href={HANDBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="!inline-flex !items-center !justify-center !gap-2 !rounded-lg !border !border-white/25 !bg-white/[0.04] !text-white !px-6 !py-3 !text-sm sm:!text-base !font-semibold !no-underline hover:!bg-white/10 hover:!border-white/40 !transition-colors"
            >
              Our Research Handbook
              <ArrowUpRight size={18} aria-hidden />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
