import { Geist } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import CommunityInvitationBackdrop from "@/components/CommunityInvitationBackdrop";
import OrganisationDirectory from "./OrganisationDirectory";
import styles from "./PartnersSponsors.module.css";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export default function PartnersSponsors() {
  return (
    <div className={`${geist.className} ${styles.page}`}>
      <div className={styles.inner}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1>Partners &amp; sponsors</h1>
            <p>The organisations helping Malaysian students take their first steps in research.</p>
          </div>
          <a className={styles.workLink} href="#work-with-us">Work with us <ArrowUpRight size={16} aria-hidden="true" /></a>
        </header>

        <OrganisationDirectory />

        <section id="work-with-us" className={styles.collaborate} aria-labelledby="collaborate-heading">
          <CommunityInvitationBackdrop />
          <div className={styles.collaborateContent}>
            <div>
              <h2 id="collaborate-heading">Make room for the next generation of researchers.</h2>
              <p>Help us keep research opportunities open to Malaysian students. Support our programmes or bring your community into the conversation.</p>
            </div>
            <div className={styles.collaborateActions}>
              <a className={styles.primary} href="https://forms.gle/gfa8yGKAfFE5jxFk8" target="_blank" rel="noopener noreferrer">Become a sponsor <ArrowUpRight size={16} aria-hidden="true" /></a>
              <a className={styles.secondary} href="https://forms.gle/XDwUML5KCBcWDKyU8" target="_blank" rel="noopener noreferrer">Become a partner <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
