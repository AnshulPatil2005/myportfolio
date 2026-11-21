import { formatMonthYear } from "../../utils/date";
import EmptyState from "../shared/EmptyState";
import { jobs } from "@/lib/data";
import ScrambleIndex from "../global/ScrambleIndex";
import TerminalLog from "./TerminalLog";
import Receipts from "../global/Receipts";
import SectionHead from "../shared/SectionHead";

const HASHES = ["4a7f9e2", "c3b8d51", "7e2a3f8", "9d4c1b6", "f81e2a0"];

// Each role is an entry in a git log: the commit hash and dates sit in the
// margin, the role in the text column. Source order is unchanged (hash,
// organisation, dates, title, bullets); the grid places the margin notes.
export default function Job() {
  return (
    <section id="jobs" className="scroll-mt-20 mt-28 md:mt-40">
      <SectionHead
        index={<>#<ScrambleIndex target="00" /></>}
        title="Experience"
        aside={<TerminalLog className="hidden sm:block" />}
      />

      {jobs.length > 0 ? (
        <div>
          <p className="folio font-mono text-meta text-muted mb-4 select-none">
            <span className="lg:col-start-4 lg:col-span-9">$ git log --graph --decorate</span>
          </p>

          <ol>
            {jobs.map((job, idx) => {
              const isActive = Boolean(job.startDate) && !job.endDate;
              const hash = HASHES[idx] ?? "0000000";
              return (
                <li
                  key={job._id}
                  className="folio lg:grid-rows-[auto_1fr] border-t border-line py-8"
                >
                  {/* margin: commit line */}
                  <div className="lg:col-span-3 lg:row-start-1 flex items-baseline gap-2.5 font-mono text-meta text-muted mb-2 lg:mb-0">
                    <span aria-hidden="true" className="text-fg">*</span>
                    <span>{hash}</span>
                    {isActive && <span className="text-fg">(HEAD → present)</span>}
                  </div>

                  {/* organisation */}
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block lg:col-start-4 lg:col-span-6 lg:row-start-1 text-h3 text-fg underline decoration-transparent underline-offset-[0.18em] hover:decoration-line transition-colors"
                  >
                    {job.name}
                  </a>

                  {/* margin: dates */}
                  {job.startDate ? (
                    <time className="block lg:col-span-3 lg:col-start-1 lg:row-start-2 mt-1 lg:mt-1.5 font-mono text-meta text-muted">
                      {formatMonthYear(job.startDate)} –{" "}
                      {job.endDate ? (
                        formatMonthYear(job.endDate)
                      ) : (
                        <span className="text-fg">Present</span>
                      )}
                    </time>
                  ) : null}

                  <div className="lg:col-start-4 lg:col-span-6 lg:row-start-2">
                    <p className="font-mono text-meta text-muted mt-1.5 mb-4">
                      {job.jobTitle}
                    </p>

                    {job.bullets && job.bullets.length > 0 ? (
                      <ul className="space-y-2">
                        {job.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-baseline gap-3 text-body text-fg">
                            <span aria-hidden="true" className="font-mono text-meta text-muted shrink-0 select-none">
                              ▸
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-body text-fg">{job.description}</p>
                    )}

                    <Receipts id={job._id} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <EmptyState
          title="Work Experience"
          message="Work experience details coming soon."
        />
      )}
    </section>
  );
}
