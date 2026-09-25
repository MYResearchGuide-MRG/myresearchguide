/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

const logos = [
  { name: "Harvard", src: "/carousel/Harvard.webp" },
  { name: "MIT", src: "/carousel/MIT.webp" },
  { name: "Imperial", src: "/carousel/Imperial.webp" },
  { name: "NTU", src: "/carousel/NTU.webp" },
  { name: "Caltech", src: "/carousel/Caltech.webp" },
  { name: "Stanford", src: "/carousel/Stanford.webp" },
  { name: "Oxford", src: "/carousel/Oxford.webp" },
  { name: "Cornell", src: "/carousel/Cornell.webp" },
  { name: "UCL", src: "/carousel/UCL.webp" },
  { name: "Cambridge", src: "/carousel/Cambridge.webp" },
  { name: "NUS", src: "/carousel/NUS.webp" },
  { name: "Meta", src: "/carousel/Meta.webp" },
];

function LogoItem({ logo, index = 0, animate = false }) {
  return (
    <motion.div
      className="
        !flex !shrink-0 !items-center !justify-center
        !h-20 !w-[7rem]
        sm:!h-24 sm:!w-[8.5rem]
        md:!h-28 md:!w-[10rem]
      "
      title={logo.name}
      initial={animate ? { opacity: 0, y: 28, scale: 0.9 } : false}
      whileInView={animate ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % logos.length) * 0.06,
      }}
    >
      <img
        src={logo.src}
        alt={logo.name}
        width={160}
        height={112}
        className="
          !h-16 sm:!h-20 md:!h-24
          !w-auto !max-w-full
          !object-contain
          !select-none
          !pointer-events-none
        "
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </motion.div>
  );
}

const Carousel = () => {
  const reduceMotion = useHydrationSafeReducedMotion();
  // Two identical sequences so translateX(-50%) loops seamlessly
  const track = [...logos, ...logos];

  return (
    <section
      className="
        !relative !z-10 !w-full
        !mt-6 sm:!mt-10 md:!mt-16
        !mb-2
        !px-0
      "
      aria-label="Partner universities and institutions"
    >
      <div className="!text-center !font-bold !px-4 sm:!px-6">
        <p className="!text-base sm:!text-lg md:!text-3xl !leading-snug !tracking-tight !text-muted-foreground !max-w-3xl !mx-auto">
          MYResearchGuide is backed by a community of researchers affiliated with…
        </p>
      </div>

      {/* Reduced-motion: static wrap so every logo stays on screen */}
      {reduceMotion ? (
        <div className="!mt-5 sm:!mt-6 !px-4 sm:!px-6">
          <ul className="!list-none !m-0 !p-0 !flex !flex-wrap !justify-center !items-center !gap-x-3 !gap-y-4 sm:!gap-x-5 sm:!gap-y-5 !max-w-4xl !mx-auto">
            {logos.map((logo) => (
              <li key={logo.name}>
                <LogoItem logo={logo} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          className="
            !relative !w-full !mt-5 sm:!mt-6
            !overflow-hidden
            !py-4 sm:!py-6
            uni-marquee-mask
          "
        >
          <div
            className="
              !flex !w-max !items-center
              !gap-4 sm:!gap-6 md:!gap-8
              animate-scroll
              uni-marquee-track
            "
            aria-hidden={false}
          >
            {track.map((logo, index) => (
              <LogoItem
                key={`${logo.name}-${index}`}
                logo={logo}
                index={index}
                animate
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Carousel;
