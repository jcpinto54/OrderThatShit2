function Bars({
  title,
  caption,
  data,
  max,
  color = "fill-ink",
}: {
  title: string;
  caption: string;
  data: { label: string; value: number; display?: string }[];
  max: number;
  color?: string;
}) {
  const w = 320;
  const h = 200;
  const pad = 36;
  const bw = (w - pad * 2) / data.length;
  return (
    <figure className="card p-5">
      <figcaption className="font-display text-sm uppercase">{title}</figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full" role="img" aria-label={`${title}. ${caption}`}>
        <line x1={pad} y1={h - pad} x2={w - pad / 2} y2={h - pad} className="stroke-ink" strokeWidth="2" />
        <line x1={pad} y1={16} x2={pad} y2={h - pad} className="stroke-ink" strokeWidth="2" />
        {data.map((d, i) => {
          const bh = Math.max(4, ((h - pad - 24) * d.value) / max);
          const x = pad + i * bw + bw * 0.2;
          const y = h - pad - bh;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={bw * 0.6} height={bh} className={color} />
              <rect x={x} y={y} width={bw * 0.6} height={bh} fill="none" className="stroke-ink" strokeWidth="2" />
              <text
                x={x + bw * 0.3}
                y={y - 6}
                textAnchor="middle"
                className="fill-ink font-display"
                fontSize="14"
              >
                {d.display ?? d.value}
              </text>
              <text
                x={x + bw * 0.3}
                y={h - pad + 16}
                textAnchor="middle"
                className="fill-ink/70"
                fontSize="10"
                fontWeight="700"
              >
                {d.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="fine mt-2">{caption}</p>
    </figure>
  );
}

function Correlation() {
  const w = 320;
  const h = 200;
  const pad = 36;
  const pts = Array.from({ length: 14 }, (_, i) => {
    const t = i / 13;
    return [pad + t * (w - pad * 1.5), h - pad - t * (h - pad - 24)] as const;
  });
  return (
    <figure className="card p-5">
      <figcaption className="font-display text-sm uppercase">
        Ordering that shit vs. having ordered that shit
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full" role="img" aria-label="A perfect diagonal line. r equals 1.00.">
        <line x1={pad} y1={h - pad} x2={w - pad / 2} y2={h - pad} className="stroke-ink" strokeWidth="2" />
        <line x1={pad} y1={16} x2={pad} y2={h - pad} className="stroke-ink" strokeWidth="2" />
        <polyline
          points={pts.map((p) => p.join(",")).join(" ")}
          fill="none"
          className="stroke-urgent"
          strokeWidth="3"
          strokeDasharray="6 4"
        />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" className="fill-tv stroke-ink" strokeWidth="2" />
        ))}
        <text x={w - pad / 2} y={h - pad + 16} textAnchor="end" className="fill-ink/70" fontSize="10" fontWeight="700">
          ORDERED THAT SHIT →
        </text>
        <text
          x={pad - 8}
          y={20}
          textAnchor="end"
          className="fill-ink/70"
          fontSize="10"
          fontWeight="700"
          transform={`rotate(-90 ${pad - 8} 20)`}
        >
          HAS THAT SHIT →
        </text>
        <text x={pad + 10} y={30} className="fill-ink font-display" fontSize="16">
          r = 1.00
        </text>
      </svg>
      <p className="fine mt-2">
        The strongest correlation ever recorded by us. Peer reviewed by our peers, who also ordered
        that shit.
      </p>
    </figure>
  );
}

const badges = [
  { icon: "🧪", title: "Clinically tested", sub: "in a clinic's parking lot" },
  { icon: "📄", title: "Peer reviewed", sub: "by our peers (they ordered it)" },
  { icon: "🏛️", title: "FDA notified", sub: "they have not replied" },
  { icon: "🔬", title: "Double-blind", sub: "nobody knew what was going on" },
];

export function Science() {
  return (
    <section id="science" className="border-b-[3px] border-ink bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <span className="eyebrow">The Science™</span>
        <h2 className="h2 mt-4">
          We ran the numbers.
          <br />
          <span className="text-urgent">Then we ran from them.</span>
        </h2>
        <p className="lede">
          Our research department (a spreadsheet) has confirmed what millions of orderers already
          knew: nothing changes, and yet, something is different. There is a box now.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Bars
            title="Problems before vs. after"
            caption="Statistically identical. But look at the next chart."
            max={8}
            data={[
              { label: "Before", value: 7 },
              { label: "After", value: 7 },
            ]}
          />
          <Bars
            title="Shit owned before vs. after"
            caption="A 100% increase. Infinite, technically. Math is on our side."
            max={1.2}
            color="fill-cardboard"
            data={[
              { label: "Before", value: 0 },
              { label: "After", value: 1 },
            ]}
          />
          <Correlation />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="card bg-ink p-6 text-paper sm:p-8">
            <div className="font-display text-xs uppercase tracking-[0.25em] text-tv">
              Published study · Journal of That Shit, Vol. 1, Issue 1 (only issue)
            </div>
            <h3 className="mt-3 font-display text-2xl uppercase leading-tight">
              Effects of ordering that shit on the ordering of that shit: a longitudinal study
            </h3>
            <p className="mt-4 text-paper/75">
              <strong className="text-paper">Method:</strong> participants (n&nbsp;=&nbsp;3, one was a
              dog) were asked to order that shit. <strong className="text-paper">Results:</strong> all
              participants ordered that shit. <strong className="text-paper">Conclusion:</strong>{" "}
              inconclusive, but the vibes were strong and the dog seemed fine.
            </p>
            <p className="fine mt-4 text-paper/50">
              Conflicts of interest: all of them. Funding: the participants, via ordering that shit.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-4">
            {badges.map((b) => (
              <li key={b.title} className="card flex flex-col items-start p-4">
                <span className="text-2xl">{b.icon}</span>
                <span className="mt-2 font-display text-sm uppercase leading-tight">{b.title}</span>
                <span className="fine">{b.sub}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
