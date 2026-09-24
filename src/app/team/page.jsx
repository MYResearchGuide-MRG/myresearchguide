import Mission from "./missionnvision";
import Committees from "./committees";
import Header from "./header";
import Foot from "@/components/Foot";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <div className="relative z-10">
        <Header />
        <Mission />
        <Committees />
        <Foot />
      </div>
    </main>
  );
}
