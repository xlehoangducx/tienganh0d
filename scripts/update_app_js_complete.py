# -*- coding: utf-8 -*-
"""
Update js/app.js with:
1. Video Slide Presentation renderer (renderMasterLecture, toggleSlideAudio with live progress & scene spotlight)
2. Unified dialogue turn playback (playDialogueTurnAudio, playFullConversationLoop using audioFile, replayCurrentTurnTarget)
"""

import os
import re

APP_PATH = r"d:\WEB_HOC_TIENG_ANH_AI\js\app.js"
with open(APP_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Check if renderMasterLecture has been updated
if "BÀI THUYẾT GIẢNG VIDEO NƠ-RON" in content:
    print("ℹ️ renderMasterLecture already updated with video canvas!")
else:
    old_lecture_block = r"function renderMasterLecture\(lesson\)\s*\{[\s\S]*?window\.finishMasterLectureAndUnlockStep1\s*=\s*function\(\)\s*\{[\s\S]*?\};\n"

    new_lecture_block = """function renderMasterLecture(lesson) {
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

  container.innerHTML = `
    <div class="cyber-card p-6 sm:p-8 rounded-2xl relative overflow-hidden transition-all duration-300">
      <!-- Glow background -->
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Header & Slide Progress Dots -->
      <div class="relative z-10 border-b border-slate-800 pb-4 mb-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div class="flex items-center space-x-2">
            <span class="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>BÀI THUYẾT GIẢNG VIDEO NƠ-RON</span>
            </span>
          </div>

          <!-- Slide Step Progress Dots/Pills -->
          <div class="flex items-center space-x-1.5">
            ${slides.map((s, idx) => `
              <button onclick="goToSlide(${idx})" class="h-2 rounded-full transition-all duration-300 ${idx === currentSlideIndex ? 'w-8 bg-emerald-400 shadow-md shadow-emerald-500/50' : idx < currentSlideIndex ? 'w-3 bg-emerald-700 hover:bg-emerald-600' : 'w-3 bg-slate-800 hover:bg-slate-700'}" title="Slide ${idx + 1}: ${s.title}"></button>
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

      <!-- Slide Cinematic Stage (Video Presentation Experience) -->
      <div class="relative z-10 mb-6 p-5 sm:p-7 rounded-2xl bg-slate-900/95 border ${isSlideAudioPlaying ? 'border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40' : 'border-slate-800'} shadow-2xl transition-all duration-300" id="activeSlideCard">
        
        <!-- Video Header Info Bar -->
        <div class="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
          <div class="flex items-center space-x-2.5">
            <span class="w-2.5 h-2.5 rounded-full ${isSlideAudioPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}"></span>
            <span class="text-xs font-mono uppercase tracking-wider ${isSlideAudioPlaying ? 'text-emerald-400 font-bold' : 'text-slate-400'}" id="slideVideoStatusText">
              ${isSlideAudioPlaying ? 'Đang phát video bài giảng • Đồng bộ âm thanh nơ-ron' : 'Chế độ trình chiếu từng cảnh'}
            </span>
          </div>
          <span class="px-3 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
            Slide ${currentSlideIndex + 1} / ${slides.length}
          </span>
        </div>

        <!-- Video Time Progress Bar -->
        <div class="w-full bg-slate-950/80 rounded-full h-1.5 mb-5 overflow-hidden border border-slate-800">
          <div id="slideVideoProgressBar" class="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 video-progress-fill" style="width: 0%"></div>
        </div>

        <!-- Distinct Cinematic Scenes (Video Keyframes) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="slideScenesGrid">
          ${scenes.map((sc, sIdx) => `
            <div id="slideSceneCard-${sIdx}" class="video-scene-card p-5 rounded-2xl bg-slate-950/60 border ${sc.theme === 'emerald' ? 'border-emerald-500/30' : sc.theme === 'cyan' ? 'border-cyan-500/30' : sc.theme === 'indigo' ? 'border-indigo-500/30' : sc.theme === 'purple' ? 'border-purple-500/30' : sc.theme === 'blue' ? 'border-blue-500/30' : 'border-amber-500/30'} flex flex-col justify-between" style="animation-delay: ${sIdx * 0.35}s">
              <div>
                <div class="flex items-center space-x-2 mb-2.5">
                  <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider ${sc.theme === 'emerald' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : sc.theme === 'cyan' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : sc.theme === 'indigo' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' : sc.theme === 'purple' ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' : sc.theme === 'blue' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}">
                    ${sc.badge}
                  </span>
                </div>
                <h4 class="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                  ${sc.title}
                </h4>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  ${sc.content}
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Cảnh ${sIdx + 1} / ${scenes.length}</span>
                <span class="flex items-center space-x-1 ${sc.theme === 'emerald' ? 'text-emerald-400' : sc.theme === 'cyan' ? 'text-cyan-400' : 'text-amber-400'}">
                  <i data-lucide="${sc.icon || 'sparkles'}" class="w-3.5 h-3.5"></i>
                  <span>Khắc sâu nơ-ron</span>
                </span>
              </div>
            </div>
          `).join("")}
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

  // Gắn listener ontimeupdate đồng bộ timeline tiến trình video & spotlight 2 cảnh
  if (audioTrack) {
    audioTrack.ontimeupdate = function() {
      const pBar = document.getElementById("slideVideoProgressBar");
      const statusText = document.getElementById("slideVideoStatusText");
      if (audioTrack.duration) {
        const pct = (audioTrack.currentTime / audioTrack.duration) * 100;
        if (pBar) pBar.style.width = `${pct}%`;

        const scene0 = document.getElementById("slideSceneCard-0");
        const scene1 = document.getElementById("slideSceneCard-1");
        if (audioTrack.currentTime < audioTrack.duration * 0.48) {
          if (scene0) {
            scene0.classList.add("is-active-spotlight");
            scene0.classList.remove("is-dimmed-spotlight");
          }
          if (scene1) {
            scene1.classList.remove("is-active-spotlight");
            scene1.classList.add("is-dimmed-spotlight");
          }
          if (statusText) statusText.textContent = "Đang thuyết giảng Cảnh 1 • Thực trạng & Vấn đề";
        } else {
          if (scene0) {
            scene0.classList.remove("is-active-spotlight");
            scene0.classList.add("is-dimmed-spotlight");
          }
          if (scene1) {
            scene1.classList.add("is-active-spotlight");
            scene1.classList.remove("is-dimmed-spotlight");
          }
          if (statusText) statusText.textContent = "Đang thuyết giảng Cảnh 2 • Giải pháp & Quy luật nơ-ron";
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
    print("✅ Replaced renderMasterLecture with lambda!")

# 2. Update renderDialogueTurns, playDialogueTurnAudio, playFullConversationLoop, replayCurrentTurnTarget
old_dialogue_block = r"function renderDialogueTurns\(\)\s*\{[\s\S]*?window\.replayCurrentTurnTarget\s*=\s*function\(\)\s*\{[\s\S]*?\};\n"

new_dialogue_block = """window.playDialogueTurnAudio = function(turnIndex) {
  if (!currentDialogueScenario || !currentDialogueScenario.turns) return;
  const turn = currentDialogueScenario.turns[turnIndex];
  if (!turn) return;

  // Highlight bubble
  document.querySelectorAll('[id^="dialogueBubble-"]').forEach(b => b.classList.remove('ring-2', 'ring-cyan-400', 'bg-cyan-950/30'));
  const bubble = document.getElementById(`dialogueBubble-${turnIndex}`);
  if (bubble) bubble.classList.add('ring-2', 'ring-cyan-400', 'bg-cyan-950/30');

  let audioPath = turn.audioFile;
  if (!audioPath) {
    const phrase = (turn.role === 'ai' ? turn.text : turn.targetText) || '';
    const normKey = phrase.trim().toLowerCase().replace(/[.,!?;:"']/g, "").replace(/\\s+/g, " ").trim();
    audioPath = VIENEU_AUDIO_MAP[normKey];
  }

  if (audioPath) {
    window.playTrack(audioPath);
  } else {
    speakText(turn.role === 'ai' ? turn.text : turn.targetText);
  }
};

function renderDialogueTurns() {
  const container = document.getElementById("dialogueTurnsContainer");
  if (!container || !currentDialogueScenario) return;

  const turns = currentDialogueScenario.turns || [];
  container.innerHTML = turns.map((turn, idx) => {
    const isAi = turn.role === 'ai';
    return `
      <div id="dialogueBubble-${idx}" class="p-3.5 sm:p-4 rounded-2xl transition-all duration-300 ${isAi ? 'bg-slate-900/90 border border-purple-500/20 mr-4 sm:mr-12' : 'bg-emerald-950/20 border border-emerald-500/30 ml-4 sm:ml-12'}">
        <div class="flex items-start space-x-3">
          <div class="w-8 h-8 rounded-xl ${isAi ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'} flex items-center justify-center font-bold text-base flex-shrink-0">
            ${isAi ? (currentDialogueScenario.characterAvatar || '👨‍💼') : '🙋'}
          </div>
          <div class="flex-grow">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold ${isAi ? 'text-purple-300' : 'text-emerald-400'}">${turn.speaker}</span>
              <button onclick="playDialogueTurnAudio(${idx})" class="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition cursor-pointer border border-slate-700">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                <span>Nghe</span>
              </button>
            </div>
            <div class="text-sm sm:text-base font-bold text-white mb-0.5">${isAi ? turn.text : turn.targetText}</div>
            <div class="text-[11px] font-mono text-slate-400 mb-1">${turn.ipa || ''}</div>
            <div class="text-xs text-slate-300">${turn.meaning}</div>
            ${turn.hint ? `<div class="text-[11px] text-amber-300/90 mt-1 italic">💡 <em>Mẹo: ${turn.hint}</em></div>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

function updateCurrentDialogueTurnUI() {
  if (userTurnsList.length === 0) return;
  const currentTurn = userTurnsList[currentDialogueTurnIndex];

  const targetTextEl = document.getElementById("currentTurnTargetText");
  const targetMeaningEl = document.getElementById("currentTurnTargetMeaning");
  const indicatorEl = document.getElementById("dialogueTurnIndicator");
  const resultBox = document.getElementById("speechResultBox");
  const micStatus = document.getElementById("micStatusText");

  if (targetTextEl) targetTextEl.textContent = currentTurn.targetText;
  if (targetMeaningEl) targetMeaningEl.textContent = `Nghĩa: ${currentTurn.meaning} • ${currentTurn.hint || ''}`;
  if (indicatorEl) indicatorEl.textContent = `Lượt đối thoại của bạn: ${currentDialogueTurnIndex + 1} / ${userTurnsList.length}`;
  if (resultBox) resultBox.classList.add("hidden");
  if (micStatus) micStatus.textContent = "Bấm nút Micro màu tím bên dưới và nói to câu tiếng Anh trên vào micro";
}

window.playFullConversationLoop = function() {
  if (!currentDialogueScenario || !currentDialogueScenario.turns) return;
  const turns = currentDialogueScenario.turns;
  let idx = 0;

  function playTurn() {
    if (idx >= turns.length) {
      document.querySelectorAll('[id^="dialogueBubble-"]').forEach(b => b.classList.remove('ring-2', 'ring-cyan-400', 'bg-cyan-950/30'));
      alert("🎉 Bạn vừa nghe trọn vẹn đoạn phim hội thoại tự nhiên cùng David!");
      return;
    }

    const turn = turns[idx];
    document.querySelectorAll('[id^="dialogueBubble-"]').forEach(b => b.classList.remove('ring-2', 'ring-cyan-400', 'bg-cyan-950/30'));
    const bubble = document.getElementById(`dialogueBubble-${idx}`);
    if (bubble) {
      bubble.classList.add('ring-2', 'ring-cyan-400', 'bg-cyan-950/30');
      bubble.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    let audioPath = turn.audioFile;
    if (!audioPath) {
      const phrase = (turn.role === 'ai' ? turn.text : turn.targetText) || '';
      const normKey = phrase.trim().toLowerCase().replace(/[.,!?;:"']/g, "").replace(/\\s+/g, " ").trim();
      audioPath = VIENEU_AUDIO_MAP[normKey];
    }

    if (audioPath) {
      window.playTrack(audioPath, () => {
        idx++;
        setTimeout(playTurn, 850);
      }, () => {
        const phrase = turn.role === 'ai' ? turn.text : turn.targetText;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'en-US';
        utterance.rate = 0.88;
        utterance.onend = function() {
          idx++;
          setTimeout(playTurn, 850);
        };
        window.speechSynthesis.speak(utterance);
      });
    } else {
      const phrase = turn.role === 'ai' ? turn.text : turn.targetText;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      utterance.onend = function() {
        idx++;
        setTimeout(playTurn, 850);
      };
      window.speechSynthesis.speak(utterance);
    }
  }

  playTurn();
};

window.replayCurrentTurnTarget = function() {
  if (userTurnsList.length === 0) return;
  const currentTurn = userTurnsList[currentDialogueTurnIndex];
  if (!currentTurn) return;

  if (currentTurn.audioFile) {
    window.playTrack(currentTurn.audioFile);
  } else {
    speakText(currentTurn.targetText);
  }
};
"""

if re.search(old_dialogue_block, content):
    content = re.sub(old_dialogue_block, lambda m: new_dialogue_block, content)
    print("✅ Replaced renderDialogueTurns, playDialogueTurnAudio and playFullConversationLoop!")
else:
    print("⚠️ old_dialogue_block pattern not matched in app.js")

with open(APP_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("app.js updated successfully!")
