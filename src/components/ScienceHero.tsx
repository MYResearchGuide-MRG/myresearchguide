"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { HANDBOOK_URL } from "@/data/handbook-preview";
import { useHydrationSafeReducedMotion } from "./ui/use-hydration-safe-reduced-motion";
import AskAiButton from "./AskAiButton";
import styles from "./ScienceHero.module.css";

export default function ScienceHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useHydrationSafeReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    let disposed = false;
    let frameCallback = 0;
    let paintCallback = 0;
    let frames = 0;
    let revealed = false;

    const reveal = () => {
      if (disposed || revealed) return;
      revealed = true;
      setVideoReady(true);
    };
    const confirmFrame = () => {
      if (disposed) return;
      frames += 1;
      // A play/canplay event is not proof that the decoder has painted.
      // Keep an opaque, matching still over the video through its first frames.
      if (frames < 3) {
        frameCallback = video.requestVideoFrameCallback(confirmFrame);
      } else {
        paintCallback = requestAnimationFrame(() => {
          paintCallback = requestAnimationFrame(reveal);
        });
      }
    };
    const prepare = () => {
      if (revealed || disposed) return;
      if (typeof video.requestVideoFrameCallback === "function") {
        video.cancelVideoFrameCallback(frameCallback);
        frameCallback = video.requestVideoFrameCallback(confirmFrame);
      } else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        cancelAnimationFrame(paintCallback);
        paintCallback = requestAnimationFrame(() => {
          paintCallback = requestAnimationFrame(reveal);
        });
      }
    };
    video.addEventListener("playing", prepare);
    if (!video.paused) prepare();
    return () => {
      disposed = true;
      video.removeEventListener("playing", prepare);
      video.cancelVideoFrameCallback?.(frameCallback);
      cancelAnimationFrame(paintCallback);
    };
  }, [reduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;
    let visible = false;
    let disposed = false;

    const syncPlayback = () => {
      if (disposed) return;
      if (reduceMotion || document.hidden || !visible) {
        video.pause();
      } else {
        // Keep the poster visible if autoplay is blocked.
        void video.play().catch(() => {});
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.05 },
    );
    observer.observe(section);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="science-hero-title"
    >
      <div className={styles.backdrop} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          src={reduceMotion ? undefined : "/media/research-montage-dots-dense.mp4"}
          muted
          loop
          playsInline
          preload={reduceMotion ? "none" : "auto"}
          tabIndex={-1}
          onLoadStart={() => setVideoReady(false)}
          onError={() => setVideoReady(false)}
        />
        <div
          className={styles.poster}
          data-video-ready={videoReady && !reduceMotion}
        />
      </div>
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.content}>
        <h1 id="science-hero-title" className={styles.title}>
          <span>Malaysia&apos;s #1 Guide to</span>
          <span className={styles.colourLoop}>STEM Research.</span>
        </h1>
        <p className={styles.description}>
          MYResearchGuide is a free, beginner-friendly platform that helps
          Malaysian students start and grow in STEM research with practical
          steps, researcher insight, and a community built by Malaysians for
          Malaysians.
        </p>
        <div className={styles.actions}>
          <a
            href="https://myssp.myresearchguide.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primary}
          >
            Explore MYSSP <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a
            href={HANDBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Our Research Handbook <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <AskAiButton />
      </div>

    </section>
  );
}
