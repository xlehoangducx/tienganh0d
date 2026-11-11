# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Replace the old master lecture section with Slide Presentation & Guide Audio Engine
old_lecture_block = '''// ==============================================================
// 5.5. MODULE 0: BÀI THUYẾT GIẢNG KHAI MỞ TÂM TRÍ & CĂN CỨ KHOA HỌC
// ==============================================================
let currentLectureAudio = null;

window.narrateMasterLecture = function() {
  const audioPath = `assets/audio/lecture-${currentActiveLessonId}.mp3`;
  const btn = document.getElementById("btnNarrateLecture");

  if (currentLectureAudio) {
    currentLectureAudio.pause();
    currentLectureAudio = null;
    if (btn) {
      btn.innerHTML = `<i data-lucide="headphones" class="w-4 h-4"></i><span>🎧 Nghe Gia Sư Thuyết Giảng Bài Học</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
    return;
  }

  window.speechSynthesis.cancel();
  const audio = new Audio(audioPath);
  currentLectureAudio = audio;

  if (btn) {
    btn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4 text-amber-300 animate-pulse"></i><span class="text-amber-300">Đang phát lời giảng... (Bấm dừng)</span>`;
    if (window.lucide) window.lucide.createIcons();
  }

  audio.onended = function() {
    currentLectureAudio = null;
    if (btn) {
      btn.innerHTML = `<i data-lucide="headphones" class="w-4 h-4"></i><span>🎧 Nghe Gia Sư Thuyết Giảng Bài Học</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  };

  audio.onerror = function() {
    currentLectureAudio = null;
    if (btn) {
      btn.innerHTML = `<i data-lucide="headphones" class="w-4 h-4"></i><span>🎧 Nghe Gia Sư Thuyết Giảng Bài Học</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  };

  audio.play().catch(() => {
    currentLectureAudio = null;
    if (btn) {
      btn.innerHTML = `<i data-lucide="headphones" class="w-4 h-4"></i><span>🎧 Nghe Gia Sư Thuyết Giảng Bài Học</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  });
};

function renderMasterLecture(lesson) {
  const container = document.getElementById("lectureContainer");
  if (!container) return;

  const lec = lesson.masterLecture;
  if (!lec) {
    container.innerHTML = `<div class="p-6 text-sm text-slate-400">Bài thuyết giảng đang được cập nhật...</div>`;
    return;
  }

  container.innerHTML = `
    <div class="cyber-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
      <!-- Background glow -->
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header Section -->
      <div class="relative z-10 border-b border-slate-800 pb-5 mb-6">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
            <i data-lucide="award" class="w-3.5 h-3.5"></i>
            <span>Bài Thuyết Giảng Khai Mở Tâm Trí</span>
          </span>
          <span class="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
            ${lec.author || "Gia Sư Trí Tuệ Nhân Tạo"}
          </span>
          <span class="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
            ⏱️ ${lec.duration || "3 phút"}
          </span>
        </div>

        <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-wide mb-2 leading-snug">
          ${lec.title}
        </h2>
        <p class="text-sm text-emerald-400/90 font-medium leading-relaxed">
          ${lec.subtitle}
        </p>

        <!-- Audio Player Button -->
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <button id="btnNarrateLecture" onclick="narrateMasterLecture()" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/60 transition flex items-center space-x-2 border border-emerald-400/30">
            <i data-lucide="headphones" class="w-4 h-4"></i>
            <span>🎧 Nghe Gia Sư Thuyết Giảng Bài Học</span>
          </button>
          <span class="text-xs text-slate-400 italic">
            (Bật tai nghe để cảm nhận sâu sắc mục đích của bài học hôm nay)
          </span>
        </div>
      </div>

      <!-- 4 Key Takeaways Grid -->
      <div class="relative z-10 mb-8">
        <h3 class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center space-x-2">
          <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
          <span>Bốn Trụ Cột Nơ-ron Bạn Sẽ Làm Chủ Hôm Nay</span>
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${(lec.keyPoints || []).map(kp => `
            <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/30 transition">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                  <i data-lucide="${kp.icon || 'star'}" class="w-4 h-4"></i>
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-white mb-1">${kp.title}</h4>
                  <p class="text-xs text-slate-400 leading-relaxed">${kp.desc}</p>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Deep Explanation Essay -->
      <div class="relative z-10 mb-8">
        <h3 class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center space-x-2">
          <i data-lucide="book-open" class="w-4 h-4 text-cyan-400"></i>
          <span>Luận Giải Khoa Học Sư Phạm Dựa Trên Bằng Chứng (Evidence-Based SLA)</span>
        </h3>
        ${lec.deepExplanationHtml || ''}
      </div>

      <!-- Action Call to Action Button to step into Practice -->
      <div class="relative z-10 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900/60 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 class="text-sm font-bold text-white flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Bạn đã nắm trọn bản đồ tư duy của buổi học hôm nay?</span>
          </h4>
          <p class="text-xs text-slate-400 mt-1">
            Hãy kích hoạt cơ miệng và bước vào phòng luyện tập đa giác quan ngay bây giờ.
          </p>
        </div>
        <button onclick="switchLessonModule('moduleMouth'); window.scrollTo({top: 200, behavior: 'smooth'});" class="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 flex-shrink-0 cursor-pointer">
          <span>Bắt Đầu Bước 1: Khẩu Hình & Phát Âm</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}'''

