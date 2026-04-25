/* eslint-disable react-hooks/static-components */
// "use client"

// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef } from 'react';
// import Image from 'next/image';
// import NewNav from "@/components/NewNav";

// const schools = [
//   '/carousel/Caltech.png', '/carousel/Cambridge.png', '/carousel/Duke.png', '/carousel/Harvard.png',
//   '/carousel/MIT.png', '/carousel/Imperial.png', '/carousel/NTU.png', '/carousel/Stanford.png',
//   '/carousel/Oxford.png', '/carousel/Cornell.png', '/carousel/UCL.png', '/carousel/NUS.png',
//   '/carousel/Caltech.png', '/carousel/Cambridge.png', '/carousel/Duke.png', '/carousel/Harvard.png',
//   '/carousel/MIT.png', '/carousel/Imperial.png', '/carousel/NTU.png', '/carousel/Stanford.png',
//   '/carousel/Oxford.png', '/carousel/Cornell.png', '/carousel/UCL.png', '/carousel/NUS.png',
//   '/carousel/Caltech.png', '/carousel/Cambridge.png', '/carousel/Duke.png', '/carousel/Harvard.png',
//   '/carousel/MIT.png', '/carousel/Imperial.png', '/carousel/NTU.png', '/carousel/Stanford.png',
//   '/carousel/Oxford.png', '/carousel/Cornell.png', '/carousel/UCL.png', '/carousel/NUS.png'
// ];

// export default function Mission() {
//   const containerRef = useRef(null);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end start"] 
//   });

//   const backgroundOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

//   const rows = Array.from({ length: 6 }); 
//   const cols = Array.from({ length: 12 });

//   const LogoGrid = () => (
//     <div className="!flex !flex-col !gap-16">
//       {rows.map((_, rowIndex) => (
//         <div key={rowIndex} className="!flex !gap-10 !px-10">
//           {cols.map((_, colIndex) => {
//             const schoolImg = schools[(rowIndex + colIndex) % schools.length];
//             return (
//               <div key={colIndex} className="!w-32 !h-32 !flex-shrink-0">
//                 <Image
//                   src={schoolImg}
//                   alt="logo"
//                   width={120}
//                   height={120}
//                   className="!object-contain !opacity-30"
//                 />
//               </div>
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <>
//       <NewNav />
//       <div ref={containerRef} className="!relative !overflow-hidden !min-h-screen !flex !items-center !justify-center !bg-black">

//         {/* BACKGROUND LAYER WITH GRADIENT MASK FOR SEAMLESS BLENDING */}
//         <motion.div 
//           style={{ 
//             opacity: backgroundOpacity,
//             // This creates the seamless blend by fading the container edges to transparent
//             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
//             maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
//           }}
//           className="!absolute !inset-0 !z-0 !pointer-events-none"
//         >
//           <div className="!absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[250%] !transform !-rotate-12 !scale-125">
//             <div className="!flex !w-max animate-marquee">
//               <LogoGrid />
//               <LogoGrid />
//               <LogoGrid />
//               <LogoGrid />
//             </div>
//           </div>
//         </motion.div>

//         {/* BOTTOM VIGNETTE OVERLAY (Double protection for blending) */}
//         <div className="!absolute !bottom-0 !left-0 !right-0 !h-64 !bg-gradient-to-t !from-black !to-transparent !z-[5]" />

//         {/* CONTENT LAYER */}
//         <div className="!relative !z-10 !w-full !flex !flex-col !items-center !justify-center">
//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
//           >
//              <h1 className="!text-5xl md:!text-[8rem] !max-w-none !font-regular !text-center">
//               <span className="!text-spektr-cyan">
//                 About 
//               </span>
//               <div className="bg-gradient-to-r from-stone-400 to-slate-300 bg-clip-text text-transparent">MYResearchGuide.</div> 
//             </h1>
//             <div className="text-center">
//               <i className="mt-2 text-xl !text-center !text-white/60">
//                 [ Get to know more about our story and our team! ]
//               </i>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from 'react';
import Image from 'next/image';
import NewNav from "@/components/NewNav";

export default function Mission() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // TILE COMPONENT FOR THE MATHEMATICAL EQUATIONS BACKGROUND
  const ChalkboardTile = () => (
    <div className="!w-[1024px] !h-[768px] !flex-shrink-0 !overflow-hidden">
      <Image
        src="/equations.jpg" // Source image with math equations
        alt="math chalkboard equations"
        width={1024}
        height={768}
        className="!object-cover !opacity-50" // object-cover for tiling, low opacity
      />
    </div>
  );

  return (
    <>
      <NewNav />
      <div ref={containerRef} className="!relative !overflow-hidden !min-h-screen !flex !items-center !justify-center !bg-black">

        {/* BACKGROUND LAYER WITH GRADIENT MASK FOR SEAMLESS BLENDING */}
        <motion.div
          style={{
            opacity: backgroundOpacity,
            // This creates the seamless blend by fading the container edges to transparent
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
          }}
          className="!absolute !inset-0 !z-0 !pointer-events-none"
        >
          <div className="!absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[250%] !transform !-rotate-12 !scale-125">
            <div className="!flex !w-max animate-marquee">
              {/* Replace original LogoGrid instances with tiled equation tiles for a packed marquee effect */}
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
              <ChalkboardTile />
            </div>
          </div>
        </motion.div>

        {/* BOTTOM VIGNETTE OVERLAY (Double protection for blending) */}
        <div className="!absolute !bottom-0 !left-0 !right-0 !h-64 !bg-gradient-to-t !from-black !to-transparent !z-[5]" />

        {/* CONTENT LAYER */}
        <div className="!relative !z-10 !w-full !flex !flex-col !items-center !justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
          >
            <h1 className="!text-5xl md:!text-[8rem] !max-w-none !font-regular !text-center">
              <span className="!text-spektr-cyan">
                About
              </span>
              <div className="bg-gradient-to-r from-stone-400 to-slate-300 bg-clip-text text-transparent">MYResearchGuide.</div>
            </h1>
            <div className="text-center">
              <i className="mt-2 text-xl !text-center !text-white/60">
                [ Get to know more about our story and our team! ]
              </i>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}