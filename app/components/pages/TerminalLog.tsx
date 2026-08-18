const lines = [
  { text: "$ git log --oneline -4", dim: false },
  { text: "3f8a2b  fix CI determinism", dim: true },
  { text: "b2e91f  add ASan workflow lane", dim: true },
  { text: "a4c7d3  cross-platform WASM", dim: true },
  { text: "$ npm run build", dim: false },
  { text: "✓  compiled in 1.84s", dim: true },
];

export default function TerminalLog({ className = "" }: { className?: string }) {
  return (
    <div className={`shrink-0 ${className}`} aria-hidden="true">
      <div className="w-[220px] border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 overflow-hidden">
        {/* title bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b dark:border-zinc-800 border-zinc-200">
          <span className="w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-300" />
          <span className="w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-300" />
          <span className="w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-300" />
          <span className="ml-2 font-mono text-[10px] dark:text-zinc-600 text-zinc-400">bash</span>
        </div>

        {/* lines */}
        <div className="px-3 py-3 space-y-1">
          {lines.map((line, i) => (
            <p
              key={i}
              className="font-mono text-[11px] leading-relaxed dark:text-zinc-400 text-zinc-500 opacity-0"
              style={{
                animation: `termLine 0.25s ease forwards`,
                animationDelay: `${0.35 + i * 0.45}s`,
              }}
            >
              {line.dim
                ? <span className="dark:text-zinc-500 text-zinc-400">{line.text}</span>
                : line.text}
            </p>
          ))}

          {/* blinking cursor */}
          <p
            className="font-mono text-[11px] dark:text-zinc-400 text-zinc-500 opacity-0"
            style={{
              animation: `termLine 0.25s ease forwards ${0.35 + lines.length * 0.45}s`,
            }}
          >
            <span
              className="inline-block w-[7px] h-[13px] dark:bg-accent bg-amber-500 align-middle"
              style={{ animation: "termCursor 1s step-end infinite" }}
            />
          </p>
        </div>
      </div>

      <style>{`
        @keyframes termLine {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes termCursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
