import React from "react";
import { AbsoluteFill } from "remotion";
import { display, mono, BG, INK, INK2, INK3, PERI, PERI_DIM } from "./theme";

// 1200×630 social share card — Periwinkle/Carbon "Audit Dossier" language.
export const OgCard: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      {/* spectral wash */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 22% 18%, rgba(79,216,196,0.07) 0%, transparent 60%)," +
            "radial-gradient(ellipse 50% 55% at 85% 85%, rgba(124,140,255,0.08) 0%, transparent 62%)",
          filter: "blur(40px)",
        }}
      />
      {/* blueprint grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(145,162,255,0.05) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(145,162,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 45%, #000 0%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 45%, #000 0%, transparent 85%)",
        }}
      />
      {/* giant clause watermark */}
      <div
        style={{
          position: "absolute", right: -40, bottom: -120,
          fontFamily: display, fontWeight: 800, fontSize: 460, lineHeight: 1,
          letterSpacing: "-0.05em", color: "transparent",
          WebkitTextStroke: "1.5px rgba(145,162,255,0.07)", userSelect: "none",
        }}
      >
        §4
      </div>

      {/* content */}
      <div style={{ position: "absolute", inset: 0, padding: "64px 72px", display: "flex", flexDirection: "column" }}>
        {/* brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 16, height: 16, borderTop: `3px solid ${PERI}`, borderLeft: `3px solid ${PERI}`, display: "inline-block" }} />
          <span style={{ fontFamily: display, fontSize: 30, fontWeight: 800, color: INK }}>AI Safe@Work</span>
        </div>

        {/* REF chip */}
        <div style={{ marginTop: 40 }}>
          <span
            style={{
              fontFamily: mono, fontSize: 17, fontWeight: 700, letterSpacing: "0.22em",
              color: PERI, border: "1.5px solid rgba(145,162,255,0.5)", borderRadius: 3, padding: "6px 16px",
            }}
          >
            REF · EU AI ACT 2024/1689
          </span>
        </div>

        {/* headline */}
        <h1
          style={{
            fontFamily: display, fontSize: 78, fontWeight: 800, lineHeight: 1.02,
            letterSpacing: "-0.03em", color: INK, margin: "26px 0 0", maxWidth: 980,
          }}
        >
          Safe AI adoption.
          <br />
          Operational governance.
        </h1>

        {/* sub */}
        <p style={{ fontFamily: display, fontSize: 27, lineHeight: 1.4, color: INK2, margin: "24px 0 0", maxWidth: 860 }}>
          A free, plain-English course for using AI at work without leaking data,
          breaking the law, or getting fooled.
        </p>

        {/* footer rule + standards */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: mono, fontSize: 17, letterSpacing: "0.16em", color: INK3 }}>
            EU AI ACT · GDPR · ISO/IEC 42001 · ISO/IEC 27001
          </span>
          <span style={{ fontFamily: mono, fontSize: 17, letterSpacing: "0.12em", color: PERI_DIM }}>
            aisafeatwork.org
          </span>
        </div>
      </div>
      {/* top hairline accent */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "38%", height: 4, background: PERI }} />
    </AbsoluteFill>
  );
};
