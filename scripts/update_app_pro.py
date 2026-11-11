# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# ==============================================================
# 1. AUDIO MAP CHO VIENEU-TTS TRONG SPEAKTEXT
# ==============================================================
audio_map_def = '''// BẢNG ÁNH XẠ ÂM THANH VIENEU-TTS CHẤT LƯỢNG CAO 48kHz CHO TOÀN BỘ TỪ & CÂU
const VIENEU_AUDIO_MAP = {
  // Module 1: Từ vựng luyện âm
  "thank you": "assets/audio/thank-you.mp3",
  "think": "assets/audio/think.mp3",
  "nice": "assets/audio/nice.mp3",
  "thanks": "assets/audio/thanks.mp3",
  "see": "assets/audio/see.mp3",
  "meet": "assets/audio/meet.mp3",
  "great": "assets/audio/great.mp3",
  "wait": "assets/audio/wait.mp3",
  // Module 2: Cụm từ phản xạ cốt lõi & mở rộng
  "hi nice to meet you": "assets/audio/hi-nice-to-meet-you.mp3",
  "hi great to meet you": "assets/audio/hi-great-to-meet-you.mp3",
  "good to see you again": "assets/audio/good-to-see-you-again.mp3",
  "thank you so much": "assets/audio/thank-you-so-much.mp3",
  "thank you for your help": "assets/audio/thank-you-for-your-help.mp3",
  "thanks a lot": "assets/audio/thanks-a-lot.mp3",
  "have a great day": "assets/audio/have-a-great-day.mp3",
  "have a good one": "assets/audio/have-a-good-one.mp3",
  "take care see you later": "assets/audio/take-care-see-you-later.mp3"
};

export function speakText(text) {
  if (!text) return;
  const normKey = text.trim().toLowerCase().replace(/[.,!?;:"']/g, "").replace(/\\s+/g, " ").trim();
  const matchedAudio = VIENEU_AUDIO_MAP[normKey];
  
  if (matchedAudio) {
    window.playTrack(matchedAudio);
    return;
  }

  // Fallback sang Web Speech API nếu chưa có file MP3
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.88;
  const voices = window.speechSynthesis.getVoices();
  const usVoice = voices.find(v => v.lang === 'en-US' || v.lang.includes('US') || v.lang.includes('en'));
  if (usVoice) utterance.voice = usVoice;
  window.speechSynthesis.speak(utterance);
}
window.speakText = speakText;'''

# Replace old speakText definition
old_speak_pattern = '''// 1. CÔNG NGHỆ PHÁT ÂM GIỌNG MỸ & KỂ CHUYỆN TIẾNG VIỆT NGẮT NGHỈ CHUẨN
// ==============================================================
export function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert("Trình duyệt không hỗ trợ phát âm tự động.");
    return;
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.88;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const usVoice = voices.find(v => v.lang === 'en-US' || v.lang.includes('US') || v.lang.includes('en'));
  if (usVoice) utterance.voice = usVoice;

  window.speechSynthesis.speak(utterance);
}
window.speakText = speakText;'''

if old_speak_pattern in code:
    code = code.replace(old_speak_pattern, audio_map_def)
    print("Updated speakText with VIENEU_AUDIO_MAP!")
else:
    print("old_speak_pattern not found, searching alternative...")

# ==============================================================
# 2. XÓA BỎ CHỮ RƯỜM RÀ TRONG TOÀN BỘ CODE
# ==============================================================
code = code.replace("Gia Sư Trí Tuệ Nhân Tạo (Hải Đăng)", "")
code = code.replace("Gia Sư Hải Đăng • 48kHz", "")
code = code.replace("Gia Sư Hải Đăng", "")
code = code.replace(" • 48kHz", "")

