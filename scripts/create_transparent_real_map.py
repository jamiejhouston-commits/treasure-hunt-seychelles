#!/usr/bin/env python3
"""
Create a transparent overlay version of the real Mahé map with treasure marker
Makes it look like an old treasure map overlay with transparency
"""

from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
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

def create_transparent_map_overlay():
    """Create a cool transparent overlay version of the real map"""
    print("Creating transparent overlay map...")

    # Load the actual map
    map_path = os.path.join(MAPS_DIR, "NORTH_MAHE.jpeg")
    original_map = Image.open(map_path)

    # Convert to RGBA
    if original_map.mode != 'RGBA':
        original_map = original_map.convert('RGBA')

    # Resize to 800x800 maintaining aspect ratio
    width, height = original_map.size
    aspect = width / height

    if aspect > 1:  # Wider than tall
        new_width = 800
        new_height = int(800 / aspect)
    else:  # Taller than wide
        new_height = 800
        new_width = int(800 * aspect)

    resized_map = original_map.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Create transparent base image (like the cool overlay style)
    img = Image.new('RGBA', (800, 800), (0, 0, 0, 0))

    # Calculate position to center the map
    x_offset = (800 - new_width) // 2
    y_offset = (800 - new_height) // 2

    # Process the map to make it look like an old treasure map overlay
    # 1. Apply sepia/vintage effect
    map_processed = resized_map.copy()

    # Convert to grayscale first
    map_gray = map_processed.convert('L')

    # Apply sepia tone
    map_sepia = Image.new('RGBA', map_gray.size)
    for x in range(map_gray.width):
        for y in range(map_gray.height):
            gray_val = map_gray.getpixel((x, y))
            # Sepia formula with transparency
            r = min(255, gray_val + 40)
            g = min(255, gray_val + 20)
            b = max(0, gray_val - 20)
            # Make it semi-transparent
            a = int(gray_val * 0.6)  # 60% opacity based on darkness
            map_sepia.putpixel((x, y), (r, g, b, a))

    # Apply slight blur for aged effect
    map_sepia = map_sepia.filter(ImageFilter.GaussianBlur(radius=0.5))

    # Enhance contrast
    enhancer = ImageEnhance.Contrast(map_sepia)
    map_sepia = enhancer.enhance(1.2)

    # Paste the processed map
    img.paste(map_sepia, (x_offset, y_offset), map_sepia)

    # Create overlay for treasure markers
    overlay = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Add dark blue semi-transparent ocean backdrop
    draw.rectangle([0, 0, 800, 800],
                  fill=(20, 35, 65, 100))  # Very transparent dark blue

    # Add grid lines like old nautical charts
    for x in range(0, 800, 50):
        draw.line([(x, 0), (x, 800)], fill=(100, 100, 80, 30), width=1)
    for y in range(0, 800, 50):
        draw.line([(0, y), (800, y)], fill=(100, 100, 80, 30), width=1)

    # BEL OMBRE location (adjusted for centered map)
    # Northwest coast position
    bel_x = x_offset + int(new_width * 0.25)
    bel_y = y_offset + int(new_height * 0.35)

    # Draw glowing red X for treasure
    # Outer glow
    for radius in [25, 20, 15]:
        alpha = 50 + (25 - radius) * 4
        draw.ellipse([(bel_x-radius, bel_y-radius), (bel_x+radius, bel_y+radius)],
                    fill=(255, 100, 100, alpha))

    # Main X mark
    x_size = 18
    draw.line([(bel_x-x_size, bel_y-x_size), (bel_x+x_size, bel_y+x_size)],
              fill=(255, 0, 0, 255), width=5)
    draw.line([(bel_x-x_size, bel_y+x_size), (bel_x+x_size, bel_y-x_size)],
              fill=(255, 0, 0, 255), width=5)

    # Circle around X
    draw.ellipse([(bel_x-25, bel_y-25), (bel_x+25, bel_y+25)],
                outline=(255, 0, 0, 255), width=3)

    # Add parchment-style backdrop for text
    parchment = Image.new('RGBA', (280, 100), (0, 0, 0, 0))
    parchment_draw = ImageDraw.Draw(parchment)

    # Draw aged parchment background
    parchment_draw.rounded_rectangle([0, 0, 280, 100], radius=10,
                                    fill=(45, 35, 25, 200),  # Dark brown, semi-transparent
                                    outline=(120, 90, 60, 255),
                                    width=2)

    # Add torn edges effect
    for i in range(0, 280, 15):
        parchment_draw.polygon([(i, 0), (i+7, 5), (i+15, 0)],
                              fill=(45, 35, 25, 200))
        parchment_draw.polygon([(i, 100), (i+7, 95), (i+15, 100)],
                              fill=(45, 35, 25, 200))

    overlay.paste(parchment, (bel_x-140, bel_y-140), parchment)

    # Labels with treasure map style
    font_large = get_font(26)
    font_small = get_font(18)

    # BEL OMBRE text
    draw.text((bel_x, bel_y-95), "BEL OMBRE", font=font_large,
              fill=(255, 215, 0, 255), anchor="mm",
              stroke_width=2, stroke_fill=(60, 40, 20, 255))

    draw.text((bel_x, bel_y-65), "La Buse Treasure", font=font_small,
              fill=(255, 180, 120, 255), anchor="mm")

    # Arrow pointing to X
    arrow_start = (bel_x-50, bel_y-50)
    arrow_end = (bel_x-15, bel_y-15)
    draw.line([arrow_start, arrow_end], fill=(255, 215, 0, 255), width=3)

    # Title with old map style
    title_backdrop = Image.new('RGBA', (400, 60), (0, 0, 0, 0))
    title_draw = ImageDraw.Draw(title_backdrop)
    title_draw.rounded_rectangle([0, 0, 400, 60], radius=10,
                                fill=(30, 25, 20, 180),
                                outline=(100, 80, 60, 255),
                                width=2)
    overlay.paste(title_backdrop, (200, 15), title_backdrop)

    font_title = get_font(36)
    draw.text((400, 45), "NORTH MAHÉ", font=font_title,
              fill=(255, 215, 0, 255), anchor="mm",
              stroke_width=2, stroke_fill=(40, 30, 20, 255))

    # Compass rose (nautical style)
    cx, cy = 720, 100
    # Outer ring
    draw.ellipse([(cx-45, cy-45), (cx+45, cy+45)],
                outline=(180, 150, 100, 255), width=2)
    # N arrow
    draw.line([(cx, cy+35), (cx, cy-35)], fill=(255, 255, 255, 255), width=3)
    draw.polygon([(cx, cy-35), (cx-10, cy-20), (cx+10, cy-20)],
                fill=(255, 255, 255, 255))
    # Other directions
    draw.line([(cx-30, cy), (cx+30, cy)], fill=(200, 200, 200, 200), width=2)

    draw.text((cx, cy-48), "N", font=font_large,
              fill=(255, 255, 255, 255), anchor="mm")
    draw.text((cx+48, cy), "E", font=font_small,
              fill=(200, 200, 200, 200), anchor="mm")
    draw.text((cx, cy+48), "S", font=font_small,
              fill=(200, 200, 200, 200), anchor="mm")
    draw.text((cx-48, cy), "W", font=font_small,
              fill=(200, 200, 200, 200), anchor="mm")

    # GPS coordinates on aged parchment
    gps_parchment = Image.new('RGBA', (320, 45), (0, 0, 0, 0))
    gps_draw = ImageDraw.Draw(gps_parchment)
    gps_draw.rounded_rectangle([0, 0, 320, 45], radius=8,
                              fill=(35, 30, 25, 200),
                              outline=(100, 80, 60, 255),
                              width=2)
    overlay.paste(gps_parchment, (240, 740), gps_parchment)

    draw.text((400, 762), "4.6097°S, 55.4263°E", font=font_large,
              fill=(100, 255, 150, 255), anchor="mm",
              stroke_width=1, stroke_fill=(20, 40, 20, 255))

    # Composite everything together
    final = Image.alpha_composite(img, overlay)

    # Save the transparent overlay map
    output_path = os.path.join(OUTPUT_DIR, "nft_12_layer_2.png")
    final.save(output_path, 'PNG')

    # Also save to backend public
    backend_path = os.path.join(PROJECT_ROOT, "backend", "public", "images", "nft_12_layer_2.png")
    final.save(backend_path, 'PNG')

    print(f"+ Saved transparent overlay map to: {output_path}")
    print(f"+ Also saved to backend: {backend_path}")

    return output_path

# Create the cool transparent map
print("\n" + "="*70)
print("CREATING COOL TRANSPARENT OVERLAY MAP")
print("="*70)
output = create_transparent_map_overlay()
print("="*70)
print("SUCCESS! Created transparent treasure map overlay with:")
print("- Real North Mahé map with sepia/vintage effect")
print("- Semi-transparent overlay style")
print("- Glowing treasure marker at Bel Ombre")
print("- Aged parchment text backdrops")
print("- Nautical chart grid lines")
print("="*70)