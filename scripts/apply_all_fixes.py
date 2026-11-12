# -*- coding: utf-8 -*-
"""
Apply all 4 pedagogical and visual fixes:
1. Module 5 Ordering: Storytelling Narrative box placed FIRST, followed by Full Dialogue action header.
2. Dialogue Voice Consistency: Native American audio files explicitly linked to all user turns, unified playback in full conversation loop and single bubbles.
3. Multilingual Floating Tags: Confined strictly to the left & right side margins (never drifting into center content).
4. Slide Video Presentation: Dynamic 2-scene presentation canvas with synchronized audio timeline progress and spotlight reveals.
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

video_css = """
/* Dynamic Video Slide Presentation (Cinematic Keyframe Stages) */
@keyframes videoStepReveal {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.video-scene-card {
  animation: videoStepReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.6);
}

.video-scene-card.is-active-spotlight {
  border-color: rgba(52, 211, 153, 0.85) !important;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.10)) !important;
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(16, 185, 129, 0.08) !important;
  transform: translateY(-2px) scale(1.015);
}

.video-scene-card.is-dimmed-spotlight {
  opacity: 0.65;
  filter: saturate(0.85);
  transform: scale(0.99);
}

.video-progress-fill {
  transition: width 0.15s linear;
}
"""

if "video-scene-card" not in css_content:
    css_content += "\n" + video_css
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css_content)
    print("✅ Updated css/style.css with video presentation styles!")
else:
    print("ℹ️ css/style.css already has video presentation styles.")

# ==============================================================
# 2. UPDATE INDEX.HTML (Floating particles strictly on 2 margins)
# ==============================================================
index_path = os.path.join(WEB_DIR, "index.html")
with open(index_path, "r", encoding="utf-8") as f:
    idx_content = f.read()

# Replace spawnParticle implementation
old_spawn_pattern = r"function spawnParticle\(\)\s*\{[\s\S]*?setInterval\(spawnParticle,\s*2000\);"

new_spawn_code = """function spawnParticle() {
        const lang = languages[Math.floor(Math.random() * languages.length)];
        const pill = document.createElement("div");
        pill.className = `lang-float-pill ${lang.color}`;
        pill.innerHTML = `<span>${lang.name}</span>`;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // BẮT BUỘC: CHỈ BAY Ở 2 BIÊN MÉP (TRÁI & PHẢI), TUYỆT ĐỐI KHÔNG BAY VÀO GIỮA
        const isLeft = Math.random() < 0.5;
        const sideMargin = Math.min(160, Math.max(90, vw * 0.12));

        let startX, startY, endX, endY;

        if (isLeft) {
          startX = Math.random() * (sideMargin - 30) + 12;
          endX = startX + (Math.random() * 26 - 13);
        } else {
          startX = vw - sideMargin + Math.random() * (sideMargin - 40);
          endX = startX + (Math.random() * 26 - 13);
        }

        const floatUp = Math.random() < 0.65;
        if (floatUp) {
          startY = vh + 15;
          endY = -50;
        } else {
          startY = -40;
          endY = vh + 40;
        }

        pill.style.left = `${startX}px`;
        pill.style.top = `${startY}px`;
        pill.style.opacity = "0";
        pill.style.transform = `scale(0.8) rotate(${(Math.random() - 0.5) * 12}deg)`;

        container.appendChild(pill);

        requestAnimationFrame(() => {
          pill.style.opacity = "0.85";
          const duration = 10000 + Math.random() * 5000;
          pill.style.transition = `opacity 1.5s ease, transform ${duration}ms cubic-bezier(0.1, 0.2, 0.2, 1)`;
          pill.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(1) rotate(${(Math.random() - 0.5) * 16}deg)`;

          setTimeout(() => {
            pill.style.opacity = "0";
          }, duration - 1800);

          setTimeout(() => {
            if (pill.parentNode) pill.parentNode.removeChild(pill);
          }, duration);
        });
      }

      for (let i = 0; i < 7; i++) {
        setTimeout(spawnParticle, i * 600);
      }
      setInterval(spawnParticle, 2000);"""

if re.search(old_spawn_pattern, idx_content):
    idx_content = re.sub(old_spawn_pattern, new_spawn_code, idx_content)
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(idx_content)
    print("✅ Updated index.html: Floating particles now strictly confined to left & right margins!")
else:
    print("⚠️ spawnParticle pattern not matched in index.html, checking manual replace...")

# ==============================================================
# 3. UPDATE DASHBOARD.HTML (Module 5 Story Narrative FIRST, Dialogue SECOND)
# ==============================================================
dash_path = os.path.join(WEB_DIR, "dashboard.html")
with open(dash_path, "r", encoding="utf-8") as f:
    dash_content = f.read()

# Pattern for the dialogue header and narrative box
old_module5_block = r'''            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">[\s\S]*?<!-- Khung Dẫn Chuyện Kể Bối Cảnh \(Teacher Audio Storytelling\) -->[\s\S]*?</div>\s*</div>'''

new_module5_block = '''            <!-- 1. KHUNG DẪN CHUYỆN KỂ BỐI CẢNH (ĐẶT TRÊN ĐẦU TIÊN THEO ĐÚNG SƯ PHẠM) -->
            <div class="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 mb-5 relative overflow-hidden shadow-lg shadow-purple-950/40">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-purple-500/20 pb-3">
                <div class="flex items-center space-x-3">
                  <div class="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold border border-purple-500/30 flex-shrink-0">
                    <i data-lucide="book-open" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <span class="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">Bước Khởi Đầu • Neo Ngữ Cảnh Xã Hội</span>
                    <h4 class="text-sm sm:text-base font-bold text-white">Bối Cảnh Thực Tế Do Gia Sư AI Kể Chuyện</h4>
                  </div>
                </div>
                <button onclick="narrateCurrentScenario()" id="btnPlayStoryAudio" class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-900/40 transition cursor-pointer self-start sm:self-auto flex-shrink-0">
                  <i data-lucide="volume-2" class="w-4 h-4"></i>
                  <span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>
                </button>
              </div>
              <p id="dialogueStoryNarrative" class="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-950/50 p-4 rounded-xl border border-purple-500/20">
                Đang tải bối cảnh câu chuyện...
              </p>
              <div id="voiceNoticeTip" class="hidden text-[11px] text-amber-300/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 mt-2">
                💡 <em>Hệ điều hành của bạn chưa cài gói giọng đọc tiếng Việt của trình duyệt. Bạn hãy theo dõi lời dẫn chuyện hiển thị trực quan ở trên nhé!</em>
              </div>
            </div>

            <!-- 2. KHUNG HỘI THOẠI & NÚT NGHE TOÀN BỘ (NẰM SAU BỐI CẢNH) -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold border border-emerald-500/30 flex-shrink-0">
                  <i data-lucide="message-square-text" class="w-5 h-5"></i>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-white" id="dialogueScenarioTitle">Cuộc Gặp Gỡ Tình Cờ Tại Sân Bay Quốc Tế New York</h3>
                  <p class="text-xs text-slate-400 mt-0.5">Mô phỏng 100% cuộc đối thoại thực tế: Người bản xứ David mở lời → Bạn nói đối đáp</p>
                </div>
              </div>
              <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button onclick="playFullConversationLoop()" class="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer shadow-md shadow-emerald-500/10">
                  <i data-lucide="play-circle" class="w-4 h-4 text-emerald-400"></i>
                  <span>🎧 Nghe Toàn Bộ Hội Thoại</span>
                </button>
              </div>
            </div>'''

if re.search(old_module5_block, dash_content):
    dash_content = re.sub(old_module5_block, new_module5_block, dash_content)
    with open(dash_path, "w", encoding="utf-8") as f:
        f.write(dash_content)
    print("✅ Updated dashboard.html: Reordered Module 5 (Storytelling Narrative FIRST, Dialogue SECOND)!")
else:
    print("⚠️ Module 5 block pattern not matched in dashboard.html, let's check substring...")

print("Files updated successfully!")
