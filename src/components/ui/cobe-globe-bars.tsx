/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

interface BarMarker {
  id: string;
  location: [number, number];
  value: number;
  label: string;
  offsetX?: number; // pixel nudge left/right on the tooltip
  offsetY?: number; // pixel nudge upward on the tooltip
}

interface GlobeBarsProps {
  markers?: BarMarker[];
  className?: string;
  speed?: number;
}

const defaultMarkers: BarMarker[] = [
  // Existing/Requested Countries
  {
    id: "msia",
    location: [4.2105, 101.9758],
    value: 0,
    label: "Malaysia",
    offsetX: -55,
    offsetY: 0,
  },
  { id: "aus", location: [-25.2744, 133.7751], value: 0, label: "Australia" },
  {
    id: "fra",
    location: [46.2276, 2.2137],
    value: 0,
    label: "France",
    offsetX: -60,
    offsetY: 0,
  },
  {
    id: "sgp",
    location: [1.3521, 103.8198],
    value: 0,
    label: "Singapore",
    offsetX: 55,
    offsetY: 0,
  },
  {
    id: "lon",
    location: [51.5074, -0.1278],
    value: 0,
    label: "London",
    offsetX: 60,
    offsetY: 0,
  },

  // US States
  {
    id: "ny",
    location: [40.7128, -74.006],
    value: 0,
    label: "NYC",
    offsetX: 60,
    offsetY: 60,
  },
];

export function GlobeBars({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeBarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 0,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 9,
        baseColor: [1, 1, 1],
        markerColor: [0.15, 0.55, 0.55],
        glowColor: [0.94, 0.93, 0.91],
        markerElevation: 0,
        markers: markers.map((m) => ({
          location: m.location,
          size: 0.02,
          id: m.id,
        })),
        arcs: [],
        arcColor: [0.2, 0.6, 0.6],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.7,
      });

      function animate() {
        if (!isPausedRef.current) phi += speed;
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [markers, speed]);

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes bar-fill { from { width: 0; } to { width: var(--value, 0%); } }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "110%",
          height: "110%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />

      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // @ts-ignore: CSS Anchor Positioning
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            // ↓ Apply offsetX (horizontal nudge) while keeping the centering -50%
            translate: `calc(-50% + ${m.offsetX ?? 0}px) 0`,
            // ↓ Apply offsetY as extra upward margin so the tooltip lifts clear
            marginBottom: 8 + (m.offsetY ?? 0),
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: "0.2rem",
            padding: "0.35rem 0.4rem",
            background: "#fff",
            border: "1.5px solid #1a1a2e",
            borderRadius: 3,
            minWidth: 60,
            pointerEvents: "none" as const,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.4s, filter 0.4s",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#888",
            }}
          ></span>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              height: 30,
            }}
          >
            <img
              src={`https://flagcdn.com/w80/${
                m.label === "NYC" ||
                m.label === "California" ||
                m.label === "MA" ||
                m.label === "CT"
                  ? "us"
                  : m.label === "London"
                    ? "gb"
                    : m.label === "Malaysia"
                      ? "my"
                      : m.label === "Australia"
                        ? "au"
                        : m.label === "France"
                          ? "fr"
                          : m.label === "Singapore"
                            ? "sg"
                            : "un"
              }.png`}
              alt={`${m.label} flag`}
              style={{
                height: "100%",
                width: "80px",
                borderRadius: "2px",
                objectFit: "contain",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "#1a1a2e",
            }}
          ></span>
        </div>
      ))}

      {markers.map((m) => (
        <div
          key={`${m.id}-2`}
          style={{
            position: "absolute",
            // @ts-ignore: CSS Anchor Positioning
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: `calc(-50% + ${m.offsetX ?? 0}px) 0`,
            marginBottom: 8 + (m.offsetY ?? 0),
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: "0.2rem",
            padding: "0.35rem 0.4rem",
            background: "#fff",
            border: "1.5px solid #1a1a2e",
            borderRadius: 3,
            minWidth: 60,
            pointerEvents: "none" as const,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.4s, filter 0.4s",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#888",
            }}
          ></span>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              height: 30,
            }}
          >
            <img
              src={`https://flagcdn.com/w80/${
                m.label === "NYC" ||
                m.label === "California" ||
                m.label === "MA" ||
                m.label === "CT"
                  ? "us"
                  : m.label === "London"
                    ? "gb"
                    : m.label === "Malaysia"
                      ? "my"
                      : m.label === "Australia"
                        ? "au"
                        : m.label === "France"
                          ? "fr"
                          : m.label === "Singapore"
                            ? "sg"
                            : "un"
              }.png`}
              alt={`${m.label} flag`}
              style={{
                height: "100%",
                width: "80px",
                borderRadius: "2px",
                objectFit: "contain",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "#1a1a2e",
            }}
          >
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
