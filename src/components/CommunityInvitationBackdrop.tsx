"use client";

import { useEffect, useRef } from "react";
import { useHydrationSafeReducedMotion } from "./ui/use-hydration-safe-reduced-motion";
import styles from "./CommunityInvitation.module.css";

const SCREEN = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const FRAME_INTERVAL_MS = 1000 / 30;
const PHASE_PER_MS = 0.00072;
type Dot = { x: number; y: number; phaseX: number; phaseY: number; threshold: number };

export default function CommunityInvitationBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const reducedMotion = useHydrationSafeReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let visible = false;
    let frame = 0;
    let lastPaint = 0;
    let disposed = false;

    const paint = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      // Coherent waves form a moving, ordered halftone. No random frame noise
      // or hard threshold changes: dots fade as the density passes them.
      const time = timeRef.current;
      for (const dot of dots) {
        const field = 0.46
          + 0.3 * Math.sin(dot.phaseX + time) * Math.cos(dot.phaseY - time * 0.5)
          + 0.19 * Math.sin(dot.phaseX * 0.7 + dot.phaseY * 1.3 + time * 0.5);
        const density = Math.max(0, (field - 0.22) * 1.15);
        const amount = Math.min(1, Math.max(0, (density - dot.threshold + 0.09) / 0.18));
        const alpha = amount * amount * (3 - 2 * amount);
        if (alpha < 0.01) continue;
        const shade = Math.round(5 + alpha * (68 + density * 65));
        ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
        ctx.fillRect(dot.x, dot.y, 1.8, 1.8);
      }
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      dots = [];
      const pitch = width < 600 ? 4.5 : 4;
      for (let row = 0; row < height / pitch; row++) {
        for (let col = 0; col < width / pitch; col++) {
          const x = col * pitch + 1;
          const y = row * pitch + 1;
          dots.push({
            x, y,
            phaseX: x / 150 + y / 240,
            phaseY: y / 90 - x / 380,
            threshold: (SCREEN[(row % 4) * 4 + col % 4] + 0.5) / 16,
          });
        }
      }
      paint();
    };

    const tick = (now: number) => {
      if (disposed) return;
      const elapsed = now - lastPaint;
      if (elapsed >= FRAME_INTERVAL_MS) {
        // Three times the original drift, with more frequent paints so the
        // moving halftone stays smooth rather than flickering between states.
        timeRef.current += Math.min(elapsed, 100) * PHASE_PER_MS;
        lastPaint = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (visible && !document.hidden && !reducedMotion) {
        lastPaint = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 });
    const sizing = new ResizeObserver(resize);
    visibility.observe(canvas);
    sizing.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      sizing.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reducedMotion]);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />
    </>
  );
}
