/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { mysspProjects } from "@/data/myssp-projects";
import { useHydrationSafeReducedMotion } from "./ui/use-hydration-safe-reduced-motion";
import styles from "./MysspMentorNetwork.module.css";

type Project = typeof mysspProjects[number];
// Stagger the portraits around a clear central space for the programme mark.
const POSITIONS = [[13,17],[36,12],[62,15],[85,20],[91,49],[81,79],[59,88],[34,85],[12,78],[9,47],[30,44],[70,49]];
const MOBILE_POSITIONS = [[17,10],[50,10],[83,10],[17,30],[50,30],[83,30],[17,70],[50,70],[83,70],[17,90],[50,90],[83,90]];
const shortName = (name: string) => name.replace(/^Assoc\. Prof\. Ir\. Ts\. Dr\. |^Prof\. |^Dr\. /, "");

export default function MysspMentorNetwork({ activeId, activeTrack, onSelect }: {
  activeId: string;
  activeTrack: string;
  onSelect: (project: Project) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const interacting = useRef(false);
  const reducedMotion = useHydrationSafeReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!host || !canvas || !ctx) return;
    let width = 0, height = 0, elapsed = 0, last = 0, frame = 0;
    let visible = false;
    let points: { x: number; y: number; wave: number; edge: number }[] = [];

    function paint() {
      if (!ctx || !canvas || !width) return;
      const t = elapsed / 1000;
      const compact = window.innerWidth < 600;
      const positions = compact ? MOBILE_POSITIONS : POSITIONS;
      ctx.clearRect(0, 0, width, height);
      // A slow, ordered halftone field. No random frame-to-frame flicker.
      for (const point of points) {
        const value = Math.sin(point.wave + t * .55) * .5 + .5;
        if (value < .48) continue;
        const alpha = (.07 + (value - .48) * .34) * point.edge;
        ctx.fillStyle = `rgba(210,210,210,${alpha.toFixed(3)})`;
        ctx.fillRect(point.x, point.y, 1.4, 1.4);
      }
      positions.forEach(([px, py], index) => {
        const dx = reducedMotion ? 0 : Math.sin(t * .45 + index * 1.7) * (compact ? 3 : 8);
        const dy = reducedMotion ? 0 : Math.cos(t * .37 + index * 1.3) * (compact ? 4 : 10);
        const node = nodeRefs.current[index];
        if (node) node.style.transform = `translate(-50%, -50%) translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
        const x = px + dx / width * 100;
        const y = py + dy / height * 100;
        pathRefs.current[index]?.setAttribute("d", `M 50 50 Q ${(50 + x) / 2} ${50 + (y - 50) * .22} ${x} ${y}`);
        // A few square signals travel out from the hub along the same curve.
        const p = (t * .12 + index / positions.length) % 1;
        const q = 1 - p;
        const cx = (50 + x) / 2, cy = 50 + (y - 50) * .22;
        const sx = (q * q * 50 + 2 * q * p * cx + p * p * x) * width / 100;
        const sy = (q * q * 50 + 2 * q * p * cy + p * p * y) * height / 100;
        ctx.fillStyle = "rgba(220,220,220,.65)";
        ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
      });
    }
    function tick(now: number) {
      if (now - last >= 1000 / 30) {
        if (!interacting.current) elapsed += Math.min(now - last, 60);
        last = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (visible && !document.hidden && !reducedMotion) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else paint();
    }
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = [];
      const pitch = width < 520 ? 7 : 6;
      for (let y = 3; y < height; y += pitch) {
        for (let x = 3; x < width; x += pitch) {
          const nx = x / width, ny = y / height;
          const edge = Math.min(1, Math.min(nx, 1 - nx, ny, 1 - ny) * 12);
          points.push({ x, y, edge, wave: Math.sin(nx * 11) * 2 + Math.cos(ny * 13) * 2 + (nx + ny) * 5 });
        }
      }
      paint();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    resize.observe(host);
    observer.observe(host);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reducedMotion]);

  return (
    <div ref={hostRef} className={styles.network} role="group" aria-label="MYSSP mentors. Select a portrait to explore their project.">
      <canvas ref={canvasRef} className={styles.field} aria-hidden="true" />
      <svg className={styles.connections} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {mysspProjects.map((project, index) => (
          <path key={project.id} ref={element => { pathRefs.current[index] = element; }}
            d={`M 50 50 L ${POSITIONS[index][0]} ${POSITIONS[index][1]}`}
            data-active={project.id === activeId} data-track={project.track === activeTrack} />
        ))}
      </svg>
      <div className={styles.hub} aria-hidden="true">
        <img src="/brands/myssp-mark.png" alt="" width="392" height="431" />
        <span>MYSSP</span>
        <small>2026</small>
      </div>
      {mysspProjects.map((project, index) => (
        <button key={project.id} ref={element => { nodeRefs.current[index] = element; }}
          type="button" className={styles.node}
          style={{ "--x": `${POSITIONS[index][0]}%`, "--y": `${POSITIONS[index][1]}%`, "--mobile-x": `${MOBILE_POSITIONS[index][0]}%`, "--mobile-y": `${MOBILE_POSITIONS[index][1]}%` } as CSSProperties}
          aria-label={`${project.mentor}. ${project.code}: ${project.title}`}
          aria-pressed={project.id === activeId} aria-controls="myssp-track-details"
          data-track={project.track === activeTrack}
          onClick={() => onSelect(project)}
          onPointerEnter={() => { interacting.current = true; }}
          onPointerLeave={() => { interacting.current = false; }}
          onFocus={() => { interacting.current = true; }}
          onBlur={() => { interacting.current = false; }}>
          <span className={styles.portrait}>
            <img src={project.portrait} alt="" width="240" height="240" loading="lazy" />
            <span className={styles.code}>{project.code}</span>
          </span>
          <span className={styles.name}>{shortName(project.mentor)}</span>
        </button>
      ))}
    </div>
  );
}
