"""
Add dark semi-transparent backdrop to puzzle overlay layers
Makes text readable against any background color
"""

from PIL import Image, ImageDraw
import os

# Paths
layers_dir = r"C:\Users\andre\The Levasseur Treasure of Seychelles\content\treasure_hunt_chapter1\layers"

# List of overlay files
overlay_files = [
    "nft_5_layer_1.png",   # Cipher text
    "nft_12_layer_2.png",  # Map fragment
    "nft_17_layer_3.png",  # Decoding key
    "nft_20_layer_1.png"   # Coordinates
]

def add_dark_backdrop(image_path):
    """Add a dark semi-transparent backdrop behind the overlay content"""

    # Open the original overlay
    overlay = Image.open(image_path).convert('RGBA')
    width, height = overlay.size

    print(f"Processing {os.path.basename(image_path)}...")
    print(f"  Original size: {width}x{height}")

    # Create a new image with the same size
    result = Image.new('RGBA', (width, height), (0, 0, 0, 0))

    # Find the bounding box of non-transparent pixels
    bbox = overlay.getbbox()

    if bbox:
        # Add padding around the content
        padding = 40
        x1 = max(0, bbox[0] - padding)
        y1 = max(0, bbox[1] - padding)
        x2 = min(width, bbox[2] + padding)
        y2 = min(height, bbox[3] + padding)

        print(f"  Content bbox: {bbox}")
        print(f"  Backdrop bbox: ({x1}, {y1}, {x2}, {y2})")

        # Create backdrop layer
        backdrop = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(backdrop)

        # Draw dark semi-transparent rectangle with rounded corners
        # Black at 75% opacity (rgba: 0, 0, 0, 192)
        draw.rectangle(
            [x1, y1, x2, y2],
            fill=(0, 0, 0, 192),  # 75% opacity black
            outline=(40, 40, 40, 200),  # Slightly lighter border
            width=2
        )

        # Composite: backdrop first, then original overlay on top
        result = Image.alpha_composite(backdrop, overlay)

        print(f"  [OK] Added backdrop")
    else:
        # No content found, keep original
        result = overlay
        print(f"  [WARN] No content detected, keeping original")

    # Save the result (backup original first)
    backup_path = image_path.replace('.png', '_original.png')
    if not os.path.exists(backup_path):
        overlay.save(backup_path)
        print(f"  [BACKUP] Original saved to: {os.path.basename(backup_path)}")

    result.save(image_path)
    print(f"  [SAVED] Enhanced overlay saved\n")

def main():
    print("Adding dark backdrops to puzzle overlay layers...\n")
    print("=" * 60)

    for filename in overlay_files:
        filepath = os.path.join(layers_dir, filename)

        if os.path.exists(filepath):
            try:
                add_dark_backdrop(filepath)
            except Exception as e:
                print(f"[ERROR] Error processing {filename}: {e}\n")
        else:
            print(f"[WARN] File not found: {filename}\n")

    print("=" * 60)
    print("[SUCCESS] All overlays processed!")
    print("\nOriginal files backed up with '_original.png' suffix")
    print("Refresh browser to see the changes")

if __name__ == '__main__':
    main()