# ==============================================================
# 3. CẢI TIẾN RENDER CURRICULUM TREE (CHỐNG TRÀN CHỮ & CẮT CỤT '...')
# ==============================================================
old_tree_start = 'function renderCurriculumTree() {'
new_tree_func = '''function renderCurriculumTree() {
  const container = document.getElementById("lessonTreeContainer");
  if (!container) return;

  const completed = (userProgress && userProgress.completedLessons) || [];

  const shortPhaseNames = {
    0: "Chặng 0: Khởi Động Khẩu Hình",
    1: "Chặng 1: Giao Tiếp Đời Thường",
    2: "Chặng 2: Nối Câu Đa Tầng",
    3: "Chặng 3: Phản Xạ Bản Xứ",
    4: "Chặng 4: Tự Do Ngôn Ngữ"
  };

  container.innerHTML = CURRICULUM_DATA.milestones.map(m => {
    const milestoneLessons = CURRICULUM_DATA.lessons.filter(l => l.phaseId === m.id);
    const phaseTitle = shortPhaseNames[m.id] || m.phaseName;

    return `
      <div class="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden mb-3">
        <!-- Milestone Header -->
        <div class="p-3 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden')">
          <div>
            <div class="text-[10px] font-mono uppercase text-cyan-400 font-bold">${m.badge || ''}</div>
            <div class="text-xs font-bold text-white break-words pr-1">${phaseTitle}</div>
          </div>
          <span class="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded flex-shrink-0">${m.targetProgress}</span>
        </div>

        <!-- Lessons List -->
        <div class="p-2 space-y-1.5">
          ${milestoneLessons.length > 0 ? milestoneLessons.map(l => {
            const isCompleted = completed.includes(l.id);
            const isActive = l.id === currentActiveLessonId;
            const unlocked = isLessonUnlocked(l);
            const shortLessonTitle = `Buổi ${l.sessionNumber < 10 ? '0' + l.sessionNumber : l.sessionNumber}: ${l.title.split('&')[0].trim()}`;

            if (!unlocked) {
              return `
                <div onclick="notifyLockedLesson(${l.sessionNumber})" 
                     class="p-2.5 rounded-lg text-xs cursor-not-allowed transition flex items-center justify-between text-slate-500 bg-slate-950/40 border border-slate-900/80 opacity-60">
                  <div class="flex items-center space-x-2 pr-2">
                    <i data-lucide="lock" class="w-3.5 h-3.5 text-slate-600 flex-shrink-0"></i>
                    <span class="break-words">${shortLessonTitle}</span>
                  </div>
                  <span class="text-[10px] font-mono text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded flex-shrink-0">Khóa</span>
                </div>
              `;
            }

            return `
              <div onclick="selectLesson('${l.id}')" 
                   class="p-2.5 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${isActive ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-300 hover:bg-slate-800/70 border border-transparent'}">
                <div class="flex items-center space-x-2 pr-2">
                  <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 ${isCompleted ? 'bg-emerald-400' : (isActive ? 'bg-cyan-400' : 'bg-slate-600')}"></span>
                  <span class="break-words">${shortLessonTitle}</span>
                </div>
                ${isCompleted ? '<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"></i>' : ''}
              </div>
            `;
          }).join("") : '<div class="text-[11px] text-slate-500 italic p-2">Đang biên soạn...</div>'}
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}'''

# Replace renderCurriculumTree
import re
tree_pattern = re.compile(r'function renderCurriculumTree\(\) \{.*?if \(window\.lucide\) window\.lucide\.createIcons\(\);\s*\}', re.DOTALL)
if tree_pattern.search(code):
    code = tree_pattern.sub(new_tree_func, code)
    print("Replaced renderCurriculumTree with clean non-truncated version!")

