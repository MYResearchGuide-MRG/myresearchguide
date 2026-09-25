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
        className="!relative !z-0 !w-full !max-w-6xl !mx-auto !px-3 sm:!px-6 !mt-12 md:!mt-20"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }
        }
      >
        <FloatingTilt>
          <HandbookPreview />
        </FloatingTilt>
      </motion.div>
    </div>
  );
}
