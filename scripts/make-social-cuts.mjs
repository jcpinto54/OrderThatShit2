#!/usr/bin/env node
/**
 * Renders vertical 1080x1920 social cuts of the video testimonials into social/<id>.mp4.
 *
 *   node scripts/make-social-cuts.mjs [--only gary,linda]
 *
 * Layout (kept inside the TikTok / Reels / Shorts safe zones):
 *   16:9 sources: halftone paper top and bottom, a hook card on top from the very first frame
 *     (feeds start muted), a square face-sized crop of the clip in the middle band, captions.
 *     Instagram shows bordered Reels less, so post these to TikTok/Shorts and prefer 9:16 sources.
 *   Branding: none in the hook (brand prominence early costs shares); the URL rides in the name tag.
 *   9:16 sources (vertical: true): the clip full-bleed, the hook card for the first seconds only
 *     (so it never sits on a face for long), a small brand tag, captions.
 *
 * Text layers are drawn by Playwright with the site's own fonts and palette, then
 * composited by ffmpeg. No API calls: edit scripts/social-cuts.mjs and re-run for free.
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { escapeHtml, palette } from "./card-chrome.mjs";
import { cuts } from "./social-cuts.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const outDir = path.join(root, "social");
const workDir = path.join(root, ".cache", "social");
const staticFfmpeg = path.join(root, "node_modules", "ffmpeg-static", "ffmpeg");
const FFMPEG = process.env.FFMPEG || (existsSync(staticFfmpeg) ? staticFfmpeg : "ffmpeg");

// Fonts go in as data URLs: a page loaded with setContent() can't reliably fetch file:// fonts,
// and a silent fallback to Impact is easy to miss.
const font = (file) => `data:font/woff2;base64,${readFileSync(path.join(root, "public", "fonts", file)).toString("base64")}`;
const fontCss = `
  @font-face{font-family:'Archivo Black';font-weight:400;src:url(${font("archivo-black-400-latin.woff2")}) format('woff2')}
  @font-face{font-family:'Inter';font-weight:400 900;src:url(${font("inter-400-900-latin.woff2")}) format('woff2')}
`;

const W = 1080;
const H = 1920;
const BAND_Y = 680; // top of the 1080x1080 clip band
const CAPTION_Y = 1330; // vertical centre of the captions, inside the band and the safe zone
const CAPTION_Y_VERTICAL = 1410; // lower on full-bleed clips, under the face, above the feed UI
const HOOK_SECONDS_VERTICAL = 3;

const args = process.argv.slice(2);
const onlyArg = args.includes("--only") ? args[args.indexOf("--only") + 1] : "";
const only = onlyArg.split(",").filter(Boolean);

/** "*stars*" → yellow spans, everything else escaped. */
function marked(text) {
  return escapeHtml(text).replace(/\*(.+?)\*/g, '<span class="hi">$1</span>');
}

const baseCss = `
  ${fontCss}
  html,body{margin:0;width:${W}px;height:${H}px;background:transparent;overflow:hidden}
  *{box-sizing:border-box}
  .hi{color:${palette.tv}}
`;

/** Vertical clips: just the hook card, on transparent, near the top. */
function hookHtml(cut) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${baseCss}
  .hook{position:absolute;left:48px;right:48px;top:150px;background:${palette.tv};color:${palette.ink};
    border:5px solid ${palette.ink};box-shadow:10px 10px 0 ${palette.urgent};padding:14px 24px 20px}
  .eyebrow{font-family:Inter,sans-serif;font-weight:900;font-size:22px;letter-spacing:.22em;text-transform:uppercase}
  .hook h1{font-family:'Archivo Black',Impact,sans-serif;font-weight:400;text-transform:uppercase;
    line-height:1;letter-spacing:-.01em;margin:8px 0 0;font-size:60px}
  .hook h1 .hi{color:${palette.ink};background:#fff;box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:0 10px}
</style></head><body>
  <div class="hook" id="hook">
    <div class="eyebrow">★ Real* testimonial ★</div>
    <h1 id="h">${marked(cut.hook)}</h1>
  </div>
</body></html>`;
}

/** Vertical clips: a small persistent tag, top left, under the feed's own top bar. */
function tagHtml(cut) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${baseCss}
  .tag{position:absolute;left:40px;top:170px;background:${palette.tv};color:${palette.ink};border:4px solid ${palette.ink};
    box-shadow:6px 6px 0 ${palette.ink};padding:8px 16px;font-family:Inter,sans-serif;font-weight:900;font-size:27px;
    text-transform:uppercase;letter-spacing:.04em}
</style></head><body><div class="tag">${escapeHtml(cut.label)} · orderthatshit.com</div></body></html>`;
}

