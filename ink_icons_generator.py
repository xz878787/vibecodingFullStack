import struct
import zlib
import os

GREEN_SCREEN_COLOR = (0, 255, 0)
ICON_SIZE = 128
PADDING = 20
GRID_SIZE = 2
OUTPUT_DIR = "ink_icons"

def png_chunk(chunk_type, data):
    length = struct.pack(">I", len(data))
    chunk_data = chunk_type.encode('ascii') + data
    crc = struct.pack(">I", zlib.crc32(chunk_data) & 0xffffffff)
    return length + chunk_data + crc

def create_png(width, height, pixels):
    signature = b'\x89PNG\r\n\x1a\n'
    
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    ihdr_chunk = png_chunk('IHDR', ihdr)
    
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'
        for x in range(width):
            r, g, b, a = pixels[y][x]
            raw_data += bytes([r, g, b, a])
    
    compressed = zlib.compress(raw_data)
    idat_chunk = png_chunk('IDAT', compressed)
    
    iend_chunk = png_chunk('IEND', b'')
    
    return signature + ihdr_chunk + idat_chunk + iend_chunk

def draw_line(pixels, x1, y1, x2, y2, color):
    dx = abs(x2 - x1)
    dy = abs(y2 - y1)
    sx = 1 if x1 < x2 else -1
    sy = 1 if y1 < y2 else -1
    err = dx - dy
    
    while True:
        if 0 <= x1 < ICON_SIZE and 0 <= y1 < ICON_SIZE:
            pixels[y1][x1] = color
        if x1 == x2 and y1 == y2:
            break
        e2 = 2 * err
        if e2 > -dy:
            err -= dy
            x1 += sx
        if e2 < dx:
            err += dx
            y1 += sy

def draw_circle(pixels, cx, cy, radius, color):
    x = -radius
    y = 0
    err = 2 - 2 * radius
    
    while x <= 0:
        if 0 <= cx + x < ICON_SIZE and 0 <= cy + y < ICON_SIZE:
            pixels[cy + y][cx + x] = color
        if 0 <= cx + x < ICON_SIZE and 0 <= cy - y < ICON_SIZE:
            pixels[cy - y][cx + x] = color
        if 0 <= cx - x < ICON_SIZE and 0 <= cy + y < ICON_SIZE:
            pixels[cy + y][cx - x] = color
        if 0 <= cx - x < ICON_SIZE and 0 <= cy - y < ICON_SIZE:
            pixels[cy - y][cx - x] = color
        
        e2 = err
        if e2 <= y:
            y += 1
            err += y * 2 + 1
        if e2 > x:
            x += 1
            err += x * 2 + 1

