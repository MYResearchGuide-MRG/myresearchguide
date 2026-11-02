import Mission from "./missionnvision";
import Committees from "./committees";
import Header from "./header";
import Foot from "@/components/Foot";
import NewNav from "@/components/NewNav";
import styles from "../ContentPage.module.css";

export default function Page() {
  return (
    <main className={`${styles.page} relative min-h-screen bg-site-background overflow-x-hidden`}>
      <div className="relative z-10">
        <NewNav />
        <Header />
        <Mission />
        <Committees />
        <Foot />
      </div>
    </main>
  );
}
