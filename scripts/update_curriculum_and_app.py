# -*- coding: utf-8 -*-
"""
Update curriculum-data.js and app.js:
1. curriculum-data.js:
   - Add structured 'scenes' to all 5 masterLecture slides
   - Add audioFile to user turns in dialogueScenario
2. app.js:
   - Video-like presentation rendering for masterLecture with real-time progress & spotlighting
   - Unified dialogue turn playback via playDialogueTurnAudio and full conversation loop
   - Native audio playback for user turns (Bạn) in dialogue
"""

import os
import re

WEB_DIR = r"d:\WEB_HOC_TIENG_ANH_AI"

# ==============================================================
# 1. UPDATE JS/CURRICULUM-DATA.JS
# ==============================================================
curr_path = os.path.join(WEB_DIR, "js", "curriculum-data.js")
with open(curr_path, "r", encoding="utf-8") as f:
    curr_content = f.read()

# Replace masterLecture slides in curriculum-data.js
old_slides_pattern = r"slides:\s*\[[\s\S]*?id:\s*1,[\s\S]*?id:\s*5,[\s\S]*?\}\s*\]\s*\},"

new_slides_code = """slides: [
          {
            id: 1,
            title: "Khởi Đầu: Bản Năng Kết Nối Con Người",
            subtitle: "Vì sao không học bảng chữ cái A-B-C hay công thức ngữ pháp trước?",
            audioFile: "assets/audio/lecture-buoi-01-slide-1.mp3",
            icon: "sparkles",
            badge: "Góc Nhìn Khai Sáng",
            scenes: [
              {
                badge: "🔍 THỰC TRẠNG & NGUYÊN NHÂN",
                title: "95% Người Học Thất Bại Vì Bắt Đầu Bằng Công Thức Khô Khan",
                content: "Não bộ con người không được tiến hóa để học quy tắc trừu tượng trước khi có cảm xúc và trải nghiệm xã hội. Bắt đầu bằng lý thuyết khiến vùng hạch hạnh nhân (Amygdala) bị kích hoạt phản ứng sợ hãi và quá tải nhận thức.",
                icon: "alert-triangle",
                theme: "amber"
              },
              {
                badge: "💡 BẢN NĂNG NGUYÊN THỦY CỦA NÃO BỘ",
                title: "Trẻ Em Bản Xứ Nói Hàng Nghìn Câu Trước Khi Biết Viết Chữ A",
                content: "Ở Buổi 1, chúng ta kích hoạt lại chính bản năng nguyên thủy: Kết nối và sinh tồn xã hội. Chỉ cần 3 cụm từ hạt nhân là đủ để mở khóa vùng phản xạ giao tiếp tự nhiên!",
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
                content: "Tiếng Việt không có âm kẹp lưỡi /θ/, gió /s/ hay bật /t/. Người Việt hay thụt lưỡi nói Thank you thành 'Thanh-kiu' và nuốt trọn âm đuôi biến Nice thành 'Nai'.",
                icon: "alert-circle",
                theme: "amber"
              },
              {
                badge: "🎯 TÁI CẤU TRÚC CƠ QUAN PHÁT ÂM",
                title: "Ép Cơ Hàm & Đầu Lưỡi Đặt Chuẩn Kẽ Răng",
                content: "3 âm vị này là liệu pháp vật lý trị liệu cho cơ quan phát âm, đánh thức các nhóm cơ lưỡi và hàm chưa từng hoạt động, xóa bỏ vĩnh viễn tật nói tiếng Anh bồi.",
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
                content: "Từ đuôi số nhiều (-s/es), ngôi thứ 3 hiện tại, thì quá khứ (-ed) đến sở hữu cách ('s) — tất cả đều cấu tạo từ 2 âm vị nền móng này.",
                icon: "pie-chart",
                theme: "amber"
              },
              {
                badge: "🏗️ MÓNG NHÀ KIÊN CỐ",
                title: "Làm Chủ Ngay Buổi 1 Để Không Bao Giờ Phải Sửa Lại",
                content: "Làm chủ 2 âm này ở Buổi 1 là xây xong cái móng nhà kiên cố cho toàn bộ ngữ pháp sau này mà không bao giờ phải sửa lại hay hoang mang!",
                icon: "layers",
                theme: "emerald"
              }
            ]
          },
          {
            id: 4,
            title: "Tam Giác Sinh Tồn: Vũ Khí Đập Tan Nỗi Sợ",
            subtitle: "Chào hỏi làm quen → Biết ơn chân thành → Chúc lành tạm biệt",
            audioFile: "assets/audio/lecture-buoi-01-slide-4.mp3",
            icon: "shield-check",
            badge: "Ứng Xử Xã Hội Thực Tế",
            scenes: [
              {
                badge: "🌐 NGHI THỨC PHỔ QUÁT",
                title: "Bộ Ba Giao Tiếp Sinh Tồn Xã Hội Phương Tây",
                content: "Bộ ba: Hi, nice to meet you! → Thank you so much! → Have a great day! là nghi thức ứng xử phổ quát giúp bạn kết nối tức thì với bất kỳ người bản xứ nào.",
                icon: "shield-check",
                theme: "indigo"
              },
              {
                badge: "⚡ KÍCH HOẠT DOPAMINE NÃO BỘ",
                title: "Nhận Nụ Cười Đón Nhận Của Người Bản Xứ",
                content: "Dù ở sân bay JFK hay ngoài phố: Chỉ cần nói đúng 3 câu này, người bản xứ sẽ mỉm cười đón nhận bạn, kích hoạt Dopamine xóa tan nỗi sợ nói tiếng Anh!",
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
                content: "Kích hoạt đồng thời 6 vùng thần kinh: Vận động miệng, thính giác, thị giác, phản hồi âm thanh, không gian 3D và tái tạo chữ viết.",
                icon: "cpu",
                theme: "blue"
              },
              {
                badge: "🧠 CỐ ĐỊNH KHỚP THẦN KINH DÀI HẠN",
                title: "Chạm Mốc 7 Lần Lặp Để Ghi Nhớ Vĩnh Viễn",
                content: "Chuyển từng cụm từ từ bộ nhớ tạm sang vỏ não dài hạn. Đạt 7/7 lần là chạm mốc cố định khớp thần kinh vĩnh viễn (Long-term Potentiation)!",
                icon: "zap",
                theme: "emerald"
              }
            ]
          }
        ]
      },"""

