#!/usr/bin/env python3
"""
Create CORRECT Bel Ombre puzzle overlays that actually work together
Puzzle solution: BEL OMBRE (using Caesar shift +1)
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "images")

os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_font(size):
    """Get font with fallback"""
    try:
        # Try common Windows fonts
        for font_name in ['Arial.ttf', 'arial.ttf', 'Arial', 'calibri.ttf']:
            try:
                return ImageFont.truetype(font_name, size)
            except:
                continue
        # Fallback to default
        return ImageFont.load_default()
    except:
        return ImageFont.load_default()

def create_cipher_overlay():
    """NFT #5: Cipher text 'CFM PNCSF' (BEL OMBRE shifted +1)"""
    print("Creating NFT #5: Cipher text overlay...")

    img = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Dark parchment-style backdrop
    backdrop = Image.new('RGBA', (600, 300), (0, 0, 0, 0))
    backdrop_draw = ImageDraw.Draw(backdrop)

    # Draw aged parchment background
    backdrop_draw.rectangle([0, 0, 600, 300],
                           fill=(25, 20, 15, 220),  # Dark brown, semi-transparent
                           outline=(80, 60, 40, 255),
                           width=3)

    # Add torn edges effect
    for i in range(0, 600, 20):
        backdrop_draw.polygon([(i, 0), (i+10, 8), (i+20, 0)], fill=(25, 20, 15, 220))
        backdrop_draw.polygon([(i, 300), (i+10, 292), (i+20, 300)], fill=(25, 20, 15, 220))

    # Paste backdrop centered
    img.paste(backdrop, (100, 250), backdrop)

    # Draw cipher text
    font_main = get_font(72)
    font_label = get_font(24)

    # Main cipher text
    cipher_text = "CFM PNCSF"
    draw.text((400, 400), cipher_text, font=font_main,
              fill=(255, 215, 0), anchor="mm", stroke_width=2, stroke_fill=(80, 60, 40))

    # Add decorative elements
    draw.text((400, 320), "~ ENCODED MESSAGE ~", font=font_label,
              fill=(200, 170, 130), anchor="mm")

    draw.text((400, 480), "Decipher to find the treasure", font=get_font(18),
              fill=(160, 140, 100), anchor="mm")

    # Save
    img.save(os.path.join(OUTPUT_DIR, "nft_5_layer_1.png"), 'PNG')
    print("+ NFT #5 cipher overlay created")

