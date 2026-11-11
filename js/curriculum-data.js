// ============================================================================
// HỆ THỐNG DỮ LIỆU GIÁO TRÌNH CHUẨN KHOA HỌC: TỪ CON SỐ 0 ĐẾN THÔNG THẠO BẢN XỨ
// Mô phỏng 100% kiến trúc huấn luyện mô hình ngôn ngữ lớn (LLM / Gemini)
// Dựa trên 4 trụ cột khoa học: CEFR Cambridge, GS. Paul Nation, Cognitive Load (Sweller) & Allan Paivio
// ============================================================================

export const CURRICULUM_DATA = {
  meta: {
    title: "AI English Cognitive System - Nền Tảng Học Tiếng Anh Mô Phỏng Não Bộ AI",
    founder: "Người Sáng Lập & Học Viên #001",
    adminEmail: "xlehoangducx@gmail.com",
    lastUpdated: "2026-11-12",
    totalPhases: 5,
    totalTargetHours: 600, // 600 giờ tích lũy chuẩn Cambridge từ số 0 -> Thông thạo B2
    totalTargetWords: 3000 // 3.000 Chunks cốt lõi bao phủ 95% toàn bộ hội thoại người Mỹ
  },

  // 5 CỘT MỐC CHUẨN CAMBRIDGE CEFR TƯƠNG ĐƯƠNG QUÁ TRÌNH HUẤN LUYỆN AI
  milestones: [
    {
      id: 0,
      phaseName: "Chặng 0: Khởi Động & Căn Chỉnh Khẩu Hình (Pre-A1 Acoustic Alignment)",
      targetProgress: "0% → 10%",
      estimatedHours: 25,
      sessionsRange: "Buổi 01 → 10",
      description: "Mở khóa tai nghe và khẩu hình cơ miệng. Đồng bộ hóa 44 âm vị quốc tế IPA, làm chủ âm gió /s/, âm bật /t/, /θ/, triệt tiêu nuốt âm đuôi và nạp 100 từ vựng tần số cao nhất.",
      targetCompetency: "Nghe nhận diện đúng âm vị, cơ miệng đặt đúng vị trí, phản xạ chào hỏi và tự giới thiệu bản thân không ngập ngừng.",
      color: "from-blue-500 to-cyan-500",
      badge: "Cấp độ 0: Khởi Động (Pre-A1)"
    },
    {
      id: 1,
      phaseName: "Chặng 1: Giao Tiếp Đời Thường & Nền Tảng Thực Chiến (A1 Everyday Foundation)",
      targetProgress: "10% → 30%",
      estimatedHours: 75,
      sessionsRange: "Buổi 11 → 35",
      description: "Nạp 500 cụm từ cố định (Chunks) cho mọi ngữ cảnh đời thực. Gắn từ ngữ trực tiếp với hình ảnh và cảm xúc thực tế, cắt bỏ hoàn toàn việc dịch thầm trong đầu.",
      targetCompetency: "Tự tin giao tiếp khi đi du lịch và đời sống: Gọi món ăn, mua sắm tính tiền, hỏi đường đi, thủ tục khách sạn và sân bay. Phản xạ câu hỏi-đáp dưới 2 giây.",
      color: "from-emerald-500 to-teal-500",
      badge: "Cấp độ 1: Đời Thường (A1)"
    },
    {
      id: 2,
      phaseName: "Chặng 2: Cơ Chế Attention & Cấu Trúc Đa Tầng (A2 Syntactic Attention)",
      targetProgress: "30% → 60%",
      estimatedHours: 100,
      sessionsRange: "Buổi 36 → 70",
      description: "Làm chủ 1.500 từ thông dụng nhất. Nối câu phức với liên từ, kể câu chuyện trong quá khứ, chia sẻ dự định tương lai và bày tỏ quan điểm cá nhân.",
      targetCompetency: "Thoát khỏi câu đơn cộc lốc. Kể lại một ngày đã qua, chia sẻ trải nghiệm du lịch và diễn đạt lý do rõ ràng, mạch lạc.",
      color: "from-amber-500 to-orange-500",
      badge: "Cấp độ 2: Tự Chủ (A2)"
    },
    {
      id: 3,
      phaseName: "Chặng 3: Tinh Chỉnh Thực Chiến & Ngữ Điệu Bản Xứ (B1 Native Cadence & Fluency)",
      targetProgress: "60% → 85%",
      estimatedHours: 200,
      sessionsRange: "Buổi 71 → 105",
      description: "Đạt mốc 2.500 từ. Làm chủ hiện tượng nối âm, nuốt âm, dạng nói tắt (gonna, wanna, gotta), thành ngữ và phrasal verbs thông dụng.",
      targetCompetency: "Nghe hiểu 75% - 85% video Youtube, podcast tiếng Anh tốc độ tự nhiên. Giao tiếp trôi chảy tự nhiên không cần dịch trong đầu.",
      color: "from-purple-500 to-indigo-500",
      badge: "Cấp độ 3: Bản Xứ (B1)"
    },
    {
      id: 4,
      phaseName: "Chặng 4: Thông Thạo Toàn Diện Đa Nhiệm (B2 Independent Mastery)",
      targetProgress: "85% → 100%",
      estimatedHours: 200,
      sessionsRange: "Buổi 106 → 140+",
      description: "Đạt 3.000+ từ vựng học thuật & đời sống. Đọc sách báo tiếng Anh, viết email công việc sắc bén, đàm phán và xử lý công việc độc lập.",
      targetCompetency: "Tư duy và làm việc trực tiếp bằng tiếng Anh như người Mỹ bản xứ. Tự do ngôn ngữ hoàn toàn.",
      color: "from-rose-500 to-pink-500",
      badge: "Cấp độ 4: Tinh Thông (B2)"
    }
  ],

  // DANH MỤC CHI TIẾT CÁC BÀI HỌC (THIẾT KẾ KHOA HỌC THEO MẠCH TIẾN ĐỘ)
  lessons: [
    {
      id: "buoi-01",
      sessionNumber: 1,
      phaseId: 0,
      title: "Đánh Thức Cơ Miệng & 3 Cụm Từ Giao Tiếp Đời Thường Đầu Tiên",
      topic: "Mở khóa khẩu hình cơ miệng, làm quen âm thè lưỡi /θ/, âm gió /s/, âm bật /t/ và phản xạ chào hỏi",
      duration: "25 phút",
      practicalContext: "Gặp gỡ làm quen người nước ngoài, chào hỏi xã giao, cảm ơn chân thành và tạm biệt vui vẻ.",
      status: "unlocked",

      // Module 1: Khẩu hình cơ miệng chuẩn xác kèm nghĩa & ngữ cảnh từng từ
      mouthTechniques: [
        {
          sound: "/θ/",
          example: "Thank you, Think",
          words: [
            { word: "Thank you", ipa: "/ˈθæŋk juː/", meaning: "Cảm ơn bạn", context: "Bày tỏ lòng biết ơn chân thành khi nhận trợ giúp" },
            { word: "Think", ipa: "/θɪŋk/", meaning: "Suy nghĩ / Tôi nghĩ", context: "Bày tỏ ý kiến cá nhân: I think so (Tôi nghĩ vậy)" }
          ],
          guide: "Đặt đầu lưỡi chạm nhẹ giữa 2 hàm răng cửa, thổi luồng hơi nhẹ ra ngoài rồi phát âm. Tuyệt đối không đọc thành 'Thanh-kiu'!",
          tip: "Cắn nhẹ đầu lưỡi và thổi hơi mát như tiếng gió rít qua kẽ răng."
        },
        {
          sound: "/s/",
          example: "Nice, Thanks, See",
          words: [
            { word: "Nice", ipa: "/naɪs/", meaning: "Tốt đẹp / Dễ mến", context: "Lời khen ngợi: Nice to meet you" },
            { word: "Thanks", ipa: "/θæŋks/", meaning: "Cảm ơn nha (thân mật)", context: "Dùng với bạn bè đồng trang lứa" },
            { word: "See", ipa: "/siː/", meaning: "Nhìn thấy / Gặp lại", context: "Gặp lại người quen: See you soon" }
          ],
          guide: "Khép 2 hàm răng lại gần nhau, đẩy luồng hơi xì nhẹ như tiếng xì lốp xe hoặc gió rít qua khe cửa.",
          tip: "Tiếng Anh mất âm đuôi /s/ giống như tiếng Việt nói chuyện bị mất dấu thanh."
        },
        {
          sound: "/t/",
          example: "Meet, Great, Wait",
          words: [
            { word: "Meet", ipa: "/miːt/", meaning: "Gặp gỡ", context: "Gặp ai đó lần đầu hoặc hẹn gặp" },
            { word: "Great", ipa: "/ɡreɪt/", meaning: "Tuyệt vời", context: "Cảm xúc hào hứng: Have a great day!" },
            { word: "Wait", ipa: "/weɪt/", meaning: "Chờ đợi", context: "Nhờ người khác nán lại: Wait a minute" }
          ],
          guide: "Đặt đầu lưỡi lên phần nướu hàm trên sau răng cửa, nén luồng hơi lại rồi bật mạnh xuống dứt khoát.",
          tip: "Bật dứt khoát, gọn gàng, có luồng gió nhỏ thổi ra làm rung tờ giấy."
        }
      ],

      // Module 2: Mẫu câu cốt lõi & Cách nói mở rộng tình huống (Slot-Filling)
      chunks: [
        {
          phrase: "Hi, nice to meet you!",
          ipa: "/haɪ, naɪs tuː miːt juː/",
          meaning: "Chào bạn, rất vui được gặp bạn!",
          context: "Mẫu câu cốt lõi: Bắt tay làm quen người mới lần đầu tiên",
          audioText: "Hi, nice to meet you!",
          type: "core",
          repetitionTarget: 7
        },
        {
          phrase: "Hi, great to meet you!",
          ipa: "/haɪ, ɡreɪt tuː miːt juː/",
          meaning: "Chào bạn, thật tuyệt khi được gặp bạn!",
          context: "Cách nói mở rộng: Tạo cảm giác nhiệt tình, hào hứng hơn",
          audioText: "Hi, great to meet you!",
          type: "permutation",
          repetitionTarget: 7
        },
        {
          phrase: "Good to see you again!",
          ipa: "/ɡʊd tuː siː juː əˈɡen/",
          meaning: "Rất vui được gặp lại bạn!",
          context: "Cách nói mở rộng: Khi gặp lại người quen từ lần thứ hai trở đi",
          audioText: "Good to see you again!",
          type: "permutation",
          repetitionTarget: 7
        },
        {
          phrase: "Thank you so much!",
          ipa: "/ˈθæŋk juː soʊ mʌtʃ/",
          meaning: "Cảm ơn bạn rất nhiều!",
          context: "Mẫu câu cốt lõi: Khi nhận sự giúp đỡ, nói với giọng trầm ấm",
          audioText: "Thank you so much!",
          type: "core",
          repetitionTarget: 7
        },
        {
          phrase: "Thank you for your help!",
          ipa: "/ˈθæŋk juː fər jɔːr help/",
          meaning: "Cảm ơn bạn đã nhiệt tình giúp đỡ tôi!",
          context: "Cách nói mở rộng: Cụ thể hóa lời cảm ơn cho sự trợ giúp vừa nhận",
          audioText: "Thank you for your help!",
          type: "permutation",
          repetitionTarget: 7
        },
        {
          phrase: "Thanks a lot!",
          ipa: "/θæŋks ə lɑːt/",
          meaning: "Cảm ơn nhiều nhé! (Thân mật)",
          context: "Cách nói mở rộng: Nói nhanh gọn với bạn bè đồng trang lứa",
          audioText: "Thanks a lot!",
          type: "permutation",
          repetitionTarget: 7
        },
        {
          phrase: "Have a great day!",
          ipa: "/hæv ə ɡreɪt deɪ/",
          meaning: "Chúc bạn một ngày tuyệt vời nhé!",
          context: "Mẫu câu cốt lõi: Khi chào tạm biệt lúc ra về hoặc kết thúc trò chuyện",
          audioText: "Have a great day!",
          type: "core",
          repetitionTarget: 7
        },
        {
          phrase: "Have a nice weekend!",
          ipa: "/hæv ə naɪs ˈwiːkend/",
          meaning: "Chúc bạn cuối tuần vui vẻ nhé!",
          context: "Cách nói mở rộng: Chào tạm biệt đồng nghiệp vào chiều thứ Sáu",
          audioText: "Have a nice weekend!",
          type: "permutation",
          repetitionTarget: 7
        },
        {
          phrase: "Have a safe trip!",
          ipa: "/hæv ə seɪf trɪp/",
          meaning: "Chúc bạn chuyến đi thượng lộ bình an!",
          context: "Cách nói mở rộng: Tiễn bạn bè đi xa, ra sân bay hoặc đi du lịch",
          audioText: "Have a safe trip!",
          type: "permutation",
          repetitionTarget: 7
        }
      ],

      // Module 3: Bài tập trắc nghiệm âm thanh & tự chấm điểm
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
          question: "Khi được đồng nghiệp hoặc người bản xứ giúp hoàn thành một việc, bạn nói câu nào lịch sự nhất?",
          options: [
            "Thank you for your help!",
            "Have a safe trip!",
            "Good to see you again!"
          ],
          correctIndex: 0,
          explanation: "'Thank you for your help!' là cấu trúc biến thể chuẩn xác để cảm ơn sự hỗ trợ trực tiếp."
        },
        {
          id: "q4",
          question: "Vào chiều thứ Sáu lúc tan làm, câu chúc tạm biệt nào tự nhiên và ấm áp nhất?",
          options: [
            "Have a nice weekend!",
            "Nice to meet you!",
            "I need some water!"
          ],
          correctIndex: 0,
          explanation: "'Have a nice weekend!' là câu chúc phổ biến nhất của người Mỹ khi chia tay trước kỳ nghỉ cuối tuần."
        }
      ],

      // Module 5: Kịch bản đối thoại nhập vai sống động có âm thanh kể chuyện bối cảnh
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
      },

      // Module 6: Thử thách gõ phản xạ & ghép câu (Active Recall Writing)
      typingChallenges: [
        {
          id: "tc1",
          vietnameseCue: "Chào bạn, rất vui được gặp bạn!",
          audioText: "Hi, nice to meet you!",
          targetWords: ["Hi,", "nice", "to", "meet", "you!"],
          fullSentence: "Hi, nice to meet you!",
          distractorWords: ["great", "see", "day"]
        },
        {
          id: "tc2",
          vietnameseCue: "Cảm ơn bạn rất nhiều!",
          audioText: "Thank you so much!",
          targetWords: ["Thank", "you", "so", "much!"],
          fullSentence: "Thank you so much!",
          distractorWords: ["for", "help", "very"]
        },
        {
          id: "tc3",
          vietnameseCue: "Chúc bạn một ngày tuyệt vời nhé!",
          audioText: "Have a great day!",
          targetWords: ["Have", "a", "great", "day!"],
          fullSentence: "Have a great day!",
          distractorWords: ["nice", "trip", "weekend"]
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
          words: [
            { word: "Is", ipa: "/ɪz/", meaning: "Thì / Là (động từ to-be)", context: "Xác định danh tính: This is my friend" },
            { word: "Please", ipa: "/pliːz/", meaning: "Làm ơn / Xin vui lòng", context: "Lời đề nghị lịch sự: Excuse me, please" },
            { word: "Because", ipa: "/bɪˈkɔːz/", meaning: "Bởi vì", context: "Giải thích nguyên nhân" }
          ],
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
          audioText: "Excuse me, please!",
          type: "core",
          repetitionTarget: 7
        },
        {
          phrase: "This is my friend.",
          ipa: "/ðɪs ɪz maɪ frend/",
          meaning: "Đây là bạn của tôi.",
          context: "Khi giới thiệu người đi cùng với người đối diện",
          audioText: "This is my friend.",
          type: "core",
          repetitionTarget: 7
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
      ],
      dialogueScenario: {
        title: "Hỏi Đường Tại Ga Tàu Điện Ngầm Trung Tâm",
        characterName: "Sarah",
        characterAvatar: "👩‍💼",
        roleContext: "Nhân viên trực quầy thông tin nhà ga",
        storyNarrativeVi: "Bối cảnh thực tế: Bạn đang ở nhà ga điện ngầm Grand Central đông đúc. Bạn muốn gọi nhân viên thông tin một cách lịch thiệp để nhờ họ hướng dẫn đường đi cho bạn và bạn của bạn.",
        turns: [
          {
            role: "user",
            speaker: "Bạn",
            targetText: "Excuse me, please!",
            ipa: "/ɪkˈskjuːz miː, pliːz/",
            meaning: "Xin lỗi làm phiền một chút ạ!",
            hint: "Bật rõ âm đuôi /z/ ở cuối 'Excuse' và 'please'."
          },
          {
            role: "ai",
            speaker: "Sarah",
            text: "Yes, how can I help you today?",
            ipa: "/jes, haʊ kæn aɪ help juː təˈdeɪ?/",
            meaning: "Vâng, tôi có thể hỗ trợ gì cho bạn hôm nay ạ?"
          },
          {
            role: "user",
            speaker: "Bạn",
            targetText: "This is my friend.",
            ipa: "/ðɪs ɪz maɪ frend/",
            meaning: "Đây là bạn của tôi.",
            hint: "Giới thiệu người bạn đồng hành của bạn."
          },
          {
            role: "ai",
            speaker: "Sarah",
            text: "Welcome both of you! Which train are you looking for?",
            ipa: "/ˈwelkəm boʊθ əv juː! wɪtʃ treɪn ɑːr juː ˈlʊkɪŋ fər?/",
            meaning: "Chào mừng cả hai bạn! Bạn đang tìm chuyến tàu nào ạ?"
          }
        ]
      },
      typingChallenges: [
        {
          id: "tc2_1",
          vietnameseCue: "Xin lỗi làm phiền một chút ạ!",
          audioText: "Excuse me, please!",
          targetWords: ["Excuse", "me,", "please!"],
          fullSentence: "Excuse me, please!",
          distractorWords: ["sorry", "help", "this"]
        },
        {
          id: "tc2_2",
          vietnameseCue: "Đây là bạn của tôi.",
          audioText: "This is my friend.",
          targetWords: ["This", "is", "my", "friend."],
          fullSentence: "This is my friend.",
          distractorWords: ["are", "your", "name"]
        }
      ]
    },

    {
      id: "buoi-03",
      sessionNumber: 3,
      phaseId: 0,
      title: "Nhu Cầu Thiết Yếu: Diễn Đạt Mong Muốn Trực Tiếp (I want / I need)",
      topic: "Khung câu phản xạ diễn đạt mong muốn trực tiếp: Tôi cần nước, tôi cần sự giúp đỡ",
      duration: "25 phút",
      practicalContext: "Khi bị mệt, khát nước, đói bụng hoặc cần sự trợ giúp khẩn cấp.",
      status: "locked",
      mouthTechniques: [
        {
          sound: "/iː/",
          example: "Need, Please, Meet",
          words: [
            { word: "Need", ipa: "/niːd/", meaning: "Cần thiết", context: "Bày tỏ nhu cầu cấp bách: I need help" },
            { word: "Please", ipa: "/pliːz/", meaning: "Làm ơn", context: "Lịch sự khi yêu cầu" },
            { word: "Meet", ipa: "/miːt/", meaning: "Gặp gỡ", context: "Gặp gỡ làm quen" }
          ],
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
          audioText: "I need some water, please.",
          type: "core",
          repetitionTarget: 7
        },
        {
          phrase: "I need help!",
          ipa: "/aɪ niːd help/",
          meaning: "Tôi cần sự giúp đỡ!",
          context: "Khi gặp sự cố hoặc cần người hỗ trợ khẩn cấp",
          audioText: "I need help!",
          type: "core",
          repetitionTarget: 7
        }
      ],
      quizzes: [
        {
          id: "q3_1",
          question: "Khi bạn cần ai đó giúp đỡ ngay lập tức, bạn hô câu gì?",
          options: ["I need help!", "Nice to meet you!", "Thank you!"],
          correctIndex: 0,
          explanation: "'I need help!' là phản xạ giao tiếp ngắn gọn, rõ ràng và hiệu quả nhất."
        }
      ],
      dialogueScenario: {
        title: "Yêu Cầu Nước Uống Trên Chuyến Bay Quốc Tế",
        characterName: "Emma",
        characterAvatar: "👩‍✈️",
        roleContext: "Tiếp viên hàng không",
        storyNarrativeVi: "Bối cảnh thực tế: Máy bay đang bay qua vùng trời quốc tế. Bạn cảm thấy cổ họng khô rát sau nhiều giờ bay và muốn xin một ly nước ấm từ cô tiếp viên hàng không đang đẩy xe qua.",
        turns: [
          {
            role: "ai",
            speaker: "Emma",
            text: "Hello, would you like something to drink?",
            ipa: "/həˈloʊ, wʊd juː laɪk ˈsʌmθɪŋ tuː drɪŋk?/",
            meaning: "Xin chào, bạn có muốn dùng chút đồ uống gì không ạ?"
          },
          {
            role: "user",
            speaker: "Bạn",
            targetText: "I need some water, please.",
            ipa: "/aɪ niːd sʌm ˈwɔːtər, pliːz/",
            meaning: "Làm ơn cho tôi xin một ít nước.",
            hint: "Kéo dài âm /iː/ trong từ 'need' và 'please' với tông giọng nhẹ nhàng."
          },
          {
            role: "ai",
            speaker: "Emma",
            text: "Here is your water. Is everything alright?",
            ipa: "/hɪr ɪz jɔːr ˈwɔːtər. ɪz ˈevriθɪŋ ɔːlˈraɪt?/",
            meaning: "Nước của bạn đây ạ. Mọi thứ vẫn ổn chứ ạ?"
          },
          {
            role: "user",
            speaker: "Bạn",
            targetText: "Thank you so much!",
            ipa: "/ˈθæŋk juː soʊ mʌtʃ/",
            meaning: "Cảm ơn bạn rất nhiều!",
            hint: "Cảm ơn khi nhận ly nước."
          }
        ]
      },
      typingChallenges: [
        {
          id: "tc3_1",
          vietnameseCue: "Làm ơn cho tôi xin một ít nước.",
          audioText: "I need some water, please.",
          targetWords: ["I", "need", "some", "water,", "please."],
          fullSentence: "I need some water, please.",
          distractorWords: ["want", "give", "food"]
        },
        {
          id: "tc3_2",
          vietnameseCue: "Tôi cần sự giúp đỡ!",
          audioText: "I need help!",
          targetWords: ["I", "need", "help!"],
          fullSentence: "I need help!",
          distractorWords: ["water", "you", "please"]
        }
      ]
    }
  ]
};
