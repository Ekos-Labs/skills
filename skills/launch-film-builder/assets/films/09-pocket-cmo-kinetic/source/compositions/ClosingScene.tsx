import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../components/Background";
import { Statement } from "../components/Statement";
import { Logo } from "../components/Logo";
import { colors, fonts } from "../theme";
import { fadeSlideUp, useEnter } from "../animations";

export const ClosingScene: React.FC = () => {
  const domainProgress = useEnter(118, { damping: 14, mass: 0.6 });

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 56 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
          <Statement
            fontSize={58}
            segments={[{ text: "AI produces slop.", color: colors.light.mutedForeground }]}
          />
          <Statement
            fontSize={70}
            startDelay={18}
            segments={[
              { text: "Real humans don't.", color: colors.light.primary, weight: 700 },
            ]}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
          <Statement
            fontSize={44}
            startDelay={48}
            segments={[
              { text: "Don't use tools to market.", color: colors.light.mutedForeground, weight: 500 },
            ]}
          />
          <Statement
            fontSize={56}
            startDelay={68}
            segments={[
              {
                text: "Use tools to help you market.",
                color: colors.light.primary,
                weight: 700,
              },
            ]}
          />
        </div>
        <Logo size={64} delay={92} />
        <div
          style={{
            ...fadeSlideUp(domainProgress, 10),
            fontFamily: fonts.mono,
            fontSize: 22,
            letterSpacing: 0.5,
            color: colors.light.mutedForeground,
          }}
        >
          pocketcmo.online
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
