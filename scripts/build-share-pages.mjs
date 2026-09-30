// Post-build step: writes a real HTML file for every shareable URL.
//
//   dist/v/<id>/index.html   one per Shit Finder verdict
//   dist/c/index.html        the certificate
//
// Link previews are built by crawlers that do not run JavaScript, so a single
// page app cannot give a share its own title and image. Each file here is
// dist/index.html with its meta tags rewritten and its own pre-rendered card
// from public/share/ — same bundle, same app, different preview. The app reads
// the URL on load and shows the matching verdict.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { verdicts } from "../src/data/verdicts.ts";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const dist = path.join(root, "dist");
const SITE = "https://orderthatshit.com";

const shell = readFileSync(path.join(dist, "index.html"), "utf8");

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

/**
 * Swap the content of <meta name|property="key">. The value is matched up to
 * the same quote character it opened with, because the copy on this site is
 * full of apostrophes and a [^"'] run stops dead at the first one.
 */
function setMeta(html, key, value) {
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `(<meta\\s+(?:name|property)=(["'])${k}\\2\\s+content=(["']))[\\s\\S]*?\\3`,
    "i",
  );
  if (!re.test(html)) throw new Error(`no <meta> for ${key} in dist/index.html`);
  return html.replace(re, (_m, prefix, _quoteKey, quote) => `${prefix}${escapeHtml(value)}${quote}`);
}

function page({ url, title, ogTitle, description, image, body }) {
  let html = shell;
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /(<link\s+rel=["']canonical["']\s+href=(["']))[\s\S]*?\2/i,
    (_m, prefix, quote) => `${prefix}${escapeHtml(url)}${quote}`,
  );
  html = setMeta(html, "description", description);
  html = setMeta(html, "og:title", ogTitle);
  html = setMeta(html, "og:description", description);
  html = setMeta(html, "og:url", url);
  html = setMeta(html, "og:image", image);
  html = setMeta(html, "twitter:title", ogTitle);
  html = setMeta(html, "twitter:description", description);
  html = setMeta(html, "twitter:image", image);
  // Something for a crawler that reads the body, and for anyone with JS off.
  return html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <noscript>${escapeHtml(body)}</noscript>`,
  );
}

function write(dir, html) {
  const out = path.join(dist, dir, "index.html");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, html);
  return `${dir}/`;
}

const missing = [];
const written = [];

for (const v of verdicts) {
  const card = `/share/${v.id}.png`;
  if (!existsSync(path.join(dist, card))) missing.push(card);
  written.push(
    write(
      `v/${v.id}`,
      page({
        url: `${SITE}/v/${v.id}/`,
        title: `Shit Finder™ verdict — Order That Shit™`,
        ogTitle: v.text,
        description:
          "The Shit Finder™ has analyzed the problem. Describe yours and get a verdict of your own. It will also say order that shit.",
        image: `${SITE}${card}`,
        body: `Shit Finder™ verdict: ${v.text} Order that shit.`,
      }),
    ),
  );
}

if (!existsSync(path.join(dist, "/share/certificate.png"))) missing.push("/share/certificate.png");
written.push(
  write(
    "c",
    page({
      url: `${SITE}/c/`,
      title: "Order Authorization — Order That Shit™",
      ogTitle: "It's decided. I'm finally ordering that thing I kept thinking about.",
      description:
        "Somebody got officially approved to stop deliberating. Tell the Shit Finder what you keep thinking about ordering, and get your own authorization.",
      image: `${SITE}/share/certificate.png`,
      body: "Somebody got officially approved. Get your own authorization.",
    }),
  ),
);

// Keep the sitemap in step with the pages that actually exist.
writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><changefreq>always</changefreq><priority>1.0</priority></url>
${verdicts.map((v) => `  <url><loc>${SITE}/v/${v.id}/</loc><priority>0.6</priority></url>`).join("\n")}
</urlset>
`,
);

if (missing.length) {
  console.error(
    `Missing share card(s): ${missing.join(", ")}\nRun \`npm run cards\` and commit the result.`,
  );
  process.exit(1);
}

console.log(`share pages: ${written.length} written, sitemap updated`);
