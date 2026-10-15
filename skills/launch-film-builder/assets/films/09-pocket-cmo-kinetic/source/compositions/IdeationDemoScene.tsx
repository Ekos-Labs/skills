import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Check } from "lucide-react";
import { Background } from "../components/Background";
import { colors, fonts, radius, shadowFloating } from "../theme";
import { fadeSlideUp, useEnter } from "../animations";

// Recreates donna-cmo-site's BoardVisual: a card moves Idea -> Scripting ->
// Posted, checkmark popping once it lands in the last column.
const COLUMNS = ["Idea", "Scripting", "Posted"] as const;
const STAGE_DURATION = 26;
const COLUMNS_START = 9;

export const IdeationDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = colors.light;
  const headingProgress = useEnter(0);

  const activeStage = Math.min(
    COLUMNS.length - 1,
    Math.floor(Math.max(0, frame - COLUMNS_START) / STAGE_DURATION),
  );
  const stageStart = COLUMNS_START + activeStage * STAGE_DURATION;
  const cardProgress = spring({ frame: frame - stageStart, fps, config: { damping: 16, mass: 0.6 } });
  const checkProgress = spring({
    frame: frame - (stageStart + 14),
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44 }}>
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
          Track ideas from spark to shipped.
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {COLUMNS.map((col, i) => {
            const colDelay = COLUMNS_START - 20 + i * 6;
            const colProgress = spring({
              frame: frame - colDelay,
              fps,
              config: { damping: 200 },
            });
            const isActive = i === activeStage;
            return (
              <div key={col} style={{ ...fadeSlideUp(colProgress, 14), width: 220, display: "flex", flexDirection: "column", gap: 12 }}>
                <span
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 18,
                    color: theme.mutedForeground,
                    textAlign: "center",
                  }}
                >
                  {col}
                </span>
                <div
                  style={{
                    height: 260,
                    borderRadius: radius.xl,
                    background: theme.secondary,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {isActive ? (
                    <div
                      style={{
                        opacity: cardProgress,
                        transform: `scale(${interpolate(cardProgress, [0, 1], [0.85, 1])})`,
                        height: 110,
                        borderRadius: radius.lg,
                        background: "#f5d98c",
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 16, color: theme.foreground }}>
                        Hook script v2
                      </span>
                      {i === COLUMNS.length - 1 && (
                        <div
                          style={{
                            alignSelf: "flex-end",
                            opacity: checkProgress,
                            transform: `scale(${interpolate(checkProgress, [0, 1], [0.5, 1])})`,
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: theme.primary,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Check size={15} color={theme.background} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        height: 110,
                        borderRadius: radius.lg,
                        border: `1px dashed ${theme.border}`,
                        background: theme.card,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const IDEATION_DEMO_DURATION = COLUMNS_START + COLUMNS.length * STAGE_DURATION + 13;
