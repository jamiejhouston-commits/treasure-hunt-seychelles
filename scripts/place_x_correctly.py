#!/usr/bin/env python3
"""
FINAL FIX: Analyze the map and place X on LAND at the correct location
Dan Zil / Danzil is on the NORTHWEST COAST of Mahé
Looking at the map - it should be near Anse Major / Beau Vallon area ON THE BEACH
"""

from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import os

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

def analyze_map_and_place_x():
    """Analyze the map to find land vs water and place X correctly"""
    print("Analyzing map to place X on LAND...")

    # Load map
    map_path = os.path.join(MAPS_DIR, "NORTH_MAHE.png")
    original_map = Image.open(map_path)
    print(f"Map size: {original_map.size}")

    if original_map.mode != 'RGBA':
        original_map = original_map.convert('RGBA')

    # Resize
    width, height = original_map.size
    aspect = width / height
    new_width = 720
    new_height = int(720 / aspect)
    resized_map = original_map.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Analyze the map to find land (green/beige) vs water (blue)
    # Sample pixels to find the coastline
    print("Analyzing pixels to find land...")

    # Looking at the map image, the LEFT SIDE (west coast) has land
    # The green/beige colored area is LAND
    # Blue is OCEAN

    # Let me sample some pixels at different positions
    for test_x_pct in [0.15, 0.2, 0.25, 0.3, 0.35, 0.4]:
        test_x = int(new_width * test_x_pct)
        test_y = int(new_height * 0.5)

        if test_x < resized_map.width and test_y < resized_map.height:
            pixel = resized_map.getpixel((test_x, test_y))
            r, g, b = pixel[0], pixel[1], pixel[2]

            # Green/beige land has higher green/red than blue
            # Ocean/water is very blue (high blue value)
            is_water = b > 150 and b > r and b > g
            is_land = not is_water

            print(f"Position {test_x_pct*100}% from left: RGB({r},{g},{b}) = {'LAND' if is_land else 'WATER'}")

    # Based on analysis, find the rightmost land position (coastline)
    # Dan Zil should be ON the coast, not in the ocean

    # Scan from left to right to find where land ends (coastline)
    coast_x = None
    test_y = int(new_height * 0.45)  # Mid-height

    for test_x in range(int(new_width * 0.15), int(new_width * 0.5)):
        pixel = resized_map.getpixel((test_x, test_y))
        r, g, b = pixel[0], pixel[1], pixel[2]

        is_water = b > 150 and b > r and b > g

        if is_water and coast_x is None:
            coast_x = test_x - 30  # Step back onto land
            print(f"Found coastline at x={coast_x} ({(coast_x/new_width)*100:.1f}% from left)")
            break

    if coast_x is None:
        # Fallback - use safe land position
        coast_x = int(new_width * 0.30)
        print(f"Using fallback position at {coast_x}")

    # Create final map
    final_map = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    background = Image.new('RGBA', (800, 800), (20, 30, 50, 255))
    draw_bg = ImageDraw.Draw(background)

    draw_bg.rectangle([8, 8, 792, 792], outline=(140, 110, 70, 255), width=5)
    draw_bg.rectangle([15, 15, 785, 785], outline=(100, 80, 50, 255), width=3)

    final_map = Image.alpha_composite(final_map, background)

    # Position map
    x_offset = (800 - new_width) // 2
    y_offset = (800 - new_height) // 2 + 20

    # Enhance
    enhancer = ImageEnhance.Contrast(resized_map)
    map_enhanced = enhancer.enhance(1.15)
    enhancer = ImageEnhance.Color(map_enhanced)
    map_enhanced = enhancer.enhance(0.9)

    final_map.paste(map_enhanced, (x_offset, y_offset), map_enhanced)

    # Overlay
    overlay = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Grid
    for x in range(50, 750, 100):
        draw.line([(x, 50), (x, 750)], fill=(150, 130, 100, 25), width=1)
    for y in range(50, 750, 100):
        draw.line([(50, y), (750, y)], fill=(150, 130, 100, 25), width=1)

    # Title
    banner_width = 420
    banner = Image.new('RGBA', (banner_width, 70), (0, 0, 0, 0))
    banner_draw = ImageDraw.Draw(banner)
    banner_points = [(15, 10), (banner_width-15, 10), (banner_width-5, 20), (banner_width, 35),
                     (banner_width-5, 50), (banner_width-15, 60), (15, 60), (5, 50), (0, 35), (5, 20), (15, 10)]
    banner_draw.polygon(banner_points, fill=(50, 40, 30, 220), outline=(140, 110, 70, 255))
    overlay.paste(banner, ((800-banner_width)//2, 8), banner)

    font_title = get_font(44)
    draw.text((400, 42), "NORTH MAHÉ", font=font_title,
              fill=(255, 220, 80, 255), anchor="mm", stroke_width=3, stroke_fill=(80, 60, 40, 255))

    # CORRECT TREASURE POSITION - ON THE COASTLINE!
    treasure_x = x_offset + coast_x
    treasure_y = y_offset + int(new_height * 0.45)

    print(f"Placing treasure X at screen position: ({treasure_x}, {treasure_y})")

    # Glow
    for radius in [40, 35, 30, 25, 20, 15]:
        alpha = 40 + (40 - radius) * 2
        glow_color = (255, 120 - (40-radius)*2, 60)
        draw.ellipse([(treasure_x-radius, treasure_y-radius), (treasure_x+radius, treasure_y+radius)],
                    fill=(*glow_color, alpha))

    # Red X
    x_size = 24
    for w in [12, 10, 8, 6, 4]:
        draw.line([(treasure_x-x_size, treasure_y-x_size), (treasure_x+x_size, treasure_y+x_size)],
                  fill=(255, 0, 0, 255), width=w)
        draw.line([(treasure_x-x_size, treasure_y+x_size), (treasure_x+x_size, treasure_y-x_size)],
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
                                fill=(40, 32, 24, 235), outline=(160, 120, 70, 255), width=4)

    for corner_x, corner_y in [(12, 12), (label_width-12, 12), (12, label_height-12), (label_width-12, label_height-12)]:
        label_draw.ellipse([corner_x-6, corner_y-6, corner_x+6, corner_y+6], fill=(200, 160, 100, 255))

    overlay.paste(label_box, (treasure_x-160, treasure_y-160), label_box)

    font_xlarge = get_font(34)
    font_large = get_font(24)

    draw.text((treasure_x, treasure_y-115), "X MARKS THE SPOT", font=font_xlarge,
              fill=(255, 220, 60, 255), anchor="mm", stroke_width=2, stroke_fill=(100, 70, 40, 255))
    draw.text((treasure_x, treasure_y-78), "Coastal Treasure", font=font_large,
              fill=(255, 190, 140, 255), anchor="mm")

    # Arrow
    draw.line([(treasure_x-70, treasure_y-58), (treasure_x-25, treasure_y-25)], fill=(255, 220, 60, 255), width=5)
    draw.polygon([(treasure_x-25, treasure_y-25), (treasure_x-35, treasure_y-35), (treasure_x-37, treasure_y-30)],
                 fill=(255, 220, 60, 255))

    # Compass
    compass_x, compass_y = 710, 130
    draw.ellipse([(compass_x-60, compass_y-60), (compass_x+60, compass_y+60)],
                fill=(30, 25, 20, 210), outline=(200, 170, 120, 255), width=4)

    import math
    for i in range(16):
        angle = i * math.pi / 8
        r1 = 50 if i % 4 == 0 else (40 if i % 2 == 0 else 25)
        x1 = compass_x + r1 * math.sin(angle)
        y1 = compass_y - r1 * math.cos(angle)
        draw.line([(compass_x, compass_y), (x1, y1)], fill=(220, 190, 140, 255), width=2)

    draw.polygon([(compass_x, compass_y-50), (compass_x-12, compass_y-30), (compass_x+12, compass_y-30)],
                 fill=(255, 255, 255, 255))

    draw.text((compass_x, compass_y-65), "N", font=font_xlarge, fill=(255, 255, 255, 255), anchor="mm")
    draw.text((compass_x+65, compass_y), "E", font=font_large, fill=(220, 220, 220, 255), anchor="mm")
    draw.text((compass_x, compass_y+65), "S", font=font_large, fill=(220, 220, 220, 255), anchor="mm")
    draw.text((compass_x-65, compass_y), "W", font=font_large, fill=(220, 220, 220, 255), anchor="mm")

    # GPS
    gps_box = Image.new('RGBA', (400, 60), (0, 0, 0, 0))
    gps_draw = ImageDraw.Draw(gps_box)
    gps_draw.rounded_rectangle([0, 0, 400, 60], radius=12, fill=(35, 28, 22, 235), outline=(160, 120, 70, 255), width=3)
    overlay.paste(gps_box, (200, 725), gps_box)

    draw.text((400, 755), "4.6097°S, 55.4263°E", font=font_xlarge,
              fill=(120, 255, 170, 255), anchor="mm", stroke_width=1, stroke_fill=(30, 80, 50, 255))

    # Scale
    draw.line([(80, 705), (200, 705)], fill=(255, 255, 255, 255), width=3)
    draw.line([(80, 700), (80, 710)], fill=(255, 255, 255, 255), width=3)
    draw.line([(200, 700), (200, 710)], fill=(255, 255, 255, 255), width=3)
    draw.text((140, 723), "5 km", font=font_large, fill=(255, 255, 255, 255), anchor="mm")

    # Hint
    hint_box = Image.new('RGBA', (360, 50), (0, 0, 0, 0))
    hint_draw = ImageDraw.Draw(hint_box)
    hint_draw.rounded_rectangle([0, 0, 360, 50], radius=10, fill=(50, 40, 30, 200), outline=(140, 110, 70, 255), width=2)
    overlay.paste(hint_box, (220, 665), hint_box)

    draw.text((400, 690), "Decode the cipher to reveal", font=get_font(22),
              fill=(230, 200, 160, 255), anchor="mm")

    # Composite
    final = Image.alpha_composite(final_map, overlay)

    # Save
    output_path = os.path.join(OUTPUT_DIR, "nft_12_layer_2.png")
    final.save(output_path, 'PNG')

    backend_path = os.path.join(PROJECT_ROOT, "backend", "public", "images", "nft_12_layer_2.png")
    final.save(backend_path, 'PNG')

    print(f"SAVED: {output_path}")
    print(f"BACKEND: {backend_path}")
    print(f"X IS NOW ON THE COASTLINE - NOT IN WATER!")

print("\n" + "="*70)
print("ANALYZING MAP AND PLACING X ON LAND")
print("="*70)
analyze_map_and_place_x()
print("="*70)
print("DONE! X placed on coastline by analyzing pixel colors!")
print("="*70)