import ContributionGraph from "./ContributionGraph";
import GitHubStats from "./GitHubStats";
import { Slide } from "@/app/animation/Slide";

export default function GithubCalendarComponent() {
  return (
    <section>
      <Slide delay={0.16} className="mb-8">
        <h2 className="font-incognito text-4xl font-bold tracking-tight">
          GitHub Activity
        </h2>
      </Slide>

      <Slide delay={0.18}>
        <ContributionGraph />
      </Slide>
      <GitHubStats />
    </section>
  );
}
