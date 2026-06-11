// Placeholder narration via macOS `say` (until ELEVENLABS_API_KEY is available).
// Generates per-scene WAVs + evenly-weighted word-timing caption JSON.
// Run: node --experimental-strip-types scripts/gen-placeholder-voiceover.mjs
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { SCENES } from "../src/script.ts";

const OUT = "public/voiceover/m2";
const VOICE = "Daniel"; // en_GB
mkdirSync(OUT, { recursive: true });

function durationOf(file) {
  const info = execFileSync("afinfo", [file], { encoding: "utf-8" });
  const m = info.match(/estimated duration:\s*([\d.]+)/);
  if (!m) throw new Error(`no duration in afinfo for ${file}`);
  return parseFloat(m[1]);
}

// Distribute word timings across the audio, weighted by word length.
function evenCaptions(text, durMs) {
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => w.length + 2.5); // +pause weight
  const total = weights.reduce((a, b) => a + b, 0);
  const usable = durMs * 0.97;
  const caps = [];
  let t = 0;
  for (let i = 0; i < words.length; i++) {
    const span = (weights[i] / total) * usable;
    const startMs = Math.round(t);
    const endMs = Math.round(t + span * 0.86);
    caps.push({
      text: (i === 0 ? "" : " ") + words[i],
      startMs,
      endMs,
      timestampMs: Math.round((startMs + endMs) / 2),
      confidence: null,
    });
    t += span;
  }
  return caps;
}

for (const scene of SCENES) {
  const wav = `${OUT}/${scene.id}.wav`;
  console.log(`tts ${scene.id}…`);
  execFileSync("say", ["-v", VOICE, "-o", wav, "--data-format=LEI16@22050", scene.text]);
  const durMs = durationOf(wav) * 1000;
  writeFileSync(`${OUT}/${scene.id}.json`, JSON.stringify(evenCaptions(scene.text, durMs)));
  console.log(`  ${(durMs / 1000).toFixed(1)}s + captions`);
}
console.log("done");
