"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";
import AppWindow from "@/components/ui/AppWindow";
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
      title: "A step-by-step guide",
      description:
        "Navigate our guide content, from cold-emailing tips to publication pathways, broken down with connected pages, keyword definitions, and researcher tips.",
      video: "/gif2.mp4", // compressed from 20.9MB gif (656KB)
    },
    {
      title: "Conversations with researchers",
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
        base + (Date.now() - started),
      );
    };
  }, [reduceMotion, isPaused, cycleKey, activeTab, features.length]);

  const displayProgress = reduceMotion ? 100 : progress;

  return (
    <div>
      <h1 className="!mt-16 sm:!mt-24 md:!mt-40 !text-4xl sm:!text-5xl md:!text-[5rem] !max-w-none !font-regular !text-center !tracking-tighter !leading-tight !px-4">
        <span className="!text-spektr-cyan">
          The{" "}
          <span className="!font-semibold bg-gradient-to-r from-stone-400 to-slate-300 bg-clip-text text-transparent">
            MYResearchGuide
          </span>{" "}
          Handbook
        </span>
      </h1>

      <section
        ref={sectionRef}
        className="!text-white !px-4 sm:!px-6 md:!px-12 !py-12 md:!py-24 !overflow-x-clip"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(e) => {
          if (!sectionRef.current?.contains(e.relatedTarget)) {
            setIsPaused(false);
          }
        }}
      >
        <div className="!max-w-7xl !mx-auto !w-full">
          <div className="!grid !grid-cols-1 lg:!grid-cols-12 !gap-8 lg:!gap-14 !items-center">
            {/* Left: heading, then the feature list — only the active item expands */}
            <div className="lg:!col-span-5 !flex !flex-col">
              <h2 className="!text-3xl md:!text-5xl !font-bold !leading-tight !mb-3">
                Get started with science research{" "}
                <span className="!relative !inline-block !px-1">
                  one day
                  <motion.span
                    initial={reduceMotion ? false : { width: "0%" }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true, amount: "some" }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.5,
                      delay: reduceMotion ? 0 : 0.2,
                      ease: "easeInOut",
                    }}
                    className="!absolute !z-10 !left-0 !top-1/2 !h-[4px] !bg-red-500 !-translate-y-1/2"
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
              </h2>
              <p className="!text-[#a1a1a1] !text-lg !mb-8 !leading-relaxed">
                Stop wasting your money on scam programmes. Pursue real science
                research, with our guide, for free.
              </p>

              <a
                href="https://forms.gle/Sk9JS3kcKe8qw1cU6"
                target="_blank"
                rel="noopener noreferrer"
                className="!w-fit !px-6 !py-2 !border !border-[#333] !rounded-full !text-sm !font-medium !mb-10 !no-underline !text-white hover:!bg-white hover:!text-black !transition-all !duration-300"
              >
                · Click here to join our mailing list!
              </a>
              <div
                className="!flex !flex-col !gap-2"
                role="tablist"
                aria-label="What's inside the MYResearchGuide Handbook"
              >
                {features.map((feature, index) => {
                  const isActive = activeTab === index;
                  const panelId = `stats-panel-${index}`;
                  const tabId = `stats-tab-${index}`;

                  return (
                    <div
                      key={index}
                      className={`!rounded-xl !px-5 !py-5 !transition-colors !duration-300 ${
                        isActive ? "!bg-white/[0.04]" : "hover:!bg-white/[0.02]"
                      }`}
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
                              { focus: true },
                            );
                          } else if (e.key === "Home") {
                            e.preventDefault();
                            selectTab(0, { focus: true });
                          } else if (e.key === "End") {
                            e.preventDefault();
                            selectTab(features.length - 1, { focus: true });
                          }
                        }}
                        className="!w-full !flex !items-center !justify-between !gap-4 !text-left !bg-transparent !border-0 !p-0 !cursor-pointer"
                      >
                        <h3
                          className={`!text-lg md:!text-xl !font-semibold !m-0 !transition-colors !duration-300 ${
                            isActive ? "!text-white" : "!text-zinc-500"
                          }`}
                        >
                          {feature.title}
                        </h3>
                        <span
                          aria-hidden
                          className={`!text-xs !transition-all !duration-300 ${
                            isActive
                              ? "!text-zinc-300 !rotate-90"
                              : "!text-zinc-600"
                          }`}
                        >
                          ▷
                        </span>
                      </button>

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
                                  ? { opacity: 1, height: "auto" }
                                  : { opacity: 0, height: 0 }
                              }
                              animate={{ opacity: 1, height: "auto" }}
                              exit={
                                reduceMotion
                                  ? { opacity: 1, height: "auto" }
                                  : { opacity: 0, height: 0 }
                              }
                              transition={{
                                duration: reduceMotion ? 0 : 0.3,
                                ease: "easeOut",
                              }}
                            >
                              <p className="!mt-3 !mb-0 !text-zinc-400 !text-[15px] !leading-relaxed">
                                {feature.description}
                              </p>
                              {/* Auto-advance progress */}
                              <div
                                className="!relative !mt-5 !h-[2px] !w-full !bg-white/10 !overflow-hidden !rounded-full"
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={Math.round(displayProgress)}
                                aria-label={`Auto-advance progress for ${feature.title}`}
                              >
                                <div
                                  className="!absolute !inset-y-0 !left-0 !bg-white/70 !h-full"
                                  style={{
                                    width: `${displayProgress}%`,
                                    transition: reduceMotion
                                      ? "none"
                                      : "width 80ms linear",
                                  }}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: app window with the active feature's recording */}
            <div className="lg:!col-span-7 !w-full">
              <AppWindow url="myresearchguide.notion.site">
                <div className="!aspect-[16/10] !w-full !relative !bg-black">
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
                          : { opacity: 0, scale: 1.02 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={
                        reduceMotion
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.99 }
                      }
                      transition={{
                        duration: reduceMotion ? 0 : 0.4,
                        ease: "easeOut",
                      }}
                      className="!w-full !h-full !object-cover !object-left-top !absolute !inset-0"
                    />
                  </AnimatePresence>
                </div>
              </AppWindow>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cards;
