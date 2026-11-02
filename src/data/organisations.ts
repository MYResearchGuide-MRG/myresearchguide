export type Organisation = {
  id: string;
  name: string;
  category: "partner" | "sponsor";
  field: string;
  logo: string;
  description: string;
  url: string;
  keywords: string;
};

// Existing MYResearchGuide partners, gold sponsors and their original destinations.
export const organisations: Organisation[] = [
  {
    id: "mabecs",
    name: "MABECS",
    category: "sponsor",
    field: "Education",
    logo: "/Full Logo_coloured_2026.png",
    description: "A UK education consultancy established in Malaysia in 1985. MABECS helps students choose universities and courses, prepare UCAS applications and plan their studies abroad.",
    url: "https://www.mabecs.com/en-gb",
    keywords: "gold sponsor university education studying abroad UK applications",
  },
  {
    id: "mathworks",
    name: "MathWorks",
    category: "sponsor",
    field: "Research software",
    logo: "/mathworks-logo.png",
    description: "The developer of MATLAB and Simulink, software used by scientists and engineers to analyse data, build models and run simulations. Its academic resources support students as they begin their research.",
    url: "https://www.mathworks.com",
    keywords: "gold sponsor matlab simulink mathematical computing engineering simulation software",
  },
  {
    id: "aisea",
    name: "AISEA",
    category: "partner",
    field: "Artificial intelligence",
    logo: "/aisea.png",
    description: "A coalition of AI builder communities across Southeast Asia, connecting local builders through shared infrastructure, regional programmes and partner access.",
    url: "https://www.aisea.builders/en",
    keywords: "artificial intelligence AI builders technology Southeast Asia",
  },
  {
    id: "apcore",
    name: "Asia Pacific Centre of Robotics Engineering",
    category: "partner",
    field: "Robotics",
    logo: "/brands/organisations/apcore.png",
    description: "A specialised robotics research and development hub at Asia Pacific University in Kuala Lumpur.",
    url: "https://apcore.apu.edu.my",
    keywords: "APCORE APU Asia Pacific University robotics engineering research Kuala Lumpur",
  },
  {
    id: "chemstry",
    name: "Che(ms.)try",
    category: "partner",
    field: "Chemistry",
    logo: "/chemstry.png",
    description: "A student-led chemistry initiative empowering women and encouraging an interest in science through creative, community-led outreach.",
    url: "https://www.instagram.com/chems._try",
    keywords: "chemistry women STEM science outreach students",
  },
  {
    id: "girls-in-stem",
    name: "Girls In STEM",
    category: "partner",
    field: "STEM outreach",
    logo: "/girls4stem.jpeg",
    description: "A student-run organisation in Kuala Lumpur helping young women explore and pursue their interests in science, technology, engineering and mathematics.",
    url: "https://girlsinstem43.wixsite.com/girlsinstemkl",
    keywords: "girls women STEM students outreach Kuala Lumpur KL",
  },
  {
    id: "mbios",
    name: "Malaysian BioScience Scholars",
    category: "partner",
    field: "Biosciences",
    logo: "/mbios.png",
    description: "A student-led association supporting Malaysian students pursuing bioscience careers around the world.",
    url: "https://mbios.org",
    keywords: "MBIOS biology biosciences scholars students careers",
  },
  {
    id: "seaecon",
    name: "Southeast Asian Economics Project",
    category: "partner",
    field: "Economics",
    logo: "/seaecon.png",
    description: "A student-led economics non-profit and social enterprise in Kuala Lumpur, encouraging multidisciplinary economic thinking across Southeast Asia.",
    url: "https://seaecon.org",
    keywords: "SEA econ economics social enterprise nonprofit Southeast Asia KL",
  },
];
