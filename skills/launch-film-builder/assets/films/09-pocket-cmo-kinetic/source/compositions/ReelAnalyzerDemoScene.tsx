import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Link as LinkIcon } from "lucide-react";
import { Background } from "../components/Background";
import { TypingText } from "../components/TypingText";
import { ProcessingStatus } from "../components/ProcessingStatus";
import { Counter } from "../components/Counter";
import { colors, fonts, radius, shadowFloating } from "../theme";
import { fadeSlideUp, scaleIn, useEnter } from "../animations";

// Recreates donna-cmo-site's ReelAnalyzerDemo beat for beat: paste a link,
// watch it process, get frames + transcript + hook stats back.
const URL = "instagram.com/reel/dpq3hookexample";
const STEPS = [
  "Fetching reel...",
  "Extracting frames...",
  "Transcribing audio...",
  "Finding the hook...",
];
const FRAME_TINTS = ["#f5b98c", "#a8c8e0", "#b9d2a0", "#f5b98c", "#a8c8e0"];
const TRANSCRIPT_LINES = [
  "“Nobody tells you this before you start...”",
  "“...three seconds in, before the logo even shows.”",
];

const URL_START = 14;
const URL_CHARS_PER_FRAME = 2;
const STEP_DURATION = 12;
const PROCESSING_START = URL_START + Math.ceil(URL.length / URL_CHARS_PER_FRAME) + 6;
const REVEAL_START = PROCESSING_START + STEPS.length * STEP_DURATION + 6;

export const ReelAnalyzerDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = colors.light;
  const headingProgress = useEnter(0);
  const urlBoxProgress = useEnter(10);
  const revealProgress = useEnter(REVEAL_START);

  const showProcessing = frame >= PROCESSING_START && frame < REVEAL_START;
  const showReveal = frame >= REVEAL_START;

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, gap: 36 }}>
        <div
          style={{
            ...fadeSlideUp(headingProgress, 16),
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 52,
            color: theme.foreground,
            textAlign: "center",
          }}
        >
          Paste a reel link.
        </div>

        <div
          style={{
            ...scaleIn(urlBoxProgress, 0.97),
            width: 640,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: theme.card,
            borderRadius: radius.xl,
            border: `1px solid ${theme.border}`,
            boxShadow: shadowFloating,
            padding: "18px 24px",
          }}
        >
          <LinkIcon size={18} color={theme.mutedForeground} />
          <TypingText text={URL} startFrame={URL_START} charsPerFrame={URL_CHARS_PER_FRAME} fontSize={22} />
        </div>

        {showProcessing && (
          <ProcessingStatus
            steps={STEPS}
            startFrame={PROCESSING_START}
            stepDurationFrames={STEP_DURATION}
            width={460}
          />
        )}

        {showReveal && (
          <div
            style={{
              ...scaleIn(revealProgress, 0.96),
              width: 760,
              background: theme.card,
              borderRadius: radius.xl,
              border: `1px solid ${theme.border}`,
              boxShadow: shadowFloating,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              {FRAME_TINTS.map((tint, i) => {
                const p = interpolate(
                  frame,
                  [REVEAL_START + i * 3, REVEAL_START + i * 3 + 8],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                return (
                  <div
                    key={i}
                    style={{
                      opacity: p,
                      transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
                      flex: 1,
                      aspectRatio: "9 / 16",
                      borderRadius: radius.md,
                      background: `linear-gradient(160deg, ${tint}, transparent)`,
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {TRANSCRIPT_LINES.map((line, i) => {
                const p = interpolate(
                  frame,
                  [REVEAL_START + 20 + i * 7, REVEAL_START + 27 + i * 7],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                return (
                  <p
                    key={line}
                    style={{
                      opacity: p,
                      fontFamily: fonts.sans,
                      fontSize: 18,
                      fontStyle: "italic",
                      color: theme.mutedForeground,
                      margin: 0,
                    }}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                gap: 36,
                paddingTop: 14,
                borderTop: `1px solid ${theme.border}`,
              }}
            >
              {[
                { label: "frames", value: 5 },
                { label: "sec transcript", value: 41 },
                { label: "hooks found", value: 3 },
              ].map((stat) => (
                <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
                  <Counter
                    value={stat.value}
                    startFrame={REVEAL_START + 34}
                    durationInFrames={10}
                    color={theme.foreground}
                    fontSize={26}
                  />
                  <span style={{ fontFamily: fonts.sans, fontSize: 14, color: theme.mutedForeground }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const REEL_ANALYZER_DEMO_DURATION = REVEAL_START + 57;
