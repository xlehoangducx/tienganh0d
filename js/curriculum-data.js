// DỮ LIỆU BÀI HỌC VÀ LỘ TRÌNH ĐƯỢC AI TỰ ĐỘNG BIÊN SOẠN VÀ ĐỒNG BỘ
// Mỗi khi bạn hoàn thành 1 phiên học trên máy tính, AI sẽ tự động cập nhật bài học mới vào file này!

export const CURRICULUM_DATA = {
  meta: {
    title: "Chương Trình Học Tiếng Anh Từ Số 0 Theo Mô Hình AI",
    founder: "Người Sáng Lập & Học Viên #001",
    adminEmail: "xlehoangducx@gmail.com",
    lastUpdated: "2026-11-11",
    totalPhases: 5,
    currentActivePhase: 0
  },

  // 5 Giai đoạn chuẩn từ 0% đến 100%
  phases: [
    {
      id: 0,
      name: "Giai đoạn 0: Giải Mã Âm Vị & 100 Token Cốt Lõi",
      progressRange: "0% - 10%",
      description: "Mở khóa tai nghe và cơ miệng, làm chủ âm đuôi và các âm thổi hơi đặc trưng của tiếng Anh.",
      color: "from-blue-500 to-cyan-500",
      totalLessons: 10
    },
    {
      id: 1,
      name: "Giai đoạn 1: Giao Tiếp Sinh Tồn Đời Thực",
      progressRange: "10% - 30%",
      description: "500 cụm từ phản xạ cố định (Chunks) cho mọi tình huống: Ăn uống, mua sắm, hỏi đường, du lịch.",
      color: "from-emerald-500 to-teal-500",
      totalLessons: 20
    },
    {
      id: 2,
      name: "Giai đoạn 2: Nối Câu & Kể Chuyện Linh Hoạt",
      progressRange: "30% - 60%",
      description: "Làm chủ 1.500 từ cốt lõi, kể lại sự việc quá khứ, chia sẻ dự định tương lai và bày tỏ cảm xúc.",
      color: "from-amber-500 to-orange-500",
      totalLessons: 25
    },
    {
      id: 3,
      name: "Giai đoạn 3: Phản Xạ Trực Tiếp Không Dịch Thầm",
      progressRange: "60% - 85%",
      description: "Đạt 3.000 từ, nghe hiểu podcast, phim ảnh, nói tắt chuẩn ngữ điệu người Mỹ (gonna, wanna).",
      color: "from-purple-500 to-indigo-500",
      totalLessons: 25
    },
    {
      id: 4,
      name: "Giai đoạn 4: Thông Thạo Toàn Diện Như Bản Xứ",
      progressRange: "85% - 100%",
      description: "4.000+ từ, tư duy và làm việc trực tiếp bằng tiếng Anh như người Mỹ.",
      color: "from-rose-500 to-pink-500",
      totalLessons: 20
    }
  ],

  // Danh sách chi tiết các buổi học (AI sẽ tự động nạp tiếp vào đây sau mỗi buổi)
  lessons: [
    {
      id: "buoi-01",
      date: "2026-11-11",
      sessionNumber: 1,
      phaseId: 0,
      title: "Đánh Thức Cơ Miệng & 3 Khối Phản Xạ Sinh Tồn Đầu Đời",
      topic: "Mở khóa khẩu hình cơ miệng, làm quen âm gió, âm bật và phản xạ chào hỏi",
      practicalApplication: "Áp dụng ngay khi gặp người nước ngoài, chào hỏi tự tin, cảm ơn chân thành và tạm biệt vui vẻ.",
      status: "active",
      
      // Hướng dẫn khẩu hình cơ miệng
      mouthTechniques: [
        {
          sound: "/θ/",
          example: "Thank you",
          guide: "Đặt đầu lưỡi chạm nhẹ giữa 2 hàm răng cửa, thổi luồng hơi nhẹ ra ngoài rồi phát âm. Tuyệt đối không đọc thành 'Thanh-kiu'!",
          tip: "Cắn nhẹ lưỡi và thổi hơi như một luồng gió mát."
        },
        {
          sound: "/s/",
          example: "Nice, Thanks",
          guide: "Khép 2 hàm răng lại, đẩy hơi xì nhẹ như tiếng xì lốp xe hoặc gió rít qua khe cửa.",
          tip: "Tiếng Anh mất âm đuôi /s/ giống tiếng Việt mất dấu thanh."
        },
        {
          sound: "/t/",
          example: "Meet, Great",
          guide: "Đặt đầu lưỡi lên vòm họng trên sau răng, nén hơi rồi bật nhẹ dứt khoát.",
          tip: "Bật dứt khoát, không kéo dài."
        }
      ],

      // Cụm từ cốt lõi (Chunks) có thể bấm để nghe đọc tiếng Mỹ
      chunks: [
        {
          phrase: "Hi, nice to meet you!",
          ipa: "/haɪ, naɪs tuː miːt juː/",
          meaning: "Chào bạn, rất vui được gặp bạn!",
          context: "Khi bắt tay làm quen người mới lần đầu tiên",
          audioText: "Hi, nice to meet you!"
        },
        {
          phrase: "Thank you so much!",
          ipa: "/ˈθæŋk juː soʊ mʌtʃ/",
          meaning: "Cảm ơn bạn rất nhiều!",
          context: "Khi nhận được sự giúp đỡ, nói với giọng trầm ấm và biết ơn",
          audioText: "Thank you so much!"
        },
        {
          phrase: "Have a great day!",
          ipa: "/hæv ə ɡreɪt deɪ/",
          meaning: "Chúc bạn một ngày tuyệt vời nhé!",
          context: "Khi chào tạm biệt lúc ra về hoặc kết thúc cuộc trò chuyện",
          audioText: "Have a great day!"
        }
      ],

      // Bài tập tương tác trên điện thoại (Tự động chấm điểm)
      quizzes: [
        {
          id: "q1",
          type: "multiple_choice",
          question: "Khi bạn gặp một người khách nước ngoài lần đầu tiên, câu nào lịch sự và tự nhiên nhất?",
          options: [
            "Hi, nice to meet you!",
            "Thank you so much!",
            "Have a great day!"
          ],
          correctIndex: 0,
          explanation: "'Hi, nice to meet you!' là câu mở đầu kinh điển nhất khi làm quen người mới."
        },
        {
          id: "q2",
          type: "multiple_choice",
          question: "Âm quan trọng nhất ở đuôi từ 'Nice' trong câu 'Nice to meet you' là gì?",
          options: [
            "Âm gió xì nhẹ /s/",
            "Âm bật mạnh /t/",
            "Không cần phát âm đuôi"
          ],
          correctIndex: 0,
          explanation: "Từ 'Nice' bắt buộc phải có âm đuôi xì gió /s/. Đọc không có /s/ sẽ thành từ 'nai' không có nghĩa."
        },
        {
          id: "q3",
          type: "multiple_choice",
          question: "Khi được đồng nghiệp hoặc bạn bè giúp đỡ nhiệt tình, bạn đáp lại bằng câu nào?",
          options: [
            "Thank you so much!",
            "Nice to meet you!",
            "I don't know"
          ],
          correctIndex: 0,
          explanation: "'Thank you so much!' vừa chân thành vừa ấm áp, có âm thổi hơi /θ/ ở đầu từ Thank."
        }
      ]
    }
  ]
};
