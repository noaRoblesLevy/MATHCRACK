from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs(r'C:\Users\noaro\MATHCRACK\public\icons', exist_ok=True)

BG    = (4, 8, 17)       # --bg-deep
BLUE  = (96, 165, 250)   # --blue
WHITE = (228, 236, 255)  # --text

def make_icon(size):
    img = Image.new('RGB', (size, size), BG)
    d = ImageDraw.Draw(img)

    # Outer ring
    ring = size * 0.06
    d.ellipse([ring, ring, size - ring, size - ring],
              outline=BLUE, width=max(2, int(size * 0.03)))

    # "MC" text — scale with size
    font_size = int(size * 0.38)
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", font_size)
    except Exception:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/cour.ttf", font_size)
        except Exception:
            font = ImageFont.load_default()

    text = "MC"
    bbox = d.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1]

    # Blue glow shadow
    for dx, dy in [(-2,0),(2,0),(0,-2),(0,2)]:
        d.text((x+dx, y+dy), text, font=font, fill=(30, 70, 140))
    d.text((x, y), text, font=font, fill=WHITE)

    return img

for size, fname in [(512, 'icon-512.png'), (192, 'icon-192.png'), (180, 'apple-touch-icon.png')]:
    img = make_icon(size)
    path = fr'C:\Users\noaro\MATHCRACK\public\icons\{fname}'
    img.save(path)
    print(f'  {fname} ({size}x{size})')

print('Done.')
