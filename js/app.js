// ============================================================================
// HỆ ĐIỀU HÀNH HỌC TẬP AI (COGNITIVE LEARNING OS ENGINE)
// Hỗ trợ Danh mục bài học vô hạn, 4 Module học thuật chuẩn, mượt mà trên Mobile & PC
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
// 1. CÔNG NGHỆ PHÁT ÂM GIỌNG MỸ BẢN XỨ (WEB SPEECH API 0Đ)
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
  const usVoice = voices.find(v => v.lang === 'en-US' || v.lang.includes('US'));
  if (usVoice) utterance.voice = usVoice;

  window.speechSynthesis.speak(utterance);
}
window.speakText = speakText;
window.playClickSound = playClickSound;

// ==============================================================
// 2. ĐIỀU HƯỚNG VIEW & MODULES
// ==============================================================
window.toggleSidebar = function() {
  const sidebar = document.getElementById("curriculumSidebar");
  if (sidebar) {
    sidebar.classList.toggle("-translate-x-full");
  }
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

window.switchLessonModule = function(moduleId) {
  document.querySelectorAll(".module-content").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".module-tab-btn").forEach(btn => {
    btn.classList.remove("bg-emerald-500/15", "text-emerald-400", "border-emerald-500/30");
    btn.classList.add("text-slate-400", "border-transparent");
  });

  const activeMod = document.getElementById(moduleId);
  const activeBtn = document.getElementById(`btn-${moduleId}`);

  if (activeMod) activeMod.classList.remove("hidden");
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-400", "border-transparent");
    activeBtn.classList.add("bg-emerald-500/15", "text-emerald-400", "border-emerald-500/30");
  }

  if (window.lucide) window.lucide.createIcons();
  if (window.reinit3DTilt) window.reinit3DTilt();
};

