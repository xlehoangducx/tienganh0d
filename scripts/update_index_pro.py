# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update Title & Meta
c = c.replace(
    '<title>OmniLang AI - Nền Tảng Tái Lập Trình Phản Xạ Ngôn Ngữ Đa Năng Bằng Khoa Học Não Bộ & AI</title>',
    '<title>OmniLang AI - Phương Pháp Học Ngôn Ngữ Đúc Kết Từ Khoa Học Não Bộ & Ngôn Ngữ Thực Nghiệm</title>'
)

# 2. Add Floating Badges CSS in <head>
floating_css = '''
  <style>
    @keyframes floatGentle {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(1deg); }
    }
    .floating-badge {
      animation: floatGentle 5s ease-in-out infinite;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(16, 185, 129, 0.2);
    }
    .badge-slow { animation-duration: 6.5s; }
    .badge-med { animation-duration: 5s; }
    .badge-fast { animation-duration: 4s; }
  </style>
</head>'''

if '</head>' in c and 'floatGentle' not in c:
    c = c.replace('</head>', floating_css)

# 3. Update Navbar: Remove Coffee button from header, make Primary Action "Chọn Ngôn Ngữ & Lộ Trình" -> tracks.html
old_nav_actions = '''      <!-- Actions -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <button onclick="openDonateModal()" class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-850 hover:bg-slate-800 text-amber-300 border border-amber-500/25 transition">
          <span>☕</span>
          <span class="hidden sm:inline">Mời Cà Phê</span>
        </button>

        <button id="btnGoogleLogin"'''

new_nav_actions = '''      <!-- Actions -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <a href="tracks.html" class="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800/90 hover:bg-slate-750 text-cyan-300 hover:text-white border border-cyan-500/30 transition shadow-lg shadow-cyan-950/30 cursor-pointer">
          <i data-lucide="compass" class="w-4 h-4 text-cyan-400"></i>
          <span>Chọn Ngôn Ngữ & Lộ Trình</span>
        </a>

        <button id="btnGoogleLogin"'''

if old_nav_actions in c:
    c = c.replace(old_nav_actions, new_nav_actions)
    print("Updated Navbar actions!")
else:
    print("old_nav_actions not found in index.html")

# 4. Insert Floating Tags right after <main class="flex-grow relative z-10">
floating_tags_html = '''  <main class="flex-grow relative z-10">

    <!-- FLOATING LANGUAGE TAGS (LEFT & RIGHT) -->
    <div class="hidden xl:block pointer-events-none select-none">
      <!-- Left Side Badges -->
      <div class="fixed left-5 top-28 z-20 flex flex-col gap-3.5">
        <div class="floating-badge badge-slow px-3 py-1.5 rounded-xl bg-slate-900/85 border border-emerald-500/40 text-emerald-300 font-mono text-xs backdrop-blur flex items-center space-x-2">
          <span class="text-sm">🇺🇸</span>
          <span class="font-bold">English First</span>
        </div>
        <div class="floating-badge badge-med px-3 py-1.5 rounded-xl bg-slate-900/85 border border-cyan-500/40 text-cyan-300 font-mono text-xs backdrop-blur flex items-center space-x-2" style="animation-delay: 1.2s">
          <span>👅 Khẩu hình âm /θ/</span>
        </div>
        <div class="floating-badge badge-fast px-3 py-1.5 rounded-xl bg-slate-900/85 border border-amber-500/40 text-amber-300 font-mono text-xs backdrop-blur flex items-center space-x-2" style="animation-delay: 2.5s">
          <span>📚 3.000 Chunks Cốt Lõi</span>
        </div>
        <div class="floating-badge badge-slow px-3 py-1.5 rounded-xl bg-slate-900/85 border border-purple-500/40 text-purple-300 font-mono text-xs backdrop-blur flex items-center space-x-2" style="animation-delay: 3.8s">
          <span>🧠 Vỏ não dài hạn</span>
        </div>
      </div>

      <!-- Right Side Badges -->
      <div class="fixed right-5 top-32 z-20 flex flex-col gap-3.5">
        <div class="floating-badge badge-med px-3 py-1.5 rounded-xl bg-slate-900/85 border border-emerald-500/40 text-emerald-300 font-mono text-xs backdrop-blur flex items-center space-x-2" style="animation-delay: 0.7s">
          <span class="text-sm">🇻🇳</span>
          <span class="font-bold">Tiếng Việt</span>
        </div>
        <div class="floating-badge badge-slow px-3 py-1.5 rounded-xl bg-slate-900/85 border border-cyan-500/40 text-cyan-300 font-mono text-xs backdrop-blur flex items-center space-x-2" style="animation-delay: 1.9s">
          <span>⚡ Phản xạ 7 lần lặp</span>
        </div>
        <div class="floating-badge badge-fast px-3 py-1.5 rounded-xl bg-slate-900/85 border border-indigo-500/40 text-indigo-300 font-mono text-xs backdrop-blur flex items-center space-x-2" style="animation-delay: 3.1s">
          <span>🎯 Cắt bỏ dịch thầm</span>
        </div>
        <div class="floating-badge badge-slow px-3 py-1.5 rounded-xl bg-slate-900/85 border border-teal-500/40 text-teal-300 font-mono text-xs backdrop-blur flex items-center space-x-2" style="animation-delay: 4.4s">
          <span>🎙️ Đa giác quan 6 trong 1</span>
        </div>
      </div>
    </div>'''

