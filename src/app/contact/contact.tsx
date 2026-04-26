/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Linkedin, Instagram, Mail } from "lucide-react";

export default function VerticalContactSection() {
  const [status, setStatus] = useState("");

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setStatus("Sending...");

  const formData = new FormData(e.currentTarget);
  
  // CRITICAL: Ensure these keys match the names in your <input> tags
  const payload = {
    name: formData.get("name"),     // matches <input name="name" />
    email: formData.get("email"),   // matches <input name="email" />
    message: formData.get("message") // matches <textarea name="message" />
  };

  // Debugging: Check your browser console to see if this is null!
  console.log("Payload being sent:", payload);

  const response = await fetch("/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  try {
    if (response.ok) {
      setStatus("Message Sent!");
      (e.target as HTMLFormElement).reset(); // Clear form
    } else {
      setStatus("Error sending.");
    }
  } catch (error) {
    setStatus("System Error.");
  }
};
  return (
    <section className="!min-h-screen !bg-black !p-6 md:!p-12 !flex !items-center !justify-center">
      <div className="!max-w-5xl !w-full !flex !flex-col lg:!flex-row !gap-0">

        {/* Left Side: 3 Vertical Slate Boxes */}
        <div className="!flex !flex-col !gap-4 !z-10 !basis-full lg:!basis-1/3 !mb-6 lg:!mb-0 lg:!translate-x-12 lg:!py-12">

          {/* Address Card */}
          <a
            href="http://www.linkedin.com/company/myresearchguide"
            target="_blank"
            className=""
            aria-label="LinkedIn"
          >
            <div className="!bg-slate-900 !p-8 !flex !flex-col !items-center !text-center !shadow-2xl !border !border-slate-800 !rounded-lg">

              <Linkedin className="!text-slate-400 !mb-4" size={32} />
              <h3 className="!font-bold !text-white !uppercase !tracking-widest !text-xs !mb-3">LinkedIn</h3>
              <p className="!text-slate-300 !text-sm">MYResearchGuide</p>

            </div>
          </a>

          {/* Phone Card */}
          <a
            href="https://www.instagram.com/myresearchguide"
            target="_blank"
            className="text-gray-500 hover:text-pink-600 transition-colors"
            aria-label="Instagram"
          >
            <div className="!bg-slate-900 !p-8 !flex !flex-col !items-center !text-center !shadow-2xl !border !border-slate-800 !rounded-lg">
              <Instagram className="!text-slate-400 !mb-4" size={32} />
              <h3 className="!font-bold !text-white !uppercase !tracking-widest !text-xs !mb-3">Instagram</h3>
              <p className="!text-slate-300 !text-sm">@myresearchguide</p>
            </div>
          </a>

          <a
            href="mailto:myresearchguide.org@gmail.com"
            className="text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Gmail"
          >
            {/* Email Card */}
            <div className="!bg-slate-900 !p-8 !flex !flex-col !items-center !text-center !shadow-2xl !border !border-slate-800 !rounded-lg">
              <Mail className="!text-slate-400 !mb-4" size={32} />
              <h3 className="!font-bold !text-white !uppercase !tracking-widest !text-xs !mb-3">Email</h3>
              <p className="!text-slate-300 !text-sm !hover:text-white !transition-colors">myresearchguide.org@gmail.com</p>
            </div>
            </a>
        </div>

      {/* Right Side: Contact Form */}
      <div className="!p-8 md:!p-16 !basis-full lg:!basis-2/3 !flex !flex-col !justify-center !shadow-2xl !rounded-lg">
        <div className="lg:!pl-16">
          <h2 className="!text-3xl md:!text-4xl !font-bold !text-white !mb-8 !text-center lg:!text-left">Contact Us</h2>

          <form onSubmit={handleSubmit} className="!space-y-4">
            <input
            name="name"
              type="text"
              placeholder="Name"
              required
              className="!w-full !p-4 !bg-slate-900 !text-white !border !border-slate-700 !outline-none !focus:border-slate-500 !placeholder-slate-500 !rounded-lg"
            />
            <input
            name="email"
              type="email"
              placeholder="Email Address"
              required
              className="!w-full !p-4 !bg-slate-900 !text-white !border !border-slate-700 !outline-none !focus:border-slate-500 !placeholder-slate-500 !rounded-lg"
            />
            <textarea
            name="message"
              placeholder="How can we help?"
              rows={4}
              className="!w-full !p-4 !bg-slate-900 !text-white !border !border-slate-700 !outline-none !focus:border-slate-500 !resize-none !rounded-lg"
            ></textarea>

            <div className="!flex !justify-center lg:!justify-start !pt-4">
              <button
                type="submit"
                className="!bg-white !text-slate-900 !px-10 !py-3 !uppercase !font-black !tracking-tighter !transition-transform active:!scale-95 hover:!bg-slate-200 !rounded-lg"
              >
                {status || "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
    </section >
  );
}