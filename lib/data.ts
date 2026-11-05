import {
  ProfileType,
  JobType,
  ProjectType,
  ProductType,
  OpenSourceContributionType,
  PostType,
  HeroeType,
  ResearchProjectType,
} from "@/types";

export const availability = { open: true, label: "Open to internships" };

export const profile: ProfileType = {
  _id: "anshul-patil",
  fullName: "Anshul Patil",
  headline: "Backend & Systems Developer",
  profileImage: {
    image: "",
    lqip: "",
    alt: "Anshul Patil",
  },
  shortBio:
    "I build the infrastructure other developers rely on: authentication for Kubernetes, vulnerability scanners, CI for C++ libraries, and Stratum, a developer platform I founded.",
  email: "anshulpatil1022@gmail.com",
  fullBio: [
    "I'm a backend and systems developer, a B.Tech student at IIIT Surat (2024–2028), and the founder of Stratum, a platform that reviews pull requests and traces production incidents back to the change that caused them.",
    "Right now I'm an LFX Mentorship 2026 contributor at CNCF OpenKruise, building token-based sign-in for AI agents on Kubernetes in Go. I'm also a Kubescape project member, with 90+ merged PRs to its vulnerability scanner, CLI, and docs.",
    "Before that, I spent Google Summer of Code 2026 at BRL-CAD, landing 25+ PRs in the Manifold C++ geometry library, and interned at Techvisio Design, where I cut backend API latency 40%.",
  ],
  location: "Mumbai, Maharashtra",
  resumeURL: "/AnshulPatil.pdf",
};

export const jobs: JobType[] = [
  {
    _id: "lfx-openkruise",
    name: "LFX Mentorship 2026, CNCF OpenKruise",
    jobTitle: "Software Developer Intern, Selected Contributor",
    url: "https://github.com/openkruise/agents",
    description:
      "Building token-based sign-in in Go for OpenKruise Agents, a Kubernetes platform that runs AI agents in sandboxes.",
    bullets: [
      "Building token-based sign-in for AI agents on Kubernetes: an open-source identity provider in Go that issues signed tokens (JWT, OIDC, JWKS) with key rotation.",
      "Community deployments no longer need an external identity provider.",
      "Tokens reach each running sandbox and refresh before they expire; tested end to end, with Keycloak and Dex support and a design proposal.",
    ],
    startDate: "2026-09-01",
    endDate: "2026-11-30",
  },
  {
    _id: "kubescape",
    name: "Kubescape (CNCF)",
    jobTitle: "Member, Open Source Contributor",
    url: "https://github.com/kubescape",
    description:
      "Project member with 90+ merged Go PRs to Kubescape's vulnerability scanner, CLI, and docs.",
    bullets: [
      "Project member with 90+ merged Go PRs to Kubescape's in-cluster vulnerability scanner (kubevuln), CLI, and docs.",
      "Fixed bugs that made scan results wrong, such as vulnerability reports produced on only 2 of 5 scan paths and duplicate scans matched by tag instead of image.",
      "Closed a security hole (an SSRF check bypassed with IPv4 addresses hidden inside IPv6) and fixed race conditions and crashes in the scanner.",
      "Added richer vulnerability exceptions (status, package scope, expiry) and automatic AWS ECR sign-in.",
    ],
    startDate: "2026-08-01",
    endDate: "",
  },
  {
    _id: "gsoc-2026",
    name: "Google Summer of Code 2026, BRL-CAD",
    jobTitle: "Software Developer Intern, Selected Contributor",
    url: "https://summerofcode.withgoogle.com/",
    description:
      "Made Manifold, the C++ geometry library BRL-CAD builds on, more reliable and reproducible, with 25+ merged PRs across CI, numerics, bindings, and docs.",
    bullets: [
      "25+ merged PRs to Manifold, the C++ geometry library BRL-CAD builds on.",
      "Made results identical on every platform: determinism checks that compare SHA256 hashes of outputs, and bitwise-exact math across compilers.",
      "Added CI that runs on every PR: benchmark and memory guards, weekly benchmarks, and sanitizer (ASan/UBSan) builds.",
      "Shipped a 3MF file importer and fixed bugs in mesh refinement, the C bindings, and cone shapes.",
    ],
    startDate: "",
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
      "Cut backend API latency 40% with SQL tuning and caching.",
      "Built a full-stack analytics dashboard (React, Django REST Framework, SQL) handling 10K+ user events a day.",
      "Built AWS S3 pipelines for 300K+ records a month.",
    ],
    startDate: "2025-05-01",
    endDate: "2025-08-31",
  },
];

