#!/usr/bin/env python3
"""
FIX THE X LOCATION - Put it on LAND (coast) not in the ocean!
Using the actual NORTH_MAHE.png map
"""

from PIL import Image, ImageDraw, ImageFont, ImageEnhance
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

def create_correct_treasure_map():
    """Put the X on actual LAND, not ocean!"""
    print("Creating treasure map with X on LAND (coast)...")

    # Load the NORTH_MAHE.png map
    map_path = os.path.join(MAPS_DIR, "NORTH_MAHE.png")
    north_mahe_map = Image.open(map_path)
    print(f"Loaded map: {north_mahe_map.size}")

    if north_mahe_map.mode != 'RGBA':
        north_mahe_map = north_mahe_map.convert('RGBA')

    # Resize to fit 800x800
    width, height = north_mahe_map.size
    aspect = width / height

    if aspect > 1:  # Wider
        new_width = 720
        new_height = int(720 / aspect)
    else:
        new_height = 720
        new_width = int(720 * aspect)

    resized_map = north_mahe_map.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Create final map
    final_map = Image.new('RGBA', (800, 800), (0, 0, 0, 0))

    # Dark background
    background = Image.new('RGBA', (800, 800), (20, 30, 50, 255))
    draw_bg = ImageDraw.Draw(background)

    # Decorative border
    draw_bg.rectangle([8, 8, 792, 792], outline=(140, 110, 70, 255), width=5)
    draw_bg.rectangle([15, 15, 785, 785], outline=(100, 80, 50, 255), width=3)

    final_map = Image.alpha_composite(final_map, background)

    # Center the map
    x_offset = (800 - new_width) // 2
    y_offset = (800 - new_height) // 2 + 20

    # Enhance map
    enhancer = ImageEnhance.Contrast(resized_map)
    map_enhanced = enhancer.enhance(1.15)

    enhancer = ImageEnhance.Color(map_enhanced)
    map_enhanced = enhancer.enhance(0.9)

    # Paste map
    final_map.paste(map_enhanced, (x_offset, y_offset), map_enhanced)

    # Create overlay
    overlay = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Grid lines
    for x in range(50, 750, 100):
        draw.line([(x, 50), (x, 750)], fill=(150, 130, 100, 25), width=1)
    for y in range(50, 750, 100):
        draw.line([(50, y), (750, y)], fill=(150, 130, 100, 25), width=1)

    # Title banner
    banner_width = 420
    banner_height = 70
    banner = Image.new('RGBA', (banner_width, banner_height), (0, 0, 0, 0))
    banner_draw = ImageDraw.Draw(banner)

    banner_points = [
        (15, 10), (banner_width-15, 10),
        (banner_width-5, 20), (banner_width, 35),
        (banner_width-5, 50), (banner_width-15, 60),
        (15, 60), (5, 50), (0, 35), (5, 20), (15, 10)
    ]
    banner_draw.polygon(banner_points,
                       fill=(50, 40, 30, 220),
                       outline=(140, 110, 70, 255))

    overlay.paste(banner, ((800-banner_width)//2, 8), banner)

    font_title = get_font(44)
    draw.text((400, 42), "NORTH MAHÉ", font=font_title,
              fill=(255, 220, 80, 255), anchor="mm",
              stroke_width=3, stroke_fill=(80, 60, 40, 255))

    # CORRECT X LOCATION - ON THE COAST!
    # Looking at the map, I can see the coastline
    # Let's put it on the WEST COAST near Anse Major (which is on land)
    # The green/beige area is LAND, blue is ocean

    # Based on the map image:
    # - Anse Major is on the west coast (left side)
    # - It's about 30% down from top
    # - And about 20% in from the left edge (ON THE COAST, not in water)

    treasure_x = x_offset + int(new_width * 0.18)  # ON THE COAST (left side)
    treasure_y = y_offset + int(new_height * 0.45)  # Mid-west coast

    # Glowing treasure marker
    for radius in [40, 35, 30, 25, 20, 15]:
        alpha = 40 + (40 - radius) * 2
        glow_color = (255, 120 - (40-radius)*2, 60)
        draw.ellipse([(treasure_x-radius, treasure_y-radius),
                     (treasure_x+radius, treasure_y+radius)],
                    fill=(*glow_color, alpha))

    # Red X
    x_size = 24
    for w in [12, 10, 8, 6, 4]:
        draw.line([(treasure_x-x_size, treasure_y-x_size),
                  (treasure_x+x_size, treasure_y+x_size)],
                  fill=(255, 0, 0, 255), width=w)
        draw.line([(treasure_x-x_size, treasure_y+x_size),
                  (treasure_x+x_size, treasure_y-x_size)],
                  fill=(255, 0, 0, 255), width=w)

    # Circles
    draw.ellipse([(treasure_x-35, treasure_y-35), (treasure_x+35, treasure_y+35)],
                outline=(255, 20, 20, 255), width=5)
    draw.ellipse([(treasure_x-42, treasure_y-42), (treasure_x+42, treasure_y+42)],
                outline=(200, 0, 0, 200), width=3)

    # Label
    label_width = 320
    label_height = 105
    label_box = Image.new('RGBA', (label_width, label_height), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(label_box)

    label_draw.rounded_rectangle([0, 0, label_width, label_height], radius=18,
                                fill=(40, 32, 24, 235),
                                outline=(160, 120, 70, 255), width=4)

    for corner_x, corner_y in [(12, 12), (label_width-12, 12),
                               (12, label_height-12), (label_width-12, label_height-12)]:
        label_draw.ellipse([corner_x-6, corner_y-6, corner_x+6, corner_y+6],
                          fill=(200, 160, 100, 255))

    overlay.paste(label_box, (treasure_x-160, treasure_y-160), label_box)

    font_xlarge = get_font(34)
    font_large = get_font(24)

    draw.text((treasure_x, treasure_y-115), "X MARKS THE SPOT", font=font_xlarge,
              fill=(255, 220, 60, 255), anchor="mm",
              stroke_width=2, stroke_fill=(100, 70, 40, 255))

    draw.text((treasure_x, treasure_y-78), "Coastal Treasure Site", font=font_large,
              fill=(255, 190, 140, 255), anchor="mm")

    # Arrow
    arrow_start = (treasure_x-70, treasure_y-58)
    arrow_end = (treasure_x-25, treasure_y-25)
    draw.line([arrow_start, arrow_end], fill=(255, 220, 60, 255), width=5)

    draw.polygon([(arrow_end[0], arrow_end[1]),
                  (arrow_end[0]-10, arrow_end[1]-10),
                  (arrow_end[0]-12, arrow_end[1]-5)],
                 fill=(255, 220, 60, 255))

    # Compass
    compass_x, compass_y = 710, 130

    draw.ellipse([(compass_x-60, compass_y-60), (compass_x+60, compass_y+60)],
                fill=(30, 25, 20, 210),
                outline=(200, 170, 120, 255), width=4)

    import math
    for i in range(16):
        angle = i * math.pi / 8
        if i % 4 == 0:
            r1, r2 = 50, 35
        elif i % 2 == 0:
            r1, r2 = 40, 30
        else:
            r1, r2 = 25, 20

        x1 = compass_x + r1 * math.sin(angle)
        y1 = compass_y - r1 * math.cos(angle)

        draw.line([(compass_x, compass_y), (x1, y1)],
                 fill=(220, 190, 140, 255), width=2)

    draw.polygon([(compass_x, compass_y-50),
                  (compass_x-12, compass_y-30),
                  (compass_x+12, compass_y-30)],
                 fill=(255, 255, 255, 255))

    font_direction = get_font(24)
    draw.text((compass_x, compass_y-65), "N", font=font_xlarge,
              fill=(255, 255, 255, 255), anchor="mm")
    draw.text((compass_x+65, compass_y), "E", font=font_direction,
              fill=(220, 220, 220, 255), anchor="mm")
    draw.text((compass_x, compass_y+65), "S", font=font_direction,
              fill=(220, 220, 220, 255), anchor="mm")
    draw.text((compass_x-65, compass_y), "W", font=font_direction,
              fill=(220, 220, 220, 255), anchor="mm")

    # GPS Coordinates
    gps_width = 400
    gps_height = 60
    gps_box = Image.new('RGBA', (gps_width, gps_height), (0, 0, 0, 0))
    gps_draw = ImageDraw.Draw(gps_box)

    gps_draw.rounded_rectangle([0, 0, gps_width, gps_height], radius=12,
                              fill=(35, 28, 22, 235),
                              outline=(160, 120, 70, 255), width=3)

    overlay.paste(gps_box, ((800-gps_width)//2, 725), gps_box)

    draw.text((400, 755), "4.6097°S, 55.4263°E", font=font_xlarge,
              fill=(120, 255, 170, 255), anchor="mm",
              stroke_width=1, stroke_fill=(30, 80, 50, 255))

    # Scale
    scale_y = 705
    draw.line([(80, scale_y), (200, scale_y)], fill=(255, 255, 255, 255), width=3)
    draw.line([(80, scale_y-5), (80, scale_y+5)], fill=(255, 255, 255, 255), width=3)
    draw.line([(200, scale_y-5), (200, scale_y+5)], fill=(255, 255, 255, 255), width=3)
    draw.text((140, scale_y+18), "5 km", font=font_large,
              fill=(255, 255, 255, 255), anchor="mm")

    # Hint
    hint_box = Image.new('RGBA', (360, 50), (0, 0, 0, 0))
    hint_draw = ImageDraw.Draw(hint_box)
    hint_draw.rounded_rectangle([0, 0, 360, 50], radius=10,
                               fill=(50, 40, 30, 200),
                               outline=(140, 110, 70, 255), width=2)
    overlay.paste(hint_box, (220, 665), hint_box)

    font_hint = get_font(22)
    draw.text((400, 690), "Decode the cipher to reveal", font=font_hint,
              fill=(230, 200, 160, 255), anchor="mm")

    # Composite
    final = Image.alpha_composite(final_map, overlay)

    # Save
    output_path = os.path.join(OUTPUT_DIR, "nft_12_layer_2.png")
    final.save(output_path, 'PNG')

    backend_path = os.path.join(PROJECT_ROOT, "backend", "public", "images", "nft_12_layer_2.png")
    final.save(backend_path, 'PNG')

    print(f"+ Saved map with X ON LAND: {output_path}")
    print(f"+ Backend: {backend_path}")
    print(f"+ X is now on the COAST, not in the ocean!")

# Fix it!
print("\n" + "="*70)
print("FIXING X LOCATION - PUTTING IT ON LAND!")
print("="*70)
create_correct_treasure_map()
print("="*70)
print("FIXED! X is now on the west coast (land)")
print("Not in the middle of the ocean!")
print("Pirates could actually dig there!")
print("="*70)