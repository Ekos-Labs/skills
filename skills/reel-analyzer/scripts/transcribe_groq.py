#!/usr/bin/env python3
"""Transcribe a video's audio with Groq Whisper. Reads GROQ_API_KEY from the environment."""

import json
import os
import subprocess
import sys
import tempfile
import uuid
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
MODEL = "whisper-large-v3-turbo"


def _multipart(fields, file_field, filename, data):
    boundary = uuid.uuid4().hex
    parts = []
    for name, value in fields.items():
        parts.append(
            f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode()
        )
    parts.append(
        f'--{boundary}\r\nContent-Disposition: form-data; name="{file_field}"; filename="{filename}"\r\n'
        f"Content-Type: audio/mpeg\r\n\r\n".encode()
        + data
        + b"\r\n"
    )
    parts.append(f"--{boundary}--\r\n".encode())
    return b"".join(parts), f"multipart/form-data; boundary={boundary}"


def transcribe(video_path, model=MODEL):
    """Return {"text", "language", "segments": [{"start", "end", "text"}]}.

    Raises RuntimeError with a readable message on any failure.
    """
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in the environment")

    # A small mono MP3 keeps long videos under Groq's upload limit.
    fd, audio_path = tempfile.mkstemp(suffix=".mp3")
    os.close(fd)
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", video_path, "-vn", "-ac", "1", "-ar", "16000", "-b:a", "32k", audio_path],
            check=True, capture_output=True,
        )
        with open(audio_path, "rb") as f:
            body, content_type = _multipart(
                {"model": model, "response_format": "verbose_json", "temperature": "0"},
                "file", "audio.mp3", f.read(),
            )
        req = Request(
            GROQ_URL, data=body, method="POST",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": content_type,
                     "User-Agent": "ekos-reel-analyzer/1.0"},
        )
        try:
            with urlopen(req, timeout=180) as resp:
                payload = json.loads(resp.read())
        except HTTPError as e:
            detail = e.read().decode(errors="replace")[:300]
            if e.code == 401:
                raise RuntimeError("Groq rejected GROQ_API_KEY (401). Check the key at console.groq.com.") from None
            if e.code == 429:
                raise RuntimeError("Groq rate limit hit (429). Wait a minute and rerun.") from None
            raise RuntimeError(f"Groq returned HTTP {e.code}: {detail}") from None
        except URLError as e:
            raise RuntimeError(f"Could not reach Groq: {e.reason}") from None
    except subprocess.CalledProcessError:
        raise RuntimeError("ffmpeg could not extract audio (the video may have no audio track)") from None
    finally:
        if os.path.exists(audio_path):
            os.unlink(audio_path)

    return {
        "text": (payload.get("text") or "").strip(),
        "language": payload.get("language"),
        "segments": [
            {"start": round(s["start"], 2), "end": round(s["end"], 2), "text": s["text"].strip()}
            for s in payload.get("segments", [])
        ],
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("Usage: python3 transcribe_groq.py <video_path>")
    try:
        print(json.dumps(transcribe(sys.argv[1]), indent=2, ensure_ascii=False))
    except RuntimeError as e:
        sys.exit(str(e))
