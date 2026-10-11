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
const DISCORD_URL = "https://discord.gg/V5mRRsa2QS";

const DiscordIcon = ({ size = 18 }) => (
  <svg
    viewBox="0 0 256 199"
    width={size}
    height={size * (199 / 256)}
    fill="currentColor"
    aria-hidden
  >
    <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" />
  </svg>
);

// Desktop nav button with a hover/focus tooltip explaining why to click it.
const NavCta = ({ href, title, tip, className, children }) => (
  <div className="group !relative !hidden sm:!block">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-describedby={`tip-${href}`}
      className={`!inline-flex !h-11 !items-center !gap-2 !rounded-lg !border !px-4 !text-sm !font-medium !no-underline !transition-colors ${className}`}
    >
      {children}
    </a>
    <div
      id={`tip-${href}`}
      role="tooltip"
      className="!pointer-events-none !absolute !right-0 !top-full !z-10 !w-72 !pt-3 !opacity-0 !translate-y-1 !transition-all !duration-200 group-hover:!translate-y-0 group-hover:!opacity-100 group-focus-within:!translate-y-0 group-focus-within:!opacity-100"
    >
      <span
        className="!absolute !right-8 !top-[7px] !size-3 !rotate-45 !border-l !border-t !border-white/15 !bg-zinc-900"
        aria-hidden
      />
      <div className="!relative !rounded-xl !border !border-white/15 !bg-zinc-900 !px-4 !py-3.5 !shadow-2xl !shadow-black/60">
        <p className="!m-0 !text-sm !font-semibold !text-white">{title}</p>
        <p className="!m-0 !mt-1 !text-[13px] !leading-relaxed !text-zinc-400">
          {tip}
        </p>
      </div>
    </div>
  </div>
);

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
            <NavCta
              href={DISCORD_URL}
              title="Join the community"
              tip="Exchange ideas, explore your interests and learn from other young STEM enthusiasts."
              className="!border-white/30 !text-white hover:!bg-white/10"
            >
              <DiscordIcon size={18} />
              Discord
            </NavCta>
            <NavCta
              href={MAILING_LIST_URL}
              title="Stay in the loop"
              tip="New guides, events and opportunities, straight to your inbox."
              className="!border-white !bg-white !text-black hover:!bg-zinc-200"
            >
              Mailing List
              <ArrowUpRight size={16} aria-hidden />
            </NavCta>
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
              className="!mx-auto !mt-8 !flex !max-w-xl !flex-col !items-center !gap-4"
            >
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="!inline-flex !items-center !gap-2 !rounded-lg !border !border-white/30 !px-6 !py-3 !text-base !font-medium !text-white !no-underline"
              >
                <DiscordIcon size={20} />
                Join our Discord
              </a>
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
