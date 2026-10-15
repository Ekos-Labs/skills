import React from "react";
import { Sparkles, X } from "lucide-react";
import { interpolate } from "remotion";
import { colors, fonts, radius, shadowFloating } from "../theme";
import { scaleIn, useEnter } from "../animations";

// A fake "ask AI for growth hacks" chat input. the concrete image behind
// the "it doesn't work like that" line. The X stamps over it a beat later.
export const ChatPromptMock: React.FC<{
  prompt: string;
  rejectDelay: number;
  variant?: "light" | "dark";
  delay?: number;
}> = ({ prompt, rejectDelay, variant = "light", delay = 0 }) => {
  const theme = colors[variant];
  const boxProgress = useEnter(delay);
  const xProgress = useEnter(rejectDelay, { damping: 10, mass: 0.7 });
  const contentFade = interpolate(xProgress, [0, 1], [1, 0.35]);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          ...scaleIn(boxProgress, 0.95),
          opacity: boxProgress * contentFade,
          width: 820,
          background: theme.card,
          borderRadius: radius.xl,
          border: `1px solid ${theme.border}`,
          boxShadow: shadowFloating,
          padding: "26px 30px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Sparkles size={26} color={theme.mutedForeground} strokeWidth={1.75} />
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 24,
            color: theme.foreground,
          }}
        >
          {prompt}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: -28,
          right: -28,
          opacity: xProgress,
          transform: `scale(${0.6 + xProgress * 0.4}) rotate(${interpolate(xProgress, [0, 1], [-16, -8])}deg)`,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: theme.callout,
            border: `4px solid ${theme.background}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={44} color={theme.calloutForeground} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};
