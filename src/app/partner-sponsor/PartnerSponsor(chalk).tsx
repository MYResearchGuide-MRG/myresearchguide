/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";
import { ExternalLink } from "lucide-react";
import NeuronBackdrop from "@/components/ui/NeuronBackdrop";
import Autoplay from "embla-carousel-autoplay";
import { GlowCard } from "@/components/ui/spotlight-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
];

// Gold-tier sponsors. Platinum tier removed for now.
const goldSponsors: Org[] = [
  {
    name: "MABECS",
    logo: "/Full Logo_coloured_2026.png",
    description:
      "MABECS is Malaysia's leading UK education consultancy, established in 1985. It guides Malaysian students through every stage of studying abroad — from selecting universities and courses to completing UCAS applications and securing visas. With a network of over 90 university and pathway partners, MABECS offers personalised consulting delivered by British Council-trained education advisors.",
    link: "https://www.mabecs.com/en-gb",
  },
  {
    name: "MathWorks",
    logo: "/mathworks-logo.png",
    description:
      "MathWorks is the leading developer of mathematical computing software — MATLAB and Simulink — trusted by engineers and scientists worldwide. Through its academic programmes and student-focused resources, MathWorks empowers the next generation of researchers to model, simulate, and accelerate discovery.",
    link: "https://www.mathworks.com",
  },
];

