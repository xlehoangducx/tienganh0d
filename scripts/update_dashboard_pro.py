# -*- coding: utf-8 -*-
import re

# ==============================================================
# 1. CẬP NHẬT DASHBOARD.HTML
# ==============================================================
with open('d:/WEB_HOC_TIENG_ANH_AI/dashboard.html', 'r', encoding='utf-8') as f:
    dash = f.read()

# CSS for Dynamic Slide Presentation & Cognitive Typography
slide_css = '''
  <style>
    /* Cognitive Typography & Smooth Transitions */
    .slide-card-active {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .slide-card-fadeout {
      opacity: 0 !important;
      transform: translateY(8px) scale(0.98) !important;
    }
    .wave-bar {
      display: inline-block;
      width: 3px;
      height: 14px;
      border-radius: 9999px;
      background: #34d399;
      animation: waveAnimation 1.2s ease-in-out infinite;
    }
    @keyframes waveAnimation {
      0%, 100% { height: 6px; }
      50% { height: 22px; }
    }
    .glow-accent {
      text-shadow: 0 0 12px rgba(52, 211, 153, 0.45);
    }
    /* Sticky Module Navigation */
    .sticky-module-nav {
      position: sticky;
      top: 4rem;
      z-index: 30;
      backdrop-filter: blur(12px);
      background-color: rgba(7, 8, 13, 0.92);
    }
  </style>
</head>'''

if '</head>' in dash and 'slide-card-active' not in dash:
    dash = dash.replace('</head>', slide_css)

# Compact Unified Lesson Header (replaces the old tall header + track bar)
old_lesson_header_pattern = re.compile(
    r'<!-- TRACK INDICATOR BAR -->.*?<!-- 7 TABS MODULE HỌC THUẬT ĐA GIÁC QUAN',
    re.DOTALL
)

new_lesson_header = '''<!-- UNIFIED COMPACT LESSON HEADER -->
        <div class="cyber-card p-4 sm:p-5 rounded-2xl relative overflow-hidden border-slate-800/80 bg-slate-900/60 shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-2.5 mb-2 border-b border-slate-800/60 pb-2.5">
            <div class="flex items-center space-x-2">
              <span id="trackIconBadge" class="text-sm">🟢</span>
              <span id="trackTitleBadge" class="text-xs font-bold text-white flex items-center space-x-1.5">
                <span>Tiếng Anh Giao Tiếp Đời Thường</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">0đ Cộng Đồng</span>
              </span>
            </div>
            
            <div class="flex items-center space-x-3 text-xs">
              <span id="currentPhaseBadge" class="font-mono text-cyan-400 font-semibold">Chặng 0: Khởi Động</span>
              <span class="text-slate-500">•</span>
              <span id="currentLessonDuration" class="text-slate-400 font-mono">25 phút</span>
              <a href="tracks.html" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-cyan-300 font-semibold transition flex items-center space-x-1 border border-slate-700">
                <i data-lucide="compass" class="w-3 h-3"></i>
                <span>Đổi Lộ Trình</span>
              </a>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 id="currentLessonTitle" class="text-lg sm:text-2xl font-black text-white tracking-wide glow-accent">
                Buổi 01: Đánh Thức Cơ Miệng & 3 Cụm Từ Giao Tiếp Đời Thường Đầu Tiên
              </h2>
              <p id="currentLessonTopic" class="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Chủ đề: Mở khóa khẩu hình cơ miệng, làm quen âm thè lưỡi /θ/, âm gió /s/, âm bật /t/ và phản xạ chào hỏi
              </p>
            </div>
          </div>
        </div>

        <!-- 7 TABS MODULE HỌC THUẬT ĐA GIÁC QUAN (STICKY TẬP TRUNG) -->
        <div class="sticky-module-nav border-b border-slate-800/90 py-2.5 -mx-1 px-1">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap gap-1.5 sm:gap-2">
              <button onclick="switchLessonModule('moduleLecture')" id="btn-moduleLecture" class="module-tab-btn active px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <i data-lucide="book-open" class="w-4 h-4 text-emerald-400"></i>
                <span>0. Thuyết Giảng</span>
              </button>

              <button onclick="switchLessonModule('moduleMouth')" id="btn-moduleMouth" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent">
                <i data-lucide="mic" class="w-4 h-4"></i>
                <span>1. Khẩu Hình</span>
              </button>

              <button onclick="switchLessonModule('moduleChunks')" id="btn-moduleChunks" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent">
                <i data-lucide="volume-2" class="w-4 h-4"></i>
                <span>2. Cụm Từ</span>
              </button>

              <button onclick="switchLessonModule('moduleQuiz')" id="btn-moduleQuiz" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent">
                <i data-lucide="help-circle" class="w-4 h-4"></i>
                <span>3. Trắc Nghiệm</span>
              </button>

              <button onclick="switchLessonModule('moduleCards')" id="btn-moduleCards" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent">
                <i data-lucide="layers" class="w-4 h-4"></i>
                <span>4. Sổ Thẻ 3D</span>
              </button>

              <button onclick="switchLessonModule('moduleDialogue')" id="btn-moduleDialogue" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent">
                <i data-lucide="radio" class="w-4 h-4"></i>
                <span>5. Đối Thoại AI</span>
              </button>

              <button onclick="switchLessonModule('moduleTyping')" id="btn-moduleTyping" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent">
                <i data-lucide="keyboard" class="w-4 h-4"></i>
                <span>6. Ghép Khối</span>
              </button>
            </div>
            
            <button onclick="toggleFreedomMode()" id="freedomModeBtn" class="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold text-slate-400 hover:text-emerald-300 bg-slate-900 border border-slate-800 transition flex items-center space-x-1">
              <i data-lucide="unlock" class="w-3.5 h-3.5"></i>
              <span id="freedomModeStatus">Chế Độ Tự Do: TẮT</span>
            </button>
          </div>
        </div>

        <!-- 7 TABS MODULE HỌC THUẬT ĐA GIÁC QUAN'''

if old_lesson_header_pattern.search(dash):
    dash = old_lesson_header_pattern.sub(new_lesson_header, dash)
    print("Replaced Lesson Header with Compact Unified Header!")
else:
    print("Old lesson header pattern not found in dashboard.html")

with open('d:/WEB_HOC_TIENG_ANH_AI/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(dash)

print("dashboard.html updated successfully!")
