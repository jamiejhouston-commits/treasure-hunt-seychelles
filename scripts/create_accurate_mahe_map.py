#!/usr/bin/env python3
"""
Create GEOGRAPHICALLY ACCURATE Mahé island map overlay
Based on the actual shape of Mahé - elongated north-south, about 27km long
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "content", "treasure_hunt_chapter1", "layers")

os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_font(size):
    """Get font with fallback"""
    try:
        for font_name in ['Arial.ttf', 'arial.ttf', 'Arial', 'calibri.ttf']:
            try:
                return ImageFont.truetype(font_name, size)
            except:
                continue
        return ImageFont.load_default()
    except:
        return ImageFont.load_default()

def create_accurate_mahe_map():
    """Create geographically accurate Mahé map with real Bel Ombre location"""
    print("Creating accurate Mahé map overlay...")

    img = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Dark blue ocean background with transparency
    draw.rectangle([50, 50, 750, 750],
                  fill=(15, 30, 60, 200),  # Dark blue ocean
                  outline=(80, 80, 100, 255),
                  width=3)

    # ACCURATE Mahé island outline based on real geography
    # Mahé is approximately 27km long (north-south) and 8km wide at widest
    # The island is narrow and elongated, wider in the north, tapering south

    # Scale: Using most of the 700px height for the 27km length
    # This gives us roughly 25px per km

    mahe_points = [
        # NORTH TIP - Glacis/North East Point area
        (400, 90),   # Northernmost point
        (420, 95),
        (440, 105),
        (455, 115),  # Northeast coast
        (465, 130),
        (470, 150),

        # NORTHEAST COAST going south
        (475, 170),
        (480, 190),
        (485, 210),
        (488, 230),  # Near Victoria (east side)
        (490, 250),
        (492, 270),

        # EAST COAST - wider middle section
        (495, 290),
        (496, 310),
        (497, 330),
        (498, 350),
        (499, 370),
        (500, 390),  # Widest point east
        (498, 410),
        (496, 430),
        (494, 450),
        (490, 470),

        # SOUTHEAST COAST
        (485, 490),
        (480, 510),
        (475, 530),
        (468, 550),
        (460, 570),
        (450, 590),
        (440, 610),
        (428, 630),

        # SOUTH TIP - Anse Royale/Quatre Bornes area
        (415, 650),
        (400, 665),  # Southernmost point
        (385, 660),
        (372, 650),
        (360, 630),

        # SOUTHWEST COAST going north
        (350, 610),
        (340, 590),
        (332, 570),
        (325, 550),
        (320, 530),
        (315, 510),
        (310, 490),
        (305, 470),

        # WEST COAST - middle section
        (302, 450),
        (300, 430),
        (298, 410),
        (297, 390),
        (296, 370),
        (295, 350),
        (294, 330),
        (293, 310),
        (292, 290),

        # NORTHWEST COAST - Bel Ombre is here!
        (290, 270),
        (288, 250),
        (285, 230),  # Bel Ombre area (northwest)
        (282, 210),
        (280, 190),
        (275, 170),

        # NORTH WEST - Port Launay area
        (270, 150),
        (268, 130),
        (270, 115),
        (280, 105),
        (300, 95),
        (320, 90),
        (340, 88),
        (360, 87),
        (380, 88),
        (400, 90)   # Close the path
    ]

    # Draw the island with realistic green color
    draw.polygon(mahe_points, fill=(60, 110, 60, 180), outline=(40, 80, 40, 255), width=2)

    # Add mountain ridge in center (Morne Seychellois National Park)
    mountain_points = [
        (380, 280),
        (390, 260),
        (400, 250),
        (420, 255),
        (440, 270),
        (450, 290),
        (445, 320),
        (430, 350),
        (410, 370),
        (390, 360),
        (375, 330),
        (370, 300),
        (380, 280)
    ]
    draw.polygon(mountain_points, fill=(80, 130, 80, 150))

    # MARK BEL OMBRE - Real location on northwest coast
    # Bel Ombre is at approximately 4.6097°S, 55.4263°E
    # This is on the northwest coast, south of Port Launay
    bel_x, bel_y = 285, 230  # Northwest coast position

    # Draw red X mark for treasure
    mark_size = 12
    draw.line([(bel_x-mark_size, bel_y-mark_size), (bel_x+mark_size, bel_y+mark_size)],
              fill=(255, 0, 0), width=4)
    draw.line([(bel_x-mark_size, bel_y+mark_size), (bel_x+mark_size, bel_y-mark_size)],
              fill=(255, 0, 0), width=4)

    # Circle around the X
    draw.ellipse([(bel_x-20, bel_y-20), (bel_x+20, bel_y+20)],
                outline=(255, 0, 0), width=3)

    # Add location labels with accurate positions
    font_title = get_font(28)
    font_location = get_font(18)
    font_small = get_font(14)

    # Title
    draw.text((400, 70), "MAHÉ ISLAND", font=font_title,
              fill=(255, 215, 0), anchor="mm", stroke_width=1, stroke_fill=(0, 0, 0))

    # Major locations (accurate positions)
    # Victoria (capital) - east coast, northern third
    draw.text((510, 240), "Victoria", font=font_location,
              fill=(255, 255, 255))

    # Beau Vallon - north coast
    draw.text((400, 120), "Beau Vallon", font=font_small,
              fill=(200, 200, 200), anchor="mm")

    # Port Launay - northwest
    draw.text((250, 165), "Port Launay", font=font_small,
              fill=(200, 200, 200))

    # Anse Royale - southeast
    draw.text((460, 600), "Anse Royale", font=font_small,
              fill=(200, 200, 200))

    # BEL OMBRE label with arrow pointing to X
    draw.text((bel_x-70, bel_y-30), "BEL OMBRE", font=font_location,
              fill=(255, 255, 0), stroke_width=1, stroke_fill=(0, 0, 0))
    draw.line([(bel_x-35, bel_y-20), (bel_x-15, bel_y-10)],
              fill=(255, 255, 0), width=2)

    # Add treasure note
    draw.text((bel_x, bel_y+35), "La Buse", font=font_small,
              fill=(255, 100, 100), anchor="mm")
    draw.text((bel_x, bel_y+50), "Treasure Site", font=font_small,
              fill=(255, 100, 100), anchor="mm")

    # Compass rose
    compass_x, compass_y = 680, 120
    # N arrow
    draw.line([(compass_x, compass_y+35), (compass_x, compass_y-35)],
              fill=(255, 255, 255), width=3)
    draw.polygon([(compass_x, compass_y-35), (compass_x-8, compass_y-20),
                  (compass_x+8, compass_y-20)], fill=(255, 255, 255))
    # Other directions
    draw.line([(compass_x-30, compass_y), (compass_x+30, compass_y)],
              fill=(200, 200, 200), width=2)

    draw.text((compass_x, compass_y-45), "N", font=font_location,
              fill=(255, 255, 255), anchor="mm")

    # Scale bar
    scale_x, scale_y = 150, 700
    draw.line([(scale_x, scale_y), (scale_x+100, scale_y)],
              fill=(255, 255, 255), width=2)
    draw.line([(scale_x, scale_y-5), (scale_x, scale_y+5)],
              fill=(255, 255, 255), width=2)
    draw.line([(scale_x+100, scale_y-5), (scale_x+100, scale_y+5)],
              fill=(255, 255, 255), width=2)
    draw.text((scale_x+50, scale_y+15), "5 km", font=font_small,
              fill=(200, 200, 200), anchor="mm")

    # GPS Coordinates (real ones for Bel Ombre)
    draw.text((400, 720), "4.6097°S, 55.4263°E", font=font_location,
              fill=(0, 255, 100), anchor="mm")

    # Save
    output_path = os.path.join(OUTPUT_DIR, "nft_12_layer_2.png")
    img.save(output_path, 'PNG')
    print(f"+ Saved accurate Mahé map to: {output_path}")

    return output_path

# Create the map
print("\n" + "="*60)
print("CREATING GEOGRAPHICALLY ACCURATE MAHÉ MAP")
print("="*60)
print("Location: Bel Ombre, Northwest Mahé")
print("Real GPS: 4.6097°S, 55.4263°E")
print("Historical significance: La Buse treasure site")
print("="*60 + "\n")

output_file = create_accurate_mahe_map()

print("\n" + "="*60)
print("MAP CREATED SUCCESSFULLY!")
print("="*60)
print("The map now shows:")
print("- Accurate Mahé island shape (elongated north-south)")
print("- Real Bel Ombre location on northwest coast")
print("- Actual GPS coordinates: 4.6097°S, 55.4263°E")
print("- Major landmarks: Victoria, Beau Vallon, Port Launay, Anse Royale")
print("- Central mountain ridge (Morne Seychellois)")
print("="*60)