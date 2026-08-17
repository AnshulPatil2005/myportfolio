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
    bossName: "THE MONOLITH", bossSub: "a heavy knight — cut down the queries it summons",
    bossMsg: "That's the Monolith down. In real life that fight took me a whole summer of query plans and caching — you did it in about two minutes. Keep moving.",
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
    bossName: "NON-DETERMINISM", bossSub: "it blinks across the arena — keep your aim honest",
    bossMsg: "Pinned. Non-determinism took me SHA256 checksums across three platforms to beat — you just needed better aim. One gate left before you meet me.",
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
    bossName: "ARCHITECTURE DRIFT", bossSub: "it enrages as it breaks — finish it fast",
    bossMsg: "Drift contained — that's literally what Stratum does every day. You've cleared my whole history. I'm waiting at the end of the path. Come say hi.",
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
    bossName: "ANSHUL PATIL", bossSub: "he has a lot to say — listen, then act",
    bossMsg: "",
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

// the names each boss shouts as it raises its skeletons
export const SUMMON_NAMES = [
  ["SLOW QUERY", "N+1 QUERY", "FULL SCAN", "LOCKED TABLE"],
  ["RACE CONDITION", "FLOAT DRIFT", "HEISENBUG", "OFF-BY-ONE"],
  ["auth", "api", "billing", "LEGACY CODE"],
];

// the final meeting — said once, in order, then he sends you to LinkedIn
export const ANSHUL_DIALOGUE = [
  "You actually made it. Most visitors just scroll.",
  "You beat the database that taught me SQL, the bug that taught me rigor, and the drift my own product hunts.",
  "That was my whole résumé. You just played it.",
  "And as you've noticed — I'm immune to bullets. Not to opportunities.",
  "So here's the only winning move left:",
  "Now go message me about the job offer.",
];

export const LINKEDIN_URL = "https://www.linkedin.com/in/anshul-patil-575006280/";

export const PROGRESS_KEY = "career-mode-progress-v2";
