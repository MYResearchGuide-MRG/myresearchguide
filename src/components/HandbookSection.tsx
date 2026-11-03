"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Geist } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import { HANDBOOK_URL, handbookGroups } from "@/data/handbook-preview";
import { useHydrationSafeReducedMotion } from "./ui/use-hydration-safe-reduced-motion";
import styles from "./HandbookSection.module.css";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const pages = handbookGroups.flatMap(group => group.pages);
const features = [
  {
    id: "start", title: "Find your starting point", chapter: "getting-started",
    description: "Explore ways to start researching, from an independent project to joining a lab. Learn how to approach a potential mentor.",
  },
  {
    id: "topic", title: "Turn a question into a project", chapter: "topic",
    description: "Find a research question and plan a method that fits your time, equipment and budget.",
  },
  {
    id: "write", title: "Write it. Share it.", chapter: "proposal",
    description: "Write a clear proposal, understand papers and peer review, and get started with LaTeX.",
  },
  {
    id: "people", title: "Learn from people doing the work", chapter: "conversations",
    description: "Read Malaysian researchers' stories and find STEM programmes, competitions and opportunities.",
  },
] as const;

export default function HandbookSection() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const featureRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useHydrationSafeReducedMotion();
  const feature = features[active];
  const chapter = pages.find(page => page.id === feature.chapter)!;
  const shouldPlay = inView && pageVisible && !reducedMotion && !mediaError;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      setInView(visible);
      if (entry.isIntersecting) setHasEntered(true);
    }, { threshold: [0, 0.15] });
    observer.observe(section);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      // The still preview remains available when autoplay is blocked.
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldPlay, active, hasEntered]);

  function selectFeature(index: number) {
    if (index === active) return;
    setReady(false);
    setMediaError(false);
    setActive(index);
  }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowDown") next = (index + 1) % features.length;
    else if (event.key === "ArrowUp") next = (index + features.length - 1) % features.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = features.length - 1;
    else return;
    event.preventDefault();
    selectFeature(next);
    featureRefs.current[next]?.focus();
  }

  return (
    <section ref={sectionRef} id="handbook" className={`${geist.className} ${styles.section}`} aria-labelledby="handbook-heading">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="handbook-heading">The MYResearchGuide Handbook</h2>
        </header>

        <div className={styles.showcase}>
          <div className={styles.features}>
            <div className={styles.featureList} aria-label="Explore handbook features">
              <div className={styles.introduction}>
                <h3>Malaysia&apos;s 1st Guide to STEM Research</h3>
                <p>Written and curated by student researchers with years of STEM research experience in Malaysia. Proofread by 10+ experienced Malaysian researchers.</p>
              </div>
              {features.map((item, index) => {
                const selected = active === index;
                return (
                  <div key={item.id} className={styles.feature} data-active={selected}>
                    <div className={styles.featureHeading}>
                      <h3>
                        <button
                          ref={node => { featureRefs.current[index] = node; }}
                          id={`handbook-feature-${item.id}`}
                          type="button"
                          aria-expanded={selected}
                          aria-controls={`handbook-details-${item.id}`}
                          onClick={() => selectFeature(index)}
                          onKeyDown={event => handleKey(event, index)}
                        >
                          <span>{item.title}</span>
                        </button>
                      </h3>
                    </div>
                    <div id={`handbook-details-${item.id}`} className={styles.detail} aria-hidden={!selected}>
                      <div>
                        <p>{item.description}</p>
                      </div>
                    </div>
                    {selected ? <span className={styles.featureProgress} aria-hidden="true"><span key={item.id} ref={progressRef} /></span> : null}
                  </div>
                );
              })}
            </div>

            <div className={styles.access}>
              <a className={styles.fullHandbook} href={HANDBOOK_URL} target="_blank" rel="noopener noreferrer">
                Browse the full handbook <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className={styles.demo}>
            <div className={styles.window}>
              <div className={styles.film}>
                <video
                  key={feature.id}
                  ref={videoRef}
                  className={styles.video}
                  data-ready={ready}
                  src={hasEntered ? `/media/handbook/${feature.id}.mp4` : undefined}
                  poster={`/media/handbook/${feature.id}.webp`}
                  preload="metadata"
                  muted
                  playsInline
                  aria-label={`Silent walkthrough of ${chapter.title} in the MYResearchGuide Notion handbook`}
                  onLoadedData={() => setReady(true)}
                  onTimeUpdate={event => {
                    const video = event.currentTarget;
                    if (progressRef.current && video.duration) {
                      progressRef.current.style.transform = `scaleX(${Math.min(1, video.currentTime / video.duration)})`;
                    }
                  }}
                  onEnded={() => {
                    if (shouldPlay) selectFeature((active + 1) % features.length);
                  }}
                  onError={() => setMediaError(true)}
                />
                {mediaError ? (
                  <a className={styles.mediaFallback} href={chapter.url} target="_blank" rel="noopener noreferrer">
                    Read this chapter on Notion <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
