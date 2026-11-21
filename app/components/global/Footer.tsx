import UnmountStudio from "./Unmount";

// The colophon: one ruled line at the foot of every page.
export default function Footer() {
  return (
    <UnmountStudio>
      <footer className="border-t border-line mt-32 md:mt-44">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-10 md:py-12 flex md:flex-row flex-col md:items-baseline md:justify-between gap-y-3 font-mono text-meta text-muted">
          <div className="flex items-baseline gap-x-2">
            <span>Built with</span>
            <a
              href="https://nextjs.org"
              rel="noreferrer noopener"
              target="_blank"
              className="link"
            >
              Next.js
            </a>
            <span aria-hidden="true">/</span>
            <a
              href="https://vercel.com"
              rel="noreferrer noopener"
              target="_blank"
              className="link"
            >
              Vercel
            </a>
          </div>

          <small className="text-meta">
            Copyright &copy; Anshul Patil {new Date().getFullYear()} All rights
            Reserved
          </small>
        </div>
      </footer>
    </UnmountStudio>
  );
}
