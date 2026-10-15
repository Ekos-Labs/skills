import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../components/Background";
import { Statement } from "../components/Statement";
import { colors } from "../theme";

// The pivot line of the whole video: tools augment human marketing work,
// they don't replace it. Sets up the product reveal that follows.
export const ThesisScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <Statement
          fontSize={60}
          segments={[
            {
              text: "They use tools to understand people.",
              color: colors.light.foreground,
              weight: 600,
            },
          ]}
        />
        <Statement
          fontSize={76}
          startDelay={26}
          segments={[
            {
              text: "not to replace their work.",
              color: colors.light.callout,
              weight: 700,
            },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
