# -*- coding: utf-8 -*-
"""
Zen Mode & Smooth Video Slide Upgrade:
1. dashboard.html:
   - Offcanvas drawer for sidebar on BOTH PC and mobile (no more 300px sidebar eating the screen!)
   - Centralized distraction-free workspace (max-w-4xl mx-auto, 100% full width)
   - Ultra-compact header with [☰ Danh Mục Bài] + Centered Lesson Title
   - Single-row horizontal scrollable Tab Bar (flex-nowrap, never wraps or stacks vertically!)
2. css/style.css:
   - GPU-accelerated video scene transitions (scene-enter-right, scene-exit-left)
3. js/curriculum-data.js:
   - Add callout property to all scenes
4. js/app.js:
   - toggleSidebar with backdrop
   - renderMasterLecture with single full-width active scene, scene tabs, time indicator
   - switchScene with smooth crossfade and auto-scroll into viewport center
   - One-shot ontimeupdate scene transition (zero lag, zero stutter)
"""

import os
import re

WEB_DIR = r"d:\WEB_HOC_TIENG_ANH_AI"

# ==============================================================
# 1. UPDATE CSS (css/style.css)
# ==============================================================
css_path = os.path.join(WEB_DIR, "css", "style.css")
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

zen_css = """
/* Hardware-Accelerated Video Slide Scene Transitions */
.video-scene-transition {
  will-change: transform, opacity;
  transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease;
}

.scene-exit-left {
  opacity: 0 !important;
  transform: translate3d(-18px, 0, 0) scale(0.98) !important;
}

.scene-enter-right {
  animation: sceneEnterRightKeyframe 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes sceneEnterRightKeyframe {
  0% {
    opacity: 0;
    transform: translate3d(20px, 0, 0) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}
"""

if "sceneEnterRightKeyframe" not in css_content:
    css_content += "\n" + zen_css
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css_content)
    print("✅ Updated css/style.css with scene transitions!")
else:
    print("ℹ️ css/style.css already has scene transitions.")

# ==============================================================
# 2. UPDATE JS/CURRICULUM-DATA.JS (Add callout to all scenes)
# ==============================================================
curr_path = os.path.join(WEB_DIR, "js", "curriculum-data.js")
with open(curr_path, "r", encoding="utf-8") as f:
    curr_content = f.read()

old_slides_block = r"slides:\s*\[[\s\S]*?id:\s*1,[\s\S]*?id:\s*5,[\s\S]*?\}\s*\]\s*\},"

