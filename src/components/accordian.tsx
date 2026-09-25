"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    HelpCircle,
    LayoutList,
    Settings,
    Accessibility,
} from "lucide-react";
import { ElementType, ReactNode } from "react";
import { motion } from "framer-motion";


// 2. Update the type definition
type AccordionItemType = {
    icon: ElementType;
    value: string;
    question: string;
    answer: ReactNode; // Changed from 'string' to 'ReactNode'
};


const accordionItems: AccordionItemType[] = [
    {
        icon: HelpCircle,
        value: "item-1",
        question: "What is MYResearchGuide?",
        answer:
            "MYResearchGuide is a platform providing guidance for youth to engage in science research!",
    },
    {
        icon: LayoutList,
        value: "item-2",
        question: "Who can use MYResearchGuide?",
        answer:
            "Anyone who wants to get started but doesn’t know how! While the guide is crafted by Malaysians for Malaysians, we welcome students from anywhere to read it, but do take note that some opportunities are tailored specifically to Malaysians! ",
    },
    {
        icon: Settings,
        value: "item-3",
        question: "How can I use MYResearchGuide?",
        answer:
            "We have several sections in our Notion guide, from beginner steps to alumni experiences, each targeted for different questions you may have.",
    },
    {
        icon: Accessibility,
        value: "item-4",
        question: "How can I stay updated with MYResearchGuide?",
        answer: (
            <>
                You can sign up for our{" "}
                <a 
                    href="https://forms.gle/Sk9JS3kcKe8qw1cU6" 
                    className="!text-spektr-cyan !underline !underline-offset-4 hover:!text-white !transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    mailing list
                </a>{" "}
                to receive instant updates!
            </>
        ),
    },
    {
        icon: Accessibility,
        value: "item-5",
        question: "Is MYResearchGuide free?",
        answer:
            "Yes absolutely! We believe that every Malaysians deserve to have a chance to work on researches. ",
    },
];

export default function Accordion_01() {
    return (
        <div className="!min-h-screen !bg-black !py-12">
            <section className="!w-full !max-w-[800px] !mx-auto !px-4">
                <Accordion type="single" collapsible className="!space-y-1">
                    {accordionItems.map(({ icon: Icon, value, question, answer }) => (
                        <AccordionItem
                            key={value}
                            value={value}
                            className="!border-b !border-zinc-800"
                        >
                            <AccordionTrigger
                                className="!flex !items-center !justify-between !w-full !py-6 !bg-transparent !text-left hover:!no-underline group"
                            >
                                <div className="!flex !items-center !gap-4 !flex-1">
                                    <Icon className="!w-5 !h-5 !text-zinc-500 group-data-[state=open]:!text-spektr-cyan" />
                                    <span className="!text-lg md:!text-xl !text-zinc-300 group-data-[state=open]:!text-white">
                                        {question}
                                    </span>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="!pb-6 !text-base md:!text-lg !text-zinc-400"
                                >
                                    {answer}
                                </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </div>
    );
}