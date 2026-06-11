import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
  cancelRender,
} from "remotion";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { body, PERI, INK } from "./theme";

const SWITCH_MS = 1500;

export const Subtitles: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [handle] = useState(() => delayRender(`captions-${sceneId}`));

  useEffect(() => {
    fetch(staticFile(`voiceover/m2/${sceneId}.json`))
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
          marginBottom: 64,
          maxWidth: 1520,
          padding: "20px 42px",
          background: "rgba(6,6,8,0.78)",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.10)",
          borderLeft: `2px solid rgba(145,162,255,0.6)`,
          backdropFilter: "blur(6px)",
          textAlign: "center",
          lineHeight: 1.32,
        }}
      >
        <span style={{ fontFamily: body, fontWeight: 700, fontSize: 44, whiteSpace: "pre-wrap", color: INK }}>
          {page.tokens.map((t) => {
            const active = t.fromMs <= nowMs && t.toMs > nowMs;
            return (
              <span key={t.fromMs} style={{ color: active ? PERI : INK }}>
                {t.text}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
