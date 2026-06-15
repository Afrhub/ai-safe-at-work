import React from "react";
import {
  AbsoluteFill, Audio, Series, interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { Subtitles } from "./Subtitles";
import { up, Kicker, Plate, MonoLabel } from "./Scene";
import {
  display, body, mono, BG, INK, INK2, INK3, SILVER, PERI, PERI_DIM, GREEN, RED, BORDER, AUDIO_EXT,
} from "./theme";

/* ── Generic scene data ─────────────────────────────────────────────── */
export interface GScene {
  id: string;
  kicker: string;
  title: string;
  text: string;            // narration → drives duration
  type?: "title" | "manifest" | "stat" | "compare" | "flow" | "stamp";
  bullets?: string[];
  stat?: { value: string; label: string };
  columns?: { head: string; tone: "good" | "bad"; body: string }[];
  steps?: string[];
  stamp?: { word: string; tone: "red" | "green" | "peri" };
  takeaway?: string;       // optional emphasised closing line
}

export interface ModuleSpec {
  id: string;              // e.g. "Module3"
  dir: string;            // audio dir, e.g. "m3"
  ref: string;            // e.g. "REF AISW·M03"
  watermark: string;      // e.g. "§3"
  scenes: GScene[];
}

/* ── Generic background (parallax-lite, module-tagged) ──────────────── */
export const GBackground: React.FC<{ refLabel: string; watermark: string }> = ({ refLabel, watermark }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], { extrapolateRight: "clamp" });
  const drift = Math.sin(frame / 240) * 14;
  const hue = (frame * 0.06) % 360;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 55% 42% at 24% 18%, rgba(79,216,196,0.06) 0%, transparent 58%)," +
            "radial-gradient(ellipse 48% 40% at 82% 78%, rgba(124,140,255,0.055) 0%, transparent 62%)",
          filter: `blur(34px) hue-rotate(${hue}deg)`,
        }}
      />
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
      <div
        style={{
          position: "absolute", right: -30, bottom: -60, fontFamily: body, fontWeight: 800,
          fontSize: 360, lineHeight: 1, color: "transparent",
          WebkitTextStroke: "1.5px rgba(145,162,255,0.07)", transform: `translateY(${drift}px)`, userSelect: "none",
        }}
      >
        {watermark}
      </div>
      <div style={{ position: "absolute", top: 52, left: 70, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 14, height: 14, borderTop: `3px solid ${PERI}`, borderLeft: `3px solid ${PERI}`, display: "inline-block" }} />
        <span style={{ fontFamily: body, fontSize: 25, fontWeight: 700, color: INK }}>AI Safe@Work</span>
      </div>
      <div style={{ position: "absolute", top: 56, right: 72, fontFamily: mono, fontSize: 17, fontWeight: 700, letterSpacing: "0.18em", color: PERI_DIM }}>
        {refLabel}
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: "100%", background: "rgba(255,255,255,0.07)" }}>
        <div style={{ height: "100%", width: `${progress * 100}%`, background: PERI }} />
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 16, fontFamily: mono, fontSize: 14, letterSpacing: "0.16em", color: INK3 }}>
        {String(Math.round(progress * 100)).padStart(3, "0")} / 100
      </div>
    </AbsoluteFill>
  );
};

const H1: React.CSSProperties = { fontFamily: display, fontWeight: 800, lineHeight: 1.05, color: INK, margin: 0 };

