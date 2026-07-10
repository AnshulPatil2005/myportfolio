import { formatMonthYear } from "../../utils/date";
import { Slide } from "../../animation/Slide";
import EmptyState from "../shared/EmptyState";
import { jobs } from "@/lib/data";

export default function Job() {
  return (
    <section id="jobs" className="scroll-mt-20 mt-16 md:mt-20">
      <Slide delay={0.16}>
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-xs dark:text-zinc-600 text-zinc-400">00</span>
          <h2 className="text-4xl font-bold tracking-tight">
            Experience
          </h2>
        </div>
      </Slide>

      {jobs.length > 0 ? (
        <Slide delay={0.18}>
          <div className="relative max-w-2xl">
            {/* Vertical timeline line */}
            <div className="absolute left-[6px] top-3 bottom-3 w-px dark:bg-zinc-700 bg-zinc-300" />
            <div className="space-y-0">
              {jobs.map((job) => {
                const isActive = !job.endDate;
                return (
                  <div key={job._id} className="relative flex gap-x-5 pb-10 last:pb-0">
                    {/* Timeline marker */}
                    <div
                      className={`relative z-10 mt-1.5 w-3.5 h-3.5 shrink-0 border-2 ${
                        isActive
                          ? "dark:bg-zinc-100 bg-zinc-900 dark:border-zinc-100 border-zinc-900"
                          : "dark:bg-ink bg-paper dark:border-zinc-600 border-zinc-400"
                      }`}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-0.5">
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
                              className="flex items-start gap-x-2.5 text-sm dark:text-zinc-400 text-zinc-600"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 dark:bg-zinc-600 bg-zinc-400 shrink-0" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm dark:text-zinc-400 text-zinc-600">
                          {job.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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
