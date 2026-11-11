@echo off
chcp 65001 >nul
echo ==============================================================
echo 🚀 ĐANG KHỞI ĐỘNG PHÒNG HỌC TIẾNG ANH AI (CHẠY THỬ CỤC BỘ)
echo ==============================================================
echo.
echo Địa chỉ truy cập trên máy tính: http://localhost:8080
echo.
echo Bấm Ctrl + C nếu muốn tắt máy chủ.
echo Đang mở trình duyệt web...
start http://localhost:8080
python -m http.server 8080 --directory "%~dp0"
pause
