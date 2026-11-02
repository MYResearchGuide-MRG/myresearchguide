import Carousel from "@/components/Carousel";
import HandbookSection from "@/components/HandbookSection";
import MysspSection from "@/components/MysspSection";
import { Faq } from "@/components/Faq";
import Foot from "@/components/Foot";
import NewNav from "@/components/NewNav";
import HeroNew from "@/components/HeroNew";
import About1 from "@/components/About";
import CommunityInvitation from "@/components/CommunityInvitation";
import { ResearchGraphicsProvider } from "@/components/ResearchGraphics";

export default function Home() {
  return (
    // We wrap in a relative container to ensure z-index works correctly
    // and use min-h-screen to prevent the "sections" repeating bug.
    <main className="relative min-h-screen !bg-site-background !text-white overflow-x-clip overflow-y-visible">
      <ResearchGraphicsProvider>
        <div className="relative z-10 w-full">
          <NewNav />
          <HeroNew />
          <Carousel />
          <About1 />
          <HandbookSection />
          <MysspSection />
          <Faq />
          <CommunityInvitation />
          <Foot />
        </div>
      </ResearchGraphicsProvider>
    </main>
  );
}
