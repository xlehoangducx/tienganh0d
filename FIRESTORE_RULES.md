# 🔒 CẤU HÌNH BẢO MẬT FIRESTORE CHO DỰ ÁN `giasucuatui-af129`

Tài liệu này thay thế bộ rules công khai cũ. Rules cũ cho phép bất kỳ ai đọc hồ sơ/tiến độ của người khác và cho phép người dùng tự đổi `role` thành `admin` — đây là lỗ hổng nghiêm trọng, không được dùng lại.

### 1. Tạo cơ sở dữ liệu (Nếu chưa tạo)
1. Ở menu bên trái Firebase, bấm vào **Build** → chọn **Firestore Database**.
2. Bấm nút **Create database** (Tạo cơ sở dữ liệu).
3. Vị trí database: Chọn **`asia-southeast1` (Singapore)** cho tốc độ về Việt Nam nhanh nhất.
4. Bấm **Next** → chọn **Start in production mode** → bấm **Create**.
5. Không chọn test mode. Test mode mở toàn bộ dữ liệu cho Internet trong 30 ngày.

---

### 2. Dán quy tắc bảo mật
Sau khi tạo xong, bấm vào tab **Rules** (ở trên cùng), xóa hết và dán đoạn mã này vào:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    // Chỉ đúng tài khoản Super Admin hoặc người đã được cấp role admin trong Firestore.
    function isAdmin() {
      return isSignedIn() && (
        request.auth.token.email == "xlehoangducx@gmail.com" ||
        get(/databases/$(database)/documents/english_users/$(request.auth.uid)).data.role == "admin"
      );
    }

    // 1. Hồ sơ học viên
    match /english_users/{userId} {
      // Học viên chỉ đọc được hồ sơ của chính mình; Admin đọc được danh sách.
      allow get: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow list: if isAdmin();

      // Khi tạo hồ sơ: uid phải khớp, role/status chỉ được là học viên chờ duyệt.
      // Super Admin được tạo hồ sơ admin ngay từ lần đăng nhập đầu.
      allow create: if isSignedIn()
        && request.auth.uid == userId
        && request.resource.data.uid == userId
        && (
          (request.resource.data.role == "student" && request.resource.data.status == "pending") ||
          (request.auth.token.email == "xlehoangducx@gmail.com"
            && request.resource.data.role == "admin"
            && request.resource.data.status == "approved")
        );

      // Học viên chỉ được tự cập nhật các trường hiển thị/thời gian.
      // Không được đổi role, status, uid, email hoặc progressPercent.
      allow update: if isAdmin() || (
        isSignedIn()
        && request.auth.uid == userId
        && request.resource.data.diff(resource.data).affectedKeys()
             .hasOnly(["displayName", "photoURL", "lastLogin", "updatedAt"])
        && request.resource.data.role == resource.data.role
        && request.resource.data.status == resource.data.status
        && request.resource.data.uid == resource.data.uid
        && request.resource.data.email == resource.data.email
      );

      allow delete: if isAdmin();
    }

    // 2. Tiến độ học tập riêng của từng học viên
    match /english_progress/{userId} {
      allow get: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow list: if isAdmin();
      allow create, update: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }

    // 3. Đăng ký nhận thông báo bài học / ESP (Leads)
    match /esp_leads/{leadId} {
      // Bất kỳ ai (kể cả khách chưa đăng nhập) được gửi Gmail để nhận thông báo
      allow create: if request.resource.data.keys().hasAll(["email", "type", "createdAt"])
        && request.resource.data.email is string
        && request.resource.data.email.size() <= 100;
      // Chỉ Admin mới được đọc danh sách email và quản lý
      allow read, update, delete: if isAdmin();
    }

    // 4. Chặn mọi truy cập ngoài phạm vi ba collection trên.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Bấm **Publish (Xuất bản)** là hoàn tất.

---

### 3. Vì sao các rules này an toàn hơn?
- **Không còn `allow read: if true`**: người lạ không đọc được email, ảnh, trạng thái duyệt hay tiến độ học của học viên khác.
- **Không thể tự phong admin**: trường `role` và `status` bị khóa khi học viên tự cập nhật. Chỉ Super Admin hoặc tài khoản đã có `role == "admin"` mới đổi được.
- **Không thể sửa UID/email**: các trường định danh phải giữ nguyên khi update.
- **Danh sách học viên chỉ dành cho Admin**: `list` yêu cầu quyền admin, không lộ toàn bộ collection.
- **Chặn collection lạ**: rule cuối cùng đóng mọi đường truy cập chưa được khai báo.

### 4. Lưu ý khi kiểm thử
- Đăng nhập bằng tài khoản học viên, thử đổi `role` trong DevTools/Firestore SDK: thao tác phải bị từ chối.
- Đăng nhập tài khoản khác, thử đọc `english_progress/{uid người khác}`: phải bị từ chối.
- Nếu rules báo lỗi cú pháp, kiểm tra dấu phẩy sau từng `allow` và dấu ngoặc của `match /{document=**}`.
- Không đặt lại test mode để “cho nhanh”; nếu cần debug, dùng Firebase Emulator Suite thay vì mở production.
