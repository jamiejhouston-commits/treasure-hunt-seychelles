from __future__ import annotations

from pathlib import Path
from typing import Tuple

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "content" / "ch6" / "output"
BACKUP_DIR = ROOT / "content" / "ch6" / "backup_originals"

BACKUP_DIR.mkdir(exist_ok=True)

TARGETS = {
    "ch6_014.png": "green",
    "ch6_020.png": "white",
}


def backup_file(path: Path) -> None:
    backup_path = BACKUP_DIR / path.name
    if not backup_path.exists():
        backup_path.write_bytes(path.read_bytes())


def neighbors_average(pixels: Image.Image, x: int, y: int) -> Tuple[int, int, int]:
    width, height = pixels.size
    total_r = total_g = total_b = count = 0
    px = pixels.load()
    for nx in range(max(0, x - 1), min(width, x + 2)):
        for ny in range(max(0, y - 1), min(height, y + 2)):
            if nx == x and ny == y:
                continue
            r, g, b, a = px[nx, ny]
            if a == 0:
                continue
            total_r += r
            total_g += g
            total_b += b
            count += 1
    if count == 0:
        return px[x, y][0], px[x, y][1], px[x, y][2]
    return total_r // count, total_g // count, total_b // count


def soften_green_artifacts(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    orig = img.copy()
    orig_px = orig.load()
    px = img.load()
    width, height = img.size

    for x in range(width):
        for y in range(height):
            r, g, b, a = orig_px[x, y]
            if a == 0:
                continue
            if g > r + 20 and g > b + 20 and g > 70:
                avg_r, avg_g, avg_b = neighbors_average(orig, x, y)
                # blend with average to mute the neon tint
                px[x, y] = (
                    (avg_r * 3 + r) // 4,
                    (avg_g * 3 + g) // 4,
                    (avg_b * 3 + b) // 4,
                    a,
                )
    img.save(path)


def soften_white_overlays(path: Path, reduce_alpha: float = 0.5) -> None:
    img = Image.open(path).convert("RGBA")
    px = img.load()
    width, height = img.size

    for x in range(width):
        for y in range(height):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if r > 220 and g > 220 and b > 220:
                # fade and warm the tone to reduce repetition
                new_r = int((r + 180) / 2)
                new_g = int((g + 170) / 2)
                new_b = int((b + 150) / 2)
                new_a = int(a * reduce_alpha)
                px[x, y] = (new_r, new_g, new_b, new_a)
    img.save(path)


def main() -> None:
    for filename, mode in TARGETS.items():
        path = OUTPUT_DIR / filename
        if not path.exists():
            print(f"Skipping missing file: {path}")
            continue
        backup_file(path)
        if mode == "green":
            print(f"Softening green artifacts in {filename}")
            soften_green_artifacts(path)
        elif mode == "white":
            print(f"Softening white overlays in {filename}")
            soften_white_overlays(path)


if __name__ == "__main__":
    main()
