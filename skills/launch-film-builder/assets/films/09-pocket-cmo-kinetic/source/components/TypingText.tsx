import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";

// Frame-driven typing effect (1 char/frame at 30fps matches the site
// demo's real-time 32ms/char pace) with a blinking text cursor.
export const TypingText: React.FC<{
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  color?: string;
  fontSize?: number;
  mono?: boolean;
  placeholder?: string;
  variant?: "light" | "dark";
}> = ({
  text,
  startFrame = 0,
  charsPerFrame = 1,
  color,
  fontSize = 22,
  mono = true,
  placeholder,
  variant = "light",
}) => {
  const frame = useCurrentFrame();
  const theme = colors[variant];
  const chars = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - startFrame) * charsPerFrame)),
  );
  const shown = text.slice(0, chars);
  const cursorOn = Math.floor(frame / 15) % 2 === 0;
  const started = frame >= startFrame;

  return (
    <span
      style={{
        fontFamily: mono ? fonts.mono : fonts.sans,
        fontSize,
        color: color ?? theme.foreground,
      }}
    >
      {shown.length === 0 && placeholder ? (
        <span style={{ color: theme.mutedForeground }}>{placeholder}</span>
      ) : (
        shown
      )}
      <span style={{ opacity: started && cursorOn ? 1 : 0, marginLeft: 1 }}>|</span>
    </span>
  );
};
