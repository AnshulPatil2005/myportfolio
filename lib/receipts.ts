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
  "lfx-openkruise": [
    { label: "merged PRs", url: "https://github.com/openkruise/agents/pulls?q=is%3Apr+author%3AAnshulPatil2005+is%3Amerged" },
    { label: "repo", url: "https://github.com/openkruise/agents" },
  ],
  kubescape: [
    { label: "merged PRs", url: "https://github.com/search?q=org%3Akubescape+author%3AAnshulPatil2005+is%3Apr+is%3Amerged&type=pullrequests" },
    { label: "kubevuln", url: "https://github.com/kubescape/kubevuln" },
  ],
  "gsoc-2026": [
    { label: "GSoC project", url: "https://summerofcode.withgoogle.com/" },
    { label: "merged PRs", url: "https://github.com/elalish/manifold/pulls?q=is%3Apr+author%3AAnshulPatil2005+is%3Amerged" },
    { label: "Manifold", url: "https://github.com/elalish/manifold" },
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
