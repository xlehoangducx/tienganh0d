# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update renderMouthTechniques
old_mouth = '''function renderMouthTechniques(techniques) {
  const container = document.getElementById("mouthTechniquesContainer");
  if (!container) return;'''

new_mouth = '''function renderMouthTechniques(techniques) {
  const guideBanner = document.getElementById("mouthGuideBanner");
  if (guideBanner) {
    guideBanner.innerHTML = window.renderTeacherGuideBanner(1, "Hướng Dẫn Bước 1: Khẩu Hình & Phát Âm", "Làm chủ 3 âm then chốt /θ/, /s/ và /t/. Bấm loa nghe mẫu và bấm micro để AI chấm điểm từng âm nhé!");
  }
  const nextStepArea = document.getElementById("mouthNextStepArea");
  if (nextStepArea) {
    nextStepArea.innerHTML = window.renderNextStepCTA(2, "✓ Hoàn Thành Bước 1 • Chuyển Sang Bước 2: Cụm Từ & Phản Xạ", "Sau khi đã luyện qua khẩu hình 3 âm /θ/, /s/, /t/, hãy chuyển sang cụm từ giao tiếp!");
  }

  const container = document.getElementById("mouthTechniquesContainer");
  if (!container) return;'''

if old_mouth in code:
    code = code.replace(old_mouth, new_mouth)
    print("Updated renderMouthTechniques!")
else:
    print("WARNING: old_mouth not found!")

# 2. Update renderChunks
old_chunks = '''  container.innerHTML = guideHeader + chunks.map((c, idx) => {'''

new_chunks = '''  const chunksGuide = document.getElementById("chunksGuideBanner");
  if (chunksGuide) {
    chunksGuide.innerHTML = window.renderTeacherGuideBanner(2, "Hướng Dẫn Bước 2: Cụm Từ & Phản Xạ Đời Thường", "Làm chủ 3 cụm từ phản xạ cốt lõi. Hãy lắng nghe và luyện nói để hoàn thành mục tiêu 7 lần lặp đa giác quan nhé!");
  }
  const chunksNextArea = document.getElementById("chunksNextStepArea");
  if (chunksNextArea) {
    chunksNextArea.innerHTML = window.renderNextStepCTA(3, "✓ Hoàn Thành Bước 2 • Chuyển Sang Bước 3: Luyện Tập Trắc Nghiệm", "Đã tích lũy các lần lặp đa giác quan cho 3 cụm từ hạt nhân.");
  }

  container.innerHTML = guideHeader + chunks.map((c, idx) => {'''

if old_chunks in code:
    code = code.replace(old_chunks, new_chunks)
    print("Updated renderChunks!")
else:
    print("WARNING: old_chunks not found!")

# 3. Update renderQuizzes and selectQuizAnswer
old_quiz_start = '''function renderQuizzes(quizzes) {
  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;'''

new_quiz_start = '''function renderQuizzes(quizzes) {
  const quizGuide = document.getElementById("quizGuideBanner");
  if (quizGuide) {
    quizGuide.innerHTML = window.renderTeacherGuideBanner(3, "Hướng Dẫn Bước 3: Luyện Tập Trắc Nghiệm Phản Xạ", "Bước 3 là bài trắc nghiệm phản xạ tình huống. Bạn cần đạt từ 70% trở lên để mở khóa tiếp nhé!");
  }

  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;'''

if old_quiz_start in code:
    code = code.replace(old_quiz_start, new_quiz_start)
    print("Updated renderQuizzes start!")
else:
    print("WARNING: old_quiz_start not found!")

old_quiz_finish = '''    const finishBanner = document.getElementById("quizFinishBanner");
    if (finishBanner) {
      finishBanner.classList.remove("hidden");
      if (!isPassed) {
        finishBanner.innerHTML = `
          <div class="flex items-center space-x-3 text-xs text-amber-300">
            <span class="text-2xl">💡</span>
            <div>
              <div class="font-bold text-amber-400">Bạn đạt ${userQuizScore}/${totalQuizzes} câu (cần ≥ 70% để mở khóa Buổi tiếp theo).</div>
              <p class="text-slate-400 text-[11px] mt-0.5">Hãy tải lại trang và làm lại để kích hoạt nơ-ron nhé!</p>
            </div>
          </div>
        `;
      }
    }'''

new_quiz_finish = '''    const finishBanner = document.getElementById("quizFinishBanner");
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
    }'''

if old_quiz_finish in code:
    code = code.replace(old_quiz_finish, new_quiz_finish)
    print("Updated selectQuizAnswer finish handling!")
else:
    print("WARNING: old_quiz_finish not found!")

# 4. Update renderFlashcards
old_flash = '''function renderFlashcards(chunks) {
  const container = document.getElementById("flashcardsContainer");
  if (!container) return;'''

new_flash = '''function renderFlashcards(chunks) {
  const flashGuide = document.getElementById("flashcardGuideBanner");
  if (flashGuide) {
    flashGuide.innerHTML = window.renderTeacherGuideBanner(4, "Hướng Dẫn Bước 4: Sổ Thẻ Ghi Nhớ 3D", "Bước 4 là Sổ thẻ 3D. Hãy chạm vào các thẻ để lật mặt xem giải nghĩa và nghe phát âm chuẩn nhé!");
  }
  const flashNextArea = document.getElementById("flashcardNextStepArea");
  if (flashNextArea) {
    flashNextArea.innerHTML = window.renderNextStepCTA(5, "✓ Hoàn Thành Bước 4 • Chuyển Sang Bước 5: Đối Thoại AI 2 Chiều", "Chạm lật tất cả các thẻ để neo ngữ nghĩa vào trí nhớ không gian.");
  }

  const container = document.getElementById("flashcardsContainer");
  if (!container) return;'''

