import "./index.css";
import React from "react";
import { Composition, staticFile } from "remotion";
import { Module2 } from "./Module2";
import { SCENES, FPS } from "./script";
import { getAudioDuration } from "./get-audio-duration";
import { AUDIO_EXT } from "./theme";

const TAIL = Math.round(0.5 * FPS); // breathing room after each scene's narration

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
        const sceneDurations = durations.map((d) => Math.ceil(d * FPS) + TAIL);
        return {
          durationInFrames: sceneDurations.reduce((a, b) => a + b, 0),
          props: { sceneDurations },
        };
      }}
    />
  );
};
