import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// "Pocket" in serif, "CMO" tracked-out in mono at a muted gray — never
// colored coral. Coral is spent once, on the dot in the mark (see
// brand/brandbook.html: "one field color, one accent, spent once").
export const Wordmark: React.FC<{
  size?: number;
  variant?: "light" | "dark";
  delay?: number;
  /** Overrides when "CMO" staggers in. Defaults to delay + 6. */
  cmoDelay?: number;
}> = ({ size = 96, variant = "light", delay = 0, cmoDelay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = colors[variant];

  const pocketProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 24, mass: 0.7 },
  });
  const cmoProgress = spring({
    frame: frame - (cmoDelay ?? delay + 6),
    fps,
    config: { damping: 24, mass: 0.7 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: size * 0.18,
        fontFamily: fonts.serif,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "-0.02em",
        color: theme.primary,
      }}
    >
      <span
        style={{
          opacity: pocketProgress,
          display: "inline-block",
          transform: `translateY(${interpolate(pocketProgress, [0, 1], [24, 0])}px)`,
        }}
      >
        Pocket
      </span>
      <span
        style={{
          opacity: cmoProgress,
          display: "inline-block",
          transform: `translateY(${interpolate(cmoProgress, [0, 1], [16, 0])}px)`,
          fontFamily: fonts.mono,
          fontSize: size * 0.42,
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: theme.mutedForeground,
        }}
      >
        CMO
      </span>
    </div>
  );
};
