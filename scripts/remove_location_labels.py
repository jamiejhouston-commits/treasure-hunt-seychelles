#!/usr/bin/env python3
"""
Remove 'Bel Ombre' and other location labels from the base map
So the map doesn't give away the puzzle answer!
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

def create_clean_mystery_map():
    """Create map with location labels covered/removed"""
    print("Creating mystery map with location labels covered...")

    # Load the actual map
    map_path = os.path.join(MAPS_DIR, "NORTH_MAHE.jpeg")
    original_map = Image.open(map_path)

    # Convert to RGBA
    if original_map.mode != 'RGBA':
        original_map = original_map.convert('RGBA')

    # Resize to fit 800x800
    width, height = original_map.size
    aspect = width / height

    if aspect > 1:
        new_width = 700
        new_height = int(700 / aspect)
    else:
        new_height = 700
        new_width = int(700 * aspect)

    resized_map = original_map.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Create base with dark ocean background
    img = Image.new('RGBA', (800, 800), (15, 25, 45, 255))

    # Draw decorative border
    draw_base = ImageDraw.Draw(img)
    draw_base.rectangle([10, 10, 790, 790], outline=(120, 90, 60, 255), width=4)
    draw_base.rectangle([20, 20, 780, 780], outline=(80, 60, 40, 255), width=2)

    # Position map
    x_offset = (800 - new_width) // 2
    y_offset = (800 - new_height) // 2 + 20

    # Enhance the map
    enhancer = ImageEnhance.Contrast(resized_map)
    map_enhanced = enhancer.enhance(1.3)

    enhancer = ImageEnhance.Brightness(map_enhanced)
    map_enhanced = enhancer.enhance(1.1)

    # Apply subtle sepia
    map_processed = Image.new('RGBA', map_enhanced.size, (0, 0, 0, 0))

    for x in range(map_enhanced.width):
        for y in range(map_enhanced.height):
            r, g, b, a = map_enhanced.getpixel((x, y))
            new_r = min(255, int(r * 1.1))
            new_g = min(255, int(g * 0.95))
            new_b = min(255, int(b * 0.85))
            new_a = max(200, a)
            map_processed.putpixel((x, y), (new_r, new_g, new_b, new_a))

    # Add vignette
    vignette = Image.new('RGBA', map_processed.size, (0, 0, 0, 0))
    vignette_draw = ImageDraw.Draw(vignette)

    for i in range(30):
        alpha = 80 - i * 2
        if alpha > 0:
            vignette_draw.rectangle([i, i, map_processed.width-i, map_processed.height-i],
                                   outline=(60, 45, 30, alpha), width=2)

    map_processed = Image.alpha_composite(map_processed, vignette)

    # Paste map
    img.paste(map_processed, (x_offset, y_offset), map_processed)

    # Create overlay for covering labels and adding decorations
    overlay = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # COVER UP the "Bel Ombre" text on the original map
    # Based on your screenshot, "Bel Ombre" appears around coordinates (150, 170)
    # We'll cover it with a semi-transparent aged paper patch

    # Calculate where Bel Ombre label is on the resized/positioned map
    bel_ombre_text_x = x_offset + int(new_width * 0.25)  # Roughly where it appears
    bel_ombre_text_y = y_offset + int(new_height * 0.35)

    # Draw aged paper patch over the text area
    cover_patch = Image.new('RGBA', (140, 50), (0, 0, 0, 0))
    patch_draw = ImageDraw.Draw(cover_patch)

    # Match the sepia tone of the map
    patch_draw.rounded_rectangle([0, 0, 140, 50], radius=8,
                                fill=(210, 195, 170, 255),  # Opaque sepia color matching map
                                outline=(190, 175, 150, 200), width=1)

    # Add subtle texture/aging
    import random
    random.seed(42)
    for _ in range(100):
        px = random.randint(0, 139)
        py = random.randint(0, 49)
        noise_color = random.randint(-15, 15)
        current = cover_patch.getpixel((px, py))
        new_color = tuple(max(0, min(255, c + noise_color)) for c in current[:3]) + (current[3],)
        cover_patch.putpixel((px, py), new_color)

    # Place the patch over "Bel Ombre" text
    overlay.paste(cover_patch, (bel_ombre_text_x - 70, bel_ombre_text_y + 10), cover_patch)

    # Also cover "Anse Major" if visible (left side)
    anse_major_x = x_offset + int(new_width * 0.15)
    anse_major_y = y_offset + int(new_height * 0.45)

    cover_patch2 = Image.new('RGBA', (130, 40), (0, 0, 0, 0))
    patch_draw2 = ImageDraw.Draw(cover_patch2)
    patch_draw2.rounded_rectangle([0, 0, 130, 40], radius=6,
                                 fill=(210, 195, 170, 255),
                                 outline=(190, 175, 150, 200), width=1)

    # Add texture
    for _ in range(80):
        px = random.randint(0, 129)
        py = random.randint(0, 39)
        noise_color = random.randint(-15, 15)
        current = cover_patch2.getpixel((px, py))
        new_color = tuple(max(0, min(255, c + noise_color)) for c in current[:3]) + (current[3],)
        cover_patch2.putpixel((px, py), new_color)

    overlay.paste(cover_patch2, (anse_major_x - 65, anse_major_y), cover_patch2)

    # Subtle grid
    for x in range(50, 750, 100):
        draw.line([(x, 50), (x, 750)], fill=(180, 150, 100, 40), width=1)
    for y in range(50, 750, 100):
        draw.line([(50, y), (750, y)], fill=(180, 150, 100, 40), width=1)

    # Title banner
    banner = Image.new('RGBA', (400, 70), (0, 0, 0, 0))
    banner_draw = ImageDraw.Draw(banner)

    banner_points = [
        (20, 10), (380, 10), (390, 20), (395, 35),
        (390, 50), (380, 60), (20, 60), (10, 50),
        (5, 35), (10, 20), (20, 10)
    ]
    banner_draw.polygon(banner_points,
                       fill=(45, 35, 25, 220),
                       outline=(120, 90, 60, 255))

    overlay.paste(banner, (200, 10), banner)

    font_title = get_font(42)
    draw.text((400, 40), "NORTH MAHÉ", font=font_title,
              fill=(255, 215, 0, 255), anchor="mm",
              stroke_width=3, stroke_fill=(60, 40, 20, 255))

    # TREASURE LOCATION - X marks the spot
    treasure_x = x_offset + int(new_width * 0.25)
    treasure_y = y_offset + int(new_height * 0.35)

    # Glowing effect
    for radius in [30, 25, 20, 15]:
        alpha = 60 + (30 - radius) * 3
        color = (255, 50 + (30-radius)*5, 50)
        draw.ellipse([(treasure_x-radius, treasure_y-radius),
                     (treasure_x+radius, treasure_y+radius)],
                    fill=(*color, alpha))

    # Bold red X
    x_size = 20
    for width in [8, 6, 4]:
        draw.line([(treasure_x-x_size, treasure_y-x_size),
                  (treasure_x+x_size, treasure_y+x_size)],
                  fill=(255, 0, 0, 255), width=width)
        draw.line([(treasure_x-x_size, treasure_y+x_size),
                  (treasure_x+x_size, treasure_y-x_size)],
                  fill=(255, 0, 0, 255), width=width)

    # Double circle
    draw.ellipse([(treasure_x-30, treasure_y-30), (treasure_x+30, treasure_y+30)],
                outline=(255, 0, 0, 255), width=4)
    draw.ellipse([(treasure_x-35, treasure_y-35), (treasure_x+35, treasure_y+35)],
                outline=(180, 0, 0, 200), width=2)

    # Mystery label
    label_box = Image.new('RGBA', (280, 90), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(label_box)

    label_draw.rounded_rectangle([0, 0, 280, 90], radius=15,
                                fill=(35, 28, 20, 240),
                                outline=(140, 100, 60, 255),
                                width=3)

    for corner in [(10, 10), (270, 10), (10, 80), (270, 80)]:
        label_draw.ellipse([corner[0]-5, corner[1]-5, corner[0]+5, corner[1]+5],
                          fill=(180, 130, 80, 255))

    overlay.paste(label_box, (treasure_x-140, treasure_y-140), label_box)

    font_large = get_font(32)
    font_medium = get_font(20)

    # NO LOCATION NAME!
    draw.text((treasure_x, treasure_y-105), "X MARKS THE SPOT", font=font_large,
              fill=(255, 215, 0, 255), anchor="mm",
              stroke_width=2, stroke_fill=(80, 50, 20, 255))

    draw.text((treasure_x, treasure_y-75), "Treasure Location", font=font_medium,
              fill=(255, 180, 120, 255), anchor="mm")

    # Arrow
    arrow_points = [
        (treasure_x-60, treasure_y-55),
        (treasure_x-20, treasure_y-20),
        (treasure_x-25, treasure_y-25),
        (treasure_x-20, treasure_y-20),
        (treasure_x-28, treasure_y-18)
    ]
    draw.line(arrow_points[:2], fill=(255, 215, 0, 255), width=4)
    draw.polygon(arrow_points[2:], fill=(255, 215, 0, 255))

    # Compass
    cx, cy = 700, 120
    draw.ellipse([(cx-50, cy-50), (cx+50, cy+50)],
                fill=(25, 20, 15, 200),
                outline=(180, 150, 100, 255), width=3)

    import math
    star_points = []
    for i in range(8):
        angle = i * math.pi / 4
        r = 40 if i % 2 == 0 else 25
        x = cx + r * math.sin(angle)
        y = cy - r * math.cos(angle)
        star_points.append((x, y))

    draw.polygon(star_points, outline=(200, 170, 120, 255), width=2)
    draw.polygon([(cx, cy-40), (cx-8, cy-25), (cx+8, cy-25)],
                fill=(255, 255, 255, 255))

    draw.text((cx, cy-52), "N", font=font_large,
              fill=(255, 255, 255, 255), anchor="mm")
    draw.text((cx+52, cy), "E", font=font_medium,
              fill=(200, 200, 200, 255), anchor="mm")
    draw.text((cx, cy+52), "S", font=font_medium,
              fill=(200, 200, 200, 255), anchor="mm")
    draw.text((cx-52, cy), "W", font=font_medium,
              fill=(200, 200, 200, 255), anchor="mm")

    # GPS coordinates
    gps_plaque = Image.new('RGBA', (360, 50), (0, 0, 0, 0))
    plaque_draw = ImageDraw.Draw(gps_plaque)

    plaque_draw.rounded_rectangle([0, 0, 360, 50], radius=10,
                                 fill=(30, 25, 20, 240),
                                 outline=(140, 100, 60, 255),
                                 width=3)

    overlay.paste(gps_plaque, (220, 730), gps_plaque)

    draw.text((400, 755), "4.6097°S, 55.4263°E", font=font_large,
              fill=(100, 255, 150, 255), anchor="mm",
              stroke_width=1, stroke_fill=(20, 60, 30, 255))

    # Scale bar
    draw.line([(80, 720), (180, 720)], fill=(255, 255, 255, 255), width=3)
    draw.line([(80, 715), (80, 725)], fill=(255, 255, 255, 255), width=3)
    draw.line([(180, 715), (180, 725)], fill=(255, 255, 255, 255), width=3)
    draw.text((130, 735), "5 km", font=font_medium,
              fill=(255, 255, 255, 255), anchor="mm")

    # Cryptic hint
    hint_box = Image.new('RGBA', (320, 55), (0, 0, 0, 0))
    hint_draw = ImageDraw.Draw(hint_box)
    hint_draw.rounded_rectangle([0, 0, 320, 55], radius=10,
                               fill=(45, 35, 25, 200),
                               outline=(120, 90, 60, 255),
                               width=2)
    overlay.paste(hint_box, (240, 670), hint_box)

    font_hint = get_font(18)
    draw.text((400, 697), "Decode the cipher to find me", font=font_hint,
              fill=(220, 180, 140, 255), anchor="mm",
              stroke_width=1, stroke_fill=(40, 30, 20, 255))

    # Composite
    final = Image.alpha_composite(img, overlay)

    # Save
    output_path = os.path.join(OUTPUT_DIR, "nft_12_layer_2.png")
    final.save(output_path, 'PNG')

    backend_path = os.path.join(PROJECT_ROOT, "backend", "public", "images", "nft_12_layer_2.png")
    final.save(backend_path, 'PNG')

    print(f"+ Saved clean mystery map to: {output_path}")
    print(f"+ Also saved to backend: {backend_path}")

# Create the map
print("\n" + "="*70)
print("CREATING MYSTERY MAP WITH LOCATION LABELS COVERED")
print("="*70)
create_clean_mystery_map()
print("="*70)
print("SUCCESS! Map now has:")
print("- 'Bel Ombre' label COVERED with aged paper patch")
print("- 'Anse Major' label COVERED")
print("- Only shows X and mystery labels")
print("- NO SPOILERS - players must decode cipher!")
print("="*70)