/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useHydrationSafeReducedMotion } from "./ui/use-hydration-safe-reduced-motion";
import styles from "./Community.module.css";

const TAU = Math.PI * 2;
const RADIANS = Math.PI / 180;
const SPIN_SPEED = 0.000085;
const RESUME_DELAY_MS = 700;
const SIZE = { width: 480, height: 440, radius: 164, cx: 240, cy: 218 };
const SCREEN = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const LOCATIONS = [
  // Audited against the published directory's institution affiliations.
  // See docs/community-globe-locations.md for the country/source mapping.
  { name: "Malaysia", flag: "my", lat: 4.21, lon: 101.98, dx: -52, dy: -28 },
  { name: "Singapore", flag: "sg", lat: 1.35, lon: 103.82, dx: 54, dy: 24 },
  { name: "Australia", flag: "au", lat: -25.27, lon: 133.78, dx: 42, dy: 34 },
  { name: "China", flag: "cn", lat: 35.86, lon: 104.2, dx: 46, dy: -30 },
  { name: "France", flag: "fr", lat: 46.23, lon: 2.21, dx: -54, dy: -12 },
  { name: "United Kingdom", flag: "gb", lat: 54.5, lon: -2.5, dx: -60, dy: -50 },
  { name: "Germany", flag: "de", lat: 51.16, lon: 10.45, dx: 70, dy: -20 },
  { name: "United States", flag: "us", lat: 39.83, lon: -98.58, dx: -36, dy: 28 },
  { name: "Canada", flag: "ca", lat: 56.13, lon: -106.35, dx: -44, dy: -40 },
];
type Orientation = { longitude: number; tilt: number };
type Drag = Orientation & { x: number; y: number; id: number; width: number };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const angleDifference = (target: number, current: number) => Math.atan2(Math.sin(target - current), Math.cos(target - current));

function project(location: typeof LOCATIONS[number], longitude: number, tilt: number) {
  const lat = location.lat * RADIANS;
  const lon = location.lon * RADIANS - longitude;
  const x = Math.cos(lat) * Math.sin(lon);
  const y = Math.sin(lat) * Math.cos(tilt) - Math.cos(lat) * Math.cos(lon) * Math.sin(tilt);
  const z = Math.sin(lat) * Math.sin(tilt) + Math.cos(lat) * Math.cos(lon) * Math.cos(tilt);
  return { x: SIZE.cx + SIZE.radius * x, y: SIZE.cy - SIZE.radius * y, z };
}

function paintGlobe(ctx: CanvasRenderingContext2D, mask: ImageData, longitude: number, tilt: number, selected: number | null) {
  const { width, height, radius, cx, cy } = SIZE;
  const cosTilt = Math.cos(tilt);
  const sinTilt = Math.sin(tilt);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#cecece";
  const pitch = 2.5;
  ctx.beginPath();
  for (let row = 0; row < height / pitch; row++) {
    const py = (row + 0.5) * pitch;
    const y = (cy - py) / radius;
    for (let col = 0; col < width / pitch; col++) {
      const px = (col + 0.5) * pitch;
      const x = (px - cx) / radius;
      const distance = x * x + y * y;
      if (distance >= 1) continue;
      const z = Math.sqrt(1 - distance);
      const lat = Math.asin(clamp(y * cosTilt + z * sinTilt, -1, 1));
      const lon = Math.atan2(x, z * cosTilt - y * sinTilt) + longitude;
      const u = ((lon / TAU + 0.5) % 1 + 1) % 1;
      const v = 0.5 - lat / Math.PI;
      const index = (Math.min(mask.height - 1, Math.floor(v * mask.height)) * mask.width + Math.floor(u * mask.width)) * 4;
      const land = mask.data[index] > 128;
      const meridian = Math.abs(Math.sin(lon * 6)) < 0.075;
      const parallel = Math.abs(Math.sin(lat * 6)) < 0.06;
      const lighting = Math.max(0, -x * 0.3 + y * 0.25 + z * 0.8);
      let density = land ? 0.42 + lighting * 0.43 : 0;
      if (meridian || parallel) density = Math.max(density, 0.52);
      if (z < 0.16) density = Math.max(density, 0.52);
      if (density <= (SCREEN[(row % 4) * 4 + (col % 4)] + 0.5) / 16) continue;
      ctx.rect(px - 0.7, py - 0.7, 1.4, 1.4);
    }
  }
  ctx.fill();
  ctx.fillStyle = "#555";
  for (const sign of [-1, 1]) {
    for (let step = 0; step < 4; step++) {
      ctx.fillRect(cx + sign * (radius + 13 + step * 4), cy, 2, 1);
      ctx.fillRect(cx, cy + sign * (radius + 13 + step * 4), 1, 2);
    }
  }
  LOCATIONS.forEach((location, index) => {
    const point = project(location, longitude, tilt);
    if (point.z < 0.12) return;
    const px = Math.round(point.x);
    const py = Math.round(point.y);
    ctx.fillStyle = "#000";
    ctx.fillRect(px - 4, py - 4, 9, 9);
    ctx.fillStyle = index === selected ? "#fff" : "#bbb";
    ctx.fillRect(px - 2, py - 2, 5, 5);
    if (index === selected) {
      for (const [dx, dy] of [[-7, -7], [5, -7], [-7, 5], [5, 5]]) ctx.fillRect(px + dx, py + dy, 3, 3);
    }
  });
}

