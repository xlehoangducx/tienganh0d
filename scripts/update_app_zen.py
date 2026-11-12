# -*- coding: utf-8 -*-
"""
Update js/app.js:
1. toggleSidebar with backdrop support and auto-close on selectLesson
2. formatTime helper
3. renderSceneCardHTML for full-width single-scene video experience
4. switchScene with cinematic GPU transition and smooth auto-scroll to center
5. renderMasterLecture with scene selector pills and full-width stage
6. toggleSlideAudio with single-tick scene switching (zero lag/stutter)
7. updateProgressUI with headerProgressBadge sync
"""

import os
import re

APP_PATH = r"d:\WEB_HOC_TIENG_ANH_AI\js\app.js"
with open(APP_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update toggleSidebar
old_sidebar_fn = r"window\.toggleSidebar\s*=\s*function\(\)\s*\{[\s\S]*?\};\n"
new_sidebar_fn = """window.toggleSidebar = function(forceClose) {
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
"""
content = re.sub(old_sidebar_fn, lambda m: new_sidebar_fn, content)

# 2. In selectLesson: ensure sidebar auto-closes
if "window.toggleSidebar(true);" not in content:
    content = content.replace("currentActiveLessonId = lesson.id;", "currentActiveLessonId = lesson.id;\n  window.toggleSidebar(true);")

# 3. Replace renderMasterLecture and slide functions
old_lecture_block = r"function renderMasterLecture\(lesson\)\s*\{[\s\S]*?window\.finishMasterLectureAndUnlockStep1\s*=\s*function\(\)\s*\{[\s\S]*?\};\n"

new_lecture_block = """let currentSlideSceneIndex = 0;

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
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

  return `
    <div class="scene-active-card p-5 sm:p-7 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl transition-all duration-300">
      <div class="flex items-center justify-between mb-3.5">
        <span class="px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border ${badgeClass}">
          ${sc.badge}
        </span>
        <span class="text-xs font-mono text-slate-500">
          Cảnh ${sIdx + 1} / ${totalScenes}
        </span>
      </div>

      <h3 class="text-lg sm:text-2xl font-black text-white mb-3.5 leading-snug">
        ${sc.title}
      </h3>

      <p class="text-sm sm:text-base text-slate-200 leading-relaxed mb-4 font-normal">
        ${sc.content}
      </p>

      ${sc.callout ? `
        <div class="p-4 rounded-xl border ${calloutBorder} flex items-start space-x-3 shadow-inner">
          <i data-lucide="${sc.icon || 'sparkles'}" class="w-5 h-5 flex-shrink-0 mt-0.5 text-current"></i>
          <div class="text-xs sm:text-sm font-medium leading-relaxed">
            ${sc.callout}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

window.switchScene = function(sIdx, isAuto) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const slide = lesson?.masterLecture?.slides?.[currentSlideIndex];
  if (!slide || !slide.scenes || !slide.scenes[sIdx]) return;

  currentSlideSceneIndex = sIdx;
  const container = document.getElementById("activeSceneContentContainer");
  if (!container) return;

  // Hiệu ứng chuyển cảnh mượt mà GPU-accelerated
  container.classList.add("scene-exit-left");
  setTimeout(() => {
    container.innerHTML = renderSceneCardHTML(slide.scenes[sIdx], sIdx, slide.scenes.length);
    container.classList.remove("scene-exit-left");
    container.classList.add("scene-enter-right");
    setTimeout(() => container.classList.remove("scene-enter-right"), 380);

    // Cập nhật trạng thái nút chuyển cảnh
    document.querySelectorAll(".scene-tab-btn").forEach((btn, idx) => {
      if (idx === sIdx) {
        btn.className = "scene-tab-btn px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/20";
        const dot = btn.querySelector("span");
        if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-ping";
      } else {
        btn.className = "scene-tab-btn px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800";
        const dot = btn.querySelector("span");
        if (dot) dot.className = "w-2 h-2 rounded-full bg-slate-600";
      }
    });

    if (window.lucide) window.lucide.createIcons();

    // Tự động căn chỉnh thẻ bài học về CHÍNH GIỮA MÀN HÌNH TẦM MẮT
    if (isAuto) {
      const card = document.getElementById("activeSlideCard");
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, 160);
};

function renderMasterLecture(lesson) {
  const container = document.getElementById("lectureContainer");
  if (!container) return;

  const lec = lesson.masterLecture;
  if (!lec || !lec.slides || lec.slides.length === 0) {
    container.innerHTML = `<div class="p-6 text-sm text-slate-400">Bài thuyết giảng đang được cập nhật...</div>`;
    return;
  }

  const slides = lec.slides;
  const currentSlide = slides[currentSlideIndex] || slides[0];
  const isFirst = currentSlideIndex === 0;
  const isLast = currentSlideIndex === slides.length - 1;
  const scenes = currentSlide.scenes || [];
  const currentScene = scenes[currentSlideSceneIndex] || scenes[0];

  container.innerHTML = `
    <div class="cyber-card p-4 sm:p-7 rounded-2xl relative overflow-hidden transition-all duration-300 w-full" id="slideStageMainCard">
      <!-- Glow background -->
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Header & Slide Progress Dots -->
      <div class="relative z-10 border-b border-slate-800 pb-3 mb-4">
        <div class="flex items-center justify-between gap-2 mb-2.5">
          <div class="flex items-center space-x-2">
            <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>VIDEO THUYẾT GIẢNG NƠ-RON</span>
            </span>
          </div>

          <!-- Slide Step Progress Dots -->
          <div class="flex items-center space-x-1.5">
            ${slides.map((s, idx) => `
              <button onclick="goToSlide(${idx})" class="h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlideIndex ? 'w-8 bg-emerald-400 shadow-md shadow-emerald-500/50' : idx < currentSlideIndex ? 'w-3 bg-emerald-700 hover:bg-emerald-600' : 'w-3 bg-slate-800 hover:bg-slate-700'}" title="Slide ${idx + 1}: ${s.title}"></button>
            `).join("")}
          </div>
        </div>

        <h2 class="text-base sm:text-xl md:text-2xl font-black text-white tracking-wide mb-1 leading-snug">
          ${currentSlide.title}
        </h2>
        <p class="text-xs sm:text-sm text-emerald-400 font-medium">
          ${currentSlide.subtitle}
        </p>
      </div>

      <!-- CINEMATIC VIDEO CANVAS (Full-Width, Centered, Zero Stutter) -->
      <div class="relative z-10 mb-4 p-4 sm:p-6 rounded-2xl bg-slate-900/95 border ${isSlideAudioPlaying ? 'border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40' : 'border-slate-800'} shadow-2xl transition-all duration-300" id="activeSlideCard">
        
        <!-- Video Canvas Bar: Scene switcher pills + Timeline -->
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
        </div>

        <!-- Video Time Progress Bar -->
        <div class="w-full bg-slate-950/80 rounded-full h-1.5 mb-4 overflow-hidden border border-slate-800">
          <div id="slideVideoProgressBar" class="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 video-progress-fill" style="width: 0%"></div>
        </div>

        <!-- ACTIVE SCENE CONTAINER (FULL WIDTH, PROMINENT TYPOGRAPHY, HARDWARE ACCELERATED ANIMATION) -->
        <div id="activeSceneContentContainer" class="video-scene-transition">
          ${renderSceneCardHTML(currentScene, currentSlideSceneIndex, scenes.length)}
        </div>
      </div>

      <!-- Slide Audio Player & Auto-Advance Control -->
      <div class="relative z-10 mb-4 p-3 sm:p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center space-x-3 w-full sm:w-auto">
          <button id="btnPlaySlideAudio" onclick="toggleSlideAudio()" class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold ${isSlideAudioPlaying ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'} transition flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0">
            <i data-lucide="${isSlideAudioPlaying ? 'pause' : 'play'}" class="w-4 h-4 fill-current"></i>
            <span>${isSlideAudioPlaying ? 'Tạm Dừng Lời Giảng' : '🎧 Nghe Thầy Thuyết Giảng Slide Này'}</span>
          </button>
          
          <div class="flex items-center space-x-1.5 ${isSlideAudioPlaying ? 'opacity-100' : 'opacity-30'} transition hidden sm:flex">
            <span class="w-1.5 h-4 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="w-1.5 h-6 bg-cyan-400 rounded-full animate-pulse" style="animation-delay: 150ms"></span>
            <span class="w-1.5 h-3 bg-teal-400 rounded-full animate-pulse" style="animation-delay: 300ms"></span>
            <span class="w-1.5 h-5 bg-emerald-400 rounded-full animate-pulse" style="animation-delay: 450ms"></span>
          </div>
        </div>

        <label class="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
          <input type="checkbox" id="chkAutoAdvance" onchange="toggleAutoAdvance(this.checked)" ${isSlideAutoAdvance ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 focus:ring-offset-slate-950 bg-slate-900 border-slate-700">
          <span>Tự động chuyển slide khi hết bài giảng</span>
        </label>
      </div>

      <!-- Slide Navigation Footer -->
      <div class="relative z-10 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button onclick="prevSlide()" ${isFirst ? 'disabled class="opacity-40 cursor-not-allowed px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-slate-500 border border-slate-800 flex items-center space-x-1.5"' : 'class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer"'}>
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
          <span>Slide Trước</span>
        </button>

        ${isLast ? `
          <div class="w-full sm:w-auto">
            <button onclick="finishMasterLectureAndUnlockStep1()" class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition flex items-center justify-center space-x-2 cursor-pointer">
              <span>🚀 Hoàn Thành Bài Thuyết Giảng • Mở Khóa Bước 1: Khẩu Hình</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        ` : `
          <button onclick="nextSlide()" class="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-emerald-500/40 flex items-center justify-center space-x-1.5 transition cursor-pointer">
            <span>Slide Tiếp Theo</span>
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        `}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

window.goToSlide = function(idx) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson?.masterLecture?.slides) return;
  window.stopAllAudios();
  isSlideAudioPlaying = false;
  currentSlideSceneIndex = 0;

  const card = document.getElementById("activeSlideCard");
  if (card) {
    card.classList.add("slide-card-fadeout");
    setTimeout(() => {
      currentSlideIndex = Math.max(0, Math.min(idx, lesson.masterLecture.slides.length - 1));
      renderMasterLecture(lesson);
    }, 140);
  } else {
    currentSlideIndex = Math.max(0, Math.min(idx, lesson.masterLecture.slides.length - 1));
    renderMasterLecture(lesson);
  }
};

window.nextSlide = function() {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson?.masterLecture?.slides) return;
  if (currentSlideIndex < lesson.masterLecture.slides.length - 1) {
    window.goToSlide(currentSlideIndex + 1);
  }
};

window.prevSlide = function() {
  if (currentSlideIndex > 0) {
    window.goToSlide(currentSlideIndex - 1);
  }
};

window.toggleAutoAdvance = function(checked) {
  isSlideAutoAdvance = !!checked;
};

window.toggleSlideAudio = function() {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const slide = lesson?.masterLecture?.slides?.[currentSlideIndex];
  if (!slide || !slide.audioFile) return;

  if (isSlideAudioPlaying) {
    window.stopAllAudios();
    isSlideAudioPlaying = false;
    renderMasterLecture(lesson);
    return;
  }

  isSlideAudioPlaying = true;
  renderMasterLecture(lesson);

  const audioTrack = window.playTrack(slide.audioFile, () => {
    isSlideAudioPlaying = false;
    renderMasterLecture(lesson);

    // Nếu bật tự động chuyển slide và chưa phải slide cuối
    if (isSlideAutoAdvance) {
      if (currentSlideIndex < lesson.masterLecture.slides.length - 1) {
        setTimeout(() => {
          window.nextSlide();
          setTimeout(() => {
            window.toggleSlideAudio();
          }, 400);
        }, 800);
      } else {
        // Slide cuối kết thúc: tự động mở khóa Bước 1
        window.unlockStep(1, false);
      }
    } else {
      if (currentSlideIndex === lesson.masterLecture.slides.length - 1) {
        window.unlockStep(1, false);
      }
    }
  }, () => {
    isSlideAudioPlaying = false;
    renderMasterLecture(lesson);
  });

  // Gắn listener ontimeupdate đồng bộ timeline video & chuyển cảnh duy nhất 1 lần khi đạt mốc 48%
  if (audioTrack) {
    audioTrack.ontimeupdate = function() {
      const pBar = document.getElementById("slideVideoProgressBar");
      const timeEl = document.getElementById("slideTimeIndicator");
      if (audioTrack.duration) {
        const pct = (audioTrack.currentTime / audioTrack.duration) * 100;
        if (pBar) pBar.style.width = `${pct}%`;
        if (timeEl) timeEl.textContent = `${formatTime(audioTrack.currentTime)} / ${formatTime(audioTrack.duration)}`;

        // Chỉ chuyển cảnh đúng 1 lần duy nhất khi audio vượt qua mốc thời gian 48%
        const targetScene = audioTrack.currentTime >= audioTrack.duration * 0.48 ? 1 : 0;
        if (targetScene !== currentSlideSceneIndex) {
          window.switchScene(targetScene, true);
        }
      }
    };
  }
};

window.finishMasterLectureAndUnlockStep1 = function() {
  window.stopAllAudios();
  isSlideAudioPlaying = false;
  window.unlockStep(1, true);
  window.scrollTo({ top: 120, behavior: 'smooth' });
};
"""

content = re.sub(old_lecture_block, lambda m: new_lecture_block, content)

# 4. In updateProgressUI: update headerProgressBadge
if 'const headerBadge = document.getElementById("headerProgressBadge");' not in content:
    content = content.replace(
        'if (percentEl) percentEl.textContent = `${phaseProgress}% Chặng ${currentMilestone.id}`;',
        'if (percentEl) percentEl.textContent = `${phaseProgress}% Chặng ${currentMilestone.id}`;\n  const headerBadge = document.getElementById("headerProgressBadge");\n  if (headerBadge) headerBadge.textContent = `${phaseProgress}%`;'
    )

with open(APP_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("app.js updated successfully with Zen mode and Video Slide Stage!")
