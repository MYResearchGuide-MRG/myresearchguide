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
    description: "Malaysian Bioscience Scholars (MBIOS) is a student-led academic and inquisitive association that aims to serve Malaysian students in pursuit of bioscience careers all around the world.",
  },
  {
    name: "SEAEcon",
    logo: "/seaecon.png",
    description: "Southeast Asian Economics Project (SEAEcon) is a student-led regional economic non-profit and social enterprise based in Kuala Lumpur that promotes multidisciplinary economic thinking to shape discourse across Southeast Asia.",
  },
  {
    name: "APCORE",
    logo: "/apcore.jpg",
    description: "Asia Pacific Centre of Robotics Engineering is a specialized research and development hub located within the Asia Pacific University of Technology & Innovation (APU) in Kuala Lumpur, Malaysia.",
  },
  {
    name: "Girls In STEM",
    logo: "/girls4stem.jpeg",
    description: "Girls in STEM Kuala Lumpur is a student-run organization dedicated to empowering young women to explore and pursue their passion in science, technology, engineering, and mathematics (STEM).",
  },
];

const sponsors = [
  {
    name: "Sponsor 1",
    logo: "/logo_1.png",
    description: "bla bla bla",
  },
  {
    name: "Sponsor 2",
    logo: "/logo_1.png",
    description: "bla bla bla",
  },
  {
    name: "Sponsor 3",
    logo: "/logo_1.png",
    description: "bla bla bla",
  },
  {
    name: "Sponsor 4",
    logo: "/logo_1.png",
    description: "bla bla bla",
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

function FlipCard({ name, logo, description }: { name: string; logo: string; description: string }) {
  return (
    <div className="group [perspective:1000px] h-72 w-full">
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

        {/* front */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <img src={logo} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center gap-3">
          <img src={logo} alt={name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <h4 className="!text-white !font-bold !text-base !tracking-tight">{name}</h4>
            <p className="!text-slate-200 !text-sm !leading-relaxed">{description}</p>
          </div>
        </div>

      </div>
    </div>
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
      <div ref={headerRef} className="!relative !overflow-hidden !min-h-[60vh] !flex !items-center !justify-center">

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
      <div className="!px-6 md:!px-12 !py-24 !max-w-5xl !mx-auto">

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
          <div className="!grid !grid-cols-2 md:!grid-cols-4 !gap-4">
            {partners.map((p, i) => (
              <motion.div key={i} variants={itemVariants}>
                <FlipCard {...p} />
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
        >
          <motion.h3
            variants={itemVariants}
            className="!text-2xl !uppercase !tracking-widest !text-slate-500 !text-center !mb-4"
          >
            Sponsors
          </motion.h3>
          <motion.h3
                variants={itemVariants}
                className="!text-xs !uppercase !tracking-widest !text-slate-500 !text-center !mb-8"
            >
                (Coming Soon)
          </motion.h3>
          {/* <div className="!grid !grid-cols-2 md:!grid-cols-4 !gap-4">
            {sponsors.map((s, i) => (
              <motion.div key={i} variants={itemVariants}>
                <FlipCard {...s} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        // button
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="!flex !flex-col sm:!flex-row !gap-4 !justify-center !items-center !pt-4"
        >
          <a href="gform_1" target="_blank" rel="noopener noreferrer">
            <button className="!bg-transparent !text-white !border !border-slate-700 !px-10 !py-3 !uppercase !font-black !tracking-tighter !transition-all active:!scale-95 hover:!border-slate-400 !rounded-lg">
              Become a Sponsor
            </button>
          </a> */}
        </motion.div>

      </div>
    </div>
  );
}