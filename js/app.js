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

// ==============================================================
// HELPERS: AN TOÀN HIỂN THỊ (CHỐNG XSS) & ĐƯỜNG DẪN ẢNH
// ==============================================================
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function safePhotoURL(url, fallbackName = "Học viên") {
  try {
    const parsed = new URL(String(url || ""));
    if (parsed.protocol === "https:") return parsed.href;
  } catch (e) {}
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || "Học viên")}`;
}

function safeDocId(id) {
  return String(id || "").replace(/[^a-zA-Z0-9_-]/g, "");
}

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
  "have a nice weekend": "assets/audio/have-a-nice-weekend.mp3",
  "have a safe trip": "assets/audio/have-a-safe-trip.mp3",
  "take care see you later": "assets/audio/take-care-see-you-later.mp3",
  "youre welcome enjoy your trip": "assets/audio/david-buoi-01-turn-3.mp3"
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
  // Chỉ dùng giọng Mỹ. Không lấy en-GB/en-AU để tránh đọc lệch âm.
  const usVoice = voices.find(v => v.lang === 'en-US' && v.localService) ||
    voices.find(v => v.lang === 'en-US');
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
    window.notifyEspComingSoon();
    return;
  }
};

window.switchMainView = function(viewId) {
  if (viewId === "adminView" && !isCurrentUserAdmin()) {
    alert("🔒 Khu vực quản trị chỉ dành cho Super Admin.");
    return;
  }

  document.getElementById("curriculumView").classList.add("hidden");
  document.getElementById("adminView").classList.add("hidden");
  window.toggleSidebar(true);

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
  stopCaptionSync();
  currentLectureMeta = null;
  resetLecturePlaybackUI();
  if (activeGlobalAudio) {
    try { activeGlobalAudio.pause(); } catch(e) {}
    activeGlobalAudio = null;
  }
  if (currentLectureAudioInstance) {
    try { currentLectureAudioInstance.pause(); } catch(e) {}
    currentLectureAudioInstance = null;
  }
  if (currentSlideAudio) {
    try { currentSlideAudio.pause(); } catch(e) {}
    currentSlideAudio = null;
  }
  if (currentGuideAudio) {
    try { currentGuideAudio.pause(); } catch(e) {}
    currentGuideAudio = null;
  }
  if (currentStoryAudio) {
    try { currentStoryAudio.pause(); } catch(e) {}
    currentStoryAudio = null;
    const storyBtn = document.getElementById("btnPlayStoryAudio");
    if (storyBtn) {
      storyBtn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4"></i><span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>`;
    }
  }
  if (currentPlayingGuideStep !== null) {
    const guideBtn = document.getElementById(`btnGuideAudio-${currentPlayingGuideStep}`);
    if (guideBtn) {
      guideBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i><span>🎧 Nghe Lời Thầy Hướng Dẫn</span>`;
      guideBtn.className = "flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition flex items-center space-x-1.5 cursor-pointer";
    }
    currentPlayingGuideStep = null;
  }
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch(e) {}
  }
  if (window.lucide) window.lucide.createIcons();
};

window.playTrack = function(audioPath, onEnded, onError, rate = 1) {
  window.stopAllAudios();
  const audio = new Audio(audioPath);
  activeGlobalAudio = audio;
  try {
    audio.playbackRate = rate;
  } catch(e) {}
  audio.onended = () => {
    if (activeGlobalAudio === audio) activeGlobalAudio = null;
    if (currentLectureAudioInstance === audio) currentLectureAudioInstance = null;
    if (onEnded) onEnded();
  };
  audio.onerror = (e) => {
    if (activeGlobalAudio === audio) activeGlobalAudio = null;
    if (currentLectureAudioInstance === audio) currentLectureAudioInstance = null;
    if (onError) onError(e);
  };
  audio.play().catch(e => {
    if (activeGlobalAudio === audio) activeGlobalAudio = null;
    if (currentLectureAudioInstance === audio) currentLectureAudioInstance = null;
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
const GATING_STORAGE_PREFIX = "tienganh0d_step_gating_v2";

// Khóa tiến trình phải tách riêng theo tài khoản và theo buổi học.
// Không bao giờ đọc trạng thái trước khi biết người dùng là ai: dữ liệu cũ
// của admin hoặc của tài khoản khác không thể rò rỉ sang học viên.
function getGatingStorageKey() {
  const userKey = currentUser && currentUser.uid ? currentUser.uid : "guest";
  return `${GATING_STORAGE_PREFIX}_${userKey}_${currentActiveLessonId}`;
}

function loadStepGatingState() {
  internalUnlockedStep = 0;
  isFreeMode = false;
  if (!currentUser) return; // Khách chưa đăng nhập: chỉ dùng trạng thái trong RAM

  try {
    const savedGating = localStorage.getItem(getGatingStorageKey());
    if (!savedGating) return;
    const parsed = JSON.parse(savedGating);
    if (typeof parsed.unlockedStep === "number") {
      internalUnlockedStep = Math.max(0, Math.min(6, parsed.unlockedStep));
    }
    // Chế độ Tự Do là quyền của admin, không bao giờ kế thừa từ storage của người khác.
    if (isCurrentUserAdmin() && parsed.isFreeMode === true) {
      isFreeMode = true;
    }
  } catch (e) {
    console.warn("Lỗi đọc step gating từ localStorage:", e);
  }
}

function saveStepGatingState() {
  if (!currentUser) return;
  try {
    localStorage.setItem(getGatingStorageKey(), JSON.stringify({
      unlockedStep: internalUnlockedStep,
      isFreeMode: isCurrentUserAdmin() ? isFreeMode : false
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
  if (!isCurrentUserAdmin()) {
    isFreeMode = false;
    alert("🔒 Chế độ Tự Do chỉ dành riêng cho Quản trị viên để kiểm thử hệ thống!");
    return;
  }
  isFreeMode = !isFreeMode;
  saveStepGatingState();
  window.updateModuleTabsUI();
  if (isFreeMode) {
    alert("🔓 Đã BẬT Chế Độ Tự Do Ôn Tập (Admin Mode)!\nBạn có thể tự do mở xem và ôn tập bất kỳ bước nào trong 7 module.");
  } else {
    alert("🔒 Đã kích hoạt lại Khóa Tuần Tự!\nCác module sẽ tuân theo lộ trình tiếp thu từng bước.");
  }
};
window.toggleFreedomMode = window.toggleFreeMode;

window.openDonateModal = window.openDonateModal || function() {
  const modal = document.getElementById("donateModal");
  if (modal) modal.classList.remove("hidden");
};

window.closeDonateModal = window.closeDonateModal || function() {
  const modal = document.getElementById("donateModal");
  if (modal) modal.classList.add("hidden");
};

window.copySTKModal = window.copySTKModal || function() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText("0941958090");
  }
  alert("Đã sao chép số tài khoản MB Bank: 0941958090 (LE HOANG DUC)!");
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
  if (isFreeMode && !isCurrentUserAdmin()) {
    isFreeMode = false;
    saveStepGatingState();
  }

  MODULE_FLOW.forEach((mod, idx) => {
    const btn = document.getElementById(`btn-${mod.id}`);
    if (!btn) return;
    const isUnlocked = isFreeMode || idx <= internalUnlockedStep;
    const isCompleted = !isFreeMode && idx < internalUnlockedStep;
    btn.title = mod.title;

    if (isUnlocked) {
      btn.classList.remove("opacity-50", "cursor-not-allowed");
      btn.innerHTML = `
        <i data-lucide="${mod.icon || 'star'}" class="w-4 h-4"></i>
        <span class="module-tab-label">${mod.title}</span>
        ${isCompleted ? '<span class="text-[10px] text-emerald-400 ml-1 font-bold">✓</span>' : ''}
      `;
    } else {
      btn.classList.add("opacity-50", "cursor-not-allowed");
      btn.innerHTML = `
        <i data-lucide="lock" class="w-3.5 h-3.5 text-slate-500"></i>
        <span class="module-tab-label text-slate-500">${mod.title}</span>
      `;
    }
  });

  const label = document.getElementById('freeModeLabel');
  if (label) {
    label.textContent = isFreeMode ? 'Chế Độ Tự Do: BẬT' : 'Chế Độ Tự Do: TẮT';
  }
  const freedomStatus = document.getElementById('freedomModeStatus');
  if (freedomStatus) {
    freedomStatus.textContent = isFreeMode ? 'Tự Do: BẬT' : 'Tự Do: TẮT';
  }

  const btnFree = document.getElementById('btnToggleFreeMode');
  if (btnFree) {
    if (isFreeMode) {
      btnFree.className = "px-2.5 py-1 rounded-lg text-xs font-bold border border-cyan-500/50 text-cyan-300 bg-cyan-500/10 transition flex items-center space-x-1.5 cursor-pointer";
    } else {
      btnFree.className = "px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition flex items-center space-x-1.5 cursor-pointer";
    }
  }

  const freedomBtn = document.getElementById('freedomModeBtn');
  const isAdmin = isCurrentUserAdmin();
  if (freedomBtn) {
    if (isAdmin) {
      freedomBtn.classList.remove("hidden");
      freedomBtn.classList.add("flex");
      if (isFreeMode) {
        freedomBtn.className = "px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/40 shadow-sm transition flex items-center space-x-1 flex-shrink-0 cursor-pointer";
      } else {
        freedomBtn.className = "px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-semibold text-slate-400 hover:text-emerald-300 bg-slate-900 border border-slate-800 transition flex items-center space-x-1 flex-shrink-0 cursor-pointer";
      }
    } else {
      freedomBtn.classList.add("hidden");
      freedomBtn.classList.remove("flex");
    }
  }

  if (window.lucide) window.lucide.createIcons();
};

window.switchLessonModule = function(moduleId, autoPlayGuide = false) {
  if (moduleId === 'moduleCards') moduleId = 'moduleFlashcard';
  if (moduleId === 'moduleDialogue') moduleId = 'moduleSpeaking';
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
    try {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } catch(e) {}
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
  currentSlideIndex = 0;
  currentSlideSceneIndex = 0;
  loadStepGatingState();
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
  const phaseBadgeMobile = document.getElementById("currentPhaseBadgeMobile");
  if (phaseBadgeMobile && milestone) phaseBadgeMobile.textContent = milestone.badge;

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

  // Đóng sidebar sau khi chọn bài (trên cả PC và Mobile để trả lại 100% không gian tập trung)
  window.toggleSidebar(true);

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

let currentSlideSceneIndex = 0;

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}

// ==============================================================
// 5.4. VISUAL MOTION GRAPHICS GENERATOR CHO TỪNG CẢNH THUYẾT GIẢNG
// ==============================================================
let currentLectureAudioInstance = null;
let currentLecturePlaybackSpeed = 0.95; // Audio đã được thu chậm sẵn; không chỉnh tốc độ khi phát để hình - tiếng khớp tuyệt đối
let lectureTimingMap = null;
let lectureTimingPromise = null;
let captionFrame = null;
let currentLectureMeta = null;
let lectureIntroPlayed = false;
const LECTURE_INTRO_FILE = "assets/audio/lecture-buoi-01-intro.mp3";

function loadLectureTiming() {
  if (lectureTimingMap) return Promise.resolve(lectureTimingMap);
  if (!lectureTimingPromise) {
    lectureTimingPromise = fetch("assets/audio/lecture-buoi-01-timing.json", { cache: "force-cache" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        lectureTimingMap = data || {};
        return lectureTimingMap;
      })
      .catch(() => {
        lectureTimingMap = {};
        return lectureTimingMap;
      });
  }
  return lectureTimingPromise;
}

function getLectureTimingEntry(file) {
  if (!lectureTimingMap || !file) return null;
  const base = String(file).split("/").pop();
  return lectureTimingMap[base] || null;
}

function stopCaptionSync() {
  if (captionFrame) cancelAnimationFrame(captionFrame);
  captionFrame = null;
}

function syncLectureCaption(entry, time) {
  const ribbon = document.getElementById("lectureCaptionRibbon");
  const textEl = document.getElementById("lectureCaptionText");
  const fill = document.getElementById("lectureTimelineFill");
  const timeEl = document.getElementById("lectureTimeLabel");

  if (fill) {
    const duration = entry?.duration || 0;
    fill.style.width = duration ? `${Math.min(100, (time / duration) * 100)}%` : "0%";
  }
  if (timeEl) timeEl.textContent = formatTime(time);

  if (!ribbon || !textEl || !entry || !Array.isArray(entry.captions)) return;
  const caption = entry.captions.find((item) => time >= item.start && time < item.end);
  if (caption) {
    if (textEl.textContent !== caption.text) {
      textEl.textContent = caption.text;
      ribbon.classList.remove("caption-pop");
      void ribbon.offsetWidth;
      ribbon.classList.add("caption-pop");
    }
    ribbon.classList.remove("hidden");
  } else if (time < (entry.captions[0]?.start || 0)) {
    ribbon.classList.add("hidden");
  }
}

function startCaptionSync(audio, file) {
  stopCaptionSync();
  const entry = getLectureTimingEntry(file);
  const ribbon = document.getElementById("lectureCaptionRibbon");
  if (ribbon) ribbon.classList.add("hidden");
  if (!audio || !entry) return;

  const totalEl = document.getElementById("lectureTotalTime");
  if (totalEl) totalEl.textContent = formatTime(entry.duration || audio.duration || 0);

  const tick = () => {
    if (!audio || audio.paused || audio.ended) return;
    syncLectureCaption(entry, audio.currentTime || 0);
    captionFrame = requestAnimationFrame(tick);
  };
  captionFrame = requestAnimationFrame(tick);
}

function resetLecturePlaybackUI() {
  stopCaptionSync();
  const ribbon = document.getElementById("lectureCaptionRibbon");
  if (ribbon) ribbon.classList.add("hidden");
  const fill = document.getElementById("lectureTimelineFill");
  if (fill) fill.style.width = "0%";
  const timeEl = document.getElementById("lectureTimeLabel");
  if (timeEl) timeEl.textContent = "00:00";
}
loadLectureTiming();

function isCurrentUserAdmin() {
  return (currentProfile && currentProfile.role === 'admin') || (currentUser && currentUser.email === 'xlehoangducx@gmail.com');
}

let isCinemaMode = false;
let cinemaCountdownTimer = null;

window.startCinemaPresentationMode = function() {
  if (!isCurrentUserAdmin() || isCinemaMode) return;

  window.stopAllAudios();
  isSlideAudioPlaying = false;
  currentLectureMeta = null;
  isCinemaMode = true;
  currentSlideIndex = 0;
  currentSlideSceneIndex = 0;

  document.body.classList.add("cinema-mode");
  document.body.classList.remove("cinema-live");

  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson) {
    isCinemaMode = false;
    document.body.classList.remove("cinema-mode");
    return;
  }

  // Luôn mở màn từ slide đầu tiên để buổi quay có bố cục ổn định.
  renderMasterLecture(lesson);

  const oldOverlay = document.getElementById("cinemaCountdownOverlay");
  if (oldOverlay) oldOverlay.remove();

  const overlay = document.createElement("div");
  overlay.id = "cinemaCountdownOverlay";
  overlay.className = "cinema-countdown-overlay";
  overlay.innerHTML = `
    <span class="cinema-countdown-label">Chuẩn bị trình chiếu</span>
    <span id="cinemaCountdownNumber" class="cinema-countdown-number">5</span>
    <span class="cinema-countdown-hint">Bấm Esc để thoát bất cứ lúc nào</span>
  `;
  document.body.appendChild(overlay);

  let remainingSec = 5;
  if (cinemaCountdownTimer) clearInterval(cinemaCountdownTimer);

  cinemaCountdownTimer = setInterval(() => {
    if (!isCinemaMode) return;
    remainingSec -= 1;

    const numberEl = document.getElementById("cinemaCountdownNumber");
    if (numberEl && remainingSec > 0) numberEl.textContent = String(remainingSec);

    if (remainingSec > 0) return;

    clearInterval(cinemaCountdownTimer);
    cinemaCountdownTimer = null;
    if (!isCinemaMode) return;

    overlay.classList.add("is-fading");
    setTimeout(() => overlay.remove(), 380);

    // Sau 5 giây: ẩn toàn bộ nút/chữ điều khiển, chỉ còn slide và sóng âm để quay màn hình.
    document.body.classList.add("cinema-live");
    playSceneAudio(0);
  }, 1000);
};

window.exitCinemaMode = function(e) {
  if (e) e.stopPropagation();
  isCinemaMode = false;

  if (cinemaCountdownTimer) {
    clearInterval(cinemaCountdownTimer);
    cinemaCountdownTimer = null;
  }

  const overlay = document.getElementById("cinemaCountdownOverlay");
  if (overlay) overlay.remove();

  document.body.classList.remove("cinema-mode", "cinema-live");
  window.stopAllAudios();
  isSlideAudioPlaying = false;
  currentLectureMeta = null;

  // Khôi phục nút Hiện menu nếu header đang ẩn
  const restoreHeaderBtn = document.getElementById("btnRestoreTopHeader");
  const mainHeader = document.getElementById("mainTopHeader");
  if (mainHeader && mainHeader.classList.contains("hidden")) {
    document.body.classList.add("header-hidden");
    if (restoreHeaderBtn) {
      restoreHeaderBtn.classList.remove("hidden");
      restoreHeaderBtn.classList.add("flex");
    }
  } else {
    document.body.classList.remove("header-hidden");
  }

  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (lesson) renderMasterLecture(lesson);
};

// Bấm phím ESC để thoát chế độ trình chiếu nhanh chóng
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isCinemaMode) {
    window.exitCinemaMode();
  }
});

window.toggleTopHeader = function() {
  const header = document.getElementById("mainTopHeader");
  const restoreBtn = document.getElementById("btnRestoreTopHeader");
  if (!header) return;

  const isHidden = header.classList.contains("hidden");
  if (isHidden) {
    header.classList.remove("hidden");
    document.body.classList.remove("header-hidden");
    if (restoreBtn) {
      restoreBtn.classList.add("hidden");
      restoreBtn.classList.remove("flex");
    }
    localStorage.setItem("adminTopHeaderHidden", "false");
  } else {
    header.classList.add("hidden");
    document.body.classList.add("header-hidden");
    if (restoreBtn) {
      restoreBtn.classList.remove("hidden");
      restoreBtn.classList.add("flex");
    }
    localStorage.setItem("adminTopHeaderHidden", "true");
  }
  if (window.lucide) window.lucide.createIcons();
};

function getSceneVisualGraphicHTML(visualType, theme) {
  if (visualType === 'intro-welcome') {
    return `
      <div class="motion-beat-visual my-3 p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-inner">
        <div class="flex items-center space-x-3">
          <div class="relative w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span class="absolute inset-0 rounded-2xl bg-emerald-400/20 visual-pulse-ring"></span>
            <i data-lucide="sparkles" class="w-5 h-5 relative z-10"></i>
          </div>
          <div>
            <span class="text-xs font-bold text-emerald-300 block flex items-center space-x-1.5">
              <span>Gia Sư Trí Tuệ Nhân Tạo (Gia Sư Của Tui)</span>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Live</span>
            </span>
            <span class="text-[11px] text-slate-300">Khởi đầu lộ trình 600h chuẩn Cambridge CEFR • Đánh thức phản xạ tự nhiên</span>
          </div>
        </div>
        <div class="hidden sm:flex items-center space-x-1 text-emerald-400 text-xs font-mono bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
          <span>0đ Cộng Đồng</span>
        </div>
      </div>
    `;
  }

  if (visualType === 'neural-blockade') {
    return `
      <div class="motion-beat-visual my-3 p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between gap-3 shadow-inner">
        <div class="flex items-center space-x-3">
          <div class="relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span class="absolute inset-0 rounded-xl bg-amber-400/20 visual-pulse-ring"></span>
            <i data-lucide="shield-alert" class="w-5 h-5 relative z-10"></i>
          </div>
          <div>
            <span class="text-xs font-bold text-amber-300 block">Hiện Tượng Quá Tải Nhận Thức (Sweller 1988)</span>
            <span class="text-[11px] text-slate-300">Ngữ pháp trừu tượng kích hoạt hạch hạnh nhân, đóng sập cổng phản xạ Broca</span>
          </div>
        </div>
        <div class="hidden sm:flex items-center space-x-1 text-amber-400/70 text-xs font-mono">
          <span>Khóa Phản Xạ</span>
          <i data-lucide="lock" class="w-3.5 h-3.5"></i>
        </div>
      </div>
    `;
  }

  if (visualType === 'human-connection') {
    return `
      <div class="motion-beat-visual my-3 p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-inner">
        <div class="flex items-center space-x-3">
          <div class="relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span class="absolute inset-0 rounded-xl bg-emerald-400/20 visual-pulse-ring"></span>
            <i data-lucide="heart-handshake" class="w-5 h-5 relative z-10"></i>
          </div>
          <div>
            <span class="text-xs font-bold text-emerald-300 block">Bản Năng Sinh Tồn Xã Hội (Stephen Krashen)</span>
            <span class="text-[11px] text-slate-300">Trẻ em học nói qua cảm xúc và ngữ cảnh đời thực trước khi học công thức</span>
          </div>
        </div>
        <div class="hidden sm:flex items-center space-x-1 text-emerald-400/80 text-xs font-mono">
          <span>Hấp Thụ Tự Nhiên</span>
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
        </div>
      </div>
    `;
  }

  if (visualType === 'vietnamese-habit') {
    return `
      <div class="motion-beat-visual my-3 p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/40 space-y-2.5 shadow-inner">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-amber-300 flex items-center space-x-1.5">
            <i data-lucide="split" class="w-4 h-4 text-amber-400"></i>
            <span>So Sánh Trực Quan: Chuẩn Bản Xứ Mỹ vs Nói Bồi Tiếng Việt</span>
          </span>
          <span class="text-[10px] font-mono text-amber-400/80">3 Tật Cố Hữu</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-mono uppercase text-emerald-400 font-bold">Chuẩn Mỹ 🇺🇸</span>
              <span class="text-[10px] text-slate-400">Kẹp kẽ răng</span>
            </div>
            <span class="text-xs font-black text-emerald-300 font-mono">Thank you /θ/</span>
            <div class="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
              <span class="text-[10px] text-rose-400 font-mono line-through">"Thanh-kiu" ❌</span>
              <span class="text-[9px] text-slate-500">Rụt lưỡi</span>
            </div>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-mono uppercase text-emerald-400 font-bold">Chuẩn Mỹ 🇺🇸</span>
              <span class="text-[10px] text-slate-400">Xì kẽ răng</span>
            </div>
            <span class="text-xs font-black text-emerald-300 font-mono">Nice /s/</span>
            <div class="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
              <span class="text-[10px] text-rose-400 font-mono line-through">"Nai" ❌</span>
              <span class="text-[9px] text-slate-500">Nuốt gió</span>
            </div>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-mono uppercase text-emerald-400 font-bold">Chuẩn Mỹ 🇺🇸</span>
              <span class="text-[10px] text-slate-400">Bật nướu trên</span>
            </div>
            <span class="text-xs font-black text-emerald-300 font-mono">Meet /t/</span>
            <div class="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
              <span class="text-[10px] text-rose-400 font-mono line-through">"Mít" ❌</span>
              <span class="text-[9px] text-slate-500">Mất bật</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (visualType === 'mouth-kinematics') {
    return `
      <div class="motion-beat-visual my-3 p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 grid grid-cols-3 gap-2 text-center shadow-inner">
        <div class="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
          <span class="text-xs font-black text-cyan-300 block font-mono">/θ/ (Theta)</span>
          <span class="text-[10px] text-slate-300 block mt-0.5">Kẹp nhẹ đầu lưỡi</span>
          <span class="text-[9px] text-cyan-400/80 font-mono">Gió mát mặt lưỡi</span>
        </div>
        <div class="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
          <span class="text-xs font-black text-cyan-300 block font-mono">/s/ (Xì gió)</span>
          <span class="text-[10px] text-slate-300 block mt-0.5">Răng khép trong</span>
          <span class="text-[9px] text-cyan-400/80 font-mono">Xì hơi lốp xe</span>
        </div>
        <div class="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
          <span class="text-xs font-black text-cyan-300 block font-mono">/t/ (Bật nướu)</span>
          <span class="text-[10px] text-slate-300 block mt-0.5">Nén hơi nướu trên</span>
          <span class="text-[9px] text-cyan-400/80 font-mono">Gõ tách dứt khoát</span>
        </div>
      </div>
    `;
  }

  if (visualType === 'pareto-chart') {
    return `
      <div class="motion-beat-visual my-3 p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2 shadow-inner">
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

  if (visualType === 'foundation-pillar') {
    return `
      <div class="motion-beat-visual my-3 p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 grid grid-cols-2 gap-2 text-center shadow-inner">
        <div class="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
          <span class="text-[10px] text-cyan-400 font-bold block uppercase">20% Nền Móng Cơ Miệng</span>
          <span class="text-xs font-black text-white">/s/ & /t/ Cốt Lõi</span>
          <span class="text-[10px] text-slate-400 block mt-0.5">Xây dựng quán tính phát âm</span>
        </div>
        <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20">
          <span class="text-[10px] text-emerald-400 font-bold block uppercase">80% Kết Quả Ngữ Pháp</span>
          <span class="text-xs font-black text-white">Phản Xạ Tự Nhiên</span>
          <span class="text-[10px] text-slate-400 block mt-0.5">Tự động nói đúng số nhiều & quá khứ</span>
        </div>
      </div>
    `;
  }

  if (visualType === 'social-trinity') {
    return `
      <div class="motion-beat-visual my-3 p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex flex-wrap items-center justify-around gap-2 text-center shadow-inner">
        <div class="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30">
          <span class="text-[10px] text-emerald-400 block font-bold">1. Chào Hỏi</span>
          <span class="text-xs font-bold text-white font-mono">Hi, nice to meet you!</span>
        </div>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-emerald-400"></i>
        <div class="px-3 py-1.5 rounded-lg bg-teal-950/50 border border-teal-500/30">
          <span class="text-[10px] text-teal-400 block font-bold">2. Biết Ơn</span>
          <span class="text-xs font-bold text-white font-mono">Thank you so much!</span>
        </div>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-teal-400"></i>
        <div class="px-3 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30">
          <span class="text-[10px] text-cyan-400 block font-bold">3. Chúc Lành</span>
          <span class="text-xs font-bold text-white font-mono">Have a great day!</span>
        </div>
      </div>
    `;
  }

  if (visualType === 'dopamine-spark') {
    return `
      <div class="motion-beat-visual my-3 p-3 rounded-xl bg-slate-900/80 border border-purple-500/30 flex items-center justify-around gap-2 text-center shadow-inner">
        <div class="px-2.5 py-1.5 rounded-lg bg-purple-950/50 border border-purple-500/30">
          <span class="text-[10px] text-purple-300 block font-bold">1. Nói Chuẩn 3 Câu</span>
          <span class="text-xs font-bold text-white">Hi • Thanks • Bye</span>
        </div>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-purple-400"></i>
        <div class="px-2.5 py-1.5 rounded-lg bg-pink-950/50 border border-pink-500/30">
          <span class="text-[10px] text-pink-300 block font-bold">2. Nụ Cười Bản Xứ</span>
          <span class="text-xs font-bold text-white">Đón Nhận Ấm Áp</span>
        </div>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-pink-400"></i>
        <div class="px-2.5 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30">
          <span class="text-[10px] text-emerald-300 block font-bold">3. Tiết Dopamine</span>
          <span class="text-xs font-bold text-white">Xóa 100% Nỗi Sợ</span>
        </div>
      </div>
    `;
  }

  if (visualType === 'multimodal-flow') {
    return `
      <div class="motion-beat-visual my-3 p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/30 grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center shadow-inner">
        <div class="p-1.5 rounded bg-blue-950/40 border border-blue-500/20 text-[10px] font-bold text-blue-300">1. Soi Gương</div>
        <div class="p-1.5 rounded bg-blue-950/40 border border-blue-500/20 text-[10px] font-bold text-blue-300">2. Nghe Mẫu</div>
        <div class="p-1.5 rounded bg-blue-950/40 border border-blue-500/20 text-[10px] font-bold text-blue-300">3. Nói AI</div>
        <div class="p-1.5 rounded bg-blue-950/40 border border-blue-500/20 text-[10px] font-bold text-blue-300">4. Trắc Nghiệm</div>
        <div class="p-1.5 rounded bg-blue-950/40 border border-blue-500/20 text-[10px] font-bold text-blue-300">5. Thẻ 3D</div>
        <div class="p-1.5 rounded bg-blue-950/40 border border-blue-500/20 text-[10px] font-bold text-blue-300">6. Ghép Câu</div>
      </div>
    `;
  }

  if (visualType === 'synaptic-consolidation') {
    return `
      <div class="motion-beat-visual my-3 p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 grid grid-cols-2 gap-2 text-center shadow-inner">
        <div class="p-2 rounded-lg bg-rose-950/30 border border-rose-500/20">
          <span class="text-[10px] text-rose-400 block font-bold">Học Dồn 1 Lần</span>
          <span class="text-xs font-bold text-slate-300">Hippocampus Quá Tải</span>
          <span class="text-[10px] text-rose-400/80 block mt-0.5">Rơi rụng 85% sau 24h</span>
        </div>
        <div class="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
          <span class="text-[10px] text-emerald-400 block font-bold">7 Lần Lặp Ngắt Quãng</span>
          <span class="text-xs font-bold text-white">Vỏ Não Dài Hạn (LTP)</span>
          <span class="text-[10px] text-emerald-400/90 block mt-0.5">Khắc sâu phản xạ vĩnh viễn</span>
        </div>
      </div>
    `;
  }

  return "";
}

function cleanSceneBadge(text) {
  return String(text || "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/GIA SƯ AI/gi, "LỜI MỞ ĐẦU")
    .replace(/\s+/g, " ")
    .trim();
}

function renderSceneCardHTML(sc, sIdx, totalScenes) {
  if (!sc) return "";
  const theme = sc.theme || "emerald";
  const isEmerald = theme === "emerald";
  const isCyan = theme === "cyan";
  const isIndigo = theme === "indigo";
  const isPurple = theme === "purple";
  const isBlue = theme === "blue";

  const badgeClass = isEmerald ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" :
                     isCyan ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40" :
                     isIndigo ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/40" :
                     isPurple ? "bg-purple-500/15 text-purple-300 border-purple-500/40" :
                     isBlue ? "bg-blue-500/15 text-blue-300 border-blue-500/40" :
                     "bg-amber-500/15 text-amber-300 border-amber-500/40";

  const calloutBorder = isEmerald ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200" :
                        isCyan ? "border-cyan-500/40 bg-cyan-950/40 text-cyan-200" :
                        isPurple ? "border-purple-500/40 bg-purple-950/40 text-purple-200" :
                        isBlue ? "border-blue-500/40 bg-blue-950/40 text-blue-200" :
                        "border-amber-500/40 bg-amber-950/40 text-amber-200";

  const visualHTML = getSceneVisualGraphicHTML(sc.visualType, theme);

  return `
    <div class="scene-active-card scene-kinetic p-4 sm:p-5 rounded-2xl bg-slate-950/75 border border-slate-800/90 shadow-xl" data-scene-theme="${theme}">
      <div class="mb-3 flex items-center justify-between gap-2">
        <span class="scene-kicker inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.14em] border ${badgeClass}">
          ${cleanSceneBadge(sc.badge)}
        </span>
        <span class="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse"></span>
          Đang trình bày
        </span>
      </div>

      <h3 class="scene-title text-lg sm:text-2xl md:text-[1.7rem] font-black text-white mb-2.5 leading-snug">
        ${sc.title}
      </h3>

      ${visualHTML}

      ${sc.insight ? `
        <div class="scene-insight motion-beat-point-0 p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-start space-x-3 my-3 shadow-md">
          <div class="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 flex-shrink-0">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
          </div>
          <p class="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">${sc.insight}</p>
        </div>
      ` : sc.points && sc.points.length > 0 ? `
        <div class="space-y-2 mb-3">
          ${sc.points.map((pt, pIdx) => `
            <div class="motion-beat-point-${Math.min(pIdx, 2)} p-2.5 sm:p-3 rounded-xl bg-slate-900/75 border border-slate-800/80 flex items-start space-x-2.5">
              <div class="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 flex-shrink-0">
                <i data-lucide="${pt.icon || 'check'}" class="w-3.5 h-3.5"></i>
              </div>
              <p class="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">${pt.text}</p>
            </div>
          `).join("")}
        </div>
      ` : ""}

      ${sc.callout ? `
        <div class="scene-callout motion-beat-callout p-2.5 sm:p-3 rounded-xl border ${calloutBorder} text-[11px] sm:text-xs leading-relaxed font-medium mt-2 flex items-start space-x-2 shadow-inner">
          <i data-lucide="${sc.icon || 'info'}" class="w-3.5 h-3.5 flex-shrink-0 mt-0.5"></i>
          <span>${sc.callout}</span>
        </div>
      ` : ""}
    </div>
  `;
}

window.switchScene = function(sIdx) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const slide = lesson?.masterLecture?.slides?.[currentSlideIndex];
  if (!slide || !slide.scenes || !slide.scenes[sIdx]) return;

  currentSlideSceneIndex = sIdx;
  const scene = slide.scenes[sIdx];
  const stage = document.getElementById("activeSlideCard");
  if (stage) stage.dataset.theme = scene.theme || "emerald";

  const container = document.getElementById("activeSceneContentContainer");
  if (!container) return;

  const html = renderSceneCardHTML(scene, sIdx, slide.scenes.length);
  const currentLayer = container.querySelector(".scene-layer.is-current");

  if (!currentLayer) {
    container.innerHTML = `<div class="scene-layer is-current">${html}</div>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Crossfade thật: giữ cảnh cũ trong lúc cảnh mới hiện lên, không có khung hình đen.
  const oldHeight = container.offsetHeight;
  container.style.minHeight = `${oldHeight}px`;

  const newLayer = document.createElement("div");
  newLayer.className = "scene-layer scene-layer-enter";
  newLayer.innerHTML = html;
  container.appendChild(newLayer);
  void newLayer.offsetHeight;

  requestAnimationFrame(() => {
    newLayer.classList.add("is-visible");
    currentLayer.classList.add("is-leaving");
  });

  setTimeout(() => {
    currentLayer.remove();
    newLayer.classList.remove("scene-layer-enter", "is-visible");
    newLayer.classList.add("is-current");
    container.style.minHeight = "";
    if (window.lucide) window.lucide.createIcons();
  }, 430);

  if (window.lucide) window.lucide.createIcons();
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
  currentSlideIndex = Math.max(0, Math.min(currentSlideIndex, slides.length - 1));
  const currentSlide = slides[currentSlideIndex] || slides[0];
  const isLast = currentSlideIndex === slides.length - 1;
  const scenes = currentSlide.scenes || [];
  const currentScene = scenes[currentSlideSceneIndex] || scenes[0];
  const isAdmin = isCurrentUserAdmin();

  container.innerHTML = `
    <div class="cyber-card lecture-stage-card p-3 sm:p-5 rounded-2xl relative overflow-hidden transition-all duration-300 w-full" id="slideStageMainCard">
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="lecture-top-chrome relative z-10 border-b border-slate-800/90 pb-2.5 mb-3" data-cinema-hide>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>BÀI GIẢNG</span>
          </span>

          <div class="flex items-center space-x-1.5" aria-label="Chọn slide">
            ${slides.map((s, idx) => `
              <button onclick="goToSlide(${idx})" class="h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlideIndex ? 'w-8 bg-emerald-400 shadow-md shadow-emerald-500/50' : idx < currentSlideIndex ? 'w-3 bg-emerald-700 hover:bg-emerald-600' : 'w-3 bg-slate-800 hover:bg-slate-700'}" title="Slide ${idx + 1}: ${escapeHtml(s.title)}" aria-label="Slide ${idx + 1}"></button>
            `).join("")}
          </div>
        </div>

        <h2 class="text-sm sm:text-lg md:text-xl font-black text-white tracking-wide mb-0.5 leading-snug">
          ${currentSlide.title}
        </h2>
        <p class="text-[11px] sm:text-xs text-emerald-400/90 font-medium">
          ${currentSlide.subtitle}
        </p>
      </div>

      <div class="lecture-cinema-stage relative z-10 mb-3 rounded-2xl bg-slate-900/95 border ${isSlideAudioPlaying ? 'border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40' : 'border-slate-800'} shadow-2xl transition-all duration-300" id="activeSlideCard" data-theme="${currentScene?.theme || 'emerald'}">
        <div class="lecture-stage-grid" aria-hidden="true"></div>

        <div id="activeSceneContentContainer" class="lecture-scene-container">
          <div class="scene-layer is-current">${renderSceneCardHTML(currentScene, currentSlideSceneIndex, scenes.length)}</div>
        </div>

        <div id="lectureCaptionRibbon" class="lecture-caption-ribbon hidden" aria-live="polite">
          <span id="lectureCaptionText"></span>
        </div>

        <div class="lecture-timeline" aria-hidden="true">
          <div id="lectureTimelineFill" class="lecture-timeline-fill"></div>
        </div>
        <div class="lecture-time-row">
          <span id="lectureTimeLabel">00:00</span>
          <span class="text-slate-600">/</span>
          <span id="lectureTotalTime">00:00</span>
        </div>

        <div id="cinemaWave" class="cinema-wave hidden" onclick="exitCinemaMode(event)" title="Bấm để thoát chế độ trình chiếu (hoặc phím Esc)">
          ${[8, 14, 20, 26, 18, 22, 12, 24, 16, 10, 18, 26, 20, 14, 22, 16, 24, 12, 18, 10,
             12, 22, 16, 26, 18, 10, 24, 14, 20, 16, 26, 18, 12, 22, 14, 20, 26, 18, 10, 16,
             8, 14, 20, 26, 18, 22, 12, 24, 16, 10, 18, 26, 20, 14, 22, 16, 24, 12, 18, 10].map((h, i) => `
            <span class="w-1 rounded-full ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-cyan-400'} animate-pulse" style="height: ${h}px; animation-duration: ${0.6 + (i % 5) * 0.15}s; animation-delay: ${i * 35}ms"></span>
          `).join('')}
        </div>
      </div>

      <div id="lectureAudioControlBar" class="relative z-10 mb-1 p-2.5 sm:p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-500" data-cinema-hide>
        <button id="btnPlaySlideAudio" onclick="toggleSlideAudio()" class="px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold ${isSlideAudioPlaying ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'} transition flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0">
          <i data-lucide="${isSlideAudioPlaying ? 'pause' : 'play'}" class="w-4 h-4 fill-current"></i>
          <span>${isSlideAudioPlaying ? 'Tạm Dừng' : 'Nghe Thuyết Giảng'}</span>
        </button>

        <button id="btnCinemaMode" onclick="startCinemaPresentationMode()" class="${isAdmin ? 'flex' : 'hidden'} px-3.5 sm:px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 transition items-center justify-center space-x-1.5 cursor-pointer flex-shrink-0" title="Chế độ trình chiếu tự động (Chỉ dành cho Admin)">
          <i data-lucide="play-square" class="w-4 h-4 text-cyan-400"></i>
          <span>Trình Chiếu</span>
        </button>

        <div id="lectureWaveVisualizer" class="flex items-center space-x-1.5 ${isSlideAudioPlaying ? 'opacity-100' : 'opacity-30'} transition-all duration-500" aria-hidden="true">
          <span class="w-1.5 h-4 bg-emerald-400 rounded-full animate-pulse"></span>
          <span class="w-1.5 h-6 bg-cyan-400 rounded-full animate-pulse" style="animation-delay: 150ms"></span>
          <span class="w-1.5 h-3 bg-teal-400 rounded-full animate-pulse" style="animation-delay: 300ms"></span>
          <span class="w-1.5 h-5 bg-emerald-400 rounded-full animate-pulse" style="animation-delay: 450ms"></span>
        </div>
      </div>

      <p id="lectureHint" class="relative z-10 text-center text-[10px] sm:text-[11px] text-slate-500 px-2 min-h-[16px]" data-cinema-hide></p>

      ${isLast ? `
        <div class="relative z-10 pt-2.5 mt-1 border-t border-slate-800 flex justify-center" data-cinema-hide>
          <button onclick="finishMasterLectureAndUnlockStep1()" class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-[11px] sm:text-sm font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition flex items-center justify-center space-x-2 cursor-pointer">
            <span>Hoàn Thành Bài Giảng • Chuyển Sang Bước 1: Khẩu Hình</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      ` : ''}
    </div>
  `;

  if (isSlideAudioPlaying && currentLectureMeta?.audio && !currentLectureMeta.audio.paused) {
    updateLectureControls(true);
    startCaptionSync(currentLectureMeta.audio, currentLectureMeta.file);
  }

  if (window.lucide) window.lucide.createIcons();
}

function updateLectureControls(isPlaying) {
  const btn = document.getElementById("btnPlaySlideAudio");
  if (btn) {
    btn.className = `px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold ${isPlaying ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'} transition flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0`;
    btn.innerHTML = `
      <i data-lucide="${isPlaying ? 'pause' : 'play'}" class="w-4 h-4 fill-current"></i>
      <span>${isPlaying ? 'Tạm Dừng' : 'Nghe Thuyết Giảng'}</span>
    `;
  }
  const wave = document.getElementById("lectureWaveVisualizer");
  if (wave) {
    wave.classList.toggle("opacity-30", !isPlaying);
    wave.classList.toggle("opacity-100", isPlaying);
  }
  if (window.lucide) window.lucide.createIcons();
}

async function playSceneAudio(sIdx, options = {}) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const slide = lesson?.masterLecture?.slides?.[currentSlideIndex];
  if (!slide || !slide.scenes || !slide.scenes[sIdx]) return;

  await loadLectureTiming();

  const scene = slide.scenes[sIdx];
  const sceneAudioFile = scene.audioFile || slide.audioFile;
  if (!sceneAudioFile) return;

  const introEntry = getLectureTimingEntry(LECTURE_INTRO_FILE);
  const shouldPlayIntro = !options.skipIntro &&
    !lectureIntroPlayed &&
    currentSlideIndex === 0 &&
    sIdx === 0 &&
    !!introEntry;

  if (shouldPlayIntro) lectureIntroPlayed = true;

  const audioFile = shouldPlayIntro ? LECTURE_INTRO_FILE : sceneAudioFile;
  const hint = document.getElementById("lectureHint");
  if (hint) hint.textContent = shouldPlayIntro ? "Lời chào mở đầu • Bài giảng sẽ bắt đầu ngay sau đó" : "";

  isSlideAudioPlaying = true;
  updateLectureControls(true);

  const meta = { file: audioFile, sceneIndex: sIdx, audio: null, isIntro: shouldPlayIntro };

  const audioTrack = window.playTrack(audioFile, () => {
    if (currentLectureMeta !== meta) return;
    if (!isSlideAudioPlaying) return;

    if (meta.isIntro) {
      currentLectureMeta = null;
      setTimeout(() => {
        if (isSlideAudioPlaying) playSceneAudio(sIdx, { skipIntro: true });
      }, 180);
      return;
    }

    if (sIdx < slide.scenes.length - 1) {
      currentLectureMeta = null;
      setTimeout(() => {
        if (!isSlideAudioPlaying) return;
        window.switchScene(sIdx + 1);
        setTimeout(() => {
          if (isSlideAudioPlaying) playSceneAudio(sIdx + 1, { skipIntro: true });
        }, 220);
      }, 160);
      return;
    }

    // Hết cảnh cuối của slide: dừng tại đây, không tự nhảy slide khi người học chỉ bấm nghe.
    isSlideAudioPlaying = false;
    currentLectureMeta = null;
    updateLectureControls(false);
    resetLecturePlaybackUI();
    if (hint) {
      hint.textContent = isLastSlide()
        ? "Đã nghe hết bài giảng. Bạn có thể hoàn thành để mở khóa Bước 1."
        : "Đã hết slide này. Chọn chấm tròn phía trên để sang slide tiếp theo.";
    }

    if (isCinemaMode && currentSlideIndex < lesson.masterLecture.slides.length - 1) {
      setTimeout(() => {
        if (isCinemaMode) window.goToSlide(currentSlideIndex + 1, true);
      }, 700);
    } else {
      window.unlockStep(1, false);
    }
  }, () => {
    if (currentLectureMeta !== meta) return;
    isSlideAudioPlaying = false;
    currentLectureMeta = null;
    updateLectureControls(false);
    resetLecturePlaybackUI();
    if (hint) hint.textContent = "Không tải được tệp âm thanh. Hãy kiểm tra kết nối và thử lại.";
  });

  meta.audio = audioTrack;
  currentLectureMeta = meta;
  currentLectureAudioInstance = audioTrack;

  if (audioTrack) {
    const beginCaption = () => {
      if (currentLectureMeta === meta) startCaptionSync(audioTrack, audioFile);
    };
    if (!audioTrack.paused) {
      beginCaption();
    } else {
      audioTrack.addEventListener("playing", beginCaption, { once: true });
    }
  }
}

function isLastSlide() {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  return currentSlideIndex >= (lesson?.masterLecture?.slides?.length || 1) - 1;
}

window.goToSlide = function(idx, keepPlaying = false) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson?.masterLecture?.slides) return;

  window.stopAllAudios();
  currentSlideIndex = Math.max(0, Math.min(idx, lesson.masterLecture.slides.length - 1));
  currentSlideSceneIndex = 0;
  isSlideAudioPlaying = Boolean(keepPlaying);
  renderMasterLecture(lesson);

  const stage = document.getElementById("slideStageMainCard");
  if (stage) {
    stage.classList.remove("slide-stage-enter");
    void stage.offsetWidth;
    stage.classList.add("slide-stage-enter");
  }

  if (keepPlaying) {
    setTimeout(() => playSceneAudio(0, { skipIntro: true }), 240);
  } else {
    updateLectureControls(false);
  }
};

