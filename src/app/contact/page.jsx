import NewNav from "@/components/NewNav";
import Contact from "./contact"  
import Foot from "@/components/Foot"
import styles from "./Contact.module.css";
  export default function Page() {
    
    return (
      <main className={`${styles.page} relative min-h-screen bg-site-background overflow-x-hidden`}>
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
