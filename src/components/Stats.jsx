/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";
import { Linkedin, Instagram, Mail } from "lucide-react";
import { DestinationCard } from "@/components/ui/card-21";
import React, { useState, useEffect, useCallback, useRef } from "react";

const AUTO_ADVANCE_MS = 7000;

const Cards = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useHydrationSafeReducedMotion();
  const sectionRef = useRef(null);
  const tabRefs = useRef([]);
  const pauseAccumRef = useRef(0);
  const pauseCycleRef = useRef(0);

  const features = [
    {
      title: "Your personal journey, step-by-step",
      description:
        "Navigate our guide content with connected pages, keyword definitions, and researcher tips. Each step of the process, from professor outreach to publication, is broken down into detail.",
      video: "/gif2.mp4", // compressed from 20.9MB gif (656KB)
    },
    {
      title: "Get Inspired by Researchers",
      description:
        "With featured heart-to-heart conversations and personal insight from our research community, learn more about our researchers’ featured fields, their journey, and the steps they’ve taken.",
      video: "/gif5.mp4", // compressed from 29MB gif (629KB)
    },
  ];

  const selectTab = useCallback((index, { focus = false } = {}) => {
    setActiveTab(index);
    setCycleKey((k) => k + 1);
    pauseAccumRef.current = 0;
    setProgress(0);
    if (focus) {
      requestAnimationFrame(() => {
        tabRefs.current[index]?.focus();
      });
    }
  }, []);

  // ~7s auto-advance with pauseable progress; disabled under reduced motion
  useEffect(() => {
    if (reduceMotion) return undefined;

    if (pauseCycleRef.current !== cycleKey) {
      pauseCycleRef.current = cycleKey;
      pauseAccumRef.current = 0;
    }

    if (isPaused) return undefined;

    const base = pauseAccumRef.current;
    const started = Date.now();
    let rafId = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const elapsed = Math.min(AUTO_ADVANCE_MS, base + (Date.now() - started));
      setProgress((elapsed / AUTO_ADVANCE_MS) * 100);

      if (elapsed >= AUTO_ADVANCE_MS) {
        pauseAccumRef.current = 0;
        setProgress(0);
        setActiveTab((prev) => (prev + 1) % features.length);
        setCycleKey((k) => k + 1);
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      pauseAccumRef.current = Math.min(
        AUTO_ADVANCE_MS,
        base + (Date.now() - started)
      );
    };
  }, [reduceMotion, isPaused, cycleKey, activeTab, features.length]);

  const displayProgress = reduceMotion ? 100 : progress;

  return (
    <div>
      <h1 className="!mt-16 sm:!mt-24 md:!mt-40 !text-3xl sm:!text-5xl md:!text-[5rem] !max-w-none !font-regular !text-center !tracking-tighter !ml-2 !mr-2 md:!ml-0 md:!mr-0 !px-2">
        <span className="!text-spektr-cyan">
          New to <br></br>
          <span className="!font-semibold bg-gradient-to-r from-stone-400  to-slate-300 bg-clip-text text-transparent">
            MYResearchGuide
          </span>
          ?<br></br>Here&apos;s how it works.
        </span>
      </h1>

      <section
        ref={sectionRef}
        className="!text-white !px-4 sm:!px-6 md:!px-12 !min-h-0 md:!min-h-screen !flex !items-center !overflow-x-clip !py-10 md:!py-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(e) => {
          if (!sectionRef.current?.contains(e.relatedTarget)) {
            setIsPaused(false);
          }
        }}
      >
        <div className="!max-w-[1600px] !mx-auto !w-full !grid !grid-cols-1 lg:!grid-cols-12 !gap-8 md:!gap-16 !items-start !p-2 sm:!p-6 md:!p-10">
          {/* Left Side: Content (3/12 columns) */}
          <div className="lg:!col-span-3 !flex !flex-col !pt-10">
            <h1 className="!text-3xl md:!text-5xl !font-bold !leading-tight">
              Get started with science research{" "}
              <span className="relative !inline-block px-1">
                one day
                <motion.span
                  initial={reduceMotion ? false : { width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true, amount: "same" }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.5,
                    delay: reduceMotion ? 0 : 0.2,
                    ease: "easeInOut",
                  }}
                  className="absolute !z-10 !left-0 !top-1/2 !h-[4px] !bg-red-500 !-translate-y-1/2"
                  style={{ originX: 0 }}
                />
              </span>
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: reduceMotion ? 0 : 0.4,
                  delay: reduceMotion ? 0 : 0.7,
                  ease: "easeOut",
                }}
                className="!text-orange-500 !inline-block !ml-2"
              >
                now.
              </motion.span>
            </h1>
            <p className="!text-[#a1a1a1] !text-lg !mb-8 !leading-relaxed">
              Stop wasting your money on scam programs. Pursue real science research, with our guide, for free.{" "}
            </p>

            <button className="!w-fit !px-6 !py-2 !border !border-[#333] !rounded-full !text-sm !font-medium !mb-12 hover:!bg-white hover:!text-black !transition-all !duration-300">
              <a
                href="https://forms.gle/Sk9JS3kcKe8qw1cU6"
                className="!no-underline"
              >
                · Click here to join our mailing list!
              </a>
            </button>

            <div
              className="!flex !flex-col"
              role="tablist"
              aria-label="How MYResearchGuide works"
            >
              {features.map((feature, index) => {
                const isActive = activeTab === index;
                const panelId = `stats-panel-${index}`;
                const tabId = `stats-tab-${index}`;

                return (
                  <div
                    key={index}
                    className="!group !border-t !border-[#222] !py-8 !transition-all !duration-300"
                  >
                    <button
                      type="button"
                      role="tab"
                      id={tabId}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      aria-selected={isActive}
                      aria-controls={panelId}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => selectTab(index)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                          e.preventDefault();
                          selectTab((index + 1) % features.length, {
                            focus: true,
                          });
                        } else if (
                          e.key === "ArrowUp" ||
                          e.key === "ArrowLeft"
                        ) {
                          e.preventDefault();
                          selectTab(
                            (index - 1 + features.length) % features.length,
                            { focus: true }
                          );
                        } else if (e.key === "Home") {
                          e.preventDefault();
                          selectTab(0, { focus: true });
                        } else if (e.key === "End") {
                          e.preventDefault();
                          selectTab(features.length - 1, { focus: true });
                        }
                      }}
                      className="!w-full !text-left !bg-transparent !border-0 !p-0 !cursor-pointer"
                    >
                      <h3
                        className={`!text-xl !font-medium !transition-colors !duration-300 ${
                          isActive
                            ? "!text-white"
                            : "!text-[#444] group-hover:!text-white"
                        }`}
                      >
                        {feature.title}
                      </h3>
                    </button>

                    {/* Accessible active-tab progress indicator */}
                    <div
                      className="!relative !mt-3 !h-[2px] !w-full !bg-[#222] !overflow-hidden !rounded-full"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={isActive ? Math.round(displayProgress) : 0}
                      aria-label={
                        isActive
                          ? `Auto-advance progress for ${feature.title}`
                          : undefined
                      }
                      aria-hidden={!isActive}
                    >
                      {isActive && (
                        <div
                          className="!absolute !inset-y-0 !left-0 !bg-spektr-cyan !h-full"
                          style={{
                            width: `${displayProgress}%`,
                            transition: reduceMotion
                              ? "none"
                              : "width 80ms linear",
                          }}
                        />
                      )}
                    </div>

                    <div
                      role="tabpanel"
                      id={panelId}
                      aria-labelledby={tabId}
                      hidden={!isActive}
                      className="!overflow-hidden"
                    >
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            key={`desc-${index}`}
                            initial={
                              reduceMotion
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 8 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            exit={
                              reduceMotion
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: -6 }
                            }
                            transition={{
                              duration: reduceMotion ? 0 : 0.28,
                              ease: "easeOut",
                            }}
                            className="!mt-4"
                          >
                            <p className="!text-[#888] !text-base !leading-relaxed">
                              {feature.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
              <div className="!border-t !border-[#222]"></div>
            </div>
          </div>

          {/* Right Side: Media Display (9/12 columns) */}
          <div className="lg:!col-span-9 !relative !w-full">
            <div className="!mt-0 md:!mt-40 !relative !rounded-2xl !overflow-hidden !bg-[#111] !border !border-[#222] !shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="!aspect-[16/9] !w-full !flex !items-center !justify-center !bg-black !relative">
                <AnimatePresence mode="wait">
                  <motion.video
                    key={activeTab}
                    src={features[activeTab].video}
                    aria-label={features[activeTab].title}
                    autoPlay={!reduceMotion}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    initial={
                      reduceMotion
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 1.04 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      reduceMotion
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.98 }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.45,
                      ease: "easeOut",
                    }}
                    className="!w-full !h-full !object-cover !absolute !inset-0"
                  />
                </AnimatePresence>
              </div>
            </div>

            <div className="!absolute !-inset-4 !bg-blue-500/5 !blur-3xl !-z-10 !rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cards;
