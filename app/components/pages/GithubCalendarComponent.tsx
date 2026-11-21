"use client";

import dynamic from "next/dynamic";
import SectionHead from "../shared/SectionHead";
import WhenVisible from "../shared/WhenVisible";

// The calendar and the stats fetch from GitHub and bring their own charting
// code, so both load only when the section comes near the viewport.
const ContributionGraph = dynamic(() => import("./ContributionGraph"), { ssr: false });
const GitHubStats = dynamic(() => import("./GitHubStats"), { ssr: false });

export default function GithubCalendarComponent() {
  return (
    <section className="mt-28 md:mt-40">
      <SectionHead title="GitHub Activity" />
      <div className="folio">
        <div className="lg:col-start-4 lg:col-span-9">
          <WhenVisible minHeight="21rem">
            <ContributionGraph />
            <GitHubStats />
          </WhenVisible>
        </div>
      </div>
    </section>
  );
}
