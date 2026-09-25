/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ArrowUpRight,
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Code2,
  ExternalLink,
  Handshake,
  Linkedin,
  PenLine,
  WalletCards,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useHydrationSafeReducedMotion } from "@/components/ui/use-hydration-safe-reduced-motion";
import { advisors, departments, people } from "./organisation-data";
import styles from "./organisation.module.css";

const departmentIcons = {
  code: Code2,
  camera: Camera,
  handshake: Handshake,
  clipboard: ClipboardList,
  calendar: CalendarDays,
  pen: PenLine,
  wallet: WalletCards,
};

const tierLabels = {
  executive: "Executive leadership",
  director: "Department director",
  member: "Team member",
  advisor: "Advisor",
};

const departmentNames = new Map(departments.map((department) => [department.id, department.name]));

function classNames(...classList) {
  return classList.filter(Boolean).join(" ");
}

const EASE = [0.22, 1, 0.36, 1];

// Container drives the cascade; cards opt in by declaring `cardVariants`.
const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

// prefers-reduced-motion resolves false during SSR and the first client paint,
// so cards can briefly commit the `hidden` keyframe before the real value
// arrives. Both labels here settle on the neutral state, which clears that
// stale inline transform instead of leaving the grid shrunk and offset.
const staticGroupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
};

const staticCardVariants = {
  hidden: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
};

