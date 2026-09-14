#!/usr/bin/env node
// Transcribes an audio/video file with Whisper on fal, to check what a generated clip actually says.
//   FAL_KEY=... node scripts/transcribe.mjs path/to/clip.mp3 [more files]
import { fal } from "@fal-ai/client";
import { readFileSync } from "node:fs";
fal.config({ credentials: process.env.FAL_KEY });
for (const file of process.argv.slice(2)) {
  const audio_url = await fal.storage.upload(new Blob([readFileSync(file)], { type: "audio/mpeg" }));
  const { data } = await fal.subscribe("fal-ai/whisper", { input: { audio_url, task: "transcribe", language: "en" } });
  console.log(`${file}:\n  ${data.text}`);
}
