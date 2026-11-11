// ============================================================================
// HỆ THỐNG DỮ LIỆU GIÁO TRÌNH CHUẨN KHOA HỌC: TỪ CON SỐ 0 ĐẾN THÔNG THẠO BẢN XỨ
// Mô phỏng 100% kiến trúc huấn luyện mô hình ngôn ngữ lớn (LLM / Gemini)
// ============================================================================

export const CURRICULUM_DATA = {
  meta: {
    title: "AI English Cognitive System - Nền Tảng Học Tiếng Anh Mô Phỏng Não Bộ AI",
    founder: "Người Sáng Lập & Học Viên #001",
    adminEmail: "xlehoangducx@gmail.com",
    lastUpdated: "2026-11-11",
    totalPhases: 5,
    totalTargetHours: 500, // 500 giờ huấn luyện tích cực từ số 0 -> Thông thạo
    totalTargetWords: 3500 // 3.500 Tokens/Chunks bao phủ 98% giao tiếp đời sống & công việc
  },

  // 6 CỘT MỐC KHOA HỌC TƯƠNG ĐƯƠNG QUÁ TRÌNH HUẤN LUYỆN AI
  milestones: [
    {
      id: 0,
      phaseName: "Giai đoạn 0: Căn Chỉnh Âm Vị & Token Hóa (Acoustic & Tokenization Alignment)",
      targetProgress: "0% → 10%",
      estimatedHours: 25,
      sessionsRange: "Buổi 01 → 10",
      description: "Mở khóa tai nghe và cơ miệng. Đồng bộ hóa 44 âm quốc tế IPA, khắc phục triệt để lỗi nuốt âm đuôi và nạp 100 từ vựng tần số cao nhất.",
      targetCompetency: "Nghe phát hiện đúng âm, đọc đúng phiên âm, phản xạ chào hỏi và tự giới thiệu bản thân không ngập ngừng.",
      color: "from-blue-500 to-cyan-500",
      badge: "Cấp độ 0: Khởi Động"
    },
    {
      id: 1,
      phaseName: "Giai đoạn 1: Không Gian Ngữ Nghĩa Sinh Tồn (Semantic Embedding Space)",
      targetProgress: "10% → 30%",
      estimatedHours: 65,
      sessionsRange: "Buổi 11 → 35",
      description: "Nạp 500 cụm từ cố định (Chunks) cho mọi ngữ cảnh đời thực. Gắn từ ngữ trực tiếp với hình ảnh và cảm xúc, cắt bỏ hoàn toàn việc dịch thầm.",
      targetCompetency: "Tự tin sinh tồn khi đi du lịch: Gọi món, mua sắm, hỏi đường, khách sạn, sân bay. Phản xạ câu hỏi-đáp dưới 2 giây.",
      color: "from-emerald-500 to-teal-500",
      badge: "Cấp độ 1: Sinh Tồn"
    },
    {
      id: 2,
      phaseName: "Giai đoạn 2: Cơ Chế Attention & Cấu Trúc Đa Tầng (Syntactic Linkage & Attention)",
      targetProgress: "30% → 60%",
      estimatedHours: 120,
      sessionsRange: "Buổi 36 → 70",
      description: "Làm chủ 1.500 từ thông dụng nhất. Nối câu phức, kể câu chuyện trong quá khứ, chia sẻ dự định tương lai và bày tỏ quan điểm.",
      targetCompetency: "Thoát khỏi câu đơn cộc lốc. Kể lại một ngày đã qua, chia sẻ trải nghiệm du lịch và diễn đạt lý do rõ ràng.",
      color: "from-amber-500 to-orange-500",
      badge: "Cấp độ 2: Tự Chủ"
    },
    {
      id: 3,
      phaseName: "Giai đoạn 3: Tinh Chỉnh Thực Chiến & Ngữ Điệu Bản Xứ (RLHF & Native Cadence)",
      targetProgress: "60% → 85%",
      estimatedHours: 140,
      sessionsRange: "Buổi 71 → 105",
      description: "Đạt mốc 3.000 từ. Làm chủ nói tắt (gonna, wanna, gotta), thành ngữ và phrasal verbs. Luyện nhại giọng (Shadowing) theo video người Mỹ.",
      targetCompetency: "Nghe hiểu 75% - 85% video Youtube, podcast tiếng Anh tốc độ tự nhiên. Giao tiếp tự nhiên không cần dịch trong đầu.",
      color: "from-purple-500 to-indigo-500",
      badge: "Cấp độ 3: Bản Xứ"
    },
    {
      id: 4,
      phaseName: "Giai đoạn 4: Thông Thạo Toàn Diện Đa Nhiệm (General Intelligence Mastery)",
      targetProgress: "85% → 100%",
      estimatedHours: 150,
      sessionsRange: "Buổi 106 → 140+",
      description: "Đạt 4.000+ từ vựng học thuật & đời sống. Đọc sách báo tiếng Anh, viết email công việc sắc bén, tranh luận và xử lý công việc độc lập.",
      targetCompetency: "Tư duy và làm việc trực tiếp bằng tiếng Anh như người Mỹ bản xứ. Độc lập ngôn ngữ hoàn toàn.",
      color: "from-rose-500 to-pink-500",
      badge: "Cấp độ 4: Tinh Thông"
    }
  ],

  // DANH MỤC CHI TIẾT CÁC BÀI HỌC (CÓ THỂ MỞ RỘNG VÔ HẠN KHÔNG SỢ LOẠN)
  lessons: [
    {
      id: "buoi-01",
      sessionNumber: 1,
      phaseId: 0,
      title: "Đánh Thức Cơ Miệng & 3 Khối Phản Xạ Sinh Tồn Đầu Đời",
      topic: "Mở khóa khẩu hình cơ miệng, làm quen âm gió, âm bật và phản xạ chào hỏi",
      duration: "20 phút",
      practicalContext: "Gặp gỡ làm quen người nước ngoài, chào hỏi xã giao, cảm ơn chân thành và tạm biệt vui vẻ.",
      status: "unlocked",

      // Module 1: Khẩu hình cơ miệng
      mouthTechniques: [
        {
          sound: "/θ/",
          example: "Thank you, Think",
          guide: "Đặt đầu lưỡi chạm nhẹ giữa 2 hàm răng cửa, thổi luồng hơi nhẹ ra ngoài rồi phát âm. Tuyệt đối không đọc thành 'Thanh-kiu'!",
          tip: "Cắn nhẹ đầu lưỡi và thổi hơi mát như tiếng gió rít."
        },
        {
          sound: "/s/",
          example: "Nice, Thanks, See",
          guide: "Khép 2 hàm răng lại, đẩy luồng hơi xì nhẹ như tiếng xì lốp xe hoặc gió rít qua khe cửa.",
          tip: "Tiếng Anh mất âm đuôi /s/ giống như tiếng Việt mất dấu thanh."
        },
        {
          sound: "/t/",
          example: "Meet, Great, Wait",
          guide: "Đặt đầu lưỡi lên vòm họng trên sau răng cửa, nén hơi rồi bật nhẹ xuống dứt khoát.",
          tip: "Bật dứt khoát, gọn gàng, không kéo dài."
        }
      ],

      // Module 2: Cụm từ phản xạ cốt lõi (Chunks)
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

      // Module 3: Luyện nghe và phản xạ nhại giọng (Shadowing)
      shadowing: {
        guide: "Bấm nút nghe 1 câu, nhắm mắt lại tưởng tượng tình huống, sau đó nói nhại theo đúng ngữ điệu bản xứ 3 lần.",
        targetPhrase: "Hi, nice to meet you! Have a great day!"
      },

      // Module 4: Bài tập trắc nghiệm âm thanh & tự chấm điểm
      quizzes: [
        {
          id: "q1",
          question: "Khi bạn gặp một người khách nước ngoài lần đầu tiên, câu nào tự nhiên và đúng chuẩn nhất?",
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
          question: "Âm quan trọng nhất ở đuôi từ 'Nice' trong câu 'Nice to meet you' là gì?",
          options: [
            "Âm gió xì nhẹ /s/",
            "Âm bật mạnh /t/",
            "Không cần phát âm đuôi"
          ],
          correctIndex: 0,
          explanation: "Từ 'Nice' bắt buộc phải có âm đuôi xì gió /s/. Đọc không có /s/ sẽ thành từ 'nai' vô nghĩa."
        },
        {
          id: "q3",
          question: "Khi người khác giúp đỡ bạn một việc nhiệt tình, bạn đáp lại bằng câu nào?",
          options: [
            "Thank you so much!",
            "Nice to meet you!",
            "I don't know"
          ],
          correctIndex: 0,
          explanation: "'Thank you so much!' vừa chân thành vừa ấm áp, có âm thổi hơi /θ/ ở đầu từ Thank."
        }
      ]
    },

    {
      id: "buoi-02",
      sessionNumber: 2,
      phaseId: 0,
      title: "Làm Chủ Âm Đuôi Gió /s/, /z/ & 5 Đại Từ Sống Còn",
      topic: "Khắc phục triệt để lỗi nuốt âm đuôi và phản xạ các đại từ xưng hô I, You, We, They, He, She",
      duration: "25 phút",
      practicalContext: "Xác định rõ ràng ai đang làm gì, giới thiệu người đi cùng và diễn đạt danh tính.",
      status: "locked",
      mouthTechniques: [
        {
          sound: "/z/",
          example: "Is, Please, Because",
          guide: "Khẩu hình giống hệt âm /s/ nhưng đặt tay lên cổ họng sẽ cảm nhận dây thanh quản rung mạnh.",
          tip: "Rung thanh quản như tiếng ong vo ve: zzzzz."
        }
      ],
      chunks: [
        {
          phrase: "Excuse me, please!",
          ipa: "/ɪkˈskjuːz miː, pliːz/",
          meaning: "Xin lỗi làm phiền một chút ạ!",
          context: "Khi muốn hỏi đường hoặc gọi phục vụ một cách lịch thiệp",
          audioText: "Excuse me, please!"
        },
        {
          phrase: "This is my friend.",
          ipa: "/ðɪs ɪz maɪ frend/",
          meaning: "Đây là bạn của tôi.",
          context: "Khi giới thiệu người đi cùng với người đối diện",
          audioText: "This is my friend."
        }
      ],
      quizzes: [
        {
          id: "q2_1",
          question: "Khi muốn chen ngang lịch sự hoặc gọi người phục vụ, bạn nói gì?",
          options: ["Excuse me, please!", "Stop here!", "Give me food!"],
          correctIndex: 0,
          explanation: "'Excuse me, please!' là cách gọi lịch thiệp nhất của người bản xứ."
        }
      ]
    },

    {
      id: "buoi-03",
      sessionNumber: 3,
      phaseId: 0,
      title: "Bản Năng Sinh Tồn: Diễn Đạt Nhu Cầu Cấp Thiết (I want / I need)",
      topic: "Khung câu phản xạ diễn đạt mong muốn trực tiếp: Tôi cần nước, tôi cần sự giúp đỡ",
      duration: "25 phút",
      practicalContext: "Khi bị mệt, khát nước, đói bụng hoặc cần sự trợ giúp khẩn cấp.",
      status: "locked",
      mouthTechniques: [
        {
          sound: "/iː/",
          example: "Need, Please, Meet",
          guide: "Kéo khóe miệng sang hai bên như đang mỉm cười, kéo dài âm 'i' sâu trong khoang miệng.",
          tip: "Cười tươi khi phát âm để âm sáng và vang."
        }
      ],
      chunks: [
        {
          phrase: "I need some water, please.",
          ipa: "/aɪ niːd sʌm ˈwɔːtər, pliːz/",
          meaning: "Làm ơn cho tôi xin một ít nước.",
          context: "Khi khát nước ở nhà hàng, máy bay hoặc khách sạn",
          audioText: "I need some water, please."
        },
        {
          phrase: "I need help!",
          ipa: "/aɪ niːd help/",
          meaning: "Tôi cần sự giúp đỡ!",
          context: "Khi gặp sự cố hoặc cần người hỗ trợ khẩn cấp",
          audioText: "I need help!"
        }
      ],
      quizzes: [
        {
          id: "q3_1",
          question: "Khi bạn cần ai đó giúp đỡ ngay lập tức, bạn hô câu gì?",
          options: ["I need help!", "Nice to meet you!", "Thank you!"],
          correctIndex: 0,
          explanation: "'I need help!' là phản xạ sinh tồn ngắn gọn và hiệu quả nhất."
        }
      ]
    }
  ]
};
