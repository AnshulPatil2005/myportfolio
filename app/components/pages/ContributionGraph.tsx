"use client";
import { useTheme } from "next-themes";
import GitHubCalendar from "react-github-calendar";
import { github } from "@/app/data/contribution-graph-theme";
import { useState, useEffect } from "react";
import YearButton from "../shared/YearButton";
import { getGitHubYears } from "@/app/utils/calculate-years";

export default function ContributionGraph() {
  const [calendarYear, setCalendarYear] = useState<number | undefined>(
    undefined
  );
  const { theme, systemTheme } = useTheme();
  const [serverTheme, setServerTheme] = useState<"light" | "dark" | undefined>(
    undefined
  );
  const scheme =
    theme === "light" ? "light" : theme === "dark" ? "dark" : systemTheme;

  // Set theme only after rendering to avoid mismatch between client and server
  // https://github.com/vercel/next.js/issues/10608#issuecomment-589073831
  useEffect(() => {
    setServerTheme(scheme);
  }, [scheme]);

  const today = new Date().getFullYear();
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "AnshulPatil2005";
  const joinYear = Number(process.env.NEXT_PUBLIC_GITHUB_JOIN_YEAR) || 2024;
  const years = getGitHubYears(joinYear);

  return (
    <div>
      <div className="border border-line p-5 sm:p-6 overflow-x-auto text-fg font-mono text-meta" tabIndex={0}>
        <GitHubCalendar
          username={username}
          theme={github}
          colorScheme={serverTheme}
          blockSize={12}
          blockMargin={3}
          fontSize={13}
          year={calendarYear}
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {/* Display only the last five years */}
        {years.slice(0, 5).map((year) => (
          <YearButton
            key={year}
            year={year}
            currentYear={calendarYear ?? today}
            onClick={() =>
              setCalendarYear(year === calendarYear ? undefined : year)
            }
          />
        ))}
      </div>
    </div>
  );
}
