import React from "react";
import { colors, fonts } from "../theme";
import { fadeSlideUp, useEnter } from "../animations";

export const Pill: React.FC<{
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
        gap: 8,
        padding: "10px 20px",
        borderRadius: 999,
        background: theme.callout,
        color: theme.calloutForeground,
        fontFamily: fonts.mono,
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: "0.01em",
      }}
    >
      {children}
    </div>
  );
};
