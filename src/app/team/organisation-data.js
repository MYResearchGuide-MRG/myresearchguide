export const people = [
  {
    id: "dun-li-chan",
    name: "Dun Li Chan",
    title: "Founder of MYResearchGuide",
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
    title: "Co-Founder & Executive Director",
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
    id: "moses-lua",
    name: "Moses Lua",
    title: "Tech Director",
    tier: "director",
    departments: ["tech"],
    image: "/profile/anonymous.svg",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/moseslua/" },
      { label: "GitHub", url: "https://github.com/moseslua" },
    ],
  },
  {
    id: "robyn-chin",
    name: "Robyn Chin",
    title: "Media & Marketing Director",
    tier: "director",
    departments: ["media"],
    image: "/profile/team/robyn.jpg",
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
    id: "kee-chee-peng",
    name: "Kee Chee Peng",
    title: "Tech Member",
    tier: "member",
    departments: ["tech"],
    image: "/profile/team/kee-chee-peng.jpeg",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/chee-pheng-kee-5614301a2",
      },
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
    id: "roxanne-tan-li-thong",
    name: "Roxanne Tan Li Thong",
    title: "Media & Marketing Member",
    tier: "member",
    departments: ["media"],
    image: "/profile/team/roxanne.jpg",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/roxanne-tan-lt" },
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
    id: "joshua-kuan-zhi-weng",
    name: "Joshua Kuan Zhi Weng",
    title: "External Relations Member",
    tier: "member",
    departments: ["external-relations", "financial"],
    image: "/profile/team/joshua.jpeg",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/joshua-kuan-46547631a",
      },
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
  {
    id: "lum-tong-en",
    name: "Lum Tong En",
    title: "Events Member",
    tier: "member",
    departments: ["events", "secretarial"],
    image: "/profile/team/lum-tong-en.png",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/tong-en-l-26a18741a",
      },
    ],
  },
  {
    id: "faiz",
    name: "Faiz Anuar",
    title: "Content Writing Member",
    tier: "member",
    departments: ["content-writing"],
    image: "/profile/team/faiz.jpeg",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/mfaizanuar" },
    ],
  },
];

export const departments = [
  {
    id: "tech",
    name: "Tech",
    icon: "code",
    directorId: "moses-lua",
    memberIds: ["fathy-rashad", "kee-chee-peng", "ernest-tan-yong-xin"],
  },
  {
    id: "media",
    name: "Media & Marketing",
    icon: "camera",
    directorId: "robyn-chin",
    memberIds: [
      "roxanne-tan-li-thong",
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
    memberIds: ["you-suyi", "joshua-kuan-zhi-weng"],
  },
  {
    id: "secretarial",
    name: "Secretarial",
    icon: "clipboard",
    directorId: "jocelyn-gresia",
    memberIds: ["lum-tong-en"],
  },
  {
    id: "events",
    name: "Events",
    icon: "calendar",
    memberIds: ["lum-tong-en", "jocelyn-gresia"],
  },
  {
    id: "content-writing",
    name: "Content Writing",
    icon: "pen",
    memberIds: ["faiz", "pau-chen-you"],
  },
  {
    id: "financial",
    name: "Financial",
    icon: "wallet",
    memberIds: ["joshua-kuan-zhi-weng", "jocelyn-gresia"],
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
];
