"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { organisations, type Organisation } from "@/data/organisations";
import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";
import styles from "./PartnersSponsors.module.css";

type Filter = "all" | Organisation["category"];
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sponsor", label: "Sponsors" },
  { id: "partner", label: "Partners" },
];
const groups = [
  { id: "sponsor", title: "Gold sponsors" },
  { id: "partner", title: "Partners" },
] as const;

function OrganisationCard({ org, depth, direction, reducedMotion, onStep }: {
  org: Organisation;
  depth: number;
  direction: number;
  reducedMotion: boolean;
  onStep: (step: number) => void;
}) {
  const isPresent = useIsPresent();
  const active = depth === 0 && isPresent;
  const dragged = useRef(false);
  const isInstagram = org.url.includes("instagram.com");

  return (
    <motion.article
      className={styles.deckCard}
      data-active={active}
      data-front={depth === 0}
      aria-hidden={!active}
      aria-labelledby={active ? `${org.id}-name` : undefined}
      id={active ? "organisation-card" : undefined}
      initial={reducedMotion ? false : { x: direction * 45, y: 12, rotate: direction * 4, opacity: 0 }}
      animate={{ x: depth === 1 ? -13 : depth === 2 ? 15 : 0, y: depth * -7, rotate: depth === 1 ? -4 : depth === 2 ? 4 : 0, scale: 1 - depth * 0.025, opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { x: -direction * 140, y: 12, rotate: -direction * 9, opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
      style={{ zIndex: isPresent ? 3 - depth : 4, pointerEvents: active ? "auto" : "none" }}
      drag={active && !reducedMotion ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.35}
      dragMomentum={false}
      onPointerDown={() => { dragged.current = false; }}
      onDragStart={() => { dragged.current = true; }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 500) {
          onStep(info.offset.x < 0 ? 1 : -1);
        }
      }}
    >
      <div className={styles.cardMeta}>
        <span>{org.category === "sponsor" ? "Gold sponsor" : "Partner"}</span>
        <span>{org.field}</span>
      </div>
      <div className={styles.logoPlate}>
        <Image src={org.logo} alt="" fill sizes="(max-width: 759px) 220px, 360px" draggable={false} />
      </div>
      <div className={styles.cardCopy}>
        <h2 id={active ? `${org.id}-name` : undefined}>{org.name}</h2>
        <p>{org.description}</p>
      </div>
      <a
        className={styles.cardVisit}
        href={org.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={active ? 0 : -1}
        aria-label={`Visit ${org.name}${isInstagram ? " on Instagram" : " website"} (opens in a new tab)`}
        onClick={event => { if (dragged.current) event.preventDefault(); }}
      >
        {isInstagram ? "Visit Instagram" : "Visit website"}<ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </motion.article>
  );
}

export default function OrganisationDirectory() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(organisations[0].id);
  const [direction, setDirection] = useState(1);
  const reducedMotion = useHydrationSafeReducedMotion();
  const matching = organisations.filter(org => filter === "all" || org.category === filter);
  const selectedIndex = Math.max(0, matching.findIndex(org => org.id === selectedId));
  const selected = matching[selectedIndex];
  const visibleCards = Array.from({ length: Math.min(3, matching.length) }, (_, depth) => ({
    org: matching[(selectedIndex + depth) % matching.length], depth,
  })).reverse();

  function select(id: string) {
    setDirection(matching.findIndex(org => org.id === id) >= selectedIndex ? 1 : -1);
    setSelectedId(id);
  }

  function step(offset: number) {
    setDirection(offset);
    setSelectedId(matching[(selectedIndex + offset + matching.length) % matching.length].id);
  }

  function changeFilter(next: Filter) {
    setFilter(next);
    setDirection(1);
    if (next !== "all" && selected.category !== next) {
      setSelectedId(organisations.find(org => org.category === next)!.id);
    }
  }

  return (
    <section id="organisations" className={styles.directory} aria-label="Our organisations">
      <div className={styles.index}>
        <div className={styles.filters} role="group" aria-label="Filter organisations">
          {filters.map(item => (
            <button key={item.id} type="button" onClick={() => changeFilter(item.id)} aria-pressed={filter === item.id}>
              {item.label}
            </button>
          ))}
        </div>
        <div className={styles.desktopIndex}>
          {groups.map(group => {
            const items = matching.filter(org => org.category === group.id);
            if (!items.length) return null;
            return (
              <div className={styles.indexGroup} key={group.id}>
                <h2>{group.title}</h2>
                {items.map(org => (
                  <button key={org.id} type="button" onClick={() => select(org.id)} aria-pressed={selected.id === org.id} aria-controls="organisation-card">
                    <span>{org.name}</span><ArrowUpRight size={15} aria-hidden="true" />
                  </button>
                ))}
              </div>
            );
          })}
        </div>
        <label className={styles.mobileIndex}>
          <span>Choose an organisation</span>
          <select aria-label="Choose an organisation" value={selected.id} onChange={event => select(event.target.value)}>
            {matching.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
          </select>
        </label>
      </div>

      <div className={styles.deck}>
        <div
          className={styles.deckStage}
          role="region"
          aria-roledescription="carousel"
          aria-label="Organisation cards. Use left and right arrow keys to browse."
          tabIndex={0}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              step(event.key === "ArrowRight" ? 1 : -1);
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault();
              select(matching[event.key === "Home" ? 0 : matching.length - 1].id);
            }
          }}
        >
          <AnimatePresence initial={false}>
            {visibleCards.map(({ org, depth }) => (
              <OrganisationCard key={org.id} org={org} depth={depth} direction={direction} reducedMotion={reducedMotion} onStep={step} />
            ))}
          </AnimatePresence>
        </div>
        <div className={styles.deckControls}>
          <span className={styles.deckHint}>Drag a card to explore.</span>
          <div className={styles.pagination}>
            <button type="button" onClick={() => step(-1)} aria-label="Previous organisation"><ArrowLeft size={19} aria-hidden="true" /></button>
            <span className={styles.counter}>{String(selectedIndex + 1).padStart(2, "0")} <span>/ {String(matching.length).padStart(2, "0")}</span></span>
            <button type="button" onClick={() => step(1)} aria-label="Next organisation"><ArrowRight size={19} aria-hidden="true" /></button>
          </div>
        </div>
        <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{selected.name}, {selectedIndex + 1} of {matching.length} organisations.</p>
      </div>
    </section>
  );
}
