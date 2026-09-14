#!/usr/bin/env node
/**
 * Generates the video testimonials on fal.ai.
 *
 *   FAL_KEY=... node scripts/generate-videos.mjs [--only linda,gary] [--steps portrait,tts,omnihuman,veo,lipsync,publish] [--route omnihuman|veo|lipsync]
 *
 * Steps (each cached in .cache/videos/<id>/, re-run with --force to regenerate):
 *   portrait   FLUX 1.1 Ultra still of the character                     (~$0.06)
 *   tts        ElevenLabs v3 speech for `script`                          (cents)
 *   omnihuman  OmniHuman 1.5: portrait + speech -> talking-head video     ($0.16/s)
 *   veo        Veo 3.1 Fast image-to-video with spoken `veoLine`          ($0.15/s, 8s)
 *   lipsync    sync-lipsync v2: re-dub the Veo clip with the TTS audio    (fallback if Veo won't swear)
 *   mix        ffmpeg: lay the TTS audio over the Veo clip (for voiceovers with no on-screen speaker)
 *   publish    copy the chosen --route's clip + a poster frame into public/videos/
 */
import { fal } from "@fal-ai/client";
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { characters } from "./video-characters.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const cacheRoot = process.env.VIDEO_CACHE_DIR || path.join(root, ".cache", "videos");
const publicDir = path.join(root, "public", "videos");
// Prefer the ffmpeg-static binary (a devDependency) so posters/remuxing work without a system ffmpeg.
const staticFfmpeg = path.join(root, "node_modules", "ffmpeg-static", "ffmpeg");
const FFMPEG = process.env.FFMPEG || (existsSync(staticFfmpeg) ? staticFfmpeg : "ffmpeg");

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const force = args.includes("--force");
const only = opt("only", "").split(",").filter(Boolean);
const steps = opt("steps", "portrait,tts,omnihuman,publish").split(",");
const route = opt("route", "omnihuman");

if (!process.env.FAL_KEY) {
  console.error("FAL_KEY is not set");
  process.exit(1);
}
fal.config({ credentials: process.env.FAL_KEY });

const log = (id, msg) => console.log(`[${id}] ${msg}`);

async function run(model, input, id) {
  log(id, `→ ${model}`);
  try {
    const res = await fal.subscribe(model, {
      input,
      logs: true,
      onQueueUpdate: (u) => {
        if (u.status === "IN_PROGRESS") u.logs?.forEach((l) => log(id, `  ${l.message}`));
      },
    });
    return res.data;
  } catch (e) {
    const body = e?.body ? JSON.stringify(e.body) : e?.message;
    throw new Error(`${model} failed: ${body}`);
  }
}

