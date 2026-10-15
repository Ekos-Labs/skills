import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { AppIcon } from "../components/AppIcon";
import { colors, fonts } from "../theme";
import { fadeSlideUp, useEnter } from "../animations";

// Ports donna-cmo-site's CompetitorPocket (src/components/ui/competitor-pocket.tsx)
// from Framer Motion's CSS-timeline model to Remotion's frame-based one: same
// 16 tools, same fixed ring offsets, same three-beat story (gather one by one
// -> hold so it reads as "separate paid tools" -> drift inward into the badge),
// just driven by useCurrentFrame()/spring() instead of setTimeout/motion values
// so it renders correctly out of sequence.
const ORBIT_TOOLS = [
  { name: "Reelyze", logo: "reelyze.png", dx: 130, dy: 0 },
  { name: "Later", logo: "later.png", dx: 164, dy: 68 },
  { name: "GummySearch", logo: "gummysearch.png", dx: 92, dy: 92 },
  { name: "Trello", logo: "trello.png", dx: 68, dy: 164 },
  { name: "Notion", logo: "notion.png", dx: 0, dy: 130 },
  { name: "Asana", logo: "asana.png", dx: -68, dy: 164 },
  { name: "ClickUp", logo: "clickup.png", dx: -92, dy: 92 },
  { name: "Jasper", logo: "jasper.png", dx: -164, dy: 68 },
  { name: "Copy.ai", logo: "copyai.png", dx: -130, dy: 0 },
  { name: "Writesonic", logo: "writesonic.png", dx: -164, dy: -68 },
  { name: "Predis.ai", logo: "predis.png", dx: -92, dy: -92 },
  { name: "Canva", logo: "canva.jpg", dx: -68, dy: -164 },
  { name: "Foreplay", logo: "foreplay.jpg", dx: 0, dy: -130 },
  { name: "PowerAdSpy", logo: "poweradspy.png", dx: 68, dy: -164 },
  { name: "AdSpy", logo: "adspy.png", dx: 92, dy: -92 },
  { name: "BigSpy", logo: "bigspy.png", dx: 164, dy: -68 },
] as const;

// Beat 1: gather. Each logo fades/scales up in place at its fixed ring
// offset -- it doesn't travel in, it just appears there, one by one.
const GATHER_START = 4;
const GATHER_STAGGER = 2;
const GATHER_LAST_START = GATHER_START + (ORBIT_TOOLS.length - 1) * GATHER_STAGGER; // 34
const GATHER_END = GATHER_LAST_START + 12; // 46 - last logo visually settled

// Beat 2: hold, so it reads as "these are all separate paid tools."
const HOLD = 10;
const POCKET_START = GATHER_END + HOLD; // 56

// Beat 3: pocket. Each logo drifts inward to center, shrinking and fading,
// landing on the real badge.
const POCKET_STAGGER = 2;
const POCKET_ITEM_DURATION = 12;
const POCKET_LAST_START = POCKET_START + (ORBIT_TOOLS.length - 1) * POCKET_STAGGER; // 86
const POCKET_END = POCKET_LAST_START + POCKET_ITEM_DURATION; // 98

const BADGE_PULSE_START = POCKET_END + 2; // 100
const PAYOFF_START = POCKET_END + 6; // 104
const PAYOFF_DURATION = 16;

export const POCKET_SCENE_DURATION = PAYOFF_START + PAYOFF_DURATION + 8; // 128

const OrbitLogo: React.FC<{ tool: (typeof ORBIT_TOOLS)[number]; index: number }> = ({
  tool,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gatherProgress = spring({
    frame: frame - (GATHER_START + index * GATHER_STAGGER),
    fps,
    config: { damping: 16, mass: 0.5 },
  });
  const pocketProgress = spring({
    frame: frame - (POCKET_START + index * POCKET_STAGGER),
    fps,
    config: { damping: 16, mass: 0.5 },
  });

  const baseScale = interpolate(gatherProgress, [0, 1], [0.8, 1]);
  const scale = interpolate(pocketProgress, [0, 1], [baseScale, 0.15], {
    extrapolateLeft: "clamp",
  });
  const opacity =
    interpolate(gatherProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" }) *
    interpolate(pocketProgress, [0, 1], [1, 0], { extrapolateLeft: "clamp" });
  const x = tool.dx * (1 - pocketProgress);
  const y = tool.dy * (1 - pocketProgress);

  return (
    <div
      style={{
        position: "absolute",
        width: 68,
        height: 68,
        opacity,
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
        left: "50%",
        top: "50%",
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      <Img
        src={staticFile(`logos/${tool.logo}`)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export const PocketScene: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = colors.light;
  const headingProgress = useEnter(0);

  const badgeProgress = useEnter(2, { damping: 14, mass: 0.6 });
  const pulse = interpolate(
    frame,
    [BADGE_PULSE_START, BADGE_PULSE_START + 6, BADGE_PULSE_START + 14],
    [1, 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const payoffProgress = interpolate(
    frame,
    [PAYOFF_START, PAYOFF_START + PAYOFF_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Counts down from $201/mo to $0 across the payoff window, same total as
  // the reference's NumberTicker(startValue: 201, value: 0).
  const priceEased = 1 - Math.pow(1 - payoffProgress, 3);
  const price = Math.round(interpolate(priceEased, [0, 1], [201, 0]));

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, gap: 20 }}>
        <div
          style={{
            ...fadeSlideUp(headingProgress, 16),
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 52,
            color: theme.foreground,
            textAlign: "center",
          }}
        >
          16 tools. One pocket.
        </div>

        <div
          style={{
            position: "relative",
            width: 460,
            height: 460,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {ORBIT_TOOLS.map((tool, i) => (
            <OrbitLogo key={tool.name} tool={tool} index={i} />
          ))}

          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              opacity: badgeProgress,
              transform: `scale(${interpolate(badgeProgress, [0, 1], [0.9, 1]) * pulse})`,
            }}
          >
            <AppIcon size={92} delay={2} />

            <div
              style={{
                opacity: payoffProgress,
                transform: `translateY(${interpolate(payoffProgress, [0, 1], [10, 0])}px)`,
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                fontFamily: fonts.mono,
                fontSize: 22,
                color: theme.mutedForeground,
              }}
            >
              <span style={{ color: theme.foreground, fontWeight: 600 }}>
                ${price}/mo
              </span>
              <span>now free, forever</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
