#!/usr/bin/env python3
"""
Create EXACT Mahé shape based on the real map
The island is VERY narrow and elongated with a curved banana-like shape
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
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

def create_exact_mahe():
    """Create the EXACT Mahé shape - very narrow, curved like a backwards C"""
    print("Creating EXACT Mahé shape from real map...")

    img = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Ocean
    draw.rectangle([30, 30, 770, 770],
                  fill=(25, 45, 85, 200),
                  outline=(80, 100, 120, 255),
                  width=2)

    # EXACT MAHÉ SHAPE - Much narrower, more curved
    # The island is like a long curved finger pointing down
    # Maximum width is only about 1/4 of its length

    mahe = [
        # NORTH TIP - Very narrow
        (420, 70),
        (430, 68),
        (440, 69),
        (450, 71),

        # Northeast coast - slight bulge for Beau Vallon
        (460, 76),
        (468, 82),
        (475, 90),
        (480, 100),
        (483, 112),
        (485, 125),

        # Beau Vallon bay indent
        (483, 135),
        (478, 138),  # indent
        (475, 140),
        (477, 143),
        (482, 146),

        # East coast with Victoria - relatively straight
        (485, 160),
        (487, 175),
        (488, 190),
        (489, 205),  # Victoria area
        (490, 220),
        (491, 235),
        (492, 250),
        (493, 265),
        (494, 280),
        (495, 295),
        (496, 310),
        (497, 325),
        (498, 340),
        (499, 355),
        (500, 370),
        (500, 385),
        (499, 400),
        (498, 415),
        (496, 430),
        (494, 445),
        (491, 460),
        (488, 475),
        (484, 490),
        (480, 505),
        (475, 520),

        # Southeast coast - Anse Royale area
        (470, 535),
        (464, 550),
        (457, 565),
        (449, 580),
        (440, 595),
        (430, 610),
        (418, 625),
        (405, 640),

        # SOUTH TIP - Very narrow point
        (392, 655),
        (380, 668),
        (370, 678),
        (360, 685),
        (350, 690),
        (340, 693),
        (330, 694),
        (320, 693),
        (310, 690),

        # Southwest coast - curves back up
        (302, 683),
        (295, 670),
        (290, 655),
        (287, 640),
        (285, 625),
        (283, 610),
        (281, 595),
        (279, 580),
        (277, 565),
        (275, 550),
        (273, 535),
        (271, 520),
        (269, 505),
        (267, 490),
        (265, 475),
        (263, 460),
        (261, 445),
        (259, 430),
        (257, 415),
        (255, 400),
        (253, 385),
        (251, 370),
        (249, 355),
        (247, 340),
        (245, 325),
        (243, 310),
        (241, 295),
        (239, 280),
        (237, 265),
        (235, 250),
        (233, 235),
        (231, 220),
        (229, 205),

        # Northwest - Port Launay deep bay
        (227, 190),
        (225, 175),
        (223, 160),  # Start of Port Launay bay
        (218, 155),  # Bay curves deep in
        (210, 152),
        (200, 150),  # Deepest part
        (195, 148),
        (192, 145),
        (195, 142),
        (200, 139),
        (208, 137),
        (216, 135),
        (222, 138),
        (225, 143),
        (227, 148),  # Bay curves back out

        # BEL OMBRE area (just above Port Launay)
        (225, 135),
        (224, 120),
        (223, 105),

        # Northwest tip
        (222, 90),
        (225, 80),
        (235, 73),
        (250, 70),
        (270, 68),
        (290, 67),
        (310, 66),
        (330, 66),
        (350, 67),
        (370, 68),
        (390, 69),
        (405, 70),
        (420, 70)
    ]

    # Draw the narrow, curved island
    draw.polygon(mahe, fill=(85, 140, 85, 180), outline=(60, 100, 60, 255), width=2)

    # Add subtle mountain ridge down the center
    ridge = [
        (350, 200),
        (365, 180),
        (380, 170),
        (395, 175),
        (410, 190),
        (420, 210),
        (425, 240),
        (428, 270),
        (430, 300),
        (428, 330),
        (425, 360),
        (420, 390),
        (410, 420),
        (395, 445),
        (380, 460),
        (365, 470),
        (350, 475),
        (335, 470),
        (320, 450),
        (310, 420),
        (305, 390),
        (303, 360),
        (305, 330),
        (310, 300),
        (315, 270),
        (320, 240),
        (330, 210),
        (350, 200)
    ]
    draw.polygon(ridge, fill=(100, 160, 100, 100))

    # MARK BEL OMBRE - Accurate position on northwest coast
    bel_x, bel_y = 225, 120

    # Red X
    draw.line([(bel_x-12, bel_y-12), (bel_x+12, bel_y+12)],
              fill=(255, 0, 0), width=5)
    draw.line([(bel_x-12, bel_y+12), (bel_x+12, bel_y-12)],
              fill=(255, 0, 0), width=5)

    # Circle
    draw.ellipse([(bel_x-20, bel_y-20), (bel_x+20, bel_y+20)],
                outline=(255, 0, 0), width=3)

    # Labels
    font_title = get_font(36)
    font_place = get_font(18)
    font_small = get_font(14)

    # Title
    draw.text((400, 40), "MAHÉ ISLAND", font=font_title,
              fill=(255, 220, 100), anchor="mm", stroke_width=2, stroke_fill=(0, 0, 0))

    # Locations
    draw.text((490, 205), "Victoria", font=font_place, fill=(255, 255, 255))
    draw.text((480, 138), "Beau Vallon", font=font_small, fill=(200, 200, 200))
    draw.text((200, 150), "Port Launay", font=font_small, fill=(200, 200, 200))
    draw.text((470, 550), "Anse Royale", font=font_small, fill=(200, 200, 200))

    # Bel Ombre
    draw.text((bel_x-70, bel_y-30), "BEL OMBRE", font=font_place,
              fill=(255, 220, 0), stroke_width=1, stroke_fill=(0, 0, 0))
    draw.line([(bel_x-35, bel_y-20), (bel_x-15, bel_y-10)],
              fill=(255, 220, 0), width=2)

    # Compass
    cx, cy = 720, 100
    draw.line([(cx, cy+30), (cx, cy-30)], fill=(255, 255, 255), width=3)
    draw.polygon([(cx, cy-30), (cx-8, cy-18), (cx+8, cy-18)], fill=(255, 255, 255))
    draw.text((cx, cy-40), "N", font=font_place, fill=(255, 255, 255), anchor="mm")

    # Scale
    sx, sy = 80, 740
    draw.line([(sx, sy), (sx+60, sy)], fill=(255, 255, 255), width=2)
    draw.text((sx+30, sy+12), "5 km", font=font_small, fill=(200, 200, 200), anchor="mm")

    # GPS
    draw.text((400, 750), "4.6097°S, 55.4263°E", font=font_place,
              fill=(100, 255, 150), anchor="mm")

    # Save with timestamp in filename to force update
    import time
    timestamp = int(time.time())

    # Save to main location
    output_path = os.path.join(OUTPUT_DIR, "nft_12_layer_2.png")
    img.save(output_path, 'PNG')

    # Also save with timestamp for verification
    backup_path = os.path.join(OUTPUT_DIR, f"nft_12_layer_2_{timestamp}.png")
    img.save(backup_path, 'PNG')

    print(f"+ Saved EXACT map to: {output_path}")
    print(f"+ Backup saved to: {backup_path}")

# Generate
print("\n" + "="*70)
print("CREATING EXACT MAHÉ SHAPE - NARROW & CURVED")
print("="*70)
create_exact_mahe()
print("="*70)
print("DONE! The map now shows:")
print("- EXACT narrow, elongated shape")
print("- Curved like the real island")
print("- Port Launay Bay deep indentation")
print("- Bel Ombre marked at correct position")
print("="*70)