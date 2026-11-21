import type { ReactNode } from "react";

type Props = {
  /** section number, printed in the margin in vermilion */
  index?: ReactNode;
  /** a small label printed above the title in the margin (e.g. "Credentials") */
  kicker?: ReactNode;
  title: ReactNode;
  /** content set beside the title on wide screens (controls, a link) */
  aside?: ReactNode;
  /** lead paragraph under the title, in the text column */
  lead?: ReactNode;
  as?: "h2" | "h3";
  /** the hairline rule above the heading (off when a parent heading already has one) */
  rule?: boolean;
  /** sub-sections inside a section use a smaller title */
  size?: "section" | "sub";
  className?: string;
};

// A chapter opening: a hairline rule, the number in the margin, the title in
// the text column with its first letter rubricated.
export default function SectionHead({
  index,
  kicker,
  title,
  aside,
  lead,
  as: Tag = "h2",
  rule = true,
  size = "section",
  className = "",
}: Props) {
  const titleClass =
    size === "section"
      ? "section-title rubricate"
      : "text-[2rem] sm:text-[2.375rem] leading-[1.08] tracking-[-0.01em] rubricate";

  return (
    <header className={`folio ${rule ? "border-t border-line pt-5" : ""} mb-10 lg:mb-14 ${className}`}>
      <div className="lg:col-span-3 mb-4 lg:mb-0">
        {index != null && (
          <p className="font-mono text-meta text-rubric">{index}</p>
        )}
        {kicker != null && (
          <p className="font-mono text-meta text-muted">{kicker}</p>
        )}
      </div>
      <div className="lg:col-span-9">
        <div className="flex items-start justify-between gap-6">
          <Tag className={titleClass}>{title}</Tag>
          {aside}
        </div>
        {lead != null && (
          <p className="mt-5 max-w-measure text-lead text-muted">{lead}</p>
        )}
      </div>
    </header>
  );
}
