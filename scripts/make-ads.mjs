#!/usr/bin/env node
/**
 * Builds the multi-shot ad spots defined in scripts/ads.mjs: vertical 1080x1920 parodies of
 * real ad genres, cut from several generated shots with a voiceover, a music bed, captions
 * and branded supers.
 *
 *   FAL_KEY=... node scripts/make-ads.mjs [--only pharma,migration] [--steps keyframes,shots,vo,music,render] [--force]
 *
 * Steps (each cached in .cache/ads/<spot>/, so re-running only pays for what's missing):
 *   keyframes  FLUX 1.1 Ultra first frames, for shots whose packaging must read    (~$0.06 each)
 *   shots      Veo 3.1 Fast: image-to-video from a keyframe, otherwise text-to-video ($0.15/s with audio)
 *   vo         ElevenLabs v3 voiceover lines                                      (cents)
 *   music      Lyria 2 instrumental bed, 30 s                                     (cents)
 *   render     ffmpeg: the cut list, supers and captions (drawn by Playwright in the
 *              site's fonts), shot audio + VO + ducked music → social/ad-<id>.mp4, and a
 *              720p copy + poster in public/videos/ for the site. No API calls.
 *
 * Every paid call is appended to .cache/spend.jsonl with an estimated cost.
 */
import { fal } from "@fal-ai/client";
import { chromium } from "playwright";
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { escapeHtml, palette } from "./card-chrome.mjs";
import { spots } from "./ads.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const cacheRoot = path.join(root, ".cache", "ads");
const staticFfmpeg = path.join(root, "node_modules", "ffmpeg-static", "ffmpeg");
const FFMPEG = process.env.FFMPEG || (existsSync(staticFfmpeg) ? staticFfmpeg : "ffmpeg");
const W = 1080;
const H = 1920;
const FPS = 24;

const args = process.argv.slice(2);
const opt = (name, dflt) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : dflt);
const force = args.includes("--force");
const only = opt("only", "").split(",").filter(Boolean);
const steps = opt("steps", "keyframes,shots,vo,music,render").split(",");
const paid = ["keyframes", "shots", "vo", "music"].some((s) => steps.includes(s));

if (paid) {
  if (!process.env.FAL_KEY) {
    console.error("FAL_KEY is not set");
    process.exit(1);
  }
  fal.config({ credentials: process.env.FAL_KEY });
}

const log = (id, msg) => console.log(`[${id}] ${msg}`);
const spend = (spot, what, usd) =>
  appendFileSync(path.join(root, ".cache", "spend.jsonl"), `${JSON.stringify({ at: new Date().toISOString(), spot, what, usd })}\n`);

async function run(model, input, id) {
  log(id, `→ ${model}`);
  try {
    return (await fal.subscribe(model, { input, logs: false })).data;
  } catch (e) {
    throw new Error(`${model} failed: ${e?.body ? JSON.stringify(e.body) : e?.message}`);
  }
}

