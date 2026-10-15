import React from "react";
import { Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { HookScene } from "./HookScene";
import { ProblemScene } from "./ProblemScene";
import { InsightScene } from "./InsightScene";
import { ThesisScene } from "./ThesisScene";
import { ProductRevealScene } from "./ProductRevealScene";
import { ReelAnalyzerDemoScene } from "./ReelAnalyzerDemoScene";
import { RedditRadarDemoScene } from "./RedditRadarDemoScene";
import { IdeationDemoScene } from "./IdeationDemoScene";
import { PocketScene } from "./PocketScene";
import { ClosingScene } from "./ClosingScene";

// Cut following Eshaan's narrative plan (hook → problem → insight → thesis
// → product reveal → live tool demos → price drop → closing line). The
// static FeaturesScene grid (kept unimported in ./FeaturesScene.tsx) was
// replaced with the three real interactive-demo recreations so the "all
// those tools, on your fingertips" claim in ProductRevealScene is
// immediately followed by concrete proof instead of a marketing-copy tile
// grid.
//
// Durations are retimed against MEASURED pauses in the real ElevenLabs
// voiceover (public/audio/voiceover.mp3, 53.03s), not against word count.
// ElevenLabs' plain TTS endpoint returns no per-word timestamps, so a
// previous pass estimated each scene's length by its line's share of the
// script's total word count -- that drifted badly (word-count-per-second
// isn't constant across a TTS render) and got worse scene over scene,
// which is exactly the "voice running behind the video" bug this fixes.
//
// The real fix: `ffmpeg -af silencedetect=noise=-30dB:d=0.15` against the
// mp3 finds every pause in the actual audio. voiceover-script.txt's 8
// paragraphs (and, within paragraph 6, its 3 sentences) map 1:1 to the 10
// scenes below; the paragraph/sentence-boundary pauses are the ground
// truth for where one scene's narration ends and the next begins. Each
// pause's midpoint is converted seconds->frames (30fps), then +18*k/-9
// (half the TRANSITION width per crossfade boundary) is folded back in so
// that the crossfade's midpoint -- not each Sequence's raw frame count --
// lands on the measured boundary (TransitionSeries staggers each scene's
// start by TRANSITION frames per prior crossfade; see LAUNCH_VIDEO_DURATION
// below). Total lands back at 1600 frames (53.33s, ~0.3s trailing silence
// after the VO ends), same as before, just correctly distributed now.
//
// CONFLICT (flagged for Eshaan, not resolved here): the three demo scenes'
// lines in paragraph 6 are short -- measured 148 / 141 / 100 frames of real
// speech for Reel Analyzer / Reddit Radar / Ideation respectively -- but
// each scene's on-screen product recreation is coded with a fixed minimum
// length (REEL_ANALYZER_DEMO_DURATION=282, REDDIT_RADAR_DEMO_DURATION=267,
// IDEATION_DEMO_DURATION=264) to play its full beat without truncating.
// Honoring the measured speech length (done below, per "don't let it
// overflow into the next scene's narration") means all three demo scenes
// get cut off well before their payoff: REEL_ANALYZER's reveal card
// (REVEAL_START=152) never appears within 148 frames; REDDIT_RADAR's
// result cards (REVEAL_START=147) never appear within 141 frames;
// IDEATION's animation only reaches the "Scripting" stage within 100
// frames and never reaches "Posted" (the checkmark payoff, activeStage
// needs frame>=164). The alternative -- give them their full baked-in
// length -- would push Pocket/Closing's start ~360 frames (12s) later than
// paragraphs 7/8's real narration, reintroducing the exact drift bug this
// pass fixes for the last third of the video. Trimming the three demo
// scenes' internal animation timing (STAGE_DURATION, REVEAL_START, etc.)
// to fit inside ~100-150 frames is the real fix, but that's a call on the
// product recreations' pacing, not on retiming -- Eshaan's call.
const TRANSITION = 18;

const SCENES: Array<[React.FC, number]> = [
  [HookScene, 88],
  [ProblemScene, 232],
  [InsightScene, 196],
  [ThesisScene, 150],
  [ProductRevealScene, 260],
  [ReelAnalyzerDemoScene, 148], // needs REEL_ANALYZER_DEMO_DURATION=282 to reach its reveal -- see CONFLICT above
  [RedditRadarDemoScene, 141], // needs REDDIT_RADAR_DEMO_DURATION=267 to reach its reveal -- see CONFLICT above
  [IdeationDemoScene, 100], // needs IDEATION_DEMO_DURATION=264 to reach "Posted" -- see CONFLICT above
  [PocketScene, 197], // > POCKET_SCENE_DURATION=128 (its own animation finishes early and holds -- not a conflict)
  [ClosingScene, 250],
];

export const LaunchVideo: React.FC = () => {
  // TransitionSeries inspects each direct child's type, so the Sequence/
  // Transition elements must be flattened into one array rather than
  // grouped per-scene inside a Fragment (Fragment would hide their types).
  const children: React.ReactNode[] = [];
  SCENES.forEach(([Scene, durationInFrames], i) => {
    children.push(
      <TransitionSeries.Sequence key={`seq-${i}`} durationInFrames={durationInFrames}>
        <Scene />
      </TransitionSeries.Sequence>,
    );
    if (i < SCENES.length - 1) {
      children.push(
        <TransitionSeries.Transition
          key={`trans-${i}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />,
      );
    }
  });

  return (
    <>
      <Audio src={staticFile("audio/voiceover.mp3")} />
      <TransitionSeries>{children}</TransitionSeries>
    </>
  );
};

export const LAUNCH_VIDEO_DURATION =
  SCENES.reduce((sum, [, d]) => sum + d, 0) - TRANSITION * (SCENES.length - 1);
