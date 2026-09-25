"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

// Word whose opacity is driven by scroll progress (teleprompter reveal)
function RevealWord({ children, progress, range, staticOpacity }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span
      style={{ opacity: staticOpacity ?? opacity }}
      className="!mr-[0.3em] !inline-block"
    >
      {children}
    </motion.span>
  );
}

// Paragraph that reveals word-by-word as it scrolls through the viewport
function ScrollReveal({ text, className = "" }) {
  const container = useRef(null);
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <p ref={container} className={`!flex !flex-wrap !justify-center ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <RevealWord
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            staticOpacity={prefersReducedMotion ? 1 : undefined}
          >
            {word}
          </RevealWord>
        );
      })}
    </p>
  );
}

export default function Mission() {
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  return (
    <section className="min-h-[500px]">
      <div className="gap-6 !m-10 md:m-0">
        <div>
          <div className="!relative !z-10 !w-full !flex !flex-col !items-center !justify-center">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
              }
              className="md:text-left"
            >
              <h1 className="text-center !text-3xl md:!text-6xl !font-bold ">
                <div className="bg-gradient-to-r from-stone-400 to-slate-300 bg-clip-text text-transparent">
                  © {new Date().getFullYear()} MYResearchGuide. All rights
                  reserved.
                </div>
              </h1>
            </motion.div>
          </div>

          <section className="!relative !py-20 !px-6 !overflow-hidden">
            {/* Consolidated About block — scroll-driven teleprompter reveal */}
            <div className="!max-w-4xl !mx-auto !relative !z-0 !text-center">
              <ScrollReveal
                text="MYResearchGuide (termed MRG) was founded in 2026 and is a not-for-profit organisation crafted in collaboration with Malaysian researchers from top institutions around the world. Our mission is to make science research accessible towards all Malaysian youth, and through curated initiatives are dedicated to bridging the gap between curiosity and opportunity."
                className="!text-2xl sm:!text-3xl md:!text-4xl !font-semibold !leading-[1.35] !tracking-tight !text-white"
              />
            </div>

          </section>
        </div>
      </div>
    </section>
  );
}
