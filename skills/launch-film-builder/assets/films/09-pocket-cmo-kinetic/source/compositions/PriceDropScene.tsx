import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../components/Background";
import { Statement } from "../components/Statement";
import { PriceCountdown } from "../components/PriceCountdown";
import { Pill } from "../components/Pill";
import { colors, fonts } from "../theme";

// Countdown starts once the setup lines have landed, runs for 70 frames,
// then holds on "FREE" for the rest of the scene.
const COUNTDOWN_START = 60;
const COUNTDOWN_LENGTH = 70;

export const PriceDropScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 20 }}
      >
        <Statement
          fontSize={36}
          fontFamily={fonts.sans}
          segments={[
            {
              text: "These tools were behind paywalls.",
              color: colors.light.mutedForeground,
              weight: 500,
            },
          ]}
        />
        <Statement
          fontSize={40}
          startDelay={16}
          fontFamily={fonts.sans}
          segments={[
            {
              text: "People paid $297/mo for this.",
              color: colors.light.foreground,
              weight: 600,
            },
          ]}
        />
        <div style={{ marginTop: 12 }}>
          <PriceCountdown
            from={297}
            startFrame={COUNTDOWN_START}
            durationInFrames={COUNTDOWN_LENGTH}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <Pill delay={COUNTDOWN_START + COUNTDOWN_LENGTH + 6}>
            Pocket CMO. Free, forever. Open source.
          </Pill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
