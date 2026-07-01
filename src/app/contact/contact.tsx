/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Mail, ArrowRight } from "lucide-react";
import { FloatingPaths } from "@/components/ui/background-paths";

export default function VerticalContactSection() {
  const [status, setStatus] = useState("");
  const sending = status === "Sending...";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending...");

    const formData = new FormData(e.currentTarget);

    // CRITICAL: Ensure these keys match the names in your <input> tags
    const payload = {
      name: formData.get("name"), // matches <input name="name" />
      email: formData.get("email"), // matches <input name="email" />
      message: formData.get("message"), // matches <textarea name="message" />
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

  const contactMethods = [
    {
      href: "http://www.linkedin.com/company/myresearchguide",
      label: "LinkedIn",
      value: "MYResearchGuide",
      Icon: Linkedin,
    },
    {
      href: "https://www.instagram.com/myresearchguide",
      label: "Instagram",
      value: "@myresearchguide",
      Icon: Instagram,
    },
    {
      href: "mailto:myresearchguide.org@gmail.com",
      label: "Email",
      value: "myresearchguide.org@gmail.com",
      Icon: Mail,
    },
  ];

  const fieldWrap = "!flex !flex-col !gap-2";
  const labelClass =
    "!text-[11px] !font-mono !uppercase !tracking-[0.2em] !text-white/40";
  const inputClass =
    "!w-full !bg-transparent !text-white !text-lg !py-2 !border-0 !border-b !border-white/20 !rounded-none !outline-none !placeholder-white/25 focus:!border-white !transition-colors";

  return (
    <section className="!relative !min-h-screen !bg-black !text-white !px-6 !py-32 md:!py-40 !flex !items-center !justify-center !overflow-hidden">
      {/* Animated background paths */}
      <div className="!absolute !inset-0 !pointer-events-none">
        <FloatingPaths position={1} className="!text-white/20" />
        <FloatingPaths position={-1} className="!text-white/20" />
      </div>

      <div className="!relative !z-10 !max-w-6xl !w-full !mx-auto !grid !grid-cols-1 lg:!grid-cols-2 !gap-16 lg:!gap-24 !items-center">
        {/* LEFT — statement + contact methods */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="!text-[11px] !font-mono !uppercase !tracking-[0.3em] !text-white/40 !mb-6">
            Get in touch
          </p>
          <h1 className="!text-5xl md:!text-7xl !font-bold !tracking-tighter !leading-[0.95] !mb-8">
            Let&apos;s start a
            <br />
            conversation.
          </h1>
          <p className="!text-white/50 !text-base md:!text-lg !leading-relaxed !max-w-md !mb-12">
            Whether you have a question, an idea, or want to get involved with
            MYResearchGuide — we read every message.
          </p>

          <div className="!border-t !border-white/10">
            {contactMethods.map(({ href, label, value, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="!group !flex !items-center !gap-5 !py-5 !border-b !border-white/10 !no-underline !transition-colors hover:!bg-white/[0.03]"
              >
                <span className="!flex !items-center !justify-center !w-11 !h-11 !rounded-full !border !border-white/20 !text-white/80 !transition-colors group-hover:!border-white group-hover:!text-white">
                  <Icon size={18} />
                </span>
                <span className="!flex !flex-col">
                  <span className={labelClass}>{label}</span>
                  <span className="!text-white !text-base">{value}</span>
                </span>
                <ArrowRight
                  size={18}
                  className="!ml-auto !text-white/30 !transition-all group-hover:!text-white group-hover:!translate-x-1"
                />
              </a>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — form with underline inputs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="!space-y-8">
            <div className={fieldWrap}>
              <label htmlFor="name" className={labelClass}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                className={inputClass}
              />
            </div>

            <div className={fieldWrap}>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className={inputClass}
              />
            </div>

            <div className={fieldWrap}>
              <label htmlFor="message" className={labelClass}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="How can we help?"
                rows={4}
                required
                className={`${inputClass} !resize-none`}
              ></textarea>
            </div>

            <div className="!flex !items-center !gap-5 !pt-2">
              <button
                type="submit"
                disabled={sending}
                className="!group !inline-flex !items-center !gap-2 !bg-white !text-black !px-8 !py-3.5 !rounded-full !font-bold !text-sm !uppercase !tracking-tighter !transition-transform active:!scale-95 hover:!bg-white/90 disabled:!opacity-60"
              >
                {status && status !== "Sending..." ? status : "Send message"}
                <ArrowRight
                  size={16}
                  className="!transition-transform group-hover:!translate-x-1"
                />
              </button>
              {sending && (
                <span className="!text-white/50 !text-sm">Sending…</span>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
