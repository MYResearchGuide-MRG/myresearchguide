"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

export function ScrollProgress() {
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) {
    return (
      <div
        className="!fixed !top-0 !left-0 !right-0 !h-[2px] !z-[10001] !origin-left !bg-gradient-to-r !from-stone-400 !to-slate-300 !pointer-events-none"
        style={{ transform: "scaleX(0)" }}
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      className="!fixed !top-0 !left-0 !right-0 !h-[2px] !z-[10001] !origin-left !bg-gradient-to-r !from-stone-400 !to-slate-300 !pointer-events-none"
      style={{ scaleX, transformOrigin: "0% 50%" }}
      aria-hidden
    />
  );
}

export default ScrollProgress;
