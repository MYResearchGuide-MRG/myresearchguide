/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Mail } from "lucide-react";
import { DestinationCard } from "@/components/ui/card-21";
import React, { useState } from "react";

const Cards = () => {
  const [activeTab, setActiveTab] = useState(0);
  const features = [
    {
      title: "Your personal journey, step-by-step",
      description:
        "Navigate our guide content with connected pages, keyword definitions, and researcher tips. Each step of the process, from professor outreach to publication, is broken down into detail.",
      gif: "/gif2.gif", // Replace with your actual gif path
    },
    {
      title: "Get Inspired by Researchers",
      description:
        "With featured heart-to-heart conversations and personal insight from our research community, learn more about our researchers’ featured fields, their journey, and the steps they’ve taken.",
      gif: "/gif5.gif",
    },
  ];
  return (
    // <section className="py-16 bg-transparent">
    //     <h1 className='text-center !p-6 !mt-10 !font-bold !text-3xl md:!text-5xl'>Features of MyResearchGuide </h1>
    //   <div className="max-w-7xl mx-auto px-6 !p-6">
    //     {/* Grid Container: 1 col on mobile, 3 cols on desktop */}
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    //       {cardData.map((item, index) => (
    //         <motion.div
    //           key={item.id}
    //           initial={{ opacity: 0, y: 20 }}
    //           whileInView={{ opacity: 1, y: 0 }}
    //           viewport={{ once: true }}
    //           transition={{ duration: 0.5, delay: index * 0.2 }}
    //           whileHover={{ y: -10 }} // Subtle lift on hover
    //           className="!p-8 rounded-2xl bg-transparent border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
    //         >
    //           {/* Icon Container */}
    //           <div className="w-14 h-14 border-white rounded-lg flex items-center justify-center text-2xl mb-6">
    //             {item.icon}
    //           </div>

    //           {/* Title */}
    //           <h3 className="text-2xl font-semibold mb-4">
    //             {item.title}
    //           </h3>

    //           {/* Bullet Points */}
    //           <ul className="space-y-4">
    //             {item.points.map((point, i) => (
    //               <li key={i} className="flex items-start text-gray-600 leading-relaxed">
    //                 {/* <span className="mr-3 mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" /> */}
    //                 {point}
    //               </li>
    //             ))}
    //           </ul>
    //         </motion.div>
    //       ))}
    //     </div>
    //   </div>
    // </section>
    <div>
      <h1 className="!mt-40 !text-5xl md:!text-[5rem] !max-w-none !font-regular !text-center !tracking-tighter !ml-2 !mr-2 md:!ml-0 md:!mr-0">
        <span className="!text-spektr-cyan">
          New to <br></br>
          <span className="!font-semibold bg-gradient-to-r from-stone-400  to-slate-300 bg-clip-text text-transparent">
            MYResearchGuide
          </span>
          ?<br></br>Here&apos;s how it works.
        </span>
      </h1>
      {/* <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 p-8 !ml-5 md:!ml-0 !mr-5 md:!mr-0 ">
      <div className="w-full md:max-w-[800px] h-[640px]">
        <DestinationCard
          imageUrl="https://images.unsplash.com/photo-1524675053444-52c3ca294ad2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGluZG9uZXNpYXxlbnwwfHwwfHx8MA%3D%3D?q=80&w=1887"
          location="Indonesia"
          flag="🇮🇩"
          stats="1,345 Hotels • 24 Packages"
          href="#"
          themeColor="35 11% 53%" 
        />
      </div>
      <div className="w-full  max-w-[800px] h-[640px]">
        <DestinationCard
          imageUrl=""
          location="Dubai"
          flag="🇦🇪"
          stats="2,345 Hotels • 54 Packages"
          href="#"

          themeColor="25 24% 56%"
        />
      </div>
    </div> */}

      <section className="!text-white !px-6 md:!px-12 !min-h-screen !flex !items-center !overflow-x-clip">
        {/* Max-width set to 2xl (1536px) to utilize more screen real estate */}
        <div className="!max-w-[1600px] !mx-auto !w-full !grid !grid-cols-1 lg:!grid-cols-12 !gap-16 !items-start !p-10">
          {/* Left Side: Content (3/12 columns) */}
          <div className="lg:!col-span-3 !flex !flex-col !pt-10">
            <h1 className="!text-3xl md:!text-5xl !font-bold !leading-tight">
              Get started with science research{" "}
              {/* Container for "weeks" and the line */}
              <span className="relative !inline-block px-1">
                one day
                <motion.span
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true, amount:"same" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                    ease: "easeInOut",
                  }}
                  className="absolute !z-10 !left-0 !top-1/2 !h-[4px] !bg-red-500 !-translate-y-1/2"
                  style={{ originX: 0 }}
                />
              </span>
              {/* The delayed "hours" text */}
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  // Delay is set to (line-delay + line-duration) to start exactly when the strike ends
                  delay: 0.7,
                  ease: "easeOut",
                }}
                className="!text-orange-500 !inline-block !ml-2"
              >
                now.
              </motion.span>
            </h1>
            <p className="!text-[#a1a1a1] !text-lg !mb-8 !leading-relaxed">
              Stop wasting your money on scam programs. Pursue real science research, with our guide, for free. 

            </p>


            <button className="!w-fit !px-6 !py-2 !border !border-[#333] !rounded-full !text-sm !font-medium !mb-12 hover:!bg-white hover:!text-black !transition-all !duration-300">
              
              <a href="https://forms.gle/Sk9JS3kcKe8qw1cU6" className="!no-underline">· Click here to join our mailing list!</a>
            </button>

            <div className="!flex !flex-col">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className="!group !cursor-pointer !border-t !border-[#222] !py-8 !transition-all !duration-300"
                >
                  <h3
                    className={`!text-xl !font-medium !transition-colors !duration-300 ${
                      activeTab === index
                        ? "!text-white"
                        : "!text-[#444] group-hover:!text-white"
                    }`}
                  >
                    {feature.title}
                  </h3>

                  <div
                    className={`!overflow-hidden !transition-all !duration-500 !ease-in-out ${
                      activeTab === index
                        ? "!max-h-40 !opacity-100 !mt-4"
                        : "!max-h-0 !opacity-0"
                    }`}
                  >
                    <p className="!text-[#888] !text-base !leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
              <div className="!border-t !border-[#222]"></div>
            </div>
          </div>

          {/* Right Side: Media Display (9/12 columns) */}
          <div className="lg:!col-span-9 !relative !w-full">
            {/* Outer Container for the GIF */}
            <div className="!mt-0 md:!mt-40 !relative !rounded-2xl !overflow-hidden !bg-[#111] !border !border-[#222] !shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {/* Top "Browser" bar for aesthetic context */}
              {/* <div className="!w-full !h-10 !bg-[#1a1a1a] !border-b !border-[#222] !flex !items-center !px-4 !gap-2">
                <div className="!w-2.5 !h-2.5 !rounded-full !bg-[#333]"></div>
                <div className="!w-2.5 !h-2.5 !rounded-full !bg-[#333]"></div>
                <div className="!w-2.5 !h-2.5 !rounded-full !bg-[#333]"></div>
              </div> */}

              {/* The GIF Content Area - Aspect ratio set to handle 16:9 recordings */}
              <div className="!aspect-[16/9] !w-full !flex !items-center !justify-center !bg-black">
                <img
                  key={activeTab}
                  src={features[activeTab].gif}
                  alt={features[activeTab].title}
                  className="!w-full !h-full !object-cover !transition-opacity !duration-700 !animate-in !fade-in"
                />
              </div>
            </div>

            {/* Subtle glow effect behind the image */}
            <div className="!absolute !-inset-4 !bg-blue-500/5 !blur-3xl !-z-10 !rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cards;
