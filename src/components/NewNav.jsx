/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

const MAILING_LIST_URL = "https://forms.gle/Sk9JS3kcKe8qw1cU6";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  const navLinks = [
    { name: "About Us", href: "/team" },
    { name: "Researchers", href: "/researchers" },
    { name: "Events", href: "/events" },
    { name: "Partners & Sponsors", href: "/partner-sponsor" },
    { name: "Contact Us", href: "/contact" },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const linkContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const linkItemVariants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : -8,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.35,
        ease: "easeOut",
      },
    },
  };

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
          className="!relative !pointer-events-auto !flex !items-center !justify-between md:!grid md:!grid-cols-[1fr_auto_1fr] !w-full !max-w-7xl !px-4 sm:!px-6 md:!px-8"
          animate={{
            height: scrolled ? 56 : 64,
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: "easeOut" }
          }
        >
          {/* Logo Section */}
          <div className="!flex !cursor-pointer !z-[10000] !items-center">
            <Link href="/" className="!inline-flex !items-center">
              <img
                src="/MRG1W.png"
                alt="MYResearchGuide"
                className="!h-8 sm:!h-9 !w-auto !object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <motion.div
            className="!hidden md:!flex !items-center !gap-8 lg:!gap-10"
            variants={linkContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <motion.div key={link.name} variants={linkItemVariants}>
                <motion.div
                  className="!relative !inline-block"
                  initial="rest"
                  whileHover={prefersReducedMotion ? undefined : "hover"}
                  animate="rest"
                >
                  <Link
                    href={link.href}
                    className="!relative !inline-block !text-zinc-400 hover:!text-white !transition-all !duration-300 !text-[15px] !font-medium !no-underline"
                  >
                    {link.name}
                  </Link>
                  <motion.span
                    className="!absolute !-bottom-1 !left-0 !h-[1px] !w-full !bg-white !pointer-events-none"
                    variants={{
                      rest: { scaleX: 0 },
                      hover: { scaleX: 1 },
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mailing list CTA — right column, so the links stay centred */}
          <motion.div
            className="!hidden md:!flex !justify-end"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
          >
            <a
              href={MAILING_LIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="!no-underline"
            >
              <InteractiveHoverButton />
            </a>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <div className="md:!hidden !z-[10000] !flex !items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="!text-white !p-2 !focus:outline-none"
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="mobile-navigation-menu"
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="!fixed !inset-0 !h-[100dvh] !w-full !bg-black !flex !flex-col !items-center !justify-center !gap-8 !z-[9999] !px-6"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="!text-zinc-400 hover:!text-white !text-2xl !font-medium !transition-colors !no-underline"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="!mt-4">
                  <a
                    href={MAILING_LIST_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="!no-underline"
                    onClick={() => setIsOpen(false)}
                  >
                    <InteractiveHoverButton />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </nav>
      {/* Spacer so page content is not hidden under the fixed navbar */}
      <div className="!h-16 sm:!h-[4.5rem] !w-full !shrink-0" aria-hidden />
    </>
  );
};

export default Nav;