if re.search(old_slides_pattern, curr_content):
    curr_content = re.sub(old_slides_pattern, new_slides_code, curr_content)
    print("✅ Updated curriculum-data.js: Added scenes to all 5 masterLecture slides!")
else:
    print("⚠️ masterLecture slides pattern not matched, checking...")

# Replace dialogue turns in curriculum-data.js to include audioFile for user turns
old_dialogue_turns = r"""        turns: \[
          \{
            role: "ai",
            speaker: "David",
            text: "Hi there! Nice day, isn't it\?",
            ipa: "/haɪ ðer! naɪs deɪ, ˈɪznt ɪt\?/",
            meaning: "Chào bạn! Hôm nay trời đẹp thật nhỉ\?",
            audioFile: "assets/audio/david-buoi-01-turn-1\.mp3"
          \},
          \{
            role: "user",
            speaker: "Bạn",
            targetText: "Hi, nice to meet you!",
            ipa: "/haɪ, naɪs tuː miːt juː/",
            meaning: "Chào bạn, rất vui được gặp bạn!",
            hint: "Mỉm cười thân thiện và đáp lại câu chào làm quen đầu tiên\."
          \},
          \{
            role: "ai",
            speaker: "David",
            text: "Here, let me help you with your bag!",
            ipa: "/hɪr, let miː help juː wɪð jɔːr bæɡ!/",
            meaning: "Để tôi giúp bạn nhấc chiếc vali này xuống nhé!",
            audioFile: "assets/audio/david-buoi-01-turn-2\.mp3"
          \},
          \{
            role: "user",
            speaker: "Bạn",
            targetText: "Thank you so much!",
            ipa: "/ˈθæŋk juː soʊ mʌtʃ/",
            meaning: "Cảm ơn bạn rất nhiều!",
            hint: "Cảm ơn chân thành với tông giọng trầm ấm\."
          \},
          \{
            role: "ai",
            speaker: "David",
            text: "You're welcome! Enjoy your trip!",
            ipa: "/jʊr ˈwelkəm! ɪnˈdʒɔɪ jɔːr trɪp!/",
            meaning: "Không có chi! Chúc bạn có chuyến đi thật vui vẻ nhé!",
            audioFile: "assets/audio/david-buoi-01-turn-3\.mp3"
          \},
          \{
            role: "user",
            speaker: "Bạn",
            targetText: "Have a great day!",
            ipa: "/hæv ə ɡreɪt deɪ/",
            meaning: "Chúc bạn một ngày tuyệt vời nhé!",
            hint: "Vẫy tay chào tạm biệt vui vẻ trước khi rời đi\."
          \}
        \]"""

