import React from "react";
import type { LucideIcon } from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, radius, shadowFloating } from "../theme";
import { fadeSlideUp } from "../animations";

// Layered entrance instead of one flat pop: the card lands first with a
// slight spring overshoot, then its icon, title/status, and description
// stagger in on top of it — the kind of depth a single scaleIn on the
// whole card can't read on its own.
export const FeatureCard: React.FC<{
  icon: LucideIcon;
  title: string;
  description: string;
  status?: string;
  variant?: "light" | "dark";
  delay?: number;
  width?: number;
}> = ({
  icon: Icon,
  title,
  description,
  status,
  variant = "light",
  delay = 0,
  width = 460,
}) => {
  const theme = colors[variant];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.7 },
  });
  const iconProgress = spring({
    frame: frame - (delay + 5),
    fps,
    config: { damping: 11, mass: 0.5 },
  });
  const textProgress = spring({
    frame: frame - (delay + 9),
    fps,
    config: { damping: 200 },
  });
  const descProgress = spring({
    frame: frame - (delay + 13),
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        opacity: cardProgress,
        transform: `translateY(${interpolate(cardProgress, [0, 1], [26, 0])}px) scale(${interpolate(
          cardProgress,
          [0, 1],
          [0.9, 1],
        )})`,
        width,
        background: theme.card,
        borderRadius: radius["2xl"],
        boxShadow: shadowFloating,
        border: `1px solid ${theme.border}`,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          opacity: iconProgress,
          transform: `scale(${iconProgress}) rotate(${interpolate(iconProgress, [0, 1], [-8, 0])}deg)`,
          transformBox: "fill-box",
          transformOrigin: "center",
          width: 56,
          height: 56,
          borderRadius: radius.lg,
          background: theme.secondary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={28} color={theme.primary} strokeWidth={1.75} />
      </div>
      <div style={{ ...fadeSlideUp(textProgress, 10), display: "flex", alignItems: "baseline", gap: 10 }}>
        <span
          style={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 30,
            color: theme.foreground,
          }}
        >
          {title}
        </span>
        {status && (
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 15,
              color: theme.mutedForeground,
            }}
          >
            {status}
          </span>
        )}
      </div>
      <p
        style={{
          ...fadeSlideUp(descProgress, 10),
          fontFamily: fonts.sans,
          fontSize: 20,
          lineHeight: 1.45,
          color: theme.mutedForeground,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
};
