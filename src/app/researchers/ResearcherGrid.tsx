/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";
import {
  Linkedin,
  GraduationCap,
  Globe,
  Twitter,
  Github,
  Search,
  Building2,
  FlaskConical,
  SlidersHorizontal,
} from "lucide-react";
import { isCompleted } from "@/data/researchers";
import { uniLogo, uniShort, uniFit, uniBg } from "@/data/universities";
import FilterDropdown, { DropdownOption } from "@/components/FilterDropdown";
import UniMarquee from "@/components/UniMarquee";
import UniLogoStack from "@/components/UniLogoStack";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const LEVEL_ORDER = ["Undergrad", "Masters", "PhD", "Postdoc", "Industry"];
const ALL = "All";

// Matches the shape returned by fetchPublicResearchers (src/lib/researchers-db.ts),
// which mirrors the entries of src/data/researchers.js.
type Researcher = {
  name: string;
  tagline: string;
  universities: string[];
  field: string[];
  level: string;
  research: string;
  image: string;
  linkedin: string;
  scholar: string;
  website: string;
  twitter: string;
  github: string;
  interview: string;
};

function initials(name: string) {
  const parts = name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function ResearcherGrid({
  researchers,
}: {
  researchers: Researcher[];
}) {
  const [query, setQuery] = useState("");
  const [uni, setUni] = useState(ALL);
  const [level, setLevel] = useState(ALL);
  const [field, setField] = useState(ALL);
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  const uniNames = useMemo(() => {
    const set = new Set<string>();
    researchers.forEach((r) => (r.universities || []).forEach((u) => set.add(u)));
    return Array.from(set).sort((a, b) => uniShort(a).localeCompare(uniShort(b)));
  }, [researchers]);

  const uniOptions: DropdownOption[] = useMemo(
    () => [
      { value: ALL, label: "All universities" },
      ...uniNames.map((u) => ({
        value: u,
        label: uniShort(u),
        logo: uniLogo(u),
        logoFit: uniFit(u),
        logoBg: uniBg(u),
      })),
    ],
    [uniNames]
  );

  const levelOptions: DropdownOption[] = useMemo(() => {
    const present = new Set(researchers.map((r) => r.level).filter(Boolean));
    return [
      { value: ALL, label: "All levels" },
      ...LEVEL_ORDER.filter((l) => present.has(l)).map((l) => ({
        value: l,
        label: l,
      })),
    ];
  }, [researchers]);

  const fieldOptions: DropdownOption[] = useMemo(() => {
    const set = new Set<string>();
    researchers.forEach((r) => (r.field || []).forEach((f) => set.add(f)));
    return [
      { value: ALL, label: "All fields" },
      ...Array.from(set)
        .sort((a, b) => a.localeCompare(b))
        .map((f) => ({ value: f, label: f })),
    ];
  }, [researchers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return researchers
      .filter((r) => {
        const matchesQuery =
          !q ||
          [r.name, r.tagline, r.research, ...(r.universities || []), ...(r.field || [])]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q);
        const matchesUni = uni === ALL || (r.universities || []).includes(uni);
        const matchesLevel = level === ALL || r.level === level;
        const matchesField = field === ALL || (r.field || []).includes(field);
        return matchesQuery && matchesUni && matchesLevel && matchesField;
      })
      // Completed profiles (with a "Read interview" page) float to the top;
      // otherwise keep the original data order (stable via index tiebreak).
      .map((r, i) => ({ r, i }))
      .sort((a, b) => {
        const ca = isCompleted(a.r) ? 0 : 1;
        const cb = isCompleted(b.r) ? 0 : 1;
        return ca - cb || a.i - b.i;
      })
      .map(({ r }) => r);
  }, [query, uni, level, field, researchers]);

  const anyFilter = uni !== ALL || level !== ALL || field !== ALL || !!query;
  const filterKey = `${query}|${uni}|${level}|${field}`;

  return (
    <section className="!px-4 md:!px-8 !py-12 sm:!py-16 md:!py-24 !bg-black !text-white !min-h-0 md:!min-h-screen">
      {/* Header — preserve existing first reveal */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.7, ease: "easeOut" }
        }
        className="!text-center !mb-10 !mt-24"
      >
        <h1 className="!text-5xl md:!text-[5rem] !tracking-tighter !mb-4 !text-white">
          Our Researchers.
        </h1>
        <p className="!text-lg !max-w-2xl !mx-auto !text-gray-400">
          The network of Malaysian researchers behind MYResearchGuide — spanning
          top institutions and labs around the world.
        </p>
      </motion.div>

      {/* University logo marquee — click a logo to filter by that university */}
      <div className="!max-w-6xl !mx-auto !mb-12">
        <UniMarquee
          names={uniNames}
          activeName={uni === ALL ? undefined : uni}
          onSelect={(name) => setUni((cur) => (cur === name ? ALL : name))}
        />
      </div>

      {/* Search + Filters */}
      <div className="!max-w-7xl !mx-auto !mb-12">
        <div className="!flex !flex-col lg:!flex-row !gap-3 lg:!items-center">
          <div className="!relative !flex-1">
            <Search
              size={18}
              className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !text-zinc-500 !pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, university, or field…"
              className="!w-full !bg-zinc-900 !text-zinc-100 !border !border-zinc-800 !rounded-xl !pl-11 !pr-4 !py-3 !text-sm !outline-none focus:!border-white/40 focus:!bg-zinc-900/80 !transition-colors !placeholder-zinc-500"
            />
          </div>

          <FilterDropdown
            value={uni}
            onChange={setUni}
            options={uniOptions}
            ariaLabel="Filter by university"
            icon={<Building2 size={16} />}
          />
          <FilterDropdown
            value={level}
            onChange={setLevel}
            options={levelOptions}
            ariaLabel="Filter by level"
            icon={<GraduationCap size={16} />}
          />
          <FilterDropdown
            value={field}
            onChange={setField}
            options={fieldOptions}
            ariaLabel="Filter by field"
            icon={<FlaskConical size={16} />}
          />
        </div>

        <div className="!flex !items-center !gap-2 !mt-4 !text-zinc-500 !text-sm">
          <SlidersHorizontal size={14} />
          <span>
            {filtered.length} {filtered.length === 1 ? "researcher" : "researchers"}
            {anyFilter && ` · ${researchers.length} total`}
          </span>
        </div>
      </div>

      {/* Grid */}
      <LayoutGroup>
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              className="!max-w-7xl !mx-auto !text-center !py-24 !text-zinc-500"
            >
              No researchers match your filters.
            </motion.div>
          ) : (
            <motion.div
              key={filterKey}
              variants={prefersReducedMotion ? undefined : containerVariants}
              initial={prefersReducedMotion ? false : "hidden"}
              animate="visible"
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, transition: { duration: 0.15 } }
              }
              className="!max-w-7xl !mx-auto !grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-6"
            >
              {filtered.map((r) => {
                return (
                  <motion.div
                    key={r.name}
                    layout={!prefersReducedMotion}
                    variants={prefersReducedMotion ? undefined : itemVariants}
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : { y: -4, borderColor: "rgba(255,255,255,0.4)" }
                    }
                    whileTap={
                      prefersReducedMotion ? undefined : { scale: 0.99 }
                    }
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="!group !relative !bg-zinc-900/50 !rounded-3xl !p-8 !border !border-zinc-800 !flex !flex-col !items-center !text-center !transition-colors"
                  >
                    {/* Whole-card link for completed profiles (overlay; socials sit above it) */}
                    {/* {completed ? (
                      <Link
                        href={`/researchers/${slugify(r.name)}`}
                        aria-label={`Read ${r.name}'s interview`}
                        className="!absolute !inset-0 !z-0 !rounded-3xl"
                      />
                    ) : null} */}

                    {/* Avatar + corner uni badge */}
                    <div className="!relative !mb-5">
                      <div className="!w-28 !h-28 !rounded-full !overflow-hidden !border-4 !border-zinc-700 !flex !items-center !justify-center !bg-zinc-800 !transition-transform !duration-300 group-hover:!scale-[1.03]">
                        {r.image ? (
                          <img
                            src={r.image}
                            alt={r.name}
                            className="!w-full !h-full !object-cover"
                          />
                        ) : (
                          <span className="!text-2xl !font-bold !text-zinc-400">
                            {initials(r.name)}
                          </span>
                        )}
                      </div>
                      {(r.universities || []).length > 0 ? (
                        <div className="!absolute !-bottom-1 !-right-1">
                          <UniLogoStack
                            names={r.universities}
                            size={30}
                            max={3}
                            ring="#131316"
                          />
                        </div>
                      ) : null}
                    </div>

                    <h3 className="!text-xl !font-bold !text-white !mb-1">{r.name}</h3>
                    <p className="!text-zinc-500 !text-sm !mb-4">{r.tagline}</p>

                    {r.research ? (
                      <p className="!text-zinc-400 !text-sm !mb-5">
                        <span className="!text-zinc-500">Research: </span>
                        {r.research}
                      </p>
                    ) : null}

                    {/* Socials — visible chips, brighter on hover */}
                    <div className="!relative !z-10 !mt-auto !flex !items-center !justify-center !gap-2.5 !pt-3">
                      {r.linkedin ? (
                        <SocialIcon href={r.linkedin} label={`${r.name} on LinkedIn`}>
                          <Linkedin size={16} />
                        </SocialIcon>
                      ) : null}
                      {r.scholar ? (
                        <SocialIcon href={r.scholar} label={`${r.name} research profile`}>
                          <GraduationCap size={16} />
                        </SocialIcon>
                      ) : null}
                      {r.website ? (
                        <SocialIcon href={r.website} label={`${r.name} website`}>
                          <Globe size={16} />
                        </SocialIcon>
                      ) : null}
                      {r.twitter ? (
                        <SocialIcon href={r.twitter} label={`${r.name} on X`}>
                          <Twitter size={16} />
                        </SocialIcon>
                      ) : null}
                      {r.github ? (
                        <SocialIcon href={r.github} label={`${r.name} on GitHub`}>
                          <Github size={16} />
                        </SocialIcon>
                      ) : null}
                    </div>

                    {/* Temporarily disabled — re-enable when interview pages should be promoted
                    {completed ? (
                      <span className="!mt-5 !inline-flex !items-center !gap-1 !text-xs !font-semibold !text-zinc-400 group-hover:!text-white !transition-colors">
                        Read interview
                        <ArrowRight
                          size={13}
                          className="!transition-transform group-hover:!translate-x-0.5"
                        />
                      </span>
                    ) : null}
                    */}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="!inline-flex !items-center !justify-center !w-9 !h-9 !rounded-lg !bg-zinc-800/70 !border !border-zinc-700 !text-zinc-300 hover:!bg-white hover:!text-black hover:!border-white !transition-colors !no-underline !relative !z-10"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
}
