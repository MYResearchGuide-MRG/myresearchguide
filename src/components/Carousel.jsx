/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
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

function LogoItem({ logo }) {
  return (
    <div
      className="
        !flex !shrink-0 !items-center !justify-center
        !h-16 !w-[5.25rem]
        sm:!h-[4.5rem] sm:!w-[6.25rem]
        md:!h-20 md:!w-[7.25rem]
      "
      title={logo.name}
    >
      <img
        src={logo.src}
        alt={logo.name}
        width={120}
        height={80}
        className="
          !h-12 sm:!h-14 md:!h-16
          !w-auto !max-w-full
          !object-contain
          !select-none
          !pointer-events-none
        "
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </div>
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
        <p className="!text-base sm:!text-lg md:!text-3xl !leading-snug !tracking-tight !text-muted-foreground !max-w-xl !mx-auto">
          In collaboration with researchers from…
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
              !gap-3 sm:!gap-5 md:!gap-6
              animate-scroll
              uni-marquee-track
            "
            aria-hidden={false}
          >
            {track.map((logo, index) => (
              <LogoItem key={`${logo.name}-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Carousel;
