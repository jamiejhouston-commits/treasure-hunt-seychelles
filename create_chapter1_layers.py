#!/usr/bin/env python3
"""
Generate Chapter 1 puzzle layer images with large fonts
Creates 7 coordinate images for the DANZIL puzzle
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Image specifications
WIDTH = 1920
HEIGHT = 1080
BACKGROUND_COLOR = (245, 235, 215)  # Beige parchment color
TEXT_COLOR = (40, 20, 0)  # Dark brown/black
FONT_SIZE = 120  # Large bold font

# Output directory
OUTPUT_DIR = "content/treasure_hunt_chapter1/layers"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Coordinate data for each NFT
coordinates = [
    {"nft": 3, "text": "ROW 2, COLUMN 3", "note": "FAKE"},
    {"nft": 5, "text": "ROW 4, COLUMN 8", "note": "→ D"},
    {"nft": 8, "text": "ROW 1, COLUMN 1", "note": "→ A"},
    {"nft": 12, "text": "ROW 7, COLUMN 5", "note": "→ N"},
    {"nft": 15, "text": "ROW 17, COLUMN 9", "note": "→ Z"},
    {"nft": 17, "text": "ROW 5, COLUMN 5", "note": "→ I"},
    {"nft": 20, "text": "ROW 16, COLUMN 1", "note": "→ L"},
]

def create_layer_image(nft_id, text, note=""):
    """Create a single layer image with coordinate text"""

    # Create image with parchment background
    img = Image.new('RGB', (WIDTH, HEIGHT), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(img)

    # Try to load a bold monospace font, fallback to default
    try:
        # Try common monospace fonts
        font = ImageFont.truetype("C:/Windows/Fonts/courbd.ttf", FONT_SIZE)  # Courier New Bold
    except:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/cour.ttf", FONT_SIZE)  # Courier New
        except:
            try:
                font = ImageFont.truetype("arial.ttf", FONT_SIZE)
            except:
                font = ImageFont.load_default()
                print(f"⚠️  Using default font for NFT #{nft_id}")

    # Calculate text position (centered)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (WIDTH - text_width) // 2
    y = (HEIGHT - text_height) // 2 - 50  # Slightly above center

    # Add aged paper texture effect (subtle lines)
    for i in range(0, HEIGHT, 40):
        draw.line([(0, i), (WIDTH, i)], fill=(235, 225, 205), width=1)

    # Draw main coordinate text
    draw.text((x, y), text, fill=TEXT_COLOR, font=font)

    # Add small note below (letter or FAKE indicator)
    if note:
        try:
            note_font = ImageFont.truetype("C:/Windows/Fonts/courbd.ttf", 60)
        except:
            note_font = font

        note_bbox = draw.textbbox((0, 0), note, font=note_font)
        note_width = note_bbox[2] - note_bbox[0]
        note_x = (WIDTH - note_width) // 2
        note_y = y + text_height + 50

        note_color = (200, 50, 50) if "FAKE" in note else (100, 100, 100)
        draw.text((note_x, note_y), note, fill=note_color, font=note_font)

    # Add decorative border
    border_width = 20
    draw.rectangle(
        [(border_width, border_width), (WIDTH - border_width, HEIGHT - border_width)],
        outline=(139, 90, 43),  # Brown border
        width=8
    )

    # Add corner decorations (simple X marks)
    corner_size = 60
    for corner_x, corner_y in [(50, 50), (WIDTH-50, 50), (50, HEIGHT-50), (WIDTH-50, HEIGHT-50)]:
        draw.line([(corner_x-corner_size, corner_y-corner_size), (corner_x+corner_size, corner_y+corner_size)],
                  fill=(139, 90, 43), width=4)
        draw.line([(corner_x-corner_size, corner_y+corner_size), (corner_x+corner_size, corner_y-corner_size)],
                  fill=(139, 90, 43), width=4)

    # Save image
    output_path = os.path.join(OUTPUT_DIR, f"nft_{nft_id}_layer_1.png")
    img.save(output_path, "PNG", quality=95)
    print(f"Created: {output_path}")

    return output_path

# Generate all 7 images
print("Generating Chapter 1 puzzle layer images...\n")

for coord_data in coordinates:
    create_layer_image(
        nft_id=coord_data["nft"],
        text=coord_data["text"],
        note=coord_data["note"]
    )

print(f"\nSuccessfully created {len(coordinates)} layer images!")
print(f"Location: {OUTPUT_DIR}")
print("\nImages created:")
for coord_data in coordinates:
    print(f"   - nft_{coord_data['nft']}_layer_1.png: \"{coord_data['text']}\" {coord_data['note']}")
