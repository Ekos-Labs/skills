import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArrowUp } from "lucide-react";
import { Background } from "../components/Background";
import { TypingText } from "../components/TypingText";
import { ProcessingStatus } from "../components/ProcessingStatus";
import { colors, fonts, radius, shadowFloating } from "../theme";
import { fadeSlideUp, scaleIn, useEnter } from "../animations";

// Recreates donna-cmo-site's RedditRadarDemo: describe who you're looking
// for, watch it scan subreddits, get back real posts with a reply angle.
const PROMPT = "Founders who can't find their first customers";
const STEPS = ["Scanning r/SaaS...", "Scanning r/startups...", "Scoring relevance..."];

const RESULTS = [
  {
    subreddit: "SaaS",
    relevance: "8.7",
    snippet:
      "“Two months since launch and still zero paying customers. I don't even know where to look.”",
    reply: "reply idea: search the exact words people use for the problem, not the product category.",
  },
  {
    subreddit: "startups",
    relevance: "7.9",
    snippet:
      "“Built the thing, nobody's buying. Cold outreach feels like shouting into a void.”",
    reply: "reply idea: our first ten came from people already complaining about this in public.",
  },
];

const PROMPT_START = 16;
const PROMPT_CHARS_PER_FRAME = 2;
const STEP_DURATION = 14;
const PROCESSING_START = PROMPT_START + Math.ceil(PROMPT.length / PROMPT_CHARS_PER_FRAME) + 10;
const REVEAL_START = PROCESSING_START + STEPS.length * STEP_DURATION + 9;

export const RedditRadarDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = colors.light;
  const headingProgress = useEnter(0);
  const promptBoxProgress = useEnter(10);
  const isBusy = frame >= PROCESSING_START && frame < REVEAL_START;

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, gap: 32 }}>
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
          Find your first customers on Reddit.
        </div>

        <div
          style={{
            ...scaleIn(promptBoxProgress, 0.97),
            width: 700,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: theme.card,
            borderRadius: radius["2xl"],
            border: `1px solid ${theme.border}`,
            boxShadow: shadowFloating,
            padding: "18px 24px",
          }}
        >
          <div style={{ flex: 1 }}>
            <TypingText
              text={PROMPT}
              startFrame={PROMPT_START}
              charsPerFrame={PROMPT_CHARS_PER_FRAME}
              placeholder="Ask anything..."
              mono={false}
              fontSize={22}
            />
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: theme.foreground,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ArrowUp size={18} color={theme.background} />
          </div>
        </div>

        {isBusy && (
          <ProcessingStatus
            steps={STEPS}
            startFrame={PROCESSING_START}
            stepDurationFrames={STEP_DURATION}
            width={460}
          />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 760 }}>
          {RESULTS.map((result, i) => {
            const start = REVEAL_START + i * 12;
            const p = interpolate(frame, [start, start + 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (frame < start) return null;
            return (
              <div
                key={result.subreddit}
                style={{
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)`,
                  background: theme.card,
                  borderRadius: radius.xl,
                  border: `1px solid ${theme.border}`,
                  boxShadow: shadowFloating,
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 14,
                      color: theme.mutedForeground,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 999,
                      padding: "4px 12px",
                    }}
                  >
                    r/{result.subreddit}
                  </span>
                  <span style={{ fontFamily: fonts.mono, fontSize: 15, color: theme.primary, fontWeight: 600 }}>
                    {result.relevance}
                  </span>
                </div>
                <p style={{ fontFamily: fonts.sans, fontSize: 17, fontStyle: "italic", color: theme.foreground, margin: 0 }}>
                  {result.snippet}
                </p>
                <p style={{ fontFamily: fonts.sans, fontSize: 15, color: theme.callout, margin: 0 }}>
                  {result.reply}
                </p>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const REDDIT_RADAR_DEMO_DURATION = REVEAL_START + 41;
