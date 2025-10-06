#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

WIDTH, HEIGHT = 1920, 1080
BG_COLOR = (245, 235, 215)  # Beige like originals
TEXT_COLOR = (101, 67, 33)  # Brown
BORDER_COLOR = (139, 90, 43)  # Dark brown

OUTPUT_DIR = "content/treasure_hunt_chapter1/layers"

def create_layer(filename, title, main_text, subtitle, letter_emphasis=False):
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Load fonts
    try:
        title_font = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 80)
        main_font = ImageFont.truetype("C:/Windows/Fonts/georgiai.ttf", 140 if letter_emphasis else 100)
        subtitle_font = ImageFont.truetype("C:/Windows/Fonts/georgiai.ttf", 50)
    except:
        title_font = main_font = subtitle_font = ImageFont.load_default()

    # Draw border
    draw.rectangle([(40, 40), (WIDTH-40, HEIGHT-40)], outline=BORDER_COLOR, width=8)
    draw.rectangle([(55, 55), (WIDTH-55, HEIGHT-55)], outline=BORDER_COLOR, width=3)

    # Title
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    draw.text(((WIDTH - title_w) // 2, 180), title, fill=TEXT_COLOR, font=title_font)

    # Main text (centered)
    main_bbox = draw.textbbox((0, 0), main_text, font=main_font)
    main_w = main_bbox[2] - main_bbox[0]
    main_h = main_bbox[3] - main_bbox[1]
    draw.text(((WIDTH - main_w) // 2, (HEIGHT - main_h) // 2 - 50), main_text, fill=TEXT_COLOR, font=main_font)

    # Subtitle
    sub_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    sub_w = sub_bbox[2] - sub_bbox[0]
    draw.text(((WIDTH - sub_w) // 2, HEIGHT - 250), subtitle, fill=(120, 90, 60), font=subtitle_font)

    img.save(os.path.join(OUTPUT_DIR, filename), "PNG", quality=95)
    print(f"Created: {filename}")

# Create all 7 layers with riddles/clues
create_layer("nft_5_layer_1.png",
    "FIRST LETTER",
    "D",
    "The beginning of DAWN and DESTINY",
    letter_emphasis=True)

create_layer("nft_8_layer_4.png",
    "SECOND LETTER",
    "A",
    "The first letter of the ALPHABET",
    letter_emphasis=True)

create_layer("nft_12_layer_2.png",
    "THIRD LETTER",
    "N",
    "Found in NINE and NORTH",
    letter_emphasis=True)

create_layer("nft_15_layer_5.png",
    "FOURTH LETTER",
    "Z",
    "The last letter - ZERO to ZENITH",
    letter_emphasis=True)

create_layer("nft_17_layer_3.png",
    "FIFTH LETTER",
    "I",
    "The self - ME, MYSELF and ___",
    letter_emphasis=True)

create_layer("nft_20_layer_6.png",
    "FINAL LETTER",
    "L",
    "LOVE begins with this letter",
    letter_emphasis=True)

create_layer("nft_4_layer_7.png",
    "DECOY CLUE",
    "X",
    "Wrong path - this is not the way",
    letter_emphasis=True)

print("\nAll 7 Chapter 1 DANZIL puzzle layers created!")
print("Letters spell: D-A-N-Z-I-L")
