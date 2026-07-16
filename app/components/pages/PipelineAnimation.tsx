"use client";

import { motion } from "framer-motion";

type PipelineVariant = "ai-pr-reviewer" | "docrag";

type PipelineStep = {
  id: string;
  label: string;
  detail: string;
};

type PipelineConfig = {
  title: string;
  subtitle: string;
  steps: PipelineStep[];
  logs: string[];
};

const PIPELINES: Record<PipelineVariant, PipelineConfig> = {
  "ai-pr-reviewer": {
    title: "PR review pipeline",
    subtitle: "diff in / risk model out",
    steps: [
      { id: "repo", label: "Repo", detail: "GitHub PR" },
      { id: "diff", label: "Diff", detail: "files + hunks" },
      { id: "risk", label: "Risk", detail: "LLM + rules" },
      { id: "findings", label: "Findings", detail: "per-file issues" },
      { id: "report", label: "Report", detail: "exportable review" },
    ],
    logs: [
      "fetch_pr_details()",
      "parse_diff_by_file()",
      "score risk / confidence",
      "persist analysis history",
    ],
  },
  docrag: {
    title: "Document RAG pipeline",
    subtitle: "pdf in / cited answer out",
    steps: [
      { id: "upload", label: "Upload", detail: "PDF" },
      { id: "ocr", label: "OCR", detail: "text fallback" },
      { id: "embed", label: "Embed", detail: "chunks" },
      { id: "search", label: "Search", detail: "Qdrant top-k" },
      { id: "answer", label: "Answer", detail: "citations" },
    ],
    logs: [
      "enqueue Celery task",
      "extract pages + chunks",
      "write vectors to Qdrant",
      "ground answer in sources",
    ],
  },
};

function Packet({ delay = 0, top = "50%" }: { delay?: number; top?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute z-10 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(59,130,246,0.9)]"
      style={{ top }}
      initial={{ left: "8%", opacity: 0 }}
      animate={{
        left: ["8%", "28%", "49%", "70%", "92%"],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        duration: 4.8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function PipelineAnimation({
  variant,
  className = "",
}: {
  variant: PipelineVariant;
  className?: string;
}) {
  const pipeline = PIPELINES[variant];

  return (
    <div
      className={`relative mt-5 overflow-hidden border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/40 bg-white/70 p-4 ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-400">
            {pipeline.subtitle}
          </p>
          <p className="mt-1 text-sm font-semibold dark:text-zinc-200 text-zinc-800">
            {pipeline.title}
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] dark:text-zinc-600 text-zinc-400">
          live trace
        </div>
      </div>

      <div className="relative z-10 min-h-[118px]">
        <div
          aria-hidden="true"
          className="absolute left-[8%] right-[8%] top-[34px] h-px dark:bg-zinc-800 bg-zinc-300"
        />
        <div
          aria-hidden="true"
          className="absolute left-[8%] right-[8%] top-[58px] h-px border-t border-dashed dark:border-zinc-800 border-zinc-300"
        />
        <Packet delay={0} top="31px" />
        <Packet delay={1.35} top="55px" />

        <div className="grid grid-cols-5 gap-2">
          {pipeline.steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative flex min-w-0 flex-col items-center text-center"
              initial={{ opacity: 0.55, y: 6 }}
              animate={{ opacity: [0.65, 1, 0.65], y: [4, 0, 4] }}
              transition={{
                duration: 3.4,
                delay: index * 0.22,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative grid h-10 w-10 place-items-center rounded-full border dark:border-zinc-700 border-zinc-300 dark:bg-zinc-950 bg-white">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="absolute -inset-1 rounded-full border dark:border-zinc-800 border-zinc-200" />
              </div>
              <p className="mt-3 truncate max-w-full font-mono text-[10px] uppercase tracking-[0.14em] dark:text-zinc-300 text-zinc-700">
                {step.label}
              </p>
              <p className="mt-1 truncate max-w-full text-[11px] dark:text-zinc-600 text-zinc-400">
                {step.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-4 grid sm:grid-cols-2 gap-x-4 gap-y-1.5 border-t dark:border-zinc-800 border-zinc-300 pt-3">
        {pipeline.logs.map((log, index) => (
          <motion.div
            key={log}
            className="flex min-w-0 items-center gap-2 font-mono text-[11px] dark:text-zinc-500 text-zinc-500"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: [0.35, 0.95, 0.35] }}
            transition={{
              duration: 3.2,
              delay: index * 0.45,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="h-1 w-1 rounded-full bg-accent/80 shrink-0" />
            <span className="truncate">{log}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
