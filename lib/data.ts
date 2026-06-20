import { ProfileType, JobType, ProjectType, PostType, HeroeType, ResearchProjectType } from "@/types";

export const availability = { open: true, label: "Open to internships · Summer 2026" };

export const profile: ProfileType = {
  _id: "anshul-patil",
  fullName: "Anshul Patil",
  headline: "Backend & Systems Developer | GSoC @ BRL-CAD",
  profileImage: {
    image: "",
    lqip: "",
    alt: "Anshul Patil",
  },
  shortBio:
    "I build distributed systems and AI infrastructure — from open-source geometry processing to document intelligence pipelines. Currently pursuing B.Tech at IIIT Surat and contributing to BRL-CAD via Google Summer of Code.",
  email: "anshulpatil1022@gmail.com",
  fullBio: [
    "I'm a backend and systems developer currently pursuing B.Tech at the Indian Institute of Information Technology, Surat (2024–2028). My work spans distributed systems, AI tooling, and open-source infrastructure.",
    "I'm a Google Summer of Code contributor at BRL-CAD, improving the Manifold C++ geometry processing library with CI reliability, cross-platform determinism checks, and benchmarking infrastructure. I'm also an active open-source contributor to Extralit — an AI document intelligence platform — where I've merged 10+ pull requests across ingestion pipelines, dataset workflows, and validation logic.",
    "Previously interned at Techvisio Design, where I built analytics dashboards processing 10K+ daily events, integrated AWS S3 for 300K+ monthly records, and reduced API latency by 40% through query optimization and caching.",
  ],
  location: "Mumbai, Maharashtra",
  resumeURL: "/AnshulPatil.pdf",
};

