const lines = [
  { text: "$ git log --oneline -4", dim: false },
  { text: "3f8a2b  fix CI determinism", dim: true },
  { text: "b2e91f  add ASan workflow lane", dim: true },
  { text: "a4c7d3  cross-platform WASM", dim: true },
  { text: "$ npm run build", dim: false },
  { text: "✓  compiled in 1.84s", dim: true },
];

// A small printed figure of a session log, set like a code listing in the
// margin. It no longer types itself out.
export default function TerminalLog({ className = "" }: { className?: string }) {
  return (
    <div className={`shrink-0 ${className}`} aria-hidden="true">
      <div className="w-full max-w-[16rem] border border-line">
        <div className="px-3 py-1.5 border-b border-line">
          <span className="font-mono text-meta text-muted">bash</span>
        </div>
        <div className="px-3 py-2.5">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`font-mono text-meta whitespace-pre ${line.dim ? "text-muted" : "text-fg"}`}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
