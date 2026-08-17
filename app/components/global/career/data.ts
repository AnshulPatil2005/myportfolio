// Shared data for Career Mode — no three.js imports here so the menu
// shell can use it without pulling in the 3D engine chunk.

export const ROMAN = ["I", "II", "III", "IV"];

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
    victory: "Reduced backend API latency by 40% through query optimization and caching, while processing 10K+ daily user events and 300K+ monthly records through AWS S3 pipelines.",
    quip: "weak point found: the queries nobody ever EXPLAIN'd.",
    unlock: "SQL BURST", unlockDesc: "shotgun — six pellets, close-range purge",
    exitTo: "jobs",
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
      "He is standing at the end of the path. He has seen everything",
      "you can do. He built everything you just fought.",
    ],
    bossName: "ANSHUL PATIL", bossSub: "immune to conventional weapons — find another way",
    victory: "", quip: "", unlock: "", unlockDesc: "",
    exitTo: "contact",
  },
];

export const WEAPONS = [
  { name: "CONSOLE.LOG" },
  { name: "SQL BURST" },
  { name: "DETERMINISTIC RAIL" },
  { name: "FULL STACK" },
];

// symbols that render on every platform — no tofu boxes
export const GLYPHS = ["Ø", "Ξ", "Δ", "Ω", "§", "¶", "µ", "%"];

export const IMMUNE_TEXTS = ["0", "IMMUNE", "0", "already fixed", "0", "skill issue", "0", "nice try"];

export const ANSHUL_TAUNTS = [
  "You can't debug me.",
  "I built everything you just fought.",
  "Your DPS is impressive. Irrelevant, but impressive.",
  "There is exactly one way to defeat me.",
  "Check my references. Then check your inventory.",
  "I am immune to bullets. Not to opportunities.",
];

export const PROGRESS_KEY = "career-mode-progress-v2";
