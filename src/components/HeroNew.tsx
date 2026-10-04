"use client";
import React from "react";
import { motion } from "framer-motion";
import { Hero } from "@/components/ui/animated-hero";
import HandbookPreview from "@/components/HandbookPreview";
import FloatingTilt from "@/components/ui/FloatingTilt";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

export default function HeroScrollDemo() {
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  return (
    <div className="!flex !flex-col !overflow-x-clip !overflow-y-visible !pb-8 sm:!pb-12 md:!pb-20 !relative !z-0">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }
        }
        className="!relative !z-20 !block !w-full !pt-10 md:!pt-20"
      >
        <Hero />
      </motion.div>

      <motion.div
        className="!relative !isolate !z-0 !w-full !max-w-[58rem] !mx-auto !px-3 sm:!px-6 !mt-10 sm:!mt-12 md:!mt-14"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }
        }
      >
        <motion.div
          aria-hidden
          className="!pointer-events-none !absolute !z-0 !inset-x-0 !-top-8 !-bottom-16 !rounded-[3rem] !bg-[radial-gradient(ellipse_at_center,rgba(65,120,255,0.60)_0%,rgba(112,75,255,0.34)_42%,transparent_74%)] !blur-[72px]"
          animate={
            prefersReducedMotion
              ? undefined
              : { opacity: [0.62, 1, 0.62], scale: [0.98, 1.02, 0.98] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 7, ease: "easeInOut", repeat: Infinity }
          }
        />
        <div className="!relative !z-10">
          <FloatingTilt>
            <HandbookPreview />
          </FloatingTilt>
        </div>
      </motion.div>
    </div>
  );
}
