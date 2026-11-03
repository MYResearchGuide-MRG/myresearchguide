/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";
import { ArrowUpRight } from "lucide-react";
import PartnerSupport from "./PartnerSupport";
import NeuronBackdrop from "@/components/ui/NeuronBackdrop";
import Autoplay from "embla-carousel-autoplay";
import styles from "./PartnerTheme.module.css";
import pageStyles from "../ContentPage.module.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type Org = {
  name: string;
  logo: string;
  description: string;
  link: string;
  logoFit?: "cover" | "contain"; // "cover" fills the whole circle
  logoPad?: string; // tailwind padding class for "contain" logos (default !p-5)
};

const partners: Org[] = [
  {
    name: "Malaysian BioScience Scholars",
    logo: "/mbios.png",
    description:
      "A student-led association supporting Malaysian students pursuing bioscience careers around the world.",
    link: "https://mbios.org",
  },
  {
    name: "Southeast Asian Economics Project",
    logo: "/seaecon.png",
    description:
      "A student-led economics non-profit and social enterprise in KL, promoting multidisciplinary economic thinking across Southeast Asia.",
    link: "https://seaecon.org",
  },
  {
    name: "Asia Pacific Centre of Robotics Engineering",
    logo: "/apcore.jpg",
    description:
      "A specialised robotics research and development hub based at APU in KL.",
    link: "https://apcore.apu.edu.my",
    logoPad: "!p-1", // enlarge logo within the circle
  },
  {
    name: "Girls In STEM",
    logo: "/girls4stem.jpeg",
    description:
      "A student-run organisation in KL empowering young women to explore and pursue their passion in STEM.",
    link: "https://girlsinstem43.wixsite.com/girlsinstemkl",
    logoFit: "cover", // fill the whole circle with its purple background
  },
  {
    name: "Che(ms.)try",
    logo: "/chemstry.png",
    description:
      "A student-led chemistry initiative empowering women and igniting a passion for science through creative, community-driven outreach.",
    link: "https://www.instagram.com/chems._try",
  },
  {
    name: "AISEA",
    logo: "/aisea.png",
    description:
      "A coalition of AI builder communities across Southeast Asia, connecting local builders through shared infrastructure, regional programmes and partner access.",
    link: "https://www.aisea.builders/en",
    logoFit: "cover", // gradient tile fills the circle
  },
];

// Gold-tier sponsors. Platinum tier removed for now.
const goldSponsors: Org[] = [
  {
    name: "MABECS",
    logo: "/Full Logo_coloured_2026.png",
    description:
      "MABECS is Malaysia's leading UK education consultancy, established in 1985. It guides Malaysian students through every stage of studying abroad, from selecting universities and courses to completing UCAS applications and securing visas. With a network of over 90 university and pathway partners, MABECS offers personalised consulting delivered by British Council-trained education advisors.",
    link: "https://www.mabecs.com/en-gb",
  },
  {
    name: "MathWorks",
    logo: "/mathworks-logo.png",
    description:
      "MathWorks is the leading developer of mathematical computing software, including MATLAB and Simulink, trusted by engineers and scientists worldwide. Through its academic programmes and student-focused resources, MathWorks empowers the next generation of researchers to model, simulate, and accelerate discovery.",
    link: "https://www.mathworks.com",
  },
];

// Description adapted from UTAR's official introduction: https://utar.edu.my/Introduction.php
const academicPartner: Org = {
  name: "Universiti Tunku Abdul Rahman (UTAR)",
  logo: "/brands/organisations/utar.png",
  description:
    "Established in 2002, UTAR is a not-for-profit Malaysian university committed to affordable, quality education. Its programmes span science, engineering, technology, medicine, business and the arts, supported by a commitment to teaching and research.",
  link: "https://utar.edu.my/",
};

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.12 });
  const inView = useInView(ref, { amount: 0.05 });
  // Server-rendered content stays visible; the short reveal never gates access.
  return <div ref={ref} className={`${styles.reveal} ${className}`} data-visible={visible} data-in-view={inView}>{children}</div>;
}

function OrgLogo({ org, sponsor = false }: { org: Org; sponsor?: boolean }) {
  return (
    <div className={`${styles.logo} ${sponsor ? styles.sponsorLogo : ""}`} data-fit={org.logoFit ?? "contain"} data-small-padding={Boolean(org.logoPad)}>
      <img src={org.logo} alt={org.name} width={sponsor ? 360 : 192} height={192} loading="lazy" decoding="async" />
    </div>
  );
}

