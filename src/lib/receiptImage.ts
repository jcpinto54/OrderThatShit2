/**
 * Draws the Order Authorization as a 1080x1920 PNG (a phone screen, a Story, a Status),
 * so the funniest thing on the site can leave it with the visitor's own words on it.
 *
 * It is drawn in the visitor's browser and shared from their device, the same as a
 * screenshot: nothing is rendered or served by orderthatshit.com, so the rule in
 * src/lib/share.ts (typed text never goes into a preview card we serve) still holds.
 */
import { barcode, formatIssued, type Authorization } from "./authorization";

const W = 1080;
const H = 1920;
const INK = "#0b0b0f";
const PAPER = "#fff8e7";
const TV = "#ffd400";
const URGENT = "#ff2d20";
const CASH = "#16c172";
const DISPLAY = '"Archivo Black", Impact, "Arial Black", sans-serif';
const SANS = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, "Courier New", monospace';

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  // A single word wider than the line (a URL, a keyboard mash) gets cut rather than overflow.
  return lines.map((l) => {
    if (ctx.measureText(l).width <= maxWidth) return l;
    let cut = l;
    while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) cut = cut.slice(0, -1);
    return `${cut}…`;
  });
}

/** Largest font size (from `start` down to `min`) at which `text` fits in `maxLines` lines with no word overflowing. */
function fit(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, maxWidth: number, maxLines: number, start: number, min: number) {
  const fits = (px: number) => {
    ctx.font = font(px);
    const words = text.split(/\s+/).filter(Boolean);
    return words.every((w) => ctx.measureText(w).width <= maxWidth) && wrap(ctx, text, maxWidth).length <= maxLines;
  };
  let px = start;
  while (px > min && !fits(px)) px -= 2;
  ctx.font = font(px);
  const all = wrap(ctx, text, maxWidth);
  const lines = all.slice(0, maxLines);
  if (all.length > maxLines) {
    // Out of room: end the last line with an ellipsis instead of silently dropping words.
    let last = `${lines[maxLines - 1]}…`;
    while (last.length > 2 && ctx.measureText(last).width > maxWidth) last = `${last.slice(0, -2).trimEnd()}…`;
    lines[maxLines - 1] = last;
  }
  return { px, lines };
}

function dashed(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(11,11,15,.35)";
  ctx.lineWidth = 4;
  ctx.setLineDash([16, 12]);
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
  ctx.restore();
}

/** Zig-zag torn edge along y, teeth pointing `dir` (-1 up, 1 down). */
function tornEdge(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, dir: 1 | -1) {
  const tooth = 22;
  for (let x = x0; x < x1; x += tooth) {
    ctx.lineTo(Math.min(x + tooth / 2, x1), y + (dir * tooth) / 2);
    ctx.lineTo(Math.min(x + tooth, x1), y);
  }
}

export async function renderReceiptPng(a: Authorization): Promise<Blob> {
  await Promise.all([
    document.fonts.load(`80px "Archivo Black"`),
    document.fonts.load(`700 40px Inter`),
    document.fonts.load(`900 40px Inter`),
  ]).catch(() => undefined);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";

  // Paper and halftone, like the hero.
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(11,11,15,.08)";
  for (let y = 12; y < H; y += 24) for (let x = 12; x < W; x += 24) ctx.fillRect(x, y, 3, 3);

  // Hazard stripes, top and bottom.
  for (const y0 of [0, H - 36]) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y0, W, 36);
    ctx.clip();
    ctx.fillStyle = INK;
    ctx.fillRect(0, y0, W, 36);
    ctx.fillStyle = TV;
    for (let x = -60; x < W + 60; x += 56) {
      ctx.beginPath();
      ctx.moveTo(x, y0 + 36);
      ctx.lineTo(x + 28, y0 + 36);
      ctx.lineTo(x + 64, y0);
      ctx.lineTo(x + 36, y0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  const approved = a.verdict.kind === "approved";
  const RX = 120;
  const RW = W - RX * 2;
  const PAD = 64;
  const inner = RW - PAD * 2;
  const left = RX + PAD;
  const right = RX + RW - PAD;

  // Measure the variable parts first so the receipt can be sized and centred before drawing.
  const item = fit(ctx, a.item.toUpperCase(), (px) => `${px}px ${DISPLAY}`, inner, 3, 76, 40);
  const reasonText = a.verdict.kind === "denied" ? a.verdict.reason : a.justification;
  const reason = fit(ctx, reasonText, (px) => `800 ${px}px ${SANS}`, inner, 3, 44, 30);
  const itemH = item.lines.length * item.px * 1.02;
  const reasonH = reason.lines.length * reason.px * 1.22;
  const RH = 1346 + itemH + reasonH + (a.edition ? 50 : 0); // the fixed rows below add up to 1346px
  // Long items and long reasons make a tall receipt: shrink it to leave room for the sign-off.
  const fitScale = Math.min(1, (H - 140 - 210) / RH);
  const RY = Math.max(140, Math.round((H - RH * fitScale) / 2) - 60);

  ctx.save();
  ctx.translate(W / 2, RY + (RH * fitScale) / 2);
  ctx.rotate((-1.2 * Math.PI) / 180);
  ctx.scale(fitScale, fitScale);
  ctx.translate(-W / 2, -(RY + RH / 2));

  // Receipt paper with torn edges and a hard shadow.
  const paper = () => {
    ctx.beginPath();
    ctx.moveTo(RX, RY);
    tornEdge(ctx, RX, RX + RW, RY, -1);
    ctx.lineTo(RX + RW, RY + RH);
    // bottom edge, right to left
    const tooth = 22;
    for (let x = RX + RW; x > RX; x -= tooth) {
      ctx.lineTo(Math.max(x - tooth / 2, RX), RY + RH + tooth / 2);
      ctx.lineTo(Math.max(x - tooth, RX), RY + RH);
    }
    ctx.closePath();
  };
  ctx.save();
  ctx.translate(16, 16);
  paper();
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.restore();
  paper();
  ctx.fillStyle = "#fffdf7";
  ctx.fill();

  let y = RY + 96;
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.font = `64px ${DISPLAY}`;
  ctx.fillText("ORDER THAT SHIT™", W / 2, y);
  y += 56;
  ctx.font = `900 30px ${SANS}`;
  ctx.letterSpacing = "10px";
  ctx.fillText("ORDER AUTHORIZATION", W / 2 + 5, y);
  ctx.letterSpacing = "0px";
  y += 46;
  ctx.font = `500 26px ${MONO}`;
  ctx.fillStyle = "rgba(11,11,15,.6)";
  ctx.fillText(`No. ${a.orderNo} · ${formatIssued(a.issuedAt)}`, W / 2, y);
  if (a.edition) {
    y += 50;
    ctx.font = `900 24px ${SANS}`;
    const label = a.edition.toUpperCase();
    const lw = ctx.measureText(label).width + 28;
    ctx.fillStyle = INK;
    ctx.fillRect(W / 2 - lw / 2, y - 26, lw, 36);
    ctx.fillStyle = TV;
    ctx.fillText(label, W / 2, y);
  }

  y += 44;
  dashed(ctx, left, right, y);
  y += 60;

  ctx.textAlign = "left";
  ctx.font = `700 24px ${MONO}`;
  ctx.fillStyle = "rgba(11,11,15,.55)";
  ctx.fillText("ITEM", left, y);
  y += 16;
  ctx.fillStyle = INK;
  ctx.font = `${item.px}px ${DISPLAY}`;
  for (const line of item.lines) {
    y += item.px * 1.02;
    ctx.fillText(line, left, y);
  }
  y += 40;

  const row = (label: string, value: string | ((x: number, y: number) => void)) => {
    y += 58;
    ctx.font = `600 30px ${MONO}`;
    ctx.fillStyle = INK;
    ctx.textAlign = "left";
    ctx.fillText(label, left, y);
    const labelW = ctx.measureText(label).width;
    let valueW = 0;
    if (typeof value === "string") {
      ctx.font = `700 30px ${MONO}`;
      valueW = ctx.measureText(value).width;
      ctx.textAlign = "right";
      ctx.fillText(value, right, y);
      ctx.textAlign = "left";
    } else {
      valueW = 250;
      value(right - valueW, y);
    }
    // dotted leader
    ctx.fillStyle = "rgba(11,11,15,.25)";
    for (let x = left + labelW + 14; x < right - valueW - 14; x += 14) ctx.fillRect(x, y - 6, 4, 4);
  };
  const mood = (score: number) => (x: number, yy: number) => {
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i < score ? INK : "rgba(11,11,15,.15)";
      ctx.fillRect(x + i * 16, yy - 24, 11, 26);
    }
    ctx.fillStyle = INK;
    ctx.font = `700 30px ${MONO}`;
    ctx.textAlign = "right";
    ctx.fillText(`${score}/10`, right, yy);
    ctx.textAlign = "left";
  };
  row("IN YOUR HEAD FOR", a.deliberation.said);
  row("OVERTHINKING", a.overthinking);
  row("MOOD BEFORE", mood(a.moodBefore));
  row("MOOD AFTER", mood(a.moodAfter));
  row("PROBLEMS SOLVED", "0");
  row("YOU ARE", a.archetype.replace(/ \(.*\)$/, "").toUpperCase());

  y += 50;
  dashed(ctx, left, right, y);
  y += 60;
  ctx.font = `700 24px ${MONO}`;
  ctx.fillStyle = "rgba(11,11,15,.55)";
  ctx.fillText(approved ? "JUSTIFICATION" : "REASON", left, y);
  y += 10;
  ctx.fillStyle = INK;
  ctx.font = `800 ${reason.px}px ${SANS}`;
  for (const line of reason.lines) {
    y += reason.px * 1.22;
    ctx.fillText(line, left, y);
  }

  // The stamp.
  y += 140;
  const stamp = a.verdict.kind === "approved" ? a.verdict.stamp.toUpperCase() : "DENIED";
  ctx.save();
  ctx.translate(W / 2, y);
  ctx.rotate((-7 * Math.PI) / 180);
  let stampPx = 84;
  ctx.font = `${stampPx}px ${DISPLAY}`;
  while (ctx.measureText(stamp).width > inner - 190 && stampPx > 40) {
    stampPx -= 4;
    ctx.font = `${stampPx}px ${DISPLAY}`;
  }
  const sw = ctx.measureText(stamp).width + 70;
  const sh = stampPx + 56;
  const color = approved ? CASH : URGENT;
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.strokeRect(-sw / 2, -sh / 2, sw, sh);
  ctx.lineWidth = 3;
  ctx.strokeRect(-sw / 2 + 14, -sh / 2 + 14, sw - 28, sh - 28);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(stamp, 0, 4);
  ctx.restore();
  ctx.textBaseline = "alphabetic";

  y += 150;
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.font = `800 26px ${SANS}`;
  ctx.fillText(
    approved ? "ARRIVES IN 3–5 BUSINESS DAYS OF PURE ANTICIPATION" : "PLEASE TRY AGAIN AFTER RENT",
    W / 2,
    y,
  );

  // Barcode.
  y += 34;
  const bars = barcode(a.orderNo, 58);
  const total = bars.reduce((s, b) => s + b * 3 + 3, 0);
  let bx = W / 2 - total / 2;
  bars.forEach((b, i) => {
    if (i % 2 === 0) {
      ctx.fillStyle = INK;
      ctx.fillRect(bx, y, b * 3, 90);
    }
    bx += b * 3 + 3;
  });
  y += 136;
  ctx.font = `500 24px ${MONO}`;
  ctx.fillStyle = "rgba(11,11,15,.6)";
  ctx.fillText("Legally meaningless. Emotionally binding.", W / 2, y);
  ctx.restore();

  // Sign-off under the receipt.
  const tagY = Math.min(H - 110, RY + RH * fitScale + 120);
  ctx.textAlign = "center";
  ctx.font = `46px ${DISPLAY}`;
  const tag = "GET YOURS → ORDERTHATSHIT.COM";
  const tw = ctx.measureText(tag).width + 60;
  ctx.fillStyle = INK;
  ctx.fillRect(W / 2 - tw / 2 + 10, tagY - 54 + 10, tw, 78);
  ctx.fillStyle = TV;
  ctx.fillRect(W / 2 - tw / 2, tagY - 54, tw, 78);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.strokeRect(W / 2 - tw / 2, tagY - 54, tw, 78);
  ctx.fillStyle = INK;
  ctx.fillText(tag, W / 2, tagY + 3);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

/**
 * Share the image through the OS share sheet where files can be shared (phones), otherwise
 * download it. Call this straight from a click handler with a Blob rendered in advance:
 * Safari refuses share() once an await has used up the click.
 */
export async function shareImage(
  blob: Blob,
  filename: string,
  text: string,
): Promise<"shared" | "downloaded" | "cancelled"> {
  const file = new File([blob], filename, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return "shared";
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return "cancelled";
      /* fall through to a download */
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return "downloaded";
}
