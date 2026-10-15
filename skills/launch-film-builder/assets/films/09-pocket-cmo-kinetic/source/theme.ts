// Mirrors the brand tokens in donna-cmo-site/src/app/globals.css so the
// launch video matches the site pixel-for-pixel instead of drifting.
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: serif } = loadSerif("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});
const { fontFamily: sans } = loadSans("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: mono } = loadMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const fonts = { serif, sans, mono };

export const colors = {
  light: {
    background: "#f6f4f0",
    foreground: "#17191c",
    card: "#ffffff",
    primary: "#1b3a1f",
    primaryForeground: "#f6f4f0",
    secondary: "#efece4",
    mutedForeground: "#777b86",
    border: "#e5e1d8",
    callout: "#e0447a",
    calloutForeground: "#ffffff",
  },
  dark: {
    background: "#17191c",
    foreground: "#f2f2f3",
    card: "#202226",
    primary: "#bfe8c9",
    primaryForeground: "#123018",
    secondary: "#26282c",
    mutedForeground: "#979799",
    border: "rgba(255,255,255,0.1)",
    callout: "#f082ac",
    calloutForeground: "#7a1f45",
  },
};

export const radius = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
};

export const shadowFloating =
  "0 0 0 1px rgba(4,23,43,0.05), 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)";

export type Theme = typeof colors.light;
