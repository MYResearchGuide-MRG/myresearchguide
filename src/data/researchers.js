// Central source of truth for MRG's backed researchers.
//
// Used by both the home-page "Recent Interviews" teaser (src/components/Cards.tsx)
// and the full Researchers directory (src/app/researchers/page.jsx), which supports
// searching + filtering by university, field, and grad level.
//
// Data source: researcher-data.csv (last updated 2026-08-02).
//
// Schema per researcher:
//   name         - display name
//   tagline      - short one-line summary (institution / field), shown on cards
//   universities - array of institutions; powers the University filter + matching
//   field        - array of broad field tags; powers the Field filter (e.g. "Physics")
//   level        - grad level, one of: Undergrad | Masters | PhD | Postdoc | Industry
//   research     - free-text research focus (optional, shown on the card)
//   image        - path under /public ("" -> card shows an initials avatar)
//   linkedin     - LinkedIn profile URL ("" if none / unverified)
//   scholar      - Google Scholar / research-profile URL ("" if none)
//   website      - personal / academic website ("" if none)
//   twitter      - X/Twitter profile URL ("" if none)
//   github       - GitHub profile URL ("" if none)
//   interview    - link to the published interview ("" until published)

export const researchers = [
  {
    name: 'Jay Chooi',
    tagline: 'Co-Founder @ Robocurve (YC S26), MATS Research Fellow, IOAA Gold Medalist',
    universities: ['Harvard'],
    field: [
      "AI Safety",
      "Robotics Evaluation"
    ],
    level: 'Masters',
    research: 'Covert influence between LLMs; AI risk assessment (UK AISI); robotics eval benchmarks; ML for astrophysics (CfA); parliament transcript digitisation (MOF Malaysia)',
    image: '/interviews/jeqin.jpg',
    linkedin: 'https://www.linkedin.com/in/jeqcho',
    scholar: 'https://scholar.google.com/citations?user=kxDOfwEAAAAJ',
    website: 'https://chojeq.com/',
    twitter: '',
    github: 'https://github.com/jeqcho',
    interview: ''
  },
  {
    name: 'Zad Chin',
    tagline: 'Founder & CEO @ Anygraph, Adjunct Lecturer @ Asia School of Business, NeurIPS First-Author',
    universities: ['Harvard'],
    field: [
      "ML",
      "Health",
      "Audit Tech"
    ],
    level: 'Masters',
    research: 'ML for breast cancer trajectory prediction (Dana-Farber); NeurIPS first-author; AI for audit infrastructure; founder of Project BAWE',
    image: '/interviews/zadchin.png',
    linkedin: 'https://www.linkedin.com/in/zad-chin/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Nikhil J. Babani',
    tagline: 'Incoming SWE Intern @ PwC Malaysia',
    universities: [
      "Harvard",
      "UCL"
    ],
    field: ['Computational Science & Engineering'],
    level: 'Masters',
    research: 'Fusion reactor vertical stability control (UKAEA); SNR optimisation for bistatic radar indoor tracking; robotics',
    image: '/interviews/nikhil.png',
    linkedin: 'https://www.linkedin.com/in/nikhil-babani/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Joel Pang',
    tagline: 'MIT Summer Research Fellow, Caltech SURF Fellow, Shell Scholar, MyISEF Founder',
    universities: ['Caltech'],
    field: [
      "Chemical Engineering",
      "Planetary Science"
    ],
    level: 'Undergrad',
    research: 'Photolytic & catalytic chemistry on Venus (Harvard); redox-dependent cryo-EM protein structures (Caltech); polymer hydrogels & nanodiamond synthesis',
    image: '/interviews/joel.png',
    linkedin: 'https://www.linkedin.com/in/joel-pang-9a5604248/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Jia Yu Lim',
    tagline: 'AI Engineer @ AI LENS',
    universities: [
      "NUS",
      "Universiti Malaya"
    ],
    field: [
      "Deep Learning",
      "FinTech",
      "LLM Reasoning"
    ],
    level: 'PhD',
    research: 'LLM reasoning (ICLR 2026 workshop); CBCT image denoising; multimodal biometrics for mobile authentication',
    image: '/interviews/jiayulim.png',
    linkedin: 'https://www.linkedin.com/in/jia-yu-lim-b829a8222/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Alden Goh',
    tagline: 'ISEF Medalist',
    universities: ['Cambridge'],
    field: ['Chemical Engineering & Biotechnology'],
    level: 'Undergrad',
    research: 'Cassava peel biosorbent for pharmaceutical wastewater removal (98.9% efficiency); ISEF project',
    image: '/interviews/alden.png',
    linkedin: 'https://www.linkedin.com/in/alden-goh-536406233/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Chuin Wei Tan',
    tagline: 'Researcher @ Harvard (MIR Group), TCAD Intern @ TSMC',
    universities: ['Harvard'],
    field: ['AI for Materials'],
    level: 'PhD',
    research: 'Deep-learning interatomic potentials (NequIP/Allegro); AI agent orchestration for physical sciences; orbital-free DFT',
    image: '/interviews/chuinwei.png',
    linkedin: 'https://www.linkedin.com/in/chuin-wei-tan-66a274194/',
    scholar: 'https://scholar.google.com/citations?user=1ilDSggAAAAJ',
    website: 'https://cw-tan.github.io/',
    twitter: 'https://x.com/chuinwei_tan',
    github: 'https://github.com/cw-tan',
    interview: ''
  },
  {
    name: 'Dr. KamWoh Ng',
    tagline: 'Research Scientist @ Meta',
    universities: [
      "Meta AI",
      "University of Surrey"
    ],
    field: [
      "AI",
      "Computer Vision",
      "Representation Learning"
    ],
    level: 'Industry',
    research: 'Discrete representation learning for retrieval and generation; video diffusion models; neural rendering (Kaleido ICLR 2026, VecGlypher CVPR 2026)',
    image: '/interviews/kamwoh.png',
    linkedin: 'https://www.linkedin.com/in/thomas-ng-kam-woh',
    scholar: 'https://scholar.google.com/citations?user=HxEQkLoAAAAJ',
    website: 'https://kamwoh.github.io/',
    twitter: 'https://twitter.com/kam_woh',
    github: 'https://github.com/kamwoh',
    interview: ''
  },
  {
    name: 'Faye Jong',
    tagline: 'Radiographer @ Brisbane Radiology, Executive Director @ Voyora Concierge, Secretary @ IAFR',
    universities: ['QUT'],
    field: [
      "Radiology",
      "Forensic Imaging"
    ],
    level: 'Industry',
    research: 'Post-mortem CT angiography in traumatic causes of death; forensic imaging',
    image: '/interviews/faye.png',
    linkedin: 'https://www.linkedin.com/in/faye-jong-614331156/',
    scholar: 'https://www.researchgate.net/profile/Faye-Jong',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Henry Tan',
    tagline: 'Secretary General @ NAMSA, Yayasan Khazanah Global Scholar',
    universities: ['Cornell'],
    field: [
      "Economics",
      "Statistics",
      "Risk Analytics"
    ],
    level: 'Undergrad',
    research: 'Monopsony labour economics modelling (Cornell ILR); portfolio risk analytics (Khazanah); education data analytics',
    image: '/interviews/henry.png',
    linkedin: 'https://www.linkedin.com/in/-henrytan/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Ian Lim Hee Lai',
    tagline: 'SWE Intern @ Hudson River Trading, ASEAN Scholar',
    universities: ['Yale'],
    field: ['Computer Science'],
    level: 'Undergrad',
    research: 'Natural language processing research; algorithms',
    image: '/interviews/ian.png',
    linkedin: 'https://www.linkedin.com/in/limheelai/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Lai Wei Siang',
    tagline: 'UROP Researcher',
    universities: ['Imperial College London'],
    field: [
      "Mathematics",
      "ML",
      "Survival Analysis"
    ],
    level: 'Undergrad',
    research: 'AI foundation models for survival analysis (UROP, paper under review at top ML conf); SEACrowd NLP contributor',
    image: '/interviews/laiweisiang.png',
    linkedin: 'https://uk.linkedin.com/in/lai-wei-siang-ba2160242',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Loh Juin Xian',
    tagline: 'ASEAN Undergraduate Scholar, NTU President Research Scholar',
    universities: ['NTU'],
    field: [
      "Chemical Engineering",
      "Heterogeneous Catalysis"
    ],
    level: 'PhD',
    research: 'Heterogeneous catalysis; low-emission fuel for transportation',
    image: '/interviews/juinxian.png',
    linkedin: 'https://sg.linkedin.com/in/juinxianloh',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Low Jian He',
    tagline: 'Researcher @ CVSSP (Google-funded), ex-AMD, ex-Intel',
    universities: ['University of Surrey'],
    field: [
      "AI",
      "Sign Language"
    ],
    level: 'PhD',
    research: 'Gloss-free sign language translation and sign spotting; SAGE tokenization framework',
    image: '/interviews/lowjianhe.png',
    linkedin: 'https://www.linkedin.com/in/low-jian-he-b3483b220/',
    scholar: '',
    website: 'https://www.surrey.ac.uk/people/low-jian-he',
    twitter: '',
    github: 'https://github.com/JianHe0628',
    interview: ''
  },
  {
    name: 'Melwin Cheng Choon Lei',
    tagline: 'Incoming Research Intern @ Osanni Bio',
    universities: [
      "Stanford",
      "Oxford"
    ],
    field: ['Bioengineering & Data Science'],
    level: 'Masters',
    research: 'Antibody engineering for cancer (Rao Lab, Stanford); glycobiology at Oxford',
    image: '/interviews/melvin.png',
    linkedin: 'https://www.linkedin.com/in/melwincheng/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Mohamad Hazman Yuzairi',
    tagline: 'Researcher @ Imperial',
    universities: ['Imperial College London'],
    field: ['Chemical Engineering'],
    level: 'Undergrad',
    research: '',
    image: '/interviews/hazman.png',
    linkedin: 'https://my.linkedin.com/in/mohamad-hazman-yuzairi-76a38a355',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Mun Hong Fong',
    tagline: 'Previously @ MIT (Coley Group)',
    universities: [
      "Duke",
      "MIT"
    ],
    field: [
      "ML",
      "Chemistry"
    ],
    level: 'PhD',
    research: 'ML for chemical reaction and mechanism prediction; FlowER (Nature 2025)',
    image: '/interviews/munhongfong.png',
    linkedin: 'https://www.linkedin.com/in/mun-hong-fong-189a311a3/',
    scholar: 'https://scholar.google.com/citations?user=3XrxD-kAAAAJ',
    website: '',
    twitter: '',
    github: 'https://github.com/FongMunHong',
    interview: ''
  },
  {
    name: 'Ong Zhi Zheng',
    tagline: 'Research Intern @ University of Hamburg',
    universities: ['MIT'],
    field: ['Physics & EECS'],
    level: 'Undergrad',
    research: 'Quantum Information / Biophysics',
    image: '/interviews/ongzhizheng.png',
    linkedin: 'https://www.linkedin.com/in/ongzz/',
    scholar: '',
    website: 'https://ongzz.vercel.app/',
    twitter: 'https://twitter.com/ongzzzzzz',
    github: 'https://github.com/ongzzzzzz',
    interview: ''
  },
  {
    name: 'Owen Loh',
    tagline: 'Co-Founder @ Catalon',
    universities: ['Oxford'],
    field: ['Physics'],
    level: 'Undergrad',
    research: 'Battery degradation ML research at Imperial College London',
    image: '/interviews/owen.png',
    linkedin: 'https://www.linkedin.com/in/olzm/',
    scholar: '',
    website: 'https://owenloh.github.io/',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Saan Cern Yong',
    tagline: 'ISEF Top Award Medalist',
    universities: ['INSA Strasbourg'],
    field: [
      "Electrical Engineering",
      "Robotics"
    ],
    level: 'Masters',
    research: '3D-printed soft AI robots and vision-based rehabilitation systems',
    image: '/interviews/saancern.png',
    linkedin: 'https://www.linkedin.com/in/yong-saan-cern/',
    scholar: '',
    website: 'https://www.hackster.io/yongsaancern',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Shengze Yeoh',
    tagline: 'ISEF Top Award Medalist',
    universities: ['University of Toronto'],
    field: [
      "Robotics",
      "AI"
    ],
    level: 'Undergrad',
    research: '3D-printed soft AI robots and vision-based rehabilitation systems',
    image: '/interviews/shengze.jpg',
    linkedin: 'https://www.linkedin.com/in/sheng-ze-yeoh/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Waywen Loh',
    tagline: 'Immunologist @ Oxford',
    universities: ['Oxford'],
    field: [
      "Immunology",
      "Nephrology"
    ],
    level: 'Industry',
    research: 'IgA nephropathy disease models; innate immunity to LNP mRNA vaccines; renal therapeutics',
    image: '/interviews/waywen.jpeg',
    linkedin: 'https://www.linkedin.com/in/waywen-loh-5441ab143/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Wong Jer Ren',
    tagline: 'Research Assistant @ MIT CSAIL',
    universities: ['MIT'],
    field: ['Mathematics & AI'],
    level: 'Undergrad',
    research: 'Internal mechanisms of LLM universal jailbreaks; diffusion-based robotics path planning',
    image: '/interviews/wongjerren.png',
    linkedin: 'https://www.linkedin.com/in/jerrenwong/',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Prof. Kim Siang Khaw',
    tagline: 'Tenured Fellow @ Tsung-Dao Lee Institute, Tenured Associate Professor @ Shanghai Jiao Tong University',
    universities: [
      "Tsung-Dao Lee Institute",
      "Shanghai Jiao Tong University"
    ],
    field: [
      "Experimental Particle Physics",
      "Muon Physics"
    ],
    level: 'Industry',
    research: 'Precision muon physics, dark-sector searches, muon technologies, and urban muography',
    image: '/profile/advisors/khaw.jpg',
    linkedin: '',
    scholar: '',
    website: 'https://tdli.sjtu.edu.cn/en/people/41248/kim-siang-khaw',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Prof. Mathias Foo',
    tagline: 'Associate Professor in Control and Engineering Biology @ Warwick',
    universities: ['University of Warwick'],
    field: [
      "Control Engineering",
      "Engineering Biology"
    ],
    level: 'Industry',
    research: 'Dynamical systems and feedback control for plant regulation and synthetic biology',
    image: '/profile/advisors/mathias.jpg',
    linkedin: '',
    scholar: '',
    website: 'https://profiles.warwick.ac.uk/u1473578-mathias-foo',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Prof. Nursakinah Suardi',
    tagline: 'Associate Professor, Registered Medical Physicist @ Universiti Sains Malaysia',
    universities: ['Universiti Sains Malaysia'],
    field: [
      "Medical Physics",
      "Biophysics"
    ],
    level: 'Industry',
    research: 'Photobiomodulation, medical imaging, radiation, cancer nanotechnology, and Alzheimer\'s models',
    image: '/profile/advisors/nursakinah.jpg',
    linkedin: '',
    scholar: '',
    website: 'https://fizik.usm.my/index.php/about-us/our-people/academic/associate-professor?catid=27&id=1222&view=article',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Prof. Yuan-Sen Ting',
    tagline: 'Associate Professor of Astronomy @ Ohio State, Adjunct Scientist @ MPIA',
    universities: [
      "Ohio State University",
      "Max Planck Institute for Astronomy"
    ],
    field: [
      "Astrophysics",
      "Astrostatistics",
      "AI"
    ],
    level: 'Industry',
    research: 'AI for stellar spectroscopy, galactic archaeology, cosmology, and autonomous scientific discovery',
    image: '/profile/advisors/ting.png',
    linkedin: '',
    scholar: '',
    website: 'https://astronomy.osu.edu/people/ting.74',
    twitter: '',
    github: '',
    interview: ''
  },
  {
    name: 'Jaiyogesh Patel',
    tagline: 'Doctoral Researcher @ UM',
    universities: [
      "Universiti Malaya",
      "University of Edinburgh"
    ],
    field: [
      "Cancer Biology",
      "Molecular Biology"
    ],
    level: 'PhD',
    research: 'p53 biology in childhood cancers, with prior work in senescence, genetics, and respiratory health',
    image: '/profile/jaiyogesh.jpeg',
    linkedin: 'https://www.linkedin.com/in/jaiyogeshpatel',
    scholar: '',
    website: '',
    twitter: '',
    github: '',
    interview: ''
  }
];

// --- helpers -------------------------------------------------------------

// Slugs of researchers whose interview transcription is published and who get a
// dedicated /researchers/<slug> detail page (see src/data/transcripts.js).
export const COMPLETED_SLUGS = new Set([
  "jay-chooi",
  "zad-chin",
  "nikhil-j-babani",
  "joel-pang",
  "jia-yu-lim",
]);

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function researcherSlug(r) {
  return slugify(r.name);
}

export function isCompleted(r) {
  return COMPLETED_SLUGS.has(slugify(r.name));
}

export function getResearcherBySlug(slug) {
  return researchers.find((r) => slugify(r.name) === slug) || null;
}

export default researchers;
