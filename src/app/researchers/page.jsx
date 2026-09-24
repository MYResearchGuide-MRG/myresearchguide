import NewNav from "@/components/NewNav";
import ResearcherGrid from "./ResearcherGrid";
import Foot from "@/components/Foot";
import { fetchPublicResearchers } from "@/lib/researchers-db";

export const metadata = {
  title: "Researchers | MYResearchGuide",
  description:
    "Meet the network of Malaysian researchers backed by MYResearchGuide.",
};

export default async function Page() {
  const researchers = await fetchPublicResearchers();
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <NewNav />
      <ResearcherGrid researchers={researchers} />
      <Foot />
    </main>
  );
}
