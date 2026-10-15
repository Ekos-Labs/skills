import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fonts } from "../theme";

export const Counter: React.FC<{
  value: number;
  startFrame: number;
  durationInFrames?: number;
  color?: string;
  fontSize?: number;
}> = ({ value, startFrame, durationInFrames = 20, color, fontSize = 28 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shown = Math.round(t * value);

  return (
    <span
      style={{
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {shown}
    </span>
  );
};
