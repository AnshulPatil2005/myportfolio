export default function RadarSweep({ className = "" }: { className?: string }) {
  return (
    <div className={`shrink-0 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        width="110"
        height="110"
      >
        {/* Outer ring */}
        <circle cx="60" cy="60" r="57" fill="none" stroke="#ffb000" strokeWidth="0.6" strokeOpacity="0.25" />

        {/* Concentric rings */}
        <circle cx="60" cy="60" r="38" fill="none" stroke="#ffb000" strokeWidth="0.4" strokeOpacity="0.12" />
        <circle cx="60" cy="60" r="19" fill="none" stroke="#ffb000" strokeWidth="0.4" strokeOpacity="0.12" />

        {/* Cross hairs */}
        <line x1="60" y1="3" x2="60" y2="117" stroke="#ffb000" strokeWidth="0.3" strokeOpacity="0.1" />
        <line x1="3" y1="60" x2="117" y2="60" stroke="#ffb000" strokeWidth="0.3" strokeOpacity="0.1" />
        <line x1="19.7" y1="19.7" x2="100.3" y2="100.3" stroke="#ffb000" strokeWidth="0.3" strokeOpacity="0.06" />
        <line x1="100.3" y1="19.7" x2="19.7" y2="100.3" stroke="#ffb000" strokeWidth="0.3" strokeOpacity="0.06" />

        {/* Rotating sweep group */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="4s"
            repeatCount="indefinite"
          />
          {/* Trailing sector — 90° fade behind the sweep line */}
          <path d="M60,60 L60,3 A57,57 0 0,0 3,60 Z" fill="#ffb000" fillOpacity="0.055" />
          <path d="M60,60 L60,3 A57,57 0 0,0 30,8.4 Z" fill="#ffb000" fillOpacity="0.05" />
          {/* Sweep line */}
          <line
            x1="60" y1="60" x2="60" y2="3"
            stroke="#ffb000"
            strokeWidth="1.2"
            strokeOpacity="0.9"
            strokeLinecap="round"
          />
          {/* Bright dot at tip */}
          <circle cx="60" cy="4.5" r="1.8" fill="#ffb000" fillOpacity="0.9" />
        </g>

        {/* Blip dots — positions hand-tuned to look organic */}
        <circle cx="83" cy="33" r="1.8" fill="#ffb000">
          <animate attributeName="fill-opacity" values="0.7;0.08;0.7" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="38" cy="78" r="1.4" fill="#ffb000">
          <animate attributeName="fill-opacity" values="0.5;0.05;0.5" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="73" cy="90" r="1.2" fill="#ffb000">
          <animate attributeName="fill-opacity" values="0.55;0.06;0.55" dur="2.0s" repeatCount="indefinite" />
        </circle>
        <circle cx="26" cy="45" r="1.0" fill="#ffb000">
          <animate attributeName="fill-opacity" values="0.4;0.04;0.4" dur="3.8s" repeatCount="indefinite" />
        </circle>

        {/* Center dot */}
        <circle cx="60" cy="60" r="2" fill="#ffb000" fillOpacity="0.5" />
      </svg>
    </div>
  );
}
