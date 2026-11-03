export const people = [
  {
    id: "dun-li-chan",
    name: "Dun Li Chan",
    title: "Founder (Guide Advisor)",
    tier: "executive",
    departments: [],
    image: "/profile/team/dun-li-chan.jpg",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/dun-li-chan-6b3095269/",
      },
      { label: "Website", url: "https://ehdunhackme.github.io/" },
      {
        label: "Google Scholar",
        url: "https://scholar.google.com/citations?user=UOYqiG4AAAAJ&hl=en",
      },
    ],
  },
  {
    id: "hazel-lim",
    name: "Hazel Lim",
    title: "Executive Director",
    tier: "executive",
    departments: [],
    image: "/profile/hazel.jpeg",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/hazel-lim-81741b393/",
      },
    ],
  },
  {
    id: "yan-he-tan",
    name: "Yan He Tan",
    title: "External Relations Director",
    tier: "director",
    departments: ["external-relations"],
    image: "/profile/yanhe.jpeg",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/yan-he-tan-877289219/",
      },
    ],
  },
  {
    id: "jocelyn-gresia",
    name: "Jocelyn Gresia",
    title: "Secretarial Director",
    tier: "director",
    departments: ["secretarial", "events", "financial"],
    image: "/profile/team/jocelyn.png",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/jocelyn-gresia-4a6555368",
      },
    ],
  },
  {
    id: "fathy-rashad",
    name: "Fathy Rashad",
    title: "Tech Member",
    tier: "member",
    departments: ["tech"],
    image: "/profile/fathy.png",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/mfathyrashad/" },
    ],
  },
  {
    id: "ernest-tan-yong-xin",
    name: "Ernest Tan Yong Xin",
    title: "Tech Member",
    tier: "member",
    departments: ["tech"],
    image: "/profile/ernest.jpg",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/ernest-tan-95187a3a3/",
      },
    ],
  },
  {
    id: "caryn-see-jing-ern",
    name: "Caryn See Jing Ern",
    title: "Media & Marketing Member",
    tier: "member",
    departments: ["media"],
    image: "/profile/anonymous.svg",
  },
  {
    id: "you-suyi",
    name: "You Suyi",
    title: "Media & Marketing Member",
    tier: "member",
    departments: ["media", "external-relations"],
    image: "/profile/anonymous.svg",
  },
  {
    id: "sarah-lim",
    name: "Sarah Lim",
    title: "Media & Marketing Member",
    tier: "member",
    departments: ["media"],
    image: "/profile/team/sarah.jpeg",
    links: [
      { label: "Instagram", url: "https://www.instagram.com/sar.captures" },
    ],
  },
  {
    id: "pau-chen-you",
    name: "Pau Chen You",
    title: "Content Writing Member",
    tier: "member",
    departments: ["content-writing"],
    image: "/profile/team/pau-chen-you.jpeg",
  },
];

export const departments = [
  {
    id: "tech",
    name: "Tech",
    icon: "code",
    memberIds: ["fathy-rashad", "ernest-tan-yong-xin"],
  },
  {
    id: "media",
    name: "Media & Marketing",
    icon: "camera",
    memberIds: [
      "caryn-see-jing-ern",
      "you-suyi",
      "sarah-lim",
    ],
  },
  {
    id: "external-relations",
    name: "External Relations",
    icon: "handshake",
    directorId: "yan-he-tan",
    memberIds: ["you-suyi"],
  },
  {
    id: "secretarial",
    name: "Secretarial",
    icon: "clipboard",
    directorId: "jocelyn-gresia",
    memberIds: [],
  },
  {
    id: "events",
    name: "Events",
    icon: "calendar",
    memberIds: ["jocelyn-gresia"],
  },
  {
    id: "content-writing",
    name: "Content Writing",
    icon: "pen",
    memberIds: ["pau-chen-you"],
  },
  {
    id: "financial",
    name: "Financial",
    icon: "wallet",
    memberIds: ["jocelyn-gresia"],
  },
];

export const advisors = [
  {
    id: "advisor-kim-siang-khaw",
    name: "Prof. Kim Siang Khaw",
    title: "Associate Professor and Tenured Fellow (TDLI) | Muon Physicist, Shanghai Jiao Tong",
    tier: "advisor",
    departments: [],
    image: "/profile/advisors/khaw.jpg",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/kim-siang-khaw/",
      },
    ],
  },
  {
    id: "advisor-mathias-foo",
    name: "Prof. Mathias Foo",
    title: "Associate Professor in Control and Engineering Biology, University of Warwick",
    tier: "advisor",
    departments: [],
    image: "/profile/advisors/mathias.jpg",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/mathias-foo-0644b18b/",
      },
    ],
  },
  {
    id: "advisor-nursakinah-suardi",
    name: "Prof. Nursakinah Suardi",
    title: "Associate Professor at School of Physics, Universiti Sains Malaysia",
    tier: "advisor",
    departments: [],
    image: "/profile/advisors/nursakinah.jpg",
    links: [
      {
        label: "LinkedIn",
        url: "https://my.linkedin.com/in/dr-nursakinah-suardi-94a1354a",
      },
    ],
  },
  {
    id: "advisor-yuan-sen-ting",
    name: "Prof. Yuan-Sen Ting",
    title: "Associate Professor, Department of Astronomy, Ohio State University",
    tier: "advisor",
    departments: [],
    image: "/profile/advisors/ting.png",
    links: [{ label: "LinkedIn", url: "https://www.linkedin.com/in/ting-astro" }],
  },
  {
    id: "advisor-juin-xian-loh",
    name: "Juin Xian Loh",
    title: "PhD in Chemical Engineering, Nanyang Technological University",
    tier: "advisor",
    departments: [],
    image: "/interviews/juinxian.png",
    links: [{ label: "LinkedIn", url: "https://sg.linkedin.com/in/juinxianloh" }],
  },
  {
    id: "advisor-waywen-loh",
    name: "Waywen Loh",
    title: "MSc in Integrated Immunology, University of Oxford",
    tier: "advisor",
    departments: [],
    image: "/profile/advisors/waywen.jpeg",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/waywen-loh-5441ab143/",
      },
    ],
  },
  {
    id: "advisor-faye-jong",
    name: "Faye Jong",
    title: "Radiographer, Brisbane Radiology",
    tier: "advisor",
    departments: [],
    image: "/profile/advisors/faye.png",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/faye-jong-614331156/",
      },
    ],
  },
  {
    id: "advisor-melvin-cheng",
    name: "Melvin Cheng",
    title: "Bioengineering and Data Science, Stanford University",
    tier: "advisor",
    departments: [],
    image: "/profile/advisors/melvin.jpeg",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/melwincheng/" },
    ],
  },
  {
    id: "advisor-owen-loh",
    name: "Owen Loh",
    title: "Physics, University of Oxford",
    tier: "advisor",
    departments: [],
    image: "/interviews/owen.png",
    links: [{ label: "LinkedIn", url: "https://www.linkedin.com/in/olzm/" }],
  },
  {
    id: "advisor-dylan-ler",
    name: "Dylan Ler",
    title: "AI Deployment Team, Adobe & Independent AI Research, Green Robin Labs",
    tier: "advisor",
    departments: [],
    image: "/profile/advisors/dylan.png",
    links: [
      { label: "LinkedIn", url: "https://linkedin.com/in/dylanler" },
      { label: "GitHub", url: "https://github.com/dylanler" },
    ],
  },
];