// ==============================================================
// 3. RENDER DANH MỤC GIÁO TRÌNH (ACCORDION LESSON TREE)
// ==============================================================
function renderCurriculumTree() {
  const container = document.getElementById("lessonTreeContainer");
  if (!container) return;

  const completed = (userProgress && userProgress.completedLessons) || [];

  container.innerHTML = CURRICULUM_DATA.milestones.map(m => {
    const milestoneLessons = CURRICULUM_DATA.lessons.filter(l => l.phaseId === m.id);

    return `
      <div class="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden mb-3">
        <!-- Milestone Header -->
        <div class="p-3 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden')">
          <div>
            <div class="text-[10px] font-mono uppercase text-cyan-400 font-bold">${m.badge}</div>
            <div class="text-xs font-bold text-white truncate max-w-[200px]">${m.phaseName.split(":")[1] || m.phaseName}</div>
          </div>
          <span class="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">${m.targetProgress}</span>
        </div>

        <!-- Lessons List -->
        <div class="p-2 space-y-1.5">
          ${milestoneLessons.length > 0 ? milestoneLessons.map(l => {
            const isCompleted = completed.includes(l.id);
            const isActive = l.id === currentActiveLessonId;

            return `
              <div onclick="selectLesson('${l.id}')" 
                   class="p-2.5 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${isActive ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-300 hover:bg-slate-800/70 border border-transparent'}">
                <div class="flex items-center space-x-2 truncate pr-2">
                  <span class="w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : (isActive ? 'bg-cyan-400' : 'bg-slate-600')}"></span>
                  <span class="truncate">Buổi ${l.sessionNumber < 10 ? '0' + l.sessionNumber : l.sessionNumber}: ${l.title.split('&')[0]}</span>
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
// 4. CHỌN BÀI HỌC CỤ THỂ ĐỂ HỌC
// ==============================================================
window.selectLesson = function(lessonId) {
  currentActiveLessonId = lessonId;
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

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
  if (durationEl) durationEl.textContent = lesson.duration || "20 phút";
  if (phaseBadge && milestone) phaseBadge.textContent = milestone.badge;

  // Render 4 Module
  renderMouthTechniques(lesson.mouthTechniques);
  renderChunks(lesson.chunks);
  renderQuizzes(lesson.quizzes);
  renderFlashcards(lesson.chunks);

  // Mặc định về module 1
  switchLessonModule('moduleMouth');

  // Đóng sidebar trên Mobile sau khi chọn bài
  const sidebar = document.getElementById("curriculumSidebar");
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.add("-translate-x-full");
  }

  // Cập nhật lại cây thư mục
  renderCurriculumTree();
};

function renderMouthTechniques(techniques) {
  const container = document.getElementById("mouthTechniquesContainer");
  if (!container) return;

  if (!techniques || techniques.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-3">Buổi này tập trung vào phản xạ câu trực tiếp.</div>`;
    return;
  }

  container.innerHTML = techniques.map(m => `
    <div class="p-4 rounded-xl cyber-card card-3d">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xl font-extrabold text-cyan-400 font-mono">${m.sound}</span>
        <span class="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">${m.example}</span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed mb-2">${m.guide}</p>
      <div class="text-[11px] text-emerald-400/90 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
        💡 <strong>Mẹo:</strong> ${m.tip}
      </div>
    </div>
  `).join("");
}

function renderChunks(chunks) {
  const container = document.getElementById("chunksContainer");
  if (!container) return;

  if (!chunks || chunks.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-3">Đang tải cụm từ...</div>`;
    return;
  }

  container.innerHTML = chunks.map(c => `
    <div class="p-4 rounded-xl cyber-card card-3d flex items-center justify-between gap-3 ${c.type === 'permutation' ? 'border-cyan-500/30 bg-cyan-950/15' : 'border-emerald-500/30'}">
      <div class="flex-grow">
        <div class="flex flex-wrap items-baseline gap-2 mb-1">
          <span class="text-base sm:text-lg font-bold text-white tracking-wide">${c.phrase}</span>
          <span class="text-xs font-mono text-cyan-400">${c.ipa}</span>
          ${c.type === 'permutation' ? '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Biến thể Attention</span>' : '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Cụm hạt nhân</span>'}
        </div>
        <p class="text-xs sm:text-sm text-emerald-300 font-medium mb-1">${c.meaning}</p>
        <span class="text-[11px] text-slate-400 block">${c.context}</span>
      </div>
      <button onclick="speakText('${c.phrase.replace(/'/g, "\\'")}')" class="w-11 h-11 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition active:scale-90 flex-shrink-0" title="Bấm để nghe phát âm Mỹ">
        <i data-lucide="volume-2" class="w-5 h-5"></i>
      </button>
    </div>
  `).join("");
}

function renderQuizzes(quizzes) {
  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;

  userQuizScore = 0;
  answeredCount = 0;
  const finishBanner = document.getElementById("quizFinishBanner");
  if (finishBanner) finishBanner.classList.add("hidden");

  const scoreBadge = document.getElementById("quizScoreBadge");
  if (scoreBadge) scoreBadge.textContent = `Điểm: 0/${quizzes.length}`;

  if (!quizzes || quizzes.length === 0) {
    quizContainer.innerHTML = `<div class="text-xs text-slate-400 p-3">Không có bài tập cho buổi học này.</div>`;
    return;
  }

  quizContainer.innerHTML = quizzes.map((q, idx) => `
    <div class="p-5 rounded-2xl cyber-card card-3d" id="quiz-block-${q.id}">
      <h4 class="font-bold text-sm sm:text-base text-white mb-3">
        <span class="text-emerald-400 mr-1.5">Câu ${idx + 1}:</span> ${q.question}
      </h4>

      <div class="space-y-2 mt-2">
        ${q.options.map((opt, optIdx) => `
          <button onclick="checkAnswer('${q.id}', ${optIdx}, ${q.correctIndex}, ${quizzes.length})" 
                  class="quiz-opt-btn w-full text-left p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm text-slate-300 transition"
                  id="opt-${q.id}-${optIdx}">
            <span>${opt}</span>
          </button>
        `).join("")}
      </div>

      <div id="explanation-${q.id}" class="hidden mt-3 p-3 rounded-xl text-xs bg-slate-900 border text-slate-300">
        <div class="font-bold mb-1 feedback-title"></div>
        <p class="explanation-text">${q.explanation}</p>
      </div>
    </div>
  `).join("");
}

window.checkAnswer = async function(quizId, selectedIdx, correctIdx, totalQuizzes) {
  const block = document.getElementById(`quiz-block-${quizId}`);
  if (!block) return;

  const buttons = block.querySelectorAll('.quiz-opt-btn');
  buttons.forEach(btn => btn.disabled = true);

  const expBox = document.getElementById(`explanation-${quizId}`);
  const feedbackTitle = expBox.querySelector('.feedback-title');

  if (selectedIdx === correctIdx) {
    userQuizScore++;
    playCorrectSound();
    if (window.confetti) window.confetti({ particleCount: 35, spread: 60, origin: { y: 0.75 } });

    document.getElementById(`opt-${quizId}-${selectedIdx}`).classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-emerald-300');
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
    playVictorySound();
    if (window.confetti) {
      setTimeout(() => window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }), 200);
    }

    userProgress = await saveLessonCompletion(currentUser, currentActiveLessonId, userQuizScore, totalQuizzes);
    updateProgressUI(userProgress);
    renderCurriculumTree();

    const finishBanner = document.getElementById("quizFinishBanner");
    if (finishBanner) finishBanner.classList.remove("hidden");
  }
};

