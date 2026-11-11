// ============================================================================
// HỆ ĐIỀU HÀNH HỌC TẬP AI (COGNITIVE LEARNING OS ENGINE) - PHIÊN BẢN 2.2 ĐÃ KIỂM ĐỊNH
// Khắc phục triệt để lỗi ngầm, đồng bộ khẩu hình động, xác thực lặp 7 lần thực chất,
// phòng luyện nói đối thoại tương tác trực tiếp và khóa bài học tuần tự nơ-ron
// ============================================================================

import { setupAuthUI, getAllStudents, updateStudentStatus } from "./auth.js";
import { CURRICULUM_DATA } from "./curriculum-data.js";
import { DONATE_CONFIG } from "./donate-config.js";
import { loadUserProgress, saveLessonCompletion } from "./user-progress.js";
import { playCorrectSound, playIncorrectSound, playVictorySound, playClickSound } from "./sound-effects.js";

let currentUser = null;
let currentProfile = null;
let userProgress = null;
let currentActiveLessonId = "buoi-01";
let userQuizScore = 0;
let answeredCount = 0;

// Bộ nhớ lưu từ đang chọn luyện phát âm trong Module 1: { [techIdx]: wordObject }
const selectedMouthWords = {};

// ==============================================================
// BỘ NHỚ THEO DÕI SỐ LẦN LẶP ĐA GIÁC QUAN (XÁC THỰC THỰC CHẤT 4 KÊNH - MAX 7 ĐIỂM)
// Không cho phép bấm nút "Nghe" liên tục để gian lận số lần lặp
// ==============================================================
const neuroRepetitionStats = JSON.parse(localStorage.getItem('ai_english_neuro_reps_v2') || '{}');

function getChunkRepetitionData(phrase) {
  if (!neuroRepetitionStats[phrase] || typeof neuroRepetitionStats[phrase] !== 'object') {
    neuroRepetitionStats[phrase] = {
      listened: false,        // 1 điểm: Đã nghe mẫu ít nhất 1 lần
      spokenCorrectly: false, // 2 điểm: Đã nói vào micro và AI chấm >= 70%
      typedCorrectly: false,  // 2 điểm: Đã xếp chữ hoặc gõ chính tả đúng
      dialoguePassed: false   // 2 điểm: Đã đối đáp chuẩn trong kịch bản nhập vai
    };
  }
  return neuroRepetitionStats[phrase];
}

function calculateRepetitionScore(data) {
  let score = 0;
  if (data.listened) score += 1;
  if (data.spokenCorrectly) score += 2;
  if (data.typedCorrectly) score += 2;
  if (data.dialoguePassed) score += 2;
  return Math.min(7, score);
}

function saveRepetitionStats() {
  localStorage.setItem('ai_english_neuro_reps_v2', JSON.stringify(neuroRepetitionStats));
}

function updateChunkUIBadge(phrase) {
  const data = getChunkRepetitionData(phrase);
  const score = calculateRepetitionScore(data);

  const countEl = document.getElementById(`rep-count-${phrase}`);
  const barEl = document.getElementById(`rep-bar-${phrase}`);
  const statusEl = document.getElementById(`rep-status-${phrase}`);
  const tagsEl = document.getElementById(`rep-tags-${phrase}`);

  if (countEl) countEl.textContent = `${score}/7 lần`;
  if (barEl) {
    barEl.style.width = `${(score / 7) * 100}%`;
    if (score >= 7) {
      barEl.className = "h-full rounded-full transition-all duration-500 bg-emerald-400";
    } else if (score >= 3) {
      barEl.className = "h-full rounded-full transition-all duration-500 bg-amber-400";
    } else {
      barEl.className = "h-full rounded-full transition-all duration-500 bg-cyan-400";
    }
  }
  if (statusEl) {
    if (score >= 7) {
      statusEl.className = "text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold";
      statusEl.textContent = "Đã khắc sâu vĩnh viễn ✨";
    } else if (score >= 3) {
      statusEl.className = "text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold";
      statusEl.textContent = "Phản xạ cơ miệng";
    } else {
      statusEl.className = "text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold";
      statusEl.textContent = "Ghi nhận âm thanh";
    }
  }
  if (tagsEl) {
    tagsEl.innerHTML = `
      <span class="text-[9px] px-1.5 py-0.5 rounded font-mono ${data.listened ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'bg-slate-800 text-slate-500'}">🎧 Nghe ${data.listened ? '✓' : '○'}</span>
      <span class="text-[9px] px-1.5 py-0.5 rounded font-mono ${data.spokenCorrectly ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-500'}">🎙️ Nói ≥70% ${data.spokenCorrectly ? '✓' : '○'}</span>
      <span class="text-[9px] px-1.5 py-0.5 rounded font-mono ${data.typedCorrectly ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-slate-800 text-slate-500'}">⌨️ Gõ đúng ${data.typedCorrectly ? '✓' : '○'}</span>
      <span class="text-[9px] px-1.5 py-0.5 rounded font-mono ${data.dialoguePassed ? 'bg-purple-500/20 text-purple-300 font-bold' : 'bg-slate-800 text-slate-500'}">💬 Đối thoại ${data.dialoguePassed ? '✓' : '○'}</span>
    `;
  }
}

function markChunkListened(phrase) {
  const data = getChunkRepetitionData(phrase);
  if (!data.listened) {
    data.listened = true;
    saveRepetitionStats();
    updateChunkUIBadge(phrase);
  }
}

function markChunkSpoken(phrase) {
  const data = getChunkRepetitionData(phrase);
  if (!data.spokenCorrectly) {
    data.spokenCorrectly = true;
    saveRepetitionStats();
    updateChunkUIBadge(phrase);
    if (calculateRepetitionScore(data) === 7) playVictorySound();
  }
}

function markChunkTyped(phrase) {
  // Tìm cụm từ tương ứng
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const matchedChunk = (lesson?.chunks || []).find(c => normalizeText(c.phrase) === normalizeText(phrase));
  const targetPhrase = matchedChunk ? matchedChunk.phrase : phrase;

  const data = getChunkRepetitionData(targetPhrase);
  if (!data.typedCorrectly) {
    data.typedCorrectly = true;
    saveRepetitionStats();
    updateChunkUIBadge(targetPhrase);
    if (calculateRepetitionScore(data) === 7) playVictorySound();
  }
}

function markChunkDialogue(phrase) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const matchedChunk = (lesson?.chunks || []).find(c => normalizeText(c.phrase) === normalizeText(phrase));
  const targetPhrase = matchedChunk ? matchedChunk.phrase : phrase;

  const data = getChunkRepetitionData(targetPhrase);
  if (!data.dialoguePassed) {
    data.dialoguePassed = true;
    saveRepetitionStats();
    updateChunkUIBadge(targetPhrase);
    if (calculateRepetitionScore(data) === 7) playVictorySound();
  }
}

