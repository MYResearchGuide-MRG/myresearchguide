/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Install lucide-react if you haven't
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "About Us", href: "/team" },
    { name: "Contact Us", href: "/contact" }, // Added as requested
    // { name: "Partners & Sponsors", href: "/partner-sponsor" }
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <nav className="!sticky !top-0 !z-[9999] !w-full !px-4 !pb-2 !flex !justify-center !bg-black/10 !backdrop-blur-md">
      <motion.div
        className="!relative !pointer-events-auto !flex !items-center !justify-between !w-full !h-[72px] !px-8 !border-b-2 !border-white/10"
      >
        {/* Logo Section */}
        <div className="!flex !cursor-pointer !z-[10000]">
          <Link href="/">
            <img
              src="./MRG1W.png"
              alt="Logo"
              className="!h-9 !w-auto !object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="!hidden md:!flex !items-center !gap-10">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="!text-zinc-400 hover:!text-white !transition-all !duration-300 !text-[15px] !font-medium !no-underline"
            >
              {link.name}
            </Link>
          ))}
          <a href="https://forms.gle/Sk9JS3kcKe8qw1cU6" className="!no-underline">
            <InteractiveHoverButton />
          </a>
          
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:!hidden !z-[10000] !flex !items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="!text-white !p-2 !focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="!fixed !inset-0 !h-screen !w-full !bg-black !flex !flex-col !items-center !justify-center !gap-8 !z-[9999]"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="!text-zinc-400 hover:!text-white !text-2xl !font-medium !transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="!mt-4">
                <InteractiveHoverButton />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
};

export default Nav;