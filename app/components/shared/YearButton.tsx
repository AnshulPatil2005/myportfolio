import { MouseEventHandler } from "react";

export default function YearButton({
  year,
  currentYear,
  onClick,
}: {
  year: number;
  currentYear: number | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-center px-4 py-2 border duration-100 text-sm font-medium ${
        year === currentYear
          ? "dark:bg-zinc-100 bg-zinc-900 dark:border-zinc-100 border-zinc-900 dark:text-zinc-900 text-white"
          : "border-transparent dark:text-white text-zinc-800 dark:hover:border-zinc-700 hover:border-zinc-300"
      }`}
      title={`View Graph for the year ${year}`}
    >
      {year}
    </button>
  );
}
