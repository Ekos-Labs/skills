import React from "react";
import { colors, fonts } from "../theme";
import { fadeSlideUp, useEnter } from "../animations";

// Outlined chip for listing things (integrations, harnesses), distinct
// from Pill, which is a solid CTA/tag accent.
export const Chip: React.FC<{
  children: React.ReactNode;
  variant?: "light" | "dark";
  delay?: number;
}> = ({ children, variant = "light", delay = 0 }) => {
  const theme = colors[variant];
  const progress = useEnter(delay);

  return (
    <div
      style={{
        ...fadeSlideUp(progress, 12),
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 22px",
        borderRadius: 999,
        border: `1.5px solid ${theme.border}`,
        background: theme.card,
        color: theme.foreground,
        fontFamily: fonts.mono,
        fontSize: 20,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
};
