import { ProfileType, JobType, ProjectType, PostType, HeroeType, ResearchProjectType } from "@/types";

export const profile: ProfileType = {
  _id: "anshul-patil",
  fullName: "Anshul Patil",
  headline: "Backend & Systems Developer | GSoC 2026 @ BRL-CAD",
  profileImage: {
    image: "",
    lqip: "",
    alt: "Anshul Patil",
  },
  shortBio:
    "I build distributed systems and AI infrastructure — from open-source geometry processing to document intelligence pipelines. Currently pursuing B.Tech at IIIT Surat and contributing to BRL-CAD via Google Summer of Code 2026.",
  email: "anshulpatil1022@gmail.com",
  fullBio: [
    "I'm a backend and systems developer currently pursuing B.Tech at the Indian Institute of Information Technology, Surat (2024–2028). My work spans distributed systems, AI tooling, and open-source infrastructure.",
    "I'm a Google Summer of Code 2026 contributor at BRL-CAD, improving the Manifold C++ geometry processing library with CI reliability, cross-platform determinism checks, and benchmarking infrastructure. I'm also an active open-source contributor to Extralit — an AI document intelligence platform — where I've merged 10+ pull requests across ingestion pipelines, dataset workflows, and validation logic.",
    "Previously interned at Techvisio Design, where I built analytics dashboards processing 10K+ daily events, integrated AWS S3 for 300K+ monthly records, and reduced API latency by 40% through query optimization and caching.",
  ],
  location: "Mumbai, Maharashtra",
  resumeURL: "/AnshulPatil.pdf",
};

export const jobs: JobType[] = [
  {
    _id: "gsoc-2026",
    name: "Google Summer of Code 2026, BRL-CAD",
    jobTitle: "Selected Contributor, Manifold Subproject",
    url: "https://summerofcode.withgoogle.com/",
    description:
      "Improving BRL-CAD's Manifold C++ geometry processing library through CI reliability, benchmarking infrastructure, and cross-platform determinism checks.",
    bullets: [
      "Selected to improve BRL-CAD's Manifold C++ geometry processing library through CI reliability and benchmarking infrastructure.",
      "Designed cross-platform determinism checks using fixed mesh cases, canonical artifacts, SHA256 comparison, and clear mismatch reporting.",
      "Planned Linux Clang ASan+UBSan testing and PR/weekly benchmark workflows with base-vs-head comparison, JSON history, and dashboard trend visualization.",
    ],
    startDate: "2026-01-01",
    endDate: "",
  },
  {
    _id: "extralit",
    name: "Extralit Open Source",
    jobTitle: "Open Source Contributor, AI Systems",
    url: "https://github.com/extralit/extralit",
    description:
      "Contributing to an AI document intelligence platform supporting OCR parsing, dataset workflows, structured extraction, and annotation pipelines.",
    bullets: [
      "Contributed to an AI document intelligence platform supporting OCR parsing, dataset workflows, structured extraction, and annotation pipelines.",
      "Merged 10+ pull requests across ingestion pipelines, dataset configuration, frontend components, validation logic, and test coverage.",
      "Fixed multi-step workflow persistence issues and added structured table-based dataset inputs with validation and UI integration.",
    ],
    startDate: "2025-12-01",
    endDate: "",
  },
  {
    _id: "techvisio",
    name: "Techvisio Design",
    jobTitle: "Software Developer Intern",
    url: "https://www.techvisio.in/",
    description:
      "Built full-stack analytics dashboard using React, Django REST Framework, and SQL APIs processing 10K+ daily user events.",
    bullets: [
      "Built a full-stack analytics dashboard using React, Django REST Framework, and SQL APIs to process 10K+ daily user events.",
      "Integrated AWS S3 pipelines for 300K+ monthly records and reduced backend API latency by 40% through query optimization and caching.",
    ],
    startDate: "2025-05-01",
    endDate: "2025-08-31",
  },
];

export const projects: ProjectType[] = [
  {
    _id: "ai-pr-reviewer",
    name: "AI Pull Request Reviewer",
    slug: "ai-pr-reviewer",
    tagline: "Python, FastAPI, GitHub API, LLM APIs, REST APIs",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005",
    logo: "",
    coverImage: {
      image: "",
      alt: null,
      lqip: "",
    },
    description:
      "An AI developer tool that reviews pull requests using repository metadata, code diffs, and contextual file analysis. Built FastAPI services for diff parsing, repository inspection, prompt construction, model fallback, and automated review. Integrated GitHub webhook support to trigger automated PR analysis on new commits and provide faster review feedback during development workflows.",
  },
  {
    _id: "intelligent-doc-processing",
    name: "Intelligent Document Processing Platform",
    slug: "intelligent-doc-processing",
    tagline: "FastAPI, Celery, Redis, Vector DB, OCR",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005",
    logo: "",
    coverImage: {
      image: "",
      alt: null,
      lqip: "",
    },
    description:
      "A distributed document processing system to extract structured information from unstructured files using OCR and embedding retrieval. Implemented Celery and Redis queues to parallelize document ingestion, preprocessing, extraction, and query workflows. Built a retrieval layer using vector embeddings to support semantic search, document querying, and context-aware information extraction.",
  },
  {
    _id: "portfolio-website",
    name: "Portfolio Website",
    slug: "portfolio-website",
    tagline: "Personal portfolio built with Next.js, TypeScript, and Tailwind CSS",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005/myportfolio",
    logo: "",
    coverImage: {
      image: "",
      alt: null,
      lqip: "",
    },
    description:
      "A clean, performant personal portfolio showcasing my work and experience. Built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.",
  },
];

