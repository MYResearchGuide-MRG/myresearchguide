import NewNav from "@/components/NewNav";
import ResearcherGrid from "./ResearcherGrid";
import Foot from "@/components/Foot";

export const metadata = {
  title: "Researchers | MYResearchGuide",
  description:
    "Meet the network of Malaysian researchers backed by MYResearchGuide.",
};

export default function Page() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <NewNav />
      <ResearcherGrid />
      <Foot />
    </main>
  );
}
