import React from "react";
import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { SCENES } from "./script";
import { Scene } from "./Scene";
import { Background } from "./Background";
import { Subtitles } from "./Subtitles";

export const Module1: React.FC<{ sceneDurations: number[] }> = ({ sceneDurations }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#08090b" }}>
      <Background />
      <Series>
        {SCENES.map((s, i) => (
          <Series.Sequence
            key={s.id}
            durationInFrames={Math.max(30, Math.round(sceneDurations[i] ?? 90))}
          >
            <Scene scene={s} />
            <Subtitles sceneId={s.id} />
            <Audio src={staticFile(`voiceover/m1/${s.id}.mp3`)} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
