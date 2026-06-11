import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Kicker, Plate, MonoLabel, up } from "./Scene";
import { display, body, mono, INK, INK2, INK3, SILVER, PERI, GREEN, RED, BORDER } from "./theme";

const H1: React.CSSProperties = {
  fontFamily: display,
  fontSize: 72,
  fontWeight: 800,
  lineHeight: 1.05,
  color: INK,
  margin: 0,
};

const rule = (c = BORDER) => `1px solid ${c}`;

/* ── 03 · FREE VERSION: chat → unknown servers, SHADOW AI stamp ───── */
const FreeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kick = up(frame, fps, 2);
  const title = up(frame, fps, 8);
  const flow = interpolate(frame, [40, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const qs = up(frame, fps, 120);
  const stamp = up(frame, fps, 210);

  const dots = [0, 0.2, 0.4, 0.6, 0.8];

  return (
    <AbsoluteFill style={{ padding: "150px 150px 230px", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1560 }}>
        <Kicker text="Version 1 of 4 · Free" a={kick} />
        <h1 style={{ ...H1, opacity: title, transform: `translateY(${interpolate(title, [0, 1], [22, 0])}px)` }}>
          The free version
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 70 }}>
          {/* chat plate */}
          <Plate style={{ width: 430, padding: "30px 34px", opacity: up(frame, fps, 26) }}>
            <MonoLabel color={PERI}>You type</MonoLabel>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              {[300, 230, 270].map((w, i) => (
                <div key={i} style={{ width: w, height: 13, background: "rgba(201,212,227,0.3)", borderRadius: 2 }} />
              ))}
            </div>
          </Plate>

          {/* travelling dots */}
          <div style={{ position: "relative", flex: 1, height: 4, margin: "0 8px" }}>
            <div
              style={{
                position: "absolute",
                top: 1.5,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "repeating-linear-gradient(90deg, rgba(145,162,255,0.5) 0, rgba(145,162,255,0.5) 8px, transparent 8px, transparent 16px)",
              }}
            />
            {dots.map((o, i) => {
              const p = (flow * 1.4 - o) % 1;
              if (p < 0 || p > 1) return null;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: -4,
                    left: `${p * 100}%`,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: SILVER,
                    opacity: 0.85,
                  }}
                />
              );
            })}
          </div>

          {/* unknown servers */}
          <Plate style={{ width: 480, padding: "30px 34px", opacity: up(frame, fps, 40), borderStyle: "dashed" }}>
            <MonoLabel color={INK3}>Someone's computers · some country</MonoLabel>
            <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
              {[0, 1].map((r) => (
                <div key={r} style={{ flex: 1, border: rule("rgba(201,212,227,0.4)"), borderRadius: 3, padding: "14px 16px" }}>
                  {[0, 1, 2].map((l) => (
                    <div key={l} style={{ height: 8, background: "rgba(201,212,227,0.22)", borderRadius: 2, marginBottom: 9 }} />
                  ))}
                </div>
              ))}
            </div>
          </Plate>
        </div>

        {/* the three unknowns */}
        <div style={{ display: "flex", gap: 18, marginTop: 44, opacity: qs, transform: `translateY(${interpolate(qs, [0, 1], [14, 0])}px)` }}>
          {["KEPT HOW LONG?", "READ BY WHOM?", "TRAINED ON?", "NO COMPANY DEAL"].map((q, i) => (
            <span
              key={i}
              style={{
                fontFamily: mono,
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: i === 3 ? RED : INK2,
                border: `1.5px solid ${i === 3 ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.18)"}`,
                borderRadius: 3,
                padding: "10px 18px",
              }}
            >
              {q}
            </span>
          ))}
        </div>

        {/* shadow AI stamp */}
        <div
          style={{
            position: "absolute",
            right: 170,
            top: 150,
            transform: `rotate(-7deg) scale(${interpolate(stamp, [0, 1], [1.6, 1])})`,
            opacity: stamp * 0.95,
            fontFamily: mono,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: RED,
            border: `4px double ${RED}`,
            borderRadius: 4,
            padding: "14px 30px",
          }}
        >
          SHADOW AI
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 04 · PAID VERSION: price tag, same flow, training switch ─────── */
const PaidScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kick = up(frame, fps, 2);
  const title = up(frame, fps, 8);
  const line = up(frame, fps, 40);
  const sw = up(frame, fps, 150);
  const flip = interpolate(frame, [200, 215], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ padding: "150px 150px 230px", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1460, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Kicker text="Version 2 of 4 · Paid personal" a={kick} />
        </div>
        <h1 style={{ ...H1, fontSize: 80, opacity: title, transform: `translateY(${interpolate(title, [0, 1], [22, 0])}px)` }}>
          A faster version of <span style={{ borderBottom: `4px solid ${RED}` }}>the wrong tool</span>
        </h1>

        <div
          style={{
            marginTop: 56,
            fontFamily: body,
            fontSize: 40,
            fontWeight: 700,
            color: INK2,
            opacity: line,
          }}
        >
          Still a public tool. Still no deal with your company.
        </div>

        {/* the one real plus: the do-not-train switch */}
        <div
          style={{
            margin: "70px auto 0",
            display: "inline-flex",
            alignItems: "center",
            gap: 34,
            opacity: sw,
            transform: `translateY(${interpolate(sw, [0, 1], [16, 0])}px)`,
          }}
        >
          <Plate style={{ padding: "26px 38px", display: "flex", alignItems: "center", gap: 30 }}>
            <MonoLabel color={INK} size={24}>
              Use my chats to improve the model
            </MonoLabel>
            <div
              style={{
                width: 96,
                height: 48,
                borderRadius: 999,
                border: `2px solid ${flip > 0.5 ? GREEN : "rgba(255,255,255,0.3)"}`,
                position: "relative",
                background: flip > 0.5 ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4 + (1 - flip) * 44,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: flip > 0.5 ? GREEN : SILVER,
                }}
              />
            </div>
            <MonoLabel color={flip > 0.5 ? GREEN : INK3} size={24}>
              {flip > 0.5 ? "OFF — GOOD" : "ON"}
            </MonoLabel>
          </Plate>
        </div>
        <div style={{ marginTop: 26, fontFamily: body, fontSize: 30, color: INK3, opacity: sw }}>
          Find it. Turn it off. Don't assume.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 05 · TEAM/ENTERPRISE: four-rung ladder + control chips ───────── */
const LadderScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kick = up(frame, fps, 2);
  const title = up(frame, fps, 8);

  const RUNGS = [
    { name: "FREE", h: 90, tone: RED },
    { name: "PAID", h: 150, tone: RED },
    { name: "TEAM", h: 240, tone: PERI },
    { name: "ENTERPRISE", h: 330, tone: GREEN },
  ];
  const CHIPS = ["ADMIN CONTROL", "DATA GOVERNANCE", "IDENTITY / SSO", "AUDIT LOGS", "COMPLIANCE"];

  return (
    <AbsoluteFill style={{ padding: "140px 150px 230px", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1560 }}>
        <Kicker text="Versions 3 + 4 · The rules change" a={kick} />
        <h1 style={{ ...H1, opacity: title, transform: `translateY(${interpolate(title, [0, 1], [22, 0])}px)` }}>
          Weakest to safest
        </h1>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 34, marginTop: 64, height: 380 }}>
          {RUNGS.map((r, i) => {
            const a = up(frame, fps, 30 + i * 14);
            return (
              <div key={r.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                {r.name === "TEAM" ? (
                  <span
                    style={{
                      opacity: up(frame, fps, 110),
                      fontFamily: mono,
                      fontSize: 19,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: PERI,
                      border: `1.5px solid rgba(145,162,255,0.5)`,
                      borderRadius: 3,
                      padding: "6px 14px",
                    }}
                  >
                    DPA SIGNED
                  </span>
                ) : null}
                <div
                  style={{
                    width: "100%",
                    height: r.h * a,
                    background: "rgba(255,255,255,0.03)",
                    border: rule("rgba(255,255,255,0.14)"),
                    borderTop: `3px solid ${r.tone}`,
                    borderRadius: 3,
                  }}
                />
                <MonoLabel color={a > 0.5 ? INK : INK3} size={21}>
                  {r.name}
                </MonoLabel>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {CHIPS.map((c, i) => {
            const a = up(frame, fps, 150 + i * 9);
            return (
              <span
                key={c}
                style={{
                  opacity: a,
                  transform: `translateY(${interpolate(a, [0, 1], [12, 0])}px)`,
                  fontFamily: mono,
                  fontSize: 21,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: GREEN,
                  border: "1.5px solid rgba(52,211,153,0.45)",
                  borderRadius: 3,
                  padding: "10px 20px",
                }}
              >
                {c}
              </span>
            );
          })}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 30,
            fontFamily: body,
            fontSize: 32,
            fontWeight: 700,
            color: INK2,
            opacity: up(frame, fps, 200),
          }}
        >
          Not better answers — evidence and control.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 06 · TRAINED ON: words join the mosaic, one piece pulled out ── */
const TrainedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kick = up(frame, fps, 2);
  const title = up(frame, fps, 8);

  const COLS = 18;
  const ROWS = 7;
  const fill = interpolate(frame, [30, 170], [0, COLS * ROWS], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pull = up(frame, fps, 195);

  return (
    <AbsoluteFill style={{ padding: "150px 150px 230px", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1460, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Kicker text="The fine print" a={kick} />
        </div>
        <h1 style={{ ...H1, fontSize: 78, opacity: title, transform: `translateY(${interpolate(title, [0, 1], [22, 0])}px)` }}>
          "Trained on" means it can't forget
        </h1>

        <div
          style={{
            margin: "64px auto 0",
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: 7,
            maxWidth: 1100,
          }}
        >
          {Array.from({ length: COLS * ROWS }).map((_, i) => {
            const isPulled = i === COLS * 2 + 5;
            const on = i < fill;
            return (
              <div
                key={i}
                style={{
                  height: 34,
                  borderRadius: 2,
                  border: `1px solid ${on ? "rgba(145,162,255,0.35)" : "rgba(255,255,255,0.07)"}`,
                  background: on ? "rgba(145,162,255,0.16)" : "transparent",
                  transform: isPulled ? `translateY(${pull * -56}px) scale(${1 + pull * 0.5})` : undefined,
                  borderColor: isPulled && pull > 0.3 ? RED : undefined,
                  boxShadow: isPulled && pull > 0.3 ? `0 0 0 1.5px ${RED}` : undefined,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            marginTop: 46,
            fontFamily: body,
            fontSize: 32,
            fontWeight: 700,
            color: INK2,
            opacity: pull,
          }}
        >
          The right question can pull small pieces back out.
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: mono,
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: GREEN,
            opacity: up(frame, fps, 230),
          }}
        >
          FIX IT BEFORE YOU PASTE: SETTINGS → DATA CONTROLS → TRAINING OFF
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 07 · POSTCARD ─────────────────────────────────────────────────── */
const PostcardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kick = up(frame, fps, 2);
  const title = up(frame, fps, 8);
  const card = up(frame, fps, 30);
  const write = interpolate(frame, [110, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const strike = up(frame, fps, 185);

  return (
    <AbsoluteFill style={{ padding: "140px 150px 230px", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1460, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Kicker text="A handy way to think" a={kick} />
        </div>
        <h1 style={{ ...H1, fontSize: 80, opacity: title, transform: `translateY(${interpolate(title, [0, 1], [22, 0])}px)` }}>
          Every chat is a postcard
        </h1>

        <div
          style={{
            margin: "66px auto 0",
            width: 920,
            height: 420,
            background: "linear-gradient(160deg, #f6f7f9 0%, #e9edf2 100%)",
            borderRadius: 4,
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            opacity: card,
            transform: `rotate(-2deg) translateY(${interpolate(card, [0, 1], [40, 0])}px)`,
            display: "flex",
            padding: 44,
            gap: 40,
            position: "relative",
          }}
        >
          {/* message side */}
          <div style={{ flex: 1.2, textAlign: "left", position: "relative" }}>
            <div style={{ fontFamily: display, fontSize: 30, fontWeight: 700, color: "#1c2330" }}>
              Dear AI tool…
            </div>
            <div style={{ marginTop: 26, position: "relative", display: "inline-block" }}>
              <span
                style={{
                  fontFamily: display,
                  fontSize: 38,
                  fontWeight: 700,
                  color: "#b92d2d",
                  clipPath: `inset(0 ${(1 - write) * 100}% 0 0)`,
                  display: "inline-block",
                }}
              >
                my bank password is…
              </span>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "52%",
                  height: 6,
                  width: `${strike * 100}%`,
                  background: "#b92d2d",
                  borderRadius: 3,
                }}
              />
            </div>
            <div style={{ marginTop: 30, fontFamily: body, fontSize: 22, color: "#54647c" }}>
              Anyone handling it <em>could</em> read it.
            </div>
          </div>
          {/* divider + address side */}
          <div style={{ width: 2, background: "rgba(20,27,38,0.18)" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div
              style={{
                alignSelf: "flex-end",
                width: 86,
                height: 102,
                border: "2px solid rgba(20,27,38,0.3)",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: mono,
                fontSize: 15,
                letterSpacing: "0.1em",
                color: "#54647c",
                transform: "rotate(3deg)",
              }}
            >
              STAMP
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 12 }}>
              {[220, 300, 260].map((w, i) => (
                <div key={i} style={{ height: 2.5, width: w, background: "rgba(20,27,38,0.3)", alignSelf: "flex-start" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 08 · TAKEAWAY: data across the atlantic, lock in the EU ──────── */
const TakeawayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kick = up(frame, fps, 2);
  const title = up(frame, fps, 8);
  const fly = interpolate(frame, [40, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lockIn = up(frame, fps, 150);
  const final = up(frame, fps, 210);

  return (
    <AbsoluteFill style={{ padding: "150px 150px 230px", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1500, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Kicker text="Where the data sits" a={kick} />
        </div>
        <h1 style={{ ...H1, fontSize: 74, opacity: title, transform: `translateY(${interpolate(title, [0, 1], [22, 0])}px)` }}>
          Your data takes a journey
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 80, justifyContent: "center" }}>
          <Plate style={{ width: 360, padding: "34px 30px" }}>
            <MonoLabel color={PERI} size={21}>EU · GDPR</MonoLabel>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: i % 2 ? "rgba(145,162,255,0.6)" : "rgba(201,212,227,0.5)" }} />
              ))}
            </div>
            <div
              style={{
                marginTop: 22,
                opacity: lockIn,
                transform: `scale(${interpolate(lockIn, [0, 1], [1.4, 1])})`,
                fontFamily: mono,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: GREEN,
                border: "1.5px solid rgba(52,211,153,0.5)",
                borderRadius: 3,
                padding: "8px 16px",
                display: "inline-block",
              }}
            >
              WORK VERSION: DATA STAYS HERE
            </div>
          </Plate>

          <div style={{ position: "relative", width: 320, height: 4 }}>
            <div
              style={{
                position: "absolute",
                top: 1.5,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "repeating-linear-gradient(90deg, rgba(201,212,227,0.4) 0, rgba(201,212,227,0.4) 8px, transparent 8px, transparent 16px)",
              }}
            />
            {[0, 0.33, 0.66].map((o, i) => {
              const p = (fly * 1.5 - o) % 1;
              if (p < 0 || p > 1) return null;
              return (
                <div key={i} style={{ position: "absolute", top: -4, left: `${p * 100}%`, width: 11, height: 11, borderRadius: "50%", background: SILVER, opacity: 1 - lockIn * 0.85 }} />
              );
            })}
          </div>

          <Plate style={{ width: 360, padding: "34px 30px", borderStyle: "dashed", opacity: 1 - lockIn * 0.45 }}>
            <MonoLabel color={INK3} size={21}>US SERVERS · FREE TIER</MonoLabel>
            <div style={{ marginTop: 16, fontFamily: body, fontSize: 24, color: INK3 }}>
              Protections only apply if your company signed up. On a free tool, it hasn't.
            </div>
          </Plate>
        </div>

        <div
          style={{
            marginTop: 76,
            fontFamily: display,
            fontSize: 52,
            fontWeight: 800,
            color: INK,
            opacity: final,
            transform: `translateY(${interpolate(final, [0, 1], [18, 0])}px)`,
          }}
        >
          The version you use matters{" "}
          <span style={{ borderBottom: `5px solid ${PERI}` }}>as much as what you type.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const STORY_COMPONENTS: Record<string, React.FC> = {
  "03-free-version": FreeScene,
  "04-paid-version": PaidScene,
  "05-team-enterprise": LadderScene,
  "06-trained-on": TrainedScene,
  "07-postcard": PostcardScene,
  "08-takeaway": TakeawayScene,
};