def create_map_overlay():
    """NFT #12: Actual Mahé island map with Bel Ombre marked"""
    print("Creating NFT #12: Mahé island map overlay...")

    img = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Create map background
    draw.rectangle([50, 50, 750, 750],
                  fill=(20, 30, 50, 200),  # Dark blue nautical chart
                  outline=(100, 80, 60, 255),
                  width=4)

    # Draw grid lines (nautical chart style)
    for x in range(100, 750, 100):
        draw.line([(x, 50), (x, 750)], fill=(60, 70, 90, 100), width=1)
    for y in range(100, 750, 100):
        draw.line([(50, y), (750, y)], fill=(60, 70, 90, 100), width=1)

    # Draw realistic Mahé island shape (elongated north-south)
    mahe_outline = [
        (400, 120),  # North tip - Glacis
        (420, 140),
        (440, 170),
        (450, 200),  # North Point
        (460, 240),
        (465, 280),  # Beau Vallon area
        (470, 320),
        (475, 360),
        (480, 400),  # Victoria area (east)
        (485, 440),
        (480, 480),
        (475, 520),  # Central peaks
        (470, 560),
        (460, 600),
        (445, 640),
        (420, 670),  # South
        (380, 680),  # South tip - Anse Royale
        (340, 670),
        (320, 640),
        (305, 600),
        (295, 560),
        (285, 520),
        (280, 480),
        (275, 440),
        (270, 400),  # West coast
        (265, 360),
        (260, 320),
        (255, 280),  # Bel Ombre area (northwest)
        (250, 240),
        (260, 200),
        (280, 170),
        (320, 140),
        (360, 120),
        (400, 120)  # Close path
    ]

    # Draw island fill
    draw.polygon(mahe_outline, fill=(80, 120, 80, 180), outline=(120, 180, 120, 255), width=2)

    # Draw mountain ranges (central peaks)
    draw.polygon([(380, 400), (400, 380), (420, 400), (400, 450)],
                fill=(100, 140, 100, 150))

    # Mark Bel Ombre location (northwest coast)
    bel_x, bel_y = 265, 280

    # Draw red X mark
    draw.line([(bel_x-15, bel_y-15), (bel_x+15, bel_y+15)],
              fill=(255, 0, 0), width=4)
    draw.line([(bel_x-15, bel_y+15), (bel_x+15, bel_y-15)],
              fill=(255, 0, 0), width=4)

    # Draw circle around X
    draw.ellipse([(bel_x-25, bel_y-25), (bel_x+25, bel_y+25)],
                outline=(255, 0, 0), width=3)

    # Add location labels
    font_title = get_font(32)
    font_place = get_font(20)
    font_small = get_font(16)

    # Title
    draw.text((400, 90), "MAHÉ ISLAND", font=font_title,
              fill=(255, 215, 0), anchor="mm", stroke_width=1, stroke_fill=(0, 0, 0))

    # Major locations
    draw.text((480, 400), "Victoria", font=font_place, fill=(255, 255, 255), anchor="mm")
    draw.text((465, 280), "Beau Vallon", font=font_small, fill=(200, 200, 200))
    draw.text((380, 680), "Anse Royale", font=font_small, fill=(200, 200, 200))

    # Bel Ombre with arrow
    draw.text((bel_x-60, bel_y-40), "BEL OMBRE", font=font_place,
              fill=(255, 255, 0), stroke_width=1, stroke_fill=(0, 0, 0))
    draw.line([(bel_x-30, bel_y-25), (bel_x-10, bel_y-10)],
              fill=(255, 255, 0), width=2)

    # Compass rose
    compass_x, compass_y = 650, 150
    # N arrow
    draw.line([(compass_x, compass_y+40), (compass_x, compass_y-40)],
              fill=(255, 255, 255), width=3)
    draw.polygon([(compass_x, compass_y-40), (compass_x-10, compass_y-20),
                  (compass_x+10, compass_y-20)], fill=(255, 255, 255))
    # E arrow
    draw.line([(compass_x-40, compass_y), (compass_x+40, compass_y)],
              fill=(200, 200, 200), width=2)
    # Labels
    draw.text((compass_x, compass_y-55), "N", font=font_place,
              fill=(255, 255, 255), anchor="mm")
    draw.text((compass_x+55, compass_y), "E", font=font_place,
              fill=(200, 200, 200), anchor="mm")
    draw.text((compass_x, compass_y+55), "S", font=font_place,
              fill=(200, 200, 200), anchor="mm")
    draw.text((compass_x-55, compass_y), "W", font=font_place,
              fill=(200, 200, 200), anchor="mm")

    # Scale
    draw.text((400, 720), "Northwest Coast - Treasure Site", font=font_small,
              fill=(180, 180, 180), anchor="mm")

    # Save
    img.save(os.path.join(OUTPUT_DIR, "nft_12_layer_2.png"), 'PNG')
    print("+ NFT #12 map overlay created")

def create_decoding_overlay():
    """NFT #17: Decoding key 'SHIFT BACK ONE LETTER'"""
    print("Creating NFT #17: Decoding key overlay...")

    img = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Create stone tablet backdrop
    tablet = Image.new('RGBA', (650, 400), (0, 0, 0, 0))
    tablet_draw = ImageDraw.Draw(tablet)

    # Draw stone tablet
    tablet_draw.rounded_rectangle([0, 0, 650, 400], radius=20,
                                 fill=(40, 35, 30, 230),
                                 outline=(80, 70, 60, 255),
                                 width=4)

    # Add cracks for aged effect
    tablet_draw.line([(100, 50), (120, 150)], fill=(30, 25, 20, 150), width=2)
    tablet_draw.line([(500, 100), (520, 200)], fill=(30, 25, 20, 150), width=2)

    # Paste tablet
    img.paste(tablet, (75, 200), tablet)

    # Draw decoding instructions
    font_title = get_font(36)
    font_main = get_font(48)
    font_example = get_font(24)

    # Title
    draw.text((400, 250), "DECODING KEY", font=font_title,
              fill=(255, 100, 100), anchor="mm")

    # Main instruction
    draw.text((400, 350), "SHIFT BACK", font=font_main,
              fill=(255, 215, 0), anchor="mm", stroke_width=2, stroke_fill=(60, 40, 20))
    draw.text((400, 410), "ONE LETTER", font=font_main,
              fill=(255, 215, 0), anchor="mm", stroke_width=2, stroke_fill=(60, 40, 20))

    # Example
    draw.text((400, 480), "C → B, F → E, M → L", font=font_example,
              fill=(200, 200, 200), anchor="mm")

    # Bottom hint
    draw.text((400, 540), "Caesar Cipher: -1", font=get_font(20),
              fill=(150, 150, 150), anchor="mm")

    # Save
    img.save(os.path.join(OUTPUT_DIR, "nft_17_layer_3.png"), 'PNG')
    print("+ NFT #17 decoding key overlay created")

