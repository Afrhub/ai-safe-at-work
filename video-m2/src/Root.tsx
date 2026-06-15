import "./index.css";
import React from "react";
import { Composition, staticFile } from "remotion";
import { Module2 } from "./Module2";
import { SCENES, FPS } from "./script";
import { getAudioDuration } from "./get-audio-duration";
import { AUDIO_EXT } from "./theme";

const TAIL = Math.round(0.5 * FPS); // default breathing room after each scene's narration

// Longer holds at specific transitions (founder feedback): a beat before the
// versions segment, before "Trained on", and before the postcard/takeaway turn.
const LONG_TAIL = Math.round(1.1 * FPS);
const EXTRA_TAIL: Record<string, number> = {
  "02-five-questions": LONG_TAIL, // pause before the four-versions intro (~0:52)
  "05-team-enterprise": LONG_TAIL, // pause before "Trained on" (~2:32)
  "07-postcard": LONG_TAIL, // pause before the takeaway (~3:10)
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Module2"
      component={Module2}
      fps={FPS}
      width={1920}
      height={1080}
      durationInFrames={300}
      defaultProps={{ sceneDurations: SCENES.map(() => 90) }}
      calculateMetadata={async () => {
        const durations = await Promise.all(
          SCENES.map((s) => getAudioDuration(staticFile(`voiceover/m2/${s.id}.${AUDIO_EXT}`))),
        );
        const sceneDurations = durations.map(
          (d, i) => Math.ceil(d * FPS) + (EXTRA_TAIL[SCENES[i].id] ?? TAIL),
        );
        return {
          durationInFrames: sceneDurations.reduce((a, b) => a + b, 0),
          props: { sceneDurations },
        };
      }}
    />
  );
};