export const products: ProductType[] = [
  {
    _id: "stratum",
    name: "Stratum",
    slug: "stratum",
    tagline: "Multi-tenant platform for PR review, deploy coordination, drift, and incidents",
    projectUrl: "https://anshulpatil.is-a.dev/stratum",
    repository: "https://github.com/AnshulPatil2005/Stratum",
    status: "Working product",
    audience: "Engineering teams shipping frequent pull requests",
    description:
      "Stratum is a full-stack, multi-tenant developer platform built on a persistent semantic model of the codebase. It unifies PR review, deploy coordination, architecture-drift tracking, and incident investigation so teams can see where risk is entering the codebase and what changed before something broke.",
    bullets: [
      "Reviews every pull request through a GitHub App, with parallel AI checks for security, performance, and logic that produce a risk score and a report.",
      "Warns when two PRs will conflict if they are deployed together.",
      "Tracks how the architecture drifts over time and flags the riskiest modules.",
      "When production breaks, checks 6 monitoring sources and points to the PRs most likely to have caused it.",
    ],
    metrics: [
      { label: "Stages", value: "4" },
      { label: "Tests", value: "230+" },
      { label: "Observability sources", value: "6" },
    ],
    details: [
      { label: "Stack", value: "Python, FastAPI, React, TypeScript, PostgreSQL, LLM APIs" },
      { label: "Product type", value: "Developer intelligence / code review / incident analysis" },
      { label: "Core users", value: "Founders, CTOs, maintainers, and engineering teams" },
    ],
  },
  {
    _id: "docrag-v3",
    name: "docRAG v3",
    slug: "docrag-v3",
    tagline: "PDF RAG, OCR, semantic search, research GraphRAG",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005/docRAG_v3",
    status: "Working RAG system with GraphRAG roadmap",
    audience: "Researchers and teams working with dense PDF collections",
    description:
      "docRAG v3 is a document intelligence platform for uploading PDFs, extracting text with OCR fallback, indexing chunks in Qdrant, and asking grounded questions with citations. The newer roadmap extends the system toward research-paper GraphRAG with paper parsing, citation extraction, ontology validation, entity extraction, and hybrid graph/vector retrieval.",
    bullets: [
      "Processes PDF uploads asynchronously with FastAPI, Celery, Redis, OCR, sentence-transformer embeddings, and Qdrant vector search.",
      "Supports natural-language chat over documents with citations that point back to source document chunks and pages.",
      "Includes an Angular frontend for upload, task status tracking, health checks, recent tasks, and document query workflows.",
      "Adds research-paper intelligence foundations: ontology validation, paper parsing, citation normalization, and entity extraction for graph construction.",
    ],
    metrics: [
      { label: "API routes", value: "4" },
      { label: "Graph phases", value: "19" },
      { label: "Frontend", value: "Angular" },
    ],
    details: [
      { label: "Stack", value: "FastAPI, Celery, Redis, Qdrant, Angular, Docker, Sentence Transformers" },
      { label: "Product type", value: "Document AI / RAG / research knowledge system" },
      { label: "Core users", value: "Researchers, analysts, legal/academic teams, and PDF-heavy workflows" },
    ],
  },
];

