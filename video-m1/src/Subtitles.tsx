import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender, cancelRender } from "remotion";
import { createTikTokStyleCaptions, type Caption, type TikTokPage } from "@remotion/captions";
import { loadFont as loadBody } from "@remotion/google-fonts/Manrope";

const body = loadBody().fontFamily;
const ACCENT = "#e8a726";
const SWITCH_MS = 1500;

export const Subtitles: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [handle] = useState(() => delayRender(`captions-${sceneId}`));

  useEffect(() => {
    fetch(staticFile(`voiceover/m1/${sceneId}.json`))
      .then((r) => r.json())
      .then((d: Caption[]) => {
        setCaptions(d);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [handle, sceneId]);

  const pages = useMemo(() => {
    if (!captions) return [];
    return createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: SWITCH_MS }).pages;
  }, [captions]);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  const page = pages.find((p, i) => {
    const next = pages[i + 1];
    return nowMs >= p.startMs && (!next || nowMs < next.startMs);
  });
  if (!page) return null;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          marginBottom: 70,
          maxWidth: 1500,
          padding: "20px 40px",
          background: "rgba(6,6,8,0.72)",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(6px)",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        <span style={{ fontFamily: body, fontWeight: 700, fontSize: 46, whiteSpace: "pre-wrap", color: "#f5f5f7" }}>
          {page.tokens.map((t) => {
            const active = t.fromMs <= nowMs && t.toMs > nowMs;
            return (
              <span key={t.fromMs} style={{ color: active ? ACCENT : "#f5f5f7" }}>
                {t.text}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
