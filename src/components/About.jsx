/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; // Don't forget this in Next.js App Router!

import { Button, Card } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { GlobeBars } from "@/components/ui/cobe-globe-bars";
import CountUp from "@/components/ui/CountUp";
import { motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

export default function About1() {
  const reduceMotion = useHydrationSafeReducedMotion();

  const headerVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.55, ease: "easeOut" },
    },
  };

  const contentVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.55,
        ease: "easeOut",
        delay: reduceMotion ? 0 : 0.15,
      },
    },
  };

  const cardsContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
        delayChildren: reduceMotion ? 0 : 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: reduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.4, ease: "easeOut" },
    },
  };

  return (
    <section className="!bg-black !text-white !py-12 md:!py-24 !min-h-0 md:!min-h-screen !flex !flex-col !items-center !justify-center !overflow-x-clip">
      <div className="!container !mx-auto !max-w-6xl !px-4 sm:!px-6 lg:!px-0 !w-full">
        {/* Header Section */}
        <motion.div
          className="!mt-10 md:!mt-20 !mb-12 md:!mb-20"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <h1 className="!text-4xl md:!text-6xl lg:!text-8xl !font-regular !text-center !tracking-tighter !leading-tight">
            <span className="!text-spektr-cyan">
              All you need to know about <br className="!hidden md:!block" />
              <span className="!font-semibold !bg-gradient-to-r !from-stone-400 !to-slate-300 !bg-clip-text !text-transparent">
                MYResearchGuide.
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Responsive Content Grid */}
        <motion.div
          className="!flex !flex-col-reverse lg:!flex-row !w-full !gap-12 lg:!gap-16 !items-center"
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {/* Left Side: Content */}
          <div className="!w-full lg:!w-1/2 !space-y-6 !text-center lg:!text-left">
            <h2 className="!text-3xl md:!text-5xl !font-bold">Our Community</h2>
            <p className="!text-gray-400 !text-base md:!text-lg !leading-relaxed !max-w-2xl !mx-auto lg:!mx-0">
              MYResearchGuide is crafted in collaboration with Malaysian
              researchers all across the world.
            </p>

            {/* Stats Cards */}
            <motion.div
              className="!flex !flex-col sm:!flex-row !gap-4 !pt-4"
              variants={cardsContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              <motion.div
                variants={cardVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -4,
                        borderColor: "rgba(255,255,255,0.28)",
                        transition: { type: "spring", stiffness: 300, damping: 22 },
                      }
                }
                className="!border !border-gray-800 !p-6 !rounded-xl !flex-1 !text-center !bg-zinc-900/30 !transition-[border-color] !duration-300"
              >
                <div className="!text-2xl !font-bold">
                  <CountUp start={0} end={25} duration={1500} />
                  <span>+</span>
                </div>
                <div className="!text-sm !text-gray-500 !mt-1">
                  Researchers involved in our guide.
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -4,
                        borderColor: "rgba(255,255,255,0.28)",
                        transition: { type: "spring", stiffness: 300, damping: 22 },
                      }
                }
                className="!border !border-gray-800 !p-6 !rounded-xl !flex-1 !text-center !bg-zinc-900/30 !transition-[border-color] !duration-300"
              >
                <div className="!text-2xl !font-bold">
                  <CountUp start={0} end={24} duration={1500} />
                  <span>+</span>
                </div>
                <div className="!text-sm !text-gray-500 !mt-1">
                  Institutions and organisations reached across the world.
                </div>
              </motion.div>
            </motion.div>
            {/* Join community button */}
            <div className="flex !pt-6 justify-center">
              <a
                href="https://forms.gle/SWL2CsYJRbrVyKWe6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { scale: 1.03, y: -1 }
                  }
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="!bg-white !text-slate-900 !px-10 !py-4 !font-bold !tracking-tighter hover:!bg-slate-200 !rounded-lg md:!text-lg"
                >
                  Join our community!
                </motion.button>
              </a>
            </div>
          </div>

          {/* Right Side: Visual Placeholder */}
          <div className="!w-full lg:!w-1/2 !flex !justify-center !items-center">
            <div className="!relative !w-full !max-w-[320px] md:!max-w-[600px] !aspect-square !flex !items-center !justify-center !rounded-full !p-4">
              <div className="!w-full !h-full">
                <GlobeBars />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
