import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Slow-drifting blurred blobs on the warm canvas background, matching the
// site's atmospheric-blobs.tsx treatment. Kept subtle: this sits behind
// foreground content for the whole video, so movement must never distract.
export const Background: React.FC<{ variant?: "light" | "dark" }> = ({
  variant = "light",
}) => {
  const frame = useCurrentFrame();
  const theme = colors[variant];

  const driftX = interpolate(frame, [0, 900], [0, 60], {
    extrapolateRight: "clamp",
  });
  const driftY = interpolate(frame, [0, 900], [0, -40], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      <AbsoluteFill
        style={{
          filter: "blur(120px)",
          opacity: variant === "light" ? 0.35 : 0.25,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200 + driftY,
            left: -150 + driftX,
            width: 780,
            height: 780,
            borderRadius: "50%",
            background: theme.primary,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260 - driftY,
            right: -200 - driftX,
            width: 860,
            height: 860,
            borderRadius: "50%",
            background: theme.callout,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
