import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadBody } from "@remotion/google-fonts/Manrope";
import type { Scene as SceneData } from "./script";
import { STORY_COMPONENTS } from "./Stories";
import { Icon } from "./icons";

const display = loadDisplay().fontFamily;
const body = loadBody().fontFamily;

const ACCENT = "#e8a726";
const TEXT = "#e9e9ec";
const TEXT2 = "#8b8d96";

const up = (frame: number, fps: number, delay: number) =>
  spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 20 });

export const Scene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const StoryComp = STORY_COMPONENTS[scene.id];
  if (StoryComp) return <StoryComp />;

  const kick = up(frame, fps, 2);
  const title = up(frame, fps, 8);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 160px 230px", textAlign: "center" }}>
      <div
        style={{
          fontFamily: body,
          fontSize: 24,
          fontWeight: 600,
          color: ACCENT,
          opacity: kick,
          transform: `translateY(${interpolate(kick, [0, 1], [12, 0])}px)`,
          marginBottom: 22,
        }}
      >
        {scene.kicker}
      </div>

      <h1
        style={{
          fontFamily: display,
          fontSize: scene.title.length > 28 ? 84 : 104,
          fontWeight: 700,
          lineHeight: 1.04,
          letterSpacing: -1.8,
          color: TEXT,
          margin: 0,
          maxWidth: 1440,
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [26, 0])}px)`,
        }}
      >
        {scene.title}
      </h1>

      {scene.bullets ? <Bullets bullets={scene.bullets} /> : null}
    </AbsoluteFill>
  );
};

const Bullets: React.FC<{ bullets: string[] }> = ({ bullets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ marginTop: 58, display: "flex", flexDirection: "column", gap: 16, maxWidth: 1180, width: "100%" }}>
      {bullets.map((b, i) => {
        const a = up(frame, fps, 22 + i * 8);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "22px 30px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 14,
              opacity: a,
              transform: `translateY(${interpolate(a, [0, 1], [14, 0])}px)`,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(232,167,38,0.10)",
                border: "1px solid rgba(232,167,38,0.35)",
                color: ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="check" size={22} color={ACCENT} />
            </span>
            <span style={{ fontFamily: body, fontSize: 38, fontWeight: 600, color: TEXT, textAlign: "left" }}>{b}</span>
          </div>
        );
      })}
    </div>
  );
};
