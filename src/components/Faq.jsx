"use client";

import { motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

import Accordion_01 from "@/components/ui/ruixen-accordian01";

const Faq = () => {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <>
      <motion.h1
        className="!mt-16 sm:!mt-24 md:!mt-40 !text-3xl sm:!text-5xl md:!text-[5rem] !mb-6 md:!mb-10 !max-w-none !text-center !tracking-tighter !px-3"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
      >
        <span className="!text-spektr-cyan">
          Frequently Asked Questions.
        </span>
      </motion.h1>
      <Accordion_01 />
    </>
  );
};

export { Faq };
