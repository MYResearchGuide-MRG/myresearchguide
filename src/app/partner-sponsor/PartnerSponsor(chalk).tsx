/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import Image from 'next/image';

const partners = [
  {
    name: "MBIOS",
    logo: "/mbios.png",
  },
  {
    name: "SEAEcon",
    logo: "/seaecon.png",
  },
  {
    name: "APCORE",
    logo: "/apcore.jpg",
  },
  {
    name: "Girls In STEM",
    logo: "/girls4stem.jpeg",
  },
];

const sponsors = [
  {
    name: "Sponsor 1",
    logo: "/logo_1.png",
  },
  {
    name: "Sponsor 2",
    logo: "/logo_1.png",
  },
  {
    name: "Sponsor 3",
    logo: "/logo_1.png",
  },
  {
    name: "Sponsor 4",
    logo: "/logo_1.png",
  },
];

const ChalkboardTile = () => (
  <div className="!w-[1024px] !h-[768px] !flex-shrink-0 !overflow-hidden">
    <Image
      src="/equations.jpg"
      alt="math chalkboard equations"
      width={1024}
      height={768}
      className="!object-cover !opacity-50"
    />
  </div>
);

function Card({ name, logo }: { name: string; logo: string }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white border border-slate-800 rounded-xl overflow-hidden h-64 w-full flex flex-col"
    >
      {/* Name above */}
      <div className="px-4 pt-4 pb-2 text-center">
        <p className="text-black font-bold text-lg tracking-tight">{name}</p>
      </div>
      {/* Logo fills rest */}
      <div className="flex-1 overflow-hidden">
        <img src={logo} alt={name} className="w-full h-full object-cover" />
      </div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function PartnersSponsors() {
  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="!bg-black !text-white">

      {/* ── CHALKBOARD HEADER ── */}
      <div ref={headerRef} className="!relative !overflow-hidden !min-h-[50vh] !flex !items-center !justify-center">

        {/* Chalkboard background */}
        <motion.div
          style={{
            opacity: backgroundOpacity,
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          }}
          className="!absolute !inset-0 !z-0 !pointer-events-none"
        >
          <div className="!absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[250%] !-rotate-12 !scale-125">
            <div className="!flex !w-max animate-marquee">
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

        {/* Bottom fade into black */}
        <div className="!absolute !bottom-0 !left-0 !right-0 !h-32 !bg-gradient-to-t !from-black !to-transparent !z-[5]" />

        {/* Header text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          className="!relative !z-10 !text-center !px-6"
        >
          <p className="!text-slate-400 !uppercase !tracking-widest !text-l !mb-4">Backed by</p>
          <h2 className="!text-4xl md:!text-8xl !font-bold !tracking-tighter !leading-tight !bg-gradient-to-r !from-stone-400 !to-slate-300 !bg-clip-text !text-transparent">
            Our Partners & Sponsors
          </h2>
          <p className="!text-slate-400 !mt-6 !text-base md:!text-lg !max-w-xl !mx-auto !leading-relaxed">
            We are grateful to the organisations and individuals who support our
            mission to make research accessible for all Malaysians.
          </p>
        </motion.div>

      </div>

      {/* ── CONTENT BELOW ── */}
      <div className="!px-6 md:!px-12 !py-12 !max-w-5xl !mx-auto">

        {/* partners */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="!mb-20"
        >
          <motion.h3
            variants={itemVariants}
            className="!text-2xl !uppercase !tracking-widest !text-slate-500 !text-center !mb-8"
          >
            Partners
          </motion.h3>
          <div className="!grid !grid-cols-2 md:!grid-cols-4 !gap-4 !py-5">
            {partners.map((p, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card {...p} />
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="!flex !justify-center !pt-8"
          >
            <a href="https://forms.gle/Gm9A6SQhettL5NJD8" target="_blank" rel="noopener noreferrer">
              <button className="!bg-white !text-slate-900 !px-10 !py-3 !uppercase !font-black !tracking-tighter !transition-transform active:!scale-95 hover:!bg-slate-200 !rounded-lg">
                Become a Partner
              </button>
            </a>
          </motion.div>
        </motion.div>

        {/* sponsors */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="!mb-8"
        >
          <motion.h3
            variants={itemVariants}
            className="!text-2xl !uppercase !tracking-widest !text-slate-500 !text-center !mb-8"
          >
            Sponsors
          </motion.h3>
          <div className="!grid !grid-cols-2 md:!grid-cols-4 !gap-4 !py-5">
            {sponsors.map((s, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card {...s} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* sponsor button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="!flex !justify-center !pt-4"
        >
          <a href="gform_1" target="_blank" rel="noopener noreferrer">
            <button className="!bg-transparent !text-white !border !border-slate-700 !px-10 !py-3 !uppercase !font-black !tracking-tighter !transition-all active:!scale-95 hover:!border-slate-400 !rounded-lg">
              Become a Sponsor
            </button>
          </a>
        </motion.div>

      </div>
    </div>
  );
}