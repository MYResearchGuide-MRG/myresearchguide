/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Linkedin,
  GraduationCap,
  Globe,
  Twitter,
  Github,
  ArrowLeft,
} from "lucide-react";
import NewNav from "@/components/NewNav";
import Foot from "@/components/Foot";
import {
  researchers,
  getResearcherBySlug,
  isCompleted,
  slugify,
} from "@/data/researchers";
import { transcripts } from "@/data/transcripts";
import UniLogoStack from "@/components/UniLogoStack";

export function generateStaticParams() {
  return researchers
    .filter((r) => isCompleted(r))
    .map((r) => ({ slug: slugify(r.name) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = getResearcherBySlug(slug);
  if (!r) return { title: "Researcher | MYResearchGuide" };
  return {
    title: `${r.name} | MYResearchGuide`,
    description: `${r.name} — ${r.tagline}. Read the MYResearchGuide interview.`,
  };
}

function initials(name) {
  const parts = name.replace(/^Dr\.?\s+/i, "").split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

// Render the scraped transcript: each line is a block. Short, punctuation-free
// lines are treated as section headings; bullet lines keep a marker.
function Transcript({ text }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <div className="!space-y-4">
      {lines.map((line, i) => {
        if (line.startsWith("•")) {
          return (
            <p key={i} className="!text-zinc-300 !pl-5 !relative !leading-relaxed">
              <span className="!absolute !left-0 !text-zinc-600">•</span>
              {line.replace(/^•\s*/, "")}
            </p>
          );
        }
        const isHeading =
          line.length < 60 && !/[.?!:,"”]$/.test(line) && !/^["“]/.test(line);
        if (isHeading) {
          return (
            <h2
              key={i}
              className="!text-xl md:!text-2xl !font-bold !text-white !pt-6 !tracking-tight"
            >
              {line}
            </h2>
          );
        }
        const isQuote = /^["“]/.test(line);
        return (
          <p
            key={i}
            className={
              isQuote
                ? "!text-zinc-200 !text-lg !leading-relaxed !border-l-2 !border-zinc-700 !pl-5 !italic"
                : "!text-zinc-300 !leading-relaxed"
            }
          >
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default async function ResearcherDetail({ params }) {
  const { slug } = await params;
  const r = getResearcherBySlug(slug);
  if (!r || !isCompleted(r)) notFound();

  const transcript = transcripts[slug];
  const socials = [
    { href: r.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: r.scholar, icon: GraduationCap, label: "Research profile" },
    { href: r.website, icon: Globe, label: "Website" },
    { href: r.twitter, icon: Twitter, label: "X / Twitter" },
    { href: r.github, icon: Github, label: "GitHub" },
  ].filter((s) => s.href);

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <NewNav />

      <section className="!px-4 md:!px-8 !pt-40 !pb-24 !bg-black !text-white">
        <div className="!max-w-3xl !mx-auto">
          <Link
            href="/researchers"
            className="!inline-flex !items-center !gap-2 !text-zinc-500 hover:!text-white !text-sm !mb-10 !no-underline !transition-colors"
          >
            <ArrowLeft size={15} />
            All researchers
          </Link>

          {/* Hero */}
          <div className="!mb-10 !rounded-3xl !border !border-zinc-800 !bg-zinc-900/40 !p-6 sm:!p-8">
            <div className="!flex !flex-col sm:!flex-row !items-center sm:!items-start !gap-5 sm:!gap-7">
              <div className="!relative !shrink-0">
                <div className="!w-28 !h-28 sm:!w-32 sm:!h-32 !rounded-full !overflow-hidden !border-4 !border-zinc-800 !flex !items-center !justify-center !bg-zinc-800">
                  {r.image ? (
                    <img src={r.image} alt={r.name} className="!w-full !h-full !object-cover" />
                  ) : (
                    <span className="!text-3xl !font-bold !text-zinc-400">
                      {initials(r.name)}
                    </span>
                  )}
                </div>
                {(r.universities || []).length > 0 ? (
                  <div className="!absolute !-bottom-1 !-right-1">
                    <UniLogoStack names={r.universities} size={34} max={3} ring="#0f0f11" />
                  </div>
                ) : null}
              </div>

              <div className="!text-center sm:!text-left !flex-1 !min-w-0">
                <h1 className="!text-3xl sm:!text-4xl md:!text-5xl !font-bold !tracking-tight sm:!tracking-tighter !mb-2 !text-white !break-words">
                  {r.name}
                </h1>
                <p className="!text-zinc-400 !text-sm sm:!text-base !mb-5">{r.tagline}</p>

                {/* Socials */}
                {socials.length > 0 ? (
                  <div className="!flex !flex-wrap !items-center !justify-center sm:!justify-start !gap-2">
                    {socials.map((s) => {
                      const Icon = s.icon;
                      return (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${r.name} on ${s.label}`}
                          className="!flex !items-center !justify-center !w-9 !h-9 !bg-zinc-950/60 !border !border-zinc-800 !text-zinc-300 !rounded-lg hover:!bg-white hover:!text-black !transition-colors !no-underline"
                        >
                          <Icon size={16} />
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {r.research ? (
            <p className="!text-zinc-400 !mb-10 !border-l-2 !border-zinc-800 !pl-4">
              <span className="!text-zinc-500">Research focus: </span>
              {r.research}
            </p>
          ) : null}

          {/* Interview */}
          <div className="!border-t !border-zinc-800 !pt-10">
            <div className="!flex !items-center !gap-3 !mb-8">
              <span className="!h-px !flex-1 !bg-zinc-800" />
              <span className="!text-xs !uppercase !tracking-[0.2em] !text-zinc-500 !font-semibold">
                The Interview
              </span>
              <span className="!h-px !flex-1 !bg-zinc-800" />
            </div>

            {transcript ? (
              <Transcript text={transcript} />
            ) : (
              <p className="!text-zinc-500">Transcript coming soon.</p>
            )}
          </div>
        </div>
      </section>

      <Foot />
    </main>
  );
}