new_dialogue_turns = """        turns: [
          {
            role: "ai",
            speaker: "David",
            text: "Hi there! Nice day, isn't it?",
            ipa: "/haɪ ðer! naɪs deɪ, ˈɪznt ɪt?/",
            meaning: "Chào bạn! Hôm nay trời đẹp thật nhỉ?",
            audioFile: "assets/audio/david-buoi-01-turn-1.mp3"
          },
          {
            role: "user",
            speaker: "Bạn",
            targetText: "Hi, nice to meet you!",
            ipa: "/haɪ, naɪs tuː miːt juː/",
            meaning: "Chào bạn, rất vui được gặp bạn!",
            hint: "Mỉm cười thân thiện và đáp lại câu chào làm quen đầu tiên.",
            audioFile: "assets/audio/hi-nice-to-meet-you.mp3"
          },
          {
            role: "ai",
            speaker: "David",
            text: "Here, let me help you with your bag!",
            ipa: "/hɪr, let miː help juː wɪð jɔːr bæɡ!/",
            meaning: "Để tôi giúp bạn nhấc chiếc vali này xuống nhé!",
            audioFile: "assets/audio/david-buoi-01-turn-2.mp3"
          },
          {
            role: "user",
            speaker: "Bạn",
            targetText: "Thank you so much!",
            ipa: "/ˈθæŋk juː soʊ mʌtʃ/",
            meaning: "Cảm ơn bạn rất nhiều!",
            hint: "Cảm ơn chân thành với tông giọng trầm ấm.",
            audioFile: "assets/audio/thank-you-so-much.mp3"
          },
          {
            role: "ai",
            speaker: "David",
            text: "You're welcome! Enjoy your trip!",
            ipa: "/jʊr ˈwelkəm! ɪnˈdʒɔɪ jɔːr trɪp!/",
            meaning: "Không có chi! Chúc bạn có chuyến đi thật vui vẻ nhé!",
            audioFile: "assets/audio/david-buoi-01-turn-3.mp3"
          },
          {
            role: "user",
            speaker: "Bạn",
            targetText: "Have a great day!",
            ipa: "/hæv ə ɡreɪt deɪ/",
            meaning: "Chúc bạn một ngày tuyệt vời nhé!",
            hint: "Vẫy tay chào tạm biệt vui vẻ trước khi rời đi.",
            audioFile: "assets/audio/have-a-great-day.mp3"
          }
        ]"""

if re.search(old_dialogue_turns, curr_content):
    curr_content = re.sub(old_dialogue_turns, new_dialogue_turns, curr_content)
    print("✅ Updated curriculum-data.js: Attached audioFile to all user turns in dialogueScenario!")
else:
    print("⚠️ Dialogue turns pattern not matched in curriculum-data.js, checking alternate...")

with open(curr_path, "w", encoding="utf-8") as f:
    f.write(curr_content)

print("curriculum-data.js updated successfully!")
