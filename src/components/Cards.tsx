/* eslint-disable @next/next/no-img-element */
/* eslint-disable prefer-const */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  NotebookPen,
  ArrowRight,
} from "lucide-react";
import { researchers } from "@/data/researchers";

// Derived from the shared researcher data file so the home teaser and the
// /researchers directory stay in sync.
const speakers = researchers
  .filter((r) => r.image)
  .map((r, i) => ({
    id: i + 1,
    title: r.name,
    name: r.tagline,
    image: r.image,
    link: r.interview || "",
  }));

const Interview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [visibleCards, setVisibleCards] = useState(3);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Adjusted to include the "+1" placeholder card in the scroll range
  const maxIndex = (speakers.length + 1) - visibleCards;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          let next = prev + direction;
          
          if (next >= maxIndex) {
            setDirection(-1);
            return maxIndex;
          }
          if (next <= 0) {
            setDirection(1);
            return 0;
          }
          return next;
        });
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, direction, maxIndex]);

  const nextSlide = () => {
    if (currentIndex < maxIndex) setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <section 
      className="!px-4 !py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="!mb-16 !text-center">
        <h1 className=" !mt-40 !text-5xl md:!text-[5rem] !mb-2 !max-w-none !text-center !tracking-tighter">
        <span className="!text-spektr-cyan">
         Recent Interviews.
        </span>
      </h1>
        <p className="!text-lg !max-w-2xl !mx-auto !text-gray-400">
          Sharing knowledge and experiences across various platforms and events
        </p>
      </div>

      <div className="!relative !max-w-7xl !mx-auto !flex !items-center">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`!z-10 !p-2 !rounded-full !transition-opacity ${currentIndex === 0 ? "!opacity-20 !cursor-not-allowed" : "!text-white !hover:bg-zinc-800"}`}
        >
          <ChevronLeft size={40} />
        </button>

        <div className="!overflow-hidden !mx-2 md:!mx-4 !w-full">
          <div
            className="!flex !transition-transform !duration-700 !ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
            }}
          >
            {speakers.map((speaker) => (
              <div
                key={speaker.id}
                className="!flex-none !w-full md:!w-1/3 !p-2 md:!p-4"
              >
                <div className="!bg-zinc-900/50 !rounded-3xl !p-6 md:!p-8 !border !border-zinc-800 !flex !flex-col !items-center !text-center !h-full !transition-all !hover:border-spektr-cyan/50">
                  <div className="!relative !mb-6">
                    <div className="!w-24 !h-24 md:!w-32 md:!h-32 !rounded-full !overflow-hidden !border-4 !border-zinc-800">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="!w-full !h-full !object-cover"
                      />
                    </div>
                  </div>

                  <h3 className="!text-xl !font-bold !text-white !mb-2">
                    {speaker.title}
                  </h3>
                  <p className="!text-zinc-500 !text-sm !mb-6">
                    {speaker.name}
                  </p>

                  <div className="!mt-auto !flex !flex-col !gap-3 !w-full">
                    <div className="!flex !items-center !justify-center !gap-2 !bg-white !text-black !px-5 !py-2.5 !rounded-xl !font-bold !text-sm  !cursor-not-allowed">
                    {/* <a
                      href={speaker.link}
                      target="_blank"
                      className="!cursor-not-allowed !flex !items-center !justify-center !gap-2 !bg-white !text-black !px-5 !py-2.5 !rounded-xl !font-bold !text-sm !transition-transform !hover:scale-[1.02]"
                    > */}
                      <NotebookPen size={18} />
                      Coming Soon!
                    {/* </a> */}
                    </div>

                  <div className="!flex !items-center !justify-center !gap-2 !bg-zinc-800 !text-zinc-400 !px-5 !py-2.5 !rounded-xl !font-bold !text-sm !opacity-60 !cursor-not-allowed">
                    
                    {/* <a
                      href={speaker.link}
                      className="!flex !items-center !justify-center !gap-2 !bg-zinc-800 !text-zinc-400 !px-5 !py-2.5 !rounded-xl !font-bold !text-sm !opacity-60 !cursor-not-allowed"
                    > */}
                      <PlayCircle size={18} />
                      Coming Soon!
                    {/* </a> */}
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {/* Final Placeholder Card */}
            <div className="!flex-none !w-full md:!w-1/3 !p-2 md:!p-4 !pointer-events-none !select-none">
              <div className="!bg-zinc-900/30 !rounded-3xl !p-6 md:!p-8 !border !border-dashed !border-zinc-800 !flex !flex-col !items-center !justify-center !text-center !h-full !opacity-40">
                <div className="!w-24 !h-24 md:!w-32 md:!h-32 !rounded-full !bg-zinc-800/50 !mb-6 !flex !items-center !justify-center">
                  <span className="!text-zinc-600 !text-3xl">...</span>
                </div>
                <h3 className="!text-lg !font-medium !text-zinc-100 !max-w-[200px]">
                  And many more researchers to go..
                </h3>
              </div>
            </div>
            
          </div>
        </div>

        <button
          onClick={nextSlide}
          disabled={currentIndex === maxIndex}
          className={`!z-10 !p-2 !rounded-full !transition-opacity ${currentIndex === maxIndex ? "!opacity-20 !cursor-not-allowed" : "!text-white !hover:bg-zinc-800"}`}
        >
          <ChevronRight size={40} />
        </button>
      </div>

      <div className="!mt-12 !flex !justify-center">
        <Link
          href="/researchers"
          className="!group !inline-flex !items-center !gap-2 !bg-transparent !text-white !border !border-white/30 !px-8 !py-3 !rounded-xl !font-bold !text-sm !uppercase !tracking-widest !no-underline !transition-all hover:!bg-white/10 hover:!border-white"
        >
          View all researchers
          <ArrowRight size={18} className="!transition-transform group-hover:!translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default Interview;