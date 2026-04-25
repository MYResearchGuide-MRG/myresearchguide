"use client"

import * as React from "react"
import { HTMLMotionProps, motion } from "motion/react"

import { cn } from "@/lib/utils"

interface CardStickyProps extends HTMLMotionProps<"div"> {
  index: number
  incrementY?: number
  incrementZ?: number
}

const ContainerScroll = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{ perspective: "1000px", ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
})
ContainerScroll.displayName = "ContainerScroll"

const CardSticky = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      index,
      incrementY = 10,
      incrementZ = 10,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const y = index * incrementY
    const z = index * incrementZ

    return (
      <motion.div
        ref={ref}
        layout="position"
        // Start state: Invisible and slightly lower
        initial={{ opacity: 0, y: 40 }}
        // Triggered only when the component enters the viewport
        whileInView={{ opacity: 1, y: 0 }}
        // 'once: true' ensures it doesn't re-animate every time you scroll up/down
        // 'amount: 0.2' means it triggers when 20% of the card is visible
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1,        // Slower, more natural fade
          delay: index * 0.1, // Staggered entrance based on card order
          ease: [0.21, 0.47, 0.32, 0.98],
        }}
        style={{
          top: y,
          z,
          backfaceVisibility: "hidden",
          zIndex: index,
          ...style,
        }}
        // Hover effects for the 'stack' interaction
        className={cn(
          "sticky transition-all duration-500 group-hover:opacity-40 hover:!opacity-100",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

CardSticky.displayName = "CardSticky"

export { ContainerScroll, CardSticky }