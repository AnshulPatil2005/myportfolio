"use client";

import { useTheme } from "next-themes";
import Giscus from "@giscus/react";

const GISCUS_REPO = process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`;
const GISCUS_REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPOID || "";
const GISCUS_CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORYID || "";

export default function Comments() {
  const theme = useTheme();
  const giscusTheme =
    theme.theme === "light"
      ? "light"
      : theme.theme === "dark"
      ? "transparent_dark"
      : "dark";

  if (!GISCUS_REPO || !GISCUS_REPO_ID || !GISCUS_CATEGORY_ID) {
    return (
      <p className="dark:text-zinc-400 text-zinc-600 text-sm">
        Comments are not configured yet.
      </p>
    );
  }

  return (
    <Giscus
      id="comments"
      repo={GISCUS_REPO}
      repoId={GISCUS_REPO_ID}
      category="Announcements"
      categoryId={GISCUS_CATEGORY_ID}
      mapping="title"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={giscusTheme}
      lang="en"
      loading="lazy"
    />
  );
}