// Matches the fade-up reveal used by the About/Mission sections.
function Reveal({ children, className, delay = 0, reduced }) {
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduced ? { duration: 0 } : { duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// Same reveal, but children cascade in one after another.
function StaggerGroup({ children, className, reduced, as: Tag = motion.div }) {
  return (
    <Tag
      className={className}
      variants={reduced ? staticGroupVariants : groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </Tag>
  );
}

// Cards animate transform via motion, so CSS only owns colour on hover.
function cardMotion(reduced) {
  // Variants stay declared either way so the card always has a definition for
  // whichever label the parent group is on; dropping them mid-flight would
  // freeze the card on its last committed keyframe.
  return reduced
    ? { variants: staticCardVariants }
    : {
        variants: cardVariants,
        whileHover: { y: -6, transition: { duration: 0.3, ease: EASE } },
        whileTap: { scale: 0.985, transition: { duration: 0.12 } },
      };
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Avatar({ person, size = "member" }) {
  const [failedImage, setFailedImage] = useState(null);
  const canShowImage = Boolean(person.image && failedImage !== person.image);

  return (
    <span className={classNames(styles.avatar, styles[`avatar${size[0].toUpperCase()}${size.slice(1)}`])}>
      {canShowImage ? (
        <img
          src={person.image}
          alt={`${person.name} portrait`}
          onError={() => setFailedImage(person.image)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(person.name)}</span>
      )}
    </span>
  );
}

const departmentPanelId = (departmentId) => `department-drawer-${departmentId}`;

function DepartmentIcon({ icon }) {
  const Icon = departmentIcons[icon] || Code2;
  return <Icon size={20} strokeWidth={1.8} aria-hidden="true" />;
}

/* Persistent chevron so it reads as "there is more behind this card" without
   needing a hover to discover it. */
function MoreCue({ label }) {
  return (
    <span className={styles.moreCue}>
      <span className={styles.moreCueText}>{label}</span>
      <ChevronRight size={15} strokeWidth={2.2} aria-hidden="true" />
    </span>
  );
}

function PersonNode({ person, variant, onSelect, active = false, reduced }) {
  return (
    <motion.button
      type="button"
      className={classNames(styles.personNode, styles[`personNode${variant[0].toUpperCase()}${variant.slice(1)}`], active && styles.personNodeActive)}
      onClick={() => onSelect(person)}
      data-person-control="true"
      {...cardMotion(reduced)}
    >
      <Avatar person={person} size={variant} />
      <span className={styles.plate}>
        <span className={styles.personName}>{person.name}</span>
        <span className={styles.personTitle}>{person.title}</span>
        <MoreCue label="credentials" />
      </span>
    </motion.button>
  );
}

function DepartmentNode({ department, active, onSelect, peopleById, reduced }) {
  const Icon = departmentIcons[department.icon] || Code2;
  const director = department.directorId ? peopleById.get(department.directorId) : null;
  const count = department.memberIds.length + (director ? 1 : 0);

  return (
    <motion.button
      type="button"
      className={classNames(styles.departmentNode, active && styles.departmentNodeActive)}
      onClick={() => onSelect(department.id)}
      aria-haspopup="dialog"
      aria-expanded={active}
      /* The panel only exists while open, so the reference is dropped when
         closed rather than pointing at a missing id. */
      aria-controls={active ? departmentPanelId(department.id) : undefined}
      data-department-control="true"
      {...cardMotion(reduced)}
    >
      <span className={styles.departmentIcon}>
        <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className={styles.plate}>
        <span className={styles.departmentName}>{department.name}</span>
        <span className={styles.departmentOwner}>
          {director ? `Led by ${director.name}` : "Shared unit"}
        </span>
        <MoreCue label={`${count} ${count === 1 ? "person" : "people"}`} />
      </span>
    </motion.button>
  );
}

function MemberRow({ person, departmentId, onSelect, isLead }) {
  const otherDepartments = person.departments
    .filter((id) => id !== departmentId)
    .map((id) => departmentNames.get(id))
    .filter(Boolean);

  return (
    <button
      type="button"
      className={classNames(styles.memberRow, isLead && styles.memberRowLead)}
      onClick={() => onSelect(person)}
      data-person-control="true"
    >
      <Avatar person={person} size="member" />
      <span className={styles.memberRowCopy}>
        <span className={styles.memberRowName}>{person.name}</span>
        <span className={styles.memberRowTitle}>{person.title}</span>
      </span>
      {otherDepartments.length > 0 ? (
        <span className={styles.memberRowAffiliations}>{otherDepartments.join(" / ")}</span>
      ) : null}
      <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}

/* Director first, then members — shared by the mobile accordion and the
   desktop overlay so both list people in the same order. */
function departmentRoster(department, peopleById) {
  const director = department.directorId ? peopleById.get(department.directorId) : null;
  const members = department.memberIds
    .map((id) => peopleById.get(id))
    .filter(Boolean)
    .sort((first, second) => {
      if (first.tier === "director" && second.tier !== "director") return -1;
      if (second.tier === "director" && first.tier !== "director") return 1;
      return 0;
    });
  return director ? [director, ...members] : members;
}

function DepartmentExpansion({ department, peopleById, onSelect, mobile = false, isOpen = false }) {
  const departmentPeople = departmentRoster(department, peopleById);
  const panelId = `department-panel-${department.id}${mobile ? "-mobile" : ""}`;

  return (
    <section
      id={panelId}
      className={classNames(styles.departmentExpansion, mobile && styles.departmentExpansionMobile)}
      aria-label={`${department.name} people`}
      hidden={!isOpen}
      data-department-expansion="true"
    >
      <div className={styles.expansionHeader}>
        <div className={styles.expansionTitleGroup}>
          <span className={styles.expansionIcon}>
            <DepartmentIcon icon={department.icon} />
          </span>
          <div>
            <h3>{department.name}</h3>
          </div>
        </div>
        <span className={styles.expansionCount}>{departmentPeople.length} {departmentPeople.length === 1 ? "person" : "people"}</span>
      </div>
      <div className={styles.memberList}>
        {departmentPeople.map((person, index) => (
          <MemberRow
            key={person.id}
            person={person}
            departmentId={department.id}
            onSelect={onSelect}
            isLead={index === 0 && person.tier === "director"}
          />
        ))}
      </div>
    </section>
  );
}

/* Desktop department view. This used to be a static panel that appeared below
   the grid, which made the whole section feel like a table. Now it flies in
   over the graph and hands off to the profile drawer, so drilling into a
   department reads as navigation rather than an expanding row. */
function DepartmentDrawer({ department, peopleById, onSelectPerson, onClose, reduced }) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!department) return undefined;

    const previousFocus = document.activeElement;
    const panel = panelRef.current;
    const focusableSelector =
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      // Queried per keystroke: the roster is staggered in, so a list captured
      // on mount would miss rows that mounted after it.
      const focusableElements = panel?.querySelectorAll(focusableSelector) || [];
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Scroll locking lives in the parent: this drawer's exit animation outlasts
    // the profile drawer's mount during a handoff, so two save/restore pairs
    // here would interleave and leave the body stuck.
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [department, onClose]);

  if (!department) return null;

  const roster = departmentRoster(department, peopleById);
  const panelId = departmentPanelId(department.id);
  const titleId = `${panelId}-title`;

  return (
    <motion.div
      className={styles.departmentLayer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.aside
        ref={panelRef}
        id={panelId}
        className={styles.departmentPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-department-expansion="true"
        initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.92, y: 26 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 14 }}
        transition={
          reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 30, mass: 0.9 }
        }
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.profileClose}
          onClick={onClose}
          aria-label={`Close ${department.name}`}
          title="Close"
        >
          <X size={20} strokeWidth={1.8} aria-hidden="true" />
        </button>

        <div className={styles.departmentPanelHeader}>
          <motion.span
            className={styles.departmentPanelIcon}
            initial={reduced ? false : { scale: 0.7, opacity: 0 }}
            animate={reduced ? false : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE, delay: reduced ? 0 : 0.05 }}
          >
            <DepartmentIcon icon={department.icon} />
          </motion.span>
          <div>
            <p className={styles.departmentPanelKicker}>Department</p>
            <h3 id={titleId}>{department.name}</h3>
            <p className={styles.departmentPanelCount}>
              {roster.length} {roster.length === 1 ? "person" : "people"}
            </p>
          </div>
        </div>

        <div className={styles.departmentPanelList}>
          {roster.map((person, index) => (
            <motion.div
              key={person.id}
              initial={reduced ? false : { opacity: 0, x: -14 }}
              animate={reduced ? false : { opacity: 1, x: 0 }}
              transition={{
                duration: 0.34,
                ease: EASE,
                delay: reduced ? 0 : 0.08 + index * 0.045,
              }}
            >
              <MemberRow
                person={person}
                departmentId={department.id}
                onSelect={onSelectPerson}
                isLead={index === 0 && person.tier === "director"}
              />
            </motion.div>
          ))}
        </div>
      </motion.aside>
    </motion.div>
  );
}

