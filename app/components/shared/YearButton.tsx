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
  const current = year === currentYear;
  return (
    <button
      onClick={onClick}
      aria-pressed={current}
      className={`font-mono text-meta px-3 py-1.5 border transition-colors duration-150 ${
        current
          ? "bg-fg border-fg text-page"
          : "border-line text-muted hover:border-fg hover:text-fg"
      }`}
      title={`View Graph for the year ${year}`}
    >
      {year}
    </button>
  );
}
