import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../components/Background";
import { Logo } from "../components/Logo";
import { Statement } from "../components/Statement";
import { Chip } from "../components/Chip";
import { colors, fonts } from "../theme";
import { fadeSlideUp, useEnter } from "../animations";

export const ProductRevealScene: React.FC = () => {
  const chipsProgress = useEnter(70);

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 24 }}
      >
        <Logo size={110} delay={0} />
        <Statement
          fontSize={40}
          startDelay={22}
          fontFamily={fonts.sans}
          maxWidth={900}
          segments={[
            {
              text: "All those tools, on your fingertips.",
              color: colors.light.mutedForeground,
              weight: 500,
            },
          ]}
        />
        <Statement
          fontSize={30}
          startDelay={44}
          fontFamily={fonts.sans}
          maxWidth={900}
          segments={[
            {
              text: "Connect it to Claude Code, Codex, or any harness you use.",
              color: colors.light.foreground,
              weight: 600,
            },
          ]}
        />
        <div
          style={{
            ...fadeSlideUp(chipsProgress, 10),
            display: "flex",
            gap: 16,
            marginTop: 8,
          }}
        >
          <Chip>Claude Code</Chip>
          <Chip>Codex</Chip>
          <Chip>Any harness</Chip>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