function frameHtml(cut) {
  // Opaque paper panels above and below the clip band, the same halftone paper as the site's hero.
  const panel = `position:absolute;left:0;right:0;background-color:${palette.paper};
    background-image:radial-gradient(rgba(11,11,15,.09) 2px,transparent 2.5px);background-size:22px 22px`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${baseCss}
  .top{${panel};top:0;height:${BAND_Y}px}
  .bottom{${panel};top:${BAND_Y + 1080}px;bottom:0}
  .stripes{position:absolute;left:0;right:0;top:0;height:34px;background:repeating-linear-gradient(45deg,${palette.tv} 0 22px,${palette.ink} 22px 44px)}
  .hook{position:absolute;left:54px;right:54px;top:220px;background:${palette.tv};color:${palette.ink};
    border:6px solid ${palette.ink};box-shadow:14px 14px 0 ${palette.urgent};padding:22px 30px 32px}
  .eyebrow{font-family:Inter,sans-serif;font-weight:900;font-size:27px;letter-spacing:.22em;text-transform:uppercase}
  .hook h1{font-family:'Archivo Black',Impact,sans-serif;font-weight:400;text-transform:uppercase;
    line-height:1;letter-spacing:-.01em;margin:14px 0 0;font-size:88px}
  .hook h1 .hi{color:${palette.ink};background:#fff;box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:0 10px}
  .rule{position:absolute;left:0;right:0;height:8px;background:${palette.ink}}
  .label{position:absolute;left:36px;top:${BAND_Y + 32}px;background:${palette.paper};color:${palette.ink};
    border:4px solid ${palette.ink};box-shadow:6px 6px 0 ${palette.ink};padding:8px 16px;
    font-family:Inter,sans-serif;font-weight:900;font-size:27px;text-transform:uppercase;letter-spacing:.04em}
</style></head><body>
  <div class="top"></div><div class="bottom"></div><div class="stripes"></div>
  <div class="hook" id="hook">
    <div class="eyebrow">★ Real* testimonial ★</div>
    <h1 id="h">${marked(cut.hook)}</h1>
  </div>
  <div class="rule" style="top:${BAND_Y - 4}px"></div>
  <div class="rule" style="top:${BAND_Y + 1080 - 4}px"></div>
  <div class="label">${escapeHtml(cut.label)} · orderthatshit.com</div>
</body></html>`;
}

function captionHtml(text, y = CAPTION_Y) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${baseCss}
  .wrap{position:absolute;left:70px;right:70px;top:${y}px;transform:translateY(-50%);display:flex;justify-content:center}
  .cap{background:${palette.ink};color:${palette.paper};font-family:'Archivo Black',Impact,sans-serif;font-size:66px;
    line-height:1.04;text-transform:uppercase;text-align:center;padding:14px 26px 18px;box-shadow:9px 9px 0 ${palette.urgent};
    max-width:940px}
</style></head><body><div class="wrap"><div class="cap">${marked(text)}</div></div></body></html>`;
}

async function renderLayers(page, cut, dir) {
  const shots = cut.vertical
    ? [
        { html: hookHtml(cut), out: path.join(dir, "frame.png") },
        { html: tagHtml(cut), out: path.join(dir, "tag.png") },
      ]
    : [{ html: frameHtml(cut), out: path.join(dir, "frame.png") }];
  const capY = cut.captionY ?? (cut.vertical ? CAPTION_Y_VERTICAL : CAPTION_Y);
  cut.captions.forEach(([, , text], i) => shots.push({ html: captionHtml(text, capY), out: path.join(dir, `cap-${i}.png`) }));
  for (const { html, out } of shots) {
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Shrink the hook (once the real font is in) until its card ends above the clip band, or,
    // on full-bleed vertical clips, above where faces usually start.
    await page.evaluate((limit) => {
      const h = document.getElementById("h");
      const card = document.getElementById("hook");
      if (!h || !card) return;
      let size = parseFloat(getComputedStyle(h).fontSize);
      while (card.getBoundingClientRect().bottom > limit && size > 36) h.style.fontSize = `${(size -= 2)}px`;
    }, cut.vertical ? 420 : BAND_Y - 44);
    await page.waitForTimeout(100);
    writeFileSync(out, await page.screenshot({ type: "png", omitBackground: true }));
  }
  return shots.map((s) => s.out);
}

/** The best available source: the full-resolution render if it's cached, else the published clip. */
function sourceOf(cut) {
  const candidates = [cut.master, cut.src].filter(Boolean).map((p) => path.join(root, p));
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error(`${cut.id}: no source clip (${candidates.join(", ")})`);
  return found;
}

function compose(cut, layers, out) {
  const [frame, ...rest] = layers;
  const extra = cut.vertical ? 1 : 0; // the brand tag
  const caps = rest.slice(extra);
  const inputs = ["-i", sourceOf(cut), "-i", frame, ...rest.flatMap((c) => ["-i", c])];
  const chain = cut.vertical
    ? [
        `[0:v]${cut.zoomTop ? `crop=iw*${cut.zoomTop}:ih*${cut.zoomTop}:(iw-iw*${cut.zoomTop})/2:0,` : ""}scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H}[v0a]`,
        `[v0a][2:v]overlay=0:0:enable='gte(t,${HOOK_SECONDS_VERTICAL})'[v0]`,
        `[v0][1:v]overlay=0:0:enable='lt(t,${HOOK_SECONDS_VERTICAL})'[v1]`,
      ]
    : [
        `[0:v]split=2[s1][s2]`,
        `[s1]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},gblur=sigma=28,eq=brightness=-0.2:saturation=0.7[bg]`,
        `[s2]crop=720:720:${cut.cropX}:0,scale=1080:1080:flags=lanczos[fg]`,
        `[bg][fg]overlay=0:${BAND_Y}[v0]`,
        `[v0][1:v]overlay=0:0[v1]`,
      ];
  const firstCap = 2 + extra;
  caps.forEach((_, i) => {
    const [t0, t1] = cut.captions[i];
    chain.push(`[v${i + 1}][${i + firstCap}:v]overlay=0:0:enable='between(t,${t0},${t1})'[v${i + 2}]`);
  });
  const last = `[v${cut.captions.length + 1}]`;
  // Same tidy-up as the site copy: stop at trimEnd, drop a stray trailing word after muteAfter.
  if (cut.muteAfter) chain.push(`[0:a]volume=enable='gte(t,${cut.muteAfter})':volume=0.05[aud]`);
  execFileSync(FFMPEG, [
    "-y", "-loglevel", "error", ...inputs,
    "-filter_complex", chain.join(";"),
    "-map", last, "-map", cut.muteAfter ? "[aud]" : "0:a",
    ...(cut.trimEnd ? ["-t", String(cut.trimEnd)] : []),
    "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", out,
  ]);
  // A still of the first frame, handy as a cover image.
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-ss", "0.6", "-i", out, "-frames:v", "1", "-q:v", "3", out.replace(/\.mp4$/, ".jpg")]);
}

const list = only.length ? cuts.filter((c) => only.includes(c.id)) : cuts;
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const cut of list) {
    const dir = path.join(workDir, cut.id);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    const layers = await renderLayers(page, cut, dir);
    const out = path.join(outDir, `${cut.id}.mp4`);
    compose(cut, layers, out);
    console.log(`wrote social/${cut.id}.mp4`);
  }
} finally {
  await browser.close();
}
