import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadBody } from "@remotion/google-fonts/Manrope";
import { Icon } from "./icons";

const display = loadDisplay().fontFamily;
const body = loadBody().fontFamily;

const ACCENT = "#e8a726";
const DANGER = "#e5484d";
const TEXT = "#e9e9ec";
const TEXT2 = "#8b8d96";
const TEXT3 = "#5f616b";
const SURFACE = "rgba(255,255,255,0.025)";
const SURFACE2 = "rgba(255,255,255,0.045)";
const LINE = "1px solid rgba(255,255,255,0.09)";
const num = { fontVariantNumeric: "tabular-nums" as const };

const Stage: React.FC<{ eyebrow: string; title: string; children: React.ReactNode }> = ({ eyebrow, title, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame, fps, durationInFrames: 16, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 124 }}>
      <div style={{ opacity: a, transform: `translateY(${(1 - a) * -8}px)`, textAlign: "center", marginBottom: 52 }}>
        <div style={{ fontFamily: body, fontSize: 23, fontWeight: 600, color: ACCENT, marginBottom: 12 }}>{eyebrow}</div>
        <div style={{ fontFamily: display, fontSize: 66, fontWeight: 700, letterSpacing: -1.6, color: TEXT, lineHeight: 1.02 }}>{title}</div>
      </div>
      <div style={{ position: "relative", width: 1520, height: 560 }}>{children}</div>
    </AbsoluteFill>
  );
};

const useSeg = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  return (a: number, b: number) =>
    interpolate(frame, [a * D, b * D], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};
