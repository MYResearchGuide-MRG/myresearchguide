"use client";

import { motion } from "framer-motion";
import Nav from "./Nav2";
import Nav1 from "./Nav1"
import NewNav from "./NewNav"

export default function Top() {
  return (
    <>
      <div className="flex flex-col justify-center">
       
      
        <div className=" flex flex-col items-center justify-center gap-6 p-10 !mt-10 !text-center">
          {/* Left Column: Title/Logo */}
          {/* On mobile, it takes full width (basis-full). On desktop, it takes half (md:basis-1/2) */}
          <div className="!md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 1.2,
              }}
              
            >
              {/* <img src="./MRG1.png" alt="Logo" className="max-w-full h-auto" /> */}
              <h1 className="!text-5xl md:!text-8xl !font-bold !text-center ">
                <div className="bg-gradient-to-r from-stone-400  to-slate-300 bg-clip-text text-transparent">#1 Research Guide </div> in Malaysia
              </h1>
            <hr className="hidden h-px w-100 border-none lg:block linear-gradient"></hr>
              <i className="!ml-10 !mr-10 mt-2 text-lg !text-center">
               Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              </i>

             
            </motion.div>
            <button
              className="
           !px-7 !py-2.5 !rounded-full !font-bold !text-white !text-xs
          !bg-gradient-to-b !from-zinc-700 !to-zinc-900
          !border !border-white/20 
          !shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]
          !transition-all !duration-200
          hover:!brightness-110 active:!scale-95 !mt-5
        "
            >
              <a href="https://forms.gle/Sk9JS3kcKe8qw1cU6">
              <div className="text-lg">Mailing List</div></a>
            </button>
          </div>

          {/* Right Column: Screenshot */}
          <div className="basis-full md:basis-128 flex justify-center">
            <motion.img
              src="/screenshot_notion.png"
              alt="Notion"
              className="max-w-full h-auto rounded-lg shadow-lg !mt-15 !ml-5 !mr-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