def draw_icon_home(pixels, cx, cy, size):
    half = size // 2
    draw_line(pixels, cx, cy - half, cx - half, cy + half//2, (50, 50, 50, 255))
    draw_line(pixels, cx+1, cy - half, cx - half + 1, cy + half//2, (30, 30, 30, 255))
    draw_line(pixels, cx, cy - half, cx + half, cy + half//2, (50, 50, 50, 255))
    draw_line(pixels, cx+1, cy - half, cx + half + 1, cy + half//2, (30, 30, 30, 255))
    draw_line(pixels, cx - half, cy + half//2, cx + half, cy + half//2, (50, 50, 50, 255))
    draw_line(pixels, cx - half, cy + half//2 + 1, cx + half, cy + half//2 + 1, (30, 30, 30, 255))
    
    for i in range(2):
        draw_line(pixels, cx - half + 4, cy + half//2 + i, cx + half, cy + half//2 + i, (50, 50, 50, 255))
        draw_line(pixels, cx - half + 4, cy + half + i, cx + half, cy + half + i, (50, 50, 50, 255))
        draw_line(pixels, cx - half + 4 + i, cy + half//2, cx - half + 4 + i, cy + half, (50, 50, 50, 255))
        draw_line(pixels, cx + half + i, cy + half//2, cx + half + i, cy + half, (50, 50, 50, 255))

def draw_icon_search(pixels, cx, cy, size):
    draw_circle_helper(pixels, cx, cy, size//2)
    draw_line(pixels, cx + size//2 + 5, cy - size//2 - 5, cx + size//2 + 15, cy - size//2 - 15, (50, 50, 50, 255))
    draw_line(pixels, cx + size//2 + 6, cy - size//2 - 5, cx + size//2 + 16, cy - size//2 - 15, (30, 30, 30, 255))

def draw_circle_helper(pixels, cx, cy, radius):
    for r in range(radius-1, radius+2):
        draw_circle(pixels, cx, cy, r, (50, 50, 50, 255))
        draw_circle(pixels, cx+1, cy, r, (30, 30, 30, 200))

def draw_icon_user(pixels, cx, cy, size):
    draw_circle_helper(pixels, cx, cy - size//4, size//3)
    draw_line(pixels, cx - size//3, cy, cx + size//3, cy, (50, 50, 50, 255))
    draw_line(pixels, cx - size//3, cy + 1, cx + size//3, cy + 1, (30, 30, 30, 255))
    draw_line(pixels, cx, cy, cx, cy + size//2, (50, 50, 50, 255))
    draw_line(pixels, cx + 1, cy, cx + 1, cy + size//2, (30, 30, 30, 255))
    draw_line(pixels, cx, cy + size//4, cx - size//3, cy + size//2, (50, 50, 50, 255))
    draw_line(pixels, cx, cy + size//4, cx + size//3, cy + size//2, (50, 50, 50, 255))

def draw_icon_settings(pixels, cx, cy, size):
    draw_circle_helper(pixels, cx, cy, size//2)
    import math
    for i in range(3):
        angle = i * 120 * math.pi / 180
        rx = int(cx + (size//2 + 8) * math.cos(angle))
        ry = int(cy + (size//2 + 8) * math.sin(angle))
        draw_circle(pixels, rx, ry, 4, (50, 50, 50, 255))

def draw_icon_heart(pixels, cx, cy, size):
    import math
    half = size // 2
    points = []
    for i in range(40):
        t = i * math.pi / 19
        x = int(cx + half * 16 * math.sin(t)**3 * 0.6)
        y = int(cy - half * (13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t)) * 0.25)
        points.append((x, y))
    
    for i in range(len(points)-1):
        draw_line(pixels, points[i][0], points[i][1], points[i+1][0], points[i+1][1], (50, 50, 50, 255))

def draw_icon_star(pixels, cx, cy, size):
    import math
    half = size // 2
    points = []
    for i in range(5):
        angle = i * 72 * math.pi / 180 - math.pi / 2
        x = int(cx + half * math.cos(angle))
        y = int(cy + half * math.sin(angle))
        points.append((x, y))
    
    for i in range(5):
        draw_line(pixels, points[i][0], points[i][1], points[(i+2)%5][0], points[(i+2)%5][1], (50, 50, 50, 255))
        draw_line(pixels, points[i][0]+1, points[i][1], points[(i+2)%5][0]+1, points[(i+2)%5][1], (30, 30, 30, 255))

def draw_icon_mail(pixels, cx, cy, size):
    half = size // 2
    draw_line(pixels, cx - half, cy - half, cx, cy, (50, 50, 50, 255))
    draw_line(pixels, cx + half, cy - half, cx, cy, (50, 50, 50, 255))
    draw_line(pixels, cx - half, cy - half, cx - half, cy + half, (50, 50, 50, 255))
    draw_line(pixels, cx + half, cy - half, cx + half, cy + half, (50, 50, 50, 255))
    draw_line(pixels, cx - half, cy + half, cx + half, cy + half, (50, 50, 50, 255))

def draw_icon_download(pixels, cx, cy, size):
    half = size // 2
    draw_line(pixels, cx - half, cy - half, cx + half, cy - half, (50, 50, 50, 255))
    draw_line(pixels, cx - half, cy - half, cx, cy + half, (50, 50, 50, 255))
    draw_line(pixels, cx + half, cy - half, cx, cy + half, (50, 50, 50, 255))
    draw_line(pixels, cx, cy + half - 10, cx, cy + half + 5, (50, 50, 50, 255))

def create_ink_icon(icon_type, green_background=True):
    if green_background:
        pixels = [[GREEN_SCREEN_COLOR + (255,) for _ in range(ICON_SIZE)] for _ in range(ICON_SIZE)]
    else:
        pixels = [[(0, 0, 0, 0) for _ in range(ICON_SIZE)] for _ in range(ICON_SIZE)]
    
    cx = ICON_SIZE // 2
    cy = ICON_SIZE // 2
    size = ICON_SIZE - 30
    
    icon_functions = {
        'home': draw_icon_home,
        'search': draw_icon_search,
        'user': draw_icon_user,
        'settings': draw_icon_settings,
        'heart': draw_icon_heart,
        'star': draw_icon_star,
        'mail': draw_icon_mail,
        'download': draw_icon_download
    }
    
    if icon_type in icon_functions:
        icon_functions[icon_type](pixels, cx, cy, size)
    
    return pixels

def green_screen_remove(pixels):
    result = []
    for row in pixels:
        new_row = []
        for pixel in row:
            r, g, b, a = pixel
            if r == GREEN_SCREEN_COLOR[0] and g == GREEN_SCREEN_COLOR[1] and b == GREEN_SCREEN_COLOR[2]:
                new_row.append((0, 0, 0, 0))
            else:
                new_row.append(pixel)
        result.append(new_row)
    return result

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    icon_names = ['home', 'search', 'user', 'settings', 'heart', 'star', 'mail', 'download']
    
    preview_width = GRID_SIZE * (ICON_SIZE + PADDING) + PADDING
    preview_height = (len(icon_names) // GRID_SIZE) * (ICON_SIZE + PADDING) + PADDING
    
    preview_pixels = [[GREEN_SCREEN_COLOR + (255,) for _ in range(preview_width)] for _ in range(preview_height)]
    
    for i, name in enumerate(icon_names):
        icon = create_ink_icon(name, green_background=True)
        x = PADDING + (i % GRID_SIZE) * (ICON_SIZE + PADDING)
        y = PADDING + (i // GRID_SIZE) * (ICON_SIZE + PADDING)
        
        for dy in range(ICON_SIZE):
            for dx in range(ICON_SIZE):
                preview_pixels[y + dy][x + dx] = icon[dy][dx]
        
        icon_without_bg = green_screen_remove(icon)
        png_data = create_png(ICON_SIZE, ICON_SIZE, icon_without_bg)
        with open(os.path.join(OUTPUT_DIR, f'{name}.png'), 'wb') as f:
            f.write(png_data)
        print(f'Generated: {name}.png')
    
    png_data = create_png(preview_width, preview_height, preview_pixels)
    with open('ink_icons_preview.png', 'wb') as f:
        f.write(png_data)
    print('Generated preview: ink_icons_preview.png')
    print(f'Transparent icons saved to: {OUTPUT_DIR}')

if __name__ == '__main__':
    main()
