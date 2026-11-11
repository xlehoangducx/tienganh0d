// CẤU HÌNH THÔNG TIN ỦNG HỘ / BUY ME A COFFEE (TÙY TÂM & TỰ NGUYỆN)

export const DONATE_CONFIG = {
  ownerTitle: "Tác Giả & Người Sáng Lập Nền Tảng",
  message: "Hệ thống học tiếng Anh này được phát triển hoàn toàn miễn phí 0đ vì cộng đồng. Nếu bạn thấy các bài học này hữu ích và muốn tiếp thêm động lực cho tác giả duy trì máy chủ, bạn có thể gửi tặng một ly cà phê nhỏ nhé (hoàn toàn tùy tâm)!",
  
  // Thông tin ngân hàng từ mã VietQR thật của bạn
  banking: {
    bankId: "CTG",               // VietinBank (Ngân Hàng TMCP Công Thương Việt Nam)
    bankName: "VietinBank (Công Thương)",
    accountNumber: "0941958090",
    accountName: "LE HOANG DUC",
    qrImagePath: "assets/qr-donate.jpg", // Sử dụng trực tiếp ảnh QR sắc nét của bạn
    suggestedAmounts: [10000, 20000, 50000]
  }
};

// Hàm lấy đường dẫn ảnh QR
export function getVietQRUrl() {
  return DONATE_CONFIG.banking.qrImagePath;
}
