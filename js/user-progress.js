// QUẢN LÝ TIẾN ĐỘ ĐỘC LẬP TỪNG TÀI KHOẢN GMAIL & CHỐNG QUÊN (SPACED REPETITION)
import { db } from "./auth.js";
import { CURRICULUM_DATA } from "./curriculum-data.js";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const LOCAL_STORAGE_KEY_PREFIX = "ai_english_progress_";

// Số buổi mục tiêu của từng chặng CEFR (Chặng 0 → 4).
const PHASE_TARGETS = [10, 35, 60, 100, 120];

// Tính % tiến độ theo đúng chặng đang học, không cố định 10 buổi.
function recalculateProgress(progress) {
  const completed = Array.isArray(progress.completedLessons) ? progress.completedLessons : [];
  const lessons = CURRICULUM_DATA.lessons || [];

  let currentPhase = 0;
  completed.forEach(id => {
    const lesson = lessons.find(l => l.id === id);
    if (lesson && Number.isFinite(lesson.phaseId)) {
      currentPhase = Math.max(currentPhase, lesson.phaseId);
    }
  });

  const completedInPhase = completed.filter(id => {
    const lesson = lessons.find(l => l.id === id);
    return lesson && lesson.phaseId === currentPhase;
  }).length;
  const target = Math.max(PHASE_TARGETS[currentPhase] || 10, 1);

  progress.progressPhaseId = currentPhase;
  progress.progressPercent = Math.min(100, Math.round((completedInPhase / target) * 100));
  progress.hoursAccumulated = (completed.length * 0.5).toFixed(1);
  return progress;
}

// Cấu trúc tiến độ mặc định cho một học viên mới
export function getDefaultProgress(user) {
  const todayStr = new Date().toISOString().split("T")[0];
  return {
    uid: user ? user.uid : "guest",
    email: user ? user.email : "guest@example.com",
    displayName: user ? user.displayName : "Khách",
    completedLessons: [],        // Danh sách ID các buổi đã hoàn thành
    currentLessonId: "buoi-01",   // Đang ở buổi nào
    progressPercent: 0,           // % tiến độ cá nhân của tài khoản này
    quizHistory: {},              // Lịch sử làm bài: { "buoi-01": { score: 3, total: 3, date: "..." } }
    lastActiveDate: todayStr,     // Ngày gần nhất đăng nhập học
    streakDays: 1,                // Chuỗi ngày học liên tục
    needsReview: false,           // Có cần kích hoạt bài kiểm tra chống quên không
    daysInactive: 0               // Số ngày vắng mặt
  };
}

// Tải tiến độ của người dùng (kết hợp Firestore + localStorage)
export async function loadUserProgress(user) {
  if (!user) {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}guest`);
    return cached ? JSON.parse(cached) : getDefaultProgress(null);
  }

  const localKey = `${LOCAL_STORAGE_KEY_PREFIX}${user.uid}`;
  let progress = null;

  // 1. Đọc từ Firestore
  try {
    const docRef = doc(db, "english_progress", user.uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      progress = snap.data();
    } else {
      // Học viên mới toanh -> Tạo hồ sơ tiến độ ban đầu
      progress = getDefaultProgress(user);
      await setDoc(docRef, { ...progress, createdAt: serverTimestamp() });
    }
  } catch (err) {
    console.warn("Lỗi đọc Firestore, chuyển sang đọc Cache:", err);
    const cached = localStorage.getItem(localKey);
    progress = cached ? JSON.parse(cached) : getDefaultProgress(user);
  }

  // 2. Tính toán ngày vắng mặt để kích hoạt Spaced Repetition (chống quên)
  const today = new Date();
  const lastDate = progress.lastActiveDate ? new Date(progress.lastActiveDate) : today;
  const diffTime = Math.abs(today - lastDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  progress.daysInactive = diffDays;
  // Nếu nghỉ từ 2 ngày trở lên -> Bật cờ cảnh báo nhắc ôn bài cũ
  progress.needsReview = diffDays >= 2 && progress.completedLessons.length > 0;

  // Cập nhật ngày hoạt động hôm nay
  progress.lastActiveDate = today.toISOString().split("T")[0];
  recalculateProgress(progress);

  // Lưu vào localStorage
  localStorage.setItem(localKey, JSON.stringify(progress));

  return progress;
}

// Lưu kết quả hoàn thành bài học và điểm trắc nghiệm của học viên
export async function saveLessonCompletion(user, lessonId, score, total) {
  const progress = await loadUserProgress(user);

  const isPassed = score >= Math.ceil(total * 0.7);

  progress.quizHistory[lessonId] = {
    score: score,
    total: total,
    passed: isPassed,
    date: new Date().toISOString()
  };

  // CHỈ THÊM VÀO DANH SÁCH HOÀN THÀNH KHI ĐẠT TỐI THIỂU 70% ĐIỂM
  if (isPassed) {
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }
  }

  // Tính lại % tiến độ theo chặng hiện tại (không cố định 10 buổi)
  recalculateProgress(progress);

  // Tắt cờ cần review nếu vừa làm xong
  progress.needsReview = false;

  // Lưu Firestore
  if (user && db) {
    try {
      const docRef = doc(db, "english_progress", user.uid);
      await setDoc(docRef, {
        ...progress,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn("Lưu Firestore thất bại, lưu tạm bộ nhớ máy:", err);
    }
  }

  // Lưu LocalStorage
  const localKey = `${LOCAL_STORAGE_KEY_PREFIX}${user ? user.uid : "guest"}`;
  localStorage.setItem(localKey, JSON.stringify(progress));

  return progress;
}
