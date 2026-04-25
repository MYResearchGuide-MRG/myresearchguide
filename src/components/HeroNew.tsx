"use client";
import { ContainerScroll } from "./ui/ScrollAnimation";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Hero } from "@/components/ui/animated-hero";

export default function HeroScrollDemo() {
  return (
    <div className="!flex !flex-col !overflow-hidden !pb-20 !relative !z-0">
      <ContainerScroll
        titleComponent={
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 1.2,
              }}
              // FIX 2: Ensure the title container doesn't have a fixed height 
              // that collapses, causing the image to slide over it.
              className="!relative !z-20 !block !w-full"
            >
              <div className="!block">
                <Hero />
              </div>
            </motion.div>
          </>
        }
      >
        <Image
          src="/heroo.png"
          alt="hero"
          height={720}
          width={1400}
          // FIX 3: Added !relative and !z-0 to ensure the image stays 
          // inside the "Card" layer and doesn't pop out.
          className="!mx-auto !rounded-2xl !object-cover !h-full !object-left-top !relative !z-0"
          draggable={false}
          priority // Added priority since this is a hero image
        />
      </ContainerScroll>
    </div>
  );
}
