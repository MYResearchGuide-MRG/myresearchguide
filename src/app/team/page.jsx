import Mission from "./missionnvision";
import Committees from "./committees";
import Header from "./header";
import Foot from "@/components/Foot";
import NewNav from "@/components/NewNav";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
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