// ==============================================================
// BẢNG ÁNH XẠ ÂM THANH VIENEU-TTS CHẤT LƯỢNG CAO 48kHz CHO TOÀN BỘ TỪ & CÂU
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
  const normKey = text.trim().toLowerCase().replace(/[.,!?;:"']/g, "").replace(/\s+/g, " ").trim();
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
window.speakText = speakText;
window.playClickSound = playClickSound;

// Đọc tiếng Việt có ngắt nghỉ tự nhiên giữa các câu, tránh đọc liên tục hoặc dùng nhầm giọng Mỹ
export function speakVietnamese(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(v => 
    (v.lang && (v.lang === 'vi-VN' || v.lang === 'vi_VN' || v.lang.startsWith('vi'))) ||
    (v.name && v.name.toLowerCase().includes('vietnam'))
  );

  const noticeEl = document.getElementById("voiceNoticeTip");

  if (!viVoice) {
    // Nếu hệ điều hành không có giọng tiếng Việt, hiện thông báo tinh tế và không ép giọng Mỹ đọc
    if (noticeEl) noticeEl.classList.remove("hidden");
    return;
  } else {
    if (noticeEl) noticeEl.classList.add("hidden");
  }

  // Tách thành từng câu theo dấu chấm, chấm than, hỏi chấm để có nhịp thở tự nhiên
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let sIndex = 0;

  function playSentence() {
    if (sIndex >= sentences.length) return;
    const currentSentence = sentences[sIndex].trim();
    if (!currentSentence) {
      sIndex++;
      playSentence();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.voice = viVoice;
    utterance.lang = 'vi-VN';
    utterance.rate = 0.90; // Nhịp độ truyền cảm, chậm rãi
    utterance.pitch = 1.0;

    utterance.onend = function() {
      sIndex++;
      setTimeout(playSentence, 350); // Nghỉ 350ms giữa 2 câu như người thật
    };

    utterance.onerror = function(err) {
      console.warn("Lỗi đọc câu tiếng Việt:", err);
    };

    window.speechSynthesis.speak(utterance);
  }

  playSentence();
}
window.speakVietnamese = speakVietnamese;

// ==============================================================
// 2. ĐIỀU HƯỚNG VIEW & MODULES
// ==============================================================
window.toggleSidebar = function() {
  const sidebar = document.getElementById("curriculumSidebar");
  if (sidebar) sidebar.classList.toggle("-translate-x-full");
};

window.switchMainView = function(viewId) {
  document.getElementById("curriculumView").classList.add("hidden");
  document.getElementById("adminView").classList.add("hidden");

  document.querySelectorAll(".view-tab-btn").forEach(btn => {
    btn.classList.remove("text-emerald-400", "bg-emerald-500/10", "border-emerald-500/20", "text-amber-400", "bg-amber-500/10", "border-amber-500/20");
    btn.classList.add("text-slate-400", "border-transparent");
  });

  const activeView = document.getElementById(viewId);
  const activeBtn = document.getElementById(`tabBtn-${viewId}`);

  if (activeView) activeView.classList.remove("hidden");
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-400", "border-transparent");
    if (viewId === "adminView") {
      activeBtn.classList.add("text-amber-400", "bg-amber-500/10", "border-amber-500/20");
      loadAdminStudents();
    } else {
      activeBtn.classList.add("text-emerald-400", "bg-emerald-500/10", "border-emerald-500/20");
    }
  }
};

// ==============================================================
// 2.5. HỆ THỐNG ĐIỀU PHỐI ÂM THANH TRUNG TÂM & KHÓA TUẦN TỰ NƠ-RON
// ==============================================================
let activeGlobalAudio = null;
let currentSlideAudio = null;
let currentGuideAudio = null;
let currentStoryAudio = null;

window.stopAllAudios = function() {
  if (activeGlobalAudio) {
    activeGlobalAudio.pause();
    activeGlobalAudio = null;
  }
  if (currentSlideAudio) {
    currentSlideAudio.pause();
    currentSlideAudio = null;
  }
  if (currentGuideAudio) {
    currentGuideAudio.pause();
    currentGuideAudio = null;
  }
  if (currentStoryAudio) {
    currentStoryAudio.pause();
    currentStoryAudio = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

window.playTrack = function(audioPath, onEnded, onError) {
  window.stopAllAudios();
  const audio = new Audio(audioPath);
  activeGlobalAudio = audio;
  audio.onended = () => {
    activeGlobalAudio = null;
    if (onEnded) onEnded();
  };
  audio.onerror = (e) => {
    activeGlobalAudio = null;
    if (onError) onError(e);
  };
  audio.play().catch(e => {
    activeGlobalAudio = null;
    if (onError) onError(e);
  });
  return audio;
};

export const MODULE_FLOW = [
  { id: 'moduleLecture', step: 0, title: '0. Thuyết Giảng Khai Mở', icon: 'book-open' },
  { id: 'moduleMouth', step: 1, title: '1. Khẩu Hình & Phát Âm', icon: 'mic', guideAudio: 'assets/audio/guide-buoi-01-step-1.mp3' },
  { id: 'moduleChunks', step: 2, title: '2. Cụm Từ & Phản Xạ', icon: 'volume-2', guideAudio: 'assets/audio/guide-buoi-01-step-2.mp3' },
  { id: 'moduleQuiz', step: 3, title: '3. Trắc Nghiệm', icon: 'help-circle', guideAudio: 'assets/audio/guide-buoi-01-step-3.mp3' },
  { id: 'moduleFlashcard', step: 4, title: '4. Sổ Thẻ 3D', icon: 'layers', guideAudio: 'assets/audio/guide-buoi-01-step-4.mp3' },
  { id: 'moduleSpeaking', step: 5, title: '5. Đối Thoại AI 2 Chiều', icon: 'radio', guideAudio: 'assets/audio/guide-buoi-01-step-5.mp3' },
  { id: 'moduleTyping', step: 6, title: '6. Gõ Phản Xạ & Ghép Khối', icon: 'keyboard', guideAudio: 'assets/audio/guide-buoi-01-step-6.mp3' }
];

let internalUnlockedStep = 0; // 0: chỉ mở moduleLecture, 1: mở đến moduleMouth, ..., 6: mở tất cả
let isFreeMode = false;

// Đọc trạng thái từ localStorage
try {
  const savedGating = localStorage.getItem('tienganh0d_step_gating_buoi_01');
  if (savedGating) {
    const parsed = JSON.parse(savedGating);
    if (typeof parsed.unlockedStep === 'number') internalUnlockedStep = parsed.unlockedStep;
    if (typeof parsed.isFreeMode === 'boolean') isFreeMode = parsed.isFreeMode;
  }
} catch (e) {
  console.warn('Lỗi đọc step gating từ localStorage:', e);
}

function saveStepGatingState() {
  try {
    localStorage.setItem('tienganh0d_step_gating_buoi_01', JSON.stringify({
      unlockedStep: internalUnlockedStep,
      isFreeMode: isFreeMode
    }));
  } catch (e) {}
}

window.unlockStep = function(stepNumber, autoSwitch = false) {
  if (stepNumber > internalUnlockedStep) {
    internalUnlockedStep = Math.min(stepNumber, 6);
    saveStepGatingState();
    window.updateModuleTabsUI();
  }
  if (autoSwitch) {
    const targetMod = MODULE_FLOW[stepNumber];
    if (targetMod) {
      window.switchLessonModule(targetMod.id, true);
    }
  }
};

window.toggleFreeMode = function() {
  isFreeMode = !isFreeMode;
  saveStepGatingState();
  window.updateModuleTabsUI();
  if (isFreeMode) {
    alert("🔓 Đã BẬT Chế Độ Tự Do Ôn Tập!\nBạn có thể tự do mở xem và ôn tập bất kỳ bước nào trong 7 module.");
  } else {
    alert("🔒 Đã kích hoạt lại Khóa Tuần Tự!\nCác module sẽ tuân theo lộ trình tiếp thu khoa học thần kinh từng bước.");
  }
};

window.resetGatingFlow = function() {
  internalUnlockedStep = 0;
  isFreeMode = false;
  saveStepGatingState();
  window.updateModuleTabsUI();
  window.switchLessonModule('moduleLecture', false);
  window.scrollTo({ top: 100, behavior: 'smooth' });
};

window.updateModuleTabsUI = function() {
  MODULE_FLOW.forEach((mod, idx) => {
    const btn = document.getElementById(`btn-${mod.id}`);
    if (!btn) return;
    const isUnlocked = isFreeMode || idx <= internalUnlockedStep;
    const isCompleted = !isFreeMode && idx < internalUnlockedStep;

    if (isUnlocked) {
      btn.classList.remove("opacity-50", "cursor-not-allowed");
      btn.innerHTML = `
        <i data-lucide="${mod.icon || 'star'}" class="w-4 h-4"></i>
        <span>${mod.title}</span>
        ${isCompleted ? '<span class="text-[10px] text-emerald-400 ml-1 font-bold">✓</span>' : ''}
      `;
    } else {
      btn.classList.add("opacity-50", "cursor-not-allowed");
      btn.innerHTML = `
        <i data-lucide="lock" class="w-3.5 h-3.5 text-slate-500"></i>
        <span class="text-slate-500">${mod.title}</span>
      `;
    }
  });

  const label = document.getElementById('freeModeLabel');
  if (label) {
    label.textContent = isFreeMode ? 'Chế Độ Tự Do: BẬT' : 'Chế Độ Tự Do: TẮT';
  }
  const btnFree = document.getElementById('btnToggleFreeMode');
  if (btnFree) {
    if (isFreeMode) {
      btnFree.className = "px-2.5 py-1 rounded-lg text-xs font-bold border border-cyan-500/50 text-cyan-300 bg-cyan-500/10 transition flex items-center space-x-1.5 cursor-pointer";
    } else {
      btnFree.className = "px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition flex items-center space-x-1.5 cursor-pointer";
    }
  }

  if (window.lucide) window.lucide.createIcons();
};

window.switchLessonModule = function(moduleId, autoPlayGuide = false) {
  const targetStepIndex = MODULE_FLOW.findIndex(m => m.id === moduleId);
  if (targetStepIndex === -1) return;

  const isUnlocked = isFreeMode || targetStepIndex <= internalUnlockedStep;
  if (!isUnlocked) {
    playIncorrectSound();
    const prevMod = MODULE_FLOW[targetStepIndex - 1];
    alert(`🔒 Bước này đang tạm khóa!

Thầy giáo khuyên bạn hãy hoàn thành xong "${prevMod ? prevMod.title : 'bước trước'}" để bộ não tiếp thu kiến thức một cách tự nhiên và bền vững nhất nhé!`);
    return;
  }

  // Dừng mọi âm thanh đang phát để tránh chồng âm
  window.stopAllAudios();

  document.querySelectorAll(".module-content").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".module-tab-btn").forEach(btn => {
    btn.classList.remove("bg-emerald-500/15", "text-emerald-400", "border-emerald-500/30", "active");
    btn.classList.add("text-slate-400", "border-transparent");
  });

  const activeMod = document.getElementById(moduleId);
  const activeBtn = document.getElementById(`btn-${moduleId}`);

  if (activeMod) activeMod.classList.remove("hidden");
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-400", "border-transparent");
    activeBtn.classList.add("bg-emerald-500/15", "text-emerald-400", "border-emerald-500/30", "active");
  }

  if (window.lucide) window.lucide.createIcons();
  if (window.reinit3DTilt) window.reinit3DTilt();

  // Tự động phát âm thanh hướng dẫn của thầy giáo nếu được kích hoạt
  if (autoPlayGuide && targetStepIndex >= 1 && targetStepIndex <= 6) {
    setTimeout(() => {
      window.playTeacherGuideAudio(targetStepIndex);
    }, 400);
  }
};

// ==============================================================
// 3. KIỂM TRA MỞ KHÓA BÀI HỌC TUẦN TỰ (SEQUENTIAL NEUROLOGICAL GATING)
// ==============================================================
function isLessonUnlocked(lesson) {
  if (!lesson) return false;
  if (lesson.sessionNumber === 1) return true;

  const completed = (userProgress && userProgress.completedLessons) || [];
  const prevLesson = CURRICULUM_DATA.lessons.find(l => l.sessionNumber === lesson.sessionNumber - 1);
  if (!prevLesson) return true;
  return completed.includes(prevLesson.id);
}

window.notifyLockedLesson = function(sessionNum) {
  playIncorrectSound();
  alert(`🔒 Buổi ${sessionNum < 10 ? '0' + sessionNum : sessionNum} đang tạm khóa!\n\nTheo quy tắc khoa học nhận thức, bạn cần hoàn thành bài học và đạt tối thiểu 70% bài kiểm tra của Buổi ${sessionNum - 1 < 10 ? '0' + (sessionNum - 1) : sessionNum - 1} để mở khóa nơ-ron bài tiếp theo nhé!`);
};

// ==============================================================
// 4. RENDER DANH MỤC GIÁO TRÌNH (ACCORDION LESSON TREE)
// ==============================================================
function renderCurriculumTree() {
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
}

// ==============================================================
// 5. CHỌN BÀI HỌC CỤ THỂ ĐỂ HỌC
// ==============================================================
window.selectLesson = function(lessonId) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  if (!isLessonUnlocked(lesson)) {
    notifyLockedLesson(lesson.sessionNumber);
    return;
  }

  currentActiveLessonId = lessonId;

  // Cập nhật Header
  const titleEl = document.getElementById("currentLessonTitle");
  const topicEl = document.getElementById("currentLessonTopic");
  const contextEl = document.getElementById("currentLessonContext");
  const durationEl = document.getElementById("currentLessonDuration");
  const phaseBadge = document.getElementById("currentPhaseBadge");

  const milestone = CURRICULUM_DATA.milestones.find(m => m.id === lesson.phaseId);

  if (titleEl) titleEl.textContent = `Buổi ${lesson.sessionNumber < 10 ? '0' + lesson.sessionNumber : lesson.sessionNumber}: ${lesson.title}`;
  if (topicEl) topicEl.textContent = `Chủ đề: ${lesson.topic}`;
  if (contextEl) contextEl.textContent = lesson.practicalContext;
  if (durationEl) durationEl.textContent = lesson.duration || "25 phút";
  if (phaseBadge && milestone) phaseBadge.textContent = milestone.badge;

  // Render các Module
  renderMasterLecture(lesson);
  renderMouthTechniques(lesson.mouthTechniques);
  renderChunks(lesson.chunks);
  renderQuizzes(lesson.quizzes);
  renderFlashcards(lesson.chunks);
  setupDialogueModule(lesson);
  renderTypingChallenges(lesson.typingChallenges || []);

  // Cập nhật trạng thái khóa tuần tự các tabs
  window.updateModuleTabsUI();

  // Mặc định mở Tab 0: Thuyết Giảng Khai Mở
  switchLessonModule('moduleLecture', false);

  // Đóng sidebar trên Mobile sau khi chọn bài
  const sidebar = document.getElementById("curriculumSidebar");
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.add("-translate-x-full");
  }

  // Cập nhật lại cây thư mục
  renderCurriculumTree();
};

