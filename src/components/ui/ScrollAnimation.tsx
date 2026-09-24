"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.92, 1] : [1.05, 1];
  };

  // On mobile / reduced motion, keep the 3D card static so content is not clipped
  const staticMode = prefersReducedMotion || isMobile;

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    mounted && !staticMode ? scaleDimensions() : [1, 1]
  );

  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    staticMode ? [0, 0] : [20, 0]
  );
  const translate = useTransform(
    scrollYProgress,
    [0, 1],
    staticMode ? [0, 0] : [0, -100]
  );

  return (
    <div
      className="!min-h-0 md:!h-[80rem] !flex !items-start md:!items-center !justify-center !relative !z-10 !p-2 sm:!p-4 md:!p-20 !w-full !overflow-visible"
      ref={containerRef}
    >
      <div
        className="!py-4 sm:!py-8 md:!py-40 !w-full !relative"
        style={{
          perspective: staticMode ? undefined : "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} staticMode={staticMode}>
          {children}
        </Card>
      </div>
    </div>
  );
};

interface HeaderProps {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}

export const Header = ({ translate, titleComponent }: HeaderProps) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="!max-w-5xl !mx-auto !text-center !relative !z-20 !w-full !px-1"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
  staticMode,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
  staticMode?: boolean;
}) => {
  return (
    <motion.div
      style={
        staticMode
          ? undefined
          : {
              rotateX: rotate,
              scale,
              boxShadow:
                "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
            }
      }
      className="!max-w-5xl !mx-auto !h-auto !min-h-[14rem] sm:!min-h-[18rem] md:!h-[40rem] !w-full !border-2 sm:!border-4 !border-[#6C6C6C] !p-1.5 sm:!p-2 md:!p-6 !bg-[#222222] !rounded-2xl md:!rounded-[30px] !shadow-2xl !mt-4 md:!mt-5 !relative !z-10"
    >
      <div className="!h-full !w-full !overflow-hidden !rounded-xl md:!rounded-2xl dark:!bg-zinc-900 md:!p-4">
        {children}
      </div>
    </motion.div>
  );
};
