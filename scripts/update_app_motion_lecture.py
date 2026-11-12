with open(r'd:\WEB_HOC_TIENG_ANH_AI\js\app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update Drawer Navigation Functions
drawer_nav_code = '''// ==============================================================
// 2. ĐIỀU HƯỚNG VIEW & MODULES (DRAWER & WORKSPACE)
// ==============================================================
window.toggleSidebar = function(forceClose) {
  const sidebar = document.getElementById("curriculumSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (!sidebar) return;
  const isCurrentlyOpen = !sidebar.classList.contains("-translate-x-full");
  if (forceClose === true || isCurrentlyOpen) {
    sidebar.classList.add("-translate-x-full");
    if (backdrop) backdrop.classList.add("hidden");
  } else {
    sidebar.classList.remove("-translate-x-full");
    if (backdrop) backdrop.classList.remove("hidden");
  }
};

window.openLanguageDrawer = function() {
  const sidebar = document.getElementById("curriculumSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (!sidebar) return;
  
  // Hiển thị View 1: Chọn ngôn ngữ & Phân khúc
  window.switchDrawerView('languageHub');
  
  sidebar.classList.remove("-translate-x-full");
  if (backdrop) backdrop.classList.remove("hidden");
  if (window.lucide) window.lucide.createIcons();
};

window.openCurriculumDrawer = function() {
  const sidebar = document.getElementById("curriculumSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (!sidebar) return;
  
  // Hiển thị View 2: Lộ trình & Các buổi học hiện tại
  window.switchDrawerView('curriculum');
  
  sidebar.classList.remove("-translate-x-full");
  if (backdrop) backdrop.classList.remove("hidden");
  if (window.lucide) window.lucide.createIcons();
};

window.switchDrawerView = function(viewName) {
  const langView = document.getElementById("drawerLanguageHubView");
  const curView = document.getElementById("drawerCurriculumView");
  const headerTitle = document.getElementById("drawerHeaderTitle");
  
  if (viewName === 'languageHub') {
    if (langView) langView.classList.remove("hidden");
    if (curView) curView.classList.add("hidden");
    if (headerTitle) {
      headerTitle.innerHTML = `
        <i data-lucide="globe" class="w-4 h-4 text-emerald-400"></i>
        <span>Chọn Ngôn Ngữ & Phân Khúc</span>
      `;
    }
  } else {
    if (langView) langView.classList.add("hidden");
    if (curView) curView.classList.remove("hidden");
    if (headerTitle) {
      headerTitle.innerHTML = `
        <i data-lucide="book-open" class="w-4 h-4 text-emerald-400"></i>
        <span>Danh Mục Bài Học & Tiến Độ</span>
      `;
    }
  }
  if (window.lucide) window.lucide.createIcons();
};

window.selectTrackAndOpenCurriculum = function(trackName) {
  if (trackName === 'communication') {
    // Tự động chuyển sang View Lộ Trình & Tiến Độ Chặng 0
    window.switchDrawerView('curriculum');
    const badge = document.getElementById("drawerCurrentTrackBadge");
    if (badge) badge.textContent = "🇺🇸 Giao Tiếp 0đ";
  } else if (trackName === 'esp') {
    // Thông báo chuyên ngành ESP
    window.switchDrawerView('curriculum');
    const badge = document.getElementById("drawerCurrentTrackBadge");
    if (badge) badge.textContent = "💼 Chuyên Ngành (ESP)";
  }
};
'''

# Replace old toggleSidebar block
old_toggle_start = '// ==============================================================\n// 2. ĐIỀU HƯỚNG VIEW & MODULES\n// ==============================================================\nwindow.toggleSidebar = function(forceClose) {'
old_toggle_end = 'window.switchMainView = function(viewId) {'

start_idx = code.find(old_toggle_start)
end_idx = code.find(old_toggle_end)

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + drawer_nav_code + '\n' + code[end_idx:]
    print("Replaced drawer nav functions successfully")
else:
    print("old_toggle_start not matched")

# 2. Add Visual Graphic Generator and Enhanced renderSceneCardHTML
visual_and_scene_code = '''// ==============================================================
// 5.4. VISUAL MOTION GRAPHICS GENERATOR CHO TỪNG CẢNH THUYẾT GIẢNG
// ==============================================================
function getSceneVisualGraphicHTML(visualType, theme) {
  if (visualType === 'neural-blockade') {
    return `
      <div class="motion-beat-visual my-3 p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/30 flex items-center justify-between gap-3 shadow-inner">
        <div class="flex items-center space-x-3">
          <div class="relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span class="absolute inset-0 rounded-xl bg-amber-400/20 visual-pulse-ring"></span>
            <i data-lucide="shield-alert" class="w-5 h-5 relative z-10"></i>
          </div>
          <div>
            <span class="text-xs font-bold text-amber-300 block">Hiện Tượng Quá Tải Nhận Thức (Sweller 1988)</span>
            <span class="text-[11px] text-slate-400">Ngữ pháp trừu tượng kích hoạt hạch hạnh nhân, đóng sập vùng Broca</span>
          </div>
        </div>
        <div class="hidden sm:flex items-center space-x-1 text-amber-400/60 text-xs font-mono">
          <span>Khóa Phản Xạ</span>
          <i data-lucide="lock" class="w-3.5 h-3.5"></i>
        </div>
      </div>
    `;
  }

  if (visualType === 'human-connection') {
    return `
      <div class="motion-beat-visual my-3 p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-inner">
        <div class="flex items-center space-x-3">
          <div class="relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span class="absolute inset-0 rounded-xl bg-emerald-400/20 visual-pulse-ring"></span>
            <i data-lucide="heart-handshake" class="w-5 h-5 relative z-10"></i>
          </div>
          <div>
            <span class="text-xs font-bold text-emerald-300 block">Bản Năng Sinh Tồn Xã Hội (Stephen Krashen)</span>
            <span class="text-[11px] text-slate-400">Kết nối cảm xúc mở rộng tối đa vùng tiếp nhận ngôn ngữ tự nhiên</span>
          </div>
        </div>
        <div class="hidden sm:flex items-center space-x-1 text-emerald-400/80 text-xs font-mono">
          <span>Kích Hoạt Dopamine</span>
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
        </div>
      </div>
    `;
  }

  if (visualType === 'vietnamese-habit') {
    return `
      <div class="motion-beat-visual my-3 p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/30 flex items-center justify-between gap-3 shadow-inner">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <i data-lucide="mic-off" class="w-5 h-5"></i>
          </div>
          <div>
            <span class="text-xs font-bold text-amber-300 block">Quán Tính Phát Âm Đơn Âm Tiếng Việt</span>
            <span class="text-[11px] text-slate-400">Tật thụt lưỡi vào chân răng trong & nuốt sạch âm đuôi /s/, /t/</span>
          </div>
        </div>
        <div class="hidden sm:block text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
          Nice → "Nai" ❌
        </div>
      </div>
    `;
  }

  if (visualType === 'mouth-kinematics') {
    return `
      <div class="motion-beat-visual my-3 p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30 grid grid-cols-3 gap-2 text-center shadow-inner">
        <div class="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
          <span class="text-xs font-black text-cyan-300 block font-mono">/θ/ (Theta)</span>
          <span class="text-[10px] text-slate-400">Kẹp nhẹ đầu lưỡi</span>
        </div>
        <div class="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
          <span class="text-xs font-black text-cyan-300 block font-mono">/s/ (Xì gió)</span>
          <span class="text-[10px] text-slate-400">Răng khép trong</span>
        </div>
        <div class="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
          <span class="text-xs font-black text-cyan-300 block font-mono">/t/ (Bật nướu)</span>
          <span class="text-[10px] text-slate-400">Gõ tách dứt khoát</span>
        </div>
      </div>
    `;
  }

  if (visualType === 'pareto-chart') {
    return `
      <div class="motion-beat-visual my-3 p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/30 space-y-2 shadow-inner">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-amber-300 flex items-center space-x-1.5">
            <i data-lucide="bar-chart-2" class="w-4 h-4 text-amber-400"></i>
            <span>Độ Bao Phủ Của /s/ và /t/ Trong Ngữ Liệu Mỹ (COCA)</span>
          </span>
          <span class="font-mono font-black text-amber-400 text-sm">65%</span>
        </div>
        <div class="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div class="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 rounded-full" style="width: 65%"></div>
        </div>
        <div class="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>Số nhiều (-s/es), Quá khứ (-ed), Ngôi 3 (-s)</span>
          <span>Bao phủ 2/3 cấu trúc Mỹ</span>
        </div>
      </div>
    `;
  }

  if (visualType === 'social-trinity') {
    return `
      <div class="motion-beat-visual my-3 p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex flex-wrap items-center justify-around gap-2 text-center shadow-inner">
        <div class="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30">
          <span class="text-[10px] text-emerald-400 block font-bold">1. Chào Hỏi</span>
          <span class="text-xs font-bold text-white">Hi, nice to meet you!</span>
        </div>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-emerald-400"></i>
        <div class="px-3 py-1.5 rounded-lg bg-teal-950/50 border border-teal-500/30">
          <span class="text-[10px] text-teal-400 block font-bold">2. Biết Ơn</span>
          <span class="text-xs font-bold text-white">Thank you so much!</span>
        </div>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-teal-400"></i>
        <div class="px-3 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30">
          <span class="text-[10px] text-cyan-400 block font-bold">3. Chúc Lành</span>
          <span class="text-xs font-bold text-white">Have a great day!</span>
        </div>
      </div>
    `;
  }

  // Mặc định trả về rỗng nếu không có visualType đặc biệt
  return "";
}

function renderSceneCardHTML(sc, sIdx, totalScenes) {
  if (!sc) return "";
  const isEmerald = sc.theme === 'emerald';
  const isCyan = sc.theme === 'cyan';
  const isIndigo = sc.theme === 'indigo';
  const isPurple = sc.theme === 'purple';
  const isBlue = sc.theme === 'blue';

  const badgeClass = isEmerald ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' :
                     isCyan ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' :
                     isIndigo ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40' :
                     isPurple ? 'bg-purple-500/15 text-purple-300 border-purple-500/40' :
                     isBlue ? 'bg-blue-500/15 text-blue-300 border-blue-500/40' :
                     'bg-amber-500/15 text-amber-300 border-amber-500/40';

  const calloutBorder = isEmerald ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200' :
                        isCyan ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-200' :
                        isIndigo ? 'border-indigo-500/40 bg-indigo-950/40 text-indigo-200' :
                        isPurple ? 'border-purple-500/40 bg-purple-950/40 text-purple-200' :
                        isBlue ? 'border-blue-500/40 bg-blue-950/40 text-blue-200' :
                        'border-amber-500/40 bg-amber-950/40 text-amber-200';

  const visualHTML = getSceneVisualGraphicHTML(sc.visualType, sc.theme);

  return `
    <div class="scene-active-card p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl transition-all duration-300">
      
      <!-- 1. MỐC BADGE CHỦ ĐỀ (VÀO CHẬM, MƯỢT MÀ) -->
      <div class="mb-3 motion-beat-badge">
        <span class="inline-flex items-center px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border ${badgeClass}">
          ${sc.badge}
        </span>
      </div>

      <!-- 2. MỐC TIÊU ĐỀ HẠT NHÂN -->
      <h3 class="motion-beat-title text-base sm:text-xl md:text-2xl font-black text-white mb-2 leading-snug">
        ${sc.title}
      </h3>

      <!-- 3. HOẠT ẢNH MINH HỌA TRỰC QUAN SINH ĐỘNG (NẾU CÓ) -->
      ${visualHTML}

      <!-- 4. DANH SÁCH TỪNG DÒNG TRI THỨC VI MÔ (MICRO-POINTS) -->
      ${sc.points && sc.points.length > 0 ? `
        <div class="space-y-2 mb-3.5">
          ${sc.points.map((pt, pIdx) => `
            <div class="motion-beat-point-${Math.min(pIdx, 2)} p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 flex items-start space-x-2.5 transition">
              <div class="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 flex-shrink-0">
                <i data-lucide="${pt.icon || 'check'}" class="w-3.5 h-3.5"></i>
              </div>
              <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">${pt.text}</p>
            </div>
          `).join("")}
        </div>
      ` : `
        <p class="text-sm sm:text-base text-slate-200 leading-relaxed mb-4 font-normal motion-beat-title">
          ${sc.content}
        </p>
      `}

      <!-- 5. HỘP ĐÚC KẾT NƠ-RON PHÁT SÁNG -->
      ${sc.callout ? `
        <div class="motion-beat-callout p-3.5 rounded-xl border ${calloutBorder} flex items-start space-x-3 shadow-inner">
          <i data-lucide="${sc.icon || 'sparkles'}" class="w-4 h-4 flex-shrink-0 mt-0.5 text-current"></i>
          <div class="text-xs sm:text-sm font-medium leading-relaxed">
            ${sc.callout}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
'''

# Find old renderSceneCardHTML and replace it
old_scene_fn_start = 'function renderSceneCardHTML(sc, sIdx, totalScenes) {'
old_scene_fn_end = 'window.switchScene = function(sIdx, isAuto) {'

scene_start_idx = code.find(old_scene_fn_start)
scene_end_idx = code.find(old_scene_fn_end)

if scene_start_idx != -1 and scene_end_idx != -1:
    code = code[:scene_start_idx] + visual_and_scene_code + '\n' + code[scene_end_idx:]
    print("Replaced renderSceneCardHTML and added visuals successfully")
else:
    print("old_scene_fn_start not matched")

# 3. Update renderMasterLecture:
# - Change "VIDEO THUYẾT GIẢNG NƠ-RON" -> "THUYẾT GIẢNG"
code = code.replace('<span>VIDEO THUYẾT GIẢNG NƠ-RON</span>', '<span>THUYẾT GIẢNG</span>')

# - Remove technical bar with Cảnh 1, Cảnh 2, 00:00 / 00:27, Slide 1 / 5
old_tech_bar = '''        <!-- Video Canvas Bar: Scene switcher pills + Timeline -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-3 border-b border-slate-800/80">
          <div class="flex items-center space-x-2">
            ${scenes.map((sc, sIdx) => `
              <button onclick="switchScene(${sIdx})" id="btnSceneTab-${sIdx}" class="scene-tab-btn px-3 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${sIdx === currentSlideSceneIndex ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/20' : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'}">
                <span class="w-1.5 h-1.5 rounded-full ${sIdx === currentSlideSceneIndex ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}"></span>
                <span>Cảnh ${sIdx + 1}</span>
              </button>
            `).join("")}
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-[11px] font-mono text-cyan-400" id="slideTimeIndicator">00:00 / 00:27</span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              Slide ${currentSlideIndex + 1} / ${slides.length}
            </span>
          </div>
        </div>'''

if old_tech_bar in code:
    code = code.replace(old_tech_bar, '')
    print("Removed technical bar (Cảnh 1, 2, time indicator, slide count)")
else:
    print("old_tech_bar not matched directly")

# - Update audio button text: "🎧 Nghe Thuyết Giảng" / "⏸️ Tạm Dừng"
old_audio_btn_text = "<span>${isSlideAudioPlaying ? 'Tạm Dừng Lời Giảng' : '🎧 Nghe Thầy Thuyết Giảng Slide Này'}</span>"
new_audio_btn_text = "<span>${isSlideAudioPlaying ? '⏸️ Tạm Dừng' : '🎧 Nghe Thuyết Giảng'}</span>"
if old_audio_btn_text in code:
    code = code.replace(old_audio_btn_text, new_audio_btn_text)
    print("Updated audio button text to '🎧 Nghe Thuyết Giảng' / '⏸️ Tạm Dừng'")

with open(r'd:\WEB_HOC_TIENG_ANH_AI\js\app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("app.js updated successfully!")