// ==============================================================
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
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"></span>
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
            <span class="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>BÀI THUYẾT GIẢNG MỞ ĐẦU</span>
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

      <!-- Slide Main Visual Card (Animated) -->
      <div class="relative z-10 mb-6 p-6 sm:p-7 rounded-2xl bg-slate-900/95 border ${isSlideAudioPlaying ? 'border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40' : 'border-slate-800'} shadow-2xl slide-card-active transition-all duration-300" id="activeSlideCard">
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
          <span class="px-3 py-1 rounded-full text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            Trang ${currentSlideIndex + 1}
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
};

// ==============================================================
// 6. MODULE 1: KHẨU HÌNH, ÂM VỊ & ĐỒNG BỘ 100% TỪ LUYỆN NÓI
// Đã khắc phục triệt để lỗi bấm "Nghe lại" bị phát sai từ
// ==============================================================
function renderMouthTechniques(techniques) {
  const guideBanner = document.getElementById("mouthGuideBanner");
  if (guideBanner) {
    guideBanner.innerHTML = window.renderTeacherGuideBanner(1, "Hướng Dẫn Bước 1: Khẩu Hình & Phát Âm", "Làm chủ 3 âm then chốt /θ/, /s/ và /t/. Bấm loa nghe mẫu và bấm micro để AI chấm điểm từng âm nhé!");
  }
  const nextStepArea = document.getElementById("mouthNextStepArea");
  if (nextStepArea) {
    nextStepArea.innerHTML = window.renderNextStepCTA(2, "✓ Hoàn Thành Bước 1 • Chuyển Sang Bước 2: Cụm Từ & Phản Xạ", "Sau khi đã luyện qua khẩu hình 3 âm /θ/, /s/, /t/, hãy chuyển sang cụm từ giao tiếp!");
  }

  const container = document.getElementById("mouthTechniquesContainer");
  if (!container) return;

  if (!techniques || techniques.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-3">Buổi này tập trung vào phản xạ câu trực tiếp.</div>`;
    return;
  }

  container.innerHTML = techniques.map((m, idx) => {
    const wordList = (m.words || []).map(w => {
      if (typeof w === 'string') {
        return { word: w, ipa: '', meaning: 'Từ ví dụ', context: '' };
      }
      return w;
    });

    if (!selectedMouthWords[idx] || !wordList.some(item => item.word === selectedMouthWords[idx].word)) {
      selectedMouthWords[idx] = wordList[0] || { word: 'Word', meaning: '', ipa: '' };
    }
    const currentWord = selectedMouthWords[idx];

    return `
    <div class="p-4 rounded-xl cyber-card card-3d flex flex-col justify-between" id="mouthCard-${idx}">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl font-extrabold text-cyan-400 font-mono">${m.sound}</span>
          <div class="flex flex-wrap gap-1.5" id="mouthWordsList-${idx}">
            ${wordList.map((w, wIdx) => {
              const isSelected = w.word === currentWord.word;
              return `
              <button onclick="selectMouthWord(${idx}, ${wIdx})" 
                      class="px-2 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1 ${isSelected ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-300' : 'bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/30'}" 
                      title="Bấm chọn & nghe từ: ${w.word}">
                <i data-lucide="volume-2" class="w-3 h-3"></i>
                <span>${w.word}</span>
              </button>
            `;
            }).join("")}
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed mb-2">${m.guide}</p>
        <div class="text-[11px] text-emerald-400/90 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 mb-3">
          💡 <strong>Mẹo cơ miệng:</strong> ${m.tip}
        </div>
      </div>

      <!-- Khu vực luyện phát âm từ đang chọn (Liên kết động 100% qua hàm trung gian) -->
      <div class="pt-2 border-t border-slate-800" id="mouthPracticeBox-${idx}">
        <div class="mb-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400">Luyện phát âm từ: <strong class="text-white text-sm" id="mouthTargetWord-${idx}">${currentWord.word}</strong></span>
            <span class="text-[11px] font-mono text-cyan-400" id="mouthTargetIpa-${idx}">${currentWord.ipa || ''}</span>
          </div>
          <div class="text-[11px] text-emerald-400 font-medium mt-0.5" id="mouthTargetMeaning-${idx}">
            Nghĩa: ${currentWord.meaning} ${currentWord.context ? '• ' + currentWord.context : ''}
          </div>
        </div>

        <div class="flex items-center justify-between gap-2">
          <button id="btn-mouth-replay-${idx}" onclick="replaySelectedMouthWord(${idx})" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1 transition active:scale-95">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
            <span>Nghe lại</span>
          </button>

          <button id="btn-mouth-mic-${idx}" onclick="practiceSelectedMouthWord(${idx})" class="px-3 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95">
            <i data-lucide="mic" class="w-3.5 h-3.5"></i>
            <span>Nói thử</span>
          </button>
        </div>
        <div id="mouth-feedback-${idx}" class="hidden mt-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px]"></div>
      </div>
    </div>
  `;
  }).join("");
  if (window.lucide) window.lucide.createIcons();
}

window.selectMouthWord = function(techIdx, wordIdx) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson || !lesson.mouthTechniques || !lesson.mouthTechniques[techIdx]) return;
  const tech = lesson.mouthTechniques[techIdx];
  const wordObj = tech.words[wordIdx];
  if (!wordObj) return;

  selectedMouthWords[techIdx] = wordObj;
  if (wordObj.audioFile) { window.playTrack(wordObj.audioFile); } else { speakText(wordObj.word); }

  // Cập nhật DOM trực tiếp không lo bị lệch từ
  const wordEl = document.getElementById(`mouthTargetWord-${techIdx}`);
  const ipaEl = document.getElementById(`mouthTargetIpa-${techIdx}`);
  const meaningEl = document.getElementById(`mouthTargetMeaning-${techIdx}`);
  const feedbackEl = document.getElementById(`mouth-feedback-${techIdx}`);

  if (wordEl) wordEl.textContent = wordObj.word;
  if (ipaEl) ipaEl.textContent = wordObj.ipa || '';
  if (meaningEl) meaningEl.textContent = `Nghĩa: ${wordObj.meaning} ${wordObj.context ? '• ' + wordObj.context : ''}`;
  if (feedbackEl) feedbackEl.classList.add('hidden');

  // Đổi trạng thái highlight nút từ đang chọn
  const wordsListEl = document.getElementById(`mouthWordsList-${techIdx}`);
  if (wordsListEl) {
    const buttons = wordsListEl.querySelectorAll('button');
    buttons.forEach((btn, idx) => {
      if (idx === wordIdx) {
        btn.className = "px-2 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1 bg-cyan-500 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-300";
      } else {
        btn.className = "px-2 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/30";
      }
    });
  }
};

window.replaySelectedMouthWord = function(techIdx) {
  const wordObj = selectedMouthWords[techIdx];
  if (wordObj && wordObj.word) {
    speakText(wordObj.word);
  }
};

window.practiceSelectedMouthWord = function(techIdx) {
  const wordObj = selectedMouthWords[techIdx];
  if (wordObj && wordObj.word) {
    practiceMouthSound(wordObj.word, techIdx);
  }
};

