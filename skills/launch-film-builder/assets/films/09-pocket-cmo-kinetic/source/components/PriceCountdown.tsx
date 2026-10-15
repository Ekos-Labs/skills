import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// Animates a dollar figure counting down to zero, then swaps to "FREE" with
// a spring pop. `startFrame` is local to the scene it's used in.
export const PriceCountdown: React.FC<{
  from: number;
  startFrame?: number;
  durationInFrames?: number;
  variant?: "light" | "dark";
}> = ({ from, startFrame = 0, durationInFrames = 70, variant = "light" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = colors[variant];

  const t = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - t, 3);
  const value = Math.round(interpolate(eased, [0, 1], [from, 0]));

  const landed = frame >= startFrame + durationInFrames;
  const pop = spring({
    frame: frame - (startFrame + durationInFrames),
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  return (
    <div
      style={{
        fontFamily: fonts.serif,
        fontWeight: 700,
        fontSize: 168,
        color: landed ? theme.primary : theme.foreground,
        transform: landed ? `scale(${interpolate(pop, [0, 1], [0.85, 1])})` : "scale(1)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {landed ? "FREE" : `$${value}`}
    </div>
  );
};
