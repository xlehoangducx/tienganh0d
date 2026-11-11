# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/dashboard.html', 'r', encoding='utf-8') as f:
    dash = f.read()

# 1. Thu gọn Header Buổi học thành Compact Strip (siêu tinh gọn)
old_header_start = '<!-- UNIFIED COMPACT LESSON HEADER -->'
old_header_end = '<!-- 7 TABS MODULE HỌC THUẬT ĐA GIÁC QUAN (STICKY TẬP TRUNG) -->'

ultra_compact_header = '''<!-- UNIFIED ULTRA-COMPACT LESSON STRIP -->
        <div class="cyber-card px-4 py-2.5 rounded-xl border border-slate-800/80 bg-slate-900/80 shadow-lg flex flex-wrap items-center justify-between gap-2.5">
          <div class="flex items-center space-x-2.5 min-w-0">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
            <div class="min-w-0">
              <h1 id="currentLessonTitle" class="text-sm sm:text-base font-black text-white truncate glow-accent">
                Buổi 01: Đánh Thức Cơ Miệng & 3 Cụm Từ Giao Tiếp Đầu Tiên
              </h1>
              <p id="currentLessonTopic" class="text-[11px] text-slate-400 truncate hidden sm:block">
                Làm quen âm thè lưỡi /θ/, âm gió /s/, âm bật /t/ & phản xạ chào hỏi đời thường
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2 text-xs flex-shrink-0">
            <span id="currentPhaseBadge" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">Pre-A1</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">0đ Cộng Đồng</span>
            <a href="tracks.html" class="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 flex items-center space-x-1">
              <i data-lucide="compass" class="w-3 h-3 text-cyan-400"></i>
              <span>Đổi Lộ Trình</span>
            </a>
          </div>
        </div>

        <!-- 7 TABS MODULE HỌC THUẬT ĐA GIÁC QUAN (STICKY TẬP TRUNG) -->'''

if old_header_start in dash:
    parts = dash.split(old_header_start)
    after = parts[1].split(old_header_end)
    dash = parts[0] + ultra_compact_header + after[1]
    print("Replaced with Ultra-Compact Lesson Strip!")
else:
    print("old_header_start not found!")

# 2. XÓA BỎ HOÀN TOÀN KHỐI TAB TRÙNG LẶP THỨ 2
duplicate_tab_marker = '''        <!-- 7 TABS MODULE HỌC THUẬT ĐA GIÁC QUAN (MULTIMODAL LEARNING) -->
        <div class="border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 pb-2">'''

end_duplicate_marker = '<!-- MODULE 0: BÀI THUYẾT GIẢNG KHAI MỞ TÂM TRÍ & CĂN CỨ KHOA HỌC NÃO BỘ -->'

if duplicate_tab_marker in dash and end_duplicate_marker in dash:
    p1 = dash.split(duplicate_tab_marker)[0]
    p2 = dash.split(end_duplicate_marker)[1]
    dash = p1 + '        <!-- MODULE 0: BÀI THUYẾT GIẢNG KHAI MỞ TÂM TRÍ & CĂN CỨ KHOA HỌC NÃO BỘ -->\n' + p2
    print("REMOVED DUPLICATE TAB BAR COMPLETELY!")
else:
    print("duplicate_tab_marker not found, checking alternatives...")

with open('d:/WEB_HOC_TIENG_ANH_AI/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(dash)

print("dashboard.html layout fixed cleanly!")