async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${url}: ${r.status}`);
  writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
  return dest;
}

function duration(file) {
  let err = "";
  try {
    execFileSync(FFMPEG, ["-i", file], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    err = String(e.stderr || "");
  }
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(err);
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0;
}

/**
 * Veo sometimes bakes cinematic letterbox bars into a vertical clip. Find the picture area so the
 * edit can crop the bars off and scale back up to full frame.
 */
function pictureArea(file) {
  const { stderr } = spawnSync(
    FFMPEG,
    ["-hide_banner", "-ss", "1", "-i", file, "-t", "3", "-vf", "cropdetect=limit=24:round=2:reset=0", "-f", "null", "-"],
    { encoding: "utf8" },
  );
  const all = [...String(stderr).matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)];
  const last = all.at(-1);
  if (!last) return null;
  const [w, h, x, y] = last.slice(1).map(Number);
  return h < H - 24 && w >= W - 8 ? { w, h, x, y } : null;
}

const manifestPath = (dir) => path.join(dir, "manifest.json");
const loadManifest = (dir) => (existsSync(manifestPath(dir)) ? JSON.parse(readFileSync(manifestPath(dir), "utf8")) : {});
function saveManifest(dir, m) {
  writeFileSync(manifestPath(dir), JSON.stringify({ ...loadManifest(dir), ...m }, null, 2));
}

// ---- generation -------------------------------------------------------------------------

const NEGATIVE = "subtitles, captions, on-screen text, text overlay, lower third, watermark, logo, brand names";

async function generate(spot) {
  const dir = path.join(cacheRoot, spot.id);
  mkdirSync(dir, { recursive: true });
  const m = loadManifest(dir);
  const have = (key) => !force && m[key] && existsSync(m[key]);

  await Promise.all(
    spot.shots.map(async (shot, i) => {
      const kf = `keyframe:${shot.id}`;
      if (steps.includes("keyframes") && shot.keyframe && !have(kf)) {
        const d = await run(
          "fal-ai/flux-pro/v1.1-ultra",
          { prompt: shot.keyframe, aspect_ratio: "9:16", raw: false, output_format: "jpeg", safety_tolerance: "5", seed: shot.seed ?? 4147 + i },
          `${spot.id}/${shot.id}`,
        );
        m[kf] = await download(d.images[0].url, path.join(dir, `${shot.id}.jpg`));
        spend(spot.id, `keyframe ${shot.id}`, 0.06);
        saveManifest(dir, { [kf]: m[kf] });
      }

      const key = `shot:${shot.id}`;
      // A shot can start from another shot's keyframe, to keep the same person across cuts.
      const start = shot.keyframeFrom ? `keyframe:${shot.keyframeFrom}` : kf;
      if (steps.includes("shots") && !have(key)) {
        if (shot.keyframeFrom && !m[start]) throw new Error(`${spot.id}/${shot.id}: keyframe of ${shot.keyframeFrom} not generated yet`);
        const seconds = parseInt(shot.duration ?? "8s", 10);
        const common = {
          prompt: shot.prompt,
          negative_prompt: NEGATIVE,
          duration: shot.duration ?? "8s",
          resolution: "1080p",
          aspect_ratio: "9:16",
          generate_audio: true,
          safety_tolerance: "6",
          auto_fix: false,
          seed: shot.seed ?? 4147 + i,
        };
        const d = m[start]
          ? await run(
              "fal-ai/veo3.1/fast/image-to-video",
              { ...common, image_url: await fal.storage.upload(new Blob([readFileSync(m[start])], { type: "image/jpeg" })) },
              `${spot.id}/${shot.id}`,
            )
          : await run("fal-ai/veo3.1/fast", common, `${spot.id}/${shot.id}`);
        m[key] = await download(d.video.url, path.join(dir, `${shot.id}.mp4`));
        spend(spot.id, `shot ${shot.id} (${seconds}s)`, seconds * 0.15);
        saveManifest(dir, { [key]: m[key] });
        log(spot.id, `shot ${shot.id} saved`);
      }
    }),
  );

  if (steps.includes("vo")) {
    for (const [i, line] of spot.vo.entries()) {
      const key = `vo:${i}`;
      if (have(key) && m[`${key}:text`] === line.text) continue;
      const d = await run(
        "fal-ai/elevenlabs/tts/eleven-v3",
        { text: line.text, voice: line.voice, stability: line.stability ?? 0.5, language_code: "en" },
        `${spot.id}/vo${i}`,
      );
      m[key] = await download(d.audio.url, path.join(dir, `vo-${i}.mp3`));
      spend(spot.id, `vo ${i}`, (line.text.length / 1000) * 0.1);
      saveManifest(dir, { [key]: m[key], [`${key}:text`]: line.text });
    }
  }

  if (steps.includes("music") && spot.music && !have("music")) {
    const d = await run("fal-ai/lyria2", { prompt: spot.music.prompt, negative_prompt: "vocals, singing, low quality" }, `${spot.id}/music`);
    const url = d.audio?.url ?? d.audio_file?.url ?? d.url;
    m.music = await download(url, path.join(dir, "music.wav"));
    spend(spot.id, "music", 0.1);
    saveManifest(dir, { music: m.music });
  }
}

// ---- supers -------------------------------------------------------------------------------

const font = (file) => `data:font/woff2;base64,${readFileSync(path.join(root, "public", "fonts", file)).toString("base64")}`;
const css = `
  @font-face{font-family:'Archivo Black';src:url(${font("archivo-black-400-latin.woff2")}) format('woff2')}
  @font-face{font-family:'Inter';font-weight:400 900;src:url(${font("inter-400-900-latin.woff2")}) format('woff2')}
  html,body{margin:0;width:${W}px;height:${H}px;background:transparent;overflow:hidden}
  *{box-sizing:border-box}
  .hi{color:${palette.tv}}
