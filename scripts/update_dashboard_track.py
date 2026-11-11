# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/dashboard.html', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<title>AI English Hub - Không Gian Học Tập Cá Nhân Chuẩn Khoa Học</title>', '<title>OmniLang AI - Không Gian Học Tập Cá Nhân Chuẩn Khoa Học</title>')
c = c.replace('<span class="font-bold text-base tracking-tight text-white hidden sm:inline">AI English Platform</span>', '<span class="font-bold text-base tracking-tight text-white hidden sm:inline">OmniLang AI</span>')
c = c.replace('<span class="text-[10px] block text-emerald-400 font-mono">Cognitive Learning OS v2.0</span>', '<span class="text-[10px] block text-emerald-400 font-mono">Cognitive Multilingual Hub • English First</span>')

target = '''      <!-- ================= VIEW 1: BÀI HỌC HIỆN TẠI ================= -->
      <div id="curriculumView" class="space-y-6">'''

track_bar = '''      <!-- ================= VIEW 1: BÀI HỌC HIỆN TẠI ================= -->
      <div id="curriculumView" class="space-y-6">

        <!-- TRACK INDICATOR BAR -->
        <div id="trackIndicatorBar" class="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div class="flex items-center space-x-2.5">
            <div id="trackIconBadge" class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/30">
              🟢
            </div>
            <div>
              <div id="trackTitleBadge" class="text-xs font-bold text-white flex items-center space-x-2">
                <span>Lộ Trình: Tiếng Anh Giao Tiếp Đời Thường</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-normal">0đ Miễn Phí Cộng Đồng</span>
              </div>
              <div id="trackSubBadge" class="text-[11px] text-slate-400">
                Khung chuẩn Cambridge & CEFR (Pre-A1 → B2) • 5 Chặng 600 giờ • Không cần Key
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <a href="index.html#languageMatrixSection" class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center space-x-1.5 border border-slate-700/80 cursor-pointer">
              <i data-lucide="compass" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>Đổi Lộ Trình / Chuyên Ngành</span>
            </a>
          </div>
        </div>'''

if target in c:
    c = c.replace(target, track_bar)
    print("Inserted trackIndicatorBar into dashboard.html!")
else:
    print("Target not found in dashboard.html")

with open('d:/WEB_HOC_TIENG_ANH_AI/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(c)

# Update curriculum-data.js
with open('d:/WEB_HOC_TIENG_ANH_AI/js/curriculum-data.js', 'r', encoding='utf-8') as f:
    curr = f.read()

curr = curr.replace('title: "AI English Cognitive System - Nền Tảng Học Tiếng Anh Mô Phỏng Não Bộ AI",', 'title: "OmniLang AI - Nền Tảng Học Tiếng Anh Mô Phỏng Não Bộ AI",')

with open('d:/WEB_HOC_TIENG_ANH_AI/js/curriculum-data.js', 'w', encoding='utf-8') as f:
    f.write(curr)

print("Updated curriculum-data.js title!")
