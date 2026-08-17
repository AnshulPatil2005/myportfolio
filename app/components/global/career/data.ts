// Shared data for Career Mode — no three.js imports here so the menu
// shell can use it without pulling in the 3D engine chunk.

export const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export const CHAPTERS = [
  {
    year: "2025", org: "Techvisio Design", role: "Software Developer Intern",
    story: [
      "First real production system. A full-stack analytics dashboard —",
      "React, Django REST, SQL — drowning under 10,000 user events a day,",
      "300K+ monthly records flowing through AWS S3 pipelines.",
      "The database had become something else. Something slow. Something huge.",
    ],
    bossName: "THE MONOLITH", bossSub: "armored database titan — strike while it vents",
    victory: "Reduced backend API latency by 40% through query optimization and caching.",
    quip: "weak point found: the queries nobody ever EXPLAIN'd.",
    unlock: "SQL BURST", unlockDesc: "shotgun — six pellets, close-range purge",
    exitTo: "jobs",
  },
  {
    year: "2025", org: "sect_scrape", role: "Research Tooling · Gujarat eCourts",
    story: [
      "Thousands of disposed CRMA bail cases — CrPC 436, 437, 438, 439 —",
      "locked behind the eCourts portal. Playwright automation, OCR,",
      "structured JSONL, preserved source PDFs.",
      "But the portal had a guardian. It demanded proof of humanity. Repeatedly.",
    ],
    bossName: "THE GATEKEEPER", bossSub: "shoot the highlighted glyph — sequence matters",
    victory: "Automated the eCourts portal with Playwright + CAPTCHA/OCR handling, storing structured metadata in JSON/JSONL/SQLite with preserved source HTML/PDF orders.",
    quip: "verification complete: he was human. the scraper wasn't. it won anyway.",
    unlock: "HEADLESS AUTOMATION", unlockDesc: "full-auto — the browser never sleeps",
    exitTo: "projects",
  },
  {
    year: "2025–26", org: "Gujarati Legal NLP", role: "Independent Research",
    story: [
      "The scraped judgments should have been text. They weren't.",
      "Legacy fonts — LMG-Arun, TERAFONT-VARUN — corrupted ToUnicode maps,",
      "glyphs pretending to be letters. Valid-looking PDFs storing garbage.",
      "The corpus itself was hostile.",
    ],
    bossName: "THE CORRUPTED SCRIPT", bossSub: "living mojibake — purify the swarm",
    victory: "Built a multi-strategy extraction pipeline — legacy font conversion, Tesseract, SuryaOCR, Cloud Vision, glyph-to-Unicode mapping — turning corrupted court PDFs into an ML-ready Gujarati legal corpus.",
    quip: "every glyph mapped. every conjunct restored. the text confessed.",
    unlock: "OCR BEAM", unlockDesc: "continuous extraction beam — hold to melt",
    exitTo: "research",
  },
  {
    year: "2026", org: "GSoC · BRL-CAD", role: "Selected Contributor · Manifold",
    story: [
      "Google Summer of Code. A C++ geometry engine that must produce",
      "the exact same mesh on every platform, every compiler, every run.",
      "But floating point drifts. Builds diverge. The same operation",
      "returns a subtly different truth on every machine.",
    ],
    bossName: "NON-DETERMINISM", bossSub: "only one instance is real — pin it with 8 hits",
    victory: "Designed cross-platform determinism checks with fixed mesh cases, canonical artifacts, and SHA256 comparison — plus ASan/UBSan testing and benchmark workflows with dashboard trend visualization.",
    quip: "SHA256 matched on all platforms. reality agreed with itself again.",
    unlock: "DETERMINISTIC RAIL", unlockDesc: "railgun — one exact answer, pierces everything",
    exitTo: "jobs",
  },
  {
    year: "2026", org: "Stratum", role: "Founder · Builder",
    story: [
      "Everything learned, fused into one product: an intelligence layer",
      "that reviews PRs, scores deployment risk, and correlates production",
      "incidents back to the code that caused them.",
      "To build it, he had to face the thing it detects.",
    ],
    bossName: "ARCHITECTURE DRIFT", bossSub: "refactor the risky modules to expose the core",
    victory: "Shipped Stratum — PR review with typed findings and risk scoring, deployment conflict detection, live architecture-drift mapping, and Sentry/Render/Railway incident correlation. 4 stages, 115 tests, 3 providers.",
    quip: "drift contained. the modules hold. this is what the product does daily.",
    unlock: "FULL STACK", unlockDesc: "homing orbs — ship everything, everywhere",
    exitTo: "featured-work",
  },
  {
    year: "NOW", org: "The Interview", role: "Final Chapter",
    story: [
      "You've cleared his history. Beaten every problem he ever beat.",
      "One obstacle remains between you and the end of this portfolio.",
      "He is standing in the arena. He has seen everything you can do.",
      "He built everything you just fought.",
    ],
    bossName: "ANSHUL PATIL", bossSub: "immune to conventional weapons — find another way",
    victory: "", quip: "", unlock: "", unlockDesc: "",
    exitTo: "contact",
  },
];

export const WEAPONS = [
  { name: "CONSOLE.LOG" },
  { name: "SQL BURST" },
  { name: "HEADLESS AUTOMATION" },
  { name: "OCR BEAM" },
  { name: "DETERMINISTIC RAIL" },
  { name: "FULL STACK" },
];

export const GLYPHS = ["અ", "ક", "ષ", "જ્ઞ", "ર", "૨", "Ø", "�", "Ξ", "ঌ"];

export const IMMUNE_TEXTS = ["0", "IMMUNE", "0", "already fixed", "0", "skill issue", "0", "nice try"];

export const ANSHUL_TAUNTS = [
  "You can't debug me.",
  "I wrote the boss you fought two chapters ago.",
  "Your DPS is impressive. Irrelevant, but impressive.",
  "There is exactly one way to defeat me.",
  "Check my references. Then check your inventory.",
  "I am immune to bullets. Not to opportunities.",
];

export const PROGRESS_KEY = "career-mode-progress";
