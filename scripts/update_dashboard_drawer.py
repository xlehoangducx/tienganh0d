with open(r'd:\WEB_HOC_TIENG_ANH_AI\dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Top Navbar menu button
old_top_btn = '''        <button onclick="toggleSidebar()" class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer" title="Danh Mục Bài Học">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>'''

new_top_btn = '''        <button onclick="openLanguageDrawer()" class="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer flex items-center space-x-1.5 shadow-sm" title="Chọn Ngôn Ngữ & Phân Khúc Mục Tiêu">
          <i data-lucide="globe" class="w-4 h-4 text-emerald-400"></i>
          <span class="hidden sm:inline text-xs font-bold">Ngôn Ngữ</span>
        </button>'''

if old_top_btn in html:
    html = html.replace(old_top_btn, new_top_btn)
    print("Replaced top nav button")
else:
    print("old_top_btn not found directly, checking regex")

# 2. Update Sidebar Inner Content
old_sidebar_inner_start = '<aside id="curriculumSidebar" class="fixed inset-y-0 left-0 z-50 w-80 sm:w-96 bg-[#080b12]/95 backdrop-blur-2xl border-r border-slate-800 p-5 transform -translate-x-full transition-transform duration-300 shadow-2xl flex flex-col space-y-4">'
old_sidebar_inner_end = '</aside>'

# Find start and end of curriculumSidebar
start_pos = html.find(old_sidebar_inner_start)
end_pos = html.find(old_sidebar_inner_end, start_pos)

if start_pos != -1 and end_pos != -1:
    new_sidebar_html = '''<aside id="curriculumSidebar" class="fixed inset-y-0 left-0 z-50 w-80 sm:w-96 bg-[#080b12]/95 backdrop-blur-2xl border-r border-slate-800 p-5 transform -translate-x-full transition-transform duration-300 shadow-2xl flex flex-col space-y-4">
      
      <!-- Drawer Header with Close Button (Visible on both PC & Mobile) -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <span id="drawerHeaderTitle" class="font-bold text-sm text-white flex items-center space-x-2">
          <i data-lucide="layers" class="w-4 h-4 text-emerald-400"></i>
          <span>Danh Mục Giáo Trình</span>
        </span>
        <button onclick="toggleSidebar(true)" class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer" title="Đóng">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- ================= VIEW 1: CHỌN NGÔN NGỮ & PHÂN KHÚC ================= -->
      <div id="drawerLanguageHubView" class="hidden flex-col space-y-3.5 flex-grow overflow-y-auto pr-1 scrollbar-none">
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <i data-lucide="globe" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span>Chọn Ngôn Ngữ & Mục Tiêu</span>
          </span>
          <span class="text-[10px] font-mono text-cyan-400">OmniLang Hub</span>
        </div>

        <!-- 🇺🇸 TIẾNG ANH (ENGLISH FIRST) -->
        <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-lg space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-lg">🇺🇸</span>
              <div>
                <span class="font-black text-sm text-white">Tiếng Anh (English)</span>
                <span class="text-[10px] block text-emerald-400 font-mono">Đang Học • Live</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active</span>
          </div>

          <!-- Phân khúc 1: Giao Tiếp Đời Thường -->
          <div class="space-y-2 pt-1">
            <button onclick="selectTrackAndOpenCurriculum('communication')" class="w-full p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-left transition flex items-center justify-between group cursor-pointer">
              <div>
                <div class="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                  <span>🟢 Giao Tiếp Đời Thường</span>
                  <span class="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/30 text-emerald-200 font-mono">0đ Miễn Phí</span>
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5">5 Chặng CEFR • 600h • 3.000 Chunks cốt lõi</div>
              </div>
              <i data-lucide="arrow-right" class="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform"></i>
            </button>

            <!-- Phân khúc 2: Tiếng Anh Chuyên Ngành ESP -->
            <button onclick="selectTrackAndOpenCurriculum('esp')" class="w-full p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-left transition flex items-center justify-between group cursor-pointer">
              <div>
                <div class="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                  <span>💼 Chuyên Ngành (ESP)</span>
                  <span class="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono">License Key</span>
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5">IT, Y Khoa, Kinh Doanh, Du Lịch, Logistics</div>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors"></i>
            </button>
          </div>
        </div>

        <!-- CÁC NGÔN NGỮ KHÁC (TẠM KHÓA) -->
        <div class="space-y-1.5 pt-1">
          <div class="text-[11px] font-bold text-slate-400 px-1 flex items-center justify-between">
            <span>Ngôn Ngữ Tiếp Theo</span>
            <i data-lucide="lock" class="w-3 h-3 text-slate-500"></i>
          </div>

          <!-- Tiếng Nhật -->
          <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between opacity-60">
            <div class="flex items-center space-x-2">
              <span class="text-base">🇯🇵</span>
              <div>
                <span class="text-xs font-bold text-slate-300">Tiếng Nhật (Japanese)</span>
                <span class="text-[10px] block text-slate-500 font-mono">N5 → N1 • Bản Xứ</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400">🔒 Sắp ra mắt</span>
          </div>

          <!-- Tiếng Trung -->
          <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between opacity-60">
            <div class="flex items-center space-x-2">
              <span class="text-base">🇨🇳</span>
              <div>
                <span class="text-xs font-bold text-slate-300">Tiếng Trung (Chinese)</span>
                <span class="text-[10px] block text-slate-500 font-mono">HSK 1 → 6 • Pinyin</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400">🔒 Sắp ra mắt</span>
          </div>

          <!-- Tiếng Hàn -->
          <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between opacity-60">
            <div class="flex items-center space-x-2">
              <span class="text-base">🇰🇷</span>
              <div>
                <span class="text-xs font-bold text-slate-300">Tiếng Hàn (Korean)</span>
                <span class="text-[10px] block text-slate-500 font-mono">Topik 1 → 6 • Seoul</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400">🔒 Sắp ra mắt</span>
          </div>

          <!-- Tiếng Đức -->
          <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between opacity-60">
            <div class="flex items-center space-x-2">
              <span class="text-base">🇩🇪</span>
              <div>
                <span class="text-xs font-bold text-slate-300">Tiếng Đức (German)</span>
                <span class="text-[10px] block text-slate-500 font-mono">Goethe A1 → B2</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400">🔒 Sắp ra mắt</span>
          </div>
        </div>
      </div>

      <!-- ================= VIEW 2: LỘ TRÌNH & BÀI HỌC HIỆN TẠI ================= -->
      <div id="drawerCurriculumView" class="flex flex-col space-y-3.5 flex-grow overflow-y-auto pr-1 scrollbar-none">
        
        <!-- Breadcrumb quay lại chọn ngôn ngữ & hiển thị track hiện tại -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <button onclick="switchDrawerView('languageHub')" class="text-xs text-slate-400 hover:text-emerald-400 transition flex items-center space-x-1 cursor-pointer font-semibold">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            <span>Đổi Ngôn Ngữ</span>
          </button>
          <span id="drawerCurrentTrackBadge" class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">🇺🇸 Giao Tiếp 0đ</span>
        </div>

        <!-- Box đo tiến độ tổng thể -->
        <div class="cyber-card p-3.5 rounded-2xl">
          <div class="flex items-center justify-between mb-2">
            <div>
              <span class="text-xs font-bold text-slate-300 block">Tiến Độ Chặng 0 (Khởi Động)</span>
              <span class="text-[10px] text-slate-500 font-mono">Chuẩn CEFR: A0 → A1 (100h)</span>
            </div>
            <span id="personalProgressText" class="text-xs font-mono font-bold text-emerald-400">0% Chặng 0</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
            <div id="personalProgressBar" class="bg-gradient-to-r from-emerald-500 to-cyan-400 h-2 rounded-full transition-all duration-500" style="width: 0%"></div>
          </div>
          <div class="flex justify-between text-[11px] text-slate-400">
            <span id="personalCompletedCount">Đã học: 0/10 buổi chặng</span>
            <span id="personalHoursCount" class="text-cyan-400 font-mono">Tích lũy: 0.0h</span>
          </div>
        </div>

        <!-- Navigation Tabs: Lộ trình vs Admin -->
        <div class="flex space-x-1 border-b border-slate-800 pb-2">
          <button onclick="switchMainView('curriculumView')" id="tabBtn-curriculumView" class="view-tab-btn active px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            Danh Mục Bài Học
          </button>
          <button onclick="switchMainView('adminView')" id="tabBtn-adminView" class="view-tab-btn hidden px-3 py-1.5 text-xs font-semibold rounded-lg text-amber-400 hover:bg-amber-500/10 border border-transparent">
            Quản Trị Admin
          </button>
        </div>

        <!-- Danh sách bài học theo cây thư mục (Accordion Lessons) -->
        <div class="flex-grow overflow-y-auto space-y-4 pr-1 scrollbar-none" id="lessonTreeContainer">
          <!-- Render động từ curriculum-data.js -->
        </div>
      </div>
    </aside>'''

    html = html[:start_pos] + new_sidebar_html + html[end_pos + len(old_sidebar_inner_end):]
    print("Replaced curriculumSidebar inner HTML successfully")

# 3. Update Focus Bar button: call openCurriculumDrawer() instead of toggleSidebar()
old_focus_btn = '''          <button onclick="toggleSidebar()" class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold flex items-center space-x-2 transition cursor-pointer shadow-md flex-shrink-0">
            <i data-lucide="menu" class="w-4 h-4 text-emerald-400"></i>
            <span class="hidden sm:inline">Danh Mục Bài</span>
            <span id="headerProgressBadge" class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">0%</span>
          </button>'''

new_focus_btn = '''          <button onclick="openCurriculumDrawer()" class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold flex items-center space-x-2 transition cursor-pointer shadow-md flex-shrink-0" title="Mở danh mục các buổi học">
            <i data-lucide="book-open" class="w-4 h-4 text-emerald-400"></i>
            <span class="hidden sm:inline">Danh Mục Bài</span>
            <span id="headerProgressBadge" class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">0%</span>
          </button>'''

if old_focus_btn in html:
    html = html.replace(old_focus_btn, new_focus_btn)
    print("Replaced focus bar button")
else:
    print("old_focus_btn not found directly")

with open(r'd:\WEB_HOC_TIENG_ANH_AI\dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("dashboard.html updated successfully!")
