export type GraphicVariant = "network" | "pipeline" | "diff" | "manuscript" | "chart";

const commonProps = {
  viewBox: "0 0 480 320",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  preserveAspectRatio: "xMidYMid meet",
};

function Network() {
  const nodes = [
    [70, 90], [180, 50], [300, 80], [410, 60],
    [110, 190], [240, 210], [360, 200], [420, 260],
    [60, 270], [200, 130],
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [1, 9], [9, 5], [4, 9], [4, 8],
    [5, 6], [6, 7], [5, 2], [4, 0], [6, 3],
  ];
  return (
    <svg {...commonProps} aria-hidden="true">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          opacity={0.5}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 9 ? 5 : 3.5} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

function Pipeline() {
  return (
    <svg {...commonProps} aria-hidden="true">
      {/* incoming document */}
      <rect x="20" y="120" width="50" height="64" rx="1" opacity={0.7} />
      <line x1="30" y1="136" x2="60" y2="136" opacity={0.5} />
      <line x1="30" y1="148" x2="60" y2="148" opacity={0.5} />
      <line x1="30" y1="160" x2="50" y2="160" opacity={0.5} />

      <line x1="80" y1="152" x2="130" y2="152" opacity={0.6} />

      {/* stage boxes */}
      <rect x="140" y="110" width="80" height="84" opacity={0.7} />
      <text x="180" y="157" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" opacity={0.6}>
        OCR
      </text>

      <line x1="230" y1="152" x2="270" y2="152" opacity={0.6} />

      <rect x="280" y="110" width="80" height="84" opacity={0.7} />
      <text x="320" y="157" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" opacity={0.6}>
        Embed
      </text>

      <line x1="370" y1="152" x2="410" y2="152" opacity={0.6} />

      {/* vector index node cluster */}
      <circle cx="430" cy="132" r="4" fill="currentColor" stroke="none" />
      <circle cx="450" cy="152" r="4" fill="currentColor" stroke="none" />
      <circle cx="428" cy="172" r="4" fill="currentColor" stroke="none" />
      <line x1="430" y1="132" x2="450" y2="152" opacity={0.5} />
      <line x1="450" y1="152" x2="428" y2="172" opacity={0.5} />
      <line x1="428" y1="172" x2="430" y2="132" opacity={0.5} />
    </svg>
  );
}

function Diff() {
  const lines = [
    { w: 210, mark: null },
    { w: 140, mark: "-" },
    { w: 260, mark: "+" },
    { w: 90, mark: null },
    { w: 190, mark: "-" },
    { w: 230, mark: "+" },
    { w: 160, mark: null },
    { w: 120, mark: "+" },
    { w: 200, mark: null },
  ];
  const startY = 60;
  const gap = 26;
  return (
    <svg {...commonProps} aria-hidden="true">
      {lines.map((line, i) => (
        <g key={i}>
          <text
            x="30"
            y={startY + i * gap + 4}
            fontSize="13"
            fill="currentColor"
            stroke="none"
            opacity={line.mark ? 0.9 : 0.35}
          >
            {line.mark ?? ""}
          </text>
          <line
            x1="55"
            y1={startY + i * gap}
            x2={55 + line.w}
            y2={startY + i * gap}
            opacity={line.mark ? 0.75 : 0.35}
          />
        </g>
      ))}
    </svg>
  );
}

function Manuscript() {
  const blocks = [
    { y: 40, w: 300, h: 10 },
    { y: 60, w: 380, h: 10 },
    { y: 80, w: 340, h: 10 },
    { y: 100, w: 200, h: 10 },
    { y: 130, w: 380, h: 10 },
    { y: 150, w: 360, h: 10 },
    { y: 170, w: 320, h: 10 },
    { y: 190, w: 250, h: 10 },
    { y: 220, w: 380, h: 10 },
    { y: 240, w: 300, h: 10 },
    { y: 260, w: 340, h: 10 },
  ];
  return (
    <svg {...commonProps} aria-hidden="true">
      <rect x="20" y="20" width="400" height="270" opacity={0.5} />
      {blocks.map((b, i) => (
        <rect key={i} x="45" y={b.y} width={b.w} height={b.h} opacity={0.35} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

function Chart() {
  const bars = [60, 110, 80, 150, 100, 170, 130, 190];
  const barWidth = 32;
  const gap = 14;
  const baseline = 260;
  const points = bars.map((h, i) => [40 + i * (barWidth + gap) + barWidth / 2, baseline - h] as const);
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  return (
    <svg {...commonProps} aria-hidden="true">
      <line x1="30" y1={baseline} x2="450" y2={baseline} opacity={0.5} />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={40 + i * (barWidth + gap)}
          y={baseline - h}
          width={barWidth}
          height={h}
          opacity={0.28}
          fill="currentColor"
          stroke="none"
        />
      ))}
      <path d={path} opacity={0.85} />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

export default function ProjectGraphic({ variant, className = "" }: { variant: GraphicVariant; className?: string }) {
  const Graphic = { network: Network, pipeline: Pipeline, diff: Diff, manuscript: Manuscript, chart: Chart }[variant];
  return (
    <div className={`dark:text-zinc-600 text-zinc-400 ${className}`}>
      <Graphic />
    </div>
  );
}
