import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadBody } from "@remotion/google-fonts/Manrope";

const body = loadBody().fontFamily;
const ACCENT = "#e8a726";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#08090b" }}>
      {/* restrained single glow */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 65% 50% at 50% 18%, rgba(232,167,38,0.05) 0%, transparent 62%)" }} />
      {/* faint grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 45%, #000 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 45%, #000 0%, transparent 80%)",
        }}
      />
      {/* wordmark */}
      <div style={{ position: "absolute", top: 54, left: 70, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", color: "#08090b", fontFamily: body, fontWeight: 800, fontSize: 16 }}>A</span>
        <span style={{ fontFamily: body, fontSize: 24, fontWeight: 700, letterSpacing: -0.3, color: "#e9e9ec" }}>AI Safe@Work</span>
      </div>
      <div style={{ position: "absolute", top: 60, right: 72, fontFamily: body, fontSize: 19, fontWeight: 500, color: "#5f616b" }}>Module 1</div>
      {/* progress */}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: "100%", background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", width: `${progress * 100}%`, background: ACCENT }} />
      </div>
    </AbsoluteFill>
  );
};
