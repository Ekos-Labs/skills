#!/usr/bin/env python3
"""Render carousel slides (1080x1350 PNG) from a JSON spec.

Usage: python3 render_slides.py carousel.json out/

Spec:
{
  "brand": {"bg": "#0b0b0f", "text": "#ffffff", "accent": "#3663ff",
            "font": "/path/to/Font-Bold.ttf", "body_font": "/path/to/Font-Regular.ttf",
            "handle": "@yourhandle"},
  "slides": [
    {"title": "Hook line", "body": "Optional supporting text", "image": "photos/1.jpg"},
    ...
  ]
}
Images are optional per slide; with one, it fills the slide under a dark gradient.
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
PAD = 96


def font(path, size, bold=True):
    fallbacks = (["/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"] if bold
                 else ["/System/Library/Fonts/Supplemental/Arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"])
    for candidate in [path, *fallbacks, "/System/Library/Fonts/Helvetica.ttc"]:
        if candidate and os.path.exists(candidate):
            try:
                return ImageFont.truetype(candidate, size)
            except OSError:
                continue
    return ImageFont.load_default(size)


def wrap(draw, text, fnt, width):
    lines, line = [], ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=fnt) <= width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def fit(draw, text, path, width, max_h, start, minimum, bold=True):
    size = start
    while size >= minimum:
        fnt = font(path, size, bold)
        lines = wrap(draw, text, fnt, width)
        height = len(lines) * int(size * 1.15)
        if height <= max_h:
            return fnt, lines, size
        size -= 4
    raise ValueError(f"Text does not fit even at {minimum}px: {text[:60]}...")


def cover(img):
    scale = max(W / img.width, H / img.height)
    img = img.resize((int(img.width * scale) + 1, int(img.height * scale) + 1))
    left, top = (img.width - W) // 2, (img.height - H) // 2
    return img.crop((left, top, left + W, top + H))


def render(spec, out_dir):
    brand = spec.get("brand", {})
    bg, fg, accent = brand.get("bg", "#0b0b0f"), brand.get("text", "#ffffff"), brand.get("accent", "#3663ff")
    os.makedirs(out_dir, exist_ok=True)
    slides = spec["slides"]
    paths = []
    for i, slide in enumerate(slides, 1):
        canvas = Image.new("RGB", (W, H), bg)
        if slide.get("image"):
            photo = cover(Image.open(slide["image"]).convert("RGB"))
            canvas.paste(photo)
            shade = Image.new("L", (1, H))
            for y in range(H):
                shade.putpixel((0, y), int(60 + 170 * (y / H)))
            canvas.paste(Image.new("RGB", (W, H), "#000000"), mask=shade.resize((W, H)))
        draw = ImageDraw.Draw(canvas)
        width = W - 2 * PAD
        title_font, title_lines, title_size = fit(draw, slide["title"], brand.get("font"), width, 560, 92 if i == 1 else 72, 40)
        body = slide.get("body", "")
        body_font, body_lines, body_size = (fit(draw, body, brand.get("body_font"), width, 420, 40, 26, bold=False) if body else (None, [], 0))
        block = len(title_lines) * int(title_size * 1.15) + (48 + len(body_lines) * int(body_size * 1.4) if body else 0)
        y = (H - block) // 2 if not slide.get("image") else H - PAD - 80 - block
        draw.rectangle([PAD, y - 40, PAD + 72, y - 32], fill=accent)
        for line in title_lines:
            draw.text((PAD, y), line, font=title_font, fill=fg)
            y += int(title_size * 1.15)
        if body:
            y += 48
            for line in body_lines:
                draw.text((PAD, y), line, font=body_font, fill=fg)
                y += int(body_size * 1.4)
        small = font(brand.get("body_font"), 28, bold=False)
        draw.text((PAD, H - PAD + 10), brand.get("handle", ""), font=small, fill=fg)
        counter = f"{i}/{len(slides)}"
        draw.text((W - PAD - draw.textlength(counter, font=small), H - PAD + 10), counter, font=small, fill=fg)
        path = os.path.join(out_dir, f"slide-{i:02d}.png")
        canvas.save(path, optimize=True)
        paths.append(path)
    return paths


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    with open(sys.argv[1]) as handle:
        for p in render(json.load(handle), sys.argv[2]):
            print(p)
