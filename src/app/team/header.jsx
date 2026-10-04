"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from 'react';
import NeuronBackdrop from "@/components/ui/NeuronBackdrop";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

export default function Header() {
  const headerRef = useRef(null);
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div
      ref={headerRef}
      className="!relative !overflow-hidden !min-h-screen !flex !items-center !justify-center !bg-black"
    >

      <motion.div
        style={{ opacity: prefersReducedMotion ? 1 : backgroundOpacity }}
        className="!absolute !inset-0 !z-0 !pointer-events-none"
      >
        <NeuronBackdrop />
      </motion.div>

      <div className="!absolute !bottom-0 !left-0 !right-0 !h-64 !bg-gradient-to-t !from-black !to-transparent !z-[5]" />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }
        }
        className="!relative !z-10 !w-full !px-5 sm:!px-8"
      >
        <h1 className="!text-4xl sm:!text-5xl md:!text-[5rem] !font-regular !text-center !leading-[1.05] !tracking-tight">
          <span className="!text-spektr-cyan !block">About</span>
          <span className="!block !break-words !bg-gradient-to-r !from-stone-400 !to-slate-300 !bg-clip-text !text-transparent">
            MYResearchGuide.
          </span>
        </h1>
        <div className="!mt-3 !text-center !px-1">
          <i className="!text-base sm:!text-xl !text-white/60 !break-words">
            [ Get to know more about our story and our team! ]
          </i>
        </div>
      </motion.div>
    </div>
  );
}