function PartnerCarousel({
  items,
  prefersReducedMotion,
}: {
  items: Org[];
  prefersReducedMotion: boolean | null;
}) {
  // Auto-scrolls; pauses on hover, resumes on leave.
  // Disabled entirely when the user prefers reduced motion.
  const autoplay = useRef(
    Autoplay({ delay: 2800, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      plugins={prefersReducedMotion ? [] : [autoplay.current]}
      className="!w-full !px-4 md:!px-14"
    >
      <CarouselContent
        className="!-ml-4 !py-6"
        style={
          {
            // Silver (desaturated) spotlight.
            "--saturation": "0",
            "--lightness": "78",
            // --outer: blurred ambient layer that pooled into a blob at the corner.
            "--outer": "0",
            // --border-light-opacity: the hard-coded pure-WHITE ::after highlight that
            // stayed white (ignores saturation) and blobbed at the rounded corner. Off.
            "--border-light-opacity": "0",
            // Soften the remaining silver border reflection so corners don't over-brighten.
            "--border-spot-opacity": "0.7",
          } as React.CSSProperties & Record<string, string>
        }
      >
        {items.map((org, i) => (
          <CarouselItem
            key={i}
            className="!pl-4 !basis-full sm:!basis-1/2 lg:!basis-1/3"
          >
            <motion.div
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 16 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.45, ease: "easeOut", delay: i * 0.05 }
              }
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              className="!h-full"
            >
              <GlowCard
                customSize
                className="!w-full !h-full !min-h-[420px] !flex !flex-col !items-center !text-center !rounded-3xl !p-8 !transition-shadow hover:!shadow-[0_12px_40px_rgba(255,255,255,0.06)]"
              >
                {/* logo in white circle */}
                <div className="!bg-white !rounded-full !w-28 !h-28 !overflow-hidden !flex !items-center !justify-center !mb-6 !shadow-lg !transition-transform !duration-300 group-hover:!scale-105 hover:!scale-105">
                  {org.logoFit === "cover" ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="!w-full !h-full !object-cover"
                    />
                  ) : (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className={`!max-w-full !max-h-full !object-contain ${org.logoPad ?? "!p-5"}`}
                    />
                  )}
                </div>
                <h4 className="!text-lg md:!text-xl !font-bold !text-white !mb-3">
                  {org.name}
                </h4>
                <p className="!text-zinc-400 !text-sm !leading-relaxed !mb-6">
                  {org.description}
                </p>
                <a
                  href={org.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!mt-auto !inline-flex !items-center !gap-2 !text-white !text-sm !font-semibold !no-underline hover:!underline !transition-opacity hover:!opacity-90"
                >
                  Visit
                  <ExternalLink size={16} />
                </a>
              </GlowCard>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="!z-20 !left-1 md:!-left-12 !text-white !bg-zinc-900/80 !border-zinc-700 hover:!bg-zinc-800 !transition-colors" />
      <CarouselNext className="!z-20 !right-1 md:!-right-12 !text-white !bg-zinc-900/80 !border-zinc-700 hover:!bg-zinc-800 !transition-colors" />
    </Carousel>
  );
}

export default function PartnersSponsors() {
  const headerRef = useRef(null);
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="!bg-black !text-white !min-h-screen">
      {/* ── CHALKBOARD HEADER ── */}
      <div
        ref={headerRef}
        className="!relative !overflow-hidden !min-h-screen !flex !items-center !justify-center"
      >
        {/* MYSSP neuron network, fades out on scroll */}
        <motion.div
          style={{ opacity: prefersReducedMotion ? 1 : backgroundOpacity }}
          className="!absolute !inset-0 !z-0 !pointer-events-none"
        >
          <NeuronBackdrop />
        </motion.div>

        <div className="!absolute !bottom-0 !left-0 !right-0 !h-32 !bg-gradient-to-t !from-black !to-transparent !z-[5]" />

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.55, ease: "easeOut" }
          }
          className="!relative !z-10 !text-center !px-6"
        >
          <p className="!text-slate-400 !uppercase !tracking-widest !text-l !mb-4">
            Backed by
          </p>
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
        {/* Partners — carousel */}
        <motion.div
          className="!mb-32"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: "easeOut" }
          }
        >
          <h3 className="!text-4xl md:!text-6xl !font-bold !uppercase !tracking-tighter !text-slate-200 !mb-16 !text-center">
            Partners
          </h3>
          <PartnerCarousel
            items={partners}
            prefersReducedMotion={prefersReducedMotion}
          />
        </motion.div>

        {/* Sponsors — Gold tier */}
        <div className="!mb-24">
          <motion.h3
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.5, ease: "easeOut" }
            }
            className="!text-4xl md:!text-6xl !font-bold !uppercase !tracking-tighter !mb-4 !text-center !bg-gradient-to-br !from-amber-200 !via-yellow-400 !to-amber-600 !bg-clip-text !text-transparent !drop-shadow-[0_0_25px_rgba(251,191,36,0.45)]"
          >
            Gold Sponsors
          </motion.h3>

          <div className="!mt-12 !grid !grid-cols-1 md:!grid-cols-2 !gap-12 md:!gap-14 !max-w-4xl !mx-auto">
            {goldSponsors.map((s, i) => (
              <motion.div
                key={i}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.55, ease: "easeOut" }
                }
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                className="!flex !flex-col !items-center !text-center !w-full !h-full"
              >
                <div className="!bg-white !rounded-full !w-40 !h-40 md:!w-48 !h-48 !overflow-hidden !flex !items-center !justify-center !p-3 !mb-8 !shadow-lg !ring-1 !ring-yellow-500/30 !transition-transform !duration-300 hover:!scale-105">
                  <img
                    src={s.logo}
                    alt={s.name}
                    className="!max-w-full !max-h-full !object-contain"
                  />
                </div>
                <p className="!text-slate-300 !text-sm md:!text-base !leading-relaxed !mb-8 !flex-1">
                  {s.description}
                </p>
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!inline-flex !items-center !gap-2 !text-white !text-sm !font-semibold !no-underline hover:!underline !transition-opacity hover:!opacity-90"
                >
                  Visit
                  <ExternalLink size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── THANK YOU / CTA SECTION ── */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.55, ease: "easeOut" }
          }
          className="!flex !flex-col md:!flex-row !items-center !justify-between !gap-10"
        >
          <div className="!text-center md:!text-left !max-w-xl">
            <h3 className="!text-4xl md:!text-6xl !font-bold !tracking-tighter !mb-6 !leading-none !bg-gradient-to-l !from-white !to-slate-500 !bg-clip-text !text-transparent">
              Thank You for Your Support
            </h3>
            <p className="!text-slate-400 !text-base md:!text-lg !leading-relaxed !font-medium">
              Your contributions directly fuel our initiatives, helping us make
              science research more accessible and appealing to Malaysian youth.
              Together, we are empowering the next generation of student
              researchers.
            </p>
          </div>
          <div className="!flex !flex-col !gap-4 !w-full md:!w-auto md:!mt-0 !mt-3">
            <a
              href="https://forms.gle/gfa8yGKAfFE5jxFk8"
              target="_blank"
              rel="noopener noreferrer"
              className="!w-full"
            >
              <motion.button
                type="button"
                whileHover={
                  prefersReducedMotion ? undefined : { scale: 1.02 }
                }
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                className="!w-full md:!w-72 !bg-white !text-black !px-8 !py-5 !tracking-tighter !transition-colors !font-bold hover:!bg-slate-200 !rounded-2xl !text-sm"
              >
                Become a Sponsor
              </motion.button>
            </a>
            <a
              href="https://forms.gle/XDwUML5KCBcWDKyU8"
              target="_blank"
              rel="noopener noreferrer"
              className="!w-full"
            >
              <motion.button
                type="button"
                whileHover={
                  prefersReducedMotion ? undefined : { scale: 1.02 }
                }
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                className="!w-full md:!w-72 !bg-transparent !text-white !border-2 !border-slate-700 !px-8 !py-5 !font-bold !tracking-tighter !transition-colors hover:!border-white !rounded-2xl !text-sm"
              >
                Become a Partner
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
