// Content mirrored from the live Notion handbook for the interactive preview
// on the homepage. Keep titles/URLs in sync with the Notion table of contents.

export const HANDBOOK_URL =
  "https://myresearchguide.notion.site/MYResearchGuide-2ef8941036278000abe7de2f682a4414";

const page = (slug: string) => `https://myresearchguide.notion.site/${slug}`;

export type HandbookPage = {
  id: string;
  icon: string;
  title: string;
  url: string;
  intro: string;
  points: string[];
};

export type HandbookGroup = {
  label: string;
  pages: HandbookPage[];
};

export const handbookGroups: HandbookGroup[] = [
  {
    label: "Table of contents",
    pages: [
      {
        id: "welcome",
        icon: "👋",
        title: "Welcome!!",
        url: HANDBOOK_URL,
        intro:
          "A warm welcome to MYResearchGuide (MRG), the Malaysian platform for all things related to research in STEM. Want to begin your STEM research journey, but don’t know where to start? You’ve come to the right place.",
        points: [
          "Every page connects to the others, so you won’t miss a detail",
          "Complete beginner? Start with Introduction to Scientific Research",
          "Written by human writers, authenticated by an academic panel",
        ],
      },
      {
        id: "introduction",
        icon: "🧭",
        title: "Introduction to Scientific Research",
        url: page("Introduction-to-Scientific-Research-2f089410362780cabb1bc83f6ae5574d"),
        intro:
          "Scientific research is the rigorous pursuit of knowledge and discovery through investigating a specific field, collecting and analysing data. It stands at the frontline of human discovery.",
        points: [
          "What research is, and why it matters",
          "How research experience is valued around the world",
          "Where MYResearchGuide fits into your journey",
        ],
      },
      {
        id: "getting-started",
        icon: "🔬",
        title: "Getting Started",
        url: page("Getting-Started-f8c78996497043858ae0ea4d2518b423"),
        intro:
          "Research is one of the most compelling ways to level up as a student. Here are the ways you can get involved in scientific research — even as a total beginner.",
        points: [
          "Ways to get involved, even as a total beginner",
          "Independent thesis & initiative",
          "Routes open to all ages, worldwide",
        ],
      },
      {
        id: "cold-email",
        icon: "✉️",
        title: "How to Cold Email",
        url: page("How-to-Cold-Email-307894103627802a89f8cc78c27f8104"),
        intro:
          "A cold email is an unsolicited, personalised message to someone new. When seeking a mentor, cold emailing a professor is one of the most utilised methods.",
        points: [
          "What a cold email is, and when to send one",
          "Cold emailing professors for research",
          "Keeping it formal, clear and personalised",
        ],
      },
      {
        id: "topic",
        icon: "💡",
        title: "Finding your Research Topic",
        url: page("Finding-your-Research-Topic-326894103627804392cdd36924fe3bd3"),
        intro:
          "A well-defined, specific topic gives you direction, makes your methodology easier to plan, and makes your results more meaningful.",
        points: [
          "A real problem worth solving",
          "Something you can measure",
          "Something you can actually do with your time, budget and equipment",
        ],
      },
      {
        id: "methodology",
        icon: "🧪",
        title: "Methodology",
        url: page("Methodology-06915a48fa654a6c941e051b4c102871"),
        intro:
          "Your methodology is the step-by-step plan of how you will test your hypothesis — specific enough that a complete stranger could replicate your experiment.",
        points: [
          "A general framework for designing your method",
          "Making your experiment replicable",
          "Why a sloppy method undermines a good hypothesis",
        ],
      },
      {
        id: "proposal",
        icon: "📝",
        title: "Writing Your Proposal",
        url: page("Writing-Your-Proposal-37e89410362780179830f3f940cff8e8"),
        intro:
          "A research proposal persuades reviewers that your planned project is worth approving, funding and pursuing — written before any experimentation begins.",
        points: [
          "What you’re investigating, and why",
          "How you build on existing solutions",
          "Presenting your approach clearly and precisely",
        ],
      },
      {
        id: "publishing",
        icon: "📄",
        title: "Papers & Publishing",
        url: page("Papers-Publishing-398194f80baa436da361ba8edfaa14c4"),
        intro:
          "A scientific paper shares your original work with the community. Papers that pass rigorous peer review are published in journals — a trusted record of research findings.",
        points: [
          "What a scientific paper is",
          "Peer review and publishing in journals",
          "Journal rankings and relevance",
        ],
      },
      {
        id: "latex",
        icon: "∑",
        title: "LaTeX for Academic Writing",
        url: page("LaTeX-for-Academic-Writing-37e89410362780ec87d3e2e8969f44d9"),
        intro:
          "LaTeX is the typesetting system used across academic and scientific writing. You write plain text with markup, and LaTeX handles equations, citations and layout.",
        points: [
          "Official templates from IEEE, ACM, arXiv, Springer and Nature",
          "Equations, citations and figure numbering handled for you",
          "Start in LaTeX from day one and skip the reformatting",
        ],
      },
      {
        id: "faq",
        icon: "❓",
        title: "FAQ",
        url: page("FAQ-c8f5e0734d084830b668c0f2a976f5c7"),
        intro:
          "Common questions about research, answered — from choosing what type of research to conduct to finding your first topic.",
        points: [
          "What type of research activity should I conduct?",
          "How do I find a research topic?",
          "More questions, grouped by stage",
        ],
      },
    ],
  },
  {
    label: "Resources",
    pages: [
      {
        id: "conversations",
        icon: "🎙️",
        title: "Conversations with Researchers",
        url: page("Conversations-with-Researchers-626e8350aed144c79b9d621bd5980ead"),
        intro:
          "Heart-to-heart conversations with Malaysian researchers about their fields, their journeys, and the steps they’ve taken.",
        points: [
          "Chooi Je Qin — AI Safety @ Oxford, Stats/CS/Math @ Harvard",
          "Jia Yu Lim — Incoming PhD in AI @ NUS",
          "Joel Pang — Chem Eng @ Caltech",
        ],
      },
      {
        id: "resources",
        icon: "🏆",
        title: "STEM-Related Resources",
        url: page("STEM-Related-Resources-36e78f35ea804010a11f72b0164809ce"),
        intro:
          "A growing list of competitions, programmes and opportunities for Malaysian students in STEM, updated regularly.",
        points: [
          "International competitions such as TISF and ISYF",
          "Dates and locations for each opportunity",
          "Share an opportunity with us by email",
        ],
      },
    ],
  },
];
