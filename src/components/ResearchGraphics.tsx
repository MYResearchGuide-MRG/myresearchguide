"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Pause, Play } from "lucide-react";
import { useHydrationSafeReducedMotion } from "./ui/use-hydration-safe-reduced-motion";
import styles from "./ResearchGraphics.module.css";

type Graphic = "orbits" | "wave" | "helix";
type Point = { x: number; y: number; z: number };

const GraphicsContext = createContext({
  animate: false,
  paused: false,
  reducedMotion: false,
  toggle: () => {},
});

export function ResearchGraphicsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [paused, setPaused] = useState(false);
  const reducedMotion = useHydrationSafeReducedMotion();
  const toggle = useCallback(() => setPaused((value) => !value), []);
  const value = useMemo(
    () => ({
      animate: !paused && !reducedMotion,
      paused,
      reducedMotion,
      toggle,
    }),
    [paused, reducedMotion, toggle],
  );
  return (
    <GraphicsContext.Provider value={value}>
      {children}
    </GraphicsContext.Provider>
  );
}

export function GraphicsToggle() {
  const { paused, reducedMotion, toggle } = useContext(GraphicsContext);
  if (reducedMotion) return null;
  return (
    <button
      className={styles.toggle}
      type="button"
      onClick={toggle}
      aria-pressed={paused}
    >
      {paused ? (
        <Play size={12} aria-hidden />
      ) : (
        <Pause size={12} aria-hidden />
      )}
      {paused ? "Play dot effects" : "Pause dot effects"}
    </button>
  );
}

// Precomputed surfaces keep trigonometry out of the per-particle animation loop.
function orbitalSurface(columns: number, rows: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < columns; i++) {
    const u = (i / columns) * Math.PI * 2;
    for (let j = 0; j < rows; j++) {
      const v = (j / rows) * Math.PI * 2;
      const radius = 0.73 + 0.27 * Math.cos(v);
      points.push({
        x: radius * Math.cos(u),
        y: 0.27 * Math.sin(v),
        z: radius * Math.sin(u),
      });
    }
  }
  return points;
}

const SURFACE = orbitalSurface(100, 32);
const MOBILE_SURFACE = orbitalSurface(64, 22);
const TAU = Math.PI * 2;

function dot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number,
  size = 1.35,
) {
  if (alpha < 0.015) return;
  ctx.globalAlpha = Math.min(0.85, alpha);
  ctx.fillRect(x, y, size, size);
}

function drawOrbits(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
) {
  const mobile = w < 640;
  const points = mobile ? MOBILE_SURFACE : SURFACE;
  const radius = mobile ? w * 0.49 : Math.min(w * 0.27, 360);
  const yaw = time * 0.075;
  // Two opposing surfaces frame the copy, with a dark centre for reading.
  for (let side = 0; side < 2; side++) {
    const tilt = (side === 0 ? 0.7 : -0.65) + Math.sin(time * 0.16 + side) * 0.2;
    const angle = yaw + side * 1.4;
    const cy = Math.cos(angle),
      sy = Math.sin(angle);
    const cx = Math.cos(tilt),
      sx = Math.sin(tilt);
    const roll = side === 0 ? -0.55 : 0.55;
    const cr = Math.cos(roll),
      sr = Math.sin(roll);
    const originX = w * (side === 0 ? 0.035 : 0.965);
    const originY = h * (side === 0 ? 0.56 : 0.38);
    for (const p of points) {
      const x = p.x * cy - p.z * sy;
      const z = p.x * sy + p.z * cy;
      const y = p.y * cx - z * sx;
      const depth = p.y * sx + z * cx;
      const perspective = 1 / (1.9 - depth * 0.35);
      const px = originX + (x * cr - y * sr) * radius * 1.7 * perspective;
      const py = originY + (x * sr + y * cr) * radius * 1.7 * perspective;
      const edge = Math.pow(Math.abs(px / w - 0.5) * 2, 1.6);
      const fadeY = Math.max(0, Math.min(1, py / 80, (h - py) / 90));
      dot(
        ctx,
        px,
        py,
        (0.3 + (depth + 1) * 0.28) * edge * fadeY,
        mobile ? 1.1 : 1.5,
      );
    }
  }
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
) {
  const columns = w < 640 ? 64 : 140;
  const rows = w < 640 ? 20 : 34;
  for (let row = 0; row < rows; row++) {
    const v = row / (rows - 1);
    for (let col = 0; col < columns; col++) {
      const u = col / (columns - 1);
      const swell = Math.sin(u * TAU * 1.3 + v * 2.4 - time * 0.22);
      const ripple = Math.cos(u * TAU * 2.1 - v * 3.2 + time * 0.16);
      const x = u * (w + 50) - 25;
      const y = h * (0.32 + v * 0.3) + swell * h * 0.18 + ripple * h * 0.055;
      const edge = Math.pow(Math.sin(u * Math.PI), 0.5);
      const depth = Math.sin(v * Math.PI);
      dot(ctx, x, y, (0.18 + 0.58 * depth) * edge, 1.1 + v * 0.65);
    }
  }
}

function drawHelix(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
) {
  const steps = w < 640 ? 86 : 180;
  const amplitude = h * 0.22;
  for (let i = 0; i < steps; i++) {
    const u = i / (steps - 1);
    const phase = u * TAU * 1.4 + time * 0.13;
    const x = w * u;
    const fade = 0.5 + 0.5 * Math.sin(u * Math.PI);
    for (let strand = 0; strand < 2; strand++) {
      const angle = phase + strand * Math.PI;
      for (let band = -3; band <= 3; band++) {
        const y = h * 0.5 + Math.sin(angle) * amplitude + band * 3;
        dot(
          ctx,
          x,
          y,
          (0.4 + (Math.cos(angle) + 1) * 0.24) *
            fade *
            (1 - Math.abs(band) * 0.16),
          1.4,
        );
      }
    }
    if (i % 7 === 0) {
      const from = h * 0.5 + Math.sin(phase) * amplitude;
      const to = h - from;
      for (let j = 1; j < 16; j++)
        dot(ctx, x, from + ((to - from) * j) / 16, 0.22 * fade, 1.15);
    }
  }
}

const DRAW: Record<Graphic, typeof drawOrbits> = {
  orbits: drawOrbits,
  wave: drawWave,
  helix: drawHelix,
};

export function ResearchDots({
  variant,
  className = "",
}: {
  variant: Graphic;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const { animate } = useContext(GraphicsContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0,
      height = 0,
      frame = 0,
      lastPaint = 0,
      visible = false;
    let ratio = 1;
    const paint = () => {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#cdd7e3";
      DRAW[variant](ctx, width, height, timeRef.current);
      ctx.globalAlpha = 1;
    };
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const elapsed = now - lastPaint;
      if (elapsed < 1000 / 24) return;
      // Discard hidden-tab time so returning to the page never jumps forward.
      timeRef.current += Math.min(elapsed, 65) / 1000;
      lastPaint = now;
      paint();
    };
    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (animate && visible && !document.hidden) {
        lastPaint = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      // A capped backing resolution and fewer phone particles keep this lightweight.
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      paint();
    };
    const resizeObserver = new ResizeObserver(resize);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", syncPlayback);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [animate, variant]);

  return (
    <div
      className={`${styles.graphic} ${className}`}
      aria-hidden="true"
      data-research-graphic={variant}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
