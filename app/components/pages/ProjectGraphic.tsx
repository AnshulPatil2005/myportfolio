export type GraphicVariant = "network" | "pipeline" | "diff" | "manuscript" | "chart";

const VIEW_W = 480;
const VIEW_H = 320;

const commonProps = {
  viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  preserveAspectRatio: "xMidYMid meet",
};

const MARGIN = 24;
const BRACKET = 14;

// Shared framing device: faint dot grid + corner brackets, tying every
// graphic together as one visual system (a "technical schematic" motif).
function Frame() {
  const dots: [number, number][] = [];
  for (let x = MARGIN; x <= VIEW_W - MARGIN; x += 40) {
    for (let y = MARGIN; y <= VIEW_H - MARGIN; y += 40) {
      dots.push([x, y]);
    }
  }
  const corners: [number, number, number, number][] = [
    [MARGIN, MARGIN, 1, 1],
    [VIEW_W - MARGIN, MARGIN, -1, 1],
    [MARGIN, VIEW_H - MARGIN, 1, -1],
    [VIEW_W - MARGIN, VIEW_H - MARGIN, -1, -1],
  ];
  return (
    <>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.75} fill="currentColor" stroke="none" opacity={0.18} />
      ))}
      {corners.map(([x, y, dx, dy], i) => (
        <g key={i} opacity={0.5}>
          <line x1={x} y1={y} x2={x + dx * BRACKET} y2={y} />
          <line x1={x} y1={y} x2={x} y2={y + dy * BRACKET} />
        </g>
      ))}
    </>
  );
}

function Network() {
  const nodes: [number, number][] = [
    [90, 96], [190, 54], [300, 84], [400, 66],
    [126, 196], [252, 214], [364, 202], [408, 258],
    [86, 262], [230, 140],
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [1, 9], [9, 5], [4, 9], [4, 8],
    [5, 6], [6, 7], [5, 2], [4, 0], [6, 3],
  ];
  const hub = 9;
  return (
    <svg {...commonProps} aria-hidden="true">
      <Frame />
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          opacity={a === hub || b === hub ? 0.65 : 0.4}
        />
      ))}
      <circle cx={nodes[hub][0]} cy={nodes[hub][1]} r={13} opacity={0.35} />
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === hub ? 5.5 : 3.25}
          fill="currentColor"
          stroke="none"
          opacity={i === hub ? 1 : 0.75}
        />
      ))}
    </svg>
  );
}

function BracketBox({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  const b = 10;
  return (
    <g opacity={0.75}>
      <path d={`M${x} ${y + b} V${y} H${x + b}`} />
      <path d={`M${x + w - b} ${y} H${x + w} V${y + b}`} />
      <path d={`M${x + w} ${y + h - b} V${y + h} H${x + w - b}`} />
      <path d={`M${x + b} ${y + h} H${x} V${y + h - b}`} />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize="10"
        letterSpacing="1"
        fill="currentColor"
        stroke="none"
        opacity={0.8}
      >
        {label}
      </text>
    </g>
  );
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g opacity={0.55}>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <path d={`M${x2 - 6} ${y - 4} L${x2} ${y} L${x2 - 6} ${y + 4}`} />
    </g>
  );
}

function Pipeline() {
  return (
    <svg {...commonProps} aria-hidden="true">
      <Frame />

      {/* incoming document */}
      <g opacity={0.7}>
        <rect x="38" y="120" width="46" height="60" rx="1" />
        <line x1="47" y1="135" x2="75" y2="135" opacity={0.6} />
        <line x1="47" y1="146" x2="75" y2="146" opacity={0.6} />
        <line x1="47" y1="157" x2="66" y2="157" opacity={0.6} />
      </g>

      <Arrow x1={90} x2={128} y={150} />
      <BracketBox x={132} y={110} w={78} h={80} label="OCR" />
      <Arrow x1={216} x2={254} y={150} />
      <BracketBox x={258} y={110} w={78} h={80} label="EMBED" />
      <Arrow x1={342} x2={378} y={150} />

      {/* vector index node cluster */}
      <g opacity={0.85}>
        <circle cx="404" cy="128" r="4" fill="currentColor" stroke="none" />
        <circle cx="426" cy="150" r="4" fill="currentColor" stroke="none" />
        <circle cx="400" cy="172" r="4" fill="currentColor" stroke="none" />
        <line x1="404" y1="128" x2="426" y2="150" opacity={0.5} />
        <line x1="426" y1="150" x2="400" y2="172" opacity={0.5} />
        <line x1="400" y1="172" x2="404" y2="128" opacity={0.5} />
      </g>
    </svg>
  );
}

