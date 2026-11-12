with open(r'd:\WEB_HOC_TIENG_ANH_AI\js\curriculum-data.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = None
end_idx = None

for i, line in enumerate(lines):
    if 'slides: [' in line and start_idx is None:
        start_idx = i
    if start_idx is not None and i > start_idx:
        if line.strip() == ']' and '},' in lines[i+1]:
            end_idx = i
            break

print(f"Found slides from line {start_idx+1} to {end_idx+1}")

new_slides_code = '''        slides: [
          {
            id: 1,
            title: "Khởi Đầu: Bản Năng Kết Nối Con Người",
            subtitle: "Vì sao không học bảng chữ cái A-B-C hay công thức ngữ pháp trước?",
            audioFile: "assets/audio/lecture-buoi-01-slide-1.mp3",
            icon: "sparkles",
            badge: "Góc Nhìn Khai Sáng",
            scenes: [
              {
                badge: "🔍 THỰC TRẠNG & CĂN CỨ KHOA HỌC",
                title: "Rào Cản Khi Bắt Đầu Bằng Ngữ Pháp Trừu Tượng",
                visualType: "neural-blockade",
                points: [
                  { icon: "shield-alert", text: "Học công thức ngữ pháp trừu tượng làm tăng Bộ Lọc Lo Âu (Affective Filter - GS. Stephen Krashen)." },
                  { icon: "zap-off", text: "Vùng hạch hạnh nhân (Amygdala) phát tín hiệu phòng vệ, gây tê liệt phản xạ nói tự nhiên." },
                  { icon: "activity", text: "Não bộ rơi vào vòng lặp dịch nhẩm ngữ pháp từng từ thay vì phản xạ trực tiếp từ ngữ cảnh." }
                ],
                callout: "⚠️ Bắt đầu bằng ngữ pháp khô khan sẽ kích hoạt phản ứng phòng vệ lo âu, làm rơi rụng khả năng tiếp thu tự nhiên!",
                icon: "alert-triangle",
                theme: "amber"
              },
              {
                badge: "💡 BẢN NĂNG HẤP THỤ CỦA NÃO BỘ",
                title: "Trẻ Em Bản Xứ Nói Hàng Nghìn Câu Trước Khi Biết Viết Chữ A",
                visualType: "human-connection",
                points: [
                  { icon: "smile", text: "Trẻ em bản xứ nghe và nói hàng nghìn câu đời thường từ cảm xúc trước khi học bất kỳ công thức nào." },
                  { icon: "heart-handshake", text: "Ở Buổi 1, chúng ta kích hoạt lại chính bản năng nguyên thủy: Kết nối và sinh tồn xã hội." },
                  { icon: "sparkles", text: "Chỉ cần 3 cụm từ hạt nhân là đủ để mở khóa vùng phản xạ giao tiếp Broca mà không cần suy nghĩ!" }
                ],
                callout: "✨ 3 Cụm sinh tồn xã hội mở khóa phản xạ kết nối đầu tiên với nụ cười đón nhận của người bản xứ!",
                icon: "sparkles",
                theme: "emerald"
              }
            ]
          },
          {
            id: 2,
            title: "Giải Mã 3 Âm Vị: Theta /θ/, Gió /s/, Bật /t/",
            subtitle: "Bẻ gãy triệt để 3 tật nói tiếng Anh bồi của người Việt",
            audioFile: "assets/audio/lecture-buoi-01-slide-2.mp3",
            icon: "mic",
            badge: "Cơ Sinh Học Khẩu Hình",
            scenes: [
              {
                badge: "⚠️ TẬT PHÁT ÂM TIẾNG VIỆT",
                title: "Thói Quen Rụt Lưỡi & Nuốt Sạch Toàn Bộ Âm Đuôi",
                visualType: "vietnamese-habit",
                points: [
                  { icon: "alert-circle", text: "Tiếng Việt là tiếng đơn âm, không có âm kẹp lưỡi /θ/, âm gió xì /s/ hay âm bật hơi /t/." },
                  { icon: "mic-off", text: "Người Việt có quán tính rụt đầu lưỡi vào chân răng trong, biến Thank you thành 'Thanh-kiu'." },
                  { icon: "volume-x", text: "Nuốt trọn toàn bộ âm đuôi khiến Nice biến thành 'Nai', Meet biến thành 'Mít' người Mỹ không hiểu." }
                ],
                callout: "⚠️ Quán tính rụt lưỡi vào chân răng trong sẽ biến âm /θ/ thành 'th/t' tiếng Việt bồi!",
                icon: "alert-circle",
                theme: "amber"
              },
              {
                badge: "🎯 TÁI CẤU TRÚC CƠ QUAN PHÁT ÂM",
                title: "Ép Cơ Hàm & Đầu Lưỡi Đặt Chuẩn Kẽ Răng",
                visualType: "mouth-kinematics",
                points: [
                  { icon: "check-circle-2", text: "Âm /θ/: Thè nhẹ đầu lưỡi ra giữa 2 hàm răng cửa, thổi luồng gió mát trượt êm ái trên mặt lưỡi." },
                  { icon: "check-circle-2", text: "Âm /s/: Hai hàm răng khép kín, đầu lưỡi nằm bên trong, xì hơi mạnh qua kẽ răng như lốp xe." },
                  { icon: "check-circle-2", text: "Âm /t/: Đầu lưỡi nén hơi chạm nướu răng trên rồi bật xuống dứt khoát tiếng gõ 'tách' gọn gàng." }
                ],
                callout: "🎯 3 Âm vị này là bài tập vật lý trị liệu cho cơ miệng, đánh thức các nhóm cơ lưỡi chưa từng dùng!",
                icon: "mic",
                theme: "cyan"
              }
            ]
          },
          {
            id: 3,
            title: "Bí Mật Thống Kê COCA: 65% Ngữ Pháp Mỹ",
            subtitle: "Định luật Pareto 80/20 - Xây xong móng nhà kiên cố",
            audioFile: "assets/audio/lecture-buoi-01-slide-3.mp3",
            icon: "pie-chart",
            badge: "Kho Ngữ Liệu 1 Tỷ Từ",
            scenes: [
              {
                badge: "📊 QUY LUẬT PARETO 80/20",
                title: "Âm Gió /s/ & Bật /t/ Chiếm Hơn 65% Toàn Bộ Ngữ Pháp",
                visualType: "pareto-chart",
                points: [
                  { icon: "bar-chart-2", text: "Theo ngữ liệu COCA (Corpus of Contemporary American English), /s/ và /t/ là 2 âm cốt lõi nhất." },
                  { icon: "layers", text: "Bao phủ từ danh từ số nhiều (-s/es), ngôi thứ 3 số ít (-s), thì quá khứ (-ed) đến sở hữu cách ('s)." },
                  { icon: "target", text: "Chỉ cần làm chủ 2 âm này ở Buổi 1 là bạn đã giải quyết dứt điểm 65% nền tảng phát âm ngữ pháp sau này." }
                ],
                callout: "📊 Hơn 65% danh từ số nhiều, thì quá khứ (-ed) và động từ ngôi 3 đều kết thúc bằng /s/ hoặc /t/!",
                icon: "pie-chart",
                theme: "amber"
              },
              {
                badge: "🏛️ MÓNG TRỤ KIÊN CỐ",
                title: "Xây Móng Vững Chắc Trước Khi Dựng Nhà",
                visualType: "foundation-pillar",
                points: [
                  { icon: "shield-check", text: "Không vội nhồi hàng nghìn từ vựng rời rạc khi cơ miệng chưa phát âm chuẩn xác 2 âm trụ cột này." },
                  { icon: "zap", text: "Khi đã bật được /s/ và /t/ theo quán tính, bạn sẽ tự động nói đúng ngữ pháp thì quá khứ và số nhiều." },
                  { icon: "award", text: "Đây là tư duy đào tạo tinh gọn của GS. Paul Nation: Tối ưu 20% cốt lõi tạo ra 80% kết quả." }
                ],
                callout: "🏛️ Làm chủ /s/ và /t/ ngay buổi đầu tiên là đặt 2 móng trụ kiên cố nhất cho toàn bộ chặng đường!",
                icon: "layers",
                theme: "emerald"
              }
            ]
          },
          {
            id: 4,
            title: "Tam Giác Sinh Tồn: Chào Hỏi • Cảm Ơn • Tạm Biệt",
            subtitle: "Hạ thấp bộ lọc lo âu - Kích hoạt phản xạ đời thực",
            audioFile: "assets/audio/lecture-buoi-01-slide-4.mp3",
            icon: "heart",
            badge: "Tâm Lý Học Tiếp Nhận",
            scenes: [
              {
                badge: "🤝 TAM GIÁC SINH TỒN XÃ HỘI",
                title: "Hi, nice to meet you! → Thank you so much! → Have a great day!",
                visualType: "social-trinity",
                points: [
                  { icon: "message-circle", text: "'Hi, nice to meet you!': Câu chào làm quen nụ cười, xóa tan rào cản xa lạ ban đầu." },
                  { icon: "heart", text: "'Thank you so much!': Lời tri ân sâu sắc khi được người khác giúp đỡ nhấc hành lý, giữ thang máy." },
                  { icon: "sun", text: "'Have a great day!': Lời chúc lành tích cực để lại ấn tượng ấm áp và lịch thiệp khi chia tay." }
                ],
                callout: "🤝 Bộ 3 câu sinh tồn xã hội giúp bạn tự tin hòa nhập và nhận được sự hỗ trợ ở bất kỳ đâu trên thế giới!",
                icon: "heart",
                theme: "emerald"
              },
              {
                badge: "⚡ KÍCH HOẠT DOPAMINE NÃO BỘ",
                title: "Nhận Nụ Cười Đón Nhận Của Người Bản Xứ",
                visualType: "dopamine-spark",
                points: [
                  { icon: "smile", text: "Dù ở sân bay JFK hay ngoài phố: Nói đúng 3 câu này, người bản xứ sẽ mỉm cười đón nhận bạn." },
                  { icon: "sparkles", text: "Nụ cười đón nhận của đối phương kích hoạt hormone Dopamine trong não bộ, xóa bỏ nỗi sợ nói." },
                  { icon: "check-circle-2", text: "Học xong Buổi 1 là bạn có thể dùng ngay ngoài đời thực với người nước ngoài mà không cần đợi 1 năm!" }
                ],
                callout: "⚡ Phản hồi ấm áp từ người bản xứ sẽ đánh tan vĩnh viễn rào cản sợ giao tiếp tiếng Anh!",
                icon: "smile",
                theme: "purple"
              }
            ]
          },
          {
            id: 5,
            title: "Chiến Lược Não Bộ: 6 Bước & 7 Lần Khắc Sâu",
            subtitle: "Chinh phục 25 phút hôm nay qua các giác quan",
            audioFile: "assets/audio/lecture-buoi-01-slide-5.mp3",
            icon: "cpu",
            badge: "Lộ Trình Đa Giác Quan",
            scenes: [
              {
                badge: "🔄 LỘ TRÌNH 6 BƯỚC ĐA GIÁC QUAN",
                title: "Từ Soi Gương, Nghe, Nói, Trắc Nghiệm Đến Ghép Câu",
                visualType: "multimodal-flow",
                points: [
                  { icon: "camera", text: "Bước 1: Soi gương khẩu hình và nghe mẫu âm vị /θ/, /s/, /t/ chuẩn giọng bản xứ." },
                  { icon: "mic", text: "Bước 2 & 5: Luyện nói 3 cụm câu vào micro cùng AI chấm điểm nhận diện giọng nói tức thì." },
                  { icon: "edit-3", text: "Bước 3, 4 & 6: Chạm trắc nghiệm âm thanh, lật thẻ 3D không gian và ghép khối từ xáo trộn." }
                ],
                callout: "🔄 6 Giác quan đồng bộ kích hoạt đồng thời vùng vận động miệng, thính giác, thị giác và tái tạo chữ viết!",
                icon: "cpu",
                theme: "blue"
              },
              {
                badge: "🧠 CỐ ĐỊNH KHỚP THẦN KINH DÀI HẠN",
                title: "Chạm Mốc 7 Lần Lặp Để Ghi Nhớ Vĩnh Viễn",
                visualType: "synaptic-consolidation",
                points: [
                  { icon: "clock", text: "Não bộ cần 7 lần truy xuất ngắt quãng đa giác quan để chuyển 1 cụm từ sang vỏ não dài hạn." },
                  { icon: "zap", text: "Đạt 7/7 lần lặp là chạm mốc cố định khớp thần kinh vĩnh viễn (Long-term Potentiation)." },
                  { icon: "check-circle-2", text: "Tuyệt đối không học dồn dập 50 lần liên tục vì gây bão hòa nơ-ron và rơi rụng 85% sau 24h." }
                ],
                callout: "🧠 Đạt đủ 7/7 lần lặp đa giác quan để cố định kiến thức vào vỏ não dài hạn vĩnh viễn!",
                icon: "zap",
                theme: "emerald"
              }
            ]
          }
        ]
'''

lines[start_idx:end_idx+1] = [new_slides_code]

with open(r'd:\WEB_HOC_TIENG_ANH_AI\js\curriculum-data.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Successfully replaced slides in curriculum-data.js!")
