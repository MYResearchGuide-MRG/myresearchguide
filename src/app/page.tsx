import About from "@/components/About";
import Carousel from "@/components/Carousel";
import Stats from "@/components/Stats";
import {Faq}  from "@/components/Faq";
import Foot from "@/components/Foot";
import BackgroundOrb from "@/components/BackgroundOrb";
import Top from "@/components/Top"
import NewNav from "@/components/NewNav"
import HeroNew from "@/components/HeroNew"
import About1 from "@/components/About"



export default function Home() {
  return (
    // We wrap in a relative container to ensure z-index works correctly
    // and use min-h-screen to prevent the "sections" repeating bug.
    <main className="relative min-h-screen !bg-black !text-white overflow-x-clip overflow-y-visible">
      <div className="relative z-10 w-full">
        <NewNav />
        <HeroNew />
        <Carousel />
        <About1 />
        <Stats />
        <Faq />
        <Foot />
      </div>
    </main>
  );
}