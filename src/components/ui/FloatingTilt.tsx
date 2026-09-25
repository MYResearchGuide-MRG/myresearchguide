"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

const MAX_TILT_X = 4; // deg, up/down
const MAX_TILT_Y = 6; // deg, left/right

/**
 * Makes its child feel like a floating object: a slow idle bob, a gentle 3D
 * tilt toward the mouse (mouse pointers only), and a soft glare that follows
 * the cursor. Everything is off under prefers-reduced-motion.
 */
export default function FloatingTilt({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useHydrationSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position within the element, normalised to -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 18, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [-0.5, 0.5], [MAX_TILT_X, -MAX_TILT_X]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-MAX_TILT_Y, MAX_TILT_Y]);

  // Glare position in % and strength (fades in while hovering)
  const glareX = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glareOpacity = useSpring(0, { stiffness: 150, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(600px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.07), transparent 45%)`;

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
    glareOpacity.set(1);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      className={className}
      animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 6, ease: "easeInOut", repeat: Infinity }
      }
      style={{ perspective: 1800 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformOrigin: "center center" }
        }
        className="!relative !will-change-transform"
      >
        {children}
        {!reduceMotion && (
          <motion.div
            aria-hidden
            className="!pointer-events-none !absolute !inset-0 !z-40 !rounded-xl md:!rounded-2xl"
            style={{ background: glare, opacity: glareOpacity }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
