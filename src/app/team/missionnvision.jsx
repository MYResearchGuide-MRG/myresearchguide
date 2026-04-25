"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Mission() {
  // Animation settings
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.3,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

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
            {/* 1. TEXTBOXES CONTAINER - Switched to 3 columns on desktop */}
            <div className="!max-w-7xl !mx-auto !grid !grid-cols-1 md:!grid-cols-3 !gap-8 !relative !z-0">
              {/* Mission Textbox */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="!bg-[#1a1a1a] !p-10 !rounded-3xl !border !border-white/5 !flex !flex-col !gap-4 text-left"
              >
                <h2 className="text-3xl md:!text-5xl !font-bold !text-white">
                  Mission.
                </h2>
                <p className="!text-xs !font-mono !text-white/40 !uppercase !tracking-widest">
                  noun | mis·sion | mi-shən
                </p>
                <p className="!text-xl !leading-relaxed !text-white/90">
                  To make science research accessible and appealing to all
                  Malaysian youth by exposing them to insight and guidance from
                  top student researchers, providing Malaysian students with
                  resources.
                </p>
              </motion.div>

              {/* Background Textbox (The New Center Box) */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="!bg-[#1a1a1a] !p-10 !rounded-3xl !border !border-white/5 !flex !flex-col !gap-4 text-left"
              >
                <h2 className="text-3xl md:!text-5xl !font-bold !text-white">
                  Background.
                </h2>
                <p className="!text-xs !font-mono !text-white/40 !uppercase !tracking-widest">
                  noun | back·ground | bak-ˌgraünd
                </p>
                <p className="!text-lg !leading-relaxed !text-white/90">
                  MYResearchGuide, Founded 2026,termed MRG, is a not-for-profit,
                  student-run initiative crafted in collaboration with Malaysian
                  researchers from top universities/research labs around the
                  globe. Through a beginner-friendly guide curated for Malaysian
                  youth (high school, pre-university, and early undergraduate
                  students), we aim to bridge the gap between curiosity and
                  opportunity.
                </p>
              </motion.div>

              {/* Vision Textbox */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="!bg-[#1a1a1a] !p-10 !rounded-3xl !border !border-white/5 !flex !flex-col !gap-4"
              >
                <h2 className="text-3xl md:!text-5xl !font-bold !text-white">
                  Vision.
                </h2>
                <p className="!text-xs !font-mono !text-white/40 !uppercase !tracking-widest">
                  noun | vi·sion | vi-zhən
                </p>
                <p className="!text-lg !leading-relaxed !text-white/90">
                  MYResearchGuide views a community of Malaysian youth inspired
                  to pursue impactful science research through understanding and
                  empowerment. At MYResearchGuide, we aim to prosper a network
                  of youth STEM researchers supported by one another.
                </p>
              </motion.div>
            </div>

            {/* 2. OVERLAPPING HERO IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.4 }}
              className="!relative !z-10 !max-w-auto md:!max-w-4xl !mx-auto !mt-10 md:!-mt-16 !px-4"
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
