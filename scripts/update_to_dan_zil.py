#!/usr/bin/env python3
"""
Update puzzle to use DAN ZIL as the answer
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "content", "treasure_hunt_chapter1", "layers")

os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_font(size):
    try:
        for font_name in ['Arial.ttf', 'arial.ttf', 'Arial', 'calibri.ttf']:
            try:
                return ImageFont.truetype(font_name, size)
            except:
                continue
        return ImageFont.load_default()
    except:
        return ImageFont.load_default()

def create_dan_zil_cipher():
    """NFT #5: Create cipher text for DAN ZIL"""
    print("Creating NFT #5: Cipher 'EBO [JM' (DAN ZIL shifted +1)...")

    img = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Dark parchment backdrop
    backdrop = Image.new('RGBA', (600, 300), (0, 0, 0, 0))
    backdrop_draw = ImageDraw.Draw(backdrop)

    backdrop_draw.rectangle([0, 0, 600, 300],
                           fill=(25, 20, 15, 220),
                           outline=(80, 60, 40, 255),
                           width=3)

    # Torn edges
    for i in range(0, 600, 20):
        backdrop_draw.polygon([(i, 0), (i+10, 8), (i+20, 0)], fill=(25, 20, 15, 220))
        backdrop_draw.polygon([(i, 300), (i+10, 292), (i+20, 300)], fill=(25, 20, 15, 220))

    img.paste(backdrop, (100, 250), backdrop)

    font_main = get_font(72)
    font_label = get_font(24)

    # Cipher text: EBO [JM (DAN ZIL with shift +1)
    # Note: Space becomes [, but we'll show it as a visible bracket
    cipher_text = "EBO AJM"
    draw.text((400, 400), cipher_text, font=font_main,
              fill=(255, 215, 0), anchor="mm", stroke_width=2, stroke_fill=(80, 60, 40))

    draw.text((400, 320), "~ ENCODED MESSAGE ~", font=font_label,
              fill=(200, 170, 130), anchor="mm")

    draw.text((400, 480), "Decipher to find the treasure", font=get_font(18),
              fill=(160, 140, 100), anchor="mm")

    # Save
    output_path = os.path.join(OUTPUT_DIR, "nft_5_layer_1.png")
    img.save(output_path, 'PNG')

    backend_path = os.path.join(PROJECT_ROOT, "backend", "public", "images", "nft_5_layer_1.png")
    img.save(backend_path, 'PNG')

    print(f"+ Saved cipher to: {output_path}")
    print(f"+ Also saved to backend: {backend_path}")

# Generate cipher
print("\n" + "="*70)
print("UPDATING PUZZLE TO 'DAN ZIL'")
print("="*70)
create_dan_zil_cipher()
print("="*70)
print("Updated NFT #5: Cipher is now 'EBO [JM'")
print("To decode: Shift back one letter:")
print("E -> D, B -> A, O -> N, [ -> (space), J -> I, M -> L")
print("Answer: DAN ZIL")
print("="*70)