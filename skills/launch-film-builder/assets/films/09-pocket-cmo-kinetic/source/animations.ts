import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Shared spring/interpolate helpers so every scene enters and settles with
// the same feel instead of each component inventing its own timing curve.

export const useEnter = (delay = 0, config?: Parameters<typeof spring>[0]["config"]) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, ...config },
  });
};

export const fadeSlideUp = (progress: number, distance = 24) => ({
  opacity: progress,
  transform: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
});

export const scaleIn = (progress: number, from = 0.9) => ({
  opacity: progress,
  transform: `scale(${interpolate(progress, [0, 1], [from, 1])})`,
});
