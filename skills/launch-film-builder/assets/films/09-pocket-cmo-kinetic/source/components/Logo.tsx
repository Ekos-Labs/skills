import React from "react";
import { AppIcon } from "./AppIcon";
import { Wordmark } from "./Wordmark";

// Icon + wordmark lockup, used wherever the full brand mark appears
// (product reveal, closing card). Choreographed as one cascade: badge in,
// P draws on, "Pocket" and "CMO" settle, coral dot lands last as the
// punctuation beat on the whole lockup.
export const Logo: React.FC<{
  size?: number;
  variant?: "light" | "dark";
  delay?: number;
}> = ({ size = 96, variant = "light", delay = 0 }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <AppIcon
        size={size}
        variant={variant}
        delay={delay}
        pDelay={delay + 8}
        dotDelay={delay + 26}
      />
      <Wordmark
        size={size * 0.82}
        variant={variant}
        delay={delay + 14}
        cmoDelay={delay + 20}
      />
    </div>
  );
};
