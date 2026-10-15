import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

// Inlined from brand/icon.svg (rather than loaded as an image) so the mark
// can be animated as three beats instead of popping in as one flat unit:
//   1. the badge scales/rotates in
//   2. the "P" wipes on inside it
//   3. the coral dot lands last, as the period after "Pocket"
export const AppIcon: React.FC<{
  size?: number;
  variant?: "light" | "dark";
  /** Frame the badge starts entering. P and dot delays default off this. */
  delay?: number;
  /** Override when the P starts drawing on. Defaults to delay + 8. */
  pDelay?: number;
  /** Override when the coral dot lands. Defaults to delay + 26. */
  dotDelay?: number;
}> = ({ size = 96, variant = "light", delay = 0, pDelay, dotDelay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = colors[variant];
  // useId() ids contain colons (e.g. ":r0:"), which break the url(#id)
  // clip-path reference — strip everything but alphanumerics.
  const reactId = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const clipId = `app-icon-p-wipe-${reactId}`;

  const resolvedPDelay = pDelay ?? delay + 8;
  const resolvedDotDelay = dotDelay ?? delay + 26;

  // Beat 1: badge scales + rotates in from a slight tilt.
  const badgeProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.6 },
  });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.6, 1]);
  const badgeRotate = interpolate(badgeProgress, [0, 1], [-12, 0]);

  // Beat 2: the P wipes on top-to-bottom, like it's being drawn.
  const pWipe = interpolate(frame - resolvedPDelay, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Beat 3: the coral dot lands last, with a punchy overshoot — a period
  // stamped down after the mark, not just another fade-in.
  const dotProgress = spring({
    frame: frame - resolvedDotDelay,
    fps,
    config: { damping: 10, mass: 0.5 },
  });

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <clipPath id={clipId}>
          {/* Glyph's own bounding box (y 24-76) so the wipe maps 1:1 to
              the P actually being revealed, instead of wasting progress
              on empty space above/below it. */}
          <rect x="0" y="24" width="100" height={52 * pWipe} />
        </clipPath>
      </defs>
      <g
        style={{
          opacity: badgeProgress,
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `scale(${badgeScale}) rotate(${badgeRotate}deg)`,
        }}
      >
        <rect x="6" y="6" width="88" height="88" rx="20" fill={theme.primary} />
        <g clipPath={`url(#${clipId})`}>
          <path
            d="M32,24 L45,24 L45,76 L32,76 Z M32,24 L53,24 A15,15 0 0 1 53,54 L32,54 Z"
            fill={theme.background}
          />
        </g>
      </g>
      <circle
        cx="59"
        cy="68"
        r="7"
        fill={theme.callout}
        style={{
          opacity: dotProgress,
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `scale(${dotProgress})`,
        }}
      />
    </svg>
  );
};