function Diff() {
  const lines = [
    { w: 190, mark: null },
    { w: 130, mark: "-" },
    { w: 240, mark: "+" },
    { w: 80, mark: null },
    { w: 175, mark: "-" },
    { w: 215, mark: "+" },
    { w: 150, mark: null },
    { w: 110, mark: "+" },
    { w: 185, mark: null },
  ];
  const startY = 66;
  const gap = 24;
  const gutterX = 58;
  return (
    <svg {...commonProps} aria-hidden="true">
      <Frame />

      {/* hunk header */}
      <text x={gutterX} y={44} fontSize="10" letterSpacing="0.5" fill="currentColor" stroke="none" opacity={0.55}>
        @@ -12,7 +12,9 @@
      </text>

      <line x1={gutterX} y1={54} x2={gutterX} y2={startY + (lines.length - 1) * gap + 10} opacity={0.3} />

      {lines.map((line, i) => (
        <g key={i}>
          <text
            x="34"
            y={startY + i * gap + 4}
            fontSize="13"
            fill="currentColor"
            stroke="none"
            opacity={line.mark ? 0.95 : 0.4}
          >
            {line.mark ?? ""}
          </text>
          <line
            x1={gutterX + 12}
            y1={startY + i * gap}
            x2={gutterX + 12 + line.w}
            y2={startY + i * gap}
            opacity={line.mark ? 0.8 : 0.32}
            strokeWidth={line.mark ? 1.4 : 1}
          />
        </g>
      ))}
    </svg>
  );
}

function Manuscript() {
  const blocks = [
    { y: 46, w: 296, h: 9 },
    { y: 64, w: 340, h: 9 },
    { y: 82, w: 312, h: 9 },
    { y: 100, w: 180, h: 9 },
    { y: 128, w: 340, h: 9 },
    { y: 146, w: 320, h: 9 },
    { y: 164, w: 288, h: 9 },
    { y: 182, w: 230, h: 9 },
    { y: 210, w: 340, h: 9 },
    { y: 228, w: 268, h: 9 },
    { y: 246, w: 306, h: 9 },
  ];
  const left = 66;
  return (
    <svg {...commonProps} aria-hidden="true">
      <Frame />
      <rect x={left - 22} y="34" width="358" height="238" opacity={0.4} />
      {/* margin rule */}
      <line x1={left} y1="34" x2={left} y2="272" opacity={0.35} />
      {blocks.map((b, i) => (
        <rect key={i} x={left + 4} y={b.y} width={b.w} height={b.h} opacity={0.32} fill="currentColor" stroke="none" />
      ))}
      {/* seal */}
      <g opacity={0.6}>
        <circle cx="380" cy="248" r="16" />
        <circle cx="380" cy="248" r="10" opacity={0.6} />
      </g>
    </svg>
  );
}

function Chart() {
  const bars = [58, 104, 78, 142, 96, 160, 122, 178];
  const barWidth = 30;
  const gap = 14;
  const baseline = 252;
  const points = bars.map((h, i) => [58 + i * (barWidth + gap) + barWidth / 2, baseline - h] as const);
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  return (
    <svg {...commonProps} aria-hidden="true">
      <Frame />
      <line x1="46" y1={baseline} x2="440" y2={baseline} opacity={0.55} />
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="46" y1={baseline - 190 * f} x2="440" y2={baseline - 190 * f} opacity={0.15} />
      ))}
      {bars.map((h, i) => (
        <rect
          key={i}
          x={58 + i * (barWidth + gap)}
          y={baseline - h}
          width={barWidth}
          height={h}
          opacity={0.26}
          fill="currentColor"
          stroke="none"
        />
      ))}
      <path d={path} opacity={0.85} strokeWidth={1.4} />
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
