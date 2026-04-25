import NewNav from "@/components/NewNav";
import Contact from "./contact"  
import Foot from "@/components/Foot"
  export default function Page() {
    
    return (
      <main className="relative min-h-screen bg-black overflow-x-hidden">
        {/* Background elements should be placed at the top level */}


        {/* Ensure these components don't have a solid "bg-white" 
            if you want the orbs to show through them. 
        */}
        <NewNav />
        <Contact />
        <Foot />

      </main>
    );
  }