new_slides_block = """slides: [
          {
            id: 1,
            title: "Khởi Đầu: Bản Năng Kết Nối Con Người",
            subtitle: "Vì sao không học bảng chữ cái A-B-C hay công thức ngữ pháp trước?",
            audioFile: "assets/audio/lecture-buoi-01-slide-1.mp3",
            icon: "sparkles",
            badge: "Góc Nhìn Khai Sáng",
            scenes: [
              {
                badge: "🔍 THỰC TRẠNG & NGUYÊN NHÂN",
                title: "95% Người Học Thất Bại Vì Bắt Đầu Bằng Công Thức Khô Khan",
                content: "Não bộ con người không được tiến hóa để học quy tắc trừu tượng trước khi có cảm xúc và trải nghiệm xã hội. Bắt đầu bằng lý thuyết khiến vùng hạch hạnh nhân (Amygdala) bị kích hoạt phản ứng sợ hãi và quá tải nhận thức.",
                callout: "⚠️ Bắt đầu bằng ngữ pháp khô khan sẽ kích hoạt phản ứng lo âu, làm rơi rụng 60% năng lượng tiếp thu!",
                icon: "alert-triangle",
                theme: "amber"
              },
              {
                badge: "💡 BẢN NĂNG NGUYÊN THỦY CỦA NÃO BỘ",
                title: "Trẻ Em Bản Xứ Nói Hàng Nghìn Câu Trước Khi Biết Viết Chữ A",
                content: "Ở Buổi 1, chúng ta kích hoạt lại chính bản năng nguyên thủy: Kết nối và sinh tồn xã hội. Chỉ cần 3 cụm từ hạt nhân là đủ để mở khóa vùng phản xạ giao tiếp tự nhiên!",
                callout: "✨ Chỉ cần 3 cụm câu hạt nhân là đủ mở khóa phản xạ sinh tồn xã hội đầu tiên mà không cần suy nghĩ!",
                icon: "sparkles",
                theme: "emerald"
              }
            ]
          },
          {
            id: 2,
            title: "Giải Mã 3 Âm Vị: Theta /θ/, Gió /s/, Bật /t/",
            subtitle: "Bẻ gãy triệt để 3 tật nói tiếng Anh bồi của người Việt",
            audioFile: "assets/audio/lecture-buoi-01-slide-2.mp3",
            icon: "mic",
            badge: "Cơ Sinh Học Khẩu Hình",
            scenes: [
              {
                badge: "⚠️ TẬT PHÁT ÂM TIẾNG VIỆT",
                title: "Thói Quen Rụt Lưỡi & Nuốt Sạch Toàn Bộ Âm Đuôi",
                content: "Tiếng Việt không có âm kẹp lưỡi /θ/, gió /s/ hay bật /t/. Người Việt hay thụt lưỡi nói Thank you thành 'Thanh-kiu' và nuốt trọn âm đuôi biến Nice thành 'Nai'.",
                callout: "⚠️ Thói quen rụt lưỡi vào chân răng trong sẽ biến âm /θ/ thành 'th/t' tiếng Việt bồi.",
                icon: "alert-circle",
                theme: "amber"
              },
              {
                badge: "🎯 TÁI CẤU TRÚC CƠ QUAN PHÁT ÂM",
                title: "Ép Cơ Hàm & Đầu Lưỡi Đặt Chuẩn Kẽ Răng",
                content: "3 âm vị này là liệu pháp vật lý trị liệu cho cơ quan phát âm, đánh thức các nhóm cơ lưỡi và hàm chưa từng hoạt động, xóa bỏ vĩnh viễn tật nói tiếng Anh bồi.",
                callout: "🎯 Ép nhẹ đầu lưỡi ở kẽ răng và thổi hơi gió mát trượt êm ái trên mặt lưỡi!",
                icon: "mic",
                theme: "cyan"
              }
            ]
          },
          {
            id: 3,
            title: "Bí Mật Thống Kê COCA: 65% Ngữ Pháp Mỹ",
            subtitle: "Định luật Pareto 80/20 - Xây xong móng nhà kiên cố",
            audioFile: "assets/audio/lecture-buoi-01-slide-3.mp3",
            icon: "pie-chart",
            badge: "Kho Ngữ Liệu 1 Tỷ Từ",
            scenes: [
              {
                badge: "📊 QUY LUẬT PARETO 80/20",
                title: "Âm Gió /s/ & Bật /t/ Chiếm Hơn 65% Toàn Bộ Ngữ Pháp",
                content: "Từ đuôi số nhiều (-s/es), ngôi thứ 3 hiện tại, thì quá khứ (-ed) đến sở hữu cách ('s) — tất cả đều cấu tạo từ 2 âm vị nền móng này.",
                callout: "📊 Hơn 65% danh từ số nhiều, thì quá khứ (-ed) và động từ ngôi 3 đều kết thúc bằng /s/ hoặc /t/.",
                icon: "pie-chart",
                theme: "amber"
              },
              {
                badge: "🏗️ MÓNG NHÀ KIÊN CỐ",
                title: "Làm Chủ Ngay Buổi 1 Để Không Bao Giờ Phải Sửa Lại",
                content: "Làm chủ 2 âm này ở Buổi 1 là xây xong cái móng nhà kiên cố cho toàn bộ ngữ pháp sau này mà không bao giờ phải sửa lại hay hoang mang!",
                callout: "🏗️ Làm chủ 2 âm này ở Buổi 1 là xây xong cái móng nhà kiên cố cho toàn bộ lộ trình!",
                icon: "layers",
                theme: "emerald"
              }
            ]
          },
          {
            id: 4,
            title: "Tam Giác Sinh Tồn: Vũ Khí Đập Tan Nỗi Sợ",
            subtitle: "Chào hỏi làm quen → Biết ơn chân thành → Chúc lành tạm biệt",
            audioFile: "assets/audio/lecture-buoi-01-slide-4.mp3",
            icon: "shield-check",
            badge: "Ứng Xử Xã Hội Thực Tế",
            scenes: [
              {
                badge: "🌐 NGHI THỨC PHỔ QUÁT",
                title: "Bộ Ba Giao Tiếp Sinh Tồn Xã Hội Phương Tây",
                content: "Bộ ba: Hi, nice to meet you! → Thank you so much! → Have a great day! là nghi thức ứng xử phổ quát giúp bạn kết nối tức thì với bất kỳ người bản xứ nào.",
                callout: "🌐 Bộ ba: Chào hỏi → Biết ơn → Chúc lành là chiếc vé thông hành văn hóa toàn cầu.",
                icon: "shield-check",
                theme: "indigo"
              },
              {
                badge: "⚡ KÍCH HOẠT DOPAMINE NÃO BỘ",
                title: "Nhận Nụ Cười Đón Nhận Của Người Bản Xứ",
                content: "Dù ở sân bay JFK hay ngoài phố: Chỉ cần nói đúng 3 câu này, người bản xứ sẽ mỉm cười đón nhận bạn, kích hoạt Dopamine xóa tan nỗi sợ nói tiếng Anh!",
                callout: "🤝 Nhận nụ cười đón nhận của người bản xứ giúp não bộ tiết Dopamine xóa tan nỗi sợ nói.",
                icon: "smile",
                theme: "purple"
              }
            ]
          },
          {
            id: 5,
            title: "Chiến Lược Não Bộ: 6 Bước & 7 Lần Khắc Sâu",
            subtitle: "Chinh phục 25 phút hôm nay qua các giác quan",
            audioFile: "assets/audio/lecture-buoi-01-slide-5.mp3",
            icon: "cpu",
            badge: "Lộ Trình Đa Giác Quan",
            scenes: [
              {
                badge: "🔄 LỘ TRÌNH 6 BƯỚC ĐA GIÁC QUAN",
                title: "Từ Soi Gương, Nghe, Nói, Trắc Nghiệm Đến Ghép Câu",
                content: "Kích hoạt đồng thời 6 vùng thần kinh: Vận động miệng, thính giác, thị giác, phản hồi âm thanh, không gian 3D và tái tạo chữ viết.",
                callout: "🔄 6 Giác quan đồng bộ: Nhìn khẩu hình, nghe mẫu, nói vào mic, trắc nghiệm, thẻ 3D và ghép câu.",
                icon: "cpu",
                theme: "blue"
              },
              {
                badge: "🧠 CỐ ĐỊNH KHỚP THẦN KINH DÀI HẠN",
                title: "Chạm Mốc 7 Lần Lặp Để Ghi Nhớ Vĩnh Viễn",
                content: "Chuyển từng cụm từ từ bộ nhớ tạm sang vỏ não dài hạn. Đạt 7/7 lần là chạm mốc cố định khớp thần kinh vĩnh viễn (Long-term Potentiation)!",
                callout: "🧠 Đạt đủ 7/7 lần lặp đa giác quan để chuyển kiến thức vào vỏ não dài hạn vĩnh viễn!",
                icon: "zap",
                theme: "emerald"
              }
            ]
          }
        ]
      },"""

