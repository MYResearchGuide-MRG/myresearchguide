import { Geist } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import MysspNetworkGraphic from "./MysspNetworkGraphic";
import styles from "./MysspSection.module.css";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export default function MysspSection() {
  return (
    <section id="myssp" className={`${geist.className} ${styles.section}`} aria-labelledby="myssp-heading">
      <div className={styles.inner}>
        <h2 id="myssp-heading" className={styles.heading}>
          The Malaysia Science Scholar’s Programme <span>(MYSSP)</span>
        </h2>
        <div className={styles.overview}>
          <div className={styles.copy}>
            <p className={styles.lead}>
              Malaysia’s first STEM research programme for pre-university students.
            </p>
            <p className={styles.description}>
              An 8-week free research mentorship programme pairing students with experienced researchers from Cambridge, NUS, Warwick and more under a selection of STEM-based projects.
            </p>
            <a className={styles.link} href="https://myssp.myresearchguide.org/" target="_blank" rel="noopener noreferrer">
              Explore MYSSP <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <MysspNetworkGraphic />
        </div>
      </div>
    </section>
  );
}