window.nextSlide = function() {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson?.masterLecture?.slides) return;
  if (currentSlideIndex < lesson.masterLecture.slides.length - 1) {
    window.goToSlide(currentSlideIndex + 1, false);
  }
};

window.prevSlide = function() {
  if (currentSlideIndex > 0) {
    window.goToSlide(currentSlideIndex - 1, false);
  }
};

window.toggleSlideAudio = function() {
  const meta = currentLectureMeta;
  const audio = meta?.audio;

  if (isSlideAudioPlaying) {
    if (audio) {
      try { audio.pause(); } catch (e) {}
    }
    isSlideAudioPlaying = false;
    stopCaptionSync();
    updateLectureControls(false);
    return;
  }

  // Nếu đang tạm dừng đúng cảnh hiện tại thì tiếp tục, không phát lại từ đầu và không nhảy slide.
  if (meta && audio && audio.paused && !audio.ended && audio.currentTime > 0) {
    isSlideAudioPlaying = true;
    updateLectureControls(true);
    audio.play().then(() => {
      if (currentLectureMeta === meta) startCaptionSync(audio, meta.file);
    }).catch(() => {
      isSlideAudioPlaying = false;
      updateLectureControls(false);
    });
    return;
  }

  playSceneAudio(currentSlideSceneIndex || 0);
};