function VisitLink({ org }: { org: Org }) {
  return <a className={styles.visit} href={org.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${org.name} website`}><span>Visit website</span><ArrowUpRight size={16} aria-hidden="true" /></a>;
}

function PartnerCarousel({ items, prefersReducedMotion }: { items: Org[]; prefersReducedMotion: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = useInView(rootRef, { amount: 0.2 });
  const [api, setApi] = useState<CarouselApi>();
  const [autoplay] = useState(() => Autoplay({
    delay: 4800, playOnInit: false, stopOnInteraction: true,
    stopOnMouseEnter: false, stopOnFocusIn: false,
  }));

  useEffect(() => {
    const root = rootRef.current;
    if (!api || !root) return;
    let disposed = false;
    let hovered = window.matchMedia("(hover: hover)").matches && root.matches(":hover");
    let dragging = false;
    const sync = () => {
      if (disposed) return;
      const focused = root.contains(document.activeElement);
      if (visible && !document.hidden && !prefersReducedMotion && !hovered && !focused && !dragging) autoplay.play();
      else autoplay.stop();
    };
    const enter = (event: PointerEvent) => { hovered = event.pointerType === "mouse"; sync(); };
    const leave = () => { hovered = false; sync(); };
    const down = () => { dragging = true; sync(); };
    const up = () => { dragging = false; sync(); };
    const blur = () => queueMicrotask(sync);
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    root.addEventListener("focusin", sync);
    root.addEventListener("focusout", blur);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      disposed = true;
      autoplay.stop();
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      root.removeEventListener("focusin", sync);
      root.removeEventListener("focusout", blur);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [api, autoplay, visible, prefersReducedMotion]);

  return (
    <Carousel ref={rootRef} setApi={setApi} opts={{ align: "start", loop: true, duration: prefersReducedMotion ? 0 : 28 }} plugins={[autoplay]} className={styles.carousel} aria-labelledby="partners-heading">
      <div className={styles.sectionHeading}>
        <h2 id="partners-heading">Partners</h2>
        <div className={styles.controls}>
          <CarouselPrevious className={styles.control} />
          <CarouselNext className={styles.control} />
        </div>
      </div>
      <CarouselContent className={styles.carouselTrack}>
        {items.map((org) => (
          <CarouselItem key={org.name} className={styles.slide}>
            <article className={styles.card}>
              <OrgLogo org={org} />
              <h3>{org.name}</h3>
              <p>{org.description}</p>
              <VisitLink org={org} />
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default function PartnersSponsors() {
  const headerRef = useRef(null);
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const heroVisible = useInView(headerRef);
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ["start start", "end start"] });
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="!bg-site-background !text-white">
      <header ref={headerRef} className={pageStyles.hero}>
        <motion.div style={{ opacity: prefersReducedMotion ? 1 : backgroundOpacity }} className={pageStyles.heroAtmosphere} data-visible={heroVisible}>
          <NeuronBackdrop />
        </motion.div>
        <div className={pageStyles.heroFade} />
        <div className={pageStyles.heroCopy}>
          <h1 className={pageStyles.heroTitle}>
            <span>Our Partners</span>
            <span className="!bg-gradient-to-r !from-stone-400 !to-slate-300 !bg-clip-text !text-transparent">&amp; Sponsors</span>
          </h1>
          <p className={pageStyles.heroNote}><i>[ Supporting research access for all Malaysians. ]</i></p>
        </div>
      </header>

      <div className={styles.content}>
        <Reveal className={styles.section}>
          <section aria-labelledby="sponsors-heading">
            <div className={styles.sectionHeading}><h2 id="sponsors-heading" className={styles.sponsorHeading}>Gold sponsors</h2></div>
            <div className={styles.sponsorGrid}>
              {goldSponsors.map((org) => (
                <article key={org.name} className={`${styles.card} ${styles.sponsorCard}`}>
                  <OrgLogo org={org} sponsor />
                  <h3>{org.name}</h3>
                  <p>{org.description}</p>
                  <VisitLink org={org} />
                </article>
              ))}
            </div>
          </section>
        </Reveal>
        <Reveal className={styles.section}>
          <section aria-labelledby="academic-partner-heading">
            <div className={styles.sectionHeading}>
              <h2 id="academic-partner-heading" className={styles.academicHeading}>Academic Partner</h2>
            </div>
            <article className={`${styles.card} ${styles.academicCard}`}>
              <div className={styles.academicLogo}>
                <img src={academicPartner.logo} alt="UTAR logo" width={288} height={137} loading="lazy" decoding="async" />
              </div>
              <div className={styles.academicCopy}>
                <h3>{academicPartner.name}</h3>
                <p>{academicPartner.description}</p>
                <VisitLink org={academicPartner} />
              </div>
            </article>
          </section>
        </Reveal>
        <Reveal className={styles.section}>
          <PartnerCarousel items={partners} prefersReducedMotion={prefersReducedMotion} />
        </Reveal>
        <PartnerSupport />
      </div>
    </div>
  );
}