export const projects: ProjectType[] = [
  {
    _id: "ai-pr-reviewer",
    name: "AI Pull Request Reviewer",
    slug: "ai-pr-reviewer",
    tagline: "Python, FastAPI, GitHub API, LLM APIs, REST APIs",
    projectUrl: "https://ai-pr-reviewer-theta.vercel.app/",
    repository: "https://github.com/AnshulPatil2005",
    logo: "",
    coverImage: {
      image: "",
      alt: null,
      lqip: "",
    },
    description:
      "Automated PR review feedback using LLMs: reduces manual review overhead by analyzing code diffs, repository context, and commit history. Built FastAPI services for diff parsing, repository inspection, prompt construction, and model fallback. GitHub webhook integration triggers analysis on new commits with no manual steps required.",
  },
  {
    _id: "intelligent-doc-processing",
    name: "Intelligent Document Processing Platform",
    slug: "intelligent-doc-processing",
    tagline: "FastAPI, Celery, Redis, Vector DB, OCR",
    projectUrl: "https://doc-rag-eight.vercel.app/",
    repository: "https://github.com/AnshulPatil2005",
    logo: "",
    coverImage: {
      image: "",
      alt: null,
      lqip: "",
    },
    description:
      "Parallelized document ingestion pipeline handling OCR extraction, vector embedding, and semantic search over unstructured files. Celery and Redis queue architecture enables concurrent multi-document processing. Retrieval layer uses vector embeddings for context-aware semantic search and structured information extraction.",
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
      "Built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion. Features an editorial dark hero, an AI chat widget (Claude Haiku), a command palette (⌘K), and scroll-based section progress indicators.",
  },
];

export const showcaseProjects: ProjectType[] = [
  {
    _id: "ai-pr-reviewer",
    name: "AI Pull Request Reviewer",
    slug: "ai-pr-reviewer",
    tagline: "FastAPI, React, TypeScript, GitHub API, OpenRouter",
    projectUrl: "https://ai-pr-reviewer-theta.vercel.app/",
    repository: "https://github.com/AnshulPatil2005/AI-PR-Reviewer",
    logo: "",
    coverImage: { image: "", alt: null, lqip: "" },
    description:
      "Full-stack AI pull request reviewer that fetches GitHub PR diffs, runs LLM-assisted risk analysis, persists review history, and returns structured findings, suggestions, per-file summaries, and exportable review reports. Open-source and self-hostable; its architecture became the foundation Stratum was built on.",
  },
  {
    _id: "sect-scrape",
    name: "sect_scrape",
    slug: "sect-scrape",
    tagline: "Python, Playwright, BeautifulSoup, SQLite, OCR",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005/sect_scrape",
    logo: "",
    coverImage: { image: "", alt: null, lqip: "" },
    description:
      "Research scraper that collects bail-related court orders (CrPC 436–439) from Gujarat's eCourts portal. It automates the eCourts portal with Playwright, handles CAPTCHA/OCR support, stores structured metadata in JSON/JSONL/SQLite, and preserves source HTML/PDF orders for verification.",
  },
  {
    _id: "faulty-node-detection",
    name: "Faulty Node Detection",
    slug: "faulty-node-detection",
    tagline: "NS-3, Python, anomaly detection, HTML dashboard",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005/faulty_node_detection",
    logo: "",
    coverImage: { image: "", alt: null, lqip: "" },
    description:
      "Finds faulty nodes in a simulated network and explains why. It builds a 12-node NS-3 topology, injects packet-loss/high-delay/low-bandwidth faults, extracts FlowMonitor features, detects anomalies with z-score/IQR/composite scoring, and explains results through an interactive HTML dashboard with an LLM diagnostic agent.",
  },
  {
    _id: "codeforces",
    name: "Codeforces",
    slug: "codeforces",
    tagline: "FastAPI, React, TypeScript, Codeforces API",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005/codeforces",
    logo: "",
    coverImage: { image: "", alt: null, lqip: "" },
    description:
      "Full-stack Codeforces dashboard for profiles, rating charts, performance insights, and problem browsing. The backend uses FastAPI with rate limiting and caching around real Codeforces data; the frontend uses React, TypeScript, Tailwind, React Query, and Recharts.",
  },
  {
    _id: "smartfolio",
    name: "Smartfolio",
    slug: "smartfolio",
    tagline: "Python, portfolio analytics, automation",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005/Smartfolio",
    logo: "",
    coverImage: { image: "", alt: null, lqip: "" },
    description:
      "Python tools for investment portfolio analysis and automation. They focus on the data processing and decision support behind financial portfolio workflows.",
  },
  {
    _id: "il-tur",
    name: "IL-TUR",
    slug: "il-tur",
    tagline: "Jupyter Notebook, NLP, model experimentation",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005/IL-TUR",
    logo: "",
    coverImage: { image: "", alt: null, lqip: "" },
    description:
      "Notebooks for machine learning and NLP experiments. They cover data preparation, exploratory modeling, and evaluation.",
  },
];

