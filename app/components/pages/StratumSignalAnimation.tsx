"use client";

import { motion } from "framer-motion";

const modules = [
  { name: "auth", risk: 0.92, delay: 0.05 },
  { name: "api", risk: 0.64, delay: 0.15 },
  { name: "billing", risk: 0.78, delay: 0.25 },
  { name: "worker", risk: 0.38, delay: 0.35 },
  { name: "db", risk: 0.7, delay: 0.45 },
  { name: "tests", risk: 0.28, delay: 0.55 },
  { name: "deploy", risk: 0.55, delay: 0.65 },
  { name: "config", risk: 0.82, delay: 0.75 },
];

const timeline = [
  { label: "PR #482", detail: "auth refactor", tone: "normal" },
  { label: "deploy", detail: "batch release", tone: "normal" },
  { label: "prod error", detail: "Sentry + Render", tone: "hot" },
  { label: "cause", detail: "backend/auth.py", tone: "hot" },
];

function riskColor(risk: number) {
  if (risk > 0.8) return "bg-accent/80";
  if (risk > 0.6) return "bg-accent/55";
  if (risk > 0.4) return "bg-accent/35";
  return "bg-zinc-500/25";
}

function DriftHeatmap() {
  return (
    <div className="border dark:border-zinc-800 border-zinc-300 p-4 text-left">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-400">
            architecture drift
          </p>
          <h4 className="mt-1 text-sm font-semibold dark:text-zinc-200 text-zinc-800">
            Risk building up by module
          </h4>
        </div>
        <motion.span
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          live drift
        </motion.span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {modules.map((item) => (
          <motion.div
            key={item.name}
            className="relative min-h-[74px] border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/30 bg-white/70 p-2 overflow-hidden"
            initial={{ opacity: 0.55 }}
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{
              duration: 3.6,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              aria-hidden="true"
              className={`absolute bottom-0 left-0 right-0 ${riskColor(item.risk)}`}
              initial={{ height: "18%" }}
              animate={{ height: [`${Math.max(16, item.risk * 54)}%`, `${Math.max(22, item.risk * 82)}%`, `${Math.max(16, item.risk * 54)}%`] }}
              transition={{
                duration: 4,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative z-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] dark:text-zinc-300 text-zinc-700">
                {item.name}
              </p>
              <p className="mt-1 font-mono text-[10px] dark:text-zinc-600 text-zinc-500">
                {Math.round(item.risk * 100)} risk
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 font-mono text-[10px] dark:text-zinc-600 text-zinc-500">
        <span className="h-px flex-1 dark:bg-zinc-800 bg-zinc-300" />
        <span>hotspots before refactor debt compounds</span>
      </div>
    </div>
  );
}

function IncidentTimeline() {
  return (
    <div className="border dark:border-zinc-800 border-zinc-300 p-4 text-left">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-400">
            incident correlation
          </p>
          <h4 className="mt-1 text-sm font-semibold dark:text-zinc-200 text-zinc-800">
            Production errors traced to code changes
          </h4>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] dark:text-zinc-600 text-zinc-400">
          score 86
        </span>
      </div>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute left-[18px] right-[18px] top-[22px] h-px dark:bg-zinc-800 bg-zinc-300"
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-[19px] h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(59,130,246,0.85)]"
          initial={{ left: "4%", opacity: 0 }}
          animate={{ left: ["4%", "34%", "66%", "94%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="grid grid-cols-4 gap-3">
          {timeline.map((event, index) => (
            <motion.div
              key={event.label}
              className="relative pt-12"
              initial={{ opacity: 0.55, y: 4 }}
              animate={{ opacity: [0.55, 1, 0.55], y: [4, 0, 4] }}
              transition={{
                duration: 3.6,
                delay: index * 0.32,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className={`absolute left-1/2 top-[15px] h-4 w-4 -translate-x-1/2 rounded-full border dark:border-zinc-700 border-zinc-300 ${
                  event.tone === "hot" ? "bg-accent/70" : "dark:bg-zinc-950 bg-white"
                }`}
              />
              <div className="min-h-[82px] border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/30 bg-white/70 p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] dark:text-zinc-300 text-zinc-700">
                  {event.label}
                </p>
                <p className="mt-2 text-xs dark:text-zinc-500 text-zinc-500 leading-snug">
                  {event.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="mt-5 border-l-2 border-accent pl-3"
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          candidate root cause
        </p>
        <p className="mt-1 text-xs dark:text-zinc-400 text-zinc-600">
          Stack trace overlap + recent PR risk + module drift point to the auth refactor.
        </p>
      </motion.div>
    </div>
  );
}

export default function StratumSignalAnimation() {
  return (
    <div className="mt-12 mb-10 grid lg:grid-cols-2 gap-4 text-left">
      <DriftHeatmap />
      <IncidentTimeline />
    </div>
  );
}
