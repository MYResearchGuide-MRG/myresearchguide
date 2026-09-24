"use client";
import { ContainerScroll } from "./ui/ScrollAnimation";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Hero } from "@/components/ui/animated-hero";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

export default function HeroScrollDemo() {
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  return (
    <div className="!flex !flex-col !overflow-x-clip !overflow-y-visible !pb-8 sm:!pb-12 md:!pb-20 !relative !z-0">
      <ContainerScroll
        titleComponent={
          <>
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.08,
                    }
              }
              className="!relative !z-20 !block !w-full"
            >
              <div className="!block">
                <Hero />
              </div>
            </motion.div>
          </>
        }
      >
        <motion.div
          className="!h-full !w-full !relative !z-0"
          initial={prefersReducedMotion ? false : { opacity: 0.92 }}
          animate={{ opacity: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 1.2, ease: "easeOut", delay: 0.4 }
          }
        >
          <Image
            src="/heroo.png"
            alt="MYResearchGuide science research handbook preview"
            height={720}
            width={1400}
            className="!mx-auto !rounded-xl md:!rounded-2xl !object-cover !object-left-top !relative !z-0 !w-full !h-auto md:!h-full"
            draggable={false}
            priority
            sizes="(max-width: 768px) 100vw, 1024px"
          />
        </motion.div>
      </ContainerScroll>
    </div>
  );
}
