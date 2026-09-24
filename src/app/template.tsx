"use client";

import { motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

/**
 * App Router template: short fade on every route change.
 * Opacity-only — no translate transforms, so position:sticky / fixed
 * descendants (navbar) keep working across all pages.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
