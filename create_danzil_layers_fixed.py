#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

WIDTH, HEIGHT = 1920, 1080
BG_COLOR = (245, 235, 215)  # Beige
TEXT_COLOR = (101, 67, 33)  # Brown
BORDER_COLOR = (139, 90, 43)  # Dark brown

OUTPUT_DIR = "content/treasure_hunt_chapter1/layers"

def create_puzzle_layer(filename, riddle_text):
    """Create a puzzle layer with ONLY the riddle (no answer shown)"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Load fonts
    try:
        riddle_font = ImageFont.truetype("C:/Windows/Fonts/georgiai.ttf", 70)
    except:
        riddle_font = ImageFont.load_default()

    # Draw border
    draw.rectangle([(40, 40), (WIDTH-40, HEIGHT-40)], outline=BORDER_COLOR, width=8)
    draw.rectangle([(55, 55), (WIDTH-55, HEIGHT-55)], outline=BORDER_COLOR, width=3)

    # Draw riddle text centered
    riddle_bbox = draw.textbbox((0, 0), riddle_text, font=riddle_font)
    riddle_w = riddle_bbox[2] - riddle_bbox[0]
    riddle_h = riddle_bbox[3] - riddle_bbox[1]
    draw.text(((WIDTH - riddle_w) // 2, (HEIGHT - riddle_h) // 2), riddle_text, fill=TEXT_COLOR, font=riddle_font)

    img.save(os.path.join(OUTPUT_DIR, filename), "PNG", quality=95)
    print(f"Created: {filename}")

# Create the 6 REAL puzzle layers (only riddles, no answers)
create_puzzle_layer("nft_5_layer_1.png",
    "The beginning of DAWN and DESTINY")

create_puzzle_layer("nft_8_layer_4.png",
    "The first letter of the ALPHABET")

create_puzzle_layer("nft_12_layer_2.png",
    "Found in NINE and NORTH")

create_puzzle_layer("nft_15_layer_5.png",
    "The last letter - ZERO to ZENITH")

create_puzzle_layer("nft_17_layer_3.png",
    "The self - ME, MYSELF and ___")

create_puzzle_layer("nft_20_layer_6.png",
    "LOVE begins with this letter")

# Create the FAKE puzzle layer (looks convincing, doesn't say "decoy")
create_puzzle_layer("nft_4_layer_7.png",
    "The end of SEAQUEST and TREASURE")

print("\nAll 7 Chapter 1 DANZIL puzzle layers created!")
print("Real letters spell: D-A-N-Z-I-L")
print("Fake clue points to: E (wrong!)")
