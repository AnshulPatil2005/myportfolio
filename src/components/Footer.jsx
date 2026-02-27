export default function Footer() {
  return (
    <footer className="border-t border-amber-200 bg-amber-50 px-4 py-6 text-center">
      <p className="mb-2 text-sm text-stone-600">Copyright 2026 Anshul Patil. All rights reserved.</p>
      <div className="flex justify-center gap-4 text-sm text-stone-700">
        <a
          href="https://github.com/AnshulPatil2005"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-stone-900"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/anshul-patil-575006280/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-stone-900"
        >
          LinkedIn
        </a>
        <a href="mailto:anshulpatil1022@gmail.com" className="hover:text-stone-900">
          Email
        </a>
      </div>
    </footer>
  );
}