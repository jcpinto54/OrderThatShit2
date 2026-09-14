export function ProductBox({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="A cardboard box labelled THAT SHIT, fragile (emotionally)"
    >
      <ellipse cx="160" cy="292" rx="125" ry="16" className="fill-ink/25" />
      {/* top */}
      <polygon points="60,110 160,60 260,110 160,160" className="fill-cardboard-light" />
      <polygon points="60,110 160,60 260,110 160,160" fill="none" className="stroke-ink" strokeWidth="3" strokeLinejoin="round" />
      {/* flap seam + tape */}
      <line x1="60" y1="110" x2="260" y2="110" className="stroke-cardboard-dark" strokeWidth="2" strokeDasharray="4 4" />
      <polygon points="152,64 168,56 268,106 252,114" className="fill-paper/85" />
      <polygon points="52,106 68,114 168,164 152,156" className="fill-paper/85" opacity="0" />
      {/* front (left) face */}
      <polygon points="60,110 160,160 160,280 60,230" className="fill-cardboard" />
      <polygon points="60,110 160,160 160,280 60,230" fill="none" className="stroke-ink" strokeWidth="3" strokeLinejoin="round" />
      {/* right face */}
      <polygon points="160,160 260,110 260,230 160,280" className="fill-cardboard-dark" />
      <polygon points="160,160 260,110 260,230 160,280" fill="none" className="stroke-ink" strokeWidth="3" strokeLinejoin="round" />

      {/* front face text (skewed to follow the face) */}
      <g transform="translate(72,178) skewY(26.565)">
        <text fontFamily="Archivo Black, Impact, sans-serif" fontSize="27" className="fill-cardboard-ink">
          THAT
        </text>
        <text y="30" fontFamily="Archivo Black, Impact, sans-serif" fontSize="27" className="fill-cardboard-ink">
          SHIT
        </text>
        <text y="52" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="8.5" className="fill-cardboard-ink">
          FRAGILE (EMOTIONALLY)
        </text>
        <rect x="0" y="60" width="76" height="12" className="fill-cardboard-ink" />
        <text x="3" y="69" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="8" className="fill-cardboard-light">
          CONTENTS: SHIT
        </text>
      </g>

      {/* right face label */}
      <g transform="translate(176,202) skewY(-26.565)">
        <rect x="0" y="-16" width="68" height="46" className="fill-paper stroke-ink" strokeWidth="1.5" />
        <text x="4" y="-6" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="6.5" className="fill-ink">
          SHIP TO:
        </text>
        <text x="4" y="3" fontFamily="Inter, sans-serif" fontSize="6.5" className="fill-ink">
          YOU (PROBABLY)
        </text>
        <text x="4" y="12" fontFamily="Inter, sans-serif" fontSize="6.5" className="fill-ink">
          SOMEWHERE WITH
        </text>
        <text x="4" y="21" fontFamily="Inter, sans-serif" fontSize="6.5" className="fill-ink">
          PROBLEMS
        </text>
        {/* barcode */}
        <g transform="translate(4,24)">
          {[1, 2, 1, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 1].map((w, i, arr) => {
            const x = arr.slice(0, i).reduce((a, b) => a + b + 1, 0);
            return <rect key={i} x={x} y="0" width={w} height="4" className="fill-ink" />;
          })}
        </g>
        <text x="4" y="44" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="6" className="fill-ink">
          ↑ THIS SIDE UP (OR DON'T)
        </text>
      </g>
    </svg>
  );
}