window.finishMasterLectureAndUnlockStep1 = function() {
  window.stopAllAudios();
  isSlideAudioPlaying = false;
  window.unlockStep(1, true);
  window.scrollTo({ top: 120, behavior: "smooth" });
};

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
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <div class="flex items-center space-x-3 text-xs text-amber-300">
              <span class="text-2xl">💡</span>
              <div>
                <div class="font-bold text-amber-400">Bạn đạt ${userQuizScore}/${totalQuizzes} câu (cần ≥ 70% để mở khóa bước tiếp theo).</div>
                <p class="text-slate-400 text-[11px] mt-0.5">Làm lại từ đầu để ôn tập và ghi nhớ sâu hơn. Điểm lần trước vẫn được lưu trong lịch sử.</p>
              </div>
            </div>
            <button onclick="resetQuizAttempt()" class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 transition flex items-center space-x-1.5 cursor-pointer flex-shrink-0">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
              <span>Làm lại bài</span>
            </button>
          </div>
        `;
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }
};

window.resetQuizAttempt = function() {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  if (!lesson) return;
  const finishBanner = document.getElementById("quizFinishBanner");
  if (finishBanner) {
    finishBanner.classList.add("hidden");
    finishBanner.innerHTML = "";
  }
  renderQuizzes(lesson.quizzes);
  const quizModule = document.getElementById("moduleQuiz");
  if (quizModule) quizModule.scrollIntoView({ behavior: "smooth", block: "start" });
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

window.playDialogueTurnAudio = function(turnIndex) {
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
    const normKey = phrase.trim().toLowerCase().replace(/[.,!?;:"']/g, "").replace(/\s+/g, " ").trim();
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

  // Tìm câu thoại của AI ngay trước lượt của user hiện tại để đồng bộ song song (Dual-coding)
  const userIdx = currentDialogueScenario.turns.indexOf(currentTurn);
  const aiTurn = userIdx > 0 ? currentDialogueScenario.turns[userIdx - 1] : currentDialogueScenario.turns[0];

  const aiBox = document.getElementById("aiPartnerPromptBox");
  const aiSpeaker = document.getElementById("aiPartnerSpeakerName");
  const aiAvatar = document.getElementById("aiPartnerAvatar");
  const aiText = document.getElementById("aiPartnerText");
  const aiIpa = document.getElementById("aiPartnerIpa");
  const aiMeaning = document.getElementById("aiPartnerMeaning");

  if (aiTurn && aiTurn.role === 'ai') {
    if (aiBox) aiBox.classList.remove("hidden");
    if (aiSpeaker) aiSpeaker.textContent = `${aiTurn.speaker || 'David'} vừa nói:`;
    if (aiAvatar) aiAvatar.textContent = currentDialogueScenario.characterAvatar || '👨‍💼';
    if (aiText) aiText.textContent = `"${aiTurn.text}"`;
    if (aiIpa) aiIpa.textContent = aiTurn.ipa || '';
    if (aiMeaning) aiMeaning.textContent = aiTurn.meaning || '';
  } else if (aiBox) {
    aiBox.classList.add("hidden");
  }

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

  if (window.lucide) window.lucide.createIcons();
}

window.narrateCurrentScenario = function() {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const audioPath = lesson?.dialogueScenario?.storyAudioFile || `assets/audio/story-${currentActiveLessonId}.mp3`;
  const btn = document.querySelector('[onclick="narrateCurrentScenario()"]');

  if (currentStoryAudio) {
    window.stopAllAudios();
    currentStoryAudio = null;
    if (btn) {
      btn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4"></i><span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
    return;
  }

  if (btn) {
    btn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4 text-amber-300 animate-pulse"></i><span class="text-amber-300">Đang phát lời kể... (Bấm dừng)</span>`;
    if (window.lucide) window.lucide.createIcons();
  }

  currentStoryAudio = window.playTrack(audioPath, () => {
    currentStoryAudio = null;
    const noticeEl = document.getElementById("voiceNoticeTip");
    if (noticeEl) noticeEl.classList.add("hidden");
    if (btn) {
      btn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4"></i><span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }, () => {
    currentStoryAudio = null;
    if (lesson?.dialogueScenario?.storyNarrativeVi) {
      speakVietnamese(lesson.dialogueScenario.storyNarrativeVi);
    }
    if (btn) {
      btn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4"></i><span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>`;
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

  const aiBox = document.getElementById("aiPartnerPromptBox");
  if (aiBox) {
    aiBox.classList.add("ring-2", "ring-cyan-400", "shadow-[0_0_25px_rgba(6,182,212,0.4)]");
    setTimeout(() => {
      aiBox.classList.remove("ring-2", "ring-cyan-400", "shadow-[0_0_25px_rgba(6,182,212,0.4)]");
    }, 2800);
  }

  if (aiTurn && aiTurn.role === 'ai') {
    let audioPath = aiTurn.audioFile;
    if (!audioPath) {
      const phrase = aiTurn.text || '';
      const normKey = phrase.trim().toLowerCase().replace(/[.,!?;:"']/g, "").replace(/\s+/g, " ").trim();
      audioPath = VIENEU_AUDIO_MAP[normKey];
    }
    if (audioPath) {
      window.playTrack(audioPath);
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
      const normKey = phrase.trim().toLowerCase().replace(/[.,!?;:"']/g, "").replace(/\s+/g, " ").trim();
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

function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
}

// So khớp theo chuỗi từ: đúng thứ tự, sai vị trí hoặc thiếu từ đều bị trừ điểm.
function calculateSimilarity(str1, str2) {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const distance = levenshteinDistance(words1, words2);
  return Math.max(0, Math.min(1, 1 - distance / Math.max(words1.length, words2.length)));
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

  const headerBadge = document.getElementById("headerProgressBadge");
  if (headerBadge) headerBadge.textContent = `${progress.progressPercent || 0}%`;

  const reviewAlert = document.getElementById("spacedReviewAlert");
  if (reviewAlert) reviewAlert.classList.toggle("hidden", !progress.needsReview);
  const inactiveDays = document.getElementById("inactiveDaysCount");
  if (inactiveDays) inactiveDays.textContent = String(progress.daysInactive || 0);
}

// ==============================================================
// 14. QUẢN TRỊ ADMIN (DUYỆT HỌC VIÊN)
// ==============================================================
async function loadAdminStudents() {
  const tbody = document.getElementById("studentsTableBody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-slate-500">Đang tải danh sách học viên từ Firebase...</td></tr>`;

  try {
    const students = await getAllStudents();
    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-slate-500">Chưa có học viên nào đăng ký.</td></tr>`;
      return;
    }

    tbody.innerHTML = students.map(s => {
      const studentId = safeDocId(s.id);
      const displayName = escapeHtml(s.displayName || "Ẩn danh");
      const email = escapeHtml(s.email || "Không có email");
      const avatar = escapeHtml(safePhotoURL(s.photoURL, s.displayName || "Học viên"));
      return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="px-4 py-3 flex items-center space-x-2">
          <img src="${avatar}" class="w-6 h-6 rounded-full" alt="avatar" referrerpolicy="no-referrer">
          <span class="font-medium text-white">${displayName}</span>
        </td>
        <td class="px-4 py-3 font-mono text-xs text-slate-400">${email}</td>
        <td class="px-4 py-3">
          ${s.role === 'admin' ? '<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono font-bold">Admin</span>' : (s.status === 'approved' ? '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium">Đã duyệt</span>' : '<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-medium">Chờ duyệt</span>')}
        </td>
        <td class="px-4 py-3 text-right">
          ${s.role !== 'admin' ? (s.status === 'pending' ? `<button onclick="approveStudent('${studentId}')" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition">Duyệt vào học</button>` : `<button onclick="revokeStudent('${studentId}')" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 text-xs transition">Thu hồi</button>`) : '<span class="text-xs text-slate-500 font-mono">Quyền cao nhất</span>'}
        </td>
      </tr>
    `;
    }).join("");
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
// 15. BOOTSTRAP HỆ THỐNG
// ==============================================================
selectLesson("buoi-01");

setupAuthUI(async (user, profile) => {
  currentUser = user;
  currentProfile = profile;
  loadStepGatingState();

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

    const hideHeaderBtn = document.getElementById("btnHideTopHeader");
    const restoreHeaderBtn = document.getElementById("btnRestoreTopHeader");
    const mainHeader = document.getElementById("mainTopHeader");
    const cinemaBtn = document.getElementById("btnCinemaMode");

    if (isCurrentUserAdmin()) {
      if (userRoleBadge) {
        userRoleBadge.textContent = "Super Admin";
        userRoleBadge.className = "text-amber-400 font-bold font-mono";
      }
      if (tabBtnAdmin) tabBtnAdmin.classList.remove('hidden');
      if (pendingAlert) pendingAlert.classList.add('hidden');
      if (hideHeaderBtn) {
        hideHeaderBtn.classList.remove("hidden");
        hideHeaderBtn.classList.add("inline-flex");
      }
      if (cinemaBtn && !isCinemaMode) {
        cinemaBtn.classList.remove("hidden");
        cinemaBtn.classList.add("flex");
      }
      // Khôi phục trạng thái ẩn nếu admin đã cấu hình trước đó
      if (localStorage.getItem("adminTopHeaderHidden") === "true") {
        if (mainHeader) mainHeader.classList.add("hidden");
        document.body.classList.add("header-hidden");
        if (restoreHeaderBtn) {
          restoreHeaderBtn.classList.remove("hidden");
          restoreHeaderBtn.classList.add("flex");
        }
      } else {
        document.body.classList.remove("header-hidden");
      }
    } else {
      if (userRoleBadge) {
        userRoleBadge.textContent = profile.status === 'approved' ? "Học viên" : "Chờ duyệt";
        userRoleBadge.className = profile.status === 'approved' ? "text-emerald-400 font-medium" : "text-amber-400 font-medium";
      }
      if (tabBtnAdmin) tabBtnAdmin.classList.add('hidden');
      if (profile.status === 'pending' && pendingAlert) pendingAlert.classList.remove('hidden');
      if (hideHeaderBtn) hideHeaderBtn.classList.add("hidden");
      if (restoreHeaderBtn) restoreHeaderBtn.classList.add("hidden");
      if (mainHeader) mainHeader.classList.remove("hidden");
      document.body.classList.remove("header-hidden");
      if (cinemaBtn) {
        cinemaBtn.classList.add("hidden");
        cinemaBtn.classList.remove("flex");
      }
      if (mainHeader) mainHeader.classList.remove("hidden");
    }
    window.updateModuleTabsUI();
    if (!isSlideAudioPlaying) {
      const activeLesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
      if (activeLesson) renderMasterLecture(activeLesson);
    }
  } else {
    userProgress = await loadUserProgress(null);
    updateProgressUI(userProgress);
    renderCurriculumTree();
    window.updateModuleTabsUI();
  }

  if (window.lucide) window.lucide.createIcons();
});

// ESP (Tiếng Anh chuyên ngành) chưa phát hành.
// Không còn mô phỏng License Key cục bộ vì cơ chế cũ không thể xác thực an toàn.
window.notifyEspComingSoon = function() {
  alert("💼 Tiếng Anh Chuyên Ngành (ESP) đang được biên soạn.\nHiện tại lộ trình Giao Tiếp 0đ đã sẵn sàng để bạn học ngay.");
};
