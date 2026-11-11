# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update switchLessonModule and add Gating State & Central Audio Controller around lines 255-275
old_switch = '''window.switchLessonModule = function(moduleId) {
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
};'''

new_switch = '''// ==============================================================
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
    alert(`🔒 Bước này đang tạm khóa!\n\nThầy giáo khuyên bạn hãy hoàn thành xong "${prevMod ? prevMod.title : 'bước trước'}" để bộ não tiếp thu kiến thức một cách tự nhiên và bền vững nhất nhé!`);
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
};'''

if old_switch in code:
    code = code.replace(old_switch, new_switch)
    print("Replaced switchLessonModule with sequential gating & central audio!")
else:
    print("WARNING: old_switch string not found!")

# 2. Add updateModuleTabsUI() in loadLesson right before switchLessonModule('moduleLecture');
old_load_call = '''  // Mặc định mở Tab 0: Thuyết Giảng Khai Mở
  switchLessonModule('moduleLecture');'''

new_load_call = '''  // Cập nhật trạng thái khóa tuần tự các tabs
  window.updateModuleTabsUI();

  // Mặc định mở Tab 0: Thuyết Giảng Khai Mở
  switchLessonModule('moduleLecture', false);'''

if old_load_call in code:
    code = code.replace(old_load_call, new_load_call)
    print("Updated loadLesson to initialize module tabs gating!")
else:
    print("WARNING: old_load_call not found!")

with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved phase 1 to app.js!")
