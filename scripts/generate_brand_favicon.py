import os
import math
from PIL import Image, ImageDraw

# Thư mục đích
REPO_DIR = r"D:\WEB_HOC_TIENG_ANH_AI"
IMAGES_DIR = os.path.join(REPO_DIR, "assets", "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

# 1. Tạo file SVG Logo & Favicon chuẩn vector sắc nét
svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <defs>
    <!-- Gradient nền Emerald - Cyan đặc trưng của Gia Sư Của Tui -->
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="55%" stop-color="#059669" />
      <stop offset="100%" stop-color="#0891b2" />
    </linearGradient>
    
    <!-- Ánh vàng kim cho tua mũ và ngôi sao trí tuệ AI -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <!-- Đổ bóng nổi khối 3D cho biểu tượng -->
    <filter id="iconShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#022c22" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Khối nền Squircle bo góc công nghệ (Apple style) -->
  <rect x="2" y="2" width="60" height="60" rx="15" ry="15" fill="url(#brandGrad)" />
  <rect x="2" y="2" width="60" height="60" rx="15" ry="15" fill="none" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.2" />

  <!-- Biểu tượng Gia Sư: Mũ Cử Nhân Tri Thức (Academic Tutor Cap) -->
  <g filter="url(#iconShadow)">
    <!-- Thân vòm mũ cử nhân (Band & Skullcap) -->
    <path d="M17 33.5 v7.5 c0 6.5 15 9.5 15 9.5 s15 -3 15 -9.5 v-7.5" 
          fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Mặt trên mũ hình thoi (Mortarboard top diamond) -->
    <polygon points="32,15 56,26.5 32,38 8,26.5" 
             fill="#ffffff" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round" />

    <!-- Dây tua mũ buông rủ bên phải (Tassel cord) -->
    <path d="M32 26.5 Q46 25 54 27.5 v14.5" 
          fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Hạt nút chóp mũ -->
    <circle cx="32" cy="26.5" r="2.5" fill="url(#goldGrad)" />
    
    <!-- Quả chuông tua mũ -->
    <circle cx="54" cy="43" r="2.5" fill="url(#goldGrad)" />
  </g>

  <!-- Ngôi sao dẫn đường Trí Tuệ Nhân Tạo (AI Sparkle) ở góc trên -->
  <path d="M49 9.5 Q49 14.5 54 14.5 Q49 14.5 49 19.5 Q49 14.5 44 14.5 Q49 14.5 49 9.5 Z" 
        fill="url(#goldGrad)" />
</svg>
'''

# Lưu file SVG vào root và assets/images
svg_path_root = os.path.join(REPO_DIR, "favicon.svg")
svg_path_assets = os.path.join(IMAGES_DIR, "favicon.svg")
logo_svg_assets = os.path.join(IMAGES_DIR, "logo.svg")

with open(svg_path_root, "w", encoding="utf-8") as f:
    f.write(svg_content)
with open(svg_path_assets, "w", encoding="utf-8") as f:
    f.write(svg_content)
with open(logo_svg_assets, "w", encoding="utf-8") as f:
    f.write(svg_content)

print(f"Đã tạo {svg_path_root}")
print(f"Đã tạo {svg_path_assets}")
print(f"Đã tạo {logo_svg_assets}")

# 2. Tạo hình ảnh PNG đa độ phân giải & file ICO bằng Pillow
def draw_brand_icon(size):
    # Vẽ ở tỷ lệ lớn hơn (super-sampling x4) rồi scale down để khử răng cưa
    scale = 4
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    
    factor = s / 64.0
    margin = int(2 * factor)
    radius = int(15 * factor)
    
    # Tạo ảnh nền gradient
    grad = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grad)
    for y in range(s):
        t = y / s
        r = int(16 * (1 - t) + 8 * t)
        g = int(185 * (1 - t) + 145 * t)
        b = int(129 * (1 - t) + 178 * t)
        g_draw.line([(0, y), (s, y)], fill=(r, g, b, 255))
        
    # Mask bo góc
    mask = Image.new("L", (s, s), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle([margin, margin, s - margin, s - margin], radius=radius, fill=255)
    
    # Ghép nền gradient qua mask
    img.paste(grad, (0, 0), mask)
    
    # Viền sáng mỏng
    border_draw = ImageDraw.Draw(img)
    border_draw.rounded_rectangle([margin, margin, s - margin, s - margin], radius=radius, outline=(255, 255, 255, 65), width=max(1, int(1.2 * factor)))

    # Vẽ Mũ Cử Nhân (Graduation Cap)
    # Vòm mũ bên dưới (Thân mũ)
    arc_box = [int(17 * factor), int(26 * factor), int(47 * factor), int(51 * factor)]
    border_draw.arc(arc_box, start=0, end=180, fill=(255, 255, 255, 255), width=max(2, int(3.5 * factor)))
    
    # Mặt trên mũ (Mortarboard diamond)
    diamond = [
        (int(32 * factor), int(15 * factor)),
        (int(56 * factor), int(26.5 * factor)),
        (int(32 * factor), int(38 * factor)),
        (int(8 * factor), int(26.5 * factor))
    ]
    border_draw.polygon(diamond, fill=(255, 255, 255, 255))

    # Nút chóp mũ (Vàng kim)
    cx, cy = int(32 * factor), int(26.5 * factor)
    br = max(2, int(2.5 * factor))
    border_draw.ellipse([cx - br, cy - br, cx + br, cy + br], fill=(245, 158, 11, 255))

    # Dây tua mũ bên phải
    tassel_points = [
        (int(32 * factor), int(26.5 * factor)),
        (int(46 * factor), int(25 * factor)),
        (int(54 * factor), int(27.5 * factor)),
        (int(54 * factor), int(43 * factor))
    ]
    border_draw.line(tassel_points, fill=(245, 158, 11, 255), width=max(1, int(2.5 * factor)), joint="curve")
    
    # Quả chuông tua mũ
    tx, ty = int(54 * factor), int(43 * factor)
    border_draw.ellipse([tx - br, ty - br, tx + br, ty + br], fill=(245, 158, 11, 255))

    # Ngôi sao AI vàng ở góc trên
    sx, sy = int(49 * factor), int(14.5 * factor)
    sr = int(5 * factor)
    star_points = [
        (sx, sy - sr),
        (sx + int(sr*0.3), sy - int(sr*0.3)),
        (sx + sr, sy),
        (sx + int(sr*0.3), sy + int(sr*0.3)),
        (sx, sy + sr),
        (sx - int(sr*0.3), sy + int(sr*0.3)),
        (sx - sr, sy),
        (sx - int(sr*0.3), sy - int(sr*0.3))
    ]
    border_draw.polygon(star_points, fill=(253, 224, 71, 255))

    # Thu nhỏ về đúng kích thước với bộ lọc Lanczos chất lượng cao
    return img.resize((size, size), Image.Resampling.LANCZOS)

# Xuất file PNG
icon_128 = draw_brand_icon(128)
icon_128.save(os.path.join(IMAGES_DIR, "logo-128.png"))
icon_192 = draw_brand_icon(192)
icon_192.save(os.path.join(IMAGES_DIR, "icon-192.png"))
icon_512 = draw_brand_icon(512)
icon_512.save(os.path.join(IMAGES_DIR, "icon-512.png"))

# Xuất file ICO (Gồm 16x16, 32x32, 48x48, 64x64)
sizes = [16, 32, 48, 64]
ico_images = [draw_brand_icon(sz) for sz in sizes]
ico_path_root = os.path.join(REPO_DIR, "favicon.ico")
ico_images[0].save(ico_path_root, format="ICO", sizes=[(s, s) for s in sizes], append_images=ico_images[1:])

print(f"Đã tạo {ico_path_root} với các kích thước 16, 32, 48, 64")
print("Hoàn tất tạo bộ nhận diện thương hiệu!")
