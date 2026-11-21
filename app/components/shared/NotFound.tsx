import FeaturedPosts from "../pages/FeaturedPosts";

type props = {
  title: string;
  description: string;
};

export default function NotFoundComponent({ title, description }: props) {
  return (
    <main className="min-h-[60vh] max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
      <header className="pt-10 md:pt-16">
        <span className="block w-2 h-2 bg-fg mb-8" aria-hidden="true" />
        <h1
          className="leading-[0.95] tracking-[-0.025em] mb-8"
          style={{ fontSize: "clamp(3.25rem, 1.6rem + 5vw, 6.5rem)" }}
        >
          {title}
        </h1>
        <div className="folio">
          <p className="lg:col-start-4 lg:col-span-6 text-lead text-muted">
            {description}
          </p>
        </div>
      </header>

      <div className="max-w-4xl grid lg:grid-cols-2 grid-cols-1 gap-4 mt-12">
        <FeaturedPosts />
      </div>
    </main>
  );
}
