"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
// Import Bootstrap CSS if not already in your layout.tsx
import "bootstrap/dist/css/bootstrap.min.css";

export default function TeamPage() {
  const TEAM_MEMBERS = {
    directors: [
      {
        name: "Dun Li Chan",
        role: "Founder, Executive Director",
        image: "/profile/dunli.jpeg",
        linkedin: "https://www.linkedin.com/in/dun-li-chan-6b3095269/",
      },
      {
        name: "Hazel Lim",
        role: "Co-Founder, Executive Director",
        image: "/profile/hazel.jpeg",
        linkedin: "https://www.linkedin.com/in/hazel-lim-81741b393/",
      },
    ],
    exco: [
      {
        name: "Ernest Tan",
        role: "Head of Tech Department",
        image: "/profile/ernest.jpg",
        linkedin: "https://www.linkedin.com/in/ernest-tan-95187a3a3/",
      },
      {
        name: "Yahaya B. Barison ",
        role: " Executive of Event Department",
        image: "/profile/yahaya.jpeg",
        linkedin: "https://www.linkedin.com/in/yahayabasiron/",
      },
      {
        name: "Estelle Sia",
        role: "Executive of External Relation Department",
        image: "/profile/estelle.jpeg",
        linkedin: "https://www.linkedin.com/in/estelle-sia-1a99bb30b/",
      },
      {
        name: "Yan He Tan",
        role: "Executive of External Relation Department",
        image: "/profile/yanhe.jpeg",
        linkedin: "https://www.linkedin.com/in/yan-he-tan-877289219/",
      },
      {
        name: "Emma Chu",
        role: "Executive of Media and Marketing Department",
        image: "/profile/emma.jpeg",
      },
      {
        name: "Fathy Rashad",
        role: "Executive of Tech Department",
        image: "/profile/fathy.png",
        linkedin: "https://www.linkedin.com/in/mfathyrashad/",
      },
      {
        name: "Moses Lua",
        role: "Executive of Tech Department",
        image: "/profile/anonymous.svg",
        linkedin: "https://www.linkedin.com/in/moseslua/",
      },
    ],
advisors: [
      {
        name: "Prof. Kim Siang Khaw",
        role: "Associate Professor & Tenured Fellow (TDLI) & Muon Physicist (ShangHai Jiaotong)",
        image: "/profile/advisors/khaw.jpg",
        linkedin: "https://www.linkedin.com/in/kim-siang-khaw/",
      },
      {
        name: "Prof. Mathias Foo",
        role: "Associate Professor in Control and Engineering Biology, University of Warwick",
        image: "/profile/advisors/mathias.jpg",
        linkedin: "https://www.linkedin.com/in/mathias-foo-0644b18b/",
      },
      {
        name: "Prof. Nursakinah Suardi",
        role: "Associate Professor at School of Physics, Universiti Sains Malaysia",
        image: "/profile/advisors/nursakinah.jpg",
        linkedin: "https://my.linkedin.com/in/dr-nursakinah-suardi-94a1354a",
      },
      {
        name: "Prof. Yuan-Sen Ting",
        role: "Associate Professor, Dept. of Astronomy, Ohio State University",
        image: "/profile/advisors/ting.png",
        linkedin: "https://www.linkedin.com/in/ting-astro",
      },
      {
        name: "Juin Xian Loh",
        role: "PhD in Chemical Engineering, Nanyang Technological University",
        image: "/interviews/juinxian.png",
        linkedin: "https://sg.linkedin.com/in/juinxianloh",
      },
      {
        name: "Waywen Loh",
        role: "MSc in Integrated Immunology, University of Oxford",
        image: "/profile/advisors/waywen.jpeg",
        linkedin: "https://www.linkedin.com/in/waywen-loh-5441ab143/",
      },
      {
        name: "Faye Jong",
        role: "Radiographer, Brisbane Radiology",
        image: "/profile/advisors/faye.png",
        linkedin: "https://www.linkedin.com/in/faye-jong-614331156/",
      },
      {
        name: "Melvin Cheng",
        role: "Bioengineering & Data Science, Stanford University",
        image: "/profile/advisors/melvin.jpeg",
        linkedin: "https://www.linkedin.com/in/melwincheng/",
      },
      {
        name: "Owen Loh",
        role: "Physics, University of Oxford",
        image: "/interviews/owen.png",
        linkedin: "https://www.linkedin.com/in/olzm/",
      },
      {
        name: "Fathy Rashad",
        role: "Co-founder & CTO at Cleve | Prev: DeCoDe Lab at MIT",
        image: "/profile/fathy.png",
        linkedin: "https://www.linkedin.com/in/mfathyrashad/",
      },
]
  };

  const [isAscending, setIsAscending] = useState(true);

  // Note: 'members' and 'setMembers' were referenced in your original sort function but not defined in the snippet.
  // This logic is kept for structural integrity but may need a defined state if used.
  const handleSort = () => {
    /* logic for sorting */
  };

  return (
    <>
      <div className="!min-h-screen !bg-black !text-white !font-sans !py-20 !px-4">
        {/* Header Button Section */}
        <section className="!text-center !mb-20">
          <div className="flex flex-col gap-6 p-10 bg-black items-center">
            <div
              className="
              !pointer-events-auto
              cursor-pointer
              !select-none
              !relative 
              !px-8 
              !py-3 
              !rounded-full 
              !border 
              !border-white/20 
              !bg-white/10 
              !backdrop-blur-md
              !text-white 
              !font-semibold 
              !text-3xl
              !shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.4),0_10px_20px_rgba(0,0,0,0.5)]
              !transition-all 
            "
            >
              <div className="!absolute !bottom-0 !left-1/2 !-translate-x-1/2 !w-3/4 !h-[1px] !bg-gradient-to-r !from-transparent !via-white/40 !to-transparent" />
              Meet our team
            </div>
          </div>

          {/* Board of Advisors Section */}
          <section className="!text-center !py-20 !px-4">
            <h1 className="!text-7xl !font-bold !mb-20 !mt-5">
              Board of Advisors
            </h1>

            {/* CHANGE MADE HERE: 
              Replaced !grid with !flex !flex-wrap !justify-center 
              This ensures that the 7th card (or any orphaned card) centers automatically.
          */}
            <div className="!flex !flex-wrap !justify-center !gap-x-8 !gap-y-12 !mt-15 !max-w-7xl !mx-auto">
              {TEAM_MEMBERS.advisors.map((member, index) => (
                <div key={index} className="!flex !flex-col !items-center">
                  {/* Normal Image Container */}
                  <div className="!w-48 !h-48 !overflow-hidden !rounded-full !bg-zinc-900 !border !border-zinc-800 !mb-[-40px] !z-10">
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        title="Click to see their LinkedIn profile"
                        className="!block !w-full !h-full !cursor-pointer"
                      >
                        <img
                          src={member.image}
                          alt={member.name}
                          className="!w-full !h-full !object-cover !transition-transform !duration-300 hover:!scale-110"
                        />
                      </a>
                    ) : (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="!w-full !h-full !object-cover"
                      />
                    )}
                  </div>

                  {/* Text Card Container */}
                  <div className="!relative !bg-zinc-800/50 !pt-14 !pb-6 !px-10 !rounded-3xl !w-72 !border !border-zinc-700 !z-0 !min-h-[160px] !flex !flex-col !justify-center">
                    <h3 className="!text-xl !font-bold">{member.name}</h3>
                    <p className="!text-zinc-500 !text-sm !italic">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        {/* Directors Section */}
        <section className="!text-center !mb-20">
          <h1 className="!text-7xl !font-bold !mb-5 !mt-20">
            Board of Executive Directors
          </h1>

          <div className="!flex !flex-wrap !justify-center !gap-8 !mt-15 ">
            {TEAM_MEMBERS.directors.map((member, index) => (
              <div
                key={index}
                className="!relative !flex !flex-col !items-center !pt-10"
              >
                <div className="!relative !z-10 !w-48 !h-48 !rounded-full !overflow-hidden !bg-zinc-900 !mb-[-40px]">
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      title="Click to see their LinkedIn profile"
                      className="!block !w-full !h-full !cursor-pointer"
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="!w-full !h-full !object-cover !transition-transform !duration-300 hover:!scale-110"
                      />
                    </a>
                  ) : (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="!w-full !h-full !object-cover"
                    />
                  )}
                </div>
                <div className="!relative !bg-zinc-800/50 !pt-14 !pb-6 !px-10 !rounded-3xl !w-72 !border !border-zinc-700">
                  <h3 className="!text-xl !font-bold">{member.name}</h3>
                  <p className="!text-zinc-500 !text-sm !italic">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXCO Team Section */}
        <section className="!text-center">
          <h1 className="!text-6xl !font-bold !mb-5 !mt-20">
            Board of Committees
          </h1>

          {/* 
          Added !max-w-6xl to ensure items wrap after the 3rd card 
          to match the layout in image_864b4d.jpg 
        */}
          <div className="!flex !flex-wrap !justify-center !gap-8 !max-w-6xl !mx-auto">
            {TEAM_MEMBERS.exco.map((member, index) => (
              <div
                key={index}
                className="!relative !flex !flex-col !items-center !pt-10"
              >
                <div className="!relative !z-10 !w-48 !h-48 !rounded-full !overflow-hidden !bg-zinc-900 !mb-[-40px]">
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      title="Click to see their LinkedIn profile"
                      className="!block !w-full !h-full !cursor-pointer"
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="!w-full !h-full !object-cover !transition-transform !duration-300 hover:!scale-110"
                      />
                    </a>
                  ) : (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="!w-full !h-full !object-cover"
                    />
                  )}
                </div>
                <div className="!relative !bg-zinc-800/50 !pt-14 !pb-6 !px-10 !rounded-3xl !w-72 !border !border-zinc-700 !min-h-[150px] !flex !flex-col !justify-center">
                  <h3 className="!text-xl !font-bold">{member.name}</h3>
                  <p className="!text-zinc-500 !text-sm !italic">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