if re.search(old_slides_block, curr_content):
    curr_content = re.sub(old_slides_block, lambda m: new_slides_block, curr_content)
    with open(curr_path, "w", encoding="utf-8") as f:
        f.write(curr_content)
    print("✅ Updated curriculum-data.js with callout text!")
else:
    print("⚠️ old_slides_block not matched in curriculum-data.js")

# ==============================================================
# 3. UPDATE DASHBOARD.HTML (Zen Full-Width Layout & Offcanvas Sidebar)
# ==============================================================
dash_path = os.path.join(WEB_DIR, "dashboard.html")
with open(dash_path, "r", encoding="utf-8") as f:
    dash_content = f.read()

# Replace sidebar and layout opening
old_workspace_open = r'''  <!-- ================= WORKSPACE LAYOUT \(2-COLUMN ARCHITECTURE\) ================= -->\s*<div class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6 relative z-10">\s*<!-- ================= CỘT TRÁI: DANH MỤC LỘ TRÌNH & BÀI HỌC \(CURRICULUM NAVIGATOR\) ================= -->\s*<aside id="curriculumSidebar" class="fixed inset-y-0 left-0 z-50 w-80 bg-\[#0b0e17\] border-r border-slate-800 p-5 transform -translate-x-full transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0 lg:bg-transparent lg:border-r-0 lg:p-0 flex-shrink-0 flex flex-col space-y-4">'''

