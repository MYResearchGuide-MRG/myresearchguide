import PixelCommunityGlobe from "./PixelCommunityGlobe";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ResearcherCount from "./ResearcherCount";
import styles from "./Community.module.css";

export default function About1() {
  return (
    <section className={styles.section} aria-labelledby="about-mrg-heading">
      <div className={styles.inner}>
        <h2 id="about-mrg-heading" className={styles.heading}>
          All you need to know about
          <span>MYResearchGuide.</span>
        </h2>
        <div className={styles.community}>
          <div className={styles.copy}>
            <h3>Our Community</h3>
            <p className={styles.intro}>
              MYResearchGuide is crafted in collaboration with Malaysian
              researchers all across the world.
            </p>
            <div className={styles.stat}>
              <ResearcherCount />
              <p>
                Malaysian researchers
                <span>from top institutions and research labs around the world.</span>
              </p>
            </div>
            <section className={styles.invitation} aria-labelledby="community-invitation-heading">
              <h4 id="community-invitation-heading">Want to be part of our community?</h4>
              <div className={styles.actions}>
                <a href="https://forms.gle/SWL2CsYJRbrVyKWe6" target="_blank" rel="noopener noreferrer" className={styles.primary}>
                  <span>Join our community</span><ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <Link href="/researchers" className={styles.secondary}>
                  <span>Meet our researchers</span><ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
          <PixelCommunityGlobe />
        </div>
      </div>
    </section>
  );
}
