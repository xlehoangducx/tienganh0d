// Logic điều khiển toàn bộ tương tác trên Dashboard & Điện thoại
import { setupAuthUI, getAllStudents, updateStudentStatus } from "./auth.js";
import { CURRICULUM_DATA } from "./curriculum-data.js";
import { DONATE_CONFIG, getVietQRUrl } from "./donate-config.js";
import { loadUserProgress, saveLessonCompletion } from "./user-progress.js";
import { playCorrectSound, playIncorrectSound, playVictorySound, playClickSound } from "./sound-effects.js";

let currentUser = null;
let currentProfile = null;
let userProgress = null;
let userQuizScore = 0;

// ==============================================================
// 1. CÔNG NGHỆ PHÁT ÂM GIỌNG MỸ MIỄN PHÍ 0Đ (WEB SPEECH API)
// ==============================================================
export function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert("Trình duyệt của bạn không hỗ trợ phát âm tự động.");
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
// 2. CHUYỂN TAB ĐIỀU HƯỚNG
// ==============================================================
window.switchTab = function(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('block');
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('border-emerald-500', 'text-emerald-400', 'border-amber-500', 'text-amber-400');
    btn.classList.add('border-transparent', 'text-slate-400');
  });

  const activeContent = document.getElementById(tabId);
  const activeBtn = document.getElementById(`tabBtn-${tabId}`);

  if (activeContent) {
    activeContent.classList.remove('hidden');
    activeContent.classList.add('block');
  }

  if (activeBtn) {
    activeBtn.classList.remove('border-transparent', 'text-slate-400');
    if (tabId === 'adminTab') {
      activeBtn.classList.add('border-amber-500', 'text-amber-400');
    } else {
      activeBtn.classList.add('border-emerald-500', 'text-emerald-400');
    }
  }

  if (tabId === 'adminTab') {
    loadAdminStudents();
  }
};

// ==============================================================
// 3. RENDER NỘI DUNG BÀI HỌC (BUỔI 1)
// ==============================================================
function renderLessonContent() {
  const lesson = CURRICULUM_DATA.lessons[0];
  if (!lesson) return;

  // 1. Render khẩu hình cơ miệng
  const mouthContainer = document.getElementById("mouthTechniquesContainer");
  if (mouthContainer) {
    mouthContainer.innerHTML = lesson.mouthTechniques.map(m => `
      <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xl font-extrabold text-cyan-400">${m.sound}</span>
          <span class="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">${m.example}</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed mb-2">${m.guide}</p>
        <div class="text-[11px] text-emerald-400/90 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
          💡 <strong>Mẹo:</strong> ${m.tip}
        </div>
      </div>
    `).join("");
  }

  // 2. Render cụm từ sinh tồn (Chunks) có nút loa
  const chunksContainer = document.getElementById("chunksContainer");
  if (chunksContainer) {
    chunksContainer.innerHTML = lesson.chunks.map(c => `
      <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between gap-3">
        <div class="flex-grow">
          <div class="flex flex-wrap items-baseline gap-2 mb-1">
            <span class="text-base sm:text-lg font-bold text-white tracking-wide">${c.phrase}</span>
            <span class="text-xs font-mono text-cyan-400">${c.ipa}</span>
          </div>
          <p class="text-xs sm:text-sm text-emerald-300 font-medium mb-1">${c.meaning}</p>
          <span class="text-[11px] text-slate-400 block">Tình huống: ${c.context}</span>
        </div>
        <button onclick="speakText('${c.phrase.replace(/'/g, "\\'")}')" class="w-11 h-11 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition active:scale-90 flex-shrink-0" title="Bấm để nghe phát âm Mỹ">
          <i data-lucide="volume-2" class="w-5 h-5"></i>
        </button>
      </div>
    `).join("");
  }

  // 3. Render Quizzes tương tác trên điện thoại
  renderQuizzes(lesson.quizzes);

  // 4. Render Flashcards 3D
  renderFlashcards(lesson.chunks);

  if (window.lucide) window.lucide.createIcons();
}

