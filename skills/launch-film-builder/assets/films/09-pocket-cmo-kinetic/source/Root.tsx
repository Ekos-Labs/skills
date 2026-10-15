import React from "react";
import { Composition } from "remotion";
import { LaunchVideo, LAUNCH_VIDEO_DURATION } from "./compositions/LaunchVideo";
import { HookScene } from "./compositions/HookScene";
import { ProblemScene } from "./compositions/ProblemScene";
import { InsightScene } from "./compositions/InsightScene";
import { ThesisScene } from "./compositions/ThesisScene";
import { ProductRevealScene } from "./compositions/ProductRevealScene";
import { ReelAnalyzerDemoScene } from "./compositions/ReelAnalyzerDemoScene";
import { RedditRadarDemoScene } from "./compositions/RedditRadarDemoScene";
import { IdeationDemoScene } from "./compositions/IdeationDemoScene";
import { PocketScene } from "./compositions/PocketScene";
import { ClosingScene } from "./compositions/ClosingScene";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

// [id, component, durationInFrames]. durations must match SCENES in
// compositions/LaunchVideo.tsx so isolated scene previews match the cut.
// Retimed against MEASURED pauses in the real voiceover
// (public/audio/voiceover.mp3, 53.03s) via ffmpeg silencedetect, not word
// count -- see the comment above SCENES in compositions/LaunchVideo.tsx for
// the full reasoning and the flagged demo-scene conflict (scenes 6-8 here
// are shorter than their REEL_ANALYZER_DEMO_DURATION/
// REDDIT_RADAR_DEMO_DURATION/IDEATION_DEMO_DURATION minimums, so previewing
// them in isolation will also cut off before their payoff -- matches the
// real cut intentionally, per that comment).
const SCENES: Array<[string, React.FC, number]> = [
  ["Scene-01-Hook", HookScene, 88],
  ["Scene-02-Problem", ProblemScene, 232],
  ["Scene-03-Insight", InsightScene, 196],
  ["Scene-04-Thesis", ThesisScene, 150],
  ["Scene-05-ProductReveal", ProductRevealScene, 260],
  ["Scene-06-ReelAnalyzerDemo", ReelAnalyzerDemoScene, 148],
  ["Scene-07-RedditRadarDemo", RedditRadarDemoScene, 141],
  ["Scene-08-IdeationDemo", IdeationDemoScene, 100],
  ["Scene-09-Pocket", PocketScene, 197],
  ["Scene-10-Closing", ClosingScene, 250],
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LaunchVideo"
        component={LaunchVideo}
        durationInFrames={LAUNCH_VIDEO_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {SCENES.map(([id, component, durationInFrames]) => (
        <Composition
          key={id}
          id={id}
          component={component}
          durationInFrames={durationInFrames}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      ))}
    </>
  );
};
