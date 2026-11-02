"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Geist } from "next/font/google";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HANDBOOK_URL } from "@/data/handbook-preview";
import styles from "./Faq.module.css";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const questions = [
  {
    id: "about", question: "What is MYResearchGuide?",
    answer: <>MYResearchGuide helps young people get started in STEM research through practical guidance, researcher insights and a community with a shared interest in STEM.</>,
  },
  {
    id: "access", question: "Who can use MYResearchGuide?",
    answer: <>Anyone with an interest in science is welcome, regardless of background or location. Our guide is created mainly by a Malaysian team, so some opportunities and events are most relevant to students in Malaysia.</>,
  },
  {
    id: "start", question: "How can I use MYResearchGuide?",
    answer: <>Start with our <a href={HANDBOOK_URL} target="_blank" rel="noopener noreferrer">research handbook</a> on Notion. It covers the basics, from choosing a topic and contacting researchers to writing and publishing. Check out the <a href="https://myssp.myresearchguide.org/" target="_blank" rel="noopener noreferrer">Malaysia Science Scholar’s Programme (MYSSP)</a> too.</>,
  },
  {
    id: "updates", question: "How can I stay updated with MYResearchGuide?",
    answer: <>Join our <a href="https://forms.gle/Sk9JS3kcKe8qw1cU6" target="_blank" rel="noopener noreferrer">mailing list</a> for updates on programmes, events and research opportunities, or join our <a href="https://discord.gg/V5mRRsa2QS" target="_blank" rel="noopener noreferrer">Discord community</a> for announcements and conversations.</>,
  },
  {
    id: "cost", question: "Is MYResearchGuide free?",
    answer: <>Yes. MYResearchGuide is a non-profit organisation, and our resources are free to use. We believe everyone deserves a chance to explore STEM research.</>,
  },
];

function Faq() {
  return (
    <section id="faq" className={`${geist.className} ${styles.section}`} aria-labelledby="faq-heading">
      <div className={styles.inner}>
        <header className={styles.intro}>
          <h2 id="faq-heading">Frequently asked questions</h2>
          <Link href="/contact" className={styles.contact}>
            <span className={styles.contactLabel}>Still have a question? Get in touch</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </header>

        <Accordion.Root type="single" collapsible className={styles.list}>
          {questions.map(({ id, question, answer }) => (
            <Accordion.Item key={id} value={id} className={styles.item}>
              <Accordion.Header className={styles.itemHeading}>
                <Accordion.Trigger className={styles.trigger}>
                  <span>{question}</span>
                  <span className={styles.toggle} aria-hidden="true">
                    <span className={styles.horizontal} />
                    <span className={styles.vertical} />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className={styles.content}>
                <div className={styles.answer}><p>{answer}</p></div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}

export { Faq };
