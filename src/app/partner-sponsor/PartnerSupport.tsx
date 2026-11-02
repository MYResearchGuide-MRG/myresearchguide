import { ArrowUpRight } from "lucide-react";
import CommunityInvitationBackdrop from "@/components/CommunityInvitationBackdrop";
import styles from "./PartnerSupport.module.css";

export default function PartnerSupport() {
  return (
    <div>
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
  );
}
