"use client";
import { useEffect, useState, useRef } from "react";

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number; // Reduced default for a "faster" feel
}

export default function CountUp({ end, start = 0, duration = 800 }: CountUpProps) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger earlier (as soon as it peaks into view)
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: easeOutExpo (starts fast, slows down at the very end)
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(easedProgress * (end - start) + start);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure it lands exactly on the end number
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end, start, duration]);

  return (
    <span ref={elementRef} className="font-mono tabular-nums inline-block">
      {count.toLocaleString()}
    </span>
  );
}