// Generate narration MP3s + word-level caption JSON via ElevenLabs with-timestamps.
// Run: node --strip-types scripts/generate-captions.ts
import { writeFileSync, mkdirSync } from "node:fs";
import { SCENES, VOICE_ID } from "../src/script.ts";

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("ELEVENLABS_API_KEY missing");
  process.exit(1);
}

const OUT = "public/voiceover/m2";
mkdirSync(OUT, { recursive: true });

interface Caption {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
}

// Turn ElevenLabs character alignment into word-level captions.
function toCaptions(
  chars: string[],
  starts: number[],
  ends: number[],
): Caption[] {
  const caps: Caption[] = [];
  let word = "";
  let wStart = 0;
  let wEnd = 0;
  let open = false;
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
    word = "";
    open = false;
  };
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c === " " || c === "\n") {
      flush();
      continue;
    }
    if (!open) {
      wStart = starts[i];
      open = true;
    }
    word += c;
    wEnd = ends[i];
  }
  flush();
  return caps;
}

for (const scene of SCENES) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`,
    {
      method: "POST",
      headers: {
        "xi-api-key": KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text: scene.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.25 },
      }),
    },
  );
  if (!res.ok) {
    console.error(`FAIL ${scene.id}: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const data = await res.json();
  const align = data.alignment ?? data.normalized_alignment;
  writeFileSync(`${OUT}/${scene.id}.mp3`, Buffer.from(data.audio_base64, "base64"));
  const caps = toCaptions(
    align.characters,
    align.character_start_times_seconds,
    align.character_end_times_seconds,
  );
  writeFileSync(`${OUT}/${scene.id}.json`, JSON.stringify(caps));
  console.log(`${scene.id}: mp3 + ${caps.length} caption words`);
}
console.log("captions done");