def create_coordinates_overlay():
    """NFT #20: Real Bel Ombre GPS coordinates"""
    print("Creating NFT #20: GPS coordinates overlay...")

    img = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Create GPS device backdrop
    gps_device = Image.new('RGBA', (600, 350), (0, 0, 0, 0))
    gps_draw = ImageDraw.Draw(gps_device)

    # Draw GPS device frame
    gps_draw.rounded_rectangle([0, 0, 600, 350], radius=15,
                              fill=(20, 20, 25, 240),
                              outline=(100, 100, 120, 255),
                              width=3)

    # Draw screen area
    gps_draw.rectangle([30, 30, 570, 320],
                       fill=(10, 30, 20, 250),
                       outline=(0, 255, 100, 200),
                       width=2)

    # Paste device
    img.paste(gps_device, (100, 225), gps_device)

    # Draw GPS elements
    font_label = get_font(28)
    font_coords = get_font(44)
    font_small = get_font(18)

    # GPS satellite icon
    sat_x, sat_y = 400, 300
    draw.ellipse([(sat_x-15, sat_y-15), (sat_x+15, sat_y+15)],
                outline=(0, 255, 100), width=2)
    draw.ellipse([(sat_x-5, sat_y-5), (sat_x+5, sat_y+5)],
                fill=(0, 255, 100))

    # Signal waves
    for r in [25, 35, 45]:
        draw.arc([(sat_x-r, sat_y-r), (sat_x+r, sat_y+r)],
                start=-45, end=45, fill=(0, 255, 100, 100-r), width=1)

    # Label
    draw.text((400, 350), "COORDINATES:", font=font_label,
              fill=(0, 255, 100), anchor="mm")

    # Actual Bel Ombre coordinates
    # Real coordinates for Bel Ombre, Mahé, Seychelles
    draw.text((400, 410), "4.6097° S", font=font_coords,
              fill=(255, 255, 255), anchor="mm", stroke_width=1, stroke_fill=(0, 0, 0))
    draw.text((400, 460), "55.4263° E", font=font_coords,
              fill=(255, 255, 255), anchor="mm", stroke_width=1, stroke_fill=(0, 0, 0))

    # Location name
    draw.text((400, 510), "Northwest Mahé", font=font_small,
              fill=(150, 150, 150), anchor="mm")

    # GPS accuracy indicator
    draw.text((400, 540), "Accuracy: ±5 meters", font=font_small,
              fill=(0, 200, 100), anchor="mm")

    # Save
    img.save(os.path.join(OUTPUT_DIR, "nft_20_layer_1.png"), 'PNG')
    print("+ NFT #20 coordinates overlay created")

# Main execution
print("\n" + "="*60)
print("CREATING BEL OMBRE PUZZLE OVERLAYS")
print("="*60)
print("Puzzle Solution: BEL OMBRE")
print("Cipher: CFM PNCSF (shift +1)")
print("Decode: Shift back one letter")
print("Location: Northwest Mahé, Seychelles")
print("="*60 + "\n")

# Create all overlays
create_cipher_overlay()
create_map_overlay()
create_decoding_overlay()
create_coordinates_overlay()

print("\n" + "="*60)
print("ALL OVERLAYS CREATED SUCCESSFULLY!")
print("="*60)
print("\nHow the puzzle works:")
print("1. NFT #5 shows: CFM PNCSF")
print("2. NFT #17 says: Shift back one letter")
print("3. Decode: C→B, F→E, M→L, P→O, N→M, C→B, S→R, F→E = BEL OMBRE")
print("4. NFT #12: Map shows Bel Ombre marked on Mahé")
print("5. NFT #20: GPS coordinates confirm location")
print("="*60)