# ==============================================================
# 4. CẢI TIẾN RENDER LECTURE SLIDE (HIỆU ỨNG TRÌNH CHIẾU VIDEO ĐỘNG)
# ==============================================================
new_render_slide = '''function renderLectureSlide(slideIndex) {
  const container = document.getElementById("moduleLecture");
  if (!container) return;

  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson || !lesson.masterLecture || !lesson.masterLecture.slides) {
    container.innerHTML = `<div class="p-6 text-center text-slate-500">Bài giảng đang được cập nhật...</div>`;
    return;
  }

  const slides = lesson.masterLecture.slides;
  currentSlideIndex = Math.max(0, Math.min(slideIndex, slides.length - 1));
  const currentSlide = slides[currentSlideIndex];

  container.innerHTML = `
    <div class="cyber-card p-5 sm:p-7 rounded-2xl relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-[#07080d] border border-slate-800 shadow-2xl">
      <!-- Glow ambient backdrops -->
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Slide Header & Modern Step Progress Bar -->
      <div class="relative z-10 mb-5 border-b border-slate-800/80 pb-4">
        <div class="flex items-center justify-between gap-3 mb-3">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>BÀI THUYẾT GIẢNG KHAI MỞ NƠ-RON</span>
          </div>

          <!-- Slide Step Progress Dots -->
          <div class="flex items-center space-x-2">
            ${slides.map((s, idx) => `
              <button onclick="goToSlide(${idx})" class="h-2.5 rounded-full transition-all duration-300 ${idx === currentSlideIndex ? 'w-8 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-md shadow-emerald-500/40 ring-1 ring-emerald-300' : idx < currentSlideIndex ? 'w-3 bg-emerald-700 hover:bg-emerald-600' : 'w-3 bg-slate-800 hover:bg-slate-700'}" title="Slide ${idx + 1}: ${s.title}"></button>
            `).join("")}
          </div>
        </div>

        <h2 class="text-xl sm:text-2xl font-black text-white tracking-wide mb-1 leading-snug">
          ${currentSlide.title}
        </h2>
        <p class="text-xs sm:text-sm text-emerald-400 font-medium">
          ${currentSlide.subtitle}
        </p>
      </div>

      <!-- Slide Main Visual Card (Smooth Transition Container) -->
      <div class="relative z-10 mb-5 p-6 sm:p-7 rounded-2xl bg-slate-900/95 border ${isSlideAudioPlaying ? 'border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40' : 'border-slate-800'} shadow-2xl slide-card-active" id="activeSlideCard">
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
          
          <!-- Animated Audio Status Waveform -->
          ${isSlideAudioPlaying ? `
            <div class="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40">
              <span class="wave-bar" style="animation-delay: 0s"></span>
              <span class="wave-bar" style="animation-delay: 0.2s"></span>
              <span class="wave-bar" style="animation-delay: 0.4s"></span>
              <span class="wave-bar" style="animation-delay: 0.1s"></span>
              <span class="text-[10px] font-mono text-emerald-300 ml-1.5 font-bold">Đang Thuyết Giảng</span>
            </div>
          ` : `
            <span class="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-800/80 text-slate-400 border border-slate-700">
              Trang ${currentSlideIndex + 1}/${slides.length}
            </span>
          `}
        </div>

        <div class="slide-content-body text-base sm:text-lg leading-relaxed text-slate-200">
          ${currentSlide.cardContent}
        </div>
      </div>

      <!-- Slide Audio Player & Auto-Advance Control -->
      <div class="relative z-10 mb-5 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center space-x-3 w-full sm:w-auto">
          <button id="btnPlaySlideAudio" onclick="toggleSlideAudio()" class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold ${isSlideAudioPlaying ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-95'} transition flex items-center justify-center space-x-2 flex-shrink-0 cursor-pointer">
            <i data-lucide="${isSlideAudioPlaying ? 'pause' : 'play'}" class="w-4 h-4 fill-current"></i>
            <span>${isSlideAudioPlaying ? 'Tạm Dừng Lời Giảng' : '🎧 Nghe Thuyết Giảng Slide Này'}</span>
          </button>
        </div>

        <div class="flex items-center space-x-2 text-xs text-slate-300">
          <input type="checkbox" id="autoAdvanceSlideCheckbox" ${autoAdvanceSlide ? 'checked' : ''} onchange="toggleAutoAdvanceSlide(this.checked)" class="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer">
          <label for="autoAdvanceSlideCheckbox" class="cursor-pointer select-none">Tự động chuyển slide khi hết lời giảng (Mô phỏng video)</label>
        </div>
      </div>

      <!-- Slide Navigation Footer -->
      <div class="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-4">
        <button onclick="prevSlide()" ${currentSlideIndex === 0 ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="hover:text-white cursor-pointer"'} class="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 transition flex items-center space-x-1.5">
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
          <span>Slide Trước</span>
        </button>

        ${currentSlideIndex === slides.length - 1 ? `
          <button onclick="finishLectureAndGoToStep1()" class="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition flex items-center space-x-2 cursor-pointer">
            <span>Hoàn Thành Thuyết Giảng • Sang Bước 1: Khẩu Hình</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        ` : `
          <button onclick="nextSlide()" class="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center space-x-1.5 cursor-pointer">
            <span>Slide Tiếp Theo</span>
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        `}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}'''

