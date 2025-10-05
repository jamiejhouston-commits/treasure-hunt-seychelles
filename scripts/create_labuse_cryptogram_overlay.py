#!/usr/bin/env python3
"""
Create La Buse cryptogram overlay for Chapter 2 NFT #40
Replaces the coordinates piece with an atmospheric cryptogram reference
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_PATH = os.path.join(PROJECT_ROOT, "content", "treasure_hunt_chapter2", "layers", "nft_40_layer_1.png")

def create_cryptogram_overlay():
    """Create atmospheric La Buse cryptogram overlay"""
    width, height = 768, 768
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Aged parchment background
    draw.rectangle([0, 0, width, height], fill=(222, 209, 176, 230))

    # Border decoration
    draw.rectangle([40, 40, width - 40, height - 40],
                   fill=None, outline=(101, 67, 33, 180), width=3)
    draw.rectangle([50, 50, width - 50, height - 50],
                   fill=None, outline=(101, 67, 33, 120), width=1)

    # Create mock cryptogram symbols (mysterious looking characters)
    # Using unicode symbols to mimic the real La Buse cryptogram
    cryptogram_text = """
    ◊ ∆ ⊕ ◊ ∇ ⊗ ⊕ ∆ ◊ ⊕ ∇
    ⊗ ◊ ∆ ⊕ ⊗ ∇ ◊ ⊕ ∆ ⊗ ◊
    ∇ ⊕ ◊ ∆ ⊗ ⊕ ∇ ◊ ∆ ⊕ ∇
    ⊕ ∆ ⊗ ∇ ◊ ⊕ ∆ ⊗ ∇ ◊ ⊕
    """

    # Try to use a decorative font
    try:
        title_font = ImageFont.truetype("georgiai.ttf", 32)
        symbol_font = ImageFont.truetype("arial.ttf", 28)
        text_font = ImageFont.truetype("georgia.ttf", 22)
    except:
        title_font = ImageFont.load_default()
        symbol_font = ImageFont.load_default()
        text_font = ImageFont.load_default()

    # Title
    draw.text((width // 2, 100), "THE CRYPTOGRAM OF 1730",
              font=title_font, fill=(80, 40, 20, 255), anchor="mm")

    # Horizontal line
    draw.line([(150, 130), (width - 150, 130)],
              fill=(101, 67, 33, 150), width=2)

    # Cryptogram symbols in center
    y_pos = 200
    for line in cryptogram_text.strip().split('\n'):
        draw.text((width // 2, y_pos), line.strip(),
                  font=symbol_font, fill=(60, 30, 10, 200), anchor="mm")
        y_pos += 50

    # Horizontal line
    draw.line([(150, 450), (width - 150, 450)],
              fill=(101, 67, 33, 150), width=2)

    # Mysterious quote
    draw.text((width // 2, 500), "OLIVIER LEVASSEUR",
              font=title_font, fill=(80, 40, 20, 255), anchor="mm")
    draw.text((width // 2, 540), "La Buse - The Buzzard",
              font=text_font, fill=(101, 67, 33, 200), anchor="mm",
              style="italic")

    # Bottom text
    draw.text((width // 2, 620), "THE ORIGINAL RIDDLE",
              font=text_font, fill=(101, 67, 33, 180), anchor="mm")
    draw.text((width // 2, 650), "Your answer lies within these chapters...",
              font=text_font, fill=(101, 67, 33, 150), anchor="mm",
              style="italic")

    # Add some aged texture spots
    for i in range(20):
        import random
        x = random.randint(60, width - 60)
        y = random.randint(60, height - 60)
        r = random.randint(3, 8)
        draw.ellipse([x, y, x + r, y + r], fill=(139, 69, 19, 30))

    # Save
    img.save(OUTPUT_PATH, 'PNG')
    print(f"✓ Created La Buse cryptogram overlay: {OUTPUT_PATH}")

if __name__ == "__main__":
    print("Creating La Buse cryptogram overlay for NFT #40...")
    create_cryptogram_overlay()
    print("Done!")
