#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

WIDTH, HEIGHT = 1920, 1080
BG_COLOR = (245, 235, 215)  # Beige
TEXT_COLOR = (101, 67, 33)  # Brown
BORDER_COLOR = (139, 90, 43)  # Dark brown

OUTPUT_DIR = "content/treasure_hunt_chapter1/layers"

def create_coordinate_layer(filename, coordinate_text):
    """Create a puzzle layer with coordinate text only"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Load fonts
    try:
        coord_font = ImageFont.truetype("C:/Windows/Fonts/georgiai.ttf", 70)
    except:
        coord_font = ImageFont.load_default()

    # Draw border
    draw.rectangle([(40, 40), (WIDTH-40, HEIGHT-40)], outline=BORDER_COLOR, width=8)
    draw.rectangle([(55, 55), (WIDTH-55, HEIGHT-55)], outline=BORDER_COLOR, width=3)

    # Draw coordinate text centered
    coord_bbox = draw.textbbox((0, 0), coordinate_text, font=coord_font)
    coord_w = coord_bbox[2] - coord_bbox[0]
    coord_h = coord_bbox[3] - coord_bbox[1]
    draw.text(((WIDTH - coord_w) // 2, (HEIGHT - coord_h) // 2), coordinate_text, fill=TEXT_COLOR, font=coord_font)

    img.save(os.path.join(OUTPUT_DIR, filename), "PNG", quality=95)
    print(f"Created: {filename}")

# Create TAYLOR puzzle layers
create_coordinate_layer("nft_5_layer_1.png", "ROW 2, COLUMN 2")  # T
create_coordinate_layer("nft_8_layer_4.png", "ROW 1, COLUMN 1")  # A
create_coordinate_layer("nft_12_layer_2.png", "ROW 13, COLUMN 1")  # Y
create_coordinate_layer("nft_15_layer_5.png", "ROW 1, COLUMN 5")  # L
create_coordinate_layer("nft_17_layer_3.png", "ROW 1, COLUMN 3")  # O
create_coordinate_layer("nft_20_layer_6.png", "ROW 1, COLUMN 4")  # R
create_coordinate_layer("nft_4_layer_7.png", "ROW 3, COLUMN 7")  # X (FAKE)

print("\nAll 7 Chapter 1 TAYLOR puzzle layers created!")
print("Letters spell: T-A-Y-L-O-R (John Taylor - La Buse's pirate partner)")