new_workspace_open = '''  <!-- ================= BACKDROP CHO OFFCANVAS SIDEBAR ================= -->
  <div id="sidebarBackdrop" onclick="toggleSidebar(true)" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 hidden transition-opacity duration-300"></div>

  <!-- ================= OFFCANVAS SIDEBAR (MỞ KHI BẤM NÚT, GIẢI PHÓNG 100% KHÔNG GIAN HỌC) ================= -->
  <aside id="curriculumSidebar" class="fixed inset-y-0 left-0 z-50 w-80 sm:w-96 bg-[#080b12]/95 backdrop-blur-2xl border-r border-slate-800 p-5 transform -translate-x-full transition-transform duration-300 shadow-2xl flex flex-col space-y-4">'''

if re.search(old_workspace_open, dash_content):
    dash_content = re.sub(old_workspace_open, lambda m: new_workspace_open, dash_content)
    print("✅ Updated dashboard.html sidebar to full offcanvas drawer!")
else:
    print("⚠️ old_workspace_open pattern not matched in dashboard.html")

# Replace main container opening and header strip + tab bar
old_main_open = r'''    <!-- ================= CỘT PHẢI: KHÔNG GIAN BÀI HỌC ĐA MODULE \(LEARNING HUB\) ================= -->\s*<main class="flex-grow min-w-0 space-y-6">[\s\S]*?<!-- 7 TABS MODULE HỌC THUẬT ĐA GIÁC QUAN \(STICKY TẬP TRUNG\) -->[\s\S]*?<!-- MODULE 0: BÀI THUYẾT GIẢNG KHAI MỞ TÂM TRÍ & CĂN CỨ KHOA HỌC NÃO BỘ -->'''