export const openSourceContributions: OpenSourceContributionType[] = [
  {
    _id: "kubescape",
    name: "kubescape/kubevuln",
    repository: "https://github.com/kubescape/kubevuln",
    description:
      "Kubescape's in-cluster vulnerability scanner. 90+ merged Go PRs across it, the CLI, and docs, as a project member.",
    focus: "Scan correctness, vulnerability exceptions, registry sign-in, and security hardening.",
    pullRequests: [
      { number: 762, title: "Block IPv4 addresses carried inside an IPv6 one", url: "https://github.com/kubescape/kubevuln/pull/762", state: "merged" },
      { number: 563, title: "Resolve ECR credentials from the ambient AWS identity", url: "https://github.com/kubescape/kubevuln/pull/563", state: "merged" },
      { number: 559, title: "Generate VEX on every CVE-scan path, not two of five", url: "https://github.com/kubescape/kubevuln/pull/559", state: "merged" },
      { number: 543, title: "Add affected status with actionStatement and typed response", url: "https://github.com/kubescape/kubevuln/pull/543", state: "merged" },
    ],
  },
  {
    _id: "openkruise-agents",
    name: "openkruise/agents",
    repository: "https://github.com/openkruise/agents",
    description:
      "Kubernetes platform that runs AI agents in sandboxes. LFX Mentorship 2026: building its token-based sign-in in Go.",
    focus: "Token issuance (JWT, OIDC, JWKS), key rotation, and agent identity.",
    pullRequests: [
      { number: 1056, title: "Mint agent tokens from the existing issuer", url: "https://github.com/openkruise/agents/pull/1056", state: "merged" },
      { number: 1014, title: "Add AgentIdentity and AgentAuthenticationConfig CRDs", url: "https://github.com/openkruise/agents/pull/1014", state: "merged" },
      { number: 772, title: "Add a signed JWT issuer for traffic access tokens", url: "https://github.com/openkruise/agents/pull/772", state: "merged" },
    ],
  },
  {
    _id: "browser-use",
    name: "browser-use",
    repository: "https://github.com/AnshulPatil2005/browser-use",
    description:
      "Fork of the browser-use automation project, which focuses on making websites accessible to AI agents.",
    focus: "Browser automation, agent tooling, and AI-driven web task execution.",
  },
  {
    _id: "swarm-external-secrets",
    name: "sugar-org/swarm-external-secrets",
    repository: "https://github.com/sugar-org/swarm-external-secrets",
    description:
      "Docker Swarm external secrets provider plugin for integrating Swarm workloads with external secret stores such as Vault.",
    focus: "Go, Docker Swarm infrastructure, secret-management workflows, and deployment tooling.",
  },
  {
    _id: "extralit",
    name: "Extralit/extralit",
    repository: "https://github.com/Extralit/extralit",
    description:
      "Open-source AI document intelligence platform for systemic data extraction with LLM assistance.",
    focus:
      "Document workflows, dataset configuration, frontend validation, testing utilities, and deployment reliability.",
    pullRequests: [
      { number: 191, title: "Remove ARM-specific JVM options from Elasticsearch configuration", url: "https://github.com/Extralit/extralit/pull/191", state: "merged" },
      { number: 188, title: "Fix document status bug", url: "https://github.com/Extralit/extralit/pull/188", state: "open" },
      { number: 185, title: "Add MockClient implementation for unit testing", url: "https://github.com/Extralit/extralit/pull/185", state: "open" },
      { number: 180, title: "Add DatasetConfigurationTableQuestion component and tests", url: "https://github.com/Extralit/extralit/pull/180", state: "open" },
    ],
  },
  {
    _id: "hyperledger-binibft",
    name: "BiniWorld/Hyperledger-BiniBFT",
    repository: "https://github.com/BiniWorld/Hyperledger-BiniBFT",
    description: "Go-based open-source work around Hyperledger/BFT infrastructure.",
    focus: "Parser test coverage and reliability improvements in distributed-consensus tooling.",
    pullRequests: [
      { number: 17, title: "Add initial unit tests for BiniBFT parsing", url: "https://github.com/BiniWorld/Hyperledger-BiniBFT/pull/17", state: "open" },
    ],
  },
  {
    _id: "soul-protocol",
    name: "qbtrix/soul-protocol",
    repository: "https://github.com/qbtrix/soul-protocol",
    description:
      "Open standard for portable AI identity, memory, and emotion across AI companions.",
    focus: "CLI behavior, memory commands, deduplication, and migration from older command patterns.",
    pullRequests: [
      { number: 236, title: "Deprecate soul remember in favor of soul note", url: "https://github.com/qbtrix/soul-protocol/pull/236", state: "open" },
      { number: 235, title: "Add fact-mode soul observe with dedup; deprecate remember", url: "https://github.com/qbtrix/soul-protocol/pull/235", state: "closed" },
    ],
  },
  {
    _id: "manifold",
    name: "elalish/manifold",
    repository: "https://github.com/elalish/manifold",
    description:
      "C++ geometry library focused on topological robustness, used for mesh operations and geometry processing.",
    focus:
      "Most of it is CI and correctness work: determinism checks, sanitizer builds, benchmark guards, and exact math, plus a 3MF importer and fixes to the C bindings.",
    pullRequests: [
      { number: 1762, title: "Fix benchmark guard", url: "https://github.com/elalish/manifold/pull/1762", state: "merged" },
      { number: 1758, title: "Weekly benchmarks", url: "https://github.com/elalish/manifold/pull/1758", state: "merged" },
      { number: 1728, title: "ASan+UBSan workflow lane Pt2", url: "https://github.com/elalish/manifold/pull/1728", state: "merged" },
      { number: 1680, title: "Non-blocking PR benchmark guard", url: "https://github.com/elalish/manifold/pull/1680", state: "merged" },
      { number: 1666, title: "Dedicated Linux Clang ASan+UBSan workflow lane", url: "https://github.com/elalish/manifold/pull/1666", state: "merged" },
      { number: 1594, title: "Cross-platform determinism check", url: "https://github.com/elalish/manifold/pull/1594", state: "merged" },
      { number: 1575, title: "Add 3MF importer and test coverage", url: "https://github.com/elalish/manifold/pull/1575", state: "merged" },
      { number: 1547, title: "Fix integer divide-by-zero in RefineToTolerance", url: "https://github.com/elalish/manifold/pull/1547", state: "merged" },
      { number: 1541, title: "Fix Cylinder(h, 0, r) cone support", url: "https://github.com/elalish/manifold/pull/1541", state: "merged" },
    ],
  },
];

