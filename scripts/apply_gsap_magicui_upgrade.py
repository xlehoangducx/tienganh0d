import re

print("=== APPLYING GSAP + MAGIC UI + SHADER GRADIENT UPGRADE ===")

# ==============================================================
# 1. UPDATE DASHBOARD.HTML
# ==============================================================
with open(r'd:\WEB_HOC_TIENG_ANH_AI\dashboard.html', 'r', encoding='utf-8') as f:
    dash = f.read()

# Add GSAP to head if not present
if 'gsap.min.js' not in dash:
    gsap_tags = '''  <!-- GSAP 3.12.5 (GreenSock) & ScrollTrigger Presentation Engine -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
'''
    dash = dash.replace('<link rel="stylesheet" href="css/style.css">', gsap_tags + '  <link rel="stylesheet" href="css/style.css">')
    print("Added GSAP to dashboard.html head")

# Upgrade Mobile Focus Bar to 2-tier balanced layout
old_focus_bar_pattern = r'<!-- 1\. COMPACT UNIFIED TOP FOCUS BAR -->[\s\S]*?<!-- 2\. SINGLE-ROW'
new_focus_bar = '''<!-- 1. COMPACT UNIFIED FOCUS BAR (RESPONSIVE 2-TIER ON MOBILE, BALANCED ROW ON PC) -->
        <div class="px-1 space-y-1.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-2">
          
          <!-- Hàng 1 trên Mobile: [📖 Danh Mục Bài 0%] bên trái + [Pre-A1] [🧭 Lộ Trình] bên phải -->
          <div class="flex items-center justify-between sm:justify-start sm:space-x-2.5 w-full sm:w-auto">
            <button onclick="openCurriculumDrawer()" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-md flex-shrink-0" title="Mở danh mục các buổi học">
              <i data-lucide="book-open" class="w-4 h-4 text-emerald-400"></i>
              <span>Danh Mục Bài</span>
              <span id="headerProgressBadge" class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">0%</span>
            </button>

            <!-- Cấp độ & Đổi lộ trình (Trên Mobile đưa về góc phải hàng 1) -->
            <div class="flex items-center space-x-1.5 flex-shrink-0 sm:hidden">
              <span id="currentPhaseBadgeMobile" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">Pre-A1</span>
              <a href="tracks.html" class="px-2 py-1 rounded-lg text-xs bg-slate-800/90 text-slate-300 transition border border-slate-700 flex items-center space-x-1">
                <i data-lucide="compass" class="w-3.5 h-3.5 text-cyan-400"></i>
                <span>Lộ Trình</span>
              </a>
            </div>
          </div>

          <!-- Tiêu đề buổi học: Chiếm trọn bề ngang ở giữa, chữ rõ nét, không bị chèn ép -->
          <div class="text-center w-full min-w-0 px-1 py-0.5 sm:py-0">
            <h1 id="currentLessonTitle" class="text-sm sm:text-base md:text-lg font-black text-white glow-accent leading-snug">
              Buổi 01: Đánh Thức Cơ Miệng & 3 Cụm Giao Tiếp
            </h1>
          </div>

          <!-- Cấp độ & Đổi lộ trình trên PC (Ẩn trên Mobile vì đã có ở hàng 1) -->
          <div class="hidden sm:flex items-center space-x-1.5 flex-shrink-0">
            <span id="currentPhaseBadge" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">Pre-A1</span>
            <a href="tracks.html" class="px-2.5 py-1 rounded-lg text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 flex items-center space-x-1">
              <i data-lucide="compass" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span class="hidden md:inline">Đổi Lộ Trình</span>
            </a>
          </div>
        </div>

        <!-- 2. SINGLE-ROW'''

if re.search(old_focus_bar_pattern, dash):
    dash = re.sub(old_focus_bar_pattern, lambda m: new_focus_bar, dash)
    print("Upgraded Focus Bar in dashboard.html for mobile responsiveness")
else:
    print("Focus bar pattern not matched in dashboard.html")

# Add border-beam to activeSlideCard container class
dash = dash.replace('id="activeSlideCard"', 'id="activeSlideCard" class="border-beam"')

with open(r'd:\WEB_HOC_TIENG_ANH_AI\dashboard.html', 'w', encoding='utf-8') as f:
    f.write(dash)


# ==============================================================
# 2. UPDATE JS/APP.JS WITH GSAP ZERO-FLASH SCENE TRANSITION
# ==============================================================
with open(r'd:\WEB_HOC_TIENG_ANH_AI\js\app.js', 'r', encoding='utf-8') as f:
    app = f.read()

# Replace switchScene function
old_switch_scene_pattern = r'window\.switchScene = function\(sIdx, isAuto\) \{[\s\S]*?\n\};'