// ==============================================================
// 7. MODULE 2: CỤM TỪ PHẢN XẠ & CHỈ SỐ KHẮC SÂU ĐA GIÁC QUAN 0/7
// ==============================================================
function renderChunks(chunks) {
  const container = document.getElementById("chunksContainer");
  if (!container) return;

  if (!chunks || chunks.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-3">Đang tải cụm từ...</div>`;
    return;
  }

  const guideHeader = `
    <div class="p-3 mb-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
      <div class="flex items-center space-x-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span><strong>Mẫu Câu Cốt Lõi:</strong> Câu chuẩn người Mỹ dùng</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
        <span><strong>Cách Nói Mở Rộng:</strong> Tình huống biến đổi linh hoạt</span>
      </div>
      <div class="text-[11px] text-amber-400 font-mono">
        🧠 Cần hoàn thành đủ 4 kênh (Nghe + Nói ≥70% + Gõ câu + Đối thoại) để đạt 7/7
      </div>
    </div>
  `;

  const chunksGuide = document.getElementById("chunksGuideBanner");
  if (chunksGuide) {
    chunksGuide.innerHTML = window.renderTeacherGuideBanner(2, "Hướng Dẫn Bước 2: Cụm Từ & Phản Xạ Đời Thường", "Làm chủ 3 cụm từ phản xạ cốt lõi. Hãy lắng nghe và luyện nói để hoàn thành mục tiêu 7 lần lặp đa giác quan nhé!");
  }
  const chunksNextArea = document.getElementById("chunksNextStepArea");
  if (chunksNextArea) {
    chunksNextArea.innerHTML = window.renderNextStepCTA(3, "✓ Hoàn Thành Bước 2 • Chuyển Sang Bước 3: Luyện Tập Trắc Nghiệm", "Đã tích lũy các lần lặp đa giác quan cho 3 cụm từ hạt nhân.");
  }

  container.innerHTML = guideHeader + chunks.map((c, idx) => {
    const data = getChunkRepetitionData(c.phrase);
    const score = calculateRepetitionScore(data);

    return `
    <div class="p-4 rounded-xl cyber-card card-3d ${c.type === 'permutation' ? 'border-cyan-500/30 bg-cyan-950/15' : 'border-emerald-500/30'}">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex-grow">
          <div class="flex flex-wrap items-baseline gap-2 mb-1">
            <span class="text-base sm:text-lg font-bold text-white tracking-wide">${c.phrase}</span>
            <span class="text-xs font-mono text-cyan-400">${c.ipa}</span>
            ${c.type === 'permutation' ? '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">Cách nói mở rộng</span>' : '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">Mẫu câu cốt lõi</span>'}
          </div>
          <p class="text-xs sm:text-sm text-emerald-300 font-medium mb-1">${c.meaning}</p>
          <span class="text-[11px] text-slate-400 block">${c.context}</span>
        </div>

        <div class="flex items-center space-x-2 flex-shrink-0">
          <button onclick="handleListenChunk('${c.phrase.replace(/'/g, "\\'")}')" class="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center space-x-1.5 transition active:scale-95 text-xs font-semibold" title="Bấm nghe giọng Mỹ chuẩn">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
            <span>Nghe</span>
          </button>
          <button id="btn-chunk-mic-${idx}" onclick="practiceChunkSpeech('${c.phrase.replace(/'/g, "\\'")}', ${idx})" class="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 flex items-center space-x-1.5 transition active:scale-95 text-xs font-semibold" title="Bấm để nói và AI chấm điểm">
            <i data-lucide="mic" class="w-4 h-4"></i>
            <span>Nói thử</span>
          </button>
        </div>
      </div>

      <!-- Chỉ số khắc sâu nơ-ron xác thực thực chất -->
      <div class="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div class="flex items-center space-x-2">
          <span class="text-xs">🧠</span>
          <span class="text-slate-400">Khắc sâu não bộ:</span>
          <strong class="${score >= 7 ? 'text-emerald-400' : 'text-cyan-400'}" id="rep-count-${c.phrase}">${score}/7 lần</strong>
          <span id="rep-status-${c.phrase}" class="text-[10px] px-1.5 py-0.5 rounded ${score >= 7 ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : (score >= 3 ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'bg-blue-500/20 text-blue-300 font-semibold')}">
            ${score >= 7 ? 'Đã khắc sâu vĩnh viễn ✨' : (score >= 3 ? 'Phản xạ cơ miệng' : 'Ghi nhận âm thanh')}
          </span>
        </div>

        <div class="flex items-center space-x-2" id="rep-tags-${c.phrase}">
          <span class="text-[9px] px-1.5 py-0.5 rounded font-mono ${data.listened ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'bg-slate-800 text-slate-500'}">🎧 Nghe ${data.listened ? '✓' : '○'}</span>
          <span class="text-[9px] px-1.5 py-0.5 rounded font-mono ${data.spokenCorrectly ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-500'}">🎙️ Nói ≥70% ${data.spokenCorrectly ? '✓' : '○'}</span>
          <span class="text-[9px] px-1.5 py-0.5 rounded font-mono ${data.typedCorrectly ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-slate-800 text-slate-500'}">⌨️ Gõ đúng ${data.typedCorrectly ? '✓' : '○'}</span>
          <span class="text-[9px] px-1.5 py-0.5 rounded font-mono ${data.dialoguePassed ? 'bg-purple-500/20 text-purple-300 font-bold' : 'bg-slate-800 text-slate-500'}">💬 Đối thoại ${data.dialoguePassed ? '✓' : '○'}</span>
        </div>

        <div class="w-full sm:w-28 bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div id="rep-bar-${c.phrase}" class="h-full rounded-full transition-all duration-500 ${score >= 7 ? 'bg-emerald-400' : (score >= 3 ? 'bg-amber-400' : 'bg-cyan-400')}" style="width: ${(score / 7) * 100}%"></div>
        </div>
      </div>

      <!-- Khung kết quả chấm điểm tức thì của câu này -->
      <div id="chunk-feedback-${idx}" class="hidden mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"></div>
    </div>
  `;
  }).join("");
  if (window.lucide) window.lucide.createIcons();
}

window.handleListenChunk = function(phrase) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const chunkObj = lesson?.chunks?.find(c => c.phrase === phrase);
  if (chunkObj && chunkObj.audioFile) {
    window.playTrack(chunkObj.audioFile);
  } else {
    speakText(phrase);
  }
  markChunkListened(phrase);
};

