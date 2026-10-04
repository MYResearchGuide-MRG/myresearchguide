"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Hero } from "@/components/ui/animated-hero";
import HandbookPreview from "@/components/HandbookPreview";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

export default function HeroScrollDemo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  const previewScaleRaw = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    [0.78, 1, 1.04],
  );
  const previewYRaw = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    [120, -120, -190],
  );
  const previewScale = useSpring(previewScaleRaw, {
    stiffness: 110,
    damping: 24,
    mass: 0.35,
  });
  const previewY = useSpring(previewYRaw, {
    stiffness: 110,
    damping: 24,
    mass: 0.35,
  });
  const previewOpacity = useTransform(scrollYProgress, [0, 0.12], [0.72, 1]);
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.42],
    [1, 0.58, 0.06],
  );
  const copyY = useTransform(scrollYProgress, [0, 0.5], [0, -120]);
  const copyScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.94]);
  const bottomFadeOpacity = useTransform(
    scrollYProgress,
    [0.72, 1],
    [0, 0.72],
  );

  if (prefersReducedMotion) {
    return (
      <section className="!relative !z-0 !overflow-x-clip !pb-8 sm:!pb-12 md:!pb-20">
        <div className="!w-full !pt-10 md:!pt-20">
          <Hero />
        </div>
        <div className="!relative !w-full !max-w-7xl !mx-auto !px-3 sm:!px-6 !mt-12 md:!mt-20">
          <HandbookPreview />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={stageRef}
      className="!relative !z-0 !h-[165svh] sm:!h-[175svh] md:!h-[190svh] !overflow-visible"
    >
      <div className="!sticky !top-0 !h-[100svh] !min-h-[680px] md:!min-h-[760px] !overflow-hidden">
        <div
          aria-hidden
          className="!absolute !inset-0 !pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 72%, rgba(35,49,71,0.32), transparent 72%), radial-gradient(45% 40% at 88% 18%, rgba(62,75,100,0.16), transparent 72%)",
          }}
        />

        <motion.div
          style={{ opacity: copyOpacity, y: copyY, scale: copyScale }}
          className="!absolute !inset-x-0 !top-0 !z-10 !w-full !pt-10 md:!pt-20 !origin-top"
        >
          <Hero />
        </motion.div>

        <motion.div
          style={{
            opacity: previewOpacity,
            scale: previewScale,
            y: previewY,
            transformOrigin: "top center",
          }}
          className="!absolute !inset-x-0 !top-[48%] sm:!top-[50%] md:!top-[51%] !z-20 !w-full !max-w-7xl !mx-auto !px-3 sm:!px-6 !will-change-transform"
        >
          <HandbookPreview />
        </motion.div>

        <motion.div
          aria-hidden
          style={{ opacity: bottomFadeOpacity }}
          className="!pointer-events-none !absolute !inset-x-0 !bottom-0 !z-30 !h-28 !bg-gradient-to-t !from-black !to-transparent"
        />
      </div>
    </section>
  );
}
