// Verifiable sources for the claims on this site, keyed by job/product id.
//
// Only links that actually exist belong here. Where a specific number still
// needs a direct source (a PR, a benchmark run, a dashboard), add it rather
// than pointing at a repository root — a receipt that does not show the thing
// it claims is worse than no receipt.
export interface Receipt {
  label: string;
  url: string;
}

export const RECEIPTS: Record<string, Receipt[]> = {
  "gsoc-2026": [
    { label: "GSoC project", url: "https://summerofcode.withgoogle.com/" },
    { label: "BRL-CAD", url: "https://github.com/BRL-CAD/brlcad" },
    { label: "Manifold", url: "https://github.com/elalish/manifold" },
  ],
  extralit: [
    { label: "merged PRs", url: "https://github.com/extralit/extralit/pulls?q=is%3Apr+author%3AAnshulPatil2005" },
    { label: "repo", url: "https://github.com/extralit/extralit" },
  ],
  stratum: [
    { label: "source", url: "https://github.com/AnshulPatil2005/Stratum" },
  ],
  "docrag-v3": [
    { label: "source", url: "https://github.com/AnshulPatil2005/docRAG_v3" },
  ],
  "ai-pr-reviewer": [
    { label: "live", url: "https://ai-pr-reviewer-theta.vercel.app/" },
    { label: "source", url: "https://github.com/AnshulPatil2005/AI-PR-Reviewer" },
  ],
  "career-mode": [
    { label: "site source", url: "https://github.com/AnshulPatil2005/myportfolio" },
    { label: "write-up", url: "/projects/career-mode" },
  ],
};