// ==============================================================
// 8. MODULE 3: TRẮC NGHIỆM PHẢN XẠ & MỞ KHÓA BÀI HỌC
// ==============================================================
function renderQuizzes(quizzes) {
  const quizGuide = document.getElementById("quizGuideBanner");
  if (quizGuide) {
    quizGuide.innerHTML = window.renderTeacherGuideBanner(3, "Hướng Dẫn Bước 3: Luyện Tập Trắc Nghiệm Phản Xạ", "Bước 3 là bài trắc nghiệm phản xạ tình huống. Bạn cần đạt từ 70% trở lên để mở khóa tiếp nhé!");
  }

  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;

  userQuizScore = 0;
  answeredCount = 0;
  const finishBanner = document.getElementById("quizFinishBanner");
  if (finishBanner) finishBanner.classList.add("hidden");

  const scoreBadge = document.getElementById("quizScoreBadge");
  if (scoreBadge) scoreBadge.textContent = `Điểm: 0/${quizzes.length}`;

  if (!quizzes || quizzes.length === 0) {
    quizContainer.innerHTML = `<div class="text-xs text-slate-400 p-3">Buổi này tập trung vào thực hành tương tác.</div>`;
    return;
  }

  quizContainer.innerHTML = quizzes.map((q, qIdx) => `
    <div class="p-4 rounded-xl cyber-card card-3d border-slate-800" id="quizCard-${q.id}">
      <div class="flex items-start space-x-2.5 mb-3">
        <span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
          ${qIdx + 1}
        </span>
        <h4 class="text-sm font-semibold text-white leading-relaxed">${q.question}</h4>
      </div>

      <div class="space-y-2 mb-3">
        ${q.options.map((opt, optIdx) => `
          <button id="opt-${q.id}-${optIdx}" 
                  onclick="selectQuizAnswer('${q.id}', ${optIdx}, ${q.correctIndex}, '${q.explanation.replace(/'/g, "\\'")}', ${quizzes.length})" 
                  class="w-full text-left p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition flex items-center justify-between">
            <span>${opt}</span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-600"></i>
          </button>
        `).join("")}
      </div>

      <div id="quizExplain-${q.id}" class="hidden p-3 rounded-xl border text-xs">
        <div id="quizFeedbackTitle-${q.id}" class="mb-1"></div>
        <p class="text-slate-300 leading-relaxed">${q.explanation}</p>
      </div>
    </div>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
}

window.selectQuizAnswer = async function(quizId, selectedIdx, correctIdx, explanation, totalQuizzes) {
  const card = document.getElementById(`quizCard-${quizId}`);
  if (!card || card.dataset.answered === "true") return;
  card.dataset.answered = "true";

  const expBox = document.getElementById(`quizExplain-${quizId}`);
  const feedbackTitle = document.getElementById(`quizFeedbackTitle-${quizId}`);

  card.querySelectorAll("button").forEach(btn => btn.disabled = true);

  if (selectedIdx === correctIdx) {
    userQuizScore++;
    playCorrectSound();
    document.getElementById(`opt-${quizId}-${selectedIdx}`).classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-emerald-300', 'font-bold');
    expBox.classList.remove('hidden');
    expBox.classList.add('border-emerald-500/30', 'bg-emerald-950/20');
    feedbackTitle.innerHTML = `<span class="text-emerald-400 font-bold">🎉 Chính xác tuyệt đối!</span>`;
  } else {
    playIncorrectSound();
    document.getElementById(`opt-${quizId}-${selectedIdx}`).classList.add('bg-rose-500/20', 'border-rose-500', 'text-rose-300');
    document.getElementById(`opt-${quizId}-${correctIdx}`).classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-emerald-300');
    expBox.classList.remove('hidden');
    expBox.classList.add('border-rose-500/30', 'bg-rose-950/20');
    feedbackTitle.innerHTML = `<span class="text-rose-400 font-bold">Chưa chính xác! Xem giải thích bên dưới:</span>`;
  }

  answeredCount++;
  const scoreBadge = document.getElementById("quizScoreBadge");
  if (scoreBadge) scoreBadge.textContent = `Điểm: ${userQuizScore}/${totalQuizzes}`;

  if (answeredCount >= totalQuizzes) {
    const isPassed = userQuizScore >= Math.ceil(totalQuizzes * 0.7);
    if (isPassed) {
      playVictorySound();
      if (window.confetti) {
        setTimeout(() => window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }), 200);
      }
    }

    userProgress = await saveLessonCompletion(currentUser, currentActiveLessonId, userQuizScore, totalQuizzes);
    updateProgressUI(userProgress);
    renderCurriculumTree();

    const finishBanner = document.getElementById("quizFinishBanner");
    if (finishBanner) {
      finishBanner.classList.remove("hidden");
      if (isPassed) {
        window.unlockStep(4, false); // Mở khóa Bước 4: Sổ Thẻ 3D
        finishBanner.innerHTML = `
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <div class="flex items-center space-x-3 text-xs text-slate-300">
              <span class="text-2xl">🎉</span>
              <div>
                <div class="font-bold text-emerald-400">Xuất sắc! Bạn đã đạt ${userQuizScore}/${totalQuizzes} câu và vượt qua bài kiểm tra.</div>
                <p class="text-slate-400 text-[11px] mt-0.5">Bước 4: Sổ Thẻ 3D đã sẵn sàng để bạn tiếp tục!</p>
              </div>
            </div>
            <button onclick="window.unlockStep(4, true); window.scrollTo({top: 120, behavior: 'smooth'});" class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:scale-105 active:scale-95 transition shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 cursor-pointer flex-shrink-0">
              <span>Chuyển Sang Bước 4: Sổ Thẻ 3D</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        `;
      } else {
        finishBanner.innerHTML = `
          <div class="flex items-center space-x-3 text-xs text-amber-300">
            <span class="text-2xl">💡</span>
            <div>
              <div class="font-bold text-amber-400">Bạn đạt ${userQuizScore}/${totalQuizzes} câu (cần ≥ 70% để mở khóa Bước tiếp theo).</div>
              <p class="text-slate-400 text-[11px] mt-0.5">Hãy bấm chọn lại đáp án đúng để khắc sâu nơ-ron nhé!</p>
            </div>
          </div>
        `;
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }
};

// ==============================================================
// 9. MODULE 4: FLASHCARDS 3D
// ==============================================================
function renderFlashcards(chunks) {
  const flashGuide = document.getElementById("flashcardGuideBanner");
  if (flashGuide) {
    flashGuide.innerHTML = window.renderTeacherGuideBanner(4, "Hướng Dẫn Bước 4: Sổ Thẻ Ghi Nhớ 3D", "Bước 4 là Sổ thẻ 3D. Hãy chạm vào các thẻ để lật mặt xem giải nghĩa và nghe phát âm chuẩn nhé!");
  }
  const flashNextArea = document.getElementById("flashcardNextStepArea");
  if (flashNextArea) {
    flashNextArea.innerHTML = window.renderNextStepCTA(5, "✓ Hoàn Thành Bước 4 • Chuyển Sang Bước 5: Đối Thoại AI 2 Chiều", "Chạm lật tất cả các thẻ để neo ngữ nghĩa vào trí nhớ không gian.");
  }

  const container = document.getElementById("flashcardsContainer");
  if (!container) return;

  if (!chunks || chunks.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-3">Đang cập nhật thẻ...</div>`;
    return;
  }

  container.innerHTML = chunks.map((c, idx) => `
    <div class="flashcard h-48 cursor-pointer perspective-1000 card-3d" onclick="this.classList.toggle('flipped'); window.playClickSound && window.playClickSound();">
      <div class="flashcard-inner relative w-full h-full rounded-2xl border border-slate-800 bg-[#0b0e17] p-5 flex flex-col justify-between">
        <div class="flashcard-front absolute inset-0 p-5 flex flex-col justify-between rounded-2xl bg-[#0b0e17] border border-slate-800">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Thẻ #0${idx+1} • Chạm để lật</span>
            <button onclick="event.stopPropagation(); speakText('${c.phrase.replace(/'/g, "\\'")}')" class="text-emerald-400 hover:text-white p-1.5 rounded-lg bg-emerald-500/10">
              <i data-lucide="volume-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div>
            <div class="text-base sm:text-lg font-bold text-white mb-1">${c.phrase}</div>
            <div class="text-xs font-mono text-cyan-400">${c.ipa}</div>
          </div>
          <span class="text-[11px] text-slate-500">Chạm để xem nghĩa tiếng Việt & ngữ cảnh</span>
        </div>

        <div class="flashcard-back absolute inset-0 p-5 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Ý Nghĩa & Ngữ Cảnh</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Phản xạ tự nhiên</span>
          </div>
          <div>
            <div class="text-sm font-bold text-emerald-300 mb-1">${c.meaning}</div>
            <p class="text-xs text-slate-300 leading-relaxed">${c.context}</p>
          </div>
          <span class="text-[10px] text-slate-500">Chạm để lật lại tiếng Anh</span>
        </div>
      </div>
    </div>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
  if (window.reinit3DTilt) window.reinit3DTilt();
}

// ==============================================================
// 10. MODULE 5: PHÒNG ĐỐI THOẠI NHẬP VAI TƯƠNG TÁC SỐNG ĐỘNG (INTERACTIVE ROLEPLAY ENGINE)
// Học viên đóng vai trực tiếp: AI nói mở lời -> Bạn nói đối đáp -> AI phản hồi tức thì
// ==============================================================
let currentDialogueScenario = null;
let currentDialogueTurnIndex = 0;
let userTurnsList = [];
let isDialogueRecording = false;

function setupDialogueModule(lesson) {
  currentDialogueScenario = lesson.dialogueScenario;
  if (!currentDialogueScenario) {
    const speakContainer = document.getElementById("moduleSpeaking");
    if (speakContainer) speakContainer.innerHTML = `<div class="text-xs text-slate-400 p-4">Buổi này tập trung vào phản xạ câu trực tiếp.</div>`;
    return;
  }

  const speakGuide = document.getElementById("speakingGuideBanner");
  if (speakGuide) {
    speakGuide.innerHTML = window.renderTeacherGuideBanner(5, "Hướng Dẫn Bước 5: Đối Thoại AI 2 Chiều Cùng David", "Nhập vai đối thoại trực tiếp 2 chiều với David tại sân bay New York. Lắng nghe David mở lời và bấm micro đáp lại thật tự tin!");
  }
  const speakNextArea = document.getElementById("speakingNextStepArea");
  if (speakNextArea) {
    speakNextArea.innerHTML = window.renderNextStepCTA(6, "✓ Hoàn Thành Bước 5 • Chuyển Sang Bước 6: Thử Thách Gõ Câu", "Tự tin đối thoại với người bản xứ ngoài đời thực.");
  }

  const titleEl = document.getElementById("dialogueScenarioTitle");
  const narrativeEl = document.getElementById("dialogueStoryNarrative");

  if (titleEl) titleEl.textContent = currentDialogueScenario.title;
  if (narrativeEl) narrativeEl.textContent = currentDialogueScenario.storyNarrativeVi;

  userTurnsList = (currentDialogueScenario.turns || []).filter(t => t.role === 'user');
  currentDialogueTurnIndex = 0;

  renderDialogueTurns();
  updateCurrentDialogueTurnUI();
}

function renderDialogueTurns() {
  const container = document.getElementById("dialogueTurnsContainer");
  if (!container || !currentDialogueScenario) return;

  const turns = currentDialogueScenario.turns || [];
  container.innerHTML = turns.map((turn, idx) => {
    const isAi = turn.role === 'ai';
    return `
      <div id="dialogueBubble-${idx}" class="p-3.5 rounded-2xl transition-all duration-300 ${isAi ? 'bg-slate-900/90 border border-purple-500/20 mr-4 sm:mr-12' : 'bg-emerald-950/20 border border-emerald-500/30 ml-4 sm:ml-12'}">
        <div class="flex items-start space-x-3">
          <div class="w-8 h-8 rounded-xl ${isAi ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'} flex items-center justify-center font-bold text-base flex-shrink-0">
            ${isAi ? (currentDialogueScenario.characterAvatar || '👨‍💼') : '🙋'}
          </div>
          <div class="flex-grow">
            <div class="flex items-center justify-between mb-0.5">
              <span class="text-xs font-bold ${isAi ? 'text-purple-300' : 'text-emerald-400'}">${turn.speaker}</span>
              <button onclick="speakText('${(isAi ? turn.text : turn.targetText).replace(/'/g, "\\'")}')" class="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800">
                <i data-lucide="volume-2" class="w-3 h-3"></i>
                <span>Nghe</span>
              </button>
            </div>
            <div class="text-sm sm:text-base font-bold text-white">${isAi ? turn.text : turn.targetText}</div>
            <div class="text-xs text-slate-400 mt-0.5">${turn.meaning}</div>
            ${turn.hint ? `<div class="text-[11px] text-amber-400/90 mt-1">💡 <em>Mẹo: ${turn.hint}</em></div>` : ''}
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