// ==============================================================
// 4. RENDER & CHẤM ĐIỂM QUIZ TỰ ĐỘNG & LƯU TIẾN ĐỘ CÁ NHÂN
// ==============================================================
function renderQuizzes(quizzes) {
  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;

  quizContainer.innerHTML = quizzes.map((q, idx) => `
    <div class="p-5 rounded-2xl bg-slate-950/80 border border-slate-800" id="quiz-block-${q.id}">
      <div class="flex items-start justify-between gap-2 mb-3">
        <h4 class="font-bold text-sm sm:text-base text-white">
          <span class="text-emerald-400 mr-1.5">Câu ${idx + 1}:</span> ${q.question}
        </h4>
      </div>

      <div class="space-y-2 mt-3">
        ${q.options.map((opt, optIdx) => `
          <button onclick="checkAnswer('${q.id}', ${optIdx}, ${q.correctIndex})" 
                  class="quiz-opt-btn w-full text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm text-slate-300 transition flex items-center justify-between"
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

let answeredCount = 0;

window.checkAnswer = async function(quizId, selectedIdx, correctIdx) {
  const block = document.getElementById(`quiz-block-${quizId}`);
  if (!block) return;

  const buttons = block.querySelectorAll('.quiz-opt-btn');
  buttons.forEach(btn => btn.disabled = true);

  const expBox = document.getElementById(`explanation-${quizId}`);
  const feedbackTitle = expBox.querySelector('.feedback-title');

  if (selectedIdx === correctIdx) {
    userQuizScore++;
    playCorrectSound();
    if (window.confetti) {
      window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.75 } });
    }
    document.getElementById(`opt-${quizId}-${selectedIdx}`).classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-emerald-300');
    expBox.classList.remove('hidden');
    expBox.classList.add('border-emerald-500/30', 'bg-emerald-950/20');
    feedbackTitle.innerHTML = `<span class="text-emerald-400">🎉 Chính xác tuyệt đối!</span>`;
  } else {
    playIncorrectSound();
    document.getElementById(`opt-${quizId}-${selectedIdx}`).classList.add('bg-rose-500/20', 'border-rose-500', 'text-rose-300');
    document.getElementById(`opt-${quizId}-${correctIdx}`).classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-emerald-300');
    expBox.classList.remove('hidden');
    expBox.classList.add('border-rose-500/30', 'bg-rose-950/20');
    feedbackTitle.innerHTML = `<span class="text-rose-400">Chưa chính xác! Xem giải thích bên dưới:</span>`;
  }

  answeredCount++;
  const scoreBadge = document.getElementById("quizScoreBadge");
  if (scoreBadge) scoreBadge.textContent = `Điểm: ${userQuizScore}/3`;

  // Khi hoàn thành hết 3 câu -> Tự động lưu tiến độ vào hồ sơ người dùng
  if (answeredCount >= 3) {
    playVictorySound();
    if (window.confetti) {
      setTimeout(() => {
        window.confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }, 200);
    }
    userProgress = await saveLessonCompletion(currentUser, "buoi-01", userQuizScore, 3);
    updateProgressUI(userProgress);
    const finishBanner = document.getElementById("quizFinishBanner");
    if (finishBanner) finishBanner.classList.remove("hidden");
  }
};