export const jobs: JobType[] = [
  {
    _id: "gsoc-2026",
    name: "Google Summer of Code, BRL-CAD",
    jobTitle: "Selected Contributor, Manifold Subproject",
    url: "https://summerofcode.withgoogle.com/",
    description:
      "Improving BRL-CAD's Manifold C++ geometry processing library through CI reliability, benchmarking infrastructure, and cross-platform determinism checks.",
    bullets: [
      "Selected to improve BRL-CAD's Manifold C++ geometry processing library through CI reliability and benchmarking infrastructure.",
      "Designed cross-platform determinism checks using fixed mesh cases, canonical artifacts, SHA256 comparison, and clear mismatch reporting.",
      "Planned Linux Clang ASan+UBSan testing and PR/weekly benchmark workflows with base-vs-head comparison, JSON history, and dashboard trend visualization.",
    ],
    startDate: "",
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
    _id: "bluestock",
    name: "Bluestock™",
    jobTitle: "Software Engineer Intern",
    url: "https://bluestock.in/",
    description:
      "Worked on improving system reliability, performance, and user-facing financial features through clean code, debugging, testing, and collaborative development.",
    bullets: [
      "Improved system reliability and performance across user-facing financial features.",
      "Wrote clean, well-tested code and performed debugging across the codebase.",
      "Collaborated remotely with the team over a 3-month internship engagement.",
    ],
    startDate: "2025-12-01",
    endDate: "2026-02-28",
    logo: "",
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
    projectUrl: "https://ai-pr-reviewer-theta.vercel.app/",
    repository: "https://github.com/AnshulPatil2005",
    logo: "",
    coverImage: {
      image: "",
      alt: null,
      lqip: "",
    },
    description:
      "Automated PR review feedback using LLMs — reduces manual review overhead by analyzing code diffs, repository context, and commit history. Built FastAPI services for diff parsing, repository inspection, prompt construction, and model fallback. GitHub webhook integration triggers analysis on new commits with no manual steps required.",
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
      "Built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion. Features a terminal-aesthetic hero with typewriter animation, floating glassmorphism navbar, AI chat widget (Claude Haiku), command palette (⌘K), and section progress indicators.",
  },
  {
    _id: "hldc-bail-nlp",
    name: "HLDC-BailNLP: Hindi Legal Bail Prediction",
    slug: "hldc-bail-nlp",
    tagline: "Python, PyTorch, Transformers, FP16, NLP",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005",
    logo: "",
    coverImage: { image: "", alt: null, lqip: "" },
    description:
      "Fine-tuned a transformer-based NLP model on the HLDC Hindi Legal Documents Corpus for bail decision classification, achieving 83.68% accuracy with FP16 mixed-precision training.",
    fullDescription: [
      "This project fine-tunes a transformer model on the HLDC (Hindi Legal Documents Corpus), a dataset of over 900K Hindi legal documents collected from Uttar Pradesh district courts. The task is binary bail prediction — classifying whether a bail application was granted or rejected — framed as a legal text classification problem over raw Hindi court orders.",
      "The implementation improves on a prior baseline by switching to a stronger transformer architecture and applying FP16 mixed-precision training via PyTorch, which reduced training time and enabled faster iteration cycles. The pipeline covers data preprocessing for Hindi legal text, tokenization, sequence classification head training, learning rate scheduling, and evaluation.",
      "Final evaluation results: 83.68% accuracy, 0.826 F1-score, 0.777 eval loss, and 77.08 samples/sec throughput. The project demonstrates that transformer models can learn meaningful legal reasoning signals from raw Hindi court text without manual feature engineering or domain-specific preprocessing.",
    ],
    bullets: [
      "Fine-tuned a transformer-based NLP model on the HLDC Hindi Legal Documents Corpus for bail decision classification.",
      "Improved a previous baseline using FP16 mixed-precision training and a stronger architecture for faster experimentation.",
      "Achieved 83.68% accuracy, 0.826 F1-score, and 77.08 samples/sec evaluation throughput.",
    ],
    metrics: [
      { label: "Accuracy", value: "83.68%" },
      { label: "F1-Score", value: "0.826" },
      { label: "Eval Loss", value: "0.777" },
      { label: "Throughput", value: "77.08/s" },
    ],
    details: [
      { label: "Domain", value: "NLP / Legal AI / Machine Learning" },
      { label: "Type", value: "Research / Academic / Personal ML" },
      { label: "Dataset", value: "HLDC — 900K+ Hindi legal documents from UP district courts" },
      { label: "Components", value: "Data preprocessing, text classification, transformer fine-tuning, FP16 optimization, evaluation pipeline" },
      { label: "Year", value: "2025" },
    ],
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
      "This project constructs a low-resource Gujarati legal NLP pipeline using scraped Gujarat eCourt PDFs. The core challenge is that court documents use inconsistent encodings — valid Unicode, legacy fonts (LMG-Arun, TERAFONT-VARUN), and corrupted ToUnicode mappings — so the pipeline evaluates multiple text extraction strategies before any model training.",
      "Once text is extracted and normalized, each case is converted into a structured JSONL record with metadata (district, court, year, CNR number, section) and task-specific labels. Supervised fine-tuning targets include legal text classification, named entity recognition, and legal summarization.",
      "The retrieval layer uses multilingual sentence embeddings (LaBSE, BGE-M3, multilingual-e5) to enable semantic search and RAG over the corpus. The ML contribution is studying how OCR noise propagates into downstream NLP model performance on real district court data.",
    ],
    tags: ["NLP", "OCR", "Transformers", "IndicBERT", "MuRIL", "Python", "Low-resource NLP", "RAG"],
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
    title: "Robust and Explainable CNN-Based Chest X-Ray Classification Across Unseen Clinical Datasets",
    status: "Ongoing",
    shortDescription:
      "A cross-dataset generalization study training CNN models on CheXpert and evaluating them zero-shot on MIMIC-CXR, NIH ChestX-ray14, PadChest, VinDr-CXR, and BRAX to measure architecture robustness and detect dataset-specific shortcuts.",
    fullDescription: [
      "This project implements a strict external validation framework for multi-label chest X-ray classification. Models are trained solely on CheXpert (224,316 images, 14 labels, 65,240 patients) and then evaluated — without any fine-tuning — on five external datasets: MIMIC-CXR-JPG, ChestX-ray14, PadChest, VinDr-CXR, and BRAX. A label harmonization module maps all datasets to a shared disease space.",
      "The backbone comparison spans 15+ CNN architectures. Each model is evaluated on per-class AUROC, macro-AUROC, macro-F1, sensitivity, and calibration metrics. The generalization gap (internal CheXpert performance minus external performance) is the primary measure of architectural robustness.",
      "Secondary experiments ablate optimizer choice, loss functions, and uncertainty-label strategies. A dataset-source classifier detects shortcut features, and Grad-CAM heatmaps verify whether models attend to clinically meaningful lung regions or acquisition artifacts.",
    ],
    tags: ["Medical Imaging", "CNN", "PyTorch", "XAI", "Grad-CAM", "Multi-label Classification", "CheXpert", "Generalization"],
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
        body: "15+ CNN architectures are trained under the same CheXpert data split and evaluation protocol:",
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
