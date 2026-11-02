/* eslint-disable @next/next/no-img-element */
import { Geist } from "next/font/google";
import styles from "./Carousel.module.css";

const geist = Geist({ subsets: ["latin"], weight: "400", display: "swap" });

const logos = [
  "Harvard", "MIT", "Imperial", "NTU", "Caltech", "Stanford",
  "Oxford", "Cornell", "UCL", "Cambridge", "NUS", "Meta",
];

function LogoGroup({ duplicate = false }) {
  return (
    <ul className={styles.group} aria-hidden={duplicate || undefined}>
      {logos.map((name) => (
        <li className={styles.item} key={name}>
          <img
            src={`/carousel/transparent/${name}.webp`}
            alt={duplicate ? "" : name}
            title={duplicate ? undefined : name}
            width={100}
            height={64}
            className={styles.logo}
            decoding="async"
            draggable={false}
          />
        </li>
      ))}
    </ul>
  );
}

export default function Carousel() {
  return (
    <section
      id="researcher-affiliations"
      className={`${geist.className} ${styles.section}`}
      aria-labelledby="affiliations-caption"
    >
      <p id="affiliations-caption" className={styles.caption}>
        MYResearchGuide is backed by a community of researchers affiliated with
      </p>
      <div
        className={styles.viewport}
        tabIndex={0}
        role="region"
        aria-label="Researcher affiliations. Focus or hover to pause the logos."
      >
        <div className={styles.track}>
          <LogoGroup />
          <LogoGroup duplicate />
        </div>
      </div>
    </section>
  );
}
