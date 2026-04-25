import { Linkedin, Instagram, Mail } from "lucide-react";
import React from "react";
import Image from "next/image";

export default function Foot() {
  return (
    <>
      <footer className="border-t border-gray-300 !py-16 !mt-20">
        <div className="max-w-7xl mx-auto !px-6 flex flex-wrap gap-10 md:gap-0">
          {/* Left Part: 3/5 Basis */}
          <div className="basis-full md:basis-3/5 flex flex-col justify-between">
            <div>
              <Image
                src="/MRG2W.png"
                alt="Brand Logo"
                width={140}
                height={40}
                className="mb-6 object-contain"
              />
            </div>
            <p className=" text-sm !mt-2">
              © {new Date().getFullYear()} MYResearchGuide. All rights reserved.
            </p>
          </div>

          {/* Right Part: 2/5 Basis */}
          <div className="basis-full md:basis-2/5 flex flex-col">
            <h4 className="text-gray-800 font-semibold mb-6">Contact Us</h4>

            <div className="flex gap-6 ">
              <a
                href="http://www.linkedin.com/company/myresearchguide"
                target="_blank"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.instagram.com/myresearchguide"
                target="_blank"
                className="text-gray-500 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="mailto:myresearchguide.org@gmail.com"
                className="text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Gmail"
              >
                <Mail size={24} />
              </a>
            </div>

            <p className="!mt-2 text-gray-500 text-sm">
              Reach out for any inquiries regarding our STEM programs.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
