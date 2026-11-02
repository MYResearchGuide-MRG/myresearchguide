"use client";
import React from "react";
import { motion } from "framer-motion";
import { Hero } from "@/components/ui/animated-hero";
import HandbookPreview from "@/components/HandbookPreview";
import FloatingTilt from "@/components/ui/FloatingTilt";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";
import { GraphicsToggle, ResearchDots } from "./ResearchGraphics";
import graphics from "./ResearchGraphics.module.css";

export default function HeroScrollDemo() {
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  return (
    <div className="!flex !flex-col !overflow-x-clip !overflow-y-visible !pb-8 sm:!pb-12 md:!pb-20 !relative !z-0">
      <div className={graphics.heroIntro}>
        <ResearchDots variant="orbits" className={graphics.heroDots} />
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }
          }
          className={graphics.heroCopy}
        >
          <Hero />
        </motion.div>
        <GraphicsToggle />
      </div>

      <div className={graphics.previewStage}>
        <ResearchDots variant="wave" className={graphics.previewWave} />
        <motion.div
          className={graphics.previewInner}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }
          }
        >
          <div className="!relative !z-10">
            <FloatingTilt>
              <HandbookPreview />
            </FloatingTilt>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
