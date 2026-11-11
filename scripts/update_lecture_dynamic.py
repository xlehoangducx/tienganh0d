# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update renderMasterLecture
old_lec_header = '''          <div class="flex items-center space-x-2">
            <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
              <i data-lucide="award" class="w-3.5 h-3.5"></i>
              <span>Bài Thuyết Giảng Khai Mở Tâm Trí</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
              ${lec.author || " (Nam · Miền Bắc)"}
            </span>
          </div>'''

new_lec_header = '''          <div class="flex items-center space-x-2">
            <span class="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>BÀI THUYẾT GIẢNG MỞ ĐẦU</span>
            </span>
          </div>'''

code = code.replace(old_lec_header, new_lec_header)

# Remove Slide 1/5 text
code = code.replace('<span class="text-xs font-mono text-slate-400 ml-2">Slide ${currentSlideIndex + 1}/${slides.length}</span>', '')
code = code.replace('''          <span class="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700">
            Slide ${currentSlideIndex + 1}
          </span>''', '''          <span class="px-3 py-1 rounded-full text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            Trang ${currentSlideIndex + 1}
          </span>''')

# Enhance activeSlideCard class with slide-card-active and conditional border glow
old_card_tag = '<div class="relative z-10 mb-6 p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-2xl transition-all duration-300 transform" id="activeSlideCard">'
new_card_tag = '<div class="relative z-10 mb-6 p-6 sm:p-7 rounded-2xl bg-slate-900/95 border ${isSlideAudioPlaying ? \'border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40\' : \'border-slate-800\'} shadow-2xl slide-card-active transition-all duration-300" id="activeSlideCard">'
code = code.replace(old_card_tag, new_card_tag)

# Update goToSlide for smooth transition
old_goto = '''window.goToSlide = function(idx) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson?.masterLecture?.slides) return;
  window.stopAllAudios();
  isSlideAudioPlaying = false;
  currentSlideIndex = Math.max(0, Math.min(idx, lesson.masterLecture.slides.length - 1));
  renderMasterLecture(lesson);
};'''

new_goto = '''window.goToSlide = function(idx) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson?.masterLecture?.slides) return;
  window.stopAllAudios();
  isSlideAudioPlaying = false;

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
};'''
code = code.replace(old_goto, new_goto)

# Update selectMouthWord to visually toggle active button
old_select_mouth = '''window.selectMouthWord = function(techIdx, wordIdx) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson || !lesson.mouthTechniques || !lesson.mouthTechniques[techIdx]) return;
  const tech = lesson.mouthTechniques[techIdx];
  const wordObj = tech.words[wordIdx];
  if (!wordObj) return;

  selectedMouthWords[techIdx] = wordObj;
  speakText(wordObj.word);

  // Cập nhật DOM trực tiếp không lo bị lệch từ
  const wordEl = document.getElementById(`mouthTargetWord-${techIdx}`);
  const ipaEl = document.getElementById(`mouthTargetIpa-${techIdx}`);
  const meaningEl = document.getElementById(`mouthTargetMeaning-${techIdx}`);
  const feedbackEl = document.getElementById(`mouth-feedback-${techIdx}`);

  if (wordEl) wordEl.textContent = wordObj.word;
  if (ipaEl) ipaEl.textContent = wordObj.ipa || '';
  if (meaningEl) meaningEl.textContent = `Nghĩa: ${wordObj.meaning} ${wordObj.context ? '• ' + wordObj.context : ''}`;
  if (feedbackEl) feedbackEl.classList.add("hidden");
};'''

new_select_mouth = '''window.selectMouthWord = function(techIdx, wordIdx) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson || !lesson.mouthTechniques || !lesson.mouthTechniques[techIdx]) return;
  const tech = lesson.mouthTechniques[techIdx];
  const wordObj = tech.words[wordIdx];
  if (!wordObj) return;

  selectedMouthWords[techIdx] = wordObj;
  speakText(wordObj.word);

  // Cập nhật DOM trực tiếp không lo bị lệch từ
  const wordEl = document.getElementById(`mouthTargetWord-${techIdx}`);
  const ipaEl = document.getElementById(`mouthTargetIpa-${techIdx}`);
  const meaningEl = document.getElementById(`mouthTargetMeaning-${techIdx}`);
  const feedbackEl = document.getElementById(`mouth-feedback-${techIdx}`);

  if (wordEl) wordEl.textContent = wordObj.word;
  if (ipaEl) ipaEl.textContent = wordObj.ipa || '';
  if (meaningEl) meaningEl.textContent = `Nghĩa: ${wordObj.meaning} ${wordObj.context ? '• ' + wordObj.context : ''}`;
  if (feedbackEl) feedbackEl.classList.add("hidden");

  // Cập nhật style nút trong thẻ này để người học thấy rõ từ đang chọn
  const listEl = document.getElementById(`mouthWordsList-${techIdx}`);
  if (listEl) {
    const buttons = listEl.querySelectorAll("button");
    buttons.forEach((btn, bIdx) => {
      if (bIdx === wordIdx) {
        btn.className = "px-2 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1 bg-cyan-500 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-300";
      } else {
        btn.className = "px-2 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/30";
      }
    });
  }
};'''
code = code.replace(old_select_mouth, new_select_mouth)

with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Master lecture, goToSlide, and selectMouthWord updated in app.js!")
