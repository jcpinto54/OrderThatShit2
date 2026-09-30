import { barcode, formatIssued, type Authorization } from "@/lib/authorization";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="shrink-0 uppercase">{label}</span>
      <span className="min-w-4 flex-1 translate-y-[-3px] border-b-2 border-dotted border-ink/25" />
      <span className="shrink-0 text-right font-bold">{children}</span>
    </div>
  );
}

function Mood({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex gap-[2px]" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`h-3 w-1.5 sm:w-2 ${i < score ? "bg-ink" : "bg-ink/15"}`} />
        ))}
      </span>
      {score}/10
    </span>
  );
}

/**
 * The Order Authorization, as printed in the checkout. receiptImage.ts draws the same thing for
 * sharing. An approval waits for the visitor to stamp it themselves (`stamped`); a denial
 * arrives stamped.
 */
export function Receipt({ a, stamped = true }: { a: Authorization; stamped?: boolean }) {
  const approved = a.verdict.kind === "approved";
  return (
    <div className="relative border-[3px] border-ink bg-white px-5 py-6 font-mono text-[13px] leading-relaxed text-ink shadow-hard-sm sm:px-7 sm:text-sm">
      <div className="text-center">
        <div className="font-display text-2xl uppercase leading-none">Order That Shit™</div>
        <div className="mt-2 font-sans text-[11px] font-black uppercase tracking-[0.3em]">
          Order authorization
        </div>
        <div className="mt-1 text-[11px] text-ink/55">
          No. {a.orderNo} · {formatIssued(a.issuedAt)}
        </div>
        {a.edition && (
          <div className="mt-2 inline-block bg-ink px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-tv">
            {a.edition}
          </div>
        )}
      </div>

      <div className="my-4 border-t-2 border-dashed border-ink/40" />

      <div className="text-[11px] uppercase tracking-[0.25em] text-ink/55">Item</div>
      <div className="mt-1 break-words font-display text-xl uppercase leading-tight sm:text-2xl">
        {a.item}
      </div>

      <div className="mt-4 space-y-1">
        <Row label="In your head for">{a.deliberation.said}</Row>
        <Row label="Overthinking (unpaid)">{a.overthinking}</Row>
        <Row label="Mood before">
          <Mood score={a.moodBefore} />
        </Row>
        <Row label="Mood after">
          <Mood score={a.moodAfter} />
        </Row>
        <Row label="Problems solved">0</Row>
        <Row label="You are">{a.archetype}</Row>
      </div>

      <div className="my-4 border-t-2 border-dashed border-ink/40" />

      <div className="text-[11px] uppercase tracking-[0.25em] text-ink/55">
        {approved ? "Justification" : "Reason"}
      </div>
      <p className="mt-1 font-sans text-base font-bold leading-snug">
        {a.verdict.kind === "denied" ? a.verdict.reason : a.justification}
      </p>

      <div className="mt-5 flex min-h-16 items-center justify-center">
        {stamped ? (
          <span
            className={`animate-stamp -rotate-6 border-[5px] border-double px-4 py-1 font-display text-3xl uppercase tracking-wide sm:text-4xl ${
              approved ? "border-cash text-cash" : "border-urgent text-urgent"
            }`}
          >
            {a.verdict.kind === "approved" ? a.verdict.stamp : "Denied"}
          </span>
        ) : (
          <span className="border-2 border-dashed border-ink/30 px-6 py-3 text-xs uppercase tracking-[0.25em] text-ink/40">
            Stamp here
          </span>
        )}
      </div>

      <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-wider">
        {approved ? "Arrives in 3–5 business days of pure anticipation" : "Please try again after rent"}
      </p>

      <div className="mt-4 flex h-12 items-stretch justify-center gap-[2px]" aria-hidden="true">
        {barcode(a.orderNo).map((w, i) => (
          <span key={i} className={i % 2 ? "bg-transparent" : "bg-ink"} style={{ width: w * 1.5 }} />
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-ink/55">
        Legally meaningless. Emotionally binding. orderthatshit.com
      </p>
    </div>
  );
}
