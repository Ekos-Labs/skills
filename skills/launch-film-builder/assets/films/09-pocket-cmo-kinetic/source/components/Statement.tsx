import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, colors } from "../theme";

type Segment = {
  text: string;
  color?: string;
  weight?: number;
  italic?: boolean;
};

// Word-by-word kinetic type reveal. Each scene's on-screen copy is built
// from segments so specific words can carry brand color/weight, this is
// the primary storytelling device until the real VO script is timed in.
export const Statement: React.FC<{
  segments: Segment[];
  fontSize?: number;
  startDelay?: number;
  stagger?: number;
  variant?: "light" | "dark";
  align?: "center" | "left";
  lineHeight?: number;
  maxWidth?: number;
  fontFamily?: string;
}> = ({
  segments,
  fontSize = 64,
  startDelay = 0,
  stagger = 3,
  variant = "light",
  align = "center",
  lineHeight = 1.25,
  maxWidth = 1400,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = colors[variant];

  let wordIndex = 0;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        maxWidth,
        fontFamily: fontFamily ?? fonts.serif,
        fontSize,
        lineHeight,
        textAlign: align,
      }}
    >
      {segments.map((segment, si) =>
        segment.text.split(" ").map((word, wi) => {
          const delay = startDelay + wordIndex * stagger;
          wordIndex += 1;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 200 },
          });
          return (
            <span
              key={`${si}-${wi}`}
              style={{
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [18, 0])}px)`,
                color: segment.color ?? theme.foreground,
                fontWeight: segment.weight ?? 600,
                fontStyle: segment.italic ? "italic" : "normal",
                marginRight: "0.28em",
                whiteSpace: "nowrap",
              }}
            >
              {word}
            </span>
          );
        }),
      )}
    </div>
  );
};
