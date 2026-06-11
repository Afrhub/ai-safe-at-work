import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene as SceneData } from "./script";
import { STORY_COMPONENTS } from "./Scenes2";
import { display, body, mono, INK, INK2, PERI, PLATE, BORDER, BORDER_BOLD } from "./theme";

export const up = (frame: number, fps: number, delay: number) =>
  spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 20 });

export const Kicker: React.FC<{ text: string; a: number }> = ({ text, a }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 16,
      opacity: a,
      transform: `translateY(${interpolate(a, [0, 1], [12, 0])}px)`,
      marginBottom: 26,
    }}
  >
    <span
      style={{
        fontFamily: mono,
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: "0.2em",
        color: PERI,
        border: `1.5px solid rgba(145,162,255,0.5)`,
        borderRadius: 3,
        padding: "5px 14px",
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
    <span
      style={{
        width: 120,
        height: 1,
        background:
          "repeating-linear-gradient(90deg, rgba(145,162,255,0.5) 0, rgba(145,162,255,0.5) 7px, transparent 7px, transparent 13px)",
      }}
    />
  </div>
);

export const Scene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const StoryComp = STORY_COMPONENTS[scene.id];
  if (StoryComp) return <StoryComp />;

  const kick = up(frame, fps, 2);
  const title = up(frame, fps, 8);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: "0 160px 230px", textAlign: "center" }}
    >
      <Kicker text={scene.kicker} a={kick} />
      <h1
        style={{
          fontFamily: display,
          fontSize: scene.title.length > 30 ? 78 : 96,
          fontWeight: 800,
          lineHeight: 1.06,
          letterSpacing: -0.5,
          color: INK,
          margin: 0,
          maxWidth: 1480,
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [26, 0])}px)`,
        }}
      >
        {scene.title}
      </h1>
      {scene.bullets ? <Manifest bullets={scene.bullets} /> : null}
    </AbsoluteFill>
  );
};

// Dossier manifest rows: numbered, ruled, plate-backed.
const Manifest: React.FC<{ bullets: string[] }> = ({ bullets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ marginTop: 54, display: "flex", flexDirection: "column", gap: 14, maxWidth: 1160, width: "100%" }}>
      {bullets.map((b, i) => {
        const a = up(frame, fps, 24 + i * 9);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "20px 30px",
              background: PLATE,
              border: `1px solid ${BORDER}`,
              borderLeft: `2px solid rgba(145,162,255,0.6)`,
              borderRadius: 3,
              opacity: a,
              transform: `translateY(${interpolate(a, [0, 1], [14, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: mono,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: PERI,
                flexShrink: 0,
                width: 46,
                textAlign: "left",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ fontFamily: body, fontSize: 36, fontWeight: 700, color: INK, textAlign: "left" }}>{b}</span>
          </div>
        );
      })}
    </div>
  );
};

// Shared plate used by custom scenes.
export const Plate: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      position: "relative",
      background: PLATE,
      border: `1px solid ${BORDER}`,
      borderRadius: 3,
      ...style,
    }}
  >
    {/* crop marks */}
    <div
      style={{
        position: "absolute",
        inset: 5,
        pointerEvents: "none",
        background:
          `linear-gradient(${BORDER_BOLD}, ${BORDER_BOLD}) top left / 9px 1.5px no-repeat,` +
          `linear-gradient(${BORDER_BOLD}, ${BORDER_BOLD}) top left / 1.5px 9px no-repeat,` +
          `linear-gradient(${BORDER_BOLD}, ${BORDER_BOLD}) bottom right / 9px 1.5px no-repeat,` +
          `linear-gradient(${BORDER_BOLD}, ${BORDER_BOLD}) bottom right / 1.5px 9px no-repeat`,
      }}
    />
    {children}
  </div>
);

export const MonoLabel: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({
  children,
  color = INK2,
  size = 17,
}) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </span>
);