export const posts: PostType[] = [];

export const heroes: HeroeType[] = [];

export const researchProjects: ResearchProjectType[] = [
  {
    _id: "gujarati-legal-nlp",
    title: "Gujarati Legal Document Corpus for Bail Order Understanding",
    status: "Ongoing",
    shortDescription:
      "A machine-learning-ready dataset of Gujarati bail orders (CrPC 436–439) from court records across 33 districts. I built the eCourts scraper. I also decoded the legacy Gujarati fonts that normal PDF extraction turns into gibberish, by reverse-engineering a font converter (with OCR as a fallback).",
    fullDescription: [
      "This project constructs a low-resource Gujarati legal NLP pipeline using scraped Gujarat eCourt PDFs. The core challenge is that court documents use inconsistent encodings — valid Unicode, legacy fonts (LMG-Arun, TERAFONT-VARUN), and corrupted ToUnicode mappings — so the pipeline evaluates multiple text extraction strategies before any model training.",
      "Once text is extracted and normalized, each case is converted into a structured JSONL record with metadata (district, court, year, CNR number, section) and task-specific labels. Supervised fine-tuning targets include legal text classification, named entity recognition, and legal summarization.",
      "The retrieval layer uses multilingual sentence embeddings (LaBSE, BGE-M3, multilingual-e5) to enable semantic search and RAG over the corpus. The ML contribution is studying how OCR noise propagates into downstream NLP model performance on real district court data.",
    ],
    tags: ["Python", "Playwright", "Tesseract", "Docker", "OCR", "Low-resource NLP", "Transformers", "RAG"],
    metrics: [
      { label: "Districts", value: "33" },
      { label: "CrPC sections", value: "436–439" },
      { label: "Papers surveyed", value: "10" },
    ],
    sections: [
      {
        heading: "Document Extraction and Normalization",
        body: "Gujarat court PDFs are highly inconsistent: some contain valid Unicode Gujarati text, some use legacy fonts (LMG-Arun, TERAFONT-VARUN), and others have corrupted or missing ToUnicode mappings. The pipeline evaluates multiple extraction strategies before model training: direct PDF parsing, legacy font conversion, Tesseract Gujarati OCR, SuryaOCR, Google Cloud Vision, IronOCR, and deterministic glyph-to-Unicode mapping. Extracted text is cleaned and stored with metadata including district, court, year, legal section, case number, CNR number, extraction method, and error flags. Known OCR errors include Gujarati digit ૨ being confused with ર, broken conjuncts, wrong vowel marks, and noisy stamp/signature hallucinations.",
      },
      {
        heading: "Dataset Construction",
        body: "Each scraped case is converted into a structured JSONL record containing raw judgment text, case metadata, section information, and document-level labels. For bail-related cases, labels include bail granted/rejected/pending, legal section, offense type, applicant/respondent details, court name, date, advocate names, judge names, and cited statutes. This creates a task-specific Gujarati legal dataset usable for both classification and extraction.",
      },
      {
        heading: "Baseline OCR and Text-Quality Evaluation",
        body: "Before training legal NLP models, text extraction quality is compared across tools. Tesseract serves as the baseline but produces major errors in names, dates, amounts, conjuncts, and legal phrases. SuryaOCR is a stronger open-source alternative, while Google Cloud Vision and IronOCR offer higher accuracy at cost. Legacy-font conversion is critical because many PDFs visually render Gujarati correctly but store glyph IDs internally. OCR quality directly gates downstream NLP performance.",
      },
      {
        heading: "Gujarati Legal Text Classification",
        body: "Transformer models (multilingual BERT, XLM-RoBERTa, IndicBERT, MuRIL) are fine-tuned on the cleaned corpus for document-level classification tasks:",
        bullets: [
          "Bail order vs. domestic violence order vs. criminal procedure order classification",
          "Legal section classification — CrPC 436, 437, 438, 439",
          "Case outcome prediction — bail granted or rejected",
          "Procedural vs. factual vs. final judgment content detection",
          "Document quality classification — clean, noisy, or unusable extraction",
        ],
      },
      {
        heading: "Legal Named Entity Recognition",
        body: "Sequence labeling models extract structured legal entities from Gujarati court text. Target entities include petitioner/applicant names, respondent names, advocate and judge names, court names, dates, monetary amounts, sections, acts, police station names, FIR numbers, and final order outcomes. Models include IndicBERT, MuRIL, and XLM-R fine-tuned for token classification, with a rule-based regex baseline for structured fields like dates and case numbers.",
      },
      {
        heading: "Legal Summarization",
        body: "Summarization models (mT5, IndicBART, mBART, ByT5, and instruction-tuned multilingual LLMs) convert long Gujarati court orders into concise structured summaries. Target summaries cover case background, legal section, key allegations, court reasoning, and final decision. Summaries can be produced in Gujarati or English depending on the downstream use case.",
      },
      {
        heading: "Retrieval and Legal Question Answering",
        body: "Multilingual sentence embeddings (LaBSE, multilingual-e5, BGE-M3, XLM-R) index the cleaned corpus for semantic search. A retrieval-augmented generation system supports natural language queries such as:",
        bullets: [
          "Which cases mention anticipatory bail under CrPC 438?",
          "Which court orders granted bail in a specific district and year?",
          "What were the common reasons for bail rejection?",
          "Which documents mention a specific legal provision or police station?",
          "What are the facts and outcome of a given CNR number?",
        ],
      },
      {
        heading: "LLM-Based Structured Information Extraction",
        body: "Larger instruction-tuned models (LLaMA, Qwen, Gemma) extract structured JSON from noisy legal text — fields like case parties, court, judge, act, section, outcome, reasoning, and cited provisions. The project compares zero-shot prompting, few-shot prompting, LoRA fine-tuning, and OCR-corrected input pipelines, since general-purpose VLMs are weak on low-resource Gujarati legal text.",
      },
    ],
    pipeline: [
      "Scrape Gujarat eCourts metadata and PDFs.",
      "Extract text using direct PDF parsing, OCR, or legacy font conversion.",
      "Normalize Gujarati text and remove extraction noise.",
      "Build JSONL records with metadata, text, labels, and extraction-quality tags.",
      "Train baseline models using TF-IDF + Logistic Regression or SVM.",
      "Fine-tune transformer models (IndicBERT, MuRIL, XLM-R, mT5, mBART).",
      "Compare results across extraction methods to measure OCR impact on NLP performance.",
      "Build retrieval indexes using multilingual embedding models.",
      "Evaluate classification, extraction, summarization, and retrieval performance.",
      "Deploy the best-performing pipeline for Gujarati legal analytics and court case understanding.",
    ],
  },
  {
    _id: "cxr-generalization",
    title: "Domain Generalization in Chest X-ray Classification",
    status: "Ongoing",
    shortDescription:
      "Which CNN architecture holds up best on chest X-rays? As lead author, I benchmark 16 pretrained backbones from 7 families on CheXpert, with everything except the backbone held fixed. Auditing the pipeline caught four bugs that would have silently invalidated the results.",
    fullDescription: [
      "This project implements a strict external validation framework for multi-label chest X-ray classification. Models are trained solely on CheXpert (224,316 images, 14 labels, 65,240 patients) and then evaluated — without any fine-tuning — on five external datasets: MIMIC-CXR-JPG, ChestX-ray14, PadChest, VinDr-CXR, and BRAX. A label harmonization module maps all datasets to a shared disease space.",
      "The backbone comparison spans 16 ImageNet-pretrained CNN architectures across 7 families, with preprocessing, optimizer, and seed protocol held fixed so the backbone is the only variable. Each model is evaluated on per-class AUROC, macro-AUROC, macro-F1, sensitivity, and calibration metrics. The generalization gap (internal CheXpert performance minus external performance) is the primary measure of architectural robustness.",
      "The 13-pathology multi-label pipeline uses configurable uncertain-label policies, Hydra config composition, and MLflow tracking. Auditing it surfaced and fixed result-invalidating defects: an unwired seed that made three seeds train identically, NaN-poisoned macro-AUROC, pretrained weights silently falling back to random init, and a label table wrong in 18 of 42 cells.",
      "Secondary experiments ablate optimizer choice, loss functions, and uncertainty-label strategies. A dataset-source classifier detects shortcut features, and Grad-CAM heatmaps verify whether models attend to clinically meaningful lung regions or acquisition artifacts.",
    ],
    tags: ["PyTorch", "Lightning", "timm", "Hydra", "MLflow", "Medical Imaging", "CheXpert", "Generalization"],
    metrics: [
      { label: "CNN backbones", value: "16" },
      { label: "Families", value: "7" },
      { label: "Pathologies", value: "13" },
    ],
    sections: [
      {
        heading: "Cross-Dataset Setup and Label Harmonization",
        body: "Models are trained solely on CheXpert (224,316 images, 14 labels) and evaluated without fine-tuning on MIMIC-CXR-JPG, NIH ChestX-ray14, PadChest, VinDr-CXR, and BRAX. A label harmonization module maps all dataset annotations to a shared disease space: No Finding, Cardiomegaly, Atelectasis, Consolidation, Pleural Effusion, Pneumothorax, Pneumonia, Edema, and Lung Lesion. Unmappable labels (e.g., Lung Lesion approximated from Mass + Nodule) are handled per-dataset.",
      },
      {
        heading: "Image Preprocessing Pipeline",
        body: "Original CXR images range from low-resolution downsampled versions to 2000–3000px scans. The pipeline tests multiple resolutions (224, 384, 512, 1024, 2048) and normalization strategies: ImageNet normalization, min-max scaling, per-image z-score normalization, histogram standardization, ROI cropping, adaptive ROI crop + histogram standardization, and CLAHE. Preprocessing variant is treated as an experimental variable.",
      },
      {
        heading: "CNN Architecture Comparison",
        body: "16 CNN architectures across 7 families are trained under the same CheXpert data split and evaluation protocol:",
        bullets: [
          "Classic baselines: DenseNet-121, ResNet-18/50/101, DenseNet-161",
          "Modern CNNs: ConvNeXt-S, ConvNeXt V2-T, EfficientNetV2-S",
          "Efficient/NAS models: EfficientNet-B0, EfficientNet-B4",
          "Attention-based models: TResNet-50, SE-ResNet-50, ResNeXt-101",
          "Lightweight models: MobileNetV3-Large, RepVGG-B0",
          "Underexplored: RegNet-Y-4GF, Xception, DPN-style models",
        ],
      },
      {
        heading: "Generalization Gap Measurement",
        body: "Each trained checkpoint is evaluated on all external datasets without any fine-tuning. The generalization gap is defined as: Internal CheXpert Performance − External Dataset Performance. Per-class AUROC, macro-AUROC, macro-F1, precision, recall, sensitivity, and calibration metrics are computed per dataset. Architecture-efficiency tracking records parameters, FLOPs, GPU memory, training time per epoch, and inference throughput alongside accuracy.",
      },
      {
        heading: "Optimizer and Loss Ablations",
        body: "Using a fixed backbone (DenseNet-121 or ConvNeXt-S), the project ablates optimizer choice: AdamW, Muon, Schedule-Free AdamW, Lion, SOAP, Adan, MARS, SAM variants, and RMSProp. Loss functions tested include binary cross-entropy, focal loss, margin-based surrogate loss, and AUC-oriented loss. Uncertainty-label strategies for ambiguous annotations are compared: U-Ones, U-Zeros, U-Ignore, and label smoothing.",
      },
      {
        heading: "Shortcut Analysis",
        body: "A dataset-source classifier is trained to predict which hospital/dataset an image came from rather than its disease labels. High classification accuracy indicates strong dataset-specific visual signatures (scanner type, resolution, preprocessing artifacts), suggesting disease classifiers may exploit shortcuts. Shortcut presence is correlated with the observed generalization gap across architectures.",
      },
      {
        heading: "XAI-Based Inspection",
        body: "Grad-CAM-style heatmaps are generated for correct predictions, incorrect predictions, and high-confidence failures across all external datasets. Heatmaps are compared to verify whether models attend to clinically meaningful regions (lungs, pleura, cardiac silhouette, lesion areas) or irrelevant features (image borders, text markers, black padding, acquisition artifacts, dataset-specific cues).",
      },
    ],
    pipeline: [
      "Load and preprocess CheXpert as the primary training dataset.",
      "Harmonize labels across CheXpert, MIMIC-CXR-JPG, ChestX-ray14, PadChest, VinDr-CXR, and BRAX.",
      "Train CNN models on CheXpert using a multi-label sigmoid classification head.",
      "Validate internally on the CheXpert validation split.",
      "Freeze trained model weights and evaluate directly on all external datasets.",
      "Compute generalization gap: internal CheXpert performance minus external dataset performance.",
      "Repeat the protocol across multiple CNN backbones, preprocessing strategies, optimizers, loss functions, and uncertainty-label strategies.",
      "Use efficiency metrics and XAI visualizations to identify models that are accurate, robust, and clinically interpretable.",
    ],
  },
];
