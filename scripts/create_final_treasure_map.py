#!/usr/bin/env python3
"""
Create the FINAL treasure map using the CLEAN map without text labels
Professional quality overlay with treasure markers
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

def create_final_professional_map():
    """Create the final treasure map with clean base"""
    print("Creating FINAL professional treasure map with clean base...")

    # Load the CLEAN map (without text labels)
    map_path = os.path.join(MAPS_DIR, "NORTH_MAHE.jpeg")
    clean_map = Image.open(map_path)
    print(f"Loaded clean map: {clean_map.size}")

    if clean_map.mode != 'RGBA':
        clean_map = clean_map.convert('RGBA')

    # Resize to fit our standard size
    width, height = clean_map.size
    aspect = width / height

    if aspect > 1:
        new_width = 700
        new_height = int(700 / aspect)
    else:
        new_height = 700
        new_width = int(700 * aspect)

    resized_map = clean_map.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Create base canvas with ocean background
    img = Image.new('RGBA', (800, 800), (15, 25, 45, 255))

    # Draw decorative borders
    draw_base = ImageDraw.Draw(img)
    draw_base.rectangle([10, 10, 790, 790], outline=(120, 90, 60, 255), width=4)
    draw_base.rectangle([20, 20, 780, 780], outline=(80, 60, 40, 255), width=2)

    # Position the clean map
    x_offset = (800 - new_width) // 2
    y_offset = (800 - new_height) // 2 + 20

    # Enhance the map for treasure map aesthetic
    enhancer = ImageEnhance.Contrast(resized_map)
    map_enhanced = enhancer.enhance(1.2)

    enhancer = ImageEnhance.Brightness(map_enhanced)
    map_enhanced = enhancer.enhance(1.05)

    # Apply subtle sepia tone for aged look
    map_processed = Image.new('RGBA', map_enhanced.size, (0, 0, 0, 0))

    for x in range(map_enhanced.width):
        for y in range(map_enhanced.height):
            r, g, b, a = map_enhanced.getpixel((x, y))
            # Subtle sepia
            new_r = min(255, int(r * 1.05))
            new_g = min(255, int(g * 0.98))
            new_b = min(255, int(b * 0.90))
            new_a = max(200, a)
            map_processed.putpixel((x, y), (new_r, new_g, new_b, new_a))

    # Add vignette for aged effect
    vignette = Image.new('RGBA', map_processed.size, (0, 0, 0, 0))
    vignette_draw = ImageDraw.Draw(vignette)

    for i in range(20):
        alpha = 60 - i * 3
        if alpha > 0:
            vignette_draw.rectangle([i, i, map_processed.width-i, map_processed.height-i],
                                   outline=(50, 40, 30, alpha), width=2)

    map_processed = Image.alpha_composite(map_processed, vignette)

    # Paste the processed map
    img.paste(map_processed, (x_offset, y_offset), map_processed)

    # Create overlay for treasure elements
    overlay = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Add subtle nautical grid
    for x in range(50, 750, 100):
        draw.line([(x, 50), (x, 750)], fill=(180, 150, 100, 30), width=1)
    for y in range(50, 750, 100):
        draw.line([(50, y), (750, y)], fill=(180, 150, 100, 30), width=1)

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

    # TREASURE LOCATION - DAN ZIL position
    # X marks the spot on northwest coast
    treasure_x = x_offset + int(new_width * 0.25)
    treasure_y = y_offset + int(new_height * 0.35)

    # Glowing treasure effect
    for radius in [35, 30, 25, 20, 15]:
        alpha = 50 + (35 - radius) * 2
        glow_color = (255, 100 - (35-radius)*2, 50)
        draw.ellipse([(treasure_x-radius, treasure_y-radius),
                     (treasure_x+radius, treasure_y+radius)],
                    fill=(*glow_color, alpha))

    # Bold red X
    x_size = 22
    for width in [10, 8, 6, 4]:
        draw.line([(treasure_x-x_size, treasure_y-x_size),
                  (treasure_x+x_size, treasure_y+x_size)],
                  fill=(255, 0, 0, 255), width=width)
        draw.line([(treasure_x-x_size, treasure_y+x_size),
                  (treasure_x+x_size, treasure_y-x_size)],
                  fill=(255, 0, 0, 255), width=width)

    # Double circle around X
    draw.ellipse([(treasure_x-32, treasure_y-32), (treasure_x+32, treasure_y+32)],
                outline=(255, 0, 0, 255), width=5)
    draw.ellipse([(treasure_x-38, treasure_y-38), (treasure_x+38, treasure_y+38)],
                outline=(180, 0, 0, 200), width=3)

    # Mystery label box
    label_box = Image.new('RGBA', (300, 100), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(label_box)

    label_draw.rounded_rectangle([0, 0, 300, 100], radius=15,
                                fill=(35, 28, 20, 230),
                                outline=(140, 100, 60, 255), width=3)

    # Decorative corners
    for corner in [(10, 10), (290, 10), (10, 90), (290, 90)]:
        label_draw.ellipse([corner[0]-5, corner[1]-5, corner[0]+5, corner[1]+5],
                          fill=(180, 130, 80, 255))

    overlay.paste(label_box, (treasure_x-150, treasure_y-150), label_box)

    font_large = get_font(32)
    font_medium = get_font(22)

    # Mystery text - NO LOCATION NAME
    draw.text((treasure_x, treasure_y-110), "X MARKS THE SPOT", font=font_large,
              fill=(255, 215, 0, 255), anchor="mm",
              stroke_width=2, stroke_fill=(80, 50, 20, 255))

    draw.text((treasure_x, treasure_y-75), "Mystery Location", font=font_medium,
              fill=(255, 180, 120, 255), anchor="mm")

    # Arrow pointing to X
    arrow_start = (treasure_x-65, treasure_y-55)
    arrow_end = (treasure_x-22, treasure_y-22)
    draw.line([arrow_start, arrow_end], fill=(255, 215, 0, 255), width=4)
    # Arrow head
    draw.polygon([(arrow_end[0], arrow_end[1]),
                  (arrow_end[0]-8, arrow_end[1]-8),
                  (arrow_end[0]-10, arrow_end[1]-4)],
                 fill=(255, 215, 0, 255))

    # Ornate compass rose
    cx, cy = 700, 120

    # Compass background
    draw.ellipse([(cx-55, cy-55), (cx+55, cy+55)],
                fill=(25, 20, 15, 200),
                outline=(180, 150, 100, 255), width=3)

    # Star pattern for compass
    import math
    star_points = []
    for i in range(16):
        angle = i * math.pi / 8
        if i % 2 == 0:
            r = 45 if i % 4 == 0 else 35
        else:
            r = 20
        x = cx + r * math.sin(angle)
        y = cy - r * math.cos(angle)
        star_points.append((x, y))

    draw.polygon(star_points, outline=(200, 170, 120, 255), width=2)

    # N arrow
    draw.polygon([(cx, cy-45), (cx-10, cy-28), (cx+10, cy-28)],
                fill=(255, 255, 255, 255))

    # Direction labels
    draw.text((cx, cy-58), "N", font=font_large,
              fill=(255, 255, 255, 255), anchor="mm")
    draw.text((cx+58, cy), "E", font=font_medium,
              fill=(200, 200, 200, 255), anchor="mm")
    draw.text((cx, cy+58), "S", font=font_medium,
              fill=(200, 200, 200, 255), anchor="mm")
    draw.text((cx-58, cy), "W", font=font_medium,
              fill=(200, 200, 200, 255), anchor="mm")

    # GPS coordinates plaque
    gps_plaque = Image.new('RGBA', (380, 55), (0, 0, 0, 0))
    plaque_draw = ImageDraw.Draw(gps_plaque)

    plaque_draw.rounded_rectangle([0, 0, 380, 55], radius=10,
                                 fill=(30, 25, 20, 230),
                                 outline=(140, 100, 60, 255), width=3)

    overlay.paste(gps_plaque, (210, 728), gps_plaque)

    draw.text((400, 755), "4.6097°S, 55.4263°E", font=font_large,
              fill=(100, 255, 150, 255), anchor="mm",
              stroke_width=1, stroke_fill=(20, 60, 30, 255))

    # Scale bar
    draw.line([(80, 720), (180, 720)], fill=(255, 255, 255, 255), width=3)
    draw.line([(80, 715), (80, 725)], fill=(255, 255, 255, 255), width=3)
    draw.line([(180, 715), (180, 725)], fill=(255, 255, 255, 255), width=3)
    draw.text((130, 735), "5 km", font=font_medium,
              fill=(255, 255, 255, 255), anchor="mm")

    # Mystery hint
    hint_box = Image.new('RGBA', (340, 55), (0, 0, 0, 0))
    hint_draw = ImageDraw.Draw(hint_box)
    hint_draw.rounded_rectangle([0, 0, 340, 55], radius=10,
                               fill=(45, 35, 25, 200),
                               outline=(120, 90, 60, 255), width=2)
    overlay.paste(hint_box, (230, 668), hint_box)

    font_hint = get_font(20)
    draw.text((400, 695), "Decode the cipher to reveal", font=font_hint,
              fill=(220, 180, 140, 255), anchor="mm",
              stroke_width=1, stroke_fill=(40, 30, 20, 255))

    # Composite everything
    final = Image.alpha_composite(img, overlay)

    # Save the final map
    output_path = os.path.join(OUTPUT_DIR, "nft_12_layer_2.png")
    final.save(output_path, 'PNG')

    # Also save to backend
    backend_path = os.path.join(PROJECT_ROOT, "backend", "public", "images", "nft_12_layer_2.png")
    final.save(backend_path, 'PNG')

    print(f"+ Final treasure map saved: {output_path}")
    print(f"+ Backend copy saved: {backend_path}")

# Create the final map
print("\n" + "="*70)
print("CREATING FINAL PROFESSIONAL TREASURE MAP")
print("="*70)
create_final_professional_map()
print("="*70)
print("SUCCESS! Professional treasure map created with:")
print("- Clean base map (no text labels)")
print("- Mystery treasure location marked with X")
print("- Professional aged treasure map aesthetic")
print("- No location names visible - must decode cipher!")
print("="*70)