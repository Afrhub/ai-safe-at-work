import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BG, PERI, PERI_DIM, INK, INK3, mono, body } from "./theme";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateRight: "clamp",
  });
  const drift = Math.sin(frame / 240) * 14;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* spectral wash, very low */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 55% 42% at 24% 18%, rgba(79,216,196,0.06) 0%, transparent 58%)," +
            "radial-gradient(ellipse 48% 40% at 82% 78%, rgba(124,140,255,0.055) 0%, transparent 62%)",
          filter: "blur(30px)",
        }}
      />
      {/* blueprint grid, two scales */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(145,162,255,0.04) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(145,162,255,0.04) 1px, transparent 1px)," +
            "linear-gradient(to right, rgba(255,255,255,0.016) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(255,255,255,0.016) 1px, transparent 1px)",
          backgroundSize: "176px 176px, 176px 176px, 30px 30px, 30px 30px",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 45%, #000 0%, transparent 82%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 45%, #000 0%, transparent 82%)",
        }}
      />
      {/* watermark clause, slow drift */}
      <div
        style={{
          position: "absolute",
          right: -30,
          bottom: -60,
          fontFamily: body,
          fontWeight: 800,
          fontSize: 360,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(145,162,255,0.07)",
          transform: `translateY(${drift}px)`,
          userSelect: "none",
        }}
      >
        §28
      </div>
      {/* brand row */}
      <div style={{ position: "absolute", top: 52, left: 70, display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            width: 14,
            height: 14,
            borderTop: `3px solid ${PERI}`,
            borderLeft: `3px solid ${PERI}`,
            display: "inline-block",
          }}
        />
        <span style={{ fontFamily: body, fontSize: 25, fontWeight: 700, letterSpacing: 0, color: INK }}>
          AI Safe@Work
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 56,
          right: 72,
          fontFamily: mono,
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: PERI_DIM,
        }}
      >
        REF AISW·M02
      </div>
      {/* progress measure */}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: "100%", background: "rgba(255,255,255,0.07)" }}>
        <div style={{ height: "100%", width: `${progress * 100}%`, background: PERI }} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: 16,
          fontFamily: mono,
          fontSize: 14,
          letterSpacing: "0.16em",
          color: INK3,
        }}
      >
        {String(Math.round(progress * 100)).padStart(3, "0")} / 100
      </div>
    </AbsoluteFill>
  );
};
