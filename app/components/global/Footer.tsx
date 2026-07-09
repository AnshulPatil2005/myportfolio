import UnmountStudio from "./Unmount";

export default function Footer() {
  return (
    <UnmountStudio>
      <footer className="border-t dark:border-zinc-800 border-zinc-300 mt-44 lg:min-h-[250px] min-h-full relative">
        <div className="max-w-7xl mx-auto flex lg:flex-row flex-col items-center lg:justify-between justify-center gap-y-4 md:px-16 px-6 py-16">
          <div className="flex items-center gap-x-2 font-mono text-xs uppercase tracking-widest dark:text-zinc-500 text-zinc-400">
            <span>Built with</span>
            <a
              href="https://nextjs.org"
              rel="noreferrer noopener"
              target="_blank"
              className="dark:text-zinc-300 text-zinc-600 hover:underline"
            >
              Next.js
            </a>
            <span className="dark:text-zinc-700 text-zinc-300">/</span>
            <a
              href="https://vercel.com"
              rel="noreferrer noopener"
              target="_blank"
              className="dark:text-zinc-300 text-zinc-600 hover:underline"
            >
              Vercel
            </a>
          </div>

          <div className="flex flex-col lg:items-end items-center lg:text-start text-center">
            <small className="text-zinc-500 font-mono text-xs">
              Copyright &copy; Anshul Patil {new Date().getFullYear()} All rights
              Reserved
            </small>
          </div>
        </div>
      </footer>
    </UnmountStudio>
  );
}
