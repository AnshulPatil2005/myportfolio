"use client";

import { motion } from "framer-motion";

const modules = [
  { name: "auth",   risk: 0.92 },
  { name: "api",    risk: 0.64 },
  { name: "billing",risk: 0.78 },
  { name: "worker", risk: 0.38 },
  { name: "db",     risk: 0.70 },
  { name: "tests",  risk: 0.28 },
  { name: "deploy", risk: 0.55 },
  { name: "config", risk: 0.82 },
];

const timeline = [
  { label: "PR #482",    detail: "auth refactor", hot: false },
  { label: "deploy",     detail: "batch release", hot: false },
  { label: "prod error", detail: "Sentry alert",  hot: true  },
  { label: "root cause", detail: "auth.py:L214",  hot: true  },
];

// a real heat ramp reads as risk far better than one colour at four opacities
function riskColor(risk: number) {
  if (risk > 0.8) return "bg-red-500/70";
  if (risk > 0.6) return "bg-orange-500/55";
  if (risk > 0.4) return "bg-amber-500/35";
  return "bg-zinc-500/20";
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
            Risk by module
          </h4>
        </div>
        <motion.span
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          live
        </motion.span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {modules.map((item, i) => (
          <div
            key={item.name}
            className="relative min-h-[68px] border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/30 bg-white/60 p-2 overflow-hidden"
          >
            {/* Animated risk bar — only height moves, card itself is static */}
            <motion.div
              aria-hidden="true"
              className={`absolute bottom-0 left-0 right-0 ${riskColor(item.risk)}`}
              animate={{
                height: [
                  `${item.risk * 55}%`,
                  `${item.risk * 75}%`,
                  `${item.risk * 55}%`,
                ],
              }}
              transition={{
                duration: 5,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative z-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] dark:text-zinc-300 text-zinc-700">
                {item.name}
              </p>
              <p className="mt-1 font-mono text-[10px] dark:text-zinc-600 text-zinc-500">
                {Math.round(item.risk * 100)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 font-mono text-[10px] dark:text-zinc-600 text-zinc-500 text-right">
        hotspots before refactor debt compounds
      </p>
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
            Errors traced to commits
          </h4>
        </div>
        <span className="font-mono text-[10px] dark:text-zinc-600 text-zinc-400">
          score 86
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Track */}
        <div className="absolute left-[18px] right-[18px] top-[22px] h-px dark:bg-zinc-800 bg-zinc-300" />
        {/* Traveling dot */}
        <motion.div
          className="absolute top-[19px] h-1.5 w-1.5 rounded-full bg-accent"
          animate={{ left: ["4%", "94%"] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />

        <div className="grid grid-cols-4 gap-2">
          {timeline.map((event) => (
            <div key={event.label} className="relative pt-11">
              <div
                className={`absolute top-[15px] left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border ${
                  event.hot
                    ? "bg-red-500/70 dark:border-red-500/50 border-red-400/50"
                    : "dark:bg-zinc-950 bg-white dark:border-zinc-700 border-zinc-300"
                }`}
              />
              <div className="border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/30 bg-white/60 p-2.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] dark:text-zinc-300 text-zinc-700">
                  {event.label}
                </p>
                <p className="mt-1.5 text-[11px] dark:text-zinc-500 text-zinc-500 leading-snug">
                  {event.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Root cause callout */}
      <motion.div
        className="mt-5 border-l-2 dark:border-zinc-700 border-zinc-300 pl-3"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          candidate root cause
        </p>
        <p className="mt-1 text-[11px] dark:text-zinc-400 text-zinc-600 leading-relaxed">
          Stack trace + PR risk + module drift all point to the auth refactor.
        </p>
      </motion.div>
    </div>
  );
}

export default function StratumSignalAnimation() {
  return (
    <div className="mt-10 mb-10 grid lg:grid-cols-2 gap-4 text-left">
      <DriftHeatmap />
      <IncidentTimeline />
    </div>
  );
}
