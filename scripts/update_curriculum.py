# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/js/curriculum-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Target part 1: Enhance dialogueScenario with storyAudioFile and david turn audio files, and add stepGuideAudios
old_dialogue = '''      // Module 5: Kịch bản đối thoại nhập vai sống động có âm thanh kể chuyện bối cảnh
      dialogueScenario: {
        title: "Cuộc Gặp Gỡ Tình Cờ Tại Sân Bay Quốc Tế New York",
        characterName: "David",
        characterAvatar: "👨‍💼",
        roleContext: "Hành khách người Mỹ thân thiện tại quầy lấy hành lý",
        storyNarrativeVi: "Bối cảnh thực tế: Bạn vừa hạ cánh xuống sân bay quốc tế JFK New York sau chuyến bay dài. Bạn đang đứng đợi lấy hành lý bên băng chuyền thì một người đàn ông Mỹ thân thiện tên David đứng cạnh quay sang nhìn bạn, mỉm cười và cởi mở chào hỏi. Trong văn hóa phương Tây, bạn hãy mỉm cười và đáp lại câu chào làm quen, cảm ơn khi anh ấy giúp bạn nhấc vali, và chúc anh ấy một ngày tuyệt vời nhé!",
        turns: [
          {
            role: "ai",
            speaker: "David",
            text: "Hi there! Nice day, isn't it?",
            ipa: "/haɪ ðer! naɪs deɪ, ˈɪznt ɪt?/",
            meaning: "Chào bạn! Hôm nay trời đẹp thật nhỉ?"
          },
          {
            role: "user",
            speaker: "Bạn",
            targetText: "Hi, nice to meet you!",
            ipa: "/haɪ, naɪs tuː miːt juː/",
            meaning: "Chào bạn, rất vui được gặp bạn!",
            hint: "Mỉm cười thân thiện và đáp lại câu chào làm quen đầu tiên."
          },
          {
            role: "ai",
            speaker: "David",
            text: "Here, let me help you with your bag!",
            ipa: "/hɪr, let miː help juː wɪð jɔːr bæɡ!/",
            meaning: "Để tôi giúp bạn nhấc chiếc vali này xuống nhé!"
          },
          {
            role: "user",
            speaker: "Bạn",
            targetText: "Thank you so much!",
            ipa: "/ˈθæŋk juː soʊ mʌtʃ/",
            meaning: "Cảm ơn bạn rất nhiều!",
            hint: "Cảm ơn chân thành với tông giọng trầm ấm."
          },
          {
            role: "ai",
            speaker: "David",
            text: "You're welcome! Enjoy your trip!",
            ipa: "/jʊr ˈwelkəm! ɪnˈdʒɔɪ jɔːr trɪp!/",
            meaning: "Không có chi! Chúc bạn có chuyến đi thật vui vẻ nhé!"
          },
          {
            role: "user",
            speaker: "Bạn",
            targetText: "Have a great day!",
            ipa: "/hæv ə ɡreɪt deɪ/",
            meaning: "Chúc bạn một ngày tuyệt vời nhé!",
            hint: "Vẫy tay chào tạm biệt vui vẻ trước khi rời đi."
          }
        ]
      },'''

new_dialogue = '''      // Step Guide Audios: Giọng Gia Sư AI Hải Đăng thuyết minh cho từng bước
      stepGuideAudios: {
        moduleMouth: {
          stepNum: 1,
          name: "Bước 1: Khẩu Hình & Phát Âm",
          audioFile: "assets/audio/guide-buoi-01-step-1.mp3",
          instruction: "Làm chủ khẩu hình 3 âm /θ/, /s/ và /t/. Bấm loa nghe mẫu và bấm micro để AI chấm điểm."
        },
        moduleChunks: {
          stepNum: 2,
          name: "Bước 2: Cụm Từ & Phản Xạ Đời Thường",
          audioFile: "assets/audio/guide-buoi-01-step-2.mp3",
          instruction: "Làm chủ 3 cụm từ phản xạ cốt lõi và tích lũy đủ 7 lần lặp đa giác quan."
        },
        moduleQuiz: {
          stepNum: 3,
          name: "Bước 3: Luyện Tập Trắc Nghiệm Phản Xạ",
          audioFile: "assets/audio/guide-buoi-01-step-3.mp3",
          instruction: "Vượt qua bài trắc nghiệm phản xạ tình huống đạt tối thiểu 70% điểm số."
        },
        moduleFlashcard: {
          stepNum: 4,
          name: "Bước 4: Sổ Thẻ Ghi Nhớ 3D",
          audioFile: "assets/audio/guide-buoi-01-step-4.mp3",
          instruction: "Chạm lật tất cả thẻ 3D để neo ngữ nghĩa và nghe phát âm chuẩn."
        },
        moduleSpeaking: {
          stepNum: 5,
          name: "Bước 5: Đối Thoại AI 2 Chiều Cùng David",
          audioFile: "assets/audio/guide-buoi-01-step-5.mp3",
          instruction: "Nhập vai đối thoại trực tiếp 2 chiều với David tại sân bay New York."
        },
        moduleTyping: {
          stepNum: 6,
          name: "Bước 6: Thử Thách Gõ Phản Xạ & Ghép Khối Câu",
          audioFile: "assets/audio/guide-buoi-01-step-6.mp3",
          instruction: "Tái tạo câu tiếng Anh bằng cách ghép khối từ để khắc sâu trật tự từ vào vỏ não."
        }
      },

      // Module 5: Kịch bản đối thoại nhập vai sống động có âm thanh kể chuyện bối cảnh
      dialogueScenario: {
        title: "Cuộc Gặp Gỡ Tình Cờ Tại Sân Bay Quốc Tế New York",
        characterName: "David",
        characterAvatar: "👨‍💼",
        roleContext: "Hành khách người Mỹ thân thiện tại quầy lấy hành lý",
        storyNarrativeVi: "Bối cảnh thực tế: Bạn vừa hạ cánh xuống sân bay quốc tế JFK New York sau chuyến bay dài. Bạn đang đứng đợi lấy hành lý bên băng chuyền thì một người đàn ông Mỹ thân thiện tên David đứng cạnh quay sang nhìn bạn, mỉm cười và cởi mở chào hỏi. Trong văn hóa phương Tây, bạn hãy mỉm cười và đáp lại câu chào làm quen, cảm ơn khi anh ấy giúp bạn nhấc vali, và chúc anh ấy một ngày tuyệt vời nhé!",
        storyAudioFile: "assets/audio/story-buoi-01.mp3",
        turns: [
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
            hint: "Mỉm cười thân thiện và đáp lại câu chào làm quen đầu tiên."
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
            hint: "Cảm ơn chân thành với tông giọng trầm ấm."
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
            hint: "Vẫy tay chào tạm biệt vui vẻ trước khi rời đi."
          }
        ]
      },'''

if old_dialogue in text:
    text = text.replace(old_dialogue, new_dialogue)
    print("Found and replaced dialogueScenario!")
else:
    print("WARNING: old_dialogue string not found exactly!")

# Find buoi-02
pos_b2 = text.find('id: "buoi-02"')
if pos_b2 != -1:
    pos_end_b1 = text.rfind('}', 0, pos_b2)
    text = text[:pos_end_b1+1] + '\n  ]\n};\n'
    print("Trimmed buoi-02 and buoi-03 successfully!")
else:
    print("buoi-02 not found in text.")

with open('d:/WEB_HOC_TIENG_ANH_AI/js/curriculum-data.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done writing d:/WEB_HOC_TIENG_ANH_AI/js/curriculum-data.js!")
