const rows: [string, string, string][] = [
  ["Do you have that shit?", "✓ Yes", "✗ No"],
  ["Problems solved", "0", "0"],
  ["Feeling of having done something", "✓ Strong", "✗ None"],
  ["Free shipping", "✓ To Ohio", "N/A (nothing to ship)"],
  ["Regret", "Some", "A different kind"],
  ["Sticker", "✓ Included", "✗ Stickerless"],
  ["Peace of mind", "Pending", "Also pending"],
  ["Backed by science", "Science-adjacent", "Backed by nothing"],
  ["Something to blame", "✓ The shit", "✗ Just you"],
];

export function Comparison() {
  return (
    <section className="border-b-[3px] border-ink bg-cream py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <span className="eyebrow">Side by side</span>
        <h2 className="h2 mt-4">
          That shit vs.
          <br />
          <span className="text-urgent">not ordering that shit</span>
        </h2>
        <div className="card mt-10 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="bg-ink font-display text-xs uppercase tracking-wider text-paper">
                <th className="px-5 py-4">Feature</th>
                <th className="bg-tv px-5 py-4 text-ink">Order that shit</th>
                <th className="px-5 py-4 text-paper/70">Don't</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([f, a, b], i) => (
                <tr key={f} className={i % 2 ? "bg-white" : "bg-paper"}>
                  <td className="px-5 py-3 font-semibold">{f}</td>
                  <td className="px-5 py-3 font-bold text-cash">{a}</td>
                  <td className="px-5 py-3 text-ink/60">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="fine mt-3">
          Comparison prepared by an independent third party (our cousin). Both columns were given
          equal opportunity to order that shit. Only one did.
        </p>
      </div>
    </section>
  );
}