new_switch_scene = '''window.switchScene = function(sIdx, isAuto) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const slide = lesson?.masterLecture?.slides?.[currentSlideIndex];
  if (!slide || !slide.scenes || !slide.scenes[sIdx]) return;
  if (currentSlideSceneIndex === sIdx && !isAuto) return;

  currentSlideSceneIndex = sIdx;
  const container = document.getElementById("activeSceneContentContainer");
  if (!container) return;

  if (window.gsap) {
    // GSAP BUTTERY SMOOTH CROSS-DISSOLVE (TUYỆT ĐỐI KHÔNG CHỚP ĐEN)
    gsap.killTweensOf(container);
    gsap.to(container, {
      opacity: 0.35, // Giữ 35% hiển thị, KHÔNG BAO GIỜ để opacity: 0 gây chớp đen
      x: -10,
      scale: 0.995,
      duration: 0.22,
      ease: "power2.inOut",
      onComplete: () => {
        container.innerHTML = renderSceneCardHTML(slide.scenes[sIdx], sIdx, slide.scenes.length);
        if (window.lucide) window.lucide.createIcons();

        // Lướt vào êm ái
        gsap.fromTo(container,
          { opacity: 0.35, x: 12, scale: 0.995 },
          { opacity: 1, x: 0, scale: 1, duration: 0.42, ease: "power2.out" }
        );

        // Stagger các dòng điểm con
        const points = container.querySelectorAll("[class*='motion-beat-point-']");
        if (points.length > 0) {
          gsap.fromTo(points,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.09, ease: "power2.out" }
          );
        }

        if (isAuto) {
          const card = document.getElementById("activeSlideCard");
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  } else {
    // Fallback mượt mà không GSAP
    container.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    container.style.opacity = "0.4";
    setTimeout(() => {
      container.innerHTML = renderSceneCardHTML(slide.scenes[sIdx], sIdx, slide.scenes.length);
      if (window.lucide) window.lucide.createIcons();
      container.style.opacity = "1";
      if (isAuto) {
        const card = document.getElementById("activeSlideCard");
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }
};'''

if re.search(old_switch_scene_pattern, app):
    app = re.sub(old_switch_scene_pattern, lambda m: new_switch_scene, app)
    print("Upgraded switchScene in app.js with GSAP zero-flash transition")
else:
    print("switchScene pattern not matched in app.js")

# In selectLesson, update mobile phase badge as well
app = app.replace(
    'if (phaseBadge && milestone) phaseBadge.textContent = milestone.badge;',
    '''if (phaseBadge && milestone) phaseBadge.textContent = milestone.badge;
  const phaseBadgeMobile = document.getElementById("currentPhaseBadgeMobile");
  if (phaseBadgeMobile && milestone) phaseBadgeMobile.textContent = milestone.badge;'''
)

with open(r'd:\WEB_HOC_TIENG_ANH_AI\js\app.js', 'w', encoding='utf-8') as f:
    f.write(app)


# ==============================================================
# 3. UPDATE INDEX.HTML WITH GSAP, SHADER GRADIENT & MAGIC UI
# ==============================================================
with open(r'd:\WEB_HOC_TIENG_ANH_AI\index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# Add GSAP to head if not present
if 'gsap.min.js' not in idx:
    idx = idx.replace(
        '<link rel="stylesheet" href="css/style.css">',
        '''  <!-- GSAP 3.12.5 & ScrollTrigger Presentation Engine -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <link rel="stylesheet" href="css/style.css">'''
    )
    print("Added GSAP to index.html head")

# Add Shimmer Button class to main CTA
idx = idx.replace(
    'class="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition flex items-center justify-center space-x-2 w-full sm:w-auto"',
    'class="shimmer-btn border-beam px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition flex items-center justify-center space-x-2 w-full sm:w-auto cursor-pointer"'
)

# Add GSAP Presentation Reveal Script before </body>
gsap_presentation_script = '''  <!-- GSAP PRESENTATION & SCROLLTRIGGER REVEAL ENGINE -->
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      if (window.gsap) {
        if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

        // 1. Hero Presentation Reveal (Keynote style)
        gsap.from("#heroHeaderArea > *", {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.15,
          ease: "power3.out"
        });

        // 2. Language Matrix Cards Reveal on Scroll
        if (window.ScrollTrigger) {
          gsap.from(".matrix-track-card", {
            scrollTrigger: {
              trigger: "#languageMatrixSection",
              start: "top 80%",
              toggleActions: "play none none none"
            },
            y: 35,
            opacity: 0,
            scale: 0.97,
            duration: 0.7,
            stagger: 0.18,
            ease: "power2.out"
          });
        }
      }
    });
  </script>
</body>'''

if 'GSAP PRESENTATION & SCROLLTRIGGER' not in idx:
    idx = idx.replace('</body>', gsap_presentation_script)
    print("Added GSAP Presentation script to index.html")

with open(r'd:\WEB_HOC_TIENG_ANH_AI\index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

print("Upgrade script completed successfully!")
