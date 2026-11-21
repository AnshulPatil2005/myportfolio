type HeadingType = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

// An inner page's title page: the title set large from the left edge, the
// description in the text column beneath it.
export default function PageHeading({
  title,
  description,
  children,
}: HeadingType) {
  return (
    <header className="pt-10 md:pt-16 mb-14 md:mb-20">
      <h1
        className="leading-[0.95] tracking-[-0.025em] mb-8 max-w-[14ch]"
        style={{ fontSize: "clamp(3.25rem, 1.6rem + 5vw, 6.5rem)" }}
      >
        {title}
      </h1>
      <div className="folio">
        <div className="lg:col-start-4 lg:col-span-6">
          <p className="text-lead text-muted">{description}</p>
          {children}
        </div>
      </div>
    </header>
  );
}