function renderFlashcards(chunks) {
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
            <div class="text-lg font-bold text-white mb-1">${c.phrase}</div>
            <div class="text-xs font-mono text-cyan-400">${c.ipa}</div>
          </div>
          <div class="text-[11px] text-slate-500 flex items-center space-x-1">
            <i data-lucide="rotate-cw" class="w-3 h-3"></i>
            <span>Chạm vào thẻ để xem nghĩa</span>
          </div>
        </div>

        <div class="flashcard-back absolute inset-0 p-5 flex flex-col justify-between rounded-2xl bg-slate-900 border border-emerald-500/30">
          <div class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Mặt nghĩa & Ngữ cảnh</div>
          <div>
            <div class="text-base font-bold text-emerald-300 mb-1">${c.meaning}</div>
            <div class="text-xs text-slate-300">${c.context}</div>
          </div>
          <div class="text-[11px] text-slate-400">Chạm lại để lật về tiếng Anh</div>
        </div>
      </div>
    </div>
  `).join("");
}

// ==============================================================
// 5. CẬP NHẬT GIAO DIỆN TIẾN ĐỘ CÁ NHÂN
// ==============================================================
function updateProgressUI(progress) {
  if (!progress) return;

  const completedCount = (progress.completedLessons || []).length;
  const phase0Target = 10;
  const percent = Math.min(100, Math.round((completedCount / phase0Target) * 100));
  const hours = (completedCount * 0.5).toFixed(1);

  const progressText = document.getElementById("personalProgressText");
  const progressBar = document.getElementById("personalProgressBar");
  const completedCountEl = document.getElementById("personalCompletedCount");
  const hoursCountEl = document.getElementById("personalHoursCount");

  if (progressText) progressText.textContent = `${percent}% Chặng 0`;
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (completedCountEl) completedCountEl.textContent = `Đã học: ${completedCount}/${phase0Target} buổi chặng`;
  if (hoursCountEl) hoursCountEl.textContent = `Tích lũy: ${hours}h`;

  const alertBox = document.getElementById("spacedReviewAlert");
  const countDays = document.getElementById("inactiveDaysCount");
  if (alertBox && progress.needsReview) {
    if (countDays) countDays.textContent = progress.daysInactive;
    alertBox.classList.remove("hidden");
  } else if (alertBox) {
    alertBox.classList.add("hidden");
  }
}

// ==============================================================
// 6. QUẢN TRỊ ADMIN (DUYỆT HỌC VIÊN)
// ==============================================================
async function loadAdminStudents() {
  const tbody = document.getElementById("studentsTableBody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-slate-400">Đang đồng bộ từ Firestore...</td></tr>`;

  try {
    const students = await getAllStudents();
    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-slate-500">Chưa có học viên nào đăng ký.</td></tr>`;
      return;
    }

    tbody.innerHTML = students.map(s => {
      const isApproved = s.status === 'approved';
      const isSuper = s.role === 'admin';

      return `
        <tr class="hover:bg-slate-850/50 transition">
          <td class="px-4 py-3 flex items-center space-x-2">
            <img src="${s.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.displayName || 'User')}" class="w-7 h-7 rounded-full">
            <span class="font-medium text-white">${s.displayName || 'Học viên'}</span>
            ${isSuper ? '<span class="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Admin</span>' : ''}
          </td>
          <td class="px-4 py-3 text-xs font-mono text-slate-400">${s.email}</td>
          <td class="px-4 py-3 text-xs">
            <span class="px-2 py-0.5 rounded-full font-bold ${isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}">
              ${isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
            </span>
          </td>
          <td class="px-4 py-3 text-right">
            ${isSuper ? '<span class="text-xs text-slate-500">Super Admin</span>' : `
              <button onclick="toggleStudent('${s.id}', '${isApproved ? 'pending' : 'approved'}')" 
                      class="text-xs px-2.5 py-1 rounded-lg font-bold transition ${isApproved ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white'}">
                ${isApproved ? 'Khóa' : 'Duyệt Ngay'}
              </button>
            `}
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    console.error("Lỗi tải học viên:", err);
    tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-rose-400">Lỗi tải dữ liệu: ${err.message}</td></tr>`;
  }
}

window.toggleStudent = async function(uid, newStatus) {
  try {
    await updateStudentStatus(uid, newStatus);
    await loadAdminStudents();
  } catch (err) {
    alert("Cập nhật thất bại: " + err.message);
  }
};

const btnRefresh = document.getElementById("btnRefreshStudents");
if (btnRefresh) {
  btnRefresh.addEventListener("click", () => loadAdminStudents());
}

// ==============================================================
// 7. BUY ME A COFFEE MODAL
// ==============================================================
window.openDonateModal = function() {
  const modal = document.getElementById("donateModal");
  if (modal) modal.classList.remove("hidden");
};

window.closeDonateModal = function() {
  const modal = document.getElementById("donateModal");
  if (modal) modal.classList.add("hidden");
};

window.copySTKModal = function() {
  navigator.clipboard.writeText(DONATE_CONFIG.banking.accountNumber);
  alert("Đã sao chép số tài khoản MB Bank!");
};

// ==============================================================
// 8. BOOTSTRAP HỆ THỐNG
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
