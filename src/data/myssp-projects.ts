// MYSSP 2026 catalogue, copied from MRG-Website/src/data/competition-data.ts on 2026-11-02.
// Titles, project codes and mentor details are preserved; summaries are shortened for the homepage.
export const mysspProjects = [
  {
    "id": "object-detector-occlusion",
    "code": "A-1",
    "portrait": "/myssp/mentors/leong-kuan-yew.webp",
    "track": "AI & Computer Sciences",
    "title": "Evaluating the Robustness of a Pretrained Object Detector under Controlled Object Occlusion",
    "area": "Computer Vision / Machine Learning",
    "mentor": "Dr. Leong Kuan Yew",
    "affiliation": "A.I. System Research Co. Ltd., Kyoto, Japan",
    "summary": "Test how reliably an AI model recognises everyday objects as more of each object is hidden. Build a controlled image dataset and compare detection results."
  },
  {
    "id": "llm-personality-emotion",
    "code": "A-2",
    "portrait": "/myssp/mentors/tan-jing-jie.webp",
    "track": "AI & Computer Sciences",
    "title": "Large Language Models for Personality and Emotion Understanding",
    "area": "NLP & Large Language Models",
    "mentor": "Dr. Tan Jing Jie",
    "affiliation": "National University of Singapore",
    "summary": "Investigate how language models recognise personality or emotion in text. Compare models and methods using public datasets."
  },
  {
    "id": "self-evolving-agents-physics",
    "code": "A-3",
    "portrait": "/myssp/mentors/fan-xiaoyan.webp",
    "track": "AI & Computer Sciences",
    "title": "Benchmarking Self-Evolving AI Agents for Automated Physics Discovery",
    "area": "AI Agents & Benchmarking",
    "mentor": "Fan Xiaoyan",
    "affiliation": "AI Thrust, HKUST (Guangzhou) / Physics Department, Universiti Malaya",
    "summary": "Benchmark AI agents on their ability to derive physics formulas from simulated experiments. Analyse their reasoning and compare results across models."
  },
  {
    "id": "financial-document-tampering",
    "code": "A-4",
    "portrait": "/myssp/mentors/lim-jia-yu.webp",
    "track": "AI & Computer Sciences",
    "title": "Detecting Tampering in Financial Documents: From Synthetic Data to Detection Benchmarks",
    "area": "Computer Vision",
    "mentor": "Lim Jia Yu",
    "affiliation": "School of Computing, National University of Singapore",
    "summary": "Create examples of altered financial documents, then test how well existing methods detect the edits. Measure accuracy and investigate missed forgeries."
  },
  {
    "id": "llm-inference-nondeterminism",
    "code": "A-5",
    "portrait": "/myssp/mentors/alizishaan-khatri.webp",
    "track": "AI & Computer Sciences",
    "title": "Investigating non-determinism in LLM inference",
    "area": "AI Safety & Model Internals",
    "mentor": "Alizishaan Khatri",
    "affiliation": "Wrynx Inc, California",
    "summary": "Investigate why the same input can produce different AI outputs. Log and analyse a language model’s internal states during inference."
  },
  {
    "id": "cancer-immunotherapy",
    "code": "B-1",
    "portrait": "/myssp/mentors/yee-peng-phoon.webp",
    "track": "Biology",
    "title": "How does immunotherapy help the body fight cancer?",
    "area": "Cancer Immunology",
    "mentor": "Dr. Yee Peng Phoon",
    "affiliation": "CWRU",
    "summary": "Study how the immune system recognises cancer and how immunotherapy restores that response. Review scientific papers and clinical evidence."
  },
  {
    "id": "tp53-sequences-transcripts",
    "code": "B-2",
    "portrait": "/myssp/mentors/jaiyogesh-patel.webp",
    "track": "Biology",
    "title": "Correlating TP53 Sequences to Transcripts in Cancers",
    "area": "Bioinformatics & Cancer Genomics",
    "mentor": "Jaiyogesh Ramesh Patel",
    "affiliation": "PhD candidate and researcher",
    "summary": "Compare TP53 gene sequences and their transcript IDs. Help clarify which versions researchers should study in cancer genomics."
  },
  {
    "id": "microalgae-harvesting",
    "code": "C-1",
    "portrait": "/myssp/mentors/toh-pey-yi.webp",
    "track": "Chemistry",
    "title": "Harvesting of microalgae via flocculation and sedimentation method",
    "area": "Chemical Engineering",
    "mentor": "Assoc. Prof. Ir. Ts. Dr. Toh Pey Yi",
    "affiliation": "Universiti Tunku Abdul Rahman (on campus)",
    "summary": "Test ways to separate microalgae from water in the lab. Compare sedimentation with flocculation and optimise the amount of flocculant used."
  },
  {
    "id": "space-of-trees",
    "code": "M-1",
    "portrait": "/myssp/mentors/siao-chi-mok.webp",
    "track": "Mathematics",
    "title": "The shape of the space of trees",
    "area": "Pure Mathematics",
    "mentor": "Dr. Siao Chi Mok",
    "affiliation": "Department of Pure Mathematics and Mathematical Statistics, University of Cambridge",
    "summary": "Explore mathematical trees: networks without cycles. Count the faces of the space they form and investigate its geometric and topological properties."
  },
  {
    "id": "youth-wellbeing-digital-resilience",
    "code": "I-1",
    "portrait": "/myssp/mentors/elpidia-juli.webp",
    "track": "Interdisciplinary & Social Sciences",
    "title": "Measuring Youth Well-Being & Digital Resilience: A Quantitative Psychometric & Life Satisfaction Analysis in Malaysia",
    "area": "Quantitative Social Research",
    "mentor": "Dr. Elpidia Juli",
    "affiliation": "Independent researcher (PhD, Universiti Malaysia Sabah)",
    "summary": "Use open datasets to study life satisfaction and digital resilience among Malaysian youth. Learn how social scientists measure and analyse these concepts."
  },
  {
    "id": "active-suspension-nonlinearities",
    "code": "I-2",
    "portrait": "/myssp/mentors/mathias-foo.webp",
    "track": "Interdisciplinary & Social Sciences",
    "title": "Identifying the Nonlinearities in an Active Suspension System",
    "area": "Control Engineering",
    "mentor": "Prof. Mathias Foo",
    "affiliation": "School of Engineering, University of Warwick",
    "summary": "Analyse data from a laboratory suspension system. Use system identification to investigate where a simple linear model falls short."
  },
  {
    "id": "cosmic-ray-muon-imaging",
    "code": "P-1",
    "portrait": "/myssp/mentors/kim-siang-khaw.webp",
    "track": "Physics",
    "title": "Seeing Through Solid Rock: Finding a Hidden Chamber with Cosmic-Ray Muons",
    "area": "Physics, Engineering, Computer Science",
    "mentor": "Prof. Khaw Kim Siang",
    "affiliation": "Tsung-Dao Lee Institute, Shanghai Jiao Tong University",
    "summary": "Build a Python simulation that uses cosmic-ray muons to locate a hidden chamber in rock. Investigate how much data is needed to distinguish it from noise."
  }
];
