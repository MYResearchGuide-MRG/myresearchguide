"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from 'react';
import NeuronBackdrop from "@/components/ui/NeuronBackdrop";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";
import styles from "../ContentPage.module.css";

export default function Header() {
  const headerRef = useRef(null);
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const heroVisible = useInView(headerRef);

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div
      ref={headerRef}
      className={styles.hero}
    >

      <motion.div
        style={{ opacity: prefersReducedMotion ? 1 : backgroundOpacity }}
        className={styles.heroAtmosphere}
        data-visible={heroVisible}
      >
        <NeuronBackdrop />
      </motion.div>

      <div className={styles.heroFade} />

      <div className={styles.heroCopy}>
        <h1 className={styles.heroTitle}>
          <span className="!text-spektr-cyan !block">About</span>
          <span className="!block !break-words !bg-gradient-to-r !from-stone-400 !to-slate-300 !bg-clip-text !text-transparent">
            MYResearchGuide.
          </span>
        </h1>
        <p className={styles.heroNote}>
          <i>
            [ Get to know more about our story and our team! ]
          </i>
        </p>
      </div>
    </div>
  );
}
