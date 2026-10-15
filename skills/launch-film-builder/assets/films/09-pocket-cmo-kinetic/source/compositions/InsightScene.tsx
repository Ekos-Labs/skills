import React from "react";
import { AbsoluteFill } from "remotion";
import { Brain, Heart, Users } from "lucide-react";
import { Background } from "../components/Background";
import { Statement } from "../components/Statement";
import { colors, fonts } from "../theme";
import { fadeSlideUp, useEnter } from "../animations";

const ICONS = [Brain, Heart, Users];

export const InsightScene: React.FC = () => {
  const iconsProgress = useEnter(58);

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 36 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
          <Statement
            fontSize={52}
            segments={[
              { text: "The best marketers use", color: colors.light.mutedForeground, weight: 500 },
            ]}
          />
          <Statement
            fontSize={68}
            startDelay={18}
            segments={[
              { text: "human psychology and emotion", color: colors.light.primary, weight: 700 },
            ]}
          />
          <Statement
            fontSize={44}
            startDelay={40}
            fontFamily={fonts.sans}
            segments={[
              {
                text: "to understand what works and what doesn't.",
                color: colors.light.mutedForeground,
                weight: 500,
              },
            ]}
          />
        </div>
        <div
          style={{
            ...fadeSlideUp(iconsProgress, 10),
            display: "flex",
            gap: 28,
          }}
        >
          {ICONS.map((Icon, i) => (
            <div
              key={i}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: colors.light.card,
                border: `1px solid ${colors.light.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={32} color={colors.light.primary} strokeWidth={1.75} />
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