// ==============================================================
// 5. RENDER FLASHCARD THẺ LẬT 3D
// ==============================================================
function renderFlashcards(chunks) {
  const container = document.getElementById("flashcardsContainer");
  if (!container) return;

  container.innerHTML = chunks.map((c, idx) => `
    <div class="flashcard h-48 cursor-pointer perspective-1000" onclick="this.classList.toggle('flipped'); window.playClickSound && window.playClickSound();">
      <div class="flashcard-inner relative w-full h-full rounded-2xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between">
        
        <!-- Mặt trước (Tiếng Anh + Loa) -->
        <div class="flashcard-front absolute inset-0 p-5 flex flex-col justify-between rounded-2xl bg-slate-900 border border-slate-800">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Thẻ #0${idx+1} • Chạm để lật</span>
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

        <!-- Mặt sau (Tiếng Việt & Ngữ cảnh) -->
        <div class="flashcard-back absolute inset-0 p-5 flex flex-col justify-between rounded-2xl bg-slate-850 border border-emerald-500/30">
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
// 6. CẬP NHẬT GIAO DIỆN TIẾN ĐỘ CÁ NHÂN
// ==============================================================
function updateProgressUI(progress) {
  if (!progress) return;

  const percent = progress.progressPercent || 0;
  const completedCount = (progress.completedLessons || []).length;

  const progressText = document.getElementById("personalProgressText");
  const completedText = document.getElementById("personalCompletedCount");
  const circle = document.getElementById("progressCircle");

  if (progressText) progressText.textContent = `${percent}% Hoàn thành`;
  if (completedText) completedText.textContent = `Đã học: ${completedCount}/100 buổi`;
  if (circle) circle.textContent = `${percent}%`;

  // Kiểm tra cảnh báo chống quên Spaced Repetition
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
// 7. QUẢN TRỊ ADMIN DUYỆT HỌC VIÊN
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
// 8. LOGIC MODAL TẶNG CÀ PHÊ (BUY ME A COFFEE)
// ==============================================================
window.openDonateModal = function() {
  const modal = document.getElementById("donateModal");
  if (modal) {
    modal.classList.remove("hidden");
    const qr = document.getElementById("qrImageModal");
    const accName = document.getElementById("donateAccNameModal");
    const bankName = document.getElementById("donateBankModal");
    const accNum = document.getElementById("donateNumberModal");

    if (qr) qr.src = DONATE_CONFIG.banking.qrImagePath;
    if (accName) accName.textContent = DONATE_CONFIG.banking.accountName;
    if (bankName) bankName.textContent = DONATE_CONFIG.banking.bankName;
    if (accNum) accNum.textContent = DONATE_CONFIG.banking.accountNumber;
  }
};

window.closeDonateModal = function() {
  const modal = document.getElementById("donateModal");
  if (modal) modal.classList.add("hidden");
};

window.copySTKModal = function() {
  navigator.clipboard.writeText(DONATE_CONFIG.banking.accountNumber);
  alert("Đã sao chép số tài khoản: " + DONATE_CONFIG.banking.accountNumber);
};

// ==============================================================
// 9. KHỞI CHẠY HỆ THỐNG
// ==============================================================
renderLessonContent();

setupAuthUI(async (user, profile) => {
  currentUser = user;
  currentProfile = profile;

  const userName = document.getElementById("userName");
  const userRoleBadge = document.getElementById("userRoleBadge");
  const userAvatar = document.getElementById("userAvatar");
  const tabBtnAdmin = document.getElementById("tabBtn-adminTab");
  const pendingAlert = document.getElementById("pendingAlert");

  if (user && profile) {
    if (userName) userName.textContent = user.displayName || user.email;
    if (userAvatar) userAvatar.src = user.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || "User");
    
    // Tải tiến độ độc lập của tài khoản này
    userProgress = await loadUserProgress(user);
    updateProgressUI(userProgress);

    if (profile.role === 'admin') {
      if (userRoleBadge) {
        userRoleBadge.textContent = "Super Admin";
        userRoleBadge.className = "text-amber-400 font-bold";
      }
      if (tabBtnAdmin) {
        tabBtnAdmin.classList.remove('hidden');
        tabBtnAdmin.classList.add('flex');
      }
      if (pendingAlert) pendingAlert.classList.add('hidden');
    } else {
      if (userRoleBadge) {
        userRoleBadge.textContent = profile.status === 'approved' ? "Học viên chính thức" : "Chờ duyệt";
        userRoleBadge.className = profile.status === 'approved' ? "text-emerald-400 font-medium" : "text-amber-400 font-medium";
      }
      if (tabBtnAdmin) tabBtnAdmin.classList.add('hidden');

      if (profile.status === 'pending' && pendingAlert) {
        pendingAlert.classList.remove('hidden');
      } else if (pendingAlert) {
        pendingAlert.classList.add('hidden');
      }
    }
  } else {
    // Chế độ khách (chưa đăng nhập)
    if (userName) userName.textContent = "Khách xem trước";
    if (userRoleBadge) userRoleBadge.textContent = "Chưa đăng nhập";
    userProgress = await loadUserProgress(null);
    updateProgressUI(userProgress);
  }

  if (window.lucide) window.lucide.createIcons();
});
