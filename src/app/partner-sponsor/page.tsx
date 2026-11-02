import type { Metadata } from "next";
import NewNav from "@/components/NewNav";
import PartnersSponsors from "./PartnerSponsor(chalk)";
import Foot from "@/components/Foot";
import styles from "../ContentPage.module.css";

export const metadata: Metadata = {
  title: "Partners & Sponsors | MYResearchGuide",
  description: "Meet the partners and gold sponsors helping MYResearchGuide make STEM research accessible to Malaysian students. Browse organisations or find out how to support our work.",
};

export default function Page() {
  return (
    <main className={`${styles.page} relative min-h-screen bg-site-background`}>
      <NewNav />
      <PartnersSponsors />
      <Foot />
    </main>
  );
}
