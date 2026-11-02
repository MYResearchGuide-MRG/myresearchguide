/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useId, useRef } from "react";
import { useHydrationSafeReducedMotion } from "./ui/use-hydration-safe-reduced-motion";
import styles from "./MysspNetworkGraphic.module.css";

// Abstract nodes, independent of the programme's people or projects.
const NODES = [
  { x: .22, y: .19, radius: 19, phase: .2 },
  { x: .65, y: .14, radius: 14, phase: 1.8 },
  { x: .85, y: .37, radius: 22, phase: 3.4 },
  { x: .76, y: .76, radius: 17, phase: 4.9 },
  { x: .39, y: .85, radius: 12, phase: 2.3 },
  { x: .13, y: .64, radius: 23, phase: 5.6 },
];
type Point = { x: number; y: number };
function curvePoint(start: Point, bend: Point, end: Point, t: number) {
  const q = 1 - t;
  return { x: q * q * start.x + 2 * q * t * bend.x + t * t * end.x,
    y: q * q * start.y + 2 * q * t * bend.y + t * t * end.y };
}

export default function MysspNetworkGraphic() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const helpId = useId();
  const reducedMotion = useHydrationSafeReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!host || !canvas || !ctx) return;
    let width = 0, height = 0, elapsed = 0, frame = 0, last = 0;
    let visible = false;
    let field: { x: number; y: number; wave: number; falloff: number }[] = [];
    const offsets = NODES.map(() => ({ x: 0, y: 0, releaseAt: 0 }));
    let positions: Point[] = [];
    let pointer: Point | null = null;
    let hovered = -1, focused = -1;
    let drag: { index: number; pointerId: number; dx: number; dy: number } | null = null;
    let pulse = { index: -1, started: 0 };

    function basePosition(index: number) {
      const node = NODES[index];
      const scale = Math.min(width / 600, height / 460);
      const t = elapsed / 1000;
      return {
        x: node.x * width + Math.sin(t * .44 + node.phase) * 11 * scale,
        y: node.y * height + Math.cos(t * .36 + node.phase) * 12 * scale,
      };
    }

    function moveNode(index: number, x: number, y: number) {
      const base = basePosition(index);
      const inset = Math.max(26, NODES[index].radius * Math.min(width / 600, height / 460) + 10);
      offsets[index].x = (Math.max(inset, Math.min(width - inset, x)) - base.x) / width;
      offsets[index].y = (Math.max(inset, Math.min(height - 36, y)) - base.y) / height;
    }

    function paint() {
      if (!ctx || !width || !height) return;
      const t = elapsed / 1000;
      const scale = Math.min(width / 600, height / 460);
      const centre = { x: width / 2, y: height / 2 };
      ctx.clearRect(0, 0, width, height);
      // A deterministic halftone cloud. Smooth changes avoid random-frame flicker.
      for (const point of field) {
        const density = (Math.sin(point.wave + t * .32) + 1) / 2;
        const proximity = pointer && !reducedMotion ? Math.max(0, 1 - Math.hypot(point.x - pointer.x, point.y - pointer.y) / 95) : 0;
        const alpha = Math.max(0, density - .28) * (1.1 + proximity * .7) * point.falloff;
        if (alpha < .018) continue;
        ctx.fillStyle = `rgba(210,210,210,${alpha})`;
        ctx.fillRect(Math.round(point.x), Math.round(point.y), 1.6, 1.6);
      }
      const nodes = NODES.map((_, index) => {
        const base = basePosition(index);
        const node = { x: base.x + offsets[index].x * width, y: base.y + offsets[index].y * height };
        const control = nodeRefs.current[index];
        if (control) {
          control.style.left = `${node.x}px`;
          control.style.top = `${node.y}px`;
          control.style.width = control.style.height = `${Math.max(44, (NODES[index].radius + 8) * scale * 2)}px`;
        }
        return node;
      });
      positions = nodes;

      function connection(start: Point, end: Point, bend: Point, index: number, secondary = false) {
        if (!ctx) return;
        const steps = Math.ceil(Math.hypot(end.x - start.x, end.y - start.y) / 4);
        const active = index === drag?.index || index === hovered || index === focused;
        ctx.fillStyle = secondary ? "#4b4b4b" : active ? "#eee" : "#949494";
        for (let step = 0; step <= steps; step++) {
          const p = curvePoint(start, bend, end, step / steps);
          ctx.fillRect(Math.round(p.x), Math.round(p.y), 1.5, 1.5);
        }
        if (secondary) return;
        const progress = (t * .17 + index * .16) % 1;
        const p = curvePoint(start, bend, end, progress);
        ctx.fillStyle = "#ededed";
        ctx.fillRect(Math.round(p.x - 1), Math.round(p.y - 1), 3, 3);
      }

      nodes.forEach((node, index) => {
        const bend = { x: centre.x + (node.x - centre.x) * .18,
          y: node.y + (index % 2 ? 32 : -32) * scale };
        connection(centre, node, bend, index);
        if (index % 2 === 0) {
          const next = nodes[(index + 1) % nodes.length];
          connection(node, next, { x: (node.x + next.x) / 2, y: Math.min(node.y, next.y) - 22 * scale }, index, true);
        }
      });

      nodes.forEach((node, index) => {
        const radius = NODES[index].radius * scale;
        const active = index === drag?.index || index === hovered || index === focused;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
        ctx.fill();
        // Concentric pixel rings keep the objects distinct from UI buttons.
        for (let ring = 0; ring < 2; ring++) {
          const r = radius + ring * 5 * scale;
          const count = Math.max(12, Math.round(2 * Math.PI * r / 4));
          ctx.fillStyle = ring === 0 ? active ? "#fff" : "#c6c6c6" : active ? "#aaa" : "#555";
          for (let dot = 0; dot < count; dot++) {
            const angle = dot / count * Math.PI * 2 + t * .12 * (index % 2 ? 1 : -1);
            ctx.fillRect(Math.round(node.x + Math.cos(angle) * r), Math.round(node.y + Math.sin(angle) * r), 1.6, 1.6);
          }
        }
        ctx.fillStyle = "#ddd";
        const core = Math.max(4, 6 * scale);
        ctx.fillRect(Math.round(node.x - core / 2), Math.round(node.y - core / 2), core, core);
        const pulseAge = (performance.now() - pulse.started) / 650;
        if (!reducedMotion && pulse.index === index && pulseAge < 1) {
          const r = radius + 8 + pulseAge * 22;
          ctx.fillStyle = `rgba(230,230,230,${(1 - pulseAge) * .65})`;
          for (let dot = 0; dot < 32; dot++) {
            const angle = dot / 32 * Math.PI * 2;
            ctx.fillRect(Math.round(node.x + Math.cos(angle) * r), Math.round(node.y + Math.sin(angle) * r), 1.6, 1.6);
          }
        }
      });

      // Leave a quiet centre so the official mark stays legible over the particles.
      const halo = ctx.createRadialGradient(centre.x, centre.y, 24 * scale, centre.x, centre.y, 66 * scale);
      halo.addColorStop(0, "#000");
      halo.addColorStop(.55, "#000000f5");
      halo.addColorStop(1, "#00000000");
      ctx.fillStyle = halo;
      ctx.fillRect(centre.x - 70 * scale, centre.y - 70 * scale, 140 * scale, 140 * scale);
    }

    function tick(now: number) {
      if (now - last >= 1000 / 30) {
        const dt = Math.min(now - last, 80);
        if (!drag) elapsed += dt;
        offsets.forEach((offset, index) => {
          if (drag?.index === index || now < offset.releaseAt) return;
          const decay = Math.exp(-dt / 420);
          offset.x *= decay;
          offset.y *= decay;
        });
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

    function nodeIndex(target: EventTarget | null) {
      const button = target instanceof Element ? target.closest<HTMLButtonElement>("button[data-network-node]") : null;
      return button && host?.contains(button) ? Number(button.dataset.networkNode) : -1;
    }
    function localPoint(event: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    function pointerDown(event: PointerEvent) {
      const index = nodeIndex(event.target);
      if (index < 0 || drag || !event.isPrimary || event.button !== 0 || !positions[index]) return;
      const p = localPoint(event);
      drag = { index, pointerId: event.pointerId, dx: p.x - positions[index].x, dy: p.y - positions[index].y };
      pointer = p;
      pulse = { index, started: performance.now() };
      host!.dataset.dragging = "true";
      nodeRefs.current[index]?.focus({ preventScroll: true });
      host!.setPointerCapture(event.pointerId);
      event.preventDefault();
      paint();
    }
    function pointerMove(event: PointerEvent) {
      if (drag && event.pointerId !== drag.pointerId) return;
      const p = localPoint(event);
      pointer = event.pointerType === "touch" && !drag ? null : p;
      hovered = drag?.index ?? nodeIndex(event.target);
      if (drag) {
        moveNode(drag.index, p.x - drag.dx, p.y - drag.dy);
        event.preventDefault();
      }
      // Reduced-motion mode redraws only in response to interaction.
      if (reducedMotion || drag) paint();
    }
    function releaseDrag() {
      if (!drag) return;
      const { index, pointerId } = drag;
      offsets[index].releaseAt = performance.now() + 650;
      drag = null;
      delete host!.dataset.dragging;
      if (host!.hasPointerCapture(pointerId)) host!.releasePointerCapture(pointerId);
      pointer = null;
      hovered = -1;
      paint();
    }
    function pointerUp(event: PointerEvent) {
      if (event.pointerId === drag?.pointerId) releaseDrag();
    }
    function pointerLeave() {
      if (drag) return;
      pointer = null;
      hovered = -1;
      paint();
    }
    function focusIn(event: FocusEvent) { focused = nodeIndex(event.target); paint(); }
    function focusOut() { focused = -1; paint(); }
    function activate(event: MouseEvent) {
      const index = nodeIndex(event.target);
      if (index < 0) return;
      pulse = { index, started: performance.now() };
      paint();
    }
    function keyDown(event: KeyboardEvent) {
      const index = nodeIndex(event.target);
      if (index < 0) return;
      if (event.key === "Escape") {
        releaseDrag();
        offsets.forEach(offset => { offset.x = 0; offset.y = 0; offset.releaseAt = 0; });
        paint();
        event.preventDefault();
        return;
      }
      const directions: Record<string, Point> = {
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      };
      const direction = directions[event.key];
      if (!direction || !positions[index]) return;
      event.preventDefault();
      const step = event.shiftKey ? 32 : 16;
      moveNode(index, positions[index].x + direction.x * step, positions[index].y + direction.y * step);
      offsets[index].releaseAt = performance.now() + 1000;
      paint();
    }
    function visibilityChange() { if (document.hidden) releaseDrag(); sync(); }
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      field = [];
      const pitch = width < 420 ? 4 : 4.5;
      for (let y = 2; y < height; y += pitch) {
        for (let x = 2; x < width; x += pitch) {
          const nx = x / width, ny = y / height;
          const radial = Math.hypot((nx - .5) * 1.7, (ny - .5) * 1.8);
          const falloff = Math.sqrt(Math.max(0, 1 - radial)) * Math.min(1, Math.min(nx, 1 - nx, ny, 1 - ny) * 10);
          field.push({ x, y, falloff,
            wave: Math.sin(nx * 13 + ny * 5) * 2.4 + Math.cos(ny * 16 - nx * 4) * 1.8 + nx * 9 });
        }
      }
      paint();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) releaseDrag(); sync(); });
    resize.observe(host);
    observer.observe(host);
    host.addEventListener("pointerdown", pointerDown);
    host.addEventListener("pointermove", pointerMove);
    host.addEventListener("pointerup", pointerUp);
    host.addEventListener("pointercancel", pointerUp);
    host.addEventListener("lostpointercapture", pointerUp);
    host.addEventListener("pointerleave", pointerLeave);
    host.addEventListener("focusin", focusIn);
    host.addEventListener("focusout", focusOut);
    host.addEventListener("keydown", keyDown);
    host.addEventListener("click", activate);
    window.addEventListener("blur", releaseDrag);
    document.addEventListener("visibilitychange", visibilityChange);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      releaseDrag();
      host.removeEventListener("pointerdown", pointerDown);
      host.removeEventListener("pointermove", pointerMove);
      host.removeEventListener("pointerup", pointerUp);
      host.removeEventListener("pointercancel", pointerUp);
      host.removeEventListener("lostpointercapture", pointerUp);
      host.removeEventListener("pointerleave", pointerLeave);
      host.removeEventListener("focusin", focusIn);
      host.removeEventListener("focusout", focusOut);
      host.removeEventListener("keydown", keyDown);
      host.removeEventListener("click", activate);
      window.removeEventListener("blur", releaseDrag);
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, [reducedMotion]);

  return (
    <div ref={hostRef} className={styles.graphic} role="group" aria-label="Interactive MYSSP graph" aria-describedby={helpId}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <img src="/brands/myssp-mark.png" className={styles.mark} alt="" width="392" height="431" loading="lazy" />
      {NODES.map((node, index) => (
        <button key={index} ref={element => { nodeRefs.current[index] = element; }}
          type="button" className={styles.node} data-network-node={index}
          style={{ left: `${node.x * 100}%`, top: `${node.y * 100}%` }}
          aria-label={`Move graph node ${index + 1}`} aria-describedby={helpId} />
      ))}
      <span className={styles.hint} aria-hidden="true">Drag the nodes to explore</span>
      <span id={helpId} className={styles.srOnly}>Drag a node, or focus it and use the arrow keys to move it. Press Escape to reset the graph.</span>
    </div>
  );
}
