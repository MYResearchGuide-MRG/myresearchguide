import NewNav from "@/components/NewNav";
import PartnerSponsor from "./PartnerSponsor";
import Foot from "@/components/Foot";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <NewNav />
      <PartnerSponsor />
      <Foot />
    </main>
  );
}