if '  <main class="flex-grow relative z-10">' in c and 'FLOATING LANGUAGE TAGS' not in c:
    c = c.replace('  <main class="flex-grow relative z-10">', floating_tags_html)
    print("Inserted Floating Language Tags!")

# 5. Update Hero Section: Realistic headline, scientifically grounded text
old_hero_badge = '<span>Khoa Học Huấn Luyện Ngôn Ngữ AI • Tái Lập Trình Não Bộ Con Người</span>'
new_hero_badge = '<span>🔬 ĐÚC KẾT TỪ NGHIÊN CỨU KHOA HỌC NÃO BỘ & NGÔN NGỮ HỌC THỰC NGHIỆM</span>'
c = c.replace(old_hero_badge, new_hero_badge)

old_hero_title = '''        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Học Tiếng Anh Từ Số 0<br/>
          <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Bằng Bản Năng Huấn Luyện Của AI
          </span>
        </h1>'''

new_hero_title = '''        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Phương Pháp Học Ngôn Ngữ Từ Số 0<br/>
          <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Được AI Đúc Kết Từ Các Nghiên Cứu Khoa Học Đã Kiểm Chứng
          </span>
        </h1>'''
c = c.replace(old_hero_title, new_hero_title)

old_hero_desc = '''        <p class="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
          Không nhồi ngữ pháp công thức. Không dịch thầm trung gian. Mô phỏng 100% cách mô hình trí tuệ nhân tạo Gemini hấp thụ ngôn ngữ: từ <strong>Đồng bộ âm vị</strong> → <strong>Không gian ngữ nghĩa trực tiếp</strong> → <strong>Cụm từ đời thực (Chunks)</strong> → <strong>Căn chỉnh phản xạ tự nhiên (RLHF)</strong>.
        </p>'''

new_hero_desc = '''        <p class="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
          Không nhồi nhét quy tắc ngữ pháp khô khan. Không dịch nhẩm trong đầu. Mô hình tiếp thu ngôn ngữ tự nhiên: từ <strong>Đồng bộ âm vị & cơ miệng</strong> → <strong>Không gian ngữ nghĩa & 3.000 Chunks đời thực (GS. Paul Nation)</strong> → <strong>Cố định nơ-ron dài hạn qua quy tắc 7 lần lặp ngắt quãng đa giác quan (Dual-Coding Theory)</strong>.
        </p>'''
c = c.replace(old_hero_desc, new_hero_desc)

# 6. Hero CTA buttons
old_hero_buttons = '''        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#languageMatrixSection" class="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer">
            <i data-lucide="compass" class="w-5 h-5"></i>
            <span>Khám Phá Lộ Trình & Chọn Ngôn Ngữ</span>
          </a>
          <a href="#scientificEvidenceSection" class="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 px-6 py-3.5 rounded-xl font-semibold transition text-sm sm:text-base cursor-pointer">
            <i data-lucide="microscope" class="w-4 h-4 text-cyan-400"></i>
            <span>Xem Căn Cứ Khoa Học</span>
          </a>
          <button onclick="openDonateModal()" class="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900/60 hover:bg-slate-800 text-amber-300 border border-amber-500/25 px-5 py-3.5 rounded-xl font-semibold transition text-sm sm:text-base cursor-pointer">
            <span>☕</span>
            <span>Mời Cà Phê</span>
          </button>
        </div>'''

new_hero_buttons = '''        <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <a href="tracks.html" class="w-full sm:w-auto flex items-center justify-center space-x-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition hover:scale-[1.03] active:scale-95 text-sm sm:text-base cursor-pointer">
            <i data-lucide="play" class="w-5 h-5 fill-current"></i>
            <span>Khám Phá Lộ Trình & Bắt Đầu Học</span>
          </a>
          <a href="#scientificEvidenceSection" class="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 px-6 py-4 rounded-2xl font-bold transition text-sm sm:text-base cursor-pointer">
            <i data-lucide="microscope" class="w-4 h-4 text-cyan-400"></i>
            <span>Xem Bằng Chứng Khoa Học</span>
          </a>
        </div>'''
c = c.replace(old_hero_buttons, new_hero_buttons)

# 7. Update Scientific Evidence Title: Remove "10 năm"
c = c.replace(
    '<h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">Vì Sao Bạn Học Tiếng Anh 10 Năm Vẫn Chưa Nói Được?</h2>',
    '<h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">Khác Biệt Cốt Lõi: Vì Sao Học Ngữ Pháp Rời Rạc Khiến Bạn Khó Mở Miệng?</h2>'
)
c = c.replace(
    '<p class="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">Sự đối lập giữa phương pháp học truyền thống bị nghẽn nơ-ron và cơ chế tiếp nhận ngôn ngữ thần tốc của Trí tuệ Nhân tạo</p>',
    '<p class="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">Sự đối lập giữa phương pháp nhồi nhét công thức tách rời và cơ chế tiếp nhận ngôn ngữ tự nhiên được khoa học não bộ chứng minh</p>'
)

with open('d:/WEB_HOC_TIENG_ANH_AI/index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("index.html successfully updated!")
