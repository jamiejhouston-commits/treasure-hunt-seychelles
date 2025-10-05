#!/usr/bin/env python3
"""
Use the actual Mahé map from MAPS folder and add Bel Ombre treasure marker
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
MAPS_DIR = os.path.join(PROJECT_ROOT, "MAPS")
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

def process_real_map():
    """Load the real map and add treasure marker"""
    print("Processing real North Mahé map...")

    # Load the actual map
    map_path = os.path.join(MAPS_DIR, "NORTH_MAHE.jpeg")
    img = Image.open(map_path)

    # Convert to RGBA for transparency support
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # Create a transparent overlay for our markers
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Get image dimensions
    width, height = img.size
    print(f"Map size: {width}x{height}")

    # Resize to 800x800 if needed (to fit our standard size)
    if width != 800 or height != 800:
        # Calculate aspect ratio
        aspect = width / height

        if aspect > 1:  # Wider than tall
            new_width = 800
            new_height = int(800 / aspect)
        else:  # Taller than wide
            new_height = 800
            new_width = int(800 * aspect)

        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

        # Create 800x800 canvas with map centered
        final_img = Image.new('RGBA', (800, 800), (20, 40, 80, 200))  # Ocean blue background
        x_offset = (800 - new_width) // 2
        y_offset = (800 - new_height) // 2
        final_img.paste(img, (x_offset, y_offset))
        img = final_img

        # Recreate overlay for new size
        overlay = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

    # BEL OMBRE location on North Mahé
    # Based on the map, Bel Ombre is on the northwest coast
    # Looking at the map structure, we need to identify where that is
    # Since this is North Mahé, Bel Ombre should be on the left (west) side
    # Approximately 1/3 down from the top

    # Estimated position for Bel Ombre (northwest coast)
    bel_x = int(width * 0.25)  # 25% from left (west coast)
    bel_y = int(height * 0.35)  # 35% from top

    # Draw red X for treasure location
    x_size = 20
    draw.line([(bel_x-x_size, bel_y-x_size), (bel_x+x_size, bel_y+x_size)],
              fill=(255, 0, 0, 255), width=6)
    draw.line([(bel_x-x_size, bel_y+x_size), (bel_x+x_size, bel_y-x_size)],
              fill=(255, 0, 0, 255), width=6)

    # Draw circle around X
    draw.ellipse([(bel_x-30, bel_y-30), (bel_x+30, bel_y+30)],
                outline=(255, 0, 0, 255), width=4)

    # Add semi-transparent backdrop for text
    backdrop = Image.new('RGBA', (250, 80), (0, 0, 0, 180))
    overlay.paste(backdrop, (bel_x-125, bel_y-120), backdrop)

    # Add label
    font_large = get_font(24)
    font_small = get_font(16)

    draw.text((bel_x, bel_y-80), "BEL OMBRE", font=font_large,
              fill=(255, 220, 0, 255), anchor="mm",
              stroke_width=2, stroke_fill=(0, 0, 0, 255))

    draw.text((bel_x, bel_y-55), "TREASURE SITE", font=font_small,
              fill=(255, 150, 150, 255), anchor="mm")

    # Arrow pointing to X
    arrow_start = (bel_x-40, bel_y-45)
    arrow_end = (bel_x-10, bel_y-10)
    draw.line([arrow_start, arrow_end], fill=(255, 220, 0, 255), width=3)

    # Arrow head
    draw.polygon([
        arrow_end,
        (arrow_end[0]-8, arrow_end[1]-8),
        (arrow_end[0]-10, arrow_end[1]-4)
    ], fill=(255, 220, 0, 255))

    # Add GPS coordinates at bottom
    gps_backdrop = Image.new('RGBA', (300, 40), (0, 0, 0, 200))
    overlay.paste(gps_backdrop, (250, 740), gps_backdrop)

    draw.text((400, 760), "4.6097°S, 55.4263°E", font=font_large,
              fill=(100, 255, 150, 255), anchor="mm")

    # Add title at top if there's space
    title_backdrop = Image.new('RGBA', (300, 50), (0, 0, 0, 180))
    overlay.paste(title_backdrop, (250, 20), title_backdrop)

    font_title = get_font(32)
    draw.text((400, 45), "NORTH MAHÉ", font=font_title,
              fill=(255, 220, 100, 255), anchor="mm",
              stroke_width=2, stroke_fill=(0, 0, 0, 255))

    # Composite the overlay onto the map
    img = Image.alpha_composite(img, overlay)

    # Save the processed map
    output_path = os.path.join(OUTPUT_DIR, "nft_12_layer_2.png")
    img.save(output_path, 'PNG')

    # Also save to backend public
    backend_path = os.path.join(PROJECT_ROOT, "backend", "public", "images", "nft_12_layer_2.png")
    img.save(backend_path, 'PNG')

    print(f"+ Saved processed map to: {output_path}")
    print(f"+ Also saved to backend: {backend_path}")

    return output_path

# Process the map
print("\n" + "="*70)
print("USING REAL MAHÉ MAP FROM MAPS FOLDER")
print("="*70)
output = process_real_map()
print("="*70)
print("SUCCESS! Real map processed with:")
print("- Bel Ombre treasure location marked")
print("- GPS coordinates: 4.6097°S, 55.4263°E")
print("- Saved to both locations for immediate use")
print("="*70)