window.narrateCurrentScenario = function() {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const audioPath = lesson?.dialogueScenario?.storyAudioFile || `assets/audio/story-${currentActiveLessonId}.mp3`;
  const btn = document.querySelector('[onclick="narrateCurrentScenario()"]');

  if (currentStoryAudio) {
    window.stopAllAudios();
    currentStoryAudio = null;
    if (btn) {
      btn.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5"></i><span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
    return;
  }

  if (btn) {
    btn.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5 text-amber-300 animate-pulse"></i><span class="text-amber-300">Đang phát lời kể... (Bấm dừng)</span>`;
    if (window.lucide) window.lucide.createIcons();
  }

  currentStoryAudio = window.playTrack(audioPath, () => {
    currentStoryAudio = null;
    const noticeEl = document.getElementById("voiceNoticeTip");
    if (noticeEl) noticeEl.classList.add("hidden");
    if (btn) {
      btn.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5"></i><span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }, () => {
    currentStoryAudio = null;
    if (lesson?.dialogueScenario?.storyNarrativeVi) {
      speakVietnamese(lesson.dialogueScenario.storyNarrativeVi);
    }
    if (btn) {
      btn.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5"></i><span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  });
};

window.triggerAiPartnerPrompt = function() {
  if (!currentDialogueScenario || !currentDialogueScenario.turns) return;
  // Tìm câu thoại của AI ngay trước lượt của user hiện tại
  const currentTurn = userTurnsList[currentDialogueTurnIndex];
  const userIdx = currentDialogueScenario.turns.indexOf(currentTurn);
  const aiTurn = userIdx > 0 ? currentDialogueScenario.turns[userIdx - 1] : currentDialogueScenario.turns[0];

  if (aiTurn && aiTurn.role === 'ai') {
    if (aiTurn.audioFile) {
      window.playTrack(aiTurn.audioFile);
    } else {
      speakText(aiTurn.text);
    }
  }
};

window.playFullConversationLoop = function() {
  if (!currentDialogueScenario || !currentDialogueScenario.turns) return;
  const turns = currentDialogueScenario.turns;
  let idx = 0;

  function playTurn() {
    if (idx >= turns.length) {
      alert("🎉 Bạn vừa nghe trọn vẹn đoạn phim hội thoại tự nhiên cùng David!");
      return;
    }

    const turn = turns[idx];
    // Highlight bubble
    document.querySelectorAll('[id^="dialogueBubble-"]').forEach(b => b.classList.remove('ring-2', 'ring-cyan-400'));
    const bubble = document.getElementById(`dialogueBubble-${idx}`);
    if (bubble) bubble.classList.add('ring-2', 'ring-cyan-400');

    if (turn.role === 'ai' && turn.audioFile) {
      window.playTrack(turn.audioFile, () => {
        idx++;
        setTimeout(playTurn, 900);
      }, () => {
        speakText(turn.text);
        idx++;
        setTimeout(playTurn, 1000);
      });
    } else {
      const phrase = turn.role === 'ai' ? turn.text : turn.targetText;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;

      utterance.onend = function() {
        idx++;
        setTimeout(playTurn, 1000);
      };

      window.speechSynthesis.speak(utterance);
    }
  }

  playTurn();
};

window.replayCurrentTurnTarget = function() {
  if (userTurnsList.length === 0) return;
  speakText(userTurnsList[currentDialogueTurnIndex].targetText);
};

window.prevDialogueTurn = function() {
  if (currentDialogueTurnIndex > 0) {
    currentDialogueTurnIndex--;
    updateCurrentDialogueTurnUI();
    window.triggerAiPartnerPrompt();
  }
};

window.nextDialogueTurn = function() {
  if (currentDialogueTurnIndex < userTurnsList.length - 1) {
    currentDialogueTurnIndex++;
    updateCurrentDialogueTurnUI();
    window.triggerAiPartnerPrompt();
  } else {
    alert("🎉 Xuất sắc! Bạn đã hoàn thành toàn bộ kịch bản đối thoại nhập vai của buổi học hôm nay!");
    playVictorySound();
    if (window.confetti) {
      setTimeout(() => window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }), 200);
    }
  }
};

window.toggleDialogueSpeechRecording = function() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Trình duyệt này chưa hỗ trợ Micro nhận diện giọng nói. Hãy dùng Google Chrome hoặc Microsoft Edge để nói và chấm điểm 0đ nhé!");
    return;
  }

  const micBtn = document.getElementById("btnRecordVoice");
  const micStatus = document.getElementById("micStatusText");

  const recog = new SpeechRecognition();
  recog.lang = "en-US";
  recog.continuous = false;
  recog.interimResults = false;

  recog.onstart = function() {
    isDialogueRecording = true;
    if (micBtn) micBtn.classList.add("animate-pulse", "ring-4", "ring-purple-400");
    if (micStatus) micStatus.innerHTML = `<span class="text-rose-400 font-bold animate-pulse">● Đang lắng nghe... Hãy nói câu đối đáp ngay!</span>`;
  };

  recog.onresult = function(event) {
    isDialogueRecording = false;
    if (micBtn) micBtn.classList.remove("animate-pulse", "ring-4", "ring-purple-400");

    const transcript = event.results[0][0].transcript;
    const currentTurn = userTurnsList[currentDialogueTurnIndex];
    const similarity = calculateSimilarity(transcript, currentTurn.targetText);
    const percentScore = Math.round(similarity * 100);

    const resultBox = document.getElementById("speechResultBox");
    const transcribedEl = document.getElementById("speechTranscribedText");
    const accuracyBadge = document.getElementById("speechAccuracyBadge");
    const feedbackEl = document.getElementById("speechFeedbackText");

    if (resultBox) resultBox.classList.remove("hidden");
    if (transcribedEl) transcribedEl.textContent = `"${transcript}"`;
    if (accuracyBadge) {
      accuracyBadge.textContent = `Độ chính xác: ${percentScore}%`;
      if (percentScore >= 70) {
        accuracyBadge.className = "text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      } else {
        accuracyBadge.className = "text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30";
      }
    }

    if (percentScore >= 70) {
      playCorrectSound();
      markChunkDialogue(currentTurn.targetText);

      if (feedbackEl) feedbackEl.innerHTML = `<span class="text-emerald-400 font-semibold">🎉 Xuất sắc!</span> Phát âm rất tự nhiên. Bạn đã vượt qua lượt thoại này!`;

      // Tự động chuyển lượt sau 1.2s để câu chuyện tiếp diễn tự nhiên
      setTimeout(() => {
        if (currentDialogueTurnIndex < userTurnsList.length - 1) {
          window.nextDialogueTurn();
        }
      }, 1500);

    } else {
      playIncorrectSound();
      if (feedbackEl) feedbackEl.innerHTML = `<span class="text-amber-400 font-semibold">Gần đúng rồi!</span> Hãy bấm nút <em>Nghe câu mẫu</em> và nói lại rõ ràng: "${currentTurn.targetText}".`;
    }
  };

  recog.onerror = function() {
    isDialogueRecording = false;
    if (micBtn) micBtn.classList.remove("animate-pulse", "ring-4", "ring-purple-400");
    if (micStatus) micStatus.textContent = "Chưa nhận được âm thanh. Hãy bấm lại micro và nói to hơn nhé!";
  };

  recog.onend = function() {
    isDialogueRecording = false;
    if (micBtn) micBtn.classList.remove("animate-pulse", "ring-4", "ring-purple-400");
  };

  try {
    recog.start();
  } catch (err) {
    console.warn("Lỗi start mic:", err);
  }
};

// ==============================================================
// 11. MODULE 6: THỬ THÁCH GÕ PHẢN XẠ & GHÉP KHỐI TỪ (ACTIVE RECALL TYPING)
// ==============================================================
const typingUserState = {};

function renderTypingChallenges(challenges) {
  const typeGuide = document.getElementById("typingGuideBanner");
  if (typeGuide) {
    typeGuide.innerHTML = window.renderTeacherGuideBanner(6, "Hướng Dẫn Bước 6: Thử Thách Gõ Phản Xạ & Ghép Khối Câu", "Bước cuối cùng là Gõ và ghép khối câu phản xạ. Hoàn thành bước này là bạn đã hoàn tất 100% Buổi 1 xuất sắc!");
  }
  const typeNextArea = document.getElementById("typingNextStepArea");
  if (typeNextArea) {
    typeNextArea.innerHTML = `
      <div class="mt-8 p-6 rounded-2xl bg-gradient-to-tr from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/40 text-center">
        <div class="text-3xl mb-2">🎉</div>
        <h3 class="text-lg font-black text-white mb-1">Chúc Mừng Bạn Đã Hoàn Thành Toàn Diện Buổi 01!</h3>
        <p class="text-xs text-emerald-300 max-w-lg mx-auto mb-4 leading-relaxed">
          Bạn đã kích hoạt trọn vẹn 6 giác quan: Thuyết giảng mở đầu, Khẩu hình 3 âm /θ/, /s/, /t/, Phản xạ 3 cụm từ, Trắc nghiệm, Thẻ 3D, Đối thoại cùng David và Gõ câu tái tạo!
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button onclick="resetGatingFlow()" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5 cursor-pointer">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
            <span>Bắt Đầu Lại Lộ Trình (Có Hướng Dẫn)</span>
          </button>
          <button onclick="toggleFreeMode()" class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:scale-105 active:scale-95 transition shadow-lg shadow-emerald-500/25 flex items-center space-x-1.5 cursor-pointer">
            <i data-lucide="unlock" class="w-4 h-4"></i>
            <span>Mở Khóa Tự Do Ôn Tập (Xem Mọi Bước)</span>
          </button>
        </div>
      </div>
    `;
  }

  const container = document.getElementById("typingChallengeContainer");
  if (!container) return;

  if (!challenges || challenges.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-3">Buổi này tập trung vào phản xạ câu trực tiếp.</div>`;
    return;
  }

  container.innerHTML = challenges.map((c, idx) => {
    typingUserState[c.id] = {
      constructedWords: []
    };

    const allWords = [...c.targetWords, ...(c.distractorWords || [])];
    const shuffledWords = allWords.sort(() => Math.random() - 0.5);

    return `
      <div class="p-5 rounded-2xl cyber-card card-3d border-slate-800" id="typingCard-${c.id}">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div>
            <span class="text-[10px] font-mono uppercase text-amber-400 font-bold">Thử thách #${idx + 1}</span>
            <div class="text-base font-bold text-white mt-0.5">${c.vietnameseCue}</div>
          </div>
          <button onclick="speakText('${c.audioText.replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
            <span>Nghe câu mẫu</span>
          </button>
        </div>

        <!-- Khung câu đang ghép của học viên -->
        <div class="mb-4">
          <div class="text-xs text-slate-400 mb-1.5">Câu bạn đang ghép (Bấm vào từ để gỡ bỏ):</div>
          <div id="constructedSentence-${c.id}" class="min-h-[52px] p-3 rounded-xl bg-slate-950/80 border-2 border-dashed border-slate-800 flex flex-wrap items-center gap-2">
            <span class="text-xs text-slate-600 italic" id="emptyPlaceholder-${c.id}">Bấm các khối từ bên dưới để ghép thành câu hoàn chỉnh...</span>
          </div>
        </div>

        <!-- Khay các khối từ có thể bấm (Word Bank) -->
        <div class="mb-4">
          <div class="text-xs text-slate-400 mb-1.5">Khay khối từ (Chạm để xếp vào câu):</div>
          <div id="wordBank-${c.id}" class="flex flex-wrap gap-2">
            ${shuffledWords.map((w, wIdx) => `
              <button id="wordTile-${c.id}-${wIdx}" onclick="clickWordTile('${c.id}', '${w.replace(/'/g, "\\'")}', ${wIdx})" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 hover:border-amber-400 transition shadow-sm active:scale-95">
                ${w}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Ô gõ phím trực tiếp (Active Typing Input) -->
        <div class="pt-3 border-t border-slate-800/80">
          <div class="flex items-center space-x-2">
            <input type="text" id="directInput-${c.id}" onkeyup="handleDirectTyping(event, '${c.id}', '${c.fullSentence.replace(/'/g, "\\'")}')" placeholder="Hoặc gõ trực tiếp toàn bộ câu tiếng Anh vào đây rồi nhấn Enter..." class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 transition">
            <button onclick="submitDirectTyping('${c.id}', '${c.fullSentence.replace(/'/g, "\\'")}')" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex-shrink-0 transition">
              Kiểm Tra
            </button>
          </div>
          <div id="typingFeedback-${c.id}" class="hidden mt-2 p-2.5 rounded-xl text-xs"></div>
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

window.clickWordTile = function(challengeId, word, tileIdx) {
  const tileBtn = document.getElementById(`wordTile-${challengeId}-${tileIdx}`);
  if (!tileBtn || tileBtn.disabled) return;

  const challenge = (CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId)?.typingChallenges || []).find(c => c.id === challengeId);
  if (!challenge) return;

  tileBtn.disabled = true;
  tileBtn.classList.add("opacity-30", "pointer-events-none");

  const state = typingUserState[challengeId];
  state.constructedWords.push({ word, tileIdx });

  updateConstructedSentenceUI(challengeId, challenge);
};

