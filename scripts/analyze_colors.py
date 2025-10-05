from collections import Counter
from pathlib import Path
from PIL import Image
import sys

if len(sys.argv) < 2:
    print("Usage: python analyze_colors.py <image_path>")
    sys.exit(1)

path = Path(sys.argv[1])
if not path.exists():
    print(f"File not found: {path}")
    sys.exit(1)

img = Image.open(path).convert('RGBA')
colors = Counter(img.getdata())
print(f"Top colors in {path}:")
for color, count in colors.most_common(30):
    print(f"{color}: {count}")
