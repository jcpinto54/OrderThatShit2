// Renders public/og.png (1200x630), the preview card for the site itself.
// Per-verdict share cards live in generate-share-cards.mjs.
// Set CHROMIUM_PATH to use an existing Chromium binary instead of Playwright's download.
import path from "node:path";
import { boxSvg, burstPoints, fontCss, publicDir, renderCards } from "./card-chrome.mjs";

const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
  ${fontCss}
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
  <svg viewBox="0 0 100 100"><polygon fill="#ffd400" stroke="#0b0b0f" stroke-width="2" points="${burstPoints()}"/></svg>
  <div>50% off<small>(of what?)</small></div>
</div>
${boxSvg()}
</body></html>`;

await renderCards([{ html, out: path.join(publicDir, "og.png") }]);