slide_pattern = re.compile(r'function renderLectureSlide\(slideIndex\) \{.*?if \(window\.lucide\) window\.lucide\.createIcons\(\);\s*\}', re.DOTALL)
if slide_pattern.search(code):
    code = slide_pattern.sub(new_render_slide, code)
    print("Replaced renderLectureSlide with dynamic presentation version!")

# Smooth slide transitions in goToSlide
smooth_slide_func = '''window.goToSlide = function(idx) {
  const card = document.getElementById("activeSlideCard");
  if (card) {
    card.classList.add("slide-card-fadeout");
    setTimeout(() => {
      renderLectureSlide(idx);
    }, 150);
  } else {
    renderLectureSlide(idx);
  }
};'''
code = code.replace('window.goToSlide = function(idx) {\n  renderLectureSlide(idx);\n};', smooth_slide_func)

# ==============================================================
# 5. CẢI TIẾN SELECTMOUTHWORD ĐỂ CẬP NHẬT TRỰC QUAN GIAO DIỆN NÚT
# ==============================================================
new_select_mouth_word = '''window.selectMouthWord = function(techIdx, wordIdx) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson || !lesson.mouthTechniques || !lesson.mouthTechniques[techIdx]) return;
  const tech = lesson.mouthTechniques[techIdx];
  const wordObj = tech.words[wordIdx];
  if (!wordObj) return;

  selectedMouthWords[techIdx] = wordObj;
  speakText(wordObj.word);

  // Cập nhật DOM trực tiếp
  const wordEl = document.getElementById(`mouthTargetWord-${techIdx}`);
  const ipaEl = document.getElementById(`mouthTargetIpa-${techIdx}`);
  const meaningEl = document.getElementById(`mouthTargetMeaning-${techIdx}`);
  const feedbackEl = document.getElementById(`mouth-feedback-${techIdx}`);

  if (wordEl) wordEl.textContent = wordObj.word;
  if (ipaEl) ipaEl.textContent = wordObj.ipa || '';
  if (meaningEl) meaningEl.textContent = `Nghĩa: ${wordObj.meaning} ${wordObj.context ? '• ' + wordObj.context : ''}`;
  if (feedbackEl) feedbackEl.classList.add("hidden");

  // Cập nhật lại style của toàn bộ nút từ trong thẻ này
  const btnContainer = document.getElementById(`mouthWordsList-${techIdx}`);
  if (btnContainer) {
    const buttons = btnContainer.querySelectorAll("button");
    buttons.forEach((btn, bIdx) => {
      if (bIdx === wordIdx) {
        btn.className = "px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1 bg-cyan-500 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-300";
      } else {
        btn.className = "px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/30";
      }
    });
  }
};'''

select_word_pattern = re.compile(r'window\.selectMouthWord = function\(techIdx, wordIdx\) \{.*?if \(feedbackEl\) feedbackEl\.classList\.add\("hidden"\);\s*\}', re.DOTALL)
if select_word_pattern.search(code):
    code = select_word_pattern.sub(new_select_mouth_word, code)
    print("Replaced selectMouthWord with dynamic button styling!")

with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("app.js updated successfully!")
