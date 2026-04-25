"use client";

import React from "react";
import { motion, MotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface GradientTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

function GradientText({
  className,
  children,
  as: Component = "span",
  ...props
}: GradientTextProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(
        "!relative !inline-flex !isolate", 
        className
      )}
      {...props}
    >
      {/* 1. Ensure text is high contrast white */}
      <span className="!relative !z-20 !text-white">{children}</span>

      {/* 2. THE GLOW: We use radial gradients instead of solid blocks. 
          This removes the "box" edges entirely because the color 
          naturally fades to transparent.
      */}
      <span className="!pointer-events-none !absolute !inset-0 !-z-10 !overflow-visible">
        <span 
          className="!absolute !inset-[-200%] !opacity-60"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, #334155 0%, transparent 40%),
              radial-gradient(circle at 80% 30%, #475569 0%, transparent 40%),
              radial-gradient(circle at 30% 70%, #27272a 0%, transparent 40%),
              radial-gradient(circle at 70% 70%, #1c1c1a 0%, transparent 40%)
            `,
            filter: 'blur(40px)',
          }}
        ></span>
      </span>
    </MotionComponent>
  );
}

export { GradientText };