`;
const marked = (t) => escapeHtml(t).replace(/\*(.+?)\*/g, '<span class="hi">$1</span>');
const page = (body, style = "") => `<!doctype html><html><head><meta charset="utf-8"><style>${css}${style}</style></head><body>${body}</body></html>`;

function superHtml(s) {
  const [a, b] = s.text.split("|");
  switch (s.kind) {
    case "tag":
      return page(
        `<div class="t">${escapeHtml(s.text)}</div>`,
        `.t{position:absolute;right:40px;top:170px;background:rgba(11,11,15,.72);color:#fff;padding:8px 16px;
          font-family:Inter,sans-serif;font-weight:800;font-size:24px;letter-spacing:.14em;text-transform:uppercase}`,
      );
    case "lower":
      return page(
        `<div class="l">${marked(s.text)}</div>`,
        `.l{position:absolute;left:48px;top:1180px;max-width:820px;background:${palette.paper};color:${palette.ink};
          border:5px solid ${palette.ink};box-shadow:8px 8px 0 ${palette.ink};padding:12px 20px;
          font-family:Inter,sans-serif;font-weight:900;font-size:34px;line-height:1.15}`,
      );
    case "legal":
      return page(
        `<div class="g">${escapeHtml(s.text)}</div>`,
        `.g{position:absolute;left:40px;right:40px;top:1470px;color:rgba(255,255,255,.9);background:rgba(0,0,0,.35);
          padding:10px 14px;font-family:Inter,sans-serif;font-weight:500;font-size:17px;line-height:1.3}`,
      );
    case "title":
      return page(
        `<div class="c"><h1>${marked(a)}</h1>${b ? `<p>${marked(b)}</p>` : ""}</div>`,
        `.c{position:absolute;left:60px;right:60px;top:260px;background:${palette.tv};color:${palette.ink};border:6px solid ${palette.ink};
          box-shadow:14px 14px 0 ${palette.urgent};padding:26px 32px;text-align:center}
         h1{margin:0;font-family:'Archivo Black',sans-serif;font-weight:400;font-size:84px;line-height:.98;text-transform:uppercase}
         h1 .hi{color:${palette.urgent}}
         p{margin:12px 0 0;font-family:Inter,sans-serif;font-weight:900;font-size:34px;text-transform:uppercase;letter-spacing:.08em}
         p .hi{color:${palette.ink}}`,
      );
    case "burst": {
      const pts = Array.from({ length: 40 }, (_, i) => {
        const r = i % 2 ? 41 : 50;
        const t = (Math.PI * i) / 20;
        return `${(50 + r * Math.cos(t)).toFixed(2)},${(50 + r * Math.sin(t)).toFixed(2)}`;
      }).join(" ");
      return page(
        `<div class="b"><svg viewBox="0 0 100 100"><polygon fill="${palette.urgent}" stroke="${palette.ink}" stroke-width="2" points="${pts}"/></svg>
          <div><s>${escapeHtml(a)}</s><strong>${escapeHtml(b ?? "")}</strong></div></div>`,
        `.b{position:absolute;right:40px;top:230px;width:300px;height:300px;display:grid;place-items:center;transform:rotate(12deg)}
         .b svg{position:absolute;inset:0}
         .b div{position:relative;text-align:center;color:#fff;font-family:'Archivo Black',sans-serif}
         s{display:block;font-size:36px;opacity:.85} strong{display:block;font-weight:400;font-size:66px;line-height:1}`,
      );
    }
    case "serif":
      return page(
        `<div class="s"><h1>${escapeHtml(a)}</h1>${b ? `<p>${escapeHtml(b)}</p>` : ""}</div>`,
        `.s{position:absolute;left:0;right:0;top:760px;text-align:center;color:#fff;text-shadow:0 2px 24px rgba(0,0,0,.5)}
         h1{margin:0;font-family:Didot,'Bodoni 72','Bodoni MT',Georgia,serif;font-weight:400;font-size:190px;letter-spacing:.32em;padding-left:.32em}
         p{margin:18px 0 0;font-family:Didot,'Bodoni 72',Georgia,serif;font-style:italic;font-size:44px;letter-spacing:.06em}`,
      );
    case "whisper":
      return page(
        `<div class="w">${escapeHtml(s.text)}</div>`,
        `.w{position:absolute;left:0;right:0;top:1300px;text-align:center;color:#fff;font-family:Didot,'Bodoni 72',Georgia,serif;
          font-style:italic;font-size:72px;letter-spacing:.04em;text-shadow:0 2px 18px rgba(0,0,0,.6)}`,
      );
    case "endcard":
      return page(
        `<div class="e"><div class="stripes"></div>
          <div class="box">
            <div class="eyebrow">★ Order That Shit™ ★</div>
            <h1>${marked(a)}</h1>${b ? `<p>${marked(b)}</p>` : ""}
          </div>
          <div class="url">orderthatshit.com</div>
          <div class="fine">AI actors. Satire. Nothing here is for sale.</div>
          <div class="stripes bottom"></div></div>`,
        `.e{position:absolute;inset:0;background:${palette.paper};background-image:radial-gradient(rgba(11,11,15,.09) 2px,transparent 2.5px);background-size:22px 22px}
         .stripes{position:absolute;left:0;right:0;top:0;height:40px;background:repeating-linear-gradient(45deg,${palette.tv} 0 22px,${palette.ink} 22px 44px)}
         .stripes.bottom{top:auto;bottom:0}
         .box{position:absolute;left:60px;right:60px;top:560px;background:${palette.tv};border:7px solid ${palette.ink};box-shadow:16px 16px 0 ${palette.urgent};padding:36px 36px 44px;text-align:center}
         .eyebrow{font-family:Inter,sans-serif;font-weight:900;font-size:28px;letter-spacing:.22em;text-transform:uppercase}
         h1{margin:18px 0 0;font-family:'Archivo Black',sans-serif;font-weight:400;font-size:88px;line-height:.98;text-transform:uppercase;color:${palette.ink}}
         h1 .hi{color:${palette.urgent}}
         p{margin:22px 0 0;font-family:Inter,sans-serif;font-weight:900;font-size:40px;line-height:1.15;color:${palette.ink}}
         .url{position:absolute;left:0;right:0;top:1260px;text-align:center}
         .url{font-family:'Archivo Black',sans-serif;font-size:64px;color:#fff;background:${palette.urgent};border:6px solid ${palette.ink};
           box-shadow:10px 10px 0 ${palette.ink};width:max-content;margin:0 auto;padding:10px 28px 14px;text-transform:lowercase}
         .fine{position:absolute;left:0;right:0;bottom:120px;text-align:center;font-family:Inter,sans-serif;font-weight:700;font-size:24px;color:rgba(11,11,15,.55);letter-spacing:.06em;text-transform:uppercase}`,
      );
    default:
      throw new Error(`unknown super kind ${s.kind}`);
  }
}

function captionHtml(text) {
  return page(
    `<div class="w"><div class="c">${marked(text)}</div></div>`,
    `.w{position:absolute;left:60px;right:60px;top:1330px;transform:translateY(-50%);display:flex;justify-content:center}
     .c{background:${palette.ink};color:${palette.paper};font-family:'Archivo Black',sans-serif;font-size:58px;line-height:1.05;
       text-transform:uppercase;text-align:center;padding:12px 24px 16px;box-shadow:8px 8px 0 ${palette.urgent};max-width:960px}`,
  );
}

/** Split a VO line into caption chunks of a few words, timed by share of characters. */
function voCaptions(text, at, dur) {
  const words = text.split(/\s+/);
  const chunks = [];
  let cur = [];
  for (const w of words) {
    cur.push(w);
    const len = cur.join(" ").length;
    if (len > 22 || /[.?!,:]$/.test(w)) {
      chunks.push(cur.join(" "));
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur.join(" "));
  const total = chunks.reduce((s, c) => s + c.length, 0);
  let t = at;
  return chunks.map((c) => {
    const d = (dur * c.length) / total;
    const cap = { from: t, to: t + d, text: c.replace(/(that shit)/gi, "*$1*") };
    t += d;
    return cap;
  });
}

// ---- render -------------------------------------------------------------------------------

async function render(spot, browserPage) {
  const dir = path.join(cacheRoot, spot.id);
  const m = loadManifest(dir);
  const work = path.join(dir, "render");
  rmSync(work, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });

  const total = spot.cut.reduce((s, [, a, b]) => s + (b - a), 0);
  const tail = spot.supers.some((s) => s.kind === "endcard") ? 0 : 0.6;
  const length = Math.max(total, ...spot.supers.map((s) => s.to)) + tail;

  // VO timing and captions.
  const vo = spot.vo.map((line, i) => {
    const file = m[`vo:${i}`];
    if (!file) throw new Error(`${spot.id}: missing vo ${i}; run --steps vo`);
    const dur = duration(file) / (line.tempo ?? 1);
    return { ...line, file, dur };
  });
  vo.forEach((v, i) => {
    const next = vo[i + 1];
    if (next && v.at + v.dur > next.at + 0.05) log(spot.id, `⚠ vo ${i} (${v.dur.toFixed(2)}s from ${v.at}s) runs into vo ${i + 1} at ${next.at}s`);
  });
  const captions = [
    // Spots with their own typographic voice (the fragrance) caption the VO in supers instead.
    ...(spot.voCaptions === false ? [] : vo.flatMap((v) => voCaptions(v.text, v.at, v.dur))),
    ...spot.lines.map((l) => ({ from: l.at, to: l.at + l.dur, text: l.text })),
  ];

  // Text layers.
  const layers = [];
  const shoot = async (html, name, from, to) => {
    await browserPage.setContent(html, { waitUntil: "networkidle" });
    await browserPage.evaluate(() => document.fonts.ready);
    const out = path.join(work, `${name}.png`);
    writeFileSync(out, await browserPage.screenshot({ type: "png", omitBackground: true }));
    layers.push({ file: out, from, to });
  };
  for (const [i, s] of spot.supers.entries()) await shoot(superHtml(s), `super-${i}`, s.from, s.to);
  for (const [i, c] of captions.entries()) {
    // No captions over the end card.
    const card = spot.supers.find((s) => s.kind === "endcard");
    if (card && c.from >= card.from) continue;
    await shoot(captionHtml(c.text), `cap-${i}`, c.from, Math.min(c.to, card ? card.from : c.to));
  }

  // Inputs: shots (by cut order), VO files, music, text layers. `add` returns each input's index.
  const inputs = [];
  let count = 0;
  const add = (...argv) => {
    inputs.push(...argv);
    return count++;
  };
  const shotIndex = {};
  for (const [shotId] of spot.cut) {
    if (shotIndex[shotId] !== undefined) continue;
    const file = m[`shot:${shotId}`];
    if (!file) throw new Error(`${spot.id}: missing shot ${shotId}; run --steps shots`);
    shotIndex[shotId] = add("-i", file);
  }
  const voIdx = vo.map((v) => add("-i", v.file));
  const musicIdx = spot.music && m.music ? add("-stream_loop", "-1", "-i", m.music) : -1;
  const layerIdx = layers.map((l) => add("-i", l.file));

  const f = [];
  // Picture: trim each cut, normalise, concatenate, hold the last frame under the end card.
  const areas = Object.fromEntries(Object.keys(shotIndex).map((id) => [id, pictureArea(m[`shot:${id}`])]));
  // Where each cut lands on the finished timeline, for ducking the music under on-screen dialogue.
  const ducks = [];
  let at = 0;
  spot.cut.forEach(([shotId, a, b, opts = {}], i) => {
    const k = shotIndex[shotId];
    const area = areas[shotId];
    const bars = area ? `crop=${area.w}:${area.h}:${area.x}:${area.y},` : "";
    // Dialogue shots get their own gain (`gain`) and push the music down while they play (`duck`).
    const gain = opts.gain ?? spot.shotGain ?? 0.4;
    if (opts.duck) ducks.push([at, at + (b - a)]);
    at += b - a;
    f.push(
      `[${k}:v]trim=${a}:${b},setpts=PTS-STARTPTS,${bars}scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS},format=yuv420p[v${i}]`,
      `[${k}:a]atrim=${a}:${b},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume=${gain}[a${i}]`,
    );
  });
  const n = spot.cut.length;
  f.push(`${spot.cut.map((_, i) => `[v${i}][a${i}]`).join("")}concat=n=${n}:v=1:a=1[vc][ac]`);
  f.push(`[vc]tpad=stop_mode=clone:stop_duration=${Math.max(0, length - total + 0.1).toFixed(2)}[vp]`);
  let v = "vp";
  layers.forEach((l, i) => {
    f.push(`[${v}][${layerIdx[i]}:v]overlay=0:0:enable='between(t,${l.from.toFixed(2)},${l.to.toFixed(2)})'[o${i}]`);
    v = `o${i}`;
  });

  // Sound: shot audio (quiet), VO on its marks, music ducked under the VO.
  f.push(`[ac]apad,atrim=0:${length.toFixed(2)}[sa]`);
  vo.forEach((line, i) => {
    const tempo = line.tempo ? `atempo=${line.tempo},` : "";
    f.push(`[${voIdx[i]}:a]${tempo}aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(line.at * 1000)}:all=1,volume=1.6[vo${i}]`);
  });
  const mixIns = ["[sa]"];
  if (vo.length) {
    f.push(`${vo.map((_, i) => `[vo${i}]`).join("")}amix=inputs=${vo.length}:normalize=0:duration=longest,apad,atrim=0:${length.toFixed(2)}[voall]`);
    f.push(`[voall]asplit=2[vomix][vokey]`);
    mixIns.push("[vomix]");
  }
  if (musicIdx >= 0) {
    f.push(
      `[${musicIdx}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${length.toFixed(2)},afade=t=in:d=0.4,afade=t=out:st=${(length - 1.6).toFixed(2)}:d=1.6,volume=${spot.music.gain ?? 0.3}${ducks
        .map(([d0, d1]) => `,volume=enable='between(t,${d0.toFixed(2)},${d1.toFixed(2)})':volume=0.25`)
        .join("")}[mu]`,
    );
    if (vo.length) {
      f.push(`[mu][vokey]sidechaincompress=threshold=0.03:ratio=5:attack=15:release=350[mud]`);
      mixIns.push("[mud]");
    } else mixIns.push("[mu]");
  } else if (vo.length) f.push(`[vokey]anullsink`);
  f.push(`${mixIns.join("")}amix=inputs=${mixIns.length}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[aout]`);

  mkdirSync(path.join(root, "social"), { recursive: true });
  const master = path.join(root, "social", `ad-${spot.id}.mp4`);
  execFileSync(FFMPEG, [
    "-y", "-loglevel", "error", ...inputs,
    "-filter_complex", f.join(";"),
    "-map", `[${v}]`, "-map", "[aout]", "-t", length.toFixed(2),
    "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p", "-r", String(FPS),
    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", master,
  ]);
  // Site copy: 720x1280, lighter, plus a poster from the first shot.
  const site = path.join(root, "public", "videos", `ad-${spot.id}.mp4`);
  execFileSync(FFMPEG, [
    "-y", "-loglevel", "error", "-i", master, "-vf", "scale=720:-2",
    "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-maxrate", "1600k", "-bufsize", "3200k", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", site,
  ]);
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-ss", "1.0", "-i", site, "-frames:v", "1", "-q:v", "4", site.replace(/\.mp4$/, ".jpg")]);
  log(spot.id, `rendered social/ad-${spot.id}.mp4 (${length.toFixed(1)}s) + public/videos/ad-${spot.id}.mp4`);
}

// ---- main ---------------------------------------------------------------------------------

const list = only.length ? spots.filter((s) => only.includes(s.id)) : spots;
await Promise.all(
  list.map((s) =>
    generate(s).catch((e) => {
      console.error(`[${s.id}] ✗ ${e.message}`);
      process.exitCode = 1;
    }),
  ),
);

if (steps.includes("render")) {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  try {
    const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    for (const s of list) {
      try {
        await render(s, p);
      } catch (e) {
        console.error(`[${s.id}] ✗ render: ${String(e.stderr || e.message).split("\n").filter(Boolean).slice(-3).join(" | ").slice(0, 600)}`);
        process.exitCode = 1;
      }
    }
  } finally {
    await browser.close();
  }
}
