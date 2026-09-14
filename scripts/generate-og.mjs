// Renders public/og.png (1200x630) from an inline HTML template using Playwright's Chromium.
// Set CHROMIUM_PATH to use an existing Chromium binary instead of Playwright's download.
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "..", "public", "og.png");

const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
  @font-face{font-family:'Archivo Black';font-weight:400;src:url('file://${path.join(here, "..", "public", "fonts", "archivo-black-400-latin.woff2")}') format('woff2')}
  @font-face{font-family:'Inter';font-weight:400 900;src:url('file://${path.join(here, "..", "public", "fonts", "inter-400-900-latin.woff2")}') format('woff2')}
  html,body{margin:0;width:1200px;height:630px;background:#0b0b0f;color:#fff8e7;font-family:Inter,system-ui,sans-serif;overflow:hidden}
  .stripes{position:absolute;inset:0 0 auto 0;height:26px;background:repeating-linear-gradient(45deg,#ffd400 0 14px,#0b0b0f 14px 28px)}
  .wrap{position:absolute;inset:0;padding:80px 80px 60px;box-sizing:border-box}
  .eyebrow{display:inline-block;background:#ffd400;color:#0b0b0f;font-family:'Archivo Black',Impact,sans-serif;font-size:20px;letter-spacing:.2em;text-transform:uppercase;padding:8px 16px;border:3px solid #fff8e7}
  h1{font-family:'Archivo Black',Impact,sans-serif;font-size:106px;line-height:.9;text-transform:uppercase;margin:34px 0 0;letter-spacing:-.02em}
  h1 span{background:#ffd400;color:#0b0b0f;padding:0 14px;box-shadow:8px 8px 0 #ff2d20}
  p{font-size:25px;font-weight:600;color:rgba(255,248,231,.7);margin:26px 0 0;max-width:640px;line-height:1.3}
  .row{position:absolute;left:80px;bottom:40px;display:flex;gap:32px;font-weight:800;font-size:19px;color:rgba(255,248,231,.8)}
  .star{color:#ffd400}
  .burst{position:absolute;right:56px;top:80px;width:220px;height:220px;display:grid;place-items:center;transform:rotate(12deg)}
  .burst svg{position:absolute;inset:0;width:100%;height:100%}
  .burst div{position:relative;font-family:'Archivo Black',Impact,sans-serif;text-transform:uppercase;text-align:center;font-size:26px;line-height:1;color:#0b0b0f}
  .burst small{display:block;font-size:16px;margin-top:6px}
  .box{position:absolute;right:110px;bottom:56px;width:270px;height:270px}
  .dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,248,231,.06) 1.5px,transparent 1.5px);background-size:14px 14px}
</style></head><body>
<div class="dots"></div>
<div class="stripes"></div>
<div class="wrap">
  <span class="eyebrow">★ As seen on a screen ★</span>
  <h1>Still haven't<br>ordered<br><span>that shit?</span></h1>
  <p>Every problem you've ever had has one thing in common. Fix it in 3–5 business days.*</p>
</div>
<div class="row"><span><span class="star">★★★★★</span> 4.9/5 (2 were us)</span><span>📦 2,847,391 shits ordered</span><span>orderthatshit.com</span></div>
<div class="burst">
  <svg viewBox="0 0 100 100"><polygon fill="#ffd400" stroke="#0b0b0f" stroke-width="2" points="POINTS"/></svg>
  <div>50% off<small>(of what?)</small></div>
</div>
<svg class="box" viewBox="0 0 320 320">
  <ellipse cx="160" cy="292" rx="125" ry="16" fill="rgba(0,0,0,.4)"/>
  <polygon points="60,110 160,60 260,110 160,160" fill="#e0ab5e" stroke="#0b0b0f" stroke-width="3"/>
  <polygon points="152,64 168,56 268,106 252,114" fill="rgba(255,248,231,.85)"/>
  <polygon points="60,110 160,160 160,280 60,230" fill="#c8944a" stroke="#0b0b0f" stroke-width="3"/>
  <polygon points="160,160 260,110 260,230 160,280" fill="#a9772f" stroke="#0b0b0f" stroke-width="3"/>
  <g transform="translate(72,178) skewY(26.565)" fill="#3b2a12" font-family="'Archivo Black',Impact,sans-serif" font-size="27">
    <text>THAT</text><text y="30">SHIT</text>
    <text y="52" font-family="Inter,sans-serif" font-weight="800" font-size="8.5">FRAGILE (EMOTIONALLY)</text>
  </g>
</svg>
</body></html>`;

const pts = [];
for (let i = 0; i < 40; i++) {
  const r = i % 2 === 0 ? 50 : 41;
  const a = (Math.PI * i) / 20;
  pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
}

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html.replace("POINTS", pts.join(" ")), { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, await page.screenshot({ type: "png" }));
await browser.close();
console.log("wrote", out);