window.removeConstructedWord = function(challengeId, indexInConstructed) {
  const state = typingUserState[challengeId];
  if (!state || !state.constructedWords[indexInConstructed]) return;

  const removed = state.constructedWords.splice(indexInConstructed, 1)[0];
  const tileBtn = document.getElementById(`wordTile-${challengeId}-${removed.tileIdx}`);
  if (tileBtn) {
    tileBtn.disabled = false;
    tileBtn.classList.remove("opacity-30", "pointer-events-none");
  }

  const challenge = (CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId)?.typingChallenges || []).find(c => c.id === challengeId);
  if (challenge) updateConstructedSentenceUI(challengeId, challenge);
};

function updateConstructedSentenceUI(challengeId, challenge) {
  const container = document.getElementById(`constructedSentence-${challengeId}`);
  if (!container) return;

  const state = typingUserState[challengeId];
  if (state.constructedWords.length === 0) {
    container.innerHTML = `<span class="text-xs text-slate-600 italic" id="emptyPlaceholder-${challengeId}">Bấm các khối từ bên dưới để ghép thành câu hoàn chỉnh...</span>`;
    return;
  }

  container.innerHTML = state.constructedWords.map((item, idx) => `
    <button onclick="removeConstructedWord('${challengeId}', ${idx})" class="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center space-x-1.5 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 transition">
      <span>${item.word}</span>
      <i data-lucide="x" class="w-3 h-3 text-slate-400"></i>
    </button>
  `).join("");

  if (window.lucide) window.lucide.createIcons();

  const currentSentence = state.constructedWords.map(w => w.word).join(" ");
  if (state.constructedWords.length >= challenge.targetWords.length) {
    checkSentenceCompletion(challengeId, currentSentence, challenge.fullSentence);
  }
}

function normalizeSentence(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

function checkSentenceCompletion(challengeId, currentSentence, expectedSentence) {
  const feedbackEl = document.getElementById(`typingFeedback-${challengeId}`);
  const card = document.getElementById(`typingCard-${challengeId}`);
  if (!feedbackEl || !card) return;

  const isMatch = normalizeSentence(currentSentence) === normalizeSentence(expectedSentence);

  feedbackEl.classList.remove("hidden");
  if (isMatch) {
    playCorrectSound();
    feedbackEl.className = "mt-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300";
    feedbackEl.innerHTML = `🎉 <strong>Chính xác tuyệt đối!</strong> Câu hoàn chỉnh: <em>"${expectedSentence}"</em>. Đã cộng +2 điểm khắc sâu nơ-ron!`;
    card.classList.add("border-emerald-500/40");
    markChunkTyped(expectedSentence);
  } else {
    playIncorrectSound();
    feedbackEl.className = "mt-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300";
    feedbackEl.innerHTML = `💡 Trật tự từ chưa đúng! Hãy bấm vào khối từ bị sai để gỡ ra và thử lại nhé.`;
  }
}

window.handleDirectTyping = function(event, challengeId, fullSentence) {
  if (event.key === 'Enter') {
    submitDirectTyping(challengeId, fullSentence);
  }
};

window.submitDirectTyping = function(challengeId, fullSentence) {
  const inputEl = document.getElementById(`directInput-${challengeId}`);
  if (!inputEl) return;
  const typedText = inputEl.value.trim();
  if (!typedText) return;

  checkSentenceCompletion(challengeId, typedText, fullSentence);
};

// ==============================================================
// 12. HÀM TÍNH ĐỘ CHUẨN XÁC GIỌNG NÓI & NHẬN DIỆN PHÁT ÂM
// ==============================================================
function normalizeText(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function calculateSimilarity(str1, str2) {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  let matches = 0;
  words1.forEach(w => {
    if (words2.includes(w)) matches++;
  });
  return Math.min(1.0, (matches / Math.max(words1.length, words2.length)));
}

window.practiceMouthSound = function(targetWord, idx) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Trình duyệt này chưa hỗ trợ Micro nhận diện giọng nói. Hãy dùng Google Chrome hoặc Microsoft Edge để nói và chấm điểm 0đ nhé!");
    return;
  }

  const micBtn = document.getElementById(`btn-mouth-mic-${idx}`);
  const feedbackEl = document.getElementById(`mouth-feedback-${idx}`);
  if (!micBtn || !feedbackEl) return;

  const recog = new SpeechRecognition();
  recog.lang = "en-US";
  recog.continuous = false;
  recog.interimResults = false;

  recog.onstart = function() {
    micBtn.classList.add("animate-pulse", "bg-rose-600", "text-white");
    feedbackEl.classList.remove("hidden");
    feedbackEl.innerHTML = `<span class="text-rose-400 font-bold animate-pulse">● Đang lắng nghe... Hãy phát âm từ: "${targetWord}"</span>`;
  };

  recog.onresult = function(event) {
    micBtn.classList.remove("animate-pulse", "bg-rose-600", "text-white");
    const transcript = event.results[0][0].transcript;
    const similarity = calculateSimilarity(transcript, targetWord);
    const score = Math.round(similarity * 100);

    feedbackEl.classList.remove("hidden");
    if (score >= 70) {
      playCorrectSound();
      feedbackEl.className = "mt-2 p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-[11px] text-emerald-300";
      feedbackEl.innerHTML = `🎯 <strong>AI nghe bạn nói:</strong> "${transcript}" • <span class="font-mono font-bold text-emerald-400">Độ chuẩn xác: ${score}%</span> • Phát âm rất chuẩn!`;
    } else {
      playIncorrectSound();
      feedbackEl.className = "mt-2 p-2 rounded-lg bg-amber-950/50 border border-amber-500/40 text-[11px] text-amber-300";
      feedbackEl.innerHTML = `💡 <strong>AI nghe bạn nói:</strong> "${transcript}" • <span class="font-mono font-bold text-amber-400">Độ chuẩn xác: ${score}%</span> • Hãy phát âm to và rõ hơn từ: "${targetWord}" nhé!`;
    }
  };

  recog.onerror = function() {
    micBtn.classList.remove("animate-pulse", "bg-rose-600", "text-white");
    feedbackEl.innerHTML = `<span class="text-slate-400">Chưa nghe rõ âm thanh. Bấm lại nút để thử lại!</span>`;
  };

  recog.onend = function() {
    micBtn.classList.remove("animate-pulse", "bg-rose-600", "text-white");
  };

  try {
    recog.start();
  } catch (err) {
    console.warn("Lỗi start mic:", err);
  }
};

window.practiceChunkSpeech = function(targetPhrase, idx) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Trình duyệt này chưa hỗ trợ Micro nhận diện giọng nói. Hãy dùng Google Chrome hoặc Microsoft Edge để nói và chấm điểm 0đ nhé!");
    return;
  }

  const micBtn = document.getElementById(`btn-chunk-mic-${idx}`);
  const feedbackEl = document.getElementById(`chunk-feedback-${idx}`);
  if (!micBtn || !feedbackEl) return;

  const recog = new SpeechRecognition();
  recog.lang = "en-US";
  recog.continuous = false;
  recog.interimResults = false;

  recog.onstart = function() {
    micBtn.classList.add("animate-pulse", "bg-rose-600", "text-white");
    feedbackEl.classList.remove("hidden");
    feedbackEl.innerHTML = `<span class="text-rose-400 font-bold animate-pulse">● Đang lắng nghe bạn nói câu này...</span>`;
  };

  recog.onresult = function(event) {
    micBtn.classList.remove("animate-pulse", "bg-rose-600", "text-white");
    const transcript = event.results[0][0].transcript;
    const similarity = calculateSimilarity(transcript, targetPhrase);
    const score = Math.round(similarity * 100);

    feedbackEl.classList.remove("hidden");
    if (score >= 70) {
      playCorrectSound();
      markChunkSpoken(targetPhrase);
      feedbackEl.className = "mt-3 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300";
      feedbackEl.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span>🎙️ <strong>AI nghe bạn nói:</strong> "${transcript}"</span>
          <span class="font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Độ chính xác: ${score}%</span>
        </div>
        <p class="text-emerald-400/90 text-[11px]">🎉 Xuất sắc! Bạn phát âm câu này rất chuẩn xác và rõ ràng. Đã xác nhận +2 điểm phát âm nơ-ron!</p>
      `;
    } else {
      playIncorrectSound();
      feedbackEl.className = "mt-3 p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-300";
      feedbackEl.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span>🎙️ <strong>AI nghe bạn nói:</strong> "${transcript}"</span>
          <span class="font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Độ chính xác: ${score}%</span>
        </div>
        <p class="text-amber-400/90 text-[11px]">💡 Gần đúng rồi! Hãy nghe lại mẫu và chú ý phát âm rõ âm đuôi nhé (cần ≥ 70% để ghi nhận điểm).</p>
      `;
    }
  };

  recog.onerror = function() {
    micBtn.classList.remove("animate-pulse", "bg-rose-600", "text-white");
    feedbackEl.innerHTML = `<span class="text-slate-400">Không thu được âm thanh. Hãy bấm nút và nói lại nhé!</span>`;
  };

  recog.onend = function() {
    micBtn.classList.remove("animate-pulse", "bg-rose-600", "text-white");
  };

  try {
    recog.start();
  } catch (err) {
    console.warn("Lỗi start mic:", err);
  }
};

