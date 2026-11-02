/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import styles from "./NewNav.module.css";

const MAILING_LIST_URL = "https://forms.gle/Sk9JS3kcKe8qw1cU6";
const DISCORD_URL = "https://discord.gg/V5mRRsa2QS";
// Match the CSS breakpoint: MRG's logo and links need more room than Maritime's.
const DESKTOP_QUERY = "(min-width: 1280px)";

const navLinks = [
  { name: "About Us", href: "/team" },
  { name: "Researchers", href: "/researchers" },
  // Restore when there are events to share.
  // { name: "Events", href: "/events" },
  { name: "Partners & Sponsors", href: "/partner-sponsor" },
  { name: "Contact Us", href: "/contact" },
];

function subscribeToScroll(callback) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
const getScrolled = () => window.scrollY > 30;
const getServerScrolled = () => false;

const DiscordIcon = ({ size = 18 }) => (
  <svg
    viewBox="0 0 256 199"
    width={size}
    height={size * (199 / 256)}
    fill="currentColor"
    aria-hidden
  >
    <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" />
  </svg>
);

function NavCta({ href, id, title, tip, primary = false, children }) {
  return (
    <div className={styles.ctaGroup}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby={id}
        className={`${styles.cta} ${primary ? styles.primary : styles.secondary}`}
      >
        {children}
      </a>
      <div id={id} role="tooltip" className={styles.tooltip}>
        <strong>{title}</strong>
        <span>{tip}</span>
      </div>
    </div>
  );
}

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrolled, getServerScrolled);
  const pathname = usePathname();
  const shellRef = useRef(null);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = "stable";
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("a")?.focus({ preventScroll: true });

    const closeOnOutsideClick = (event) => {
      if (!shellRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      // Keep keyboard navigation in the header while background scrolling is locked.
      const focusable = Array.from(shellRef.current.querySelectorAll("a[href], button"))
        .filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const closeOnDesktop = (event) => {
      if (event.matches) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousGutter;
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen]);

  const isActive = (href) => pathname === href || pathname?.startsWith(`${href}/`);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header data-site-nav className={styles.frame}>
        <div
          ref={shellRef}
          className={styles.shell}
          data-floating={scrolled || isOpen}
        >
          <div className={styles.bar}>
            <Link href="/" className={styles.brand} onClick={closeMenu} aria-label="MYResearchGuide home">
              <img src="/MRG1W.png" alt="MYResearchGuide" width={750} height={107} />
            </Link>

            <nav className={styles.desktopLinks} aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={styles.navLink}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className={styles.actions}>
              <div className={styles.desktopActions}>
                <NavCta
                  href={DISCORD_URL}
                  id="nav-discord-tip"
                  title="Join the community"
                  tip="Exchange ideas, explore your interests and learn from other young STEM enthusiasts."
                >
                  <DiscordIcon />
                  Discord
                </NavCta>
                <NavCta
                  href={MAILING_LIST_URL}
                  id="nav-mailing-tip"
                  title="Stay in the loop"
                  tip="New guides, events and opportunities, straight to your inbox."
                  primary
                >
                  Mailing List
                  <ArrowUpRight size={15} aria-hidden />
                </NavCta>
              </div>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className={styles.menuToggle}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation-menu"
              >
                {isOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
              </button>
            </div>
          </div>

          {isOpen && (
            <nav
              ref={panelRef}
              id="mobile-navigation-menu"
              aria-label="Mobile navigation"
              className={styles.panel}
            >
              <div className={styles.panelLinks}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={styles.panelLink}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className={styles.panelActions}>
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className={`${styles.cta} ${styles.secondary}`}>
                  <DiscordIcon />
                  Discord
                </a>
                <a href={MAILING_LIST_URL} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className={`${styles.cta} ${styles.primary}`}>
                  Mailing List
                  <ArrowUpRight size={15} aria-hidden />
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>
      <div className={styles.spacer} aria-hidden />
    </>
  );
}
