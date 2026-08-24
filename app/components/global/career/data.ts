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

// ── Artifacts: real résumé evidence scattered through the halls ────────────
// Walk into one and press E. Collect them all for a damage upgrade.
export interface Artifact {
  id: string;
  zone: number;
  x: number; z: number;
  name: string;
  line: string;
}

export const ARTIFACTS: Artifact[] = [
  { id: "manifold", zone: 0, x: -17, z: 10, name: "MANIFOLD MESH",
    line: "BRL-CAD's C++ geometry engine — the thing that had to produce an identical mesh on every platform." },
  { id: "sha", zone: 0, x: 17, z: -8, name: "CANONICAL ARTIFACT",
    line: "Fixed mesh cases hashed with SHA256 and compared across platforms — the check that proved a build was deterministic." },
  { id: "asan", zone: 0, x: -16, z: -14, name: "ASAN / UBSAN RUN",
    line: "Linux Clang sanitizer runs wired into CI, so memory and UB bugs surfaced in review instead of production." },
  { id: "prreview", zone: 1, x: -17, z: 11, name: "TYPED PR FINDING",
    line: "Stratum reviews pull requests into typed findings with risk scores — 4 stages, 115 tests, 3 providers." },
  { id: "incident", zone: 1, x: 17, z: -9, name: "INCIDENT TRACE",
    line: "Sentry, Render and Railway errors correlated back to the pull request that shipped them." },
  { id: "latency", zone: 1, x: -16, z: -15, name: "LATENCY GRAPH",
    line: "Techvisio: 10K daily events, 300K monthly records, and a 40% cut in API latency from query work and caching." },
];

// ── The reverse interview: he asks, the visitor answers ───────────────────
export interface InterviewQ {
  q: string;
  options: { label: string; tag: string; reply: string }[];
}

export const INTERVIEW: InterviewQ[] = [
  {
    q: "Before you go — what are you hiring for?",
    options: [
      { label: "Backend / systems", tag: "backend",
        reply: "Good. That's the half of me that writes the determinism checks and the query plans." },
      { label: "AI / ML infrastructure", tag: "ai",
        reply: "Then you want the part of me that built an LLM review pipeline that survives real repos." },
      { label: "Full-stack product", tag: "fullstack",
        reply: "Then you want the person who shipped the whole of Stratum, front to back, alone." },
      { label: "Just looking around", tag: "browsing",
        reply: "Fair enough. You still beat two bosses, which is more than most visitors manage." },
    ],
  },
  {
    q: "What do you actually care about in an engineer?",
    options: [
      { label: "Ships fast", tag: "ships",
        reply: "Stratum went from idea to 4 working stages while I was also doing GSoC." },
      { label: "Writes real tests", tag: "tests",
        reply: "115 of them, plus sanitizers in CI. I don't trust code I can't re-run." },
      { label: "Owns production", tag: "owns",
        reply: "That's why Stratum correlates incidents back to the PR — owning it means knowing what broke it." },
    ],
  },
  {
    q: "How do you want the rest of it?",
    options: [
      { label: "The short version", tag: "short",
        reply: "One line: GSoC at BRL-CAD, a shipped product, and a 40% latency win. The rest is on the page." },
      { label: "The receipts", tag: "receipts",
        reply: "Then read the sections below — every claim on this site has a repo or a number behind it." },
    ],
  },
];

// what he highlights, keyed off the first answer
export const FOCUS_PITCH: Record<string, { title: string; body: string; section: string }> = {
  backend: {
    title: "Backend & systems",
    body: "GSoC at BRL-CAD on a C++ geometry engine: cross-platform determinism checks, SHA256 canonical artifacts, ASan/UBSan in CI, and benchmark workflows with base-vs-head comparison.",
    section: "jobs",
  },
  ai: {
    title: "AI & ML infrastructure",
    body: "Stratum's review pipeline: LLM-assisted risk analysis over real GitHub diffs, typed findings, async jobs and reruns — plus docRAG, a PDF RAG system with OCR and multilingual retrieval.",
    section: "featured-work",
  },
  fullstack: {
    title: "Full-stack product",
    body: "Stratum end to end — FastAPI, React, TypeScript, SQLAlchemy — 4 stages, 115 tests, 3 providers, from PR review through deployment risk to incident correlation.",
    section: "featured-work",
  },
  browsing: {
    title: "Start here",
    body: "GSoC at BRL-CAD, Stratum as a working product, and an internship where I cut API latency 40%. Pick whichever thread looks interesting.",
    section: "featured-work",
  },
};