export default function PixelCommunityGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const orientation = useRef<Orientation>({ longitude: 105 * RADIANS, tilt: 14 * RADIANS });
  const targetRef = useRef<Orientation | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const interactingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedRef = useRef<number | null>(null);
  const syncRef = useRef<(() => void) | null>(null);
  const drawRef = useRef<(() => void) | null>(null);
  const reducedMotion = useHydrationSafeReducedMotion();
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const beginInteraction = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = null;
    interactingRef.current = true;
    syncRef.current?.();
  }, []);

  const resumeAfterInteraction = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    interactingRef.current = true;
    syncRef.current?.();
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      // A held pointer or a focus transition finishes before its idle delay starts.
      if (dragRef.current || targetRef.current) return;
      interactingRef.current = false;
      selectedRef.current = null;
      setSelected(null);
      drawRef.current?.();
      syncRef.current?.();
    }, RESUME_DELAY_MS);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let disposed = false;
    let frame = 0;
    let visible = false;
    let lastPaint = 0;
    let mask: ImageData | null = null;
    let labelWidth = 132;
    let labelHeight = 38;
    let compactLabels = false;
    const draw = () => {
      if (!mask) return;
      const { longitude, tilt } = orientation.current;
      paintGlobe(ctx, mask, longitude, tilt, selectedRef.current);
      const placed: { x: number; y: number }[] = [];
      const visibleLocations = LOCATIONS.map((location, index) => ({
        location, index, point: project(location, longitude, tilt),
      })).filter(item => item.point.z >= 0.18);
      const labelPositions = new Map<number, { x: number; y: number }>();
      let useColumns = compactLabels;
      if (!compactLabels) {
        visibleLocations.forEach(({ location, index, point }) => {
          const x = clamp(point.x + location.dx, labelWidth / 2 + 8, SIZE.width - labelWidth / 2 - 8);
          let y = clamp(point.y + location.dy, labelHeight / 2 + 12, SIZE.height - labelHeight / 2 - 52);
          const overlaps = () => placed.some(p => Math.abs(p.x - x) < labelWidth + 6 && Math.abs(p.y - y) < labelHeight + 6);
          for (let attempt = 0; overlaps() && attempt < 8; attempt++) {
            y += labelHeight + 8;
            if (y > SIZE.height - labelHeight / 2 - 52) y = labelHeight / 2 + 12;
          }
          if (overlaps()) useColumns = true;
          placed.push({ x, y });
          labelPositions.set(index, { x, y });
        });
      }
      if (useColumns) {
        // Two balanced columns keep adjacent European / Asian labels separate
        // on phones while the dotted leaders retain their geographic anchors.
        const byX = [...visibleLocations].sort((a, b) => a.point.x - b.point.x);
        const middle = Math.ceil(byX.length / 2);
        [byX.slice(0, middle), byX.slice(middle)].forEach((column, side) => {
          const minY = labelHeight / 2 + 12;
          const maxY = SIZE.height - labelHeight / 2 - 52;
          const spacing = labelHeight + 8;
          const sorted = column.sort((a, b) => a.point.y + a.location.dy - b.point.y - b.location.dy);
          const ys: number[] = [];
          sorted.forEach((item, index) => {
            const desired = clamp(item.point.y + item.location.dy, minY, maxY);
            ys.push(Math.max(desired, index ? ys[index - 1] + spacing : minY));
          });
          for (let index = ys.length - 1; index >= 0; index--) {
            ys[index] = Math.min(ys[index], index === ys.length - 1 ? maxY : ys[index + 1] - spacing);
          }
          sorted.forEach((item, index) => labelPositions.set(item.index, {
            x: side === 0 ? labelWidth / 2 + 8 : SIZE.width - labelWidth / 2 - 8,
            y: ys[index],
          }));
        });
      }
      LOCATIONS.forEach((location, index) => {
        const marker = markerRefs.current[index];
        const line = lineRefs.current[index];
        if (!marker || !line) return;
        const point = project(location, longitude, tilt);
        const shown = point.z >= 0.18;
        marker.style.visibility = shown ? "visible" : "hidden";
        line.style.visibility = shown ? "visible" : "hidden";
        if (!shown) return;
        const { x, y } = labelPositions.get(index)!;
        marker.style.left = `${x / SIZE.width * 100}%`;
        marker.style.top = `${y / SIZE.height * 100}%`;
        line.setAttribute("x1", String(point.x));
        line.setAttribute("y1", String(point.y));
        line.setAttribute("x2", String(x));
        line.setAttribute("y2", String(y));
      });
    };
    drawRef.current = draw;
    const resize = () => {
      const width = canvas.getBoundingClientRect().width;
      compactLabels = width < 400;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(width * SIZE.height / SIZE.width * ratio);
      ctx.setTransform(canvas.width / SIZE.width, 0, 0, canvas.height / SIZE.height, 0, 0);
      ctx.imageSmoothingEnabled = false;
      labelWidth = (markerRefs.current[0]?.offsetWidth || 132) / Math.max(width, 1) * SIZE.width;
      labelHeight = (markerRefs.current[0]?.offsetHeight || 38) / Math.max(width, 1) * SIZE.width;
      draw();
    };
    const canSpin = () => !reducedMotion && !interactingRef.current && !dragRef.current;
    const canAnimate = () => visible && !document.hidden && (!!targetRef.current || canSpin());
    const tick = (now: number) => {
      if (disposed) return;
      const elapsed = now - lastPaint;
      if (elapsed >= 1000 / 24) {
        const delta = Math.min(elapsed, 100);
        const target = targetRef.current;
        if (target) {
          const amount = reducedMotion ? 1 : 1 - Math.exp(-delta / 90);
          orientation.current.longitude += (target.longitude - orientation.current.longitude) * amount;
          orientation.current.tilt += (target.tilt - orientation.current.tilt) * amount;
          if (Math.abs(target.longitude - orientation.current.longitude) + Math.abs(target.tilt - orientation.current.tilt) < 0.002) {
            orientation.current = target;
            targetRef.current = null;
            resumeAfterInteraction();
          }
        } else if (canSpin()) {
          orientation.current.longitude = (orientation.current.longitude + delta * SPIN_SPEED) % TAU;
        }
        lastPaint = now;
        draw();
      }
      frame = canAnimate() ? requestAnimationFrame(tick) : 0;
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (mask && canAnimate()) {
        lastPaint = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    syncRef.current = sync;
    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      const sample = document.createElement("canvas");
      sample.width = image.naturalWidth;
      sample.height = image.naturalHeight;
      const sampleCtx = sample.getContext("2d");
      if (!sampleCtx) return;
      sampleCtx.drawImage(image, 0, 0);
      mask = sampleCtx.getImageData(0, 0, sample.width, sample.height);
      resize();
      setReady(true);
      sync();
    };
    image.src = "/graphics/world-land-mask.png";
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      image.onload = null;
      syncRef.current = null;
      drawRef.current = null;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
      interactingRef.current = false;
    };
  }, [reducedMotion, resumeAfterInteraction]);

  function selectLocation(index: number) {
    beginInteraction();
    selectedRef.current = index;
    setSelected(index);
    const location = LOCATIONS[index];
    const target = {
      longitude: orientation.current.longitude + angleDifference(location.lon * RADIANS, orientation.current.longitude),
      tilt: location.lat * RADIANS,
    };
    if (reducedMotion) {
      orientation.current = target;
      targetRef.current = null;
      drawRef.current?.();
      resumeAfterInteraction();
    } else {
      targetRef.current = target;
    }
    syncRef.current?.();
  }

  function clearSelection() {
    targetRef.current = null;
    selectedRef.current = null;
    setSelected(null);
  }

  function startDrag(event: PointerEvent<HTMLCanvasElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    clearSelection();
    beginInteraction();
    dragRef.current = { ...orientation.current, x: event.clientX, y: event.clientY, id: event.pointerId, width: event.currentTarget.clientWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    syncRef.current?.();
  }

  function moveDrag(event: PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    orientation.current = {
      longitude: drag.longitude - (event.clientX - drag.x) / drag.width * 3.5,
      tilt: clamp(drag.tilt + (event.clientY - drag.y) / drag.width * 2.5, -Math.PI / 3, Math.PI / 3),
    };
    drawRef.current?.();
  }

  function endDrag(event: PointerEvent<HTMLCanvasElement>) {
    if (dragRef.current?.id !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    resumeAfterInteraction();
  }

  function rotateWithKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
    event.preventDefault();
    clearSelection();
    beginInteraction();
    if (event.key === "Home") orientation.current = { longitude: 105 * RADIANS, tilt: 14 * RADIANS };
    if (event.key === "ArrowLeft") orientation.current.longitude -= 12 * RADIANS;
    if (event.key === "ArrowRight") orientation.current.longitude += 12 * RADIANS;
    if (event.key === "ArrowUp") orientation.current.tilt = clamp(orientation.current.tilt + 10 * RADIANS, -Math.PI / 3, Math.PI / 3);
    if (event.key === "ArrowDown") orientation.current.tilt = clamp(orientation.current.tilt - 10 * RADIANS, -Math.PI / 3, Math.PI / 3);
    drawRef.current?.();
    resumeAfterInteraction();
  }

  return (
    <figure id="community-globe" className={styles.figure} aria-label="Malaysian researchers around the world">
      <div
        className={styles.art}
        data-ready={ready}
        data-dragging={dragging}
        tabIndex={0}
        role="group"
        aria-label="Interactive globe. Drag or use arrow keys to rotate. Select a location to focus it."
        onKeyDown={rotateWithKeys}
        onPointerEnter={event => { if (event.pointerType !== "touch") resumeAfterInteraction(); }}
        onPointerMove={() => {
          if (!dragRef.current && !targetRef.current) resumeAfterInteraction();
        }}
        onPointerLeave={() => { if (interactingRef.current && !dragRef.current && !targetRef.current) resumeAfterInteraction(); }}
        onFocus={resumeAfterInteraction}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && interactingRef.current && !dragRef.current && !targetRef.current) resumeAfterInteraction(); }}
      >
        <svg className={styles.fallback} viewBox="0 0 480 440" fill="none" stroke="#555" strokeDasharray="1 4" aria-hidden="true">
          <circle cx="240" cy="218" r="164" />
          <ellipse cx="240" cy="218" rx="100" ry="164" />
          <ellipse cx="240" cy="218" rx="164" ry="62" />
          <path d="M76 218h328M240 54v328" />
        </svg>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} />
        <svg className={styles.markerLines} viewBox="0 0 480 440" aria-hidden="true">
          {LOCATIONS.map((location, index) => <line key={location.name} ref={element => { lineRefs.current[index] = element; }} />)}
        </svg>
        {LOCATIONS.map((location, index) => (
          <button
            key={location.name}
            ref={element => { markerRefs.current[index] = element; }}
            type="button"
            className={styles.countryMarker}
            aria-label={`Focus ${location.name} on globe`}
            aria-pressed={selected === index}
            onClick={() => selectLocation(index)}
          >
            <img src={`/graphics/flags/${location.flag}.png`} alt="" width={20} height={14} draggable={false} />
            <span className={styles.countryName}>{location.name}</span>
            <span className={styles.countryNameCompact} aria-hidden="true">{location.flag === "gb" ? "UK" : location.flag === "us" ? "USA" : location.name}</span>
          </button>
        ))}
      </div>
      <figcaption className={styles.globeHint}>Drag to explore</figcaption>
      <span className={styles.globeStatus} role="status">{selected !== null ? `Viewing ${LOCATIONS[selected].name}.` : ""}</span>
    </figure>
  );
}
