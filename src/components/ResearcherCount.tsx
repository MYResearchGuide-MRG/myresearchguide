"use client";

import { useEffect, useRef, useState } from "react";
import { useHydrationSafeReducedMotion } from "./ui/use-hydration-safe-reduced-motion";
import styles from "./Community.module.css";

const TARGET = 40;
const DURATION_MS = 1350;
const ENTER_DELAY_MS = 150;

export default function ResearcherCount() {
  const elementRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const valueRef = useRef(0);
  const [value, setValue] = useState(0);
  const reducedMotion = useHydrationSafeReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || reducedMotion || valueRef.current === TARGET) return;
    let frame = 0;
    let startTimer: ReturnType<typeof setTimeout> | null = null;
    let lastTime = 0;
    let visible = false;

    const tick = (now: number) => {
      elapsedRef.current = Math.min(DURATION_MS, elapsedRef.current + now - lastTime);
      lastTime = now;
      const progress = elapsedRef.current / DURATION_MS;
      const next = Math.floor(TARGET * (1 - (1 - progress) ** 2));
      if (next !== valueRef.current) {
        valueRef.current = next;
        setValue(next);
      }
      frame = next < TARGET ? requestAnimationFrame(tick) : 0;
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (startTimer !== null) clearTimeout(startTimer);
      startTimer = null;
      if (!visible || document.hidden || valueRef.current === TARGET) return;
      // Ignore brief crossings during a fast scroll or an anchor jump.
      startTimer = setTimeout(() => {
        startTimer = null;
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }, ENTER_DELAY_MS);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.85;
      sync();
    }, { threshold: 0.85, rootMargin: "-100px 0px -80px 0px" });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelAnimationFrame(frame);
      if (startTimer !== null) clearTimeout(startTimer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reducedMotion]);

  return (
    <span ref={elementRef} className={styles.researcherCount}>
      <span className={styles.countAccessible}>More than 40</span>
      <strong aria-hidden="true">
        <span className={styles.countNumber}>{reducedMotion ? TARGET : value}</span><span>+</span>
      </strong>
    </span>
  );
}
