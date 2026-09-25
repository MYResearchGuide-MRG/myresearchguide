"use client";

import { Linkedin, Instagram, Mail } from "lucide-react";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";
import SessionLink from "@/components/SessionLink";

export default function Foot() {
  const reduceMotion = useHydrationSafeReducedMotion();

  const groupVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        ease: "easeOut",
        delay: reduceMotion ? 0 : i * 0.12,
      },
    }),
  };

  const iconHover = reduceMotion
    ? undefined
    : { y: -3, scale: 1.08, transition: { type: "spring", stiffness: 400, damping: 18 } };

  const iconTap = reduceMotion
    ? undefined
    : { y: 0, scale: 0.94 };

  return (
    <>
      <footer className="!py-16 !mt-20">
        <div className="max-w-7xl mx-auto !px-6 flex flex-wrap gap-10 md:gap-0">
          {/* Left Part: 3/5 Basis */}
          <motion.div
            className="basis-full md:basis-3/5 flex flex-col justify-between"
            custom={0}
            variants={groupVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div>
              <Image
                src="/MRG2W.png"
                alt="Brand Logo"
                width={140}
                height={40}
                className="mb-6 object-contain"
              />
              <div className="!-mt-2 !mb-6">
                <SessionLink />
              </div>
            </div>
            <p className=" text-sm !mt-2">
              © {new Date().getFullYear()} MYResearchGuide. All rights reserved.
            </p>
          </motion.div>

          {/* Right Part: 2/5 Basis */}
          <motion.div
            className="basis-full md:basis-2/5 flex flex-col"
            custom={1}
            variants={groupVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h4 className="text-gray-800 font-semibold mb-6">Contact Us</h4>

            <div className="flex gap-6 ">
              <motion.a
                href="http://www.linkedin.com/company/myresearchguide"
                target="_blank"
                className="text-gray-500 hover:text-blue-600 transition-colors !inline-flex !items-center !justify-center !w-8 !h-8"
                aria-label="LinkedIn"
                whileHover={iconHover}
                whileTap={iconTap}
              >
                <Linkedin size={24} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/myresearchguide"
                target="_blank"
                className="text-gray-500 hover:text-pink-600 transition-colors !inline-flex !items-center !justify-center !w-8 !h-8"
                aria-label="Instagram"
                whileHover={iconHover}
                whileTap={iconTap}
              >
                <Instagram size={24} />
              </motion.a>
              <motion.a
                href="mailto:myresearchguide.org@gmail.com"
                className="text-gray-500 hover:text-red-500 transition-colors !inline-flex !items-center !justify-center !w-8 !h-8"
                aria-label="Gmail"
                whileHover={iconHover}
                whileTap={iconTap}
              >
                <Mail size={24} />
              </motion.a>
            </div>

            <p className="!mt-2 text-gray-500 text-sm">
              Reach out for any enquiries regarding our STEM programmes.
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
}
