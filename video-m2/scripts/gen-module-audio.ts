// Generate narration MP3s + word-level caption JSON for ONE module via
// ElevenLabs with-timestamps. Run:
//   node --strip-types scripts/gen-module-audio.ts Module3
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { MODULES } from "../src/modules.ts";
import { VOICE_ID } from "../src/script.ts";

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.error("ELEVENLABS_API_KEY missing"); process.exit(1); }

const target = process.argv[2];
if (!target) { console.error("usage: gen-module-audio.ts <ModuleId>  (e.g. Module3)"); process.exit(1); }
const spec = MODULES.find((m) => m.id === target || m.dir === target);
if (!spec) { console.error(`unknown module: ${target}`); process.exit(1); }

const OUT = `public/voiceover/${spec.dir}`;
mkdirSync(OUT, { recursive: true });

interface Caption { text: string; startMs: number; endMs: number; timestampMs: number | null; confidence: number | null; }

function toCaptions(chars: string[], starts: number[], ends: number[]): Caption[] {
  const caps: Caption[] = [];
  let word = "", wStart = 0, wEnd = 0, open = false;
  const flush = () => {
    if (word.trim().length) {
      caps.push({
        text: (caps.length ? " " : "") + word.trim(),
        startMs: Math.round(wStart * 1000),
        endMs: Math.round(wEnd * 1000),
        timestampMs: Math.round(((wStart + wEnd) / 2) * 1000),
        confidence: null,
      });
    }
    word = ""; open = false;
  };
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c === " " || c === "\n") { flush(); continue; }
    if (!open) { wStart = starts[i]; open = true; }
    word += c; wEnd = ends[i];
  }
  flush();
  return caps;
}

for (const scene of spec.scenes) {
  const mp3 = `${OUT}/${scene.id}.mp3`;
  if (existsSync(mp3) && existsSync(`${OUT}/${scene.id}.json`)) {
    console.log(`skip ${spec.dir}/${scene.id} (exists)`);
    continue;
  }
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`,
    {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        text: scene.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.25 },
      }),
    },
  );
  if (!res.ok) { console.error(`FAIL ${scene.id}: ${res.status} ${await res.text()}`); process.exit(1); }
  const data = await res.json();
  const align = data.alignment ?? data.normalized_alignment;
  writeFileSync(mp3, Buffer.from(data.audio_base64, "base64"));
  writeFileSync(`${OUT}/${scene.id}.json`, JSON.stringify(toCaptions(align.characters, align.character_start_times_seconds, align.character_end_times_seconds)));
  console.log(`${spec.dir}/${scene.id}: mp3 + caption words`);
}
console.log(`${spec.id} audio done`);
