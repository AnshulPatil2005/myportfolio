import Link from "next/link";

type props = {
  title: string;
  description: string;
};

export default function NotFoundComponent({ title, description }: props) {
  return (
    <main id="main" className="min-h-[60vh] max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
      <header className="pt-10 md:pt-16">
        <span className="block w-2 h-2 bg-fg mb-8" aria-hidden="true" />
        <h1
          className="leading-[0.95] tracking-[-0.025em] mb-8"
          style={{ fontSize: "clamp(3.25rem, 1.6rem + 5vw, 6.5rem)" }}
        >
          {title}
        </h1>
        <div className="folio">
          <div className="lg:col-start-4 lg:col-span-6">
            <p className="text-lead text-muted mb-8">{description}</p>
            <Link href="/" className="group link text-lead">
              Back to the homepage{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </header>
    </main>
  );
}
