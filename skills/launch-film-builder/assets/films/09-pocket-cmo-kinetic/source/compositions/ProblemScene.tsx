import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../components/Background";
import { Statement } from "../components/Statement";
import { ChatPromptMock } from "../components/ChatPromptMock";
import { colors, fonts } from "../theme";

export const ProblemScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 44 }}
      >
        <Statement
          fontSize={44}
          fontFamily={fonts.sans}
          maxWidth={1100}
          segments={[
            {
              text: "Most of us build an app, then ask Claude for",
              color: colors.light.mutedForeground,
              weight: 500,
            },
          ]}
        />
        <ChatPromptMock
          prompt="give me 100 hooks and strategies to get users"
          delay={12}
          rejectDelay={48}
        />
        <Statement
          fontSize={56}
          startDelay={64}
          segments={[
            {
              text: "It doesn't work like that.",
              color: colors.light.callout,
              weight: 700,
            },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
