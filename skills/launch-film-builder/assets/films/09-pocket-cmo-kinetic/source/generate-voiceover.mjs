import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

if (!apiKey) {
  console.error("Missing ELEVENLABS_API_KEY — set it in .env first.");
  process.exit(1);
}

const scriptPath = process.argv[2] ?? "voiceover-script.txt";
const outPath = process.argv[3] ?? "public/audio/voiceover.mp3";

const text = (await readFile(scriptPath, "utf-8")).trim();

if (!text) {
  console.error(`${scriptPath} is empty — paste the voiceover script in first.`);
  process.exit(1);
}

const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.4, similarity_boost: 0.8 },
    }),
  },
);

if (!response.ok) {
  const body = await response.text();
  console.error(`ElevenLabs API error ${response.status}: ${body}`);
  process.exit(1);
}

const buffer = Buffer.from(await response.arrayBuffer());
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, buffer);
console.log(`Wrote ${outPath} (${buffer.length} bytes)`);
