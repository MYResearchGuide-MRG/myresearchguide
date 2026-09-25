"use client"; // Don't forget this in Next.js App Router!

import Link from "next/link";
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

  const cardVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
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

        {/* Community — rolling researcher count beside the globe */}
        <motion.div
          className="!flex !flex-col-reverse lg:!flex-row !w-full !gap-12 lg:!gap-16 !items-center"
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="!w-full lg:!w-1/2 !flex !flex-col !items-center lg:!items-start !text-center lg:!text-left">
            <h2 className="!text-3xl md:!text-5xl !font-bold">Our Community</h2>
            <p className="!text-gray-400 !text-base md:!text-lg !leading-relaxed !max-w-2xl !mt-4">
              MYResearchGuide is crafted in collaboration with Malaysian
              researchers all across the world.
            </p>

            <motion.div
              className="!mt-10 md:!mt-14"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              <div className="!text-7xl md:!text-9xl !font-semibold !tracking-tighter !leading-none !bg-gradient-to-r !from-stone-400 !to-slate-300 !bg-clip-text !text-transparent">
                <CountUp
                  start={0}
                  end={40}
                  duration={1800}
                  className="tabular-nums inline-block"
                />
                +
              </div>
              <p className="!mt-4 !text-base md:!text-xl !text-zinc-300 !max-w-xl">
                Backed by 40+ Malaysian researchers from top institutions around
                the world
              </p>
            </motion.div>

            <div className="!flex !flex-col sm:!flex-row !gap-3 !pt-10 !justify-center lg:!justify-start !w-full sm:!w-auto">
              <a
                href="https://forms.gle/SWL2CsYJRbrVyKWe6"
                target="_blank"
                rel="noopener noreferrer"
                className="!no-underline"
              >
                <motion.span
                  whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="!flex !justify-center !bg-white !text-slate-900 !px-10 !py-4 !font-bold !tracking-tighter hover:!bg-slate-200 !rounded-lg md:!text-lg"
                >
                  Join our community!
                </motion.span>
              </a>
              <Link href="/researchers" className="!no-underline">
                <motion.span
                  whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="!flex !justify-center !border !border-white/25 !text-white !px-10 !py-4 !font-bold !tracking-tighter hover:!bg-white/10 !rounded-lg md:!text-lg"
                >
                  Meet our researchers
                </motion.span>
              </Link>
            </div>
          </div>

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
