import { useEffect, useRef, useState, type FormEvent } from "react";
import confetti from "canvas-confetti";
import { Modal } from "./Modal";
import { useOrders } from "@/lib/orders";
import { orderPlaceholders, processingSteps } from "@/data/misc";
import { orderNumber, pick, shuffle } from "@/lib/random";

type Step = "ask" | "processing" | "done";

const againLines = [
  "Again? Respect.",
  "Back so soon. Still not fixed?",
  "Third time's the shit.",
  "At this point it's a lifestyle.",
  "We've named a warehouse after you.",
];

function certificateBlurb(item: string) {
  const lines = [
    `has ordered that shit. Specifically: “${item}.”`,
    `Problems remain unchanged. Shit acquired.`,
  ];
  return lines;
}

export function OrderModal() {
  const { isOpen, close, prefill, recordOrder, count } = useOrders();
  const [step, setStep] = useState<Step>("ask");
  const [item, setItem] = useState("");
  const [placeholder, setPlaceholder] = useState(orderPlaceholders[0]!);
  const [steps, setSteps] = useState<string[]>([]);
  const [done, setDone] = useState(0);
  const [orderNo, setOrderNo] = useState("");
  const [copied, setCopied] = useState(false);
  const orderedCount = useRef(0);
  const latest = useRef({ prefill, count });
  latest.current = { prefill, count };

  // Reset only on open. Reading prefill/count through a ref keeps a completed
  // order (which bumps `count`) from bouncing the modal back to step one.
  useEffect(() => {
    if (!isOpen) return;
    setStep("ask");
    setItem(latest.current.prefill);
    setCopied(false);
    orderedCount.current = latest.current.count;
  }, [isOpen]);

  // cycle placeholder
  useEffect(() => {
    if (!isOpen || step !== "ask") return;
    const id = setInterval(() => setPlaceholder(pick(orderPlaceholders)), 1800);
    return () => clearInterval(id);
  }, [isOpen, step]);

  // processing steps
  useEffect(() => {
    if (step !== "processing") return;
    if (done >= steps.length) {
      const t = setTimeout(() => {
        setOrderNo(orderNumber());
        recordOrder(item.trim() || "that shit");
        setStep("done");
        confetti({
          particleCount: 160,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#ffd400", "#ff2d20", "#16c172", "#c8944a", "#fff8e7"],
          zIndex: 200,
        });
      }, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), 550 + Math.random() * 400);
    return () => clearTimeout(t);
  }, [step, done, steps.length, item, recordOrder]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSteps(shuffle(processingSteps).slice(0, 5));
    setDone(0);
    setStep("processing");
  };

  const share = async () => {
    const text = `I just ordered that shit → https://orderthatshit.com\nMy problems are still here, but so is that shit.`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* user bailed; respect it */
    }
  };

  const label = item.trim() || "that shit";
  const priorOrders = orderedCount.current;

  return (
    <Modal open={isOpen} onClose={close} label="Order that shit">
      {step === "ask" && (
        <form onSubmit={submit}>
          <span className="eyebrow">Step 1 of 1</span>
          <h2 className="mt-4 font-display text-3xl uppercase leading-none sm:text-4xl">
            {priorOrders > 0 ? againLines[Math.min(priorOrders - 1, againLines.length - 1)] : "What shit do you want to order?"}
          </h2>
          <p className="mt-3 text-ink/70">
            Be specific. Be vague. Be honest. It all ships in the same box.
          </p>
          <label htmlFor="item" className="sr-only">
            What shit do you want to order?
          </label>
          <input
            id="item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder={placeholder}
            maxLength={80}
            autoComplete="off"
            className="mt-6 w-full border-[3px] border-ink bg-white px-4 py-3 text-lg focus:border-urgent focus:outline-none"
          />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink/60 sm:grid-cols-4">
            <span>📦 Ships in 3–5 days†</span>
            <span>🔒 Secure (a lock emoji)</span>
            <span>↩️ No returns</span>
            <span>💳 $0.00 charged</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary">
              Order that shit →
            </button>
            <button type="button" onClick={close} className="btn-ghost">
              I'll suffer instead
            </button>
          </div>
          <p className="fine mt-4">
            †Or never. By ordering you agree to nothing, which is also what you'll receive. This is
            a parody. No money, no shipping, no shit. Just the feeling.
          </p>
        </form>
      )}

      {step === "processing" && (
        <div>
          <span className="eyebrow">Processing</span>
          <h2 className="mt-4 font-display text-3xl uppercase leading-none">Ordering {label}…</h2>
          <ul className="mt-6 space-y-2 font-mono text-sm" aria-live="polite">
            {steps.slice(0, Math.min(done + 1, steps.length)).map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className={i < done ? "text-cash" : "animate-blink text-urgent"}>
                  {i < done ? "✔" : "▶"}
                </span>
                <span className={i < done ? "text-ink/50" : ""}>{s}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 h-3 w-full border-2 border-ink bg-white">
            <div
              className="h-full bg-cash transition-all duration-500"
              style={{ width: `${Math.min(100, (done / steps.length) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {step === "done" && (
        <div>
          <span className="eyebrow !bg-cash">Confirmed</span>
          <h2 className="mt-4 font-display text-3xl uppercase leading-none sm:text-4xl">
            You ordered that shit.
          </h2>
          <p className="mt-3 text-ink/75">
            Order <span className="font-mono font-bold text-ink">{orderNo}</span>. Your “{label}” will
            arrive in 3–5 business days and also never. Nothing has been ordered. You're welcome.
          </p>

          <div className="mt-6 border-[3px] border-double border-ink bg-white p-5 text-center shadow-hard-sm">
            <div className="font-display text-[10px] uppercase tracking-[0.35em] text-ink/50">
              Certificate of having ordered that shit
            </div>
            <div className="mt-2 font-display text-lg uppercase">This certifies that the bearer</div>
            {certificateBlurb(label).map((l) => (
              <p key={l} className="mt-1 text-sm text-ink/70">
                {l}
              </p>
            ))}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-ink/50">
              <span>Signed,</span>
              <span className="font-display text-base">The Shit</span>
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-widest text-cash">
              ✓ Lifetime orders: {count}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setStep("ask")} className="btn-primary">
              Order more shit
            </button>
            <button type="button" onClick={share} className="btn-ghost">
              {copied ? "Copied. Go tell someone." : "Share your achievement"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
