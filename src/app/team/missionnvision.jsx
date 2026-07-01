"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// Word whose opacity is driven by scroll progress (teleprompter reveal)
function RevealWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="!mr-[0.3em] !inline-block">
      {children}
    </motion.span>
  );
}

// Paragraph that reveals word-by-word as it scrolls through the viewport
function ScrollReveal({ text, className = "" }) {
  const container = useRef(null);
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
          <RevealWord key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </RevealWord>
        );
      })}
    </p>
  );
}

export default function Mission() {
  return (
    <section className="min-h-[500px]">
      <div className="gap-6 !m-10 md:m-0">
        <div>
          <div className="!relative !z-10 !w-full !flex !flex-col !items-center !justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 1.2,
              }}
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

            {/* 2. OVERLAPPING HERO IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.4 }}
              className="!relative !z-10 !max-w-auto md:!max-w-4xl !mx-auto !mt-16 md:!mt-24 !px-4"
            >
              <div className="!rounded-2xl !overflow-hidden !border-4 !border-black !shadow-[0_20px_50px_rgba(0,0,0,0.8)] md:!w-[700px] md:!h-auto md:!mx-auto !mt-10">
                <Image
                  src="/heroo.png"
                  alt="Hero Display"
                  width={1200}
                  height={800}
                  className="!w-full !h-auto !display-block"
                />
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </section>
  );
}
