// Quản lý Đăng nhập Google & Phân quyền Học viên / Admin
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection,
  getDocs,
  updateDoc,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { firebaseConfig, ADMIN_EMAILS } from "./firebase-config.js";

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { app, auth, db };

// Đồng bộ hồ sơ người dùng lên Firestore collection "english_users"
export async function syncUserProfile(user) {
  if (!user) return null;
  const userRef = doc(db, "english_users", user.uid);
  const userSnap = await getDoc(userRef);

  const emailLower = (user.email || "").toLowerCase();
  const isAdmin = ADMIN_EMAILS.map(e => e.toLowerCase()).includes(emailLower);

  if (!userSnap.exists()) {
    const newProfile = {
      uid: user.uid,
      email: emailLower,
      displayName: user.displayName || "Học viên",
      photoURL: user.photoURL || "",
      role: isAdmin ? "admin" : "student",
      status: isAdmin ? "approved" : "pending", // Admin được duyệt ngay, Học viên chờ duyệt
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      progressPercent: 0,
      completedLessons: []
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    const currentData = userSnap.data();
    if (isAdmin && (currentData.role !== "admin" || currentData.status !== "approved")) {
      await setDoc(userRef, { role: "admin", status: "approved" }, { merge: true });
      currentData.role = "admin";
      currentData.status = "approved";
    }
    setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true })
      .catch(err => console.warn("Sync login warning:", err));
    return currentData;
  }
}

// Lấy danh sách tất cả học viên (dành riêng cho Admin Đức duyệt)
export async function getAllStudents() {
  const usersCol = collection(db, "english_users");
  const snap = await getDocs(usersCol);
  const students = [];
  snap.forEach(docSnap => {
    students.push({ id: docSnap.id, ...docSnap.data() });
  });
  return students;
}

// Cập nhật trạng thái duyệt học viên (Admin bấm duyệt/khóa)
export async function updateStudentStatus(uid, newStatus) {
  const userRef = doc(db, "english_users", uid);
  await updateDoc(userRef, {
    status: newStatus,
    updatedAt: serverTimestamp()
  });
}

// Hàm đăng nhập Google dùng chung cho cả trang chủ và modal
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const profile = await syncUserProfile(result.user);
  return { user: result.user, profile };
}
window.loginWithGoogle = loginWithGoogle;

// Hàm khởi tạo đăng nhập Google
export function setupAuthUI(onUserLoaded) {
  const btnGoogleLogin = document.getElementById("btnGoogleLogin");
  const btnLogout = document.getElementById("btnLogout");

  if (btnGoogleLogin) {
    btnGoogleLogin.addEventListener("click", async () => {
      try {
        btnGoogleLogin.disabled = true;
        btnGoogleLogin.innerHTML = `<span class="animate-spin inline-block mr-2">⏳</span> Đang đăng nhập...`;
        await loginWithGoogle();
        window.location.href = "dashboard.html";
      } catch (err) {
        console.error("Đăng nhập lỗi:", err);
        alert("Lỗi đăng nhập: " + err.message);
      } finally {
        if (btnGoogleLogin) {
          btnGoogleLogin.disabled = false;
          btnGoogleLogin.innerHTML = `<span>Đăng Nhập Bằng Google</span>`;
        }
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "index.html";
    });
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await syncUserProfile(user);
      if (onUserLoaded) onUserLoaded(user, profile);
    } else {
      if (onUserLoaded) onUserLoaded(null, null);
    }
  });
}

// Lưu Lead Gmail đăng ký nhận thông báo ESP hoặc bài học mới
export async function saveEspLead(email) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error("Vui lòng nhập địa chỉ Gmail hợp lệ!");
  }
  const leadId = cleanEmail.replace(/[^a-zA-Z0-9]/g, "_");
  const leadRef = doc(db, "esp_leads", leadId);
  await setDoc(leadRef, {
    email: cleanEmail,
    type: "esp_notification",
    createdAt: serverTimestamp(),
    status: "subscribed",
    source: "landing_esp_card"
  }, { merge: true });
  return true;
}