// ==============================================================
// 13. TIẾN ĐỘ HỌC VIÊN & CẬP NHẬT UI SIDEBAR ĐÃ ĐỒNG BỘ
// ==============================================================
function updateProgressUI(progress) {
  if (!progress) return;

  const percentEl = document.getElementById("personalProgressText") || document.getElementById("overallProgressPercent");
  const barEl = document.getElementById("personalProgressBar") || document.getElementById("overallProgressBar");
  const sessionCountEl = document.getElementById("personalCompletedCount") || document.getElementById("overallSessionCount");
  const hoursAccumulatedEl = document.getElementById("personalHoursCount") || document.getElementById("hoursAccumulated");

  const completedCount = (progress.completedLessons || []).length;

  if (percentEl) percentEl.textContent = `${progress.progressPercent || 0}% Chặng 0`;
  if (barEl) barEl.style.width = `${progress.progressPercent || 0}%`;
  if (sessionCountEl) sessionCountEl.textContent = `Đã học: ${completedCount}/10 buổi chặng`;
  if (hoursAccumulatedEl) hoursAccumulatedEl.textContent = `Tích lũy: ${progress.hoursAccumulated || '0.0'}h`;
}

// ==============================================================
// 14. QUẢN TRỊ ADMIN (DUYỆT HỌC VIÊN)
// ==============================================================
async function loadAdminStudents() {
  window.renderAdminEspKeysTable();
  const tbody = document.getElementById("studentsTableBody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-slate-500">Đang tải danh sách học viên từ Firebase...</td></tr>`;

  try {
    const students = await getAllStudents();
    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-slate-500">Chưa có học viên nào đăng ký.</td></tr>`;
      return;
    }

    tbody.innerHTML = students.map(s => `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="px-4 py-3 flex items-center space-x-2">
          <img src="${s.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.displayName || 'User')}" class="w-6 h-6 rounded-full" alt="avatar">
          <span class="font-medium text-white">${s.displayName || 'Ẩn danh'}</span>
        </td>
        <td class="px-4 py-3 font-mono text-xs text-slate-400">${s.email}</td>
        <td class="px-4 py-3">
          ${s.role === 'admin' ? '<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono font-bold">Admin</span>' : (s.status === 'approved' ? '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium">Đã duyệt</span>' : '<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-medium">Chờ duyệt</span>')}
        </td>
        <td class="px-4 py-3 text-right">
          ${s.role !== 'admin' ? (s.status === 'pending' ? `<button onclick="approveStudent('${s.id}')" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition">Duyệt vào học</button>` : `<button onclick="revokeStudent('${s.id}')" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 text-xs transition">Thu hồi</button>`) : '<span class="text-xs text-slate-500 font-mono">Quyền cao nhất</span>'}
        </td>
      </tr>
    `).join("");
  } catch (err) {
    console.error("Lỗi tải học viên:", err);
    tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-rose-400">Lỗi kết nối Firebase Firestore.</td></tr>`;
  }
}

window.approveStudent = async function(studentId) {
  if (confirm("Xác nhận duyệt học viên này vào học toàn quyền?")) {
    await updateStudentStatus(studentId, 'approved');
    loadAdminStudents();
  }
};

window.revokeStudent = async function(studentId) {
  if (confirm("Chuyển trạng thái học viên này về Chờ duyệt?")) {
    await updateStudentStatus(studentId, 'pending');
    loadAdminStudents();
  }
};

const refreshBtn = document.getElementById("btnRefreshStudents");
if (refreshBtn) {
  refreshBtn.addEventListener("click", loadAdminStudents);
}

// ==============================================================

// ==============================================================
// 14.5. KIỂM SOÁT PHÂN KHÚC LỘ TRÌNH (TRACK & ESP LICENSE)
// ==============================================================
function initDashboardTrack() {
  const urlParams = new URLSearchParams(window.location.search);
  const track = urlParams.get('track');
  const field = urlParams.get('field');

  const iconBadge = document.getElementById('trackIconBadge');
  const titleBadge = document.getElementById('trackTitleBadge');
  const subBadge = document.getElementById('trackSubBadge');

  if (track === 'specialized' && field) {
    const fieldNames = {
      it: 'CNTT & Kỹ Sư Phần Mềm (IT)',
      medical: 'Y Khoa & Điều Dưỡng (Healthcare)',
      business: 'Kinh Doanh & Đàm Phán (Business)',
      tourism: 'Khách Sạn & Du Lịch (Tourism)',
      logistics: 'Xuất Nhập Khẩu & Logistics (Logistics)'
    };
    const fieldName = fieldNames[field] || field.toUpperCase();
    
    let unlocked = [];
    try {
      unlocked = JSON.parse(localStorage.getItem('tienganh0d_unlocked_fields') || '[]');
    } catch(e) {}

    const isUnlocked = unlocked.includes(field);

    if (iconBadge) {
      iconBadge.textContent = '💼';
      iconBadge.className = 'w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-base border border-purple-500/30';
    }
    if (titleBadge) {
      if (isUnlocked) {
        titleBadge.innerHTML = `<span>Chuyên Ngành: ${fieldName}</span><span class="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-mono font-bold">ĐÃ MỞ KHÓA BẢN QUYỀN</span>`;
      } else {
        titleBadge.innerHTML = `<span>Chuyên Ngành: ${fieldName}</span><span class="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold">CHƯA KÍCH HOẠT KEY</span>`;
      }
    }
    if (subBadge) {
      if (isUnlocked) {
        subBadge.innerHTML = `License Key hợp lệ • Chương trình tiếng Anh nghề nghiệp chuyên sâu đang được đồng bộ bài học`;
      } else {
        subBadge.innerHTML = `⚠️ Chuyên ngành này cần mã License Key do Admin cấp riêng cho Gmail của bạn. <a href="index.html#languageMatrixSection" class="text-cyan-400 underline">Kích hoạt ngay</a>`;
      }
    }
  }
}

// 15. BOOTSTRAP HỆ THỐNG
initDashboardTrack();
// ==============================================================
selectLesson("buoi-01");

setupAuthUI(async (user, profile) => {
  currentUser = user;
  currentProfile = profile;

  const userName = document.getElementById("userName");
  const userRoleBadge = document.getElementById("userRoleBadge");
  const userAvatar = document.getElementById("userAvatar");
  const tabBtnAdmin = document.getElementById("tabBtn-adminView");
  const pendingAlert = document.getElementById("pendingAlert");

  if (user && profile) {
    if (userName) userName.textContent = user.displayName || user.email;
    if (userAvatar) userAvatar.src = user.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || "User");
    
    userProgress = await loadUserProgress(user);
    updateProgressUI(userProgress);
    renderCurriculumTree();

    if (profile.role === 'admin') {
      if (userRoleBadge) {
        userRoleBadge.textContent = "Super Admin";
        userRoleBadge.className = "text-amber-400 font-bold font-mono";
      }
      if (tabBtnAdmin) tabBtnAdmin.classList.remove('hidden');
      if (pendingAlert) pendingAlert.classList.add('hidden');
    } else {
      if (userRoleBadge) {
        userRoleBadge.textContent = profile.status === 'approved' ? "Học viên" : "Chờ duyệt";
        userRoleBadge.className = profile.status === 'approved' ? "text-emerald-400 font-medium" : "text-amber-400 font-medium";
      }
      if (tabBtnAdmin) tabBtnAdmin.classList.add('hidden');
      if (profile.status === 'pending' && pendingAlert) pendingAlert.classList.remove('hidden');
    }
  } else {
    userProgress = await loadUserProgress(null);
    updateProgressUI(userProgress);
    renderCurriculumTree();
  }

  if (window.lucide) window.lucide.createIcons();
});

// ==============================================================
// 15. QUẢN LÝ LICENSE KEY CHUYÊN NGÀNH (ESP LICENSE MANAGER)
// ==============================================================
window.handleAdminGenerateEspKey = function() {
  const email = document.getElementById("adminStudentEmail")?.value.trim().toLowerCase();
  const field = document.getElementById("adminStudentField")?.value;
  if (!email || !field) {
    alert("⚠️ Vui lòng nhập đầy đủ Gmail của học viên!");
    return;
  }

  const rand1 = Math.floor(1000 + Math.random() * 9000);
  const rand2 = Math.floor(1000 + Math.random() * 9000);
  const key = `KEY-${field.toUpperCase()}-${rand1}-${rand2}`;
  const now = new Date().toLocaleDateString('vi-VN');

  let keys = [];
  try {
    keys = JSON.parse(localStorage.getItem("tienganh0d_esp_keys") || "[]");
  } catch (e) {}

  keys.unshift({
    email: email,
    field: field,
    key: key,
    createdAt: now,
    status: 'active'
  });

  localStorage.setItem("tienganh0d_esp_keys", JSON.stringify(keys));
  window.renderAdminEspKeysTable();
  alert(`🎉 Đã cấp License Key thành công cho ${email}!\nMã Key: ${key}\nChuyên ngành: ${field.toUpperCase()}`);
};

window.renderAdminEspKeysTable = function() {
  const tbody = document.getElementById("espKeysTableBody");
  if (!tbody) return;
  let keys = [];
  try {
    keys = JSON.parse(localStorage.getItem("tienganh0d_esp_keys") || "[]");
  } catch (e) {}

  if (keys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-4 text-center text-slate-500">Chưa có License Key nào được sinh.</td></tr>`;
    return;
  }

  tbody.innerHTML = keys.map((k) => `
    <tr class="hover:bg-slate-900/60 transition">
      <td class="px-4 py-3 font-semibold text-white">${k.email}</td>
      <td class="px-4 py-3 text-cyan-300 font-bold uppercase">${k.field}</td>
      <td class="px-4 py-3 font-mono font-bold text-amber-300">${k.key}</td>
      <td class="px-4 py-3 text-slate-400">${k.createdAt || ''}</td>
      <td class="px-4 py-3 text-right">
        <button onclick="navigator.clipboard.writeText('${k.key}'); alert('Đã sao chép mã Key: ${k.key}');" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold transition cursor-pointer">
          Sao Chép
        </button>
      </td>
    </tr>
  `).join("");
  if (window.lucide) window.lucide.createIcons();
};
