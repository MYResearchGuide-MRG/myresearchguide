"use client";

import { motion } from "framer-motion";

import Nav1 from "@/components/Nav1"
import NewNav from "@/components/NewNav";

export default function TeamHeading() {
  return (
    <section className="min-h-[500px] bg-gradient-to-t from-white to-gray-500">
      <NewNav />
      &nbsp;
      &nbsp;

      <div className=" flex flex-col-reverse md:flex-row items-center justify-center gap-6 p-10 !mt-30 !m-10 md:m-0">
        {/* Left Column: Title/Logo */}
        {/* On mobile, it takes full width (basis-full). On desktop, it takes half (md:basis-1/2) */}
        <div className="basis-full md:basis-128 flex justify-center !md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
            className="md:text-left"
          >
            <img src="./team.png" alt="Logo" className="!min-w-[200px] md:!w-[500px] !max-w-[300px] h-auto" />
            <i className="!ml-5 mt-2 text-sm">
              [  Created by the excellencies in Malaysia. ]{" "}
            </i>
          </motion.div>
        </div>

        {/* Right Column: Screenshot */}
        <div className="basis-full md:basis-128 flex justify-center">
          <motion.img
            src="/screenshot_notion.png"
            alt="Notion"
            className="!hidden max-w-full h-auto rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          />
        </div>
      </div>


    </section>
  );
}
