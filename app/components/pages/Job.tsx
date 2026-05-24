import Image from "next/image";
import type { JobType } from "@/types";
import { formatMonthYear } from "../../utils/date";
import { Slide } from "../../animation/Slide";
import RefLink from "../shared/RefLink";
import EmptyState from "../shared/EmptyState";
import { RiBriefcase3Fill } from "react-icons/ri";
import { jobs } from "@/lib/data";

export default function Job() {
  return (
    <section className="mt-32">
      <Slide delay={0.16}>
        <div className="mb-16">
          <h2 className="font-incognito text-4xl mb-4 font-bold tracking-tight">
            Work Experience
          </h2>
        </div>
      </Slide>

      {jobs.length > 0 ? (
        <Slide delay={0.18}>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-12 gap-y-10">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex items-start lg:gap-x-6 gap-x-4 max-w-2xl"
              >
                <RefLink
                  href={job.url}
                  className="grid place-items-center dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 min-h-[60px] min-w-[60px] p-2 rounded-md overflow-clip shrink-0"
                >
                  {job.logo ? (
                    <Image
                      src={job.logo}
                      className="object-cover duration-300"
                      alt={`${job.name} logo`}
                      width={44}
                      height={44}
                    />
                  ) : (
                    <RiBriefcase3Fill className="text-2xl dark:text-zinc-400 text-zinc-500" />
                  )}
                </RefLink>
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-semibold">{job.name}</h3>
                  <p className="dark:text-zinc-400 text-zinc-500 text-sm">{job.jobTitle}</p>
                  <time className="text-sm text-zinc-500 mt-2 tracking-widest uppercase">
                    {formatMonthYear(job.startDate)} –{" "}
                    {job.endDate ? (
                      formatMonthYear(job.endDate)
                    ) : (
                      <span className="dark:text-primary-color text-tertiary-color">
                        Present
                      </span>
                    )}
                  </time>
                  {job.bullets && job.bullets.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {job.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-x-2 text-sm dark:text-zinc-400 text-zinc-600"
                        >
                          <span className="mt-2 h-1 w-1 rounded-full dark:bg-zinc-500 bg-zinc-400 shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="tracking-tight dark:text-zinc-400 text-zinc-600 my-4 text-sm">
                      {job.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
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
