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

      <div className="!absolute !bottom-0 !left-0 !right-0 !h-32 !bg-gradient-to-t !from-black !to-transparent !z-[5]" />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.55, ease: "easeOut" }
        }
        className="!relative !z-10 !text-center !px-6"
      >
        <p className="!text-slate-400 !uppercase !tracking-widest !text-sm !mb-4">
          About Us
        </p>
        <h1 className="!text-4xl md:!text-8xl !font-bold !tracking-tighter !leading-tight !bg-gradient-to-r !from-stone-400 !to-slate-300 !bg-clip-text !text-transparent">
          MYResearchGuide
        </h1>
        <p className="!text-slate-400 !mt-6 !text-base md:!text-lg !max-w-xl !mx-auto !leading-relaxed">
          Get to know more about our story and the team behind MYResearchGuide.
        </p>
      </motion.div>
    </div>
  );
}
