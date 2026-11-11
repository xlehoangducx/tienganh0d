// QUẢN LÝ TIẾN ĐỘ ĐỘC LẬP TỪNG TÀI KHOẢN GMAIL & CHỐNG QUÊN (SPACED REPETITION)
import { db } from "./auth.js";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const LOCAL_STORAGE_KEY_PREFIX = "ai_english_progress_";

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

  // Lưu vào localStorage
  localStorage.setItem(localKey, JSON.stringify(progress));

  return progress;
}

// Lưu kết quả hoàn thành bài học và điểm trắc nghiệm của học viên
export async function saveLessonCompletion(user, lessonId, score, total) {
  const progress = await loadUserProgress(user);

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }

  progress.quizHistory[lessonId] = {
    score: score,
    total: total,
    passed: score >= Math.ceil(total * 0.7),
    date: new Date().toISOString()
  };

  // Tính lại phần trăm tiến độ Chặng 0 (10 buổi nền móng chuẩn A0 -> A1)
  const phase0Target = 10;
  const completedCount = progress.completedLessons.length;
  progress.progressPercent = Math.min(100, Math.round((completedCount / phase0Target) * 100));
  progress.hoursAccumulated = (completedCount * 0.5).toFixed(1);

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
