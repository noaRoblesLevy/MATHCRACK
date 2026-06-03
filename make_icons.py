from PIL import Image, ImageDraw
import os

os.makedirs(r'C:\Users\noaro\MATHCRACK\public\icons', exist_ok=True)

BG_OUTER = (4, 8, 17)
BG_INNER = (12, 26, 46)
BLUE     = (96, 165, 250)
WHITE    = (228, 236, 255)
RING     = (96, 165, 250, 90)   # semi-transparent

def draw_rounded_rect(d, x0, y0, x1, y1, r, fill):
    d.rectangle([x0 + r, y0, x1 - r, y1], fill=fill)
    d.rectangle([x0, y0 + r, x1, y1 - r], fill=fill)
    d.ellipse([x0, y0, x0 + 2*r, y0 + 2*r], fill=fill)
    d.ellipse([x1 - 2*r, y0, x1, y0 + 2*r], fill=fill)
    d.ellipse([x0, y1 - 2*r, x0 + 2*r, y1], fill=fill)
    d.ellipse([x1 - 2*r, y1 - 2*r, x1, y1], fill=fill)

def make_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    r = int(size * 0.22)

    # Background gradient approximation (two rects)
    draw_rounded_rect(d, 0, 0, size, size, r, BG_OUTER)
    draw_rounded_rect(d, size//6, 0, size - size//6, size//2, r, BG_INNER)

    # Ring border
    ring_w = max(2, int(size * 0.025))
    for i in range(ring_w):
        off = i
        dr = ImageDraw.Draw(img)
        # just redraw the outline using lines
    # Draw ring as outline rect
    d.rounded_rectangle([0, 0, size-1, size-1], radius=r,
                         outline=(96, 165, 250, 80), width=ring_w)

    # Lightning bolt — scale vertices to [0,100] -> [0,size]
    s = size / 100
    bolt = [
        (57*s, 8*s),
        (36*s, 52*s),
        (50*s, 52*s),
        (43*s, 92*s),
        (64*s, 48*s),
        (50*s, 48*s),
    ]
    # Glow layer (larger, blurred approximation via multiple draws)
    for expand in [4, 3, 2, 1]:
        glow_bolt = [(x + (x - size/2) * expand * 0.015,
                      y + (y - size/2) * expand * 0.015) for x, y in bolt]
        d.polygon(glow_bolt, fill=(96, 165, 250, max(0, 30 - expand*6)))

    # Main bolt
    d.polygon(bolt, fill=BLUE)

    # Inner highlight
    highlight = [
        (54*s, 16*s),
        (40*s, 50*s),
        (51*s, 50*s),
        (46*s, 80*s),
        (60*s, 50*s),
        (49*s, 50*s),
    ]
    d.polygon(highlight, fill=(228, 236, 255, 60))

    # Convert to RGB for saving as PNG (for non-transparent formats)
    final = Image.new('RGB', (size, size), BG_OUTER)
    final.paste(img, mask=img.split()[3])
    return final

for size, fname in [(512, 'icon-512.png'), (192, 'icon-192.png'), (180, 'apple-touch-icon.png')]:
    img = make_icon(size)
    path = fr'C:\Users\noaro\MATHCRACK\public\icons\{fname}'
    img.save(path)
    print(f'  {fname} ({size}x{size})')

# Also save a small favicon.ico version
fav = make_icon(32)
fav.save(r'C:\Users\noaro\MATHCRACK\public\favicon.ico')
print('  favicon.ico (32x32)')
print('Done.')
