// Shared furniture for the 1200x630 cards we pre-render with Playwright:
// the palette, the self-hosted fonts, the cardboard box, the starburst, and the
// screenshot boilerplate. Used by generate-og.mjs and generate-share-cards.mjs.
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
export const publicDir = path.join(here, "..", "public");
const fontsDir = path.join(publicDir, "fonts");

export const palette = {
  ink: "#0b0b0f",
  paper: "#fff8e7",
  tv: "#ffd400",
  urgent: "#ff2d20",
  cash: "#16c172",
};

/**
 * @font-face rules for the repo's woff2 files, inlined as data URLs. A page loaded with
 * setContent() can't always fetch file:// fonts, and the silent fallback to Impact is easy
 * to miss in a card.
 */
const fontUrl = (file) => `data:font/woff2;base64,${readFileSync(path.join(fontsDir, file)).toString("base64")}`;
export const fontCss = `
  @font-face{font-family:'Archivo Black';font-weight:400;src:url(${fontUrl("archivo-black-400-latin.woff2")}) format('woff2')}
  @font-face{font-family:'Inter';font-weight:400 900;src:url(${fontUrl("inter-400-900-latin.woff2")}) format('woff2')}
`;

/** Points for a 40-spike starburst polygon in a 100x100 viewBox. */
export function burstPoints() {
  const pts = [];
  for (let i = 0; i < 40; i++) {
    const r = i % 2 === 0 ? 50 : 41;
    const a = (Math.PI * i) / 20;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

/** The cardboard box, isometric, stencilled THAT SHIT. */
export function boxSvg(className = "box") {
  return `<svg class="${className}" viewBox="0 0 320 320">
  <ellipse cx="160" cy="292" rx="125" ry="16" fill="rgba(0,0,0,.4)"/>
  <polygon points="60,110 160,60 260,110 160,160" fill="#e0ab5e" stroke="#0b0b0f" stroke-width="3"/>
  <polygon points="152,64 168,56 268,106 252,114" fill="rgba(255,248,231,.85)"/>
  <polygon points="60,110 160,160 160,280 60,230" fill="#c8944a" stroke="#0b0b0f" stroke-width="3"/>
  <polygon points="160,160 260,110 260,230 160,280" fill="#a9772f" stroke="#0b0b0f" stroke-width="3"/>
  <g transform="translate(72,178) skewY(26.565)" fill="#3b2a12" font-family="'Archivo Black',Impact,sans-serif" font-size="27">
    <text>THAT</text><text y="30">SHIT</text>
    <text y="52" font-family="Inter,sans-serif" font-weight="800" font-size="8.5">FRAGILE (EMOTIONALLY)</text>
  </g>
</svg>`;
}

export function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

/**
 * Screenshot one or more 1200x630 pages to PNG. Pass { html, out } pairs; the
 * browser is launched once for the whole batch.
 */
export async function renderCards(cards) {
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );
  try {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    for (const { html, out } of cards) {
      await page.setContent(html, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);
      mkdirSync(path.dirname(out), { recursive: true });
      writeFileSync(out, await page.screenshot({ type: "png" }));
      console.log("wrote", path.relative(path.join(here, ".."), out));
    }
  } finally {
    await browser.close();
  }
}
