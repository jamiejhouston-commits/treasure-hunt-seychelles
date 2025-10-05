#!/usr/bin/env python3
"""
Create a VISIBLE treasure map overlay with the real Mahé map
Make it clear and readable while keeping the cool treasure map aesthetic
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

def create_visible_treasure_map():
    """Create a visible, clear treasure map overlay"""
    print("Creating visible treasure map overlay...")

    # Load the actual map
    map_path = os.path.join(MAPS_DIR, "NORTH_MAHE.jpeg")
    original_map = Image.open(map_path)

    # Convert to RGBA
    if original_map.mode != 'RGBA':
        original_map = original_map.convert('RGBA')

    # Resize to fit 800x800
    width, height = original_map.size
    aspect = width / height

    if aspect > 1:  # Wider
        new_width = 700  # Leave room for border
        new_height = int(700 / aspect)
    else:  # Taller
        new_height = 700
        new_width = int(700 * aspect)

    resized_map = original_map.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Create base with dark ocean background
    img = Image.new('RGBA', (800, 800), (15, 25, 45, 255))  # Dark ocean blue, OPAQUE

    # Draw decorative border
    draw_base = ImageDraw.Draw(img)

    # Outer border
    draw_base.rectangle([10, 10, 790, 790],
                        outline=(120, 90, 60, 255), width=4)

    # Inner border
    draw_base.rectangle([20, 20, 780, 780],
                        outline=(80, 60, 40, 255), width=2)

    # Calculate position to center the map
    x_offset = (800 - new_width) // 2
    y_offset = (800 - new_height) // 2 + 20  # Shift down a bit for title

    # Create a vintage/treasure map effect on the actual map
    # But keep it VISIBLE - higher opacity and better contrast

    # Enhance the original map first
    enhancer = ImageEnhance.Contrast(resized_map)
    map_enhanced = enhancer.enhance(1.3)  # Increase contrast

    enhancer = ImageEnhance.Brightness(map_enhanced)
    map_enhanced = enhancer.enhance(1.1)  # Slightly brighter

    # Apply subtle sepia tone without losing visibility
    map_processed = Image.new('RGBA', map_enhanced.size, (0, 0, 0, 0))

    for x in range(map_enhanced.width):
        for y in range(map_enhanced.height):
            r, g, b, a = map_enhanced.getpixel((x, y))
            # Subtle sepia shift
            new_r = min(255, int(r * 1.1))
            new_g = min(255, int(g * 0.95))
            new_b = min(255, int(b * 0.85))
            # Keep high opacity for visibility
            new_a = max(200, a)  # At least 78% opaque
            map_processed.putpixel((x, y), (new_r, new_g, new_b, new_a))

    # Add aged paper texture around edges (vignette effect)
    vignette = Image.new('RGBA', map_processed.size, (0, 0, 0, 0))
    vignette_draw = ImageDraw.Draw(vignette)

    # Create gradient from edges
    for i in range(30):
        alpha = 80 - i * 2
        if alpha > 0:
            vignette_draw.rectangle([i, i, map_processed.width-i, map_processed.height-i],
                                   outline=(60, 45, 30, alpha), width=2)

    # Composite vignette
    map_processed = Image.alpha_composite(map_processed, vignette)

    # Paste the processed map onto base
    img.paste(map_processed, (x_offset, y_offset), map_processed)

    # Create overlay for decorations and markers
    overlay = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Add subtle grid lines (treasure map style)
    for x in range(50, 750, 100):
        draw.line([(x, 50), (x, 750)], fill=(180, 150, 100, 40), width=1)
    for y in range(50, 750, 100):
        draw.line([(50, y), (750, y)], fill=(180, 150, 100, 40), width=1)

    # Title on aged banner
    banner = Image.new('RGBA', (400, 70), (0, 0, 0, 0))
    banner_draw = ImageDraw.Draw(banner)

    # Banner shape
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

    # BEL OMBRE location with better visibility
    bel_x = x_offset + int(new_width * 0.25)
    bel_y = y_offset + int(new_height * 0.35)

    # Glowing effect for X mark
    for radius in [30, 25, 20, 15]:
        alpha = 60 + (30 - radius) * 3
        color = (255, 50 + (30-radius)*5, 50)
        draw.ellipse([(bel_x-radius, bel_y-radius), (bel_x+radius, bel_y+radius)],
                    fill=(*color, alpha))

    # Bold red X
    x_size = 20
    for width in [8, 6, 4]:  # Multiple widths for bold effect
        draw.line([(bel_x-x_size, bel_y-x_size), (bel_x+x_size, bel_y+x_size)],
                  fill=(255, 0, 0, 255), width=width)
        draw.line([(bel_x-x_size, bel_y+x_size), (bel_x+x_size, bel_y-x_size)],
                  fill=(255, 0, 0, 255), width=width)

    # Double circle for emphasis
    draw.ellipse([(bel_x-30, bel_y-30), (bel_x+30, bel_y+30)],
                outline=(255, 0, 0, 255), width=4)
    draw.ellipse([(bel_x-35, bel_y-35), (bel_x+35, bel_y+35)],
                outline=(180, 0, 0, 200), width=2)

    # Clear label with solid backdrop
    label_box = Image.new('RGBA', (300, 110), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(label_box)

    # Parchment style but OPAQUE
    label_draw.rounded_rectangle([0, 0, 300, 110], radius=15,
                                fill=(35, 28, 20, 240),  # Almost opaque
                                outline=(140, 100, 60, 255),
                                width=3)

    # Decorative corners
    for corner in [(10, 10), (290, 10), (10, 100), (290, 100)]:
        label_draw.ellipse([corner[0]-5, corner[1]-5, corner[0]+5, corner[1]+5],
                          fill=(180, 130, 80, 255))

    overlay.paste(label_box, (bel_x-150, bel_y-160), label_box)

    # Text labels
    font_large = get_font(32)
    font_medium = get_font(22)
    font_small = get_font(16)

    draw.text((bel_x, bel_y-110), "BEL OMBRE", font=font_large,
              fill=(255, 215, 0, 255), anchor="mm",
              stroke_width=2, stroke_fill=(80, 50, 20, 255))

    draw.text((bel_x, bel_y-75), "La Buse Treasure Site", font=font_medium,
              fill=(255, 180, 120, 255), anchor="mm")

    # Arrow pointing to X
    arrow_points = [
        (bel_x-60, bel_y-55),
        (bel_x-20, bel_y-20),
        (bel_x-25, bel_y-25),
        (bel_x-20, bel_y-20),
        (bel_x-28, bel_y-18)
    ]
    draw.line(arrow_points[:2], fill=(255, 215, 0, 255), width=4)
    draw.polygon(arrow_points[2:], fill=(255, 215, 0, 255))

    # Ornate compass rose
    cx, cy = 700, 120

    # Compass background circle
    draw.ellipse([(cx-50, cy-50), (cx+50, cy+50)],
                fill=(25, 20, 15, 200),
                outline=(180, 150, 100, 255), width=3)

    # Star pattern
    star_points = []
    import math
    for i in range(8):
        angle = i * math.pi / 4
        if i % 2 == 0:  # Main directions
            r = 40
        else:  # Diagonal directions
            r = 25
        x = cx + r * math.sin(angle)
        y = cy - r * math.cos(angle)
        star_points.append((x, y))

    draw.polygon(star_points, outline=(200, 170, 120, 255), width=2)

    # N arrow
    draw.polygon([(cx, cy-40), (cx-8, cy-25), (cx+8, cy-25)],
                fill=(255, 255, 255, 255))

    # Direction labels
    draw.text((cx, cy-52), "N", font=font_large,
              fill=(255, 255, 255, 255), anchor="mm")
    draw.text((cx+52, cy), "E", font=font_medium,
              fill=(200, 200, 200, 255), anchor="mm")
    draw.text((cx, cy+52), "S", font=font_medium,
              fill=(200, 200, 200, 255), anchor="mm")
    draw.text((cx-52, cy), "W", font=font_medium,
              fill=(200, 200, 200, 255), anchor="mm")

    # GPS coordinates on solid plaque
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

    # Composite everything
    final = Image.alpha_composite(img, overlay)

    # Save the visible treasure map
    output_path = os.path.join(OUTPUT_DIR, "nft_12_layer_2.png")
    final.save(output_path, 'PNG')

    # Also save to backend
    backend_path = os.path.join(PROJECT_ROOT, "backend", "public", "images", "nft_12_layer_2.png")
    final.save(backend_path, 'PNG')

    print(f"+ Saved visible treasure map to: {output_path}")
    print(f"+ Also saved to backend: {backend_path}")

# Create the map
print("\n" + "="*70)
print("CREATING VISIBLE TREASURE MAP OVERLAY")
print("="*70)
create_visible_treasure_map()
print("="*70)
print("SUCCESS! Created visible treasure map with:")
print("- Clear, visible North Mahé map")
print("- Bold treasure markers and labels")
print("- Treasure map aesthetic without hiding details")
print("- Ornate compass and decorative elements")
print("="*70)