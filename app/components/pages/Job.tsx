import { formatMonthYear } from "../../utils/date";
import { Slide } from "../../animation/Slide";
import EmptyState from "../shared/EmptyState";
import { RiBriefcase3Fill } from "react-icons/ri";
import { jobs } from "@/lib/data";

export default function Job() {
  return (
    <section id="jobs" className="scroll-mt-28 mt-32">
      <Slide delay={0.16}>
        <div className="mb-10">
          <h2 className="font-incognito text-4xl mb-4 font-bold tracking-tight">
            Work Experience
          </h2>
        </div>
      </Slide>

      {jobs.length > 0 ? (
        <Slide delay={0.18}>
          <div className="relative max-w-2xl">
            {/* Vertical timeline line */}
            <div className="absolute left-[6px] top-3 bottom-3 w-px dark:bg-zinc-700 bg-zinc-200" />
            <div className="space-y-0">
              {jobs.map((job) => {
                const isActive = !job.endDate;
                return (
                  <div key={job._id} className="relative flex gap-x-5 pb-10 last:pb-0">
                    {/* Timeline dot */}
                    <div
                      className={`relative z-10 mt-1.5 w-3.5 h-3.5 rounded-full shrink-0 border-2 ${
                        isActive
                          ? "dark:bg-primary-color bg-emerald-500 dark:border-emerald-600 border-emerald-400 shadow-[0_0_8px_2px_rgba(16,185,129,0.3)]"
                          : "dark:bg-zinc-800 bg-white dark:border-zinc-600 border-zinc-300"
                      }`}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-0.5">
                        <p className="text-sm font-mono">
                          <span className="dark:text-zinc-500 text-zinc-400">feat: </span>
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold dark:text-zinc-100 text-zinc-800 hover:underline"
                          >
                            {job.name}
                          </a>
                        </p>
                        {job.startDate && (
                          <time className="text-xs font-mono dark:text-zinc-500 text-zinc-400 shrink-0">
                            {formatMonthYear(job.startDate)} –{" "}
                            {job.endDate ? (
                              formatMonthYear(job.endDate)
                            ) : (
                              <span className="dark:text-primary-color text-tertiary-color">
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
                              className="flex items-start gap-x-2 text-sm dark:text-zinc-400 text-zinc-600"
                            >
                              <span className="mt-2 h-1 w-1 rounded-full dark:bg-zinc-600 bg-zinc-400 shrink-0" />
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
          icon={<RiBriefcase3Fill />}
          title="Work Experience"
          message="Work experience details coming soon."
        />
      )}
    </section>
  );
}