const rise = (p: number): React.CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * 16}px)` });

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: SURFACE, border: LINE, borderRadius: 16, fontFamily: body, color: TEXT, ...style }}>
    {children}
  </div>
);

const CardHead: React.FC<{ icon: string; label: string; color?: string }> = ({ icon, label, color = TEXT2 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
    <span style={{ width: 38, height: 38, borderRadius: 9, background: SURFACE2, border: LINE, display: "flex", alignItems: "center", justifyContent: "center", color }}>
      <Icon name={icon} size={22} />
    </span>
    <span style={{ fontFamily: body, fontSize: 22, fontWeight: 600, color: TEXT }}>{label}</span>
  </div>
);

const Tag: React.FC<{ text: string; color?: string }> = ({ text, color = DANGER }) => (
  <span style={{ fontFamily: body, fontSize: 16, fontWeight: 600, color, border: `1px solid ${color}55`, background: `${color}1a`, borderRadius: 6, padding: "3px 10px", letterSpacing: 0.2 }}>{text}</span>
);

const CostRow: React.FC<{ icon: string; text: string; p: number; left: number }> = ({ icon, text, p, left }) => (
  <Card style={{ left, top: 470, width: 446, padding: "20px 22px", borderLeft: `2px solid ${DANGER}`, display: "flex", alignItems: "center", gap: 14, ...rise(p) }}>
    <Icon name={icon} size={24} color={DANGER} />
    <span style={{ fontSize: 23, color: TEXT }}>{text}</span>
  </Card>
);

/* ── Story 1 — the intern ── */
export const Story1: React.FC = () => {
  const seg = useSeg();
  const rows = Math.round(interpolate(seg(0.03, 0.24), [0, 1], [0, 40000]));
  const flow = seg(0.27, 0.42);
  const ai = seg(0.3, 0.42);
  const later = seg(0.58, 0.72);
  const c1 = seg(0.74, 0.82), c2 = seg(0.8, 0.88), c3 = seg(0.86, 0.94);
  return (
    <>
      <Card style={{ left: 30, top: 24, width: 540, padding: "26px 28px", ...rise(seg(0, 0.12)) }}>
        <CardHead icon="table" label="customers.xlsx" />
        {["Name", "Address", "Order ID", "Purchase date"].map((r, i) => (
          <div key={i} style={{ fontFamily: body, fontSize: 21, color: i === 0 ? TEXT2 : TEXT, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", opacity: interpolate(seg(0.04 + i * 0.02, 0.12 + i * 0.02), [0, 1], [0, 1]) }}>{r}</div>
        ))}
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 22 }}>
          <span style={{ fontFamily: display, fontSize: 56, fontWeight: 700, color: TEXT, ...num }}>{rows.toLocaleString("en-US")}</span>
          <span style={{ fontFamily: body, fontSize: 20, color: TEXT2 }}>rows pasted in</span>
        </div>
      </Card>

      <div style={{ position: "absolute", left: 590, top: 150, color: TEXT3, opacity: flow }}>
        <Icon name="arrowRight" size={54} />
      </div>

      <Card style={{ right: 30, top: 24, width: 560, padding: "26px 28px", ...rise(seg(0.28, 0.4)) }}>
        <CardHead icon="cpu" label="Public AI chat tool" color={ACCENT} />
        <div style={{ fontSize: 23, color: TEXT2 }}>"Clean and sort this customer list."</div>
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 22, color: TEXT, opacity: ai, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="check" size={22} color={TEXT2} /> Returned tidy. Manager approved the work.
        </div>
      </Card>

      <Card style={{ left: 30, top: 322, width: 1460, padding: "20px 26px", display: "flex", alignItems: "center", gap: 16, ...rise(later) }}>
        <span style={{ fontFamily: body, fontSize: 18, fontWeight: 700, color: ACCENT, letterSpacing: 0.5 }}>Six months later</span>
        <span style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)" }} />
        <Icon name="search" size={24} color={DANGER} />
        <span style={{ fontSize: 23, color: TEXT }}>The customer list is now searchable on the public web.</span>
      </Card>

      <CostRow icon="mail" text="Notice from the regulator" p={c1} left={30} />
      <CostRow icon="alert" text="Every customer warned" p={c2} left={537} />
      <CostRow icon="userX" text="Enterprise client lost" p={c3} left={1044} />
    </>
  );
};

/* ── Story 2 — the lawyer ── */
export const Story2: React.FC = () => {
  const seg = useSeg();
  return (
    <>
      <Card style={{ left: 40, top: 8, width: 700, padding: "26px 30px", ...rise(seg(0, 0.12)) }}>
        <CardHead icon="fileText" label="Court filing · cases cited" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const inP = seg(0.14 + i * 0.04, 0.22 + i * 0.04);
          const bad = seg(0.6 + i * 0.025, 0.68 + i * 0.025);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "9px 0", padding: "13px 16px", border: LINE, borderRadius: 10, background: SURFACE, fontFamily: body, fontSize: 20, ...rise(inP), ...num }}>
              <span style={{ color: TEXT }}>Reference No. {4471 + i * 137} v. State</span>
              <span style={{ opacity: bad }}><Tag text="Fabricated" /></span>
            </div>
          );
        })}
      </Card>

      <Card style={{ right: 40, top: 90, width: 560, padding: "30px 32px", ...rise(seg(0.66, 0.78)) }}>
        <CardHead icon="scale" label="The court checked" />
        <div style={{ fontFamily: display, fontSize: 34, fontWeight: 700, color: TEXT, lineHeight: 1.15, marginBottom: 16 }}>None of the cases existed.</div>
        <div style={{ fontSize: 22, color: TEXT2, lineHeight: 1.5 }}>Public sanction. Reputation hit. Two clients left.</div>
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 19, color: TEXT3 }}>Reference: Mata v. Avianca, 2023.</div>
      </Card>
    </>
  );
};

/* ── Story 3 — the deepfake call ── */
export const Story3: React.FC = () => {
  const seg = useSeg();
  const reveal = seg(0.5, 0.62);
  const sent = seg(0.7, 0.84);
  const tiles = [
    { who: "Finance director", fake: true },
    { who: "Board member", fake: true },
    { who: "Legal counsel", fake: true },
    { who: "You", fake: false },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: -8, display: "flex", alignItems: "center", gap: 10, fontFamily: body, fontSize: 20, color: TEXT2, opacity: seg(0, 0.1) }}>
        <Icon name="video" size={22} color={TEXT2} /> Finance approval call
      </div>
      <div style={{ position: "absolute", left: 40, top: 36, width: 760, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {tiles.map((t, i) => {
          const inP = seg(0.05 + i * 0.04, 0.13 + i * 0.04);
          return (
            <div key={i} style={{ position: "relative", height: 232, borderRadius: 14, background: SURFACE, border: t.fake ? `1px solid ${interpolate(reveal, [0, 1], [0.09, 0.5]) > 0.3 ? DANGER + "88" : "rgba(255,255,255,0.09)"}` : LINE, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", ...rise(inP) }}>
              <Icon name="user" size={70} color={TEXT3} />
              <span style={{ fontFamily: body, fontSize: 20, color: TEXT2, marginTop: 12 }}>{t.who}</span>
              {t.fake ? (
                <div style={{ position: "absolute", top: 12, left: 12, opacity: reveal }}>
                  <Tag text="AI-generated" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <Card style={{ right: 40, top: 40, width: 560, padding: "30px 32px", ...rise(seg(0.2, 0.32)) }}>
        <CardHead icon="banknote" label="Instruction on the call" color={ACCENT} />
        <div style={{ fontSize: 23, color: TEXT2, marginBottom: 22 }}>"Approve the urgent transfers now."</div>
        <div style={{ fontFamily: display, fontSize: 92, fontWeight: 700, color: TEXT, lineHeight: 1, ...num }}>US$25M</div>
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 22, color: DANGER, opacity: sent, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="alert" size={22} color={DANGER} /> Funds sent. Never recovered.
        </div>
      </Card>

      <div style={{ position: "absolute", left: 0, top: 540, width: 1520, textAlign: "center", opacity: seg(0.86, 0.96) }}>
        <span style={{ fontFamily: body, fontSize: 20, color: TEXT3 }}>Real incident. Arup, 2024.</span>
      </div>
    </>
  );
};

export const STORY_COMPONENTS: Record<string, React.FC> = {
  "02-story-intern": () => <Stage eyebrow="Story one" title="The helpful intern"><Story1 /></Stage>,
  "03-story-lawyer": () => <Stage eyebrow="Story two" title="The lawyer who didn't check"><Story2 /></Stage>,
  "04-story-deepfake": () => <Stage eyebrow="Story three" title="The fake boss on the call"><Story3 /></Stage>,
};
