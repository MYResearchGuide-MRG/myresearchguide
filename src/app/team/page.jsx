  import Mission from "./missionnvision";
  import Committees from "./committees";
  import Advisors from "./advisors";
  import BackgroundOrb from "@/components/BackgroundOrb"
  import Header from "./header"
  import Foot from "@/components/Foot"

  export default function Page() {
    return (
      <main className="relative min-h-screen bg-black overflow-x-hidden">
        {/* Background elements should be placed at the top level */}


        {/* Ensure these components don't have a solid "bg-white" 
            if you want the orbs to show through them. 
        */}
        <div className="relative z-10">
          <Header />
          <Mission />
        <Committees />
        <Foot />
        </div>

      </main>
    );
  }
