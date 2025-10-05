#!/usr/bin/env python3
"""
Generate correct puzzle overlay images for Bel Ombre treasure hunt (Chapter 1)
"""

from PIL import Image, ImageDraw, ImageFont
import os
import json

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "images")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_text_overlay(text, output_filename, font_size=80, text_color=(255, 215, 0)):
    """Create a text overlay with dark backdrop"""
    # Create transparent image
    width, height = 800, 800
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Try to use a good font, fallback to default
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()

    # Get text bbox
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Calculate position (centered)
    x = (width - text_width) // 2
    y = (height - text_height) // 2

    # Draw dark backdrop with padding
    padding = 40
    backdrop_x1 = x - padding
    backdrop_y1 = y - padding
    backdrop_x2 = x + text_width + padding
    backdrop_y2 = y + text_height + padding

    # Draw backdrop
    draw.rectangle(
        [backdrop_x1, backdrop_y1, backdrop_x2, backdrop_y2],
        fill=(0, 0, 0, 192),  # 75% opacity black
        outline=(40, 40, 40, 200),
        width=2
    )

    # Draw text
    draw.text((x, y), text, font=font, fill=text_color)

    # Save
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    img.save(output_path, 'PNG')
    print(f"Created: {output_filename}")

def create_map_overlay(output_filename):
    """Create a map overlay showing Bel Ombre location"""
    width, height = 800, 800
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw backdrop for map
    map_x1, map_y1 = 100, 100
    map_x2, map_y2 = 700, 700

    # Semi-transparent dark backdrop
    draw.rectangle(
        [map_x1, map_y1, map_x2, map_y2],
        fill=(20, 30, 40, 200),  # Dark blue-gray
        outline=(100, 100, 100, 255),
        width=3
    )

    # Draw simple Mahé island outline (simplified shape)
    # Mahé is roughly elongated north-south
    island_points = [
        (400, 150),  # North tip
        (450, 200),
        (470, 280),
        (460, 350),
        (480, 420),
        (450, 500),
        (420, 580),
        (380, 630),  # South tip
        (340, 580),
        (320, 500),
        (330, 420),
        (340, 350),
        (350, 280),
        (370, 200),
        (400, 150)   # Close path
    ]

    # Draw island
    draw.polygon(island_points, fill=(50, 80, 50, 180), outline=(150, 200, 150, 255))

    # Draw Bel Ombre location (northwest coast)
    bel_ombre_x, bel_ombre_y = 360, 250

    # Draw X mark
    cross_size = 20
    draw.line(
        [(bel_ombre_x - cross_size, bel_ombre_y - cross_size),
         (bel_ombre_x + cross_size, bel_ombre_y + cross_size)],
        fill=(255, 0, 0, 255), width=4
    )
    draw.line(
        [(bel_ombre_x - cross_size, bel_ombre_y + cross_size),
         (bel_ombre_x + cross_size, bel_ombre_y - cross_size)],
        fill=(255, 0, 0, 255), width=4
    )

    # Draw circle around X
    draw.ellipse(
        [(bel_ombre_x - 30, bel_ombre_y - 30),
         (bel_ombre_x + 30, bel_ombre_y + 30)],
        outline=(255, 0, 0, 255), width=3
    )

    # Add labels
    try:
        font_title = ImageFont.truetype("arial.ttf", 36)
        font_label = ImageFont.truetype("arial.ttf", 24)
    except:
        font_title = ImageFont.load_default()
        font_label = ImageFont.load_default()

    # Title
    draw.text((400, 120), "MAHÉ ISLAND", font=font_title,
              fill=(255, 215, 0, 255), anchor="mm")

    # Bel Ombre label with arrow
    draw.text((bel_ombre_x - 80, bel_ombre_y - 50), "BEL OMBRE",
              font=font_label, fill=(255, 255, 255, 255))
    draw.line([(bel_ombre_x - 40, bel_ombre_y - 35), (bel_ombre_x - 5, bel_ombre_y - 5)],
              fill=(255, 255, 255, 255), width=2)

    # Compass rose (simple N arrow)
    compass_x, compass_y = 620, 180
    draw.line([(compass_x, compass_y + 30), (compass_x, compass_y - 30)],
              fill=(255, 255, 255, 200), width=2)
    draw.polygon([(compass_x, compass_y - 30), (compass_x - 8, compass_y - 15),
                  (compass_x + 8, compass_y - 15)],
                 fill=(255, 255, 255, 200))
    draw.text((compass_x, compass_y - 40), "N", font=font_label,
              fill=(255, 255, 255, 200), anchor="mm")

    # Scale indicator
    draw.text((400, 650), "Northwest Coast", font=font_label,
              fill=(200, 200, 200, 255), anchor="mm")

    # Save
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    img.save(output_path, 'PNG')
    print(f"Created: {output_filename}")

def create_coordinates_overlay(coords_text, output_filename):
    """Create coordinates overlay with backdrop"""
    width, height = 800, 800
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    try:
        font_main = ImageFont.truetype("arial.ttf", 48)
        font_label = ImageFont.truetype("arial.ttf", 28)
    except:
        font_main = ImageFont.load_default()
        font_label = ImageFont.load_default()

    # Create backdrop
    backdrop_x1, backdrop_y1 = 150, 300
    backdrop_x2, backdrop_y2 = 650, 500

    draw.rectangle(
        [backdrop_x1, backdrop_y1, backdrop_x2, backdrop_y2],
        fill=(0, 0, 0, 192),
        outline=(100, 100, 100, 200),
        width=2
    )

    # Draw GPS icon
    gps_x, gps_y = 400, 350
    draw.ellipse([(gps_x - 20, gps_y - 20), (gps_x + 20, gps_y + 20)],
                 outline=(255, 100, 100, 255), width=3)
    draw.ellipse([(gps_x - 8, gps_y - 8), (gps_x + 8, gps_y + 8)],
                 fill=(255, 100, 100, 255))

    # Draw coordinates
    draw.text((400, 420), coords_text, font=font_main,
              fill=(0, 255, 0, 255), anchor="mm")

    # Draw label
    draw.text((400, 470), "GPS COORDINATES", font=font_label,
              fill=(200, 200, 200, 255), anchor="mm")

    # Save
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    img.save(output_path, 'PNG')
    print(f"Created: {output_filename}")

# Generate all puzzle overlays
print("Generating Bel Ombre puzzle overlays...")
print("-" * 50)

# NFT #5 - Cipher text
create_text_overlay("ILS VTIYL", "nft_5_layer_1.png", font_size=72)

# NFT #12 - Map fragment
create_map_overlay("nft_12_layer_2.png")

# NFT #17 - Decoding key
create_text_overlay("SHIFT BY SEVEN", "nft_17_layer_3.png", font_size=60)

# NFT #20 - Coordinates
create_coordinates_overlay("4.6167° S, 55.4167° E", "nft_20_layer_1.png")

print("-" * 50)
print("All puzzle overlays generated successfully!")
print("\nPuzzle Solution: BEL OMBRE")
print("Decode: ILS VTIYL with SHIFT BY SEVEN → BEL OMBRE")