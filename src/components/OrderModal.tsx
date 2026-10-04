import { useEffect, useRef, useState, type FormEvent } from "react";
import confetti from "canvas-confetti";
import { Modal } from "./Modal";
import { Receipt } from "./Receipt";
import { useOrders } from "@/lib/orders";
import { orderPlaceholders, processingSteps } from "@/data/misc";
import { authorizationSteps, deliberations, nudges } from "@/data/authorization";
import { authorize, type Authorization } from "@/lib/authorization";
import { renderReceiptPng, shareImage } from "@/lib/receiptImage";
import { orderNumber, pick, shuffle } from "@/lib/random";
import { isBlackFridayWeek } from "@/lib/season";
import { certificateShareUrl, shareLink } from "@/lib/share";

type Step = "ask" | "processing" | "done";
type Shared = "idle" | "copied" | "downloaded" | "shared";

const againLines = [
  "Again? Respect.",
  "Back so soon. Still not fixed?",
  "Third time's the shit.",
  "At this point it's a lifestyle.",
  "We've named a warehouse after you.",
];

export function OrderModal() {
  const { isOpen, close, prefill, recordOrder, count } = useOrders();
  const [step, setStep] = useState<Step>("ask");
  const [item, setItem] = useState("");
  const [waited, setWaited] = useState("weeks");
  const [mood, setMood] = useState(4);
  const [stamped, setStamped] = useState(false);
  const [placeholder, setPlaceholder] = useState(orderPlaceholders[0]!);
  const [steps, setSteps] = useState<string[]>([]);
  const [done, setDone] = useState(0);
  const [auth, setAuth] = useState<Authorization | null>(null);
  const [png, setPng] = useState<Blob | null>(null);
  const [shared, setShared] = useState<Shared>("idle");
  const orderedCount = useRef(0);
  const latest = useRef({ prefill, count });
  latest.current = { prefill, count };

  // Reset only on open. Reading prefill/count through a ref keeps a completed
  // order (which bumps `count`) from bouncing the modal back to step one.
  useEffect(() => {
    if (!isOpen) return;
    setStep("ask");
    setItem(latest.current.prefill);
    setShared("idle");
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
        const a = authorize(item.trim() || "that shit", waited, orderNumber(), new Date(), isBlackFridayWeek(), mood);
        setAuth(a);
        setPng(null);
        // Approvals wait for the visitor to stamp them: closing the decision is their move.
        setStamped(a.verdict.kind !== "approved");
        recordOrder(a.item);
        setStep("done");
      }, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), 550 + Math.random() * 400);
    return () => clearTimeout(t);
  }, [step, done, steps.length, item, waited, mood, recordOrder]);

  const stamp = () => {
    setStamped(true);
    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ffd400", "#ff2d20", "#16c172", "#c8944a", "#fff8e7"],
      zIndex: 200,
    });
  };

  // Draw the shareable receipt as soon as it exists, so the share button can hand it to
  // the share sheet without awaiting anything (Safari only allows share() straight off a tap).
  useEffect(() => {
    if (!auth || auth.verdict.kind === "crisis") return;
    let live = true;
    renderReceiptPng(auth)
      .then((b) => live && setPng(b))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [auth]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSteps(shuffle([...authorizationSteps, ...processingSteps]).slice(0, 5));
    setDone(0);
    setShared("idle");
    setStep("processing");
  };

  const flash = (s: Shared) => {
    setShared(s);
    setTimeout(() => setShared("idle"), 3000);
  };

  const shareText = (a: Authorization) =>
    a.verdict.kind === "approved"
      ? `Officially approved to order ${a.item}. Mood: ${a.moodBefore}/10 → ${a.moodAfter}/10.`
      : `orderthatshit.com denied my order for ${a.item}. ${a.verdict.kind === "denied" ? a.verdict.reason : ""}`;

  const shareReceipt = async () => {
    if (!auth || !png) return;
    const url = certificateShareUrl(auth.item);
    const result = await shareImage(png, `order-${auth.orderNo}.png`, `${shareText(auth)} ${url}`);
    if (result !== "cancelled") flash(result);
  };

  const copyLink = async () => {
    if (!auth) return;
    const toClipboard = await shareLink(shareText(auth), certificateShareUrl(auth.item));
    if (toClipboard) flash("copied");
  };

  const label = item.trim() || "that shit";
  const priorOrders = orderedCount.current;
  const options = deliberations();

  return (
    <Modal open={isOpen} onClose={close} label="Order that shit">
      {step === "ask" && (
        <form onSubmit={submit}>
          <span className="eyebrow">Step 1 of 1</span>
          <h2 className="mt-4 font-display text-3xl uppercase leading-none sm:text-4xl">
            {priorOrders > 0 ? againLines[Math.min(priorOrders - 1, againLines.length - 1)] : "What shit do you want to order?"}
          </h2>
          <p className="mt-3 text-ink/70">
            The thing you keep thinking about. Be specific. Be vague. Be honest. It all ships in
            the same box.
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

          <fieldset className="mt-5">
            <legend className="text-sm font-bold">How long has it been in your head?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {options.map((o) => (
                <label
                  key={o.id}
                  className={`cursor-pointer border-2 px-3 py-1 text-sm font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-urgent ${
                    waited === o.id ? "border-ink bg-tv" : "border-ink/30 bg-white hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="waited"
                    value={o.id}
                    checked={waited === o.id}
                    onChange={() => setWaited(o.id)}
                    className="sr-only"
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <label htmlFor="mood" className="flex items-baseline justify-between text-sm font-bold">
              <span>How do you feel right now?</span>
              <span className="font-mono">{mood}/10</span>
            </label>
            <input
              id="mood"
              type="range"
              min={1}
              max={10}
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="mt-2 w-full accent-urgent"
            />
            <div className="flex justify-between text-xs text-ink/50" aria-hidden="true">
              <span>Bad</span>
              <span>Fine, actually</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink/60 sm:grid-cols-4">
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

      {step === "done" && auth?.verdict.kind === "crisis" && (
        <div>
          <span className="eyebrow !bg-paper">Hey</span>
          <h2 className="mt-4 font-display text-3xl uppercase leading-none">
            We can't joke about this one.
          </h2>
          <p className="mt-4 text-ink/80">
            If you're thinking about hurting yourself, please talk to someone today. There is free,
            confidential support in almost every country, and you can find yours at{" "}
            <a className="font-bold underline" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">
              findahelpline.com
            </a>
            . If you're in immediate danger, call your local emergency number.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn-primary" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">
              Find a helpline
            </a>
            <button type="button" onClick={close} className="btn-ghost">
              Close
            </button>
          </div>
        </div>
      )}

      {step === "done" && auth && auth.verdict.kind !== "crisis" && (
        <div>
          {auth.verdict.kind === "approved" ? (
            <>
              <span className="eyebrow !bg-cash">Confirmed</span>
              <h2 className="mt-4 font-display text-3xl uppercase leading-none sm:text-4xl">
                You ordered that shit.
              </h2>
              <p className="mt-3 text-ink/75">
                Your “{auth.item}” has been officially approved. It will arrive in 3–5 business days
                and also never. Nothing has been charged. The good feeling is real, though.
              </p>
            </>
          ) : (
            <>
              <span className="eyebrow !bg-urgent !text-white">Denied</span>
              <h2 className="mt-4 font-display text-3xl uppercase leading-none sm:text-4xl">
                Order denied.
              </h2>
              <p className="mt-3 text-ink/75">
                We approve almost anything. Not this. Not today.
              </p>
            </>
          )}

          <div className="mt-6">
            <Receipt a={auth} stamped={stamped} />
          </div>

          {!stamped ? (
            <div className="mt-6">
              <button type="button" onClick={stamp} className="btn-primary w-full text-lg">
                Stamp it. It's decided. ✓
              </button>
              <p className="fine mt-2 text-center">Deciding is the part that makes you feel better. So you do the stamping.</p>
            </div>
          ) : (
            <>
              {auth.verdict.kind === "approved" && (
                <p className="mt-5 border-l-4 border-tv pl-3 font-semibold">
                  {nudges[auth.deliberation.id]}
                </p>
              )}

              <p className="mt-6 text-sm font-bold">
                Send it to the friend who's been “thinking about it” since March.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" onClick={shareReceipt} disabled={!png} className="btn-primary">
                  {shared === "shared"
                    ? "Sent. Nice."
                    : shared === "downloaded"
                      ? "Saved. Go post it."
                      : "Share your receipt"}
                </button>
                <button type="button" onClick={copyLink} className="btn-ghost">
                  {shared === "copied" ? "Copied. Go tell someone." : "Copy link"}
                </button>
                <button type="button" onClick={close} className="btn-ghost">
                  Done. I feel better.
                </button>
              </div>
              <p className="fine mt-3">
                ✓ Lifetime orders: {count}. The receipt is drawn on your device and shared from it;
                we never see it.{" "}
                <button type="button" onClick={() => setStep("ask")} className="underline">
                  Order more shit
                </button>
              </p>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