new_lecture_block = '''// ==============================================================
// 5.5. MODULE 0: TRÌNH CHIẾU SLIDE THUYẾT GIẢNG TƯƠNG TÁC (SLIDE PRESENTATION SHOW)
// ==============================================================
let currentSlideIndex = 0;
let isSlideAutoAdvance = true;
let isSlideAudioPlaying = false;
let currentPlayingGuideStep = null;

// Reusable Helper: Render Teacher Guide Banner ở đầu mỗi module (Steps 1 to 6)
window.renderTeacherGuideBanner = function(stepNum, title, instruction) {
  const isPlaying = currentPlayingGuideStep === stepNum;
  return `
    <div class="mb-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
      <div class="flex items-start space-x-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
          <i data-lucide="headphones" class="w-4 h-4"></i>
        </div>
        <div>
          <div class="text-xs font-bold text-white flex items-center space-x-2">
            <span>${title}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Gia Sư Hải Đăng • 48kHz</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">${instruction}</p>
        </div>
      </div>
      <button id="btnGuideAudio-${stepNum}" onclick="playTeacherGuideAudio(${stepNum})" class="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold ${isPlaying ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'} transition flex items-center space-x-1.5 cursor-pointer">
        <i data-lucide="${isPlaying ? 'pause' : 'play'}" class="w-3.5 h-3.5 fill-current"></i>
        <span>${isPlaying ? 'Tạm Dừng' : '🎧 Nghe Lời Thầy Hướng Dẫn'}</span>
      </button>
    </div>
  `;
};

// Reusable Helper: Render Next Step Transition CTA
window.renderNextStepCTA = function(nextStepNum, label, tip) {
  return `
    <div class="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="text-xs text-slate-400 flex items-center space-x-1.5">
        <i data-lucide="info" class="w-3.5 h-3.5 text-cyan-400 flex-shrink-0"></i>
        <span>${tip}</span>
      </div>
      <button onclick="unlockStep(${nextStepNum}, true); window.scrollTo({top: 120, behavior: 'smooth'});" class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:scale-105 active:scale-95 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0">
        <span>${label}</span>
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>
    </div>
  `;
};

window.playTeacherGuideAudio = function(stepNum) {
  const audioFile = `assets/audio/guide-buoi-01-step-${stepNum}.mp3`;
  const btn = document.getElementById(`btnGuideAudio-${stepNum}`);

  if (currentPlayingGuideStep === stepNum) {
    window.stopAllAudios();
    currentPlayingGuideStep = null;
    if (btn) {
      btn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i><span>🎧 Nghe Lời Thầy Hướng Dẫn</span>`;
      btn.className = "flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition flex items-center space-x-1.5 cursor-pointer";
      if (window.lucide) window.lucide.createIcons();
    }
    return;
  }

  currentPlayingGuideStep = stepNum;
  if (btn) {
    btn.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5 text-amber-300 animate-pulse"></i><span class="text-amber-300">Đang phát lời thầy... (Bấm dừng)</span>`;
    btn.className = "flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 transition flex items-center space-x-1.5 cursor-pointer";
    if (window.lucide) window.lucide.createIcons();
  }

  window.playTrack(audioFile, () => {
    currentPlayingGuideStep = null;
    if (btn) {
      btn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i><span>🎧 Nghe Lời Thầy Hướng Dẫn</span>`;
      btn.className = "flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition flex items-center space-x-1.5 cursor-pointer";
      if (window.lucide) window.lucide.createIcons();
    }
  }, () => {
    currentPlayingGuideStep = null;
    if (btn) {
      btn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i><span>🎧 Nghe Lời Thầy Hướng Dẫn</span>`;
      btn.className = "flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition flex items-center space-x-1.5 cursor-pointer";
      if (window.lucide) window.lucide.createIcons();
    }
  });
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

  container.innerHTML = `
    <div class="cyber-card p-6 sm:p-8 rounded-2xl relative overflow-hidden transition-all duration-300">
      <!-- Glow background -->
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Header & Slide Progress Dots -->
      <div class="relative z-10 border-b border-slate-800 pb-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div class="flex items-center space-x-2">
            <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
              <i data-lucide="award" class="w-3.5 h-3.5"></i>
              <span>Bài Thuyết Giảng Khai Mở Tâm Trí</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
              ${lec.author || "Gia Sư Hải Đăng (Nam · Miền Bắc)"}
            </span>
          </div>

          <!-- Slide Step Progress Dots/Pills -->
          <div class="flex items-center space-x-1.5">
            ${slides.map((s, idx) => `
              <button onclick="goToSlide(${idx})" class="h-2 rounded-full transition-all duration-300 ${idx === currentSlideIndex ? 'w-8 bg-emerald-400 shadow-md shadow-emerald-500/50' : idx < currentSlideIndex ? 'w-3 bg-emerald-700 hover:bg-emerald-600' : 'w-3 bg-slate-800 hover:bg-slate-700'}" title="Slide ${idx + 1}: ${s.title}"></button>
            `).join("")}
            <span class="text-xs font-mono text-slate-400 ml-2">Slide ${currentSlideIndex + 1}/${slides.length}</span>
          </div>
        </div>

        <h2 class="text-xl sm:text-2xl font-black text-white tracking-wide mb-1 leading-snug">
          ${currentSlide.title}
        </h2>
        <p class="text-xs sm:text-sm text-emerald-400 font-medium">
          ${currentSlide.subtitle}
        </p>
      </div>

      <!-- Slide Main Visual Card (Animated) -->
      <div class="relative z-10 mb-6 p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-2xl transition-all duration-300 transform" id="activeSlideCard">
        <div class="flex items-start justify-between gap-3 mb-4 border-b border-slate-800/70 pb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <i data-lucide="${currentSlide.icon || 'sparkles'}" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">${currentSlide.badge || 'Trọng Tâm Nơ-ron'}</span>
              <h3 class="text-base sm:text-lg font-bold text-white">${currentSlide.title}</h3>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700">
            Slide ${currentSlideIndex + 1}
          </span>
        </div>

        <div class="slide-content-body">
          ${currentSlide.cardContent}
        </div>
      </div>

      <!-- Slide Audio Player & Auto-Advance Control -->
      <div class="relative z-10 mb-6 p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center space-x-3 w-full sm:w-auto">
          <button id="btnPlaySlideAudio" onclick="toggleSlideAudio()" class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold ${isSlideAudioPlaying ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'} transition flex items-center justify-center space-x-2 flex-shrink-0 cursor-pointer">
            <i data-lucide="${isSlideAudioPlaying ? 'pause' : 'play'}" class="w-4 h-4 fill-current"></i>
            <span>${isSlideAudioPlaying ? 'Tạm Dừng Lời Giảng' : '🎧 Nghe Thầy Thuyết Giảng Slide Này'}</span>
          </button>
          
          <div class="flex items-center space-x-1.5 ${isSlideAudioPlaying ? 'opacity-100' : 'opacity-30'} transition">
            <span class="w-1.5 h-4 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="w-1.5 h-6 bg-cyan-400 rounded-full animate-pulse" style="animation-delay: 150ms"></span>
            <span class="w-1.5 h-3 bg-teal-400 rounded-full animate-pulse" style="animation-delay: 300ms"></span>
            <span class="w-1.5 h-5 bg-emerald-400 rounded-full animate-pulse" style="animation-delay: 450ms"></span>
          </div>
        </div>

        <label class="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
          <input type="checkbox" id="chkAutoAdvance" onchange="toggleAutoAdvance(this.checked)" ${isSlideAutoAdvance ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 focus:ring-offset-slate-950 bg-slate-900 border-slate-700">
          <span>Tự động chuyển slide khi hết lời giảng (Mô phỏng video)</span>
        </label>
      </div>

      <!-- Slide Navigation Footer -->
      <div class="relative z-10 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button onclick="prevSlide()" ${isFirst ? 'disabled class="opacity-40 cursor-not-allowed px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-slate-500 border border-slate-800 flex items-center space-x-1.5"' : 'class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer"'}>
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
          <span>Slide Trước</span>
        </button>

        ${isLast ? `
          <div class="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
            <button onclick="finishMasterLectureAndUnlockStep1()" class="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition flex items-center justify-center space-x-2 cursor-pointer">
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
  currentSlideIndex = Math.max(0, Math.min(idx, lesson.masterLecture.slides.length - 1));
  renderMasterLecture(lesson);
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

  window.playTrack(slide.audioFile, () => {
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
};

window.finishMasterLectureAndUnlockStep1 = function() {
  window.stopAllAudios();
  isSlideAudioPlaying = false;
  window.unlockStep(1, true); // Mở khóa Bước 1 và tự động chuyển sang kèm phát âm thanh hướng dẫn
  window.scrollTo({ top: 120, behavior: 'smooth' });
};'''

if old_lecture_block in code:
    code = code.replace(old_lecture_block, new_lecture_block)
    print("Replaced old lecture block with Slide Presentation & Guide Audio Engine!")
else:
    print("WARNING: old_lecture_block not found exactly!")

with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved phase 2 to app.js!")
