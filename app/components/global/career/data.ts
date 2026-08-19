// Shared data for Career Mode — no three.js imports here so the menu
// shell can use it without pulling in the 3D engine chunk.

export const ROMAN = ["I", "II", "III"];

export const CHAPTERS = [
  {
    year: "2026", org: "GSoC · BRL-CAD", role: "Selected Contributor · Manifold",
    story: [
      "Google Summer of Code. A C++ geometry engine that must produce",
      "the exact same mesh on every platform, every compiler, every run.",
      "But floating point drifts. Builds diverge. The same operation",
      "returns a subtly different truth on every machine.",
    ],
    bossName: "NON-DETERMINISM", bossSub: "it will not hold still — keep your aim honest",
    bossMsg: "Pinned. Non-determinism took me SHA256 checksums across three platforms and a pile of CI runs to beat — you just needed better aim. One gate left before you meet me.",
    victory: "Designed cross-platform determinism checks with fixed mesh cases, canonical artifacts, and SHA256 comparison — plus Linux Clang ASan/UBSan testing and PR/weekly benchmark workflows with base-vs-head comparison and dashboard trend visualization.",
    quip: "SHA256 matched on all platforms. reality agreed with itself again.",
    unlock: "CHECKSUM BURST", unlockDesc: "shotgun — six pellets, every one identical",
    exitTo: "jobs",
  },
  {
    year: "2026", org: "Stratum · The Offer", role: "Founder · Builder",
    story: [
      "Everything learned, fused into one product: Stratum — an intelligence",
      "layer that reviews pull requests, scores deployment risk, and traces",
      "production incidents back to the code that caused them.",
      "Which leaves exactly one obstacle between you and hiring him.",
      "It is not a bug. It is paperwork.",
    ],
    bossName: "THE APPLICATION", bossSub: "a job application form, four pages, fully weaponised",
    bossMsg: "You filled it out. Nobody fills it out. That was the last thing standing between you and me — I'm waiting at the end of the tunnel. Come say hi.",
    victory: "Shipped Stratum — PR review with typed findings and risk scoring, deployment conflict detection, live architecture-drift mapping, and Sentry/Render/Railway incident correlation. 4 stages, 115 tests, 3 providers.",
    quip: "section 4 complete. references verified. no fields left blank.",
    unlock: "FULL STACK", unlockDesc: "railgun — one exact answer, pierces everything",
    exitTo: "featured-work",
  },
  {
    year: "NOW", org: "The Interview", role: "Final Chapter",
    story: [
      "You've cleared his history. Beaten every problem he ever beat.",
      "One obstacle remains between you and the end of this portfolio.",
      "He is standing at the end of the tunnel. He has seen everything",
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
  { name: "CHECKSUM BURST" },
  { name: "FULL STACK" },
];

export const IMMUNE_TEXTS = ["0", "IMMUNE", "0", "already fixed", "0", "skill issue", "0", "nice try"];

// the names each boss shouts as it raises its skeletons
export const SUMMON_NAMES = [
  ["RACE CONDITION", "FLOAT DRIFT", "HEISENBUG", "OFF-BY-ONE"],
  ["COVER LETTER", "REFERENCES", "NOTICE PERIOD", "SALARY EXPECTATION"],
];

// the final meeting — said once, in order, then he sends you to LinkedIn
export const ANSHUL_DIALOGUE = [
  "You actually made it. Most visitors just scroll.",
  "You beat the bug that taught me rigor, and then you beat my own hiring paperwork.",
  "Before those there was a dashboard at Techvisio drowning in 10,000 events a day — I cut its API latency by 40%. That one was too slow to make a good boss.",
  "That was my résumé. You just played it.",
  "And as you've noticed — I'm immune to bullets. Not to opportunities.",
  "Now go message me about the job offer.",
];

export const LINKEDIN_URL = "https://www.linkedin.com/in/anshul-patil-575006280/";

export const PROGRESS_KEY = "career-mode-progress-v3";