export const posts: PostType[] = [];

export const heroes: HeroeType[] = [];

export const researchProjects: ResearchProjectType[] = [
  {
    _id: "gujarati-legal-nlp",
    title: "Gujarati Legal Document Corpus and NLP Pipeline for Court Case Understanding",
    status: "Ongoing",
    shortDescription:
      "Building a machine learning-ready Gujarati legal corpus from Gujarat eCourts data, with NLP pipelines for classification, named entity recognition, summarization, and retrieval-augmented QA over district court judgments.",
    fullDescription: [
      "This project constructs a low-resource Gujarati legal NLP pipeline using scraped Gujarat eCourt PDFs. The core challenge is that court documents use inconsistent encodings — valid Unicode, legacy fonts (LMG-Arun, TERAFONT-VARUN), and corrupted ToUnicode mappings — so the pipeline evaluates multiple extraction strategies including Tesseract OCR, SuryaOCR, Google Cloud Vision, and deterministic glyph-to-Unicode mapping before any model training.",
      "Once text is extracted and normalized, each case is converted into a structured JSONL record with metadata (district, court, year, CNR number, section) and task-specific labels. Supervised fine-tuning targets include legal text classification (bail granted/rejected, document category), named entity recognition (judge, advocate, petitioner, section, FIR number), and legal summarization using mT5/IndicBART.",
      "The retrieval layer uses multilingual sentence embeddings (LaBSE, BGE-M3, multilingual-e5) to enable semantic search over the corpus, supporting queries like 'which courts granted anticipatory bail under CrPC 438 in 2024.' The ML contribution is studying how OCR noise propagates into downstream NLP model performance on real district court data.",
    ],
    tags: ["NLP", "OCR", "Transformers", "IndicBERT", "MuRIL", "Python", "Low-resource NLP", "RAG"],
  },
  {
    _id: "cxr-generalization",
    title: "Robust and Explainable CNN-Based Chest X-Ray Classification Across Unseen Clinical Datasets",
    status: "Ongoing",
    shortDescription:
      "A cross-dataset generalization study training CNN models on CheXpert and evaluating them zero-shot on MIMIC-CXR, NIH ChestX-ray14, PadChest, VinDr-CXR, and BRAX to measure architecture robustness and detect dataset-specific shortcuts.",
    fullDescription: [
      "This project implements a strict external validation framework for multi-label chest X-ray classification. Models are trained solely on CheXpert (224K images, 14 labels) and then evaluated — without any fine-tuning — on five external datasets: MIMIC-CXR-JPG, ChestX-ray14, PadChest, VinDr-CXR, and BRAX. A label harmonization module maps all datasets to a shared disease space (Cardiomegaly, Atelectasis, Pleural Effusion, Pneumothorax, Edema, and others).",
      "The backbone comparison spans 15+ CNN architectures: DenseNet-121/161, ResNet-18/50/101, ConvNeXt-S, EfficientNetV2-S, EfficientNet-B0/B4, TResNet-50, SE-ResNet-50, MobileNetV3-Large, and RepVGG-B0. Each model is evaluated on per-class AUROC, macro-AUROC, macro-F1, sensitivity, and calibration metrics. The generalization gap (internal CheXpert performance minus external performance) is the primary measure of architectural robustness.",
      "Secondary experiments ablate optimizer choice (AdamW, Lion, SOAP, SAM variants), loss functions (BCE, focal, AUC-surrogate), uncertainty-label strategies (U-Ones, U-Zeros, U-Ignore), and preprocessing pipelines (histogram standardization, CLAHE, adaptive ROI crop). A dataset-source classifier is trained to detect shortcut features, and Grad-CAM heatmaps are used to verify whether models attend to clinically meaningful lung regions or to acquisition artifacts.",
    ],
    tags: ["Medical Imaging", "CNN", "PyTorch", "XAI", "Grad-CAM", "Multi-label Classification", "CheXpert", "Generalization"],
  },
];
