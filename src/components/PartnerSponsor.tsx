/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const partners = [
    {name: "MBIOS", logo: "/mbios.png"},
    {name: "Seaecon", logo: "/seaecon.png"},
    {name: "APCORE", logo: "/apcore.jpg"},
    {name: "Girls In STEM", logo: "/girls4stem.jpeg"},
];

const sponsors = [
    {name: "Sponsor 1", logo: "/fah.png"},
    {name: "Sponsor 2", logo: "/fah.png"},
    {name: "Sponsor 3", logo: "/fah.png"},
    {name: "Sponsor 4", logo: "/fah.png"},
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PartnerSponsor() {
    return (
        <section className="!bg-black !text-white !py-24 !px-6 !min-h-screen !flex !flex-col !items-center !justify-center">
            <div className="!max-w-5xl !w-full !text-center !mb-16 !mx-auto">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="!text-center !mb-20"
                >
                    <p className="!text-slate-500 !uppercase !tracking-widest !mb-4 !text-xs">
                        Backed by
                    </p>
                    <h2 className="!text-4xl md:!text-6xl !font-bold !tracking-tighter !leading-tight">
                        Our Partners &{" "}
                        <span className="!bg-gradient-to-r !from-stone-400 !to-slate-300 !bg-clip-text !text-transparent">
                            Sponsors
                        </span>
                    </h2>
                    <p className="!text-slate-400 !mt-6 !text-base md:!text-lg !max-w-2xl !mx-auto !leading-relaxed">
                        We are grateful to the organisations and individuals who support our mission to make research accessible to all.
                    </p>
                </motion.div>

                {/* Partners */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="!mb-20"
                ></motion.div>
            </div>
        </section>
    );
}