async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${url}: ${r.status}`);
  writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
  return dest;
}

async function upload(file, type) {
  const blob = new Blob([readFileSync(file)], { type });
  return fal.storage.upload(blob);
}

function loadManifest(dir) {
  const p = path.join(dir, "manifest.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
}
function saveManifest(dir, m) {
  // Merge with whatever is on disk so parallel runs of different steps don't clobber each other.
  const merged = { ...loadManifest(dir), ...m };
  Object.assign(m, merged);
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(merged, null, 2));
}

function ffprobeDuration(file) {
  // ffmpeg exits non-zero without an output file, but still prints the duration to stderr.
  let err = "";
  try {
    execFileSync(FFMPEG, ["-i", file], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    err = String(e.stderr || "");
  }
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(err);
  return m ? Math.round((+m[1] * 3600 + +m[2] * 60 + +m[3]) * 10) / 10 : null;
}

async function processCharacter(c) {
  const dir = path.join(cacheRoot, c.id);
  mkdirSync(dir, { recursive: true });
  const m = loadManifest(dir);
  const has = (k) => !force && m[k]?.local && existsSync(m[k].local);

  if (steps.includes("portrait")) {
    if (has("portrait")) log(c.id, "portrait cached");
    else {
      const d = await run(
        "fal-ai/flux-pro/v1.1-ultra",
        { prompt: c.portraitPrompt, aspect_ratio: "16:9", raw: true, output_format: "jpeg", safety_tolerance: "5", seed: c.seed ?? 4147 },
        c.id,
      );
      const local = await download(d.images[0].url, path.join(dir, "portrait.jpg"));
      m.portrait = { url: d.images[0].url, local, seed: d.seed };
      saveManifest(dir, m);
      log(c.id, `portrait saved (${d.images[0].width}x${d.images[0].height})`);
    }
  }

  if (steps.includes("tts")) {
    if (has("tts")) log(c.id, "tts cached");
    else {
      const d = await run(
        "fal-ai/elevenlabs/tts/eleven-v3",
        { text: c.script, voice: c.voice, stability: c.stability ?? 0.5, language_code: "en" },
        c.id,
      );
      const local = await download(d.audio.url, path.join(dir, "speech.mp3"));
      m.tts = { url: d.audio.url, local, duration: ffprobeDuration(local) };
      saveManifest(dir, m);
      log(c.id, `speech saved (${m.tts.duration ?? "?"}s)`);
    }
  }

  if (steps.includes("omnihuman")) {
    if (has("omnihuman")) log(c.id, "omnihuman cached");
    else {
      const image_url = await upload(m.portrait.local, "image/jpeg");
      const audio_url = await upload(m.tts.local, "audio/mpeg");
      const d = await run(
        "fal-ai/bytedance/omnihuman/v1.5",
        { image_url, audio_url, prompt: c.omniPrompt, resolution: "1080p", turbo_mode: false },
        c.id,
      );
      const local = await download(d.video.url, path.join(dir, "omnihuman.mp4"));
      m.omnihuman = { url: d.video.url, local, duration: d.duration };
      saveManifest(dir, m);
      log(c.id, `omnihuman saved (${d.duration}s)`);
    }
  }

  if (steps.includes("veo")) {
    if (has("veo")) log(c.id, "veo cached");
    else {
      const image_url = await upload(m.portrait.local, "image/jpeg");
      const prompt =
        c.veoPrompt ??
        `${c.veoDirection} The person looks into the camera and says: "${c.veoLine}" No subtitles, no captions, no on-screen text.`;
      const d = await run(
        "fal-ai/veo3.1/fast/image-to-video",
        {
          prompt,
          image_url,
          // Veo likes to burn garbled subtitles into dialogue clips; the negative prompt keeps the frame clean.
          negative_prompt: "subtitles, captions, closed captions, on-screen text, text overlay, lower third, watermark, logo",
          duration: "8s",
          resolution: "1080p",
          aspect_ratio: "16:9",
          generate_audio: true,
          safety_tolerance: "6",
          auto_fix: false,
        },
        c.id,
      );
      const local = await download(d.video.url, path.join(dir, "veo.mp4"));
      m.veo = { url: d.video.url, local, prompt };
      saveManifest(dir, m);
      log(c.id, "veo saved");
    }
  }

  if (steps.includes("lipsync")) {
    if (has("lipsync")) log(c.id, "lipsync cached");
    else {
      const video_url = await upload(m.veo.local, "video/mp4");
      const audio_url = await upload(m.tts.local, "audio/mpeg");
      const d = await run("fal-ai/sync-lipsync/v2", { video_url, audio_url, model: "lipsync-2-pro", sync_mode: "bounce" }, c.id);
      const local = await download(d.video.url, path.join(dir, "lipsync.mp4"));
      m.lipsync = { url: d.video.url, local };
      saveManifest(dir, m);
      log(c.id, "lipsync saved");
    }
  }

  if (steps.includes("mix")) {
    if (has("mix")) log(c.id, "mix cached");
    else {
      // Lay the TTS voiceover over the Veo clip's own audio (music/room tone), ducking the original.
      const { delayMs = 0, voiceGain = 1.5, musicGain = 0.5 } = c.mix ?? {};
      const local = path.join(dir, "mixed.mp4");
      execFileSync(FFMPEG, [
        "-y", "-loglevel", "error", "-i", m.veo.local, "-i", m.tts.local,
        "-filter_complex",
        `[1:a]adelay=${delayMs}|${delayMs},volume=${voiceGain}[vo];[0:a]volume=${musicGain}[bg];[bg][vo]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[a]`,
        "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", local,
      ]);
      m.mix = { local };
      saveManifest(dir, m);
      log(c.id, "mixed voiceover over veo clip");
    }
  }

  if (steps.includes("publish")) {
    const src = m[route]?.local;
    if (!src || !existsSync(src)) throw new Error(`${c.id}: no ${route} clip to publish`);
    mkdirSync(publicDir, { recursive: true });
    const mp4 = path.join(publicDir, `${c.id}.mp4`);
    const jpg = path.join(publicDir, `${c.id}.jpg`);
    // Transcode to 720p H.264 with faststart: ~2 MB per clip instead of ~7 MB, and playback starts immediately.
    execFileSync(FFMPEG, [
      "-y", "-loglevel", "error", "-i", src,
      "-vf", "scale=1280:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "128k", "-ac", "2", "-movflags", "+faststart", mp4,
    ]);
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-ss", "0.3", "-i", mp4, "-frames:v", "1", "-q:v", "4", jpg]);
    const seconds = ffprobeDuration(mp4);
    m.published = { route, mp4: path.relative(root, mp4), poster: path.relative(root, jpg), duration: seconds };
    saveManifest(dir, m);
    log(c.id, `published ${route} → public/videos/${c.id}.mp4 + .jpg (${seconds}s)`);
  }
}

const cast = only.length ? characters.filter((c) => only.includes(c.id)) : characters;
for (const c of cast) {
  try {
    await processCharacter(c);
  } catch (e) {
    console.error(`[${c.id}] ✗ ${e.message}`);
    process.exitCode = 1;
  }
}
