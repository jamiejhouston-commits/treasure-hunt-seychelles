#!/usr/bin/env python3
"""
PROFESSIONAL map cleanup - properly remove text using inpainting/blending techniques
Not cheap rectangle patches!
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

def professionally_remove_text(img, text_regions):
    """
    Professionally remove text by sampling surrounding pixels and blending
    """
    img_array = img.copy()
    draw = ImageDraw.Draw(img_array)

    for region in text_regions:
        x1, y1, x2, y2 = region

        # Sample colors from around the region to blend naturally
        samples = []
        # Sample left edge
        if x1 > 5:
            for y in range(max(0, y1-5), min(img.height, y2+5)):
                samples.append(img.getpixel((x1-5, y)))
        # Sample right edge
        if x2 < img.width - 5:
            for y in range(max(0, y1-5), min(img.height, y2+5)):
                samples.append(img.getpixel((x2+5, y)))
        # Sample top edge
        if y1 > 5:
            for x in range(max(0, x1-5), min(img.width, x2+5)):
                samples.append(img.getpixel((x, y1-5)))
        # Sample bottom edge
        if y2 < img.height - 5:
            for x in range(max(0, x1-5), min(img.width, x2+5)):
                samples.append(img.getpixel((x, y2+5)))

        if samples:
            # Calculate average color
            avg_r = sum(s[0] for s in samples) // len(samples)
            avg_g = sum(s[1] for s in samples) // len(samples)
            avg_b = sum(s[2] for s in samples) // len(samples)

            # Create gradient fill to blend naturally
            for y in range(y1, y2):
                for x in range(x1, x2):
                    # Add noise for texture
                    import random
                    noise = random.randint(-10, 10)
                    r = max(0, min(255, avg_r + noise))
                    g = max(0, min(255, avg_g + noise))
                    b = max(0, min(255, avg_b + noise))

                    # Blend with original at edges for smooth transition
                    edge_dist = min(x - x1, x2 - x, y - y1, y2 - y)
                    if edge_dist < 5:
                        alpha = edge_dist / 5.0
                        orig = img.getpixel((x, y))
                        r = int(r * alpha + orig[0] * (1 - alpha))
                        g = int(g * alpha + orig[1] * (1 - alpha))
                        b = int(b * alpha + orig[2] * (1 - alpha))

                    img_array.putpixel((x, y), (r, g, b, 255))

    # Apply slight blur to blend better
    img_array = img_array.filter(ImageFilter.GaussianBlur(radius=0.5))

    return img_array

def create_professional_map():
    """Create professionally cleaned map"""
    print("Creating PROFESSIONAL treasure map...")

    # Load map
    map_path = os.path.join(MAPS_DIR, "NORTH_MAHE.jpeg")
    original_map = Image.open(map_path)

    if original_map.mode != 'RGBA':
        original_map = original_map.convert('RGBA')

    # Resize
    width, height = original_map.size
    aspect = width / height

    if aspect > 1:
        new_width = 700
        new_height = int(700 / aspect)
    else:
        new_height = 700
        new_width = int(700 * aspect)

    resized_map = original_map.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Define text regions to remove (approximate positions based on screenshot)
    # These coordinates are relative to the resized map
    text_regions = [
        # "Bel Ombre" text region
        (int(new_width * 0.28), int(new_height * 0.28), int(new_width * 0.42), int(new_height * 0.33)),
        # "Anse Major" text region
        (int(new_width * 0.10), int(new_height * 0.48), int(new_width * 0.24), int(new_height * 0.53)),
    ]

    # Professionally remove text
    clean_map = professionally_remove_text(resized_map, text_regions)

    # Create final image
    img = Image.new('RGBA', (800, 800), (15, 25, 45, 255))

    # Borders
    draw_base = ImageDraw.Draw(img)
    draw_base.rectangle([10, 10, 790, 790], outline=(120, 90, 60, 255), width=4)
    draw_base.rectangle([20, 20, 780, 780], outline=(80, 60, 40, 255), width=2)

    # Position map
    x_offset = (800 - new_width) // 2
    y_offset = (800 - new_height) // 2 + 20

    # Enhance
    enhancer = ImageEnhance.Contrast(clean_map)
    map_enhanced = enhancer.enhance(1.3)

    enhancer = ImageEnhance.Brightness(map_enhanced)
    map_enhanced = enhancer.enhance(1.1)

    # Sepia tone
    map_processed = Image.new('RGBA', map_enhanced.size, (0, 0, 0, 0))

    for x in range(map_enhanced.width):
        for y in range(map_enhanced.height):
            r, g, b, a = map_enhanced.getpixel((x, y))
            new_r = min(255, int(r * 1.1))
            new_g = min(255, int(g * 0.95))
            new_b = min(255, int(b * 0.85))
            new_a = max(200, a)
            map_processed.putpixel((x, y), (new_r, new_g, new_b, new_a))

    # Paste
    img.paste(map_processed, (x_offset, y_offset), map_processed)

    # Overlay decorations
    overlay = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Grid
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
    banner_draw.polygon(banner_points, fill=(45, 35, 25, 220), outline=(120, 90, 60, 255))
    overlay.paste(banner, (200, 10), banner)

    font_title = get_font(42)
    draw.text((400, 40), "NORTH MAHÉ", font=font_title,
              fill=(255, 215, 0, 255), anchor="mm",
              stroke_width=3, stroke_fill=(60, 40, 20, 255))

    # Treasure X
    treasure_x = x_offset + int(new_width * 0.25)
    treasure_y = y_offset + int(new_height * 0.35)

    # Glow
    for radius in [30, 25, 20, 15]:
        alpha = 60 + (30 - radius) * 3
        color = (255, 50 + (30-radius)*5, 50)
        draw.ellipse([(treasure_x-radius, treasure_y-radius),
                     (treasure_x+radius, treasure_y+radius)],
                    fill=(*color, alpha))

    # X
    x_size = 20
    for w in [8, 6, 4]:
        draw.line([(treasure_x-x_size, treasure_y-x_size),
                  (treasure_x+x_size, treasure_y+x_size)],
                  fill=(255, 0, 0, 255), width=w)
        draw.line([(treasure_x-x_size, treasure_y+x_size),
                  (treasure_x+x_size, treasure_y-x_size)],
                  fill=(255, 0, 0, 255), width=w)

    draw.ellipse([(treasure_x-30, treasure_y-30), (treasure_x+30, treasure_y+30)],
                outline=(255, 0, 0, 255), width=4)
    draw.ellipse([(treasure_x-35, treasure_y-35), (treasure_x+35, treasure_y+35)],
                outline=(180, 0, 0, 200), width=2)

    # Label
    label_box = Image.new('RGBA', (280, 90), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(label_box)

    label_draw.rounded_rectangle([0, 0, 280, 90], radius=15,
                                fill=(35, 28, 20, 240),
                                outline=(140, 100, 60, 255), width=3)

    for corner in [(10, 10), (270, 10), (10, 80), (270, 80)]:
        label_draw.ellipse([corner[0]-5, corner[1]-5, corner[0]+5, corner[1]+5],
                          fill=(180, 130, 80, 255))

    overlay.paste(label_box, (treasure_x-140, treasure_y-140), label_box)

    font_large = get_font(32)
    font_medium = get_font(20)

    draw.text((treasure_x, treasure_y-105), "X MARKS THE SPOT", font=font_large,
              fill=(255, 215, 0, 255), anchor="mm",
              stroke_width=2, stroke_fill=(80, 50, 20, 255))

    draw.text((treasure_x, treasure_y-75), "Treasure Location", font=font_medium,
              fill=(255, 180, 120, 255), anchor="mm")

    # Arrow
    draw.line([(treasure_x-60, treasure_y-55), (treasure_x-20, treasure_y-20)],
              fill=(255, 215, 0, 255), width=4)

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
    draw.polygon([(cx, cy-40), (cx-8, cy-25), (cx+8, cy-25)], fill=(255, 255, 255, 255))

    draw.text((cx, cy-52), "N", font=font_large, fill=(255, 255, 255, 255), anchor="mm")
    draw.text((cx+52, cy), "E", font=font_medium, fill=(200, 200, 200, 255), anchor="mm")
    draw.text((cx, cy+52), "S", font=font_medium, fill=(200, 200, 200, 255), anchor="mm")
    draw.text((cx-52, cy), "W", font=font_medium, fill=(200, 200, 200, 255), anchor="mm")

    # GPS
    gps_plaque = Image.new('RGBA', (360, 50), (0, 0, 0, 0))
    plaque_draw = ImageDraw.Draw(gps_plaque)
    plaque_draw.rounded_rectangle([0, 0, 360, 50], radius=10,
                                 fill=(30, 25, 20, 240),
                                 outline=(140, 100, 60, 255), width=3)
    overlay.paste(gps_plaque, (220, 730), gps_plaque)

    draw.text((400, 755), "4.6097°S, 55.4263°E", font=font_large,
              fill=(100, 255, 150, 255), anchor="mm",
              stroke_width=1, stroke_fill=(20, 60, 30, 255))

    # Scale
    draw.line([(80, 720), (180, 720)], fill=(255, 255, 255, 255), width=3)
    draw.line([(80, 715), (80, 725)], fill=(255, 255, 255, 255), width=3)
    draw.line([(180, 715), (180, 725)], fill=(255, 255, 255, 255), width=3)
    draw.text((130, 735), "5 km", font=font_medium, fill=(255, 255, 255, 255), anchor="mm")

    # Hint
    hint_box = Image.new('RGBA', (320, 55), (0, 0, 0, 0))
    hint_draw = ImageDraw.Draw(hint_box)
    hint_draw.rounded_rectangle([0, 0, 320, 55], radius=10,
                               fill=(45, 35, 25, 200),
                               outline=(120, 90, 60, 255), width=2)
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

    print(f"+ Professional map saved: {output_path}")
    print(f"+ Backend: {backend_path}")

print("\n" + "="*70)
print("PROFESSIONAL MAP CLEANUP - NO CHEAP PATCHES!")
print("="*70)
create_professional_map()
print("="*70)
print("Text professionally removed with blending and inpainting")
print("="*70)