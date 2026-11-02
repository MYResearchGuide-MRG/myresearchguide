import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Instagram, Linkedin, Mail } from "lucide-react";
import styles from "./Foot.module.css";

function DiscordIcon() {
  return (
    <svg viewBox="0 0 256 199" fill="currentColor" aria-hidden="true">
      <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.7 1h-3.6v15.1a3.1 3.1 0 1 1-2.7-3.1V9.4a6.7 6.7 0 1 0 6.3 6.7V8.4a9.1 9.1 0 0 0 5.3 1.7V6.5A5.5 5.5 0 0 1 16.7 1Z" />
    </svg>
  );
}

// Verified against the MYResearchGuide Linktree profile.
const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/myresearchguide",
    icon: Instagram,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@myresearchguide",
    icon: TikTokIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/myresearchguide",
    icon: Linkedin,
  },
  {
    label: "Discord",
    href: "https://discord.gg/V5mRRsa2QS",
    icon: DiscordIcon,
  },
  { label: "Email", href: "mailto:myresearchguide.org@gmail.com", icon: Mail },
];

const linkGroups = [
  {
    title: "Explore",
    links: [
      { label: "About Us", href: "/team" },
      { label: "Researchers", href: "/researchers" },
      // Restore when there are events to share.
      // { label: "Events", href: "/events" },
      { label: "Partners & Sponsors", href: "/partner-sponsor" },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "Research Handbook",
        href: "https://myresearchguide.notion.site/MYResearchGuide-2ef8941036278000abe7de2f682a4414",
      },
      { label: "MYSSP", href: "https://myssp.myresearchguide.org/" },
      {
        label: "MYSSP Resources",
        href: "https://myssp.myresearchguide.org/#/resources",
      },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Mailing List", href: "https://forms.gle/Sk9JS3kcKe8qw1cU6" },
      { label: "All our links", href: "https://linktr.ee/myresearchguide" },
    ],
  },
];

export default function Foot() {
  return (
    <footer id="site-footer" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link
              href="/"
              aria-label="MYResearchGuide home"
              className={styles.logoLink}
            >
              <Image
                src="/MRG2W.png"
                alt="MYResearchGuide"
                width={696}
                height={304}
                className={styles.logo}
              />
            </Link>
            <p className={styles.description}>
              Helping Malaysian youth take their first steps in STEM
              research.
            </p>
            <a
              className={styles.email}
              href="mailto:myresearchguide.org@gmail.com"
            >
              myresearchguide.org@gmail.com
            </a>
            <nav aria-label="Social media" className={styles.socials}>
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`MYResearchGuide ${label}`}
                  title={label}
                  target={href.startsWith("https:") ? "_blank" : undefined}
                  rel={
                    href.startsWith("https:")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
          {linkGroups.map(({ title, links }) => (
            <nav
              key={title}
              aria-label={`Footer ${title}`}
              className={styles.group}
            >
              <h2>{title}</h2>
              <ul>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    {href.startsWith("/") ? (
                      <Link href={href}>{label}</Link>
                    ) : (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {label}
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={styles.meta}>
          <p>
            © {new Date().getFullYear()} MYResearchGuide. All rights reserved.
          </p>
          <p>By Malaysians, for Malaysians.</p>
        </div>
        <div className={styles.wordmark} aria-hidden="true">
          <Image
            src="/mrg-wordmark.png"
            alt=""
            width={960}
            height={95}
            sizes="100vw"
            draggable={false}
          />
        </div>
      </div>
    </footer>
  );
}
