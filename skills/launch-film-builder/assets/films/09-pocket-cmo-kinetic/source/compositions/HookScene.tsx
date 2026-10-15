import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../components/Background";
import { Statement } from "../components/Statement";
import { colors } from "../theme";

export const HookScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 4 }}
      >
        <Statement
          fontSize={72}
          segments={[
            { text: "Building is easy.", color: colors.light.mutedForeground },
          ]}
        />
        <Statement
          fontSize={80}
          startDelay={20}
          segments={[
            { text: "Marketing is not.", color: colors.light.foreground, weight: 700 },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
