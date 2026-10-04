/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

const MAILING_LIST_URL = "https://forms.gle/Sk9JS3kcKe8qw1cU6";

const navLinks = [
  { name: "About Us", href: "/team" },
  { name: "Researchers", href: "/researchers" },
  { name: "Events", href: "/events" },
  { name: "Partners & Sponsors", href: "/partner-sponsor" },
  { name: "Contact Us", href: "/contact" },
];

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

  return (
    <>
      <nav
        data-site-nav
        className={`!fixed !top-0 !left-0 !right-0 !z-[9999] !w-full !px-3 sm:!px-4 !pt-2 !pb-2 !flex !justify-center !transition-all !duration-300 ${
          scrolled
            ? "!bg-black/70 !backdrop-blur-xl !border-b !border-white/10"
            : "!bg-black/20 !backdrop-blur-md"
        }`}
      >
        <ScrollProgress />
        <motion.div
          className="!relative !pointer-events-auto !flex !items-center !justify-between min-[1200px]:!grid min-[1200px]:!grid-cols-[1fr_auto_1fr] !w-full !max-w-[88rem] !px-4 sm:!px-6 min-[1200px]:!px-8"
          animate={{ height: scrolled ? 56 : 64 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: "easeOut" }
          }
        >
          <div className="!flex !cursor-pointer !z-[10000] !items-center">
            <Link href="/" className="!inline-flex !items-center">
              <img
                src="/MRG1W.png"
                alt="MYResearchGuide"
                className="!h-8 sm:!h-9 !w-auto !object-contain"
              />
            </Link>
          </div>

          <div className="!hidden min-[1200px]:!flex !items-center !gap-6 2xl:!gap-10">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                className="!relative !inline-block"
                initial="rest"
                whileHover={prefersReducedMotion ? undefined : "hover"}
                animate="rest"
              >
                <Link
                  href={link.href}
                  className="!relative !inline-block !text-zinc-400 hover:!text-white !transition-colors !duration-300 !text-[15px] !font-medium !no-underline"
                >
                  {link.name}
                </Link>
                <motion.span
                  className="!absolute !-bottom-1 !left-0 !h-[1px] !w-full !bg-white !pointer-events-none"
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </motion.div>
            ))}
          </div>

          <div className="!flex !items-center !justify-end min-[1200px]:!justify-start min-[1200px]:!pl-28 !gap-2 sm:!gap-3">
            <a
              href={MAILING_LIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="!hidden sm:!inline-flex !items-center !gap-2 !rounded-lg !border !border-white !bg-white !px-4 !py-3 !text-sm !font-medium !text-black !no-underline hover:!bg-zinc-200 !transition-colors"
            >
              Mailing List
              <ArrowUpRight size={16} aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="min-[1200px]:!hidden !flex !size-10 !items-center !justify-center !rounded-full !text-white !focus:outline-none"
              aria-label="Open navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </motion.div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation-menu"
            className="!fixed !inset-0 !z-[10001] !min-h-[100dvh] !bg-black !px-6"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
            transition={panelTransition}
          >
            <div className="!mx-auto !flex !h-20 !max-w-[88rem] !items-center !justify-between">
              <img
                src="/MRG1W.png"
                alt="MYResearchGuide"
                className="!h-8 sm:!h-9 !w-auto !object-contain"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="!flex !size-10 !items-center !justify-center !rounded-full !text-white !focus:outline-none"
                aria-label="Close navigation menu"
                autoFocus
              >
                <X size={25} />
              </button>
            </div>

            <div className="!mx-auto !mt-10 !flex !max-w-xl !flex-col !items-center">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          delay: 0.06 + index * 0.045,
                          duration: 0.45,
                          ease: [0.16, 1, 0.3, 1],
                        }
                  }
                  className="!w-full !border-b !border-white/10"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="!block !py-5 !text-center !text-2xl !font-medium !text-zinc-300 hover:!text-white !transition-colors !no-underline"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { delay: 0.32, duration: 0.45, ease: [0.16, 1, 0.3, 1] }
              }
              className="!mx-auto !mt-8 !flex !max-w-xl !justify-center"
            >
              <a
                href={MAILING_LIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="!no-underline"
                onClick={() => setIsOpen(false)}
              >
                <InteractiveHoverButton />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="!h-16 sm:!h-[4.5rem] !w-full !shrink-0" aria-hidden />
    </>
  );
};

export default Nav;