new_main_open = '''  <!-- ================= WORKSPACE CHÍNH (ZEN MODE • 100% CHIẾM TRỌN MÀN HÌNH & Ở TRUNG TÂM) ================= -->
  <div class="flex-grow max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 relative z-10">

    <main class="w-full space-y-5">

      <!-- ALERT NẾU TÀI KHOẢN CHỜ DUYỆT -->
      <div id="pendingAlert" class="hidden p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
        <div class="flex items-start space-x-3">
          <i data-lucide="clock" class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"></i>
          <div>
            <h4 class="font-bold text-sm text-amber-200">Tài khoản đang chờ duyệt</h4>
            <p class="text-xs text-amber-300/80 mt-0.5">Vui lòng chờ Admin kích hoạt để ghi nhận điểm số bài tập vào Firestore.</p>
          </div>
        </div>
      </div>

      <!-- ALERT CHỐNG QUÊN (SPACED REPETITION) -->
      <div id="spacedReviewAlert" class="hidden p-4 rounded-2xl cyber-card border-amber-500/40 text-amber-200 shadow-lg">
        <div class="flex items-start space-x-3">
          <div class="p-2 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
            <i data-lucide="alarm-clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="font-bold text-sm text-white">Khởi động 3 phút chống quên</h4>
            <p class="text-xs text-amber-300/80 mt-0.5">
              Đã <strong id="inactiveDaysCount">2</strong> ngày bạn chưa luyện tập. Hãy làm nhanh bài trắc nghiệm dưới đây để kích hoạt nơ-ron cũ nhé!
            </p>
          </div>
        </div>
      </div>

      <!-- ================= VIEW 1: BÀI HỌC HIỆN TẠI ================= -->
      <div id="curriculumView" class="space-y-4">

        <!-- 1. COMPACT UNIFIED TOP FOCUS BAR -->
        <div class="flex items-center justify-between gap-2 px-1">
          <!-- Nút mở Danh Mục & Tiến Độ -->
          <button onclick="toggleSidebar()" class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold flex items-center space-x-2 transition cursor-pointer shadow-md flex-shrink-0">
            <i data-lucide="menu" class="w-4 h-4 text-emerald-400"></i>
            <span class="hidden sm:inline">Danh Mục Bài</span>
            <span id="headerProgressBadge" class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">0%</span>
          </button>

          <!-- Tiêu đề buổi học tinh gọn ở giữa -->
          <div class="text-center min-w-0 flex-grow px-2">
            <h1 id="currentLessonTitle" class="text-xs sm:text-sm md:text-base font-black text-white truncate glow-accent">
              Buổi 01: Đánh Thức Cơ Miệng & 3 Cụm Giao Tiếp
            </h1>
          </div>

          <!-- Đổi lộ trình & Cấp độ -->
          <div class="flex items-center space-x-1.5 flex-shrink-0">
            <span id="currentPhaseBadge" class="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">Pre-A1</span>
            <a href="tracks.html" class="px-2.5 py-1 rounded-lg text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 flex items-center space-x-1">
              <i data-lucide="compass" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span class="hidden md:inline">Đổi Lộ Trình</span>
            </a>
          </div>
        </div>

        <!-- 2. SINGLE-ROW HORIZONTALLY SCROLLABLE STEP TAB STRIP (KHÔNG BAO GIỜ BỊ XUỐNG DÒNG) -->
        <div class="sticky top-0 z-30 bg-[#07080d]/90 backdrop-blur-md py-2 border-b border-slate-800/90 -mx-1 px-1">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center space-x-1.5 overflow-x-auto scrollbar-none flex-nowrap py-0.5 flex-grow pr-2" id="moduleTabBarContainer">
              <button onclick="switchLessonModule('moduleLecture')" id="btn-moduleLecture" class="module-tab-btn active px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap flex-shrink-0 cursor-pointer">
                <i data-lucide="book-open" class="w-3.5 h-3.5 text-emerald-400"></i>
                <span>0. Thuyết Giảng</span>
              </button>

              <button onclick="switchLessonModule('moduleMouth')" id="btn-moduleMouth" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent whitespace-nowrap flex-shrink-0 cursor-pointer">
                <i data-lucide="mic" class="w-3.5 h-3.5"></i>
                <span>1. Khẩu Hình</span>
              </button>

              <button onclick="switchLessonModule('moduleChunks')" id="btn-moduleChunks" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent whitespace-nowrap flex-shrink-0 cursor-pointer">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                <span>2. Cụm Từ</span>
              </button>

              <button onclick="switchLessonModule('moduleQuiz')" id="btn-moduleQuiz" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent whitespace-nowrap flex-shrink-0 cursor-pointer">
                <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
                <span>3. Trắc Nghiệm</span>
              </button>

              <button onclick="switchLessonModule('moduleCards')" id="btn-moduleCards" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent whitespace-nowrap flex-shrink-0 cursor-pointer">
                <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                <span>4. Sổ Thẻ 3D</span>
              </button>

              <button onclick="switchLessonModule('moduleDialogue')" id="btn-moduleDialogue" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent whitespace-nowrap flex-shrink-0 cursor-pointer">
                <i data-lucide="radio" class="w-3.5 h-3.5"></i>
                <span>5. Đối Thoại AI</span>
              </button>

              <button onclick="switchLessonModule('moduleTyping')" id="btn-moduleTyping" class="module-tab-btn px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 border border-transparent whitespace-nowrap flex-shrink-0 cursor-pointer">
                <i data-lucide="keyboard" class="w-3.5 h-3.5"></i>
                <span>6. Ghép Khối</span>
              </button>
            </div>

            <!-- Nút Tự Do -->
            <button onclick="toggleFreedomMode()" id="freedomModeBtn" class="px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-semibold text-slate-400 hover:text-emerald-300 bg-slate-900 border border-slate-800 transition flex items-center space-x-1 flex-shrink-0 cursor-pointer" title="Bật/Tắt chế độ tự do ôn tập">
              <i data-lucide="unlock" class="w-3.5 h-3.5"></i>
              <span id="freedomModeStatus" class="hidden sm:inline">Tự Do: TẮT</span>
            </button>
          </div>
        </div>

        <!-- MODULE 0: BÀI THUYẾT GIẢNG KHAI MỞ TÂM TRÍ & CĂN CỨ KHOA HỌC NÃO BỘ -->'''

if re.search(old_main_open, dash_content):
    dash_content = re.sub(old_main_open, lambda m: new_main_open, dash_content)
    print("✅ Updated dashboard.html main layout to Zen mode & single-row tab strip!")
else:
    print("⚠️ old_main_open pattern not matched in dashboard.html")

# Close button in sidebar on mobile should call toggleSidebar(true)
dash_content = dash_content.replace('onclick="toggleSidebar()" class="p-1.5 text-slate-400 hover:text-white"', 'onclick="toggleSidebar(true)" class="p-1.5 text-slate-400 hover:text-white cursor-pointer"')

with open(dash_path, "w", encoding="utf-8") as f:
    f.write(dash_content)

print("dashboard.html updated successfully!")
