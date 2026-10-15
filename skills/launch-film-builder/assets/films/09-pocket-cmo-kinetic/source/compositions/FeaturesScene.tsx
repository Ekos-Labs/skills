import React from "react";
import { AbsoluteFill } from "remotion";
import { Film, Radar, Megaphone, Layers } from "lucide-react";
import { Background } from "../components/Background";
import { FeatureCard } from "../components/FeatureCard";
import { Chip } from "../components/Chip";
import { fonts, colors } from "../theme";
import { fadeSlideUp, useEnter } from "../animations";

const FEATURES = [
  {
    icon: Film,
    title: "Reel analyzer",
    status: "working",
    description: "Paste a reel link → transcript, hooks, structure, frames.",
  },
  {
    icon: Radar,
    title: "Reddit radar",
    status: "working",
    description:
      "Finds people who have the problem your product solves, on Reddit.",
  },
  {
    icon: Megaphone,
    title: "Competitor ads",
    status: "coming soon",
    description: "See what ads any competitor is running, via Meta's library.",
  },
  {
    icon: Layers,
    title: "Carousel",
    status: "coming soon",
    description: "Brandbook + topic → finished carousel slides.",
  },
];

export const FeaturesScene: React.FC = () => {
  const headingProgress = useEnter(0);
  const chipProgress = useEnter(78);

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: 80, gap: 44 }}
      >
        <div
          style={{
            ...fadeSlideUp(headingProgress, 16),
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 52,
            color: colors.light.foreground,
            textAlign: "center",
          }}
        >
          Analyze reels. Scrape Reddit. Make ads.
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
          }}
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={14 + i * 8} />
          ))}
        </div>
        <div style={{ ...fadeSlideUp(chipProgress, 10) }}>
          <Chip>+ Idea gate, Ideation board, Voice, and much more</Chip>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