function ProfileDrawer({ person, onClose }) {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!person) return undefined;

    const previousFocus = document.activeElement;
    const drawer = drawerRef.current;
    const focusableSelector =
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = drawer?.querySelectorAll(focusableSelector) || [];

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // See DepartmentDrawer: the parent owns the body scroll lock.
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose, person]);

  if (!person) return null;

  const profileTitleId = `profile-title-${person.id}`;

  return (
    <div
      className={styles.profileLayer}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        ref={drawerRef}
        className={styles.profileDrawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby={profileTitleId}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.profileClose}
          onClick={onClose}
          aria-label="Close profile"
          title="Close profile"
        >
          <X size={20} strokeWidth={1.8} aria-hidden="true" />
        </button>

        <div className={styles.profileIntro}>
          <Avatar person={person} size="profile" />
          <div>
            <p className={styles.profileTier}>{tierLabels[person.tier]}</p>
            <h2 id={profileTitleId}>{person.name}</h2>
            <p className={styles.profileRole}>{person.title}</p>
          </div>
        </div>

        {person.departments?.length > 0 ? (
          <section className={styles.profileSection} aria-labelledby={`${profileTitleId}-departments`}>
            <h3 id={`${profileTitleId}-departments`}>Departments</h3>
            <div className={styles.profileDepartments}>
              {person.departments.map((departmentId) => (
                <span key={departmentId} className={styles.profileDepartment}>
                  {departmentNames.get(departmentId)}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {person.education ? (
          <section className={styles.profileSection} aria-labelledby={`${profileTitleId}-education`}>
            <h3 id={`${profileTitleId}-education`}>Education</h3>
            <p>{person.education}</p>
          </section>
        ) : null}

        {person.links?.length > 0 ? (
          <section className={styles.profileSection} aria-labelledby={`${profileTitleId}-links`}>
            <h3 id={`${profileTitleId}-links`}>Links</h3>
            <div className={styles.profileLinks}>
              {person.links.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                  {link.label === "LinkedIn" ? <Linkedin size={16} aria-hidden="true" /> : <ExternalLink size={16} aria-hidden="true" />}
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </aside>
    </div>
  );
}

function AdvisorCard({ person, onSelect, reduced }) {
  return (
    <motion.button
      type="button"
      className={styles.advisorCard}
      onClick={() => onSelect(person)}
      data-person-control="true"
      {...cardMotion(reduced)}
    >
      <Avatar person={person} size="advisor" />
      <span className={styles.plate}>
        <span className={styles.advisorCopy}>
          <span className={styles.advisorName}>{person.name}</span>
          <span className={styles.advisorTitle}>{person.title}</span>
        </span>
        <MoreCue label="credentials" />
      </span>
    </motion.button>
  );
}

export default function OrganisationGraph() {
  const [activeDepartmentId, setActiveDepartmentId] = useState(null);
  const [activePersonId, setActivePersonId] = useState(null);
  // Both breakpoints share the active-department id (it also drives the
  // director highlight), so the surface is tracked separately to keep the
  // desktop overlay from firing on top of the mobile accordion.
  const [departmentSurface, setDepartmentSurface] = useState(null);
  const peopleById = useMemo(() => new Map(people.map((person) => [person.id, person])), []);
  const allProfilesById = useMemo(
    () => new Map([...people, ...advisors].map((person) => [person.id, person])),
    [],
  );
  const activeProfile = activePersonId ? allProfilesById.get(activePersonId) : null;
  const activeDepartment =
    activeDepartmentId && departmentSurface === "desktop"
      ? departments.find((department) => department.id === activeDepartmentId) || null
      : null;

  const toggleDepartment = useCallback((departmentId, surface) => {
    setActiveDepartmentId((currentId) => (currentId === departmentId ? null : departmentId));
    setDepartmentSurface(surface);
  }, []);

  const handleDesktopDepartmentSelect = useCallback(
    (departmentId) => toggleDepartment(departmentId, "desktop"),
    [toggleDepartment],
  );

  const handleMobileDepartmentSelect = useCallback(
    (departmentId) => toggleDepartment(departmentId, "mobile"),
    [toggleDepartment],
  );

  const handlePersonSelect = useCallback((person) => {
    setActivePersonId(person.id);
  }, []);

  // Picking someone out of a department hands off to their profile instead of
  // stacking two dialogs, which is what makes the drill-down feel like a jump
  // rather than a panel opening on top of a panel.
  const handleDepartmentPersonSelect = useCallback((person) => {
    setActiveDepartmentId(null);
    setActivePersonId(person.id);
  }, []);

  const handleDepartmentClose = useCallback(() => {
    setActiveDepartmentId(null);
  }, []);

  const handleProfileClose = useCallback(() => {
    setActivePersonId(null);
  }, []);

  // One owner for the body scroll lock, keyed on "is any overlay open" rather
  // than on either drawer's lifecycle, so a department-to-profile handoff never
  // unlocks mid-flight or leaves the page frozen once both have closed.
  const overlayOpen = Boolean(activeDepartment || activeProfile);
  useEffect(() => {
    if (!overlayOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [overlayOpen]);

  useEffect(() => {
    if (!activeDepartmentId) return undefined;

    const handleDocumentClick = (event) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest("[data-department-control], [data-department-expansion]")) {
        setActiveDepartmentId(null);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [activeDepartmentId]);

  const directors = people.filter((person) => person.tier === "director");
  const executives = people.filter((person) => person.tier === "executive");
  const prefersReducedMotion = useHydrationSafeReducedMotion();

  return (
    <section className={styles.organisation} id="organisation" aria-label="Advisors and organisation">
      <section className={styles.advisorsSection} aria-labelledby="advisors-title">
        <Reveal className={styles.advisorsHeader} reduced={prefersReducedMotion}>
          <h2 id="advisors-title" className={styles.advisorsTitle}>
            Board of <span>Advisors.</span>
          </h2>
          <p>Guidance from researchers and professionals who help the organisation grow with care.</p>
        </Reveal>
        <StaggerGroup className={styles.advisorGrid} reduced={prefersReducedMotion}>
          {advisors.map((person) => (
            <AdvisorCard
              key={person.id}
              person={person}
              onSelect={handlePersonSelect}
              reduced={prefersReducedMotion}
            />
          ))}
        </StaggerGroup>
      </section>

      <section aria-labelledby="organisation-title">
      <Reveal className={styles.organisationHeader} reduced={prefersReducedMotion}>
        <h2 id="organisation-title" className={styles.organisationTitle}>
          Meet the
          <span>Team.</span>
        </h2>
        <p className={styles.organisationSubtitle}>
          Meet the team of individuals committed to democratising science research opportunities for youth across Malaysia.
        </p>
      </Reveal>

      <div className={styles.graphSurface}>
        <div className={styles.desktopGraph}>
          <Reveal className={styles.graphLayer} reduced={prefersReducedMotion}>
            <div className={styles.layerHeading}>
              <h2>Executive Leadership</h2>
            </div>
            <StaggerGroup className={styles.leadershipGrid} reduced={prefersReducedMotion}>
              {executives.map((person) => (
                <PersonNode
                  key={person.id}
                  person={person}
                  variant="executive"
                  onSelect={handlePersonSelect}
                  reduced={prefersReducedMotion}
                />
              ))}
            </StaggerGroup>
          </Reveal>

          <div className={styles.connector} aria-hidden="true" />

          <Reveal className={styles.graphLayer} reduced={prefersReducedMotion}>
            <div className={styles.layerHeading}>
              <h2>Department Directors</h2>
            </div>
            <StaggerGroup className={styles.directorGrid} reduced={prefersReducedMotion}>
              {directors.map((person) => (
                <PersonNode
                  key={person.id}
                  person={person}
                  variant="director"
                  onSelect={handlePersonSelect}
                  active={person.departments.includes(activeDepartmentId)}
                  reduced={prefersReducedMotion}
                />
              ))}
            </StaggerGroup>
          </Reveal>

          <div className={styles.connector} aria-hidden="true" />

          <Reveal className={styles.graphLayer} reduced={prefersReducedMotion}>
            <div className={styles.layerHeading}>
              <h2>Departments</h2>
            </div>
            <StaggerGroup className={styles.departmentGrid} reduced={prefersReducedMotion}>
              {departments.map((department) => (
                <DepartmentNode
                  key={department.id}
                  department={department}
                  active={department.id === activeDepartmentId}
                  onSelect={handleDesktopDepartmentSelect}
                  peopleById={peopleById}
                  reduced={prefersReducedMotion}
                />
              ))}
            </StaggerGroup>
          </Reveal>

        </div>

        <div className={styles.mobileGraph}>
          <div className={styles.mobileLayer}>
            <div className={styles.layerHeading}>
              <h2>Executive Leadership</h2>
            </div>
            <StaggerGroup className={styles.mobilePeopleList} reduced={prefersReducedMotion}>
              {executives.map((person) => (
                <PersonNode
                  key={person.id}
                  person={person}
                  variant="executive"
                  onSelect={handlePersonSelect}
                  reduced={prefersReducedMotion}
                />
              ))}
            </StaggerGroup>
          </div>

          <div className={styles.mobileLayer}>
            <div className={styles.layerHeading}>
              <h2>Department Directors</h2>
            </div>
            <StaggerGroup className={styles.mobilePeopleList} reduced={prefersReducedMotion}>
              {directors.map((person) => (
                <PersonNode
                  key={person.id}
                  person={person}
                  variant="director"
                  onSelect={handlePersonSelect}
                  active={person.departments.includes(activeDepartmentId)}
                  reduced={prefersReducedMotion}
                />
              ))}
            </StaggerGroup>
          </div>

          <div className={styles.mobileLayer}>
            <div className={styles.layerHeading}>
              <h2>Departments</h2>
            </div>
            <div className={styles.mobileDepartments}>
              {departments.map((department) => {
                const isActive = department.id === activeDepartmentId;
                const panelId = `department-panel-${department.id}-mobile`;

                return (
                  <div key={department.id} className={styles.mobileDepartment}>
                    <button
                      type="button"
                      className={classNames(styles.mobileDepartmentTrigger, isActive && styles.mobileDepartmentTriggerActive)}
                      onClick={() => handleMobileDepartmentSelect(department.id)}
                      aria-expanded={isActive}
                      aria-controls={panelId}
                      data-department-control="true"
                    >
                      <span className={styles.mobileDepartmentIcon}><DepartmentIcon icon={department.icon} /></span>
                      <span className={styles.mobileDepartmentName}>{department.name}</span>
                      <ChevronDown size={19} strokeWidth={1.8} aria-hidden="true" />
                    </button>
                    <DepartmentExpansion
                      department={department}
                      peopleById={peopleById}
                      onSelect={handlePersonSelect}
                      mobile
                      isOpen={isActive}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </section>

      <AnimatePresence>
        {activeDepartment ? (
          <DepartmentDrawer
            key={activeDepartment.id}
            department={activeDepartment}
            peopleById={peopleById}
            onSelectPerson={handleDepartmentPersonSelect}
            onClose={handleDepartmentClose}
            reduced={prefersReducedMotion}
          />
        ) : null}
      </AnimatePresence>

      <ProfileDrawer person={activeProfile} onClose={handleProfileClose} />
    </section>
  );
}