/* ── Motif renderer ─────────────────────────────────────────────────── */
const SceneBody: React.FC<{ scene: GScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kick = up(frame, fps, 2);
  const title = up(frame, fps, 8);
  const t = scene.type ?? (scene.bullets ? "manifest" : scene.stat ? "stat" : scene.columns ? "compare" : scene.steps ? "flow" : scene.stamp ? "stamp" : "title");
  const titleSize = scene.title.length > 34 ? 70 : 90;

  const Title = (
    <h1 style={{ ...H1, fontSize: titleSize, maxWidth: 1500, opacity: title, transform: `translateY(${interpolate(title, [0, 1], [26, 0])}px)`, textAlign: "center" }}>
      {scene.title}
    </h1>
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 150px 230px", textAlign: "center" }}>
      <Kicker text={scene.kicker} a={kick} />
      {Title}

      {t === "manifest" && scene.bullets ? (
        <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 14, maxWidth: 1160, width: "100%" }}>
          {scene.bullets.map((b, i) => {
            const a = up(frame, fps, 24 + i * 9);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, padding: "18px 30px", background: "rgba(12,12,17,0.86)", border: `1px solid ${BORDER}`, borderLeft: `2px solid ${PERI_DIM}`, borderRadius: 3, opacity: a, transform: `translateY(${interpolate(a, [0, 1], [14, 0])}px)` }}>
                <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: PERI, width: 46, textAlign: "left" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: body, fontSize: 34, fontWeight: 700, color: INK, textAlign: "left" }}>{b}</span>
              </div>
            );
          })}
        </div>
      ) : null}

      {t === "stat" && scene.stat ? (
        <div style={{ marginTop: 40, opacity: up(frame, fps, 24), transform: `scale(${interpolate(up(frame, fps, 24), [0, 1], [0.86, 1])})` }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 220, lineHeight: 1, color: INK, letterSpacing: "-0.04em" }}>{scene.stat.value}</div>
          <MonoLabel color={PERI} size={26}>{scene.stat.label}</MonoLabel>
        </div>
      ) : null}

      {t === "compare" && scene.columns ? (
        <div style={{ marginTop: 54, display: "flex", gap: 26, maxWidth: 1320, width: "100%" }}>
          {scene.columns.map((c, i) => {
            const a = up(frame, fps, 26 + i * 12);
            const tone = c.tone === "good" ? GREEN : RED;
            return (
              <Plate key={i} style={{ flex: 1, padding: "30px 34px", textAlign: "left", borderTop: `3px solid ${tone}`, opacity: a, transform: `translateY(${interpolate(a, [0, 1], [16, 0])}px)` }}>
                <MonoLabel color={tone} size={20}>{c.head}</MonoLabel>
                <p style={{ fontFamily: body, fontSize: 30, lineHeight: 1.4, color: INK2, marginTop: 16 }}>{c.body}</p>
              </Plate>
            );
          })}
        </div>
      ) : null}

      {t === "flow" && scene.steps ? (
        <div style={{ marginTop: 60, display: "flex", alignItems: "center", justifyContent: "center", gap: 0, maxWidth: 1500, flexWrap: "wrap" }}>
          {scene.steps.map((s, i) => {
            const a = up(frame, fps, 26 + i * 14);
            return (
              <React.Fragment key={i}>
                <Plate style={{ padding: "24px 28px", opacity: a, transform: `translateY(${interpolate(a, [0, 1], [14, 0])}px)`, maxWidth: 320 }}>
                  <span style={{ fontFamily: mono, fontSize: 13, color: PERI_DIM, letterSpacing: "0.14em" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div style={{ fontFamily: body, fontSize: 27, fontWeight: 700, color: INK, marginTop: 8 }}>{s}</div>
                </Plate>
                {i < scene.steps!.length - 1 ? (
                  <span style={{ color: PERI, fontSize: 34, margin: "0 14px", opacity: up(frame, fps, 32 + i * 14) }}>→</span>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      ) : null}

      {t === "stamp" && scene.stamp ? (
        <div style={{ marginTop: 70 }}>
          <div
            style={{
              display: "inline-block", transform: `rotate(-6deg) scale(${interpolate(up(frame, fps, 40), [0, 1], [1.6, 1])})`,
              opacity: up(frame, fps, 40) * 0.95, fontFamily: mono, fontSize: 56, fontWeight: 700, letterSpacing: "0.18em",
              color: scene.stamp.tone === "red" ? RED : scene.stamp.tone === "green" ? GREEN : PERI,
              border: `5px double ${scene.stamp.tone === "red" ? RED : scene.stamp.tone === "green" ? GREEN : PERI}`,
              borderRadius: 5, padding: "18px 40px",
            }}
          >
            {scene.stamp.word}
          </div>
        </div>
      ) : null}

      {scene.takeaway ? (
        <div style={{ marginTop: 54, fontFamily: display, fontSize: 46, fontWeight: 800, color: INK, opacity: up(frame, fps, 60), maxWidth: 1400 }}>
          {scene.takeaway}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ── Module video ───────────────────────────────────────────────────── */
export const ModuleVideo: React.FC<{ spec: ModuleSpec; sceneDurations: number[] }> = ({ spec, sceneDurations }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <GBackground refLabel={spec.ref} watermark={spec.watermark} />
      <Series>
        {spec.scenes.map((s, i) => (
          <Series.Sequence key={s.id} durationInFrames={Math.max(30, Math.round(sceneDurations[i] ?? 90))}>
            <SceneBody scene={s} />
            <Subtitles sceneId={s.id} dir={spec.dir} />
            <Audio src={staticFile(`voiceover/${spec.dir}/${s.id}.${AUDIO_EXT}`)} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
