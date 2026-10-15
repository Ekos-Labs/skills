#!/usr/bin/env bash
# Start a launch film project from the bundled template.
#   bash new_project.sh <target-dir>
# Copies the template, installs dependencies (pinned Remotion, three.js, fonts) and prints next steps.
set -euo pipefail
target="${1:-}"
if [ -z "$target" ]; then echo "usage: bash new_project.sh <target-dir>"; exit 1; fi
if [ -e "$target" ] && [ -n "$(ls -A "$target" 2>/dev/null)" ]; then
  echo "$target exists and is not empty; pick a new folder so nothing is overwritten."; exit 1
fi
here="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$target"
cp -R "$here/../assets/template/." "$target/"
mv "$target/gitignore" "$target/.gitignore"
command -v node >/dev/null || { echo "Node.js 18+ is required: https://nodejs.org"; exit 1; }
command -v ffmpeg >/dev/null || echo "warning: ffmpeg not found (macOS: brew install ffmpeg). The audio and master steps need it."
(cd "$target" && npm install --no-audit --no-fund --loglevel=error)
cat <<EOF

Project ready: $target
Next:
  1. Write the voice lines in $target/src/script.json
  2. python3 "$here/prepare_audio.py" --project "$target"
  3. cd "$target" && npx remotion studio src/index.ts      (live preview)
  4. node scripts/render.mjs PromoWide --stills 1,5,10      (quick checks)
  5. node scripts/render.mjs PromoWide && node scripts/render.mjs PromoVertical
EOF
