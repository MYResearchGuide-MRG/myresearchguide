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
  HandHeart,
  CircleQuestionMark,
  SquareArrowOutUpRight,
  CircleDollarSign
} from "lucide-react";
import { motion } from "framer-motion";

import { ElementType, ReactNode } from "react"; 

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
      "MYResearchGuide is an organisation providing guidance for all youth to get involved in science research, building a community of fostered passion for STEM.",
  },
  {
    icon: LayoutList,
    value: "item-2",
    question: "Who can use MYResearchGuide?",
    answer:
      "We welcome all those with a devotion to science to join our community and utilize our guide, regardless of background or location. However, MYResearchGuide has been crafted mainly by a Malaysian team - certain opportunities, details and events provided may be more feasible for those in the nearby region(s).",
  },
  {
    icon: Settings,
    value: "item-3",
    question: "How to use MYResearchGuide?",
    answer:
      "Our official handbook will be available on the Notion platform, featuring beginner steps and definitions to alumni experiences. Upcoming additional STEM events, competitions, and opportunities hosted by our organisation may be found on our linked pages.",
  },
  {
    icon: SquareArrowOutUpRight,
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
        to receive instant updates! We are in the process of creating a discord
        server for all announcements and direct user-communication. (Stay
        tuned!)
      </>
    ),
  },
  {
    icon: CircleDollarSign,
    value: "item-5",
    question: "Is MYResearchGuide free?",
    answer:
      "MYResearchGuide is a non-profit organisation. All of our provided resources are with no charge - we believe that everyone deserves a chance to pursue and experience their own research journey.",
  },
];

export default function Accordion_01() {
  return (
    <div className="!mb-40 !bg-black">
      <section className="!w-full !max-w-[1000px] !mx-auto !px-4">
        {/* We keep the Accordion logic, but Framer Motion will handle the visual slide */}
        <Accordion type="single" collapsible className="!space-y-4">
          {accordionItems.map(({ icon: Icon, value, question, answer }) => (
            <AccordionItem
              key={value}
              value={value}
              className="!group !border !border-zinc-800 !rounded-xl !overflow-hidden !bg-zinc-900/20"
            >
              <AccordionTrigger
                className="!flex !items-center !justify-between !w-full !px-6 !py-5 !bg-transparent !text-left hover:!no-underline group-data-[state=open]:!bg-zinc-800/50"
              >
                <div className="!flex !items-center !gap-4 !flex-1">
                  <Icon className="!w-6 !h-6 !text-zinc-500 !transition-colors !duration-300 group-data-[state=open]:!text-spektr-cyan" />
                  <span className="!text-lg md:!text-2xl !font-medium !text-zinc-200 group-data-[state=open]:!text-white">
                    {question}
                  </span>
                </div>
              </AccordionTrigger>

              {/* IMPORTANT: We use forceMount if you want Framer Motion to handle the exit animation properly, 
                  otherwise Radix unmounts the content before the animation finishes. */}
              <AccordionContent className="!p-0 !overflow-hidden">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: "auto", 
                    opacity: 1 
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0 
                  }}
                  transition={{ 
                    duration: 0.3, 
                    ease: "linear" // Constant speed, no "slowing down" effect
                  }}
                  className="!px-6 !pb-6 !pt-2 !text-lg md:!text-xl !text-zinc-400 !border-t !border-zinc-800/50"
                >
                  <p className="!leading-relaxed">
                    {answer}
                  </p>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}