if old_flash in code:
    code = code.replace(old_flash, new_flash)
    print("Updated renderFlashcards!")
else:
    print("WARNING: old_flash not found!")

# 5. Update setupDialogueModule and Dialogue Audio
old_dialogue_setup = '''function setupDialogueModule(lesson) {
  currentDialogueScenario = lesson.dialogueScenario;
  if (!currentDialogueScenario) {
    const speakContainer = document.getElementById("moduleSpeaking");
    if (speakContainer) speakContainer.innerHTML = `<div class="text-xs text-slate-400 p-4">Buổi này tập trung vào phản xạ câu trực tiếp.</div>`;
    return;
  }

  const titleEl = document.getElementById("dialogueScenarioTitle");
  const narrativeEl = document.getElementById("dialogueStoryNarrative");

  if (titleEl) titleEl.textContent = currentDialogueScenario.title;
  if (narrativeEl) narrativeEl.textContent = currentDialogueScenario.storyNarrativeVi;

  userTurnsList = (currentDialogueScenario.turns || []).filter(t => t.role === 'user');
  currentDialogueTurnIndex = 0;

  renderDialogueTurns();
  updateCurrentDialogueTurnUI();
}'''

new_dialogue_setup = '''function setupDialogueModule(lesson) {
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
}'''

if old_dialogue_setup in code:
    code = code.replace(old_dialogue_setup, new_dialogue_setup)
    print("Updated setupDialogueModule!")
else:
    print("WARNING: old_dialogue_setup not found!")

# 6. Update narrateCurrentScenario and triggerAiPartnerPrompt
old_dialogue_audio = '''window.narrateCurrentScenario = function() {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const audioPath = `assets/audio/story-${currentActiveLessonId}.mp3`;

  // Nếu đang phát thì bấm lại sẽ tạm dừng
  if (currentStoryAudio) {
    currentStoryAudio.pause();
    currentStoryAudio = null;
    const btn = document.querySelector('[onclick="narrateCurrentScenario()"]');
    if (btn) {
      btn.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5"></i><span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
    return;
  }

  window.speechSynthesis.cancel();
  const audio = new Audio(audioPath);
  currentStoryAudio = audio;

  const btn = document.querySelector('[onclick="narrateCurrentScenario()"]');
  if (btn) {
    btn.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5 text-amber-300 animate-pulse"></i><span class="text-amber-300">Đang phát lời kể... (Bấm dừng)</span>`;
    if (window.lucide) window.lucide.createIcons();
  }

  audio.onended = function() {
    currentStoryAudio = null;
    const noticeEl = document.getElementById("voiceNoticeTip");
    if (noticeEl) noticeEl.classList.add("hidden");
    if (btn) {
      btn.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5"></i><span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  };

  audio.onerror = function() {
    currentStoryAudio = null;
    if (lesson?.dialogueScenario?.storyNarrativeVi) {
      speakVietnamese(lesson.dialogueScenario.storyNarrativeVi);
    }
    if (btn) {
      btn.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5"></i><span>🎧 Nghe Gia Sư Kể Bối Cảnh</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  };

  audio.play().catch(() => {
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
    speakText(aiTurn.text);
  }
};

window.playFullConversationLoop = function() {
  if (!currentDialogueScenario || !currentDialogueScenario.turns) return;
  const turns = currentDialogueScenario.turns;
  let idx = 0;

  function playTurn() {
    if (idx >= turns.length) {
      alert("🎉 Bạn vừa nghe trọn vẹn đoạn phim hội thoại tự nhiên!");
      return;
    }

    const turn = turns[idx];
    const phrase = turn.role === 'ai' ? turn.text : turn.targetText;

    // Highlight bubble
    document.querySelectorAll('[id^="dialogueBubble-"]').forEach(b => b.classList.remove('ring-2', 'ring-cyan-400'));
    const bubble = document.getElementById(`dialogueBubble-${idx}`);
    if (bubble) bubble.classList.add('ring-2', 'ring-cyan-400');

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

  playTurn();
};'''

new_dialogue_audio = '''window.narrateCurrentScenario = function() {
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
};'''

if old_dialogue_audio in code:
    code = code.replace(old_dialogue_audio, new_dialogue_audio)
    print("Updated dialogue narration, triggerAiPartnerPrompt and playFullConversationLoop!")
else:
    print("WARNING: old_dialogue_audio not found!")

# 7. Update renderTypingChallenges
old_typing = '''function renderTypingChallenges(challenges) {
  const container = document.getElementById("typingChallengeContainer");
  if (!container) return;'''

new_typing = '''function renderTypingChallenges(challenges) {
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
  if (!container) return;'''

if old_typing in code:
    code = code.replace(old_typing, new_typing)
    print("Updated renderTypingChallenges!")
else:
    print("WARNING: old_typing not found!")

with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved phase 3 to app.js!")
