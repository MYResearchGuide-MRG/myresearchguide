/* eslint-disable react-hooks/static-components */
"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from 'react';
import Image from 'next/image';
import NewNav from "@/components/NewNav";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

export default function Mission() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // TILE COMPONENT FOR THE MATHEMATICAL EQUATIONS BACKGROUND
  const ChalkboardTile = () => (
    <div className="!w-[1024px] !h-[768px] !flex-shrink-0 !overflow-hidden">
      <Image
        src="/equations.jpg" // Source image with math equations
        alt="math chalkboard equations"
        width={1024}
        height={768}
        className="!object-cover !opacity-50" // object-cover for tiling, low opacity
      />
    </div>
  );

  return (
    <>
      <NewNav />
      <div ref={containerRef} className="!relative !overflow-x-clip !overflow-y-visible !min-h-[70vh] md:!min-h-screen !flex !items-center !justify-center !bg-black !pt-4">

        {/* BACKGROUND LAYER WITH GRADIENT MASK FOR SEAMLESS BLENDING */}
        <motion.div
          style={
            prefersReducedMotion
              ? {
                  opacity: 0.85,
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                }
              : {
                  opacity: backgroundOpacity,
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                }
          }
          className="!absolute !inset-0 !z-0 !pointer-events-none"
        >
          <div className="!absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[250%] !transform !-rotate-12 !scale-125">
            <div className="!flex !w-max animate-marquee">
              {/* Replace original LogoGrid instances with tiled equation tiles for a packed marquee effect */}
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
            </div>
          </div>
        </motion.div>

        {/* BOTTOM VIGNETTE OVERLAY (Double protection for blending) */}
        <div className="!absolute !bottom-0 !left-0 !right-0 !h-64 !bg-gradient-to-t !from-black !to-transparent !z-[5]" />

        {/* CONTENT LAYER — padded + max-width so display type never clips at ~390px */}
        <div className="!relative !z-10 !w-full !max-w-full !flex !flex-col !items-center !justify-center !px-5 sm:!px-8">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }
            }
            className="!w-full !max-w-full"
          >
            <h1 className="!text-4xl sm:!text-5xl md:!text-[8rem] !max-w-full !font-regular !text-center !leading-[1.05] !tracking-tight">
              <span className="!text-spektr-cyan !block">
                About
              </span>
              <span className="!block !max-w-full !break-words bg-gradient-to-r from-stone-400 to-slate-300 bg-clip-text text-transparent">
                MYResearchGuide.
              </span>
            </h1>
            <div className="text-center !px-1">
              <i className="mt-2 !text-base sm:!text-xl !text-center !text-white/60 !break-words">
                [ Get to know more about our story and our team! ]
              </i>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
