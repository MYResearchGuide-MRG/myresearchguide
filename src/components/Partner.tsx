/* eslint-disable @next/next/no-img-element */
"use client"
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
    // Example: { name: "Organization Name", logo: "/path-to-logo.png" }
  ];
  
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

export default function Partner() {

  
  
  
    return (
      <div className="!bg-black !text-white !min-h-screen">
  
  
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
              className="!text-4xl md:!text-6xl !font-bold !uppercase !tracking-tighter !text-cyan- !mb-12 !text-center md:!text-left"
            >
              Platinum Sponsors
            </motion.h3>
            
            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6">
              {sponsors.length > 0 ? (
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
              )}
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
              Gold Sponsors
            </motion.h3>
            
            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6">
              {sponsors.length > 0 ? (
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
                      <p className="!text-slate-900 !font-black !text-xs md:!text-sm !mt-2 !text-center !uppercase !tracking-widest !border-t !border-slate-50 !pt-4 !w-full">
                          {s.name}
                      </p>
                  </motion.div>
                  ))
              ) : (
                  <div className="!col-span-full !text-slate-500 !text-lg !font-medium !py-12 !text-center !bg-black/20 !rounded-2xl !border !border-dashed !border-slate-800">
                      No Gold Sponsors as of 3/5/2026.
                  </div>
              )}
            </div>
          </motion.div>
          </div>
          </div>
  );
}