"use client";

import { motion } from "framer-motion";
import { formatMonthYear } from "../../utils/date";
import { Slide } from "../../animation/Slide";
import EmptyState from "../shared/EmptyState";
import { jobs } from "@/lib/data";
import ScrambleIndex from "../global/ScrambleIndex";
import TerminalLog from "./TerminalLog";
import Receipts from "../global/Receipts";

const HASHES = ["4a7f9e2", "c3b8d51", "7e2a3f8", "9d4c1b6", "f81e2a0"];

export default function Job() {
  return (
    <section id="jobs" className="scroll-mt-20 mt-32 md:mt-40">
      <Slide delay={0.16}>
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] dark:text-zinc-500 text-zinc-500 mb-3">
              #<ScrambleIndex target="00" />
            </p>
            <h2 className="font-display font-normal text-5xl sm:text-7xl tracking-[-0.02em] leading-none">
              Experience
            </h2>
          </div>
          <TerminalLog className="hidden sm:block" />
        </div>
      </Slide>

      {jobs.length > 0 ? (
        <Slide delay={0.18}>
          {/* git prompt */}
          <p className="font-mono text-[11px] dark:text-zinc-600 text-zinc-400 mb-6 tracking-wide select-none">
            $ git log --graph --decorate
          </p>

          <div className="max-w-2xl space-y-8">
            {jobs.map((job, idx) => {
              const isActive = !job.endDate;
              const hash = HASHES[idx] ?? "0000000";
              return (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.45, delay: 0.3 + idx * 0.15, ease: "easeOut" }}
                >
                  {/* Commit line */}
                  <div className="flex items-center gap-2.5 mb-2 font-mono text-[11px]">
                    <span className="dark:text-zinc-600 text-zinc-400 select-none">*</span>
                    <span className="dark:text-zinc-500 text-zinc-400 tracking-wide">{hash}</span>
                    {isActive && (
                      <span className="dark:text-zinc-600 text-zinc-400 text-[10px]">
                        (HEAD → present)
                      </span>
                    )}
                  </div>

                  {/* Body with left border as graph line */}
                  <div
                    className={`border-l-2 pl-5 ml-[5px] ${
                      idx < jobs.length - 1
                        ? "dark:border-zinc-800 border-zinc-200"
                        : "border-transparent"
                    }`}
                  >
                    <div className="flex items-baseline gap-x-4 flex-wrap mb-0.5">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-base dark:text-zinc-100 text-zinc-800 hover:underline"
                      >
                        {job.name}
                      </a>
                      {job.startDate && (
                        <time className="text-xs font-mono dark:text-zinc-500 text-zinc-400 shrink-0">
                          {formatMonthYear(job.startDate)} –{" "}
                          {job.endDate ? (
                            formatMonthYear(job.endDate)
                          ) : (
                            <span className="dark:text-zinc-100 text-zinc-900 font-semibold">
                              Present
                            </span>
                          )}
                        </time>
                      )}
                    </div>

                    <p className="text-xs font-mono dark:text-zinc-500 text-zinc-400 mb-3">
                      {job.jobTitle}
                    </p>

                    {job.bullets && job.bullets.length > 0 ? (
                      <ul className="space-y-1.5">
                        {job.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm dark:text-zinc-400 text-zinc-600"
                          >
                            <span className="font-mono text-[10px] dark:text-zinc-600 text-zinc-400 pt-[3px] shrink-0 select-none">
                              ▸
                            </span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm dark:text-zinc-400 text-zinc-600">
                        {job.description}
                      </p>
                    )}

                    <Receipts id={job._id} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Slide>
      ) : (
        <EmptyState
          title="Work Experience"
          message="Work experience details coming soon."
        />
      )}
    </section>
  );
}
