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

// const sponsors = [
//   // Example: { name: "Organization Name", logo: "/path-to-logo.png" }
// ];

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
    <div className="!bg-black !text-white !min-h-screen">

      {/* ── CHALKBOARD HEADER ── */}
      <div ref={headerRef} className="!relative !overflow-hidden !min-h-screen !flex !items-center !justify-center">
        
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
              {[...Array(8)].map((_, i) => <ChalkboardTile key={i} />)}
            </div>
          </div>
        </motion.div>

        <div className="!absolute !bottom-0 !left-0 !right-0 !h-32 !bg-gradient-to-t !from-black !to-transparent !z-[5]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
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

      {/* ── CONTENT SECTION ── */}
      <div className="!px-6 md:!px-12 !py-20 !max-w-6xl !mx-auto">

        {/* Partners Section - Grey Outer Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="!mb-16 !p-8 md:!p-16 !rounded-[3rem] !bg-slate-900/40 !border !border-slate-800/50 shadow-2xl"
        >
          <motion.h3
            variants={itemVariants}
            className="!text-4xl md:!text-6xl !font-bold !uppercase !tracking-tighter !text-slate-200 !mb-12 !text-center md:!text-left"
          >
            Partners
          </motion.h3>
          
          <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6">
            {partners.map((p, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -12 }} // The "Raise" animation
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="!bg-white !rounded-2xl !p-6 !flex !flex-col !items-center !justify-between !aspect-video shadow-lg cursor-default"
              >
                <div className="!flex-1 !flex !items-center !justify-center !w-full !p-2">
                   <img src={p.logo} alt={p.name} className="!max-w-full !max-h-full !object-contain" />
                </div>
                <p className="!text-slate-900 !font-black !text-xs md:!text-sm !mt-2 !text-center !uppercase !tracking-widest !border-t !border-slate-100 !pt-4 !w-full">
                    {p.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sponsors Section - Blue Outer Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="!mb-24 !p-8 md:!p-16 !rounded-[3rem] !bg-gradient-to-br !from-blue-950/50 !via-slate-950 !to-blue-900/30 !border !border-blue-900/20 shadow-2xl"
        >
          <motion.h3
            variants={itemVariants}
            className="!text-4xl md:!text-6xl !font-bold !uppercase !tracking-tighter !text-blue-200 !mb-12 !text-center md:!text-left"
          >
            Sponsors
          </motion.h3>
          
          <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6">
            <div className="!col-span-full !text-slate-500 !text-lg !font-medium !py-12 !text-center !bg-black/20 !rounded-2xl !border !border-dashed !border-slate-800">
                    No sponsors as of 3/5/2026.
                </div>
            {/* {sponsors.length > 0 ? (
                sponsors.map((s, i) => (
                <motion.div 
                    key={i} 
                    variants={itemVariants}
                    whileHover={{ y: -12 }} // The "Raise" animation
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="!bg-white !rounded-2xl !p-6 !flex !flex-col !items-center !justify-between !aspect-video shadow-lg cursor-default"
                >
                    <div className="!flex-1 !flex !items-center !justify-center !w-full !p-2">
                        <img src={s.logo} alt={s.name} className="!max-w-full !max-h-full !object-contain" />
                    </div>
                    <p className="!text-slate-900 !font-black !text-xs md:!text-sm !mt-2 !text-center !uppercase !tracking-widest !border-t !border-slate-100 !pt-4 !w-full">
                        {s.name}
                    </p>
                </motion.div>
                ))
            ) : (
                <div className="!col-span-full !text-slate-500 !text-lg !font-medium !py-12 !text-center !bg-black/20 !rounded-2xl !border !border-dashed !border-slate-800">
                    No sponsors as of 3/5/2026.
                </div>
            )} */}
          </div>
        </motion.div>

        {/* ── FOOTER SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="!flex !flex-col md:!flex-row !items-center !justify-between !gap-12 !border-t !border-slate-800/60 !pt-20 !pb-12"
        >
          <div className="!text-center md:!text-left !max-w-xl">
            <h3 className="!text-4xl md:!text-6xl !font-bold !tracking-tighter !mb-6 !leading-none !bg-gradient-to-l !from-white !to-slate-500 !bg-clip-text !text-transparent">
                Thank You for Your Support
            </h3>
            <p className="!text-slate-400 !text-base md:!text-lg !leading-relaxed !font-medium">
                Your contributions directly fuel our initiatives, helping us bridge the gap 
                between complex research and the Malaysian public. Together, we are 
                building a more informed and scientifically-literate nation.
            </p>
          </div>
          {/* Left: Buttons stacked vertically */}
          <div className="!flex !flex-col !gap-4 !w-full md:!w-auto">
            <a href="gform_1" target="_blank" rel="noopener noreferrer" className="!w-full">
              <button className="!w-full md:!w-72 !bg-white !text-black !px-8 !py-5 !uppercase !font-black !tracking-tighter !transition-all active:!scale-95 hover:!bg-slate-200 !rounded-2xl !text-sm">
                Become a Sponsor
              </button>
            </a>
            <a href="https://forms.gle/Gm9A6SQhettL5NJD8" target="_blank" rel="noopener noreferrer" className="!w-full">
              <button className="!w-full md:!w-72 !bg-transparent !text-white !border-2 !border-slate-700 !px-8 !py-5 !uppercase !font-black !tracking-tighter !transition-transform active:!scale-95 hover:!border-white !rounded-2xl !text-sm">
                Become a Partner
              </button>
            </a>
          </div>

          {/* Right: Thank you message */}
          
        </motion.div>

      </div>
    </div>
  );
}