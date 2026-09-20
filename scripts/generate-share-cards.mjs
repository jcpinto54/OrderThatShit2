// Renders one 1200x630 share card per Shit Finder verdict into public/share/,
// plus the certificate card. These are the images that show up when someone
// pastes a /v/<id>/ or /c/ link into Slack, Discord, Signal, WhatsApp or X.
//
// They are pre-rendered and committed on purpose: the verdict list is finite, so
// nothing has to be generated per visitor. No runtime cost, no per-share bill,
// and no way for a stranger's typed text to end up in an image served from our
// domain. The visitor's own problem stays on the page, never on the card.
//
//   npm run cards                 # every card
//   npm run cards -- --only broke # just one
//
// Set CHROMIUM_PATH to use an existing Chromium binary instead of Playwright's.
import path from "node:path";
import { existsSync, readdirSync } from "node:fs";
import {
  boxSvg,
  burstPoints,
  escapeHtml,
  fontCss,
  publicDir,
  renderCards,
} from "./card-chrome.mjs";
import { verdicts } from "../src/data/verdicts.ts";

const outDir = path.join(publicDir, "share");
const platesDir = path.join(outDir, "plates");

// Optional art layer. Drop any number of images into public/share/plates/ and
// each card picks one deterministically, so a given verdict always looks the
// same. With none present the cards render on the plain dotted ink background.
const plates = existsSync(platesDir)
  ? readdirSync(platesDir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()
  : [];

function plateFor(id) {
  if (!plates.length) return null;
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return path.join(platesDir, plates[h % plates.length]);
}

/** Long verdicts get smaller type so every card fills the same box. */
function fontSize(text) {
  if (text.length <= 60) return 60;
  if (text.length <= 100) return 50;
  if (text.length <= 140) return 42;
  return 36;
}

function card({ eyebrow, headline, size, footnote, id }) {
  const plate = plateFor(id);
  return `<!doctype html><html><head><meta charset="utf-8">
<style>
  ${fontCss}
  html,body{margin:0;width:1200px;height:630px;background:#0b0b0f;color:#fff8e7;font-family:Inter,system-ui,sans-serif;overflow:hidden}
  .dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,248,231,.06) 1.5px,transparent 1.5px);background-size:14px 14px}
  .plate{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.28;filter:grayscale(.35) contrast(1.1)}
  .veil{position:absolute;inset:0;background:linear-gradient(90deg,#0b0b0f 32%,rgba(11,11,15,.72) 68%,rgba(11,11,15,.55))}
  .stripes{position:absolute;inset:0 0 auto 0;height:26px;background:repeating-linear-gradient(45deg,#ffd400 0 14px,#0b0b0f 14px 28px)}
  .wrap{position:absolute;inset:0;padding:76px 80px 116px;box-sizing:border-box;display:flex;flex-direction:column}
  .eyebrow{align-self:flex-start;background:#ffd400;color:#0b0b0f;font-family:'Archivo Black',Impact,sans-serif;font-size:19px;letter-spacing:.2em;text-transform:uppercase;padding:8px 16px;border:3px solid #fff8e7}
  h1{font-family:'Archivo Black',Impact,sans-serif;font-size:${size}px;line-height:1.02;text-transform:uppercase;margin:32px 0 0;letter-spacing:-.02em;max-width:760px}
  .stamp{margin-top:auto;align-self:flex-start;background:#ffd400;color:#0b0b0f;font-family:'Archivo Black',Impact,sans-serif;font-size:34px;text-transform:uppercase;padding:10px 18px;box-shadow:8px 8px 0 #ff2d20;transform:rotate(-1.5deg)}
  .row{position:absolute;left:80px;bottom:40px;display:flex;gap:30px;font-weight:800;font-size:19px;color:rgba(255,248,231,.8)}
  .burst{position:absolute;right:60px;top:74px;width:186px;height:186px;display:grid;place-items:center;transform:rotate(11deg)}
  .burst svg{position:absolute;inset:0;width:100%;height:100%}
  .burst div{position:relative;font-family:'Archivo Black',Impact,sans-serif;text-transform:uppercase;text-align:center;font-size:30px;line-height:1;color:#0b0b0f}
  .burst small{display:block;font-size:14px;margin-top:6px;letter-spacing:.08em}
  .box{position:absolute;right:74px;bottom:34px;width:216px;height:216px}
</style></head><body>
<div class="dots"></div>
${plate ? `<div class="plate" style="background-image:url('file://${plate}')"></div><div class="veil"></div>` : ""}
<div class="stripes"></div>
<div class="wrap">
  <span class="eyebrow">${escapeHtml(eyebrow)}</span>
  <h1>${escapeHtml(headline)}</h1>
  <div class="stamp">Order that shit.</div>
</div>
<div class="row"><span>orderthatshit.com</span><span>${escapeHtml(footnote)}</span></div>
<div class="burst">
  <svg viewBox="0 0 100 100"><polygon fill="#ffd400" stroke="#0b0b0f" stroke-width="2" points="${burstPoints()}"/></svg>
  <div>100%<small>confidence</small></div>
</div>
${boxSvg()}
</body></html>`;
}

const onlyIdx = process.argv.indexOf("--only");
const only = onlyIdx === -1 ? null : process.argv[onlyIdx + 1];

const jobs = verdicts
  .filter((v) => !only || v.id === only)
  .map((v) => ({
    out: path.join(outDir, `${v.id}.png`),
    html: card({
      id: v.id,
      eyebrow: "★ Shit Finder™ verdict ★",
      headline: v.text,
      size: fontSize(v.text),
      footnote: "Shit Finder™ v4.2.0",
    }),
  }));

if (!only || only === "certificate") {
  jobs.push({
    out: path.join(outDir, "certificate.png"),
    html: card({
      id: "certificate",
      eyebrow: "★ Certified ★",
      headline: "I ordered that shit. My problems are still here, but so is that shit.",
      size: 50,
      footnote: "Certificate of having ordered that shit",
    }),
  });
}

if (!jobs.length) {
  console.error(only ? `No card called "${only}".` : "Nothing to render.");
  process.exit(1);
}

console.log(`${jobs.length} card(s), ${plates.length} art plate(s) available.`);
await renderCards(jobs);
