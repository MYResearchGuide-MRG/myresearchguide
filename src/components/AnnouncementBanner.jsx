"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SquareArrowOutUpRight, X } from "lucide-react";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

// Where the "Take a look" button sends people.
const MYSSP_URL = "https://myssp.myresearchguide.org";

// Banner copy — edit here.
const BANNER_TITLE = "The MYSSP programme is officially released.";
const BANNER_SUB =
  "Check out Malaysia's 1st science research mentorship programme.";

// Dismissal is per browser session: closing the banner keeps it gone while the
// visitor keeps browsing, but it returns the next time they open the browser.
// Bump this key if a future banner should re-appear mid-session.
const DISMISS_KEY = "mrg:banner-dismissed:myssp-2026";

const AnnouncementBanner = () => {
  // Starts hidden so the server render and the first client render match; the
  // effect below decides whether it should actually show.
  const [visible, setVisible] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [bannerHeight, setBannerHeight] = useState(0);
  const bannerRef = useRef(null);
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // Private mode / storage blocked — just show the banner.
    }
    if (!dismissed) setVisible(true);
  }, []);

  // Track the fixed navbar's height so the banner always sits flush underneath
  // it, including while the navbar animates from 64px to 56px on scroll.
  useEffect(() => {
    const nav =
      typeof document !== "undefined"
        ? document.querySelector("[data-site-nav]")
        : null;
    if (!nav) return;

    const update = () => setNavHeight(nav.getBoundingClientRect().height);
    update();

    window.addEventListener("resize", update);
    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update);
      observer.observe(nav);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (observer) observer.disconnect();
    };
  }, []);

  // Measure the banner so the in-flow spacer below can reserve exactly the
  // right amount of room (the banner itself is fixed, so it has no flow height).
  useEffect(() => {
    const el = bannerRef.current;
    if (!visible || !el) {
      setBannerHeight(0);
      return;
    }

    const update = () => setBannerHeight(el.getBoundingClientRect().height);
    update();

    window.addEventListener("resize", update);
    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update);
      observer.observe(el);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (observer) observer.disconnect();
    };
  }, [visible]);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Nothing to do — it will just come back on the next page load.
    }
  }, []);

  return (
    <>
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            key="myssp-banner"
            ref={bannerRef}
            role="region"
            aria-label="Announcement"
            style={{ top: navHeight }}
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
            }
            className="!fixed !left-0 !right-0 !z-[9998] !w-full !border-y !border-white/10 !bg-zinc-900/95 !bg-gradient-to-r !from-zinc-900 !via-zinc-800 !to-zinc-900 !backdrop-blur-xl !shadow-[0_8px_24px_-12px_rgba(0,0,0,0.9)]"
          >
            {/* Hairline highlight along the top edge to lift the strip off the page */}
            <div
              className="!pointer-events-none !absolute !inset-x-0 !top-0 !h-px !bg-gradient-to-r !from-transparent !via-white/20 !to-transparent"
              aria-hidden
            />

            <div className="!relative !mx-auto !flex !w-full !max-w-7xl !items-center !gap-3 sm:!gap-4 !px-4 sm:!px-6 md:!px-8 !py-2.5">
              {/* Live dot */}
              <span className="!relative !flex !h-2 !w-2 !shrink-0">
                <span className="!absolute !inline-flex !h-full !w-full !rounded-full !bg-zinc-400 !opacity-60 motion-safe:!animate-ping" />
                <span className="!relative !inline-flex !h-2 !w-2 !rounded-full !bg-zinc-300" />
              </span>

              <p className="!m-0 !min-w-0 !flex-1 !text-[13px] sm:!text-[15px] !leading-snug !text-zinc-400">
                <span className="!mr-2.5 !hidden sm:!inline-block !rounded-md !border !border-white/15 !bg-white/10 !px-2 !py-0.5 !align-middle !text-[11px] !font-semibold !uppercase !tracking-wider !text-white">
                  New
                </span>
                <span className="!align-middle !font-semibold !text-white">
                  {BANNER_TITLE}
                </span>
                <span className="!hidden md:!inline !align-middle">
                  {" "}
                  {BANNER_SUB}
                </span>
              </p>

              <a
                href={MYSSP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group !inline-flex !shrink-0 !items-center !gap-1.5 !rounded-lg !bg-white !px-3 !py-1.5 !text-[13px] sm:!text-sm !font-semibold !text-black !no-underline !transition-colors !duration-300 hover:!bg-zinc-200 hover:!text-black"
              >
                <span>Take a look</span>
                <SquareArrowOutUpRight className="!h-3.5 !w-3.5 !transition-transform !duration-300 group-hover:!-translate-y-0.5 group-hover:!translate-x-0.5" />
              </a>

              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss announcement"
                className="!ml-0 sm:!ml-1 !shrink-0 !rounded-md !p-1 !text-zinc-500 hover:!bg-white/10 hover:!text-white !transition-colors !duration-200"
              >
                <X className="!h-4 !w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer so page content is not hidden under the fixed banner */}
      <div
        style={{ height: visible ? bannerHeight : 0 }}
        className="!w-full !shrink-0"
        aria-hidden
      />
    </>
  );
};

export default AnnouncementBanner;
