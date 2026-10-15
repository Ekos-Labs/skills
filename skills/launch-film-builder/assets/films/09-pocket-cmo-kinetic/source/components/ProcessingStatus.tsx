import React from "react";
import { Loader2 } from "lucide-react";
import { useCurrentFrame } from "remotion";
import { colors, fonts, radius, shadowFloating } from "../theme";
import { scaleIn, useEnter } from "../animations";

// Recreates the site's "Fetching reel... / Scanning r/SaaS..." status box:
// a spinner plus a step label that advances every `stepDurationFrames`.
export const ProcessingStatus: React.FC<{
  steps: string[];
  startFrame: number;
  stepDurationFrames?: number;
  variant?: "light" | "dark";
  width?: number;
}> = ({ steps, startFrame, stepDurationFrames = 18, variant = "light", width = 460 }) => {
  const frame = useCurrentFrame();
  const theme = colors[variant];
  const elapsed = Math.max(0, frame - startFrame);
  const index = Math.min(steps.length - 1, Math.floor(elapsed / stepDurationFrames));
  const rotation = (frame * 12) % 360;
  const boxProgress = useEnter(startFrame);

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        ...scaleIn(boxProgress, 0.97),
        width,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: theme.card,
        borderRadius: radius.xl,
        border: `1px solid ${theme.border}`,
        boxShadow: shadowFloating,
        padding: "18px 24px",
      }}
    >
      <Loader2
        size={20}
        color={theme.callout}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <span style={{ fontFamily: fonts.sans, fontSize: 20, color: theme.mutedForeground }}>
        {steps[index]}
      </span>
    </div>
  );
};
