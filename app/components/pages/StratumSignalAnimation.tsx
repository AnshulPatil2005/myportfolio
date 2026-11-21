const modules = [
  { name: "auth",   risk: 0.92 },
  { name: "api",    risk: 0.64 },
  { name: "billing",risk: 0.78 },
  { name: "worker", risk: 0.38 },
  { name: "db",     risk: 0.70 },
  { name: "tests",  risk: 0.28 },
  { name: "deploy", risk: 0.55 },
  { name: "config", risk: 0.82 },
];

const timeline = [
  { label: "PR #482",    detail: "auth refactor", hot: false },
  { label: "deploy",     detail: "batch release", hot: false },
  { label: "prod error", detail: "Sentry alert",  hot: true  },
  { label: "root cause", detail: "auth.py:L214",  hot: true  },
];

// Risk reads as ink density: the riskier the module, the darker its bar.
function riskFill(risk: number) {
  if (risk > 0.8) return "bg-fg/80";
  if (risk > 0.6) return "bg-fg/60";
  if (risk > 0.4) return "bg-fg/40";
  return "bg-fg/20";
}

function Figure({ kicker, title, aside, children }: { kicker: string; title: string; aside: string; children: React.ReactNode }) {
  return (
    <figure className="border border-line p-5 text-left">
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <div>
          <p className="font-mono text-meta text-muted">{kicker}</p>
          <h4 className="mt-1 text-lead leading-tight text-fg">{title}</h4>
        </div>
        <span className="font-mono text-meta text-muted">{aside}</span>
      </div>
      {children}
    </figure>
  );
}

function DriftHeatmap() {
  return (
    <Figure kicker="architecture drift" title="Risk by module" aside="live">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line">
        {modules.map((item) => (
          <div key={item.name} className="relative min-h-[76px] bg-page p-2.5 overflow-hidden">
            <div
              aria-hidden="true"
              className={`absolute bottom-0 left-0 right-0 ${riskFill(item.risk)}`}
              style={{ height: `${Math.round(item.risk * 62)}%` }}
            />
            <div className="relative z-10 font-mono text-meta">
              {/* labels sit on a paper chip so they stay legible over dark bars */}
              <p>
                <span className="bg-page text-fg px-0.5">{item.name}</span>
              </p>
              <p className="mt-0.5">
                <span className="bg-page text-muted px-0.5">{Math.round(item.risk * 100)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 font-mono text-meta text-muted text-right">
        hotspots before refactor debt compounds
      </p>
    </Figure>
  );
}

function IncidentTimeline() {
  return (
    <Figure kicker="incident correlation" title="Errors traced to commits" aside="score 86">
      <ol className="relative grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-5">
        {/* track */}
        <span aria-hidden="true" className="hidden sm:block absolute left-0 right-0 top-[7px] h-px bg-line" />
        {timeline.map((event) => (
          <li key={event.label} className="relative pt-6">
            <span
              aria-hidden="true"
              className={`absolute top-0 left-0 h-[15px] w-[15px] rounded-full border ${
                event.hot ? "bg-fg border-fg" : "bg-page border-muted"
              }`}
            />
            <p className="font-mono text-meta text-fg">{event.label}</p>
            <p className="mt-0.5 text-small text-muted">{event.detail}</p>
          </li>
        ))}
      </ol>

      {/* Root cause callout */}
      <div className="mt-6 border-l-2 border-fg pl-3">
        <p className="font-mono text-meta text-fg">candidate root cause</p>
        <p className="mt-0.5 text-small text-muted">
          Stack trace + PR risk + module drift all point to the auth refactor.
        </p>
      </div>
    </Figure>
  );
}

export default function StratumSignalAnimation() {
  return (
    <div className="mb-10 grid gap-5 text-left">
      <DriftHeatmap />
      <IncidentTimeline />
    </div>
  );
}
