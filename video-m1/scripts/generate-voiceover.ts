// Generate per-scene narration MP3s with ElevenLabs.
// Run: node --strip-types scripts/generate-voiceover.ts
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { SCENES, VOICE_ID } from "../src/script.ts";

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("ELEVENLABS_API_KEY missing");
  process.exit(1);
}

const OUT = "public/voiceover/m1";
mkdirSync(OUT, { recursive: true });

for (const scene of SCENES) {
  const file = `${OUT}/${scene.id}.mp3`;
  if (existsSync(file)) {
    console.log(`skip ${scene.id} (exists)`);
    continue;
  }
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
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
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(`wrote ${scene.id}.mp3`);
}
console.log("voiceover done");
