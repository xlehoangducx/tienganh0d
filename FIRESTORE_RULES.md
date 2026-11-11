# 🔒 CẤU HÌNH BẢO MẬT FIRESTORE CHO DỰ ÁN `tienganh-2adfd`

Để hệ thống lưu trữ tiến độ học tập và Admin duyệt học viên, bạn làm 2 bước nhỏ trên Firebase Console:

### 1. Tạo cơ sở dữ liệu (Nếu chưa tạo):
1. Ở menu bên trái Firebase, bấm vào **Build** $\rightarrow$ chọn **Firestore Database**.
2. Bấm nút **Create database** (Tạo cơ sở dữ liệu).
3. Vị trí database: Chọn **`asia-southeast1` (Singapore)** cho tốc độ về Việt Nam nhanh nhất.
4. Bấm **Next** $\rightarrow$ Chọn **Start in test mode** $\rightarrow$ Bấm **Create** (Tạo).

---

### 2. Dán quy tắc bảo mật:
Sau khi tạo xong, bấm vào tab **Rules** (ở trên cùng), xóa hết và dán đoạn mã này vào:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Nhận diện Super Admin
    function isAdmin() {
      return request.auth != null && 
        (request.auth.token.email == "xlehoangducx@gmail.com" || 
         get(/databases/$(database)/documents/english_users/$(request.auth.uid)).data.role == "admin");
    }

    // 1. Quản lý danh sách học viên
    match /english_users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if isAdmin() || (request.auth != null && request.auth.uid == userId);
      allow delete: if isAdmin();
    }

    // 2. Lưu trữ tiến độ học tập riêng của từng học viên
    match /english_progress/{userId} {
      allow read: if true;
      allow create, update: if request.auth != null && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
  }
}
```

Bấm nút **Publish (Xuất bản)** là hoàn tất 100%!
