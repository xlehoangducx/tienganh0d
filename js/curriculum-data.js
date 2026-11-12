// ============================================================================
// HỆ THỐNG DỮ LIỆU GIÁO TRÌNH CHUẨN KHOA HỌC: TỪ CON SỐ 0 ĐẾN THÔNG THẠO BẢN XỨ
// Mô phỏng 100% kiến trúc huấn luyện mô hình ngôn ngữ lớn (LLM / Gemini)
// Dựa trên 4 trụ cột khoa học: CEFR Cambridge, GS. Paul Nation, Cognitive Load (Sweller) & Allan Paivio
// ============================================================================

export const CURRICULUM_DATA = {
  meta: {
    title: "OmniLang AI - Nền Tảng Học Tiếng Anh Mô Phỏng Não Bộ AI",
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
      title: "Đánh Thức Cơ Miệng & 3 Cụm Giao Tiếp",
      topic: "Mở khóa khẩu hình cơ miệng, làm quen âm thè lưỡi /θ/, âm gió /s/, âm bật /t/ và phản xạ chào hỏi",
      duration: "25 phút",
      practicalContext: "Gặp gỡ làm quen người nước ngoài, chào hỏi xã giao, cảm ơn chân thành và tạm biệt vui vẻ.",
      status: "unlocked",

      // Module 0: Bài Thuyết Giảng Khai Mở Tương Tác 5 Slide
      masterLecture: {
        title: "Bản Đồ Khai Mở Buổi 01: Tại Sao Học Như Vậy Là Chuẩn Xác Nhất?",
        subtitle: "Chuỗi thuyết giảng đa phương tiện có giọng nói Gia Sư AI hướng dẫn từng slide",
        author: "Gia Sư Trí Tuệ Nhân Tạo (Hải Đăng)",
        slides: [
          {
            id: 1,
            title: "Khởi Đầu: Bản Năng Tiếp Nhận Tự Nhiên",
            subtitle: "Vì sao không học bảng chữ cái A-B-C hay công thức ngữ pháp trước?",
            audioFile: "assets/audio/lecture-buoi-01-slide-1.mp3",
            icon: "sparkles",
            badge: "Góc Nhìn Khai Sáng",
            scenes: [
              {
                badge: "👋 GIA SƯ AI KHAI MỞ",
                title: "Lời Chào Mở Đầu & Định Hướng Buổi Học",
                audioFile: "assets/audio/lecture-buoi-01-slide-1-scene-0.mp3",
                visualType: "intro-welcome",
                insight: "Đánh thức các nhóm cơ miệng và làm chủ ngay 3 cụm từ giao tiếp sinh tồn đầu tiên mà không cần nhồi nhét ngữ pháp khô khan.",
                callout: "✨ Chào mừng bạn đến với Buổi 01: Hành trình đánh thức phản xạ giao tiếp tự nhiên cùng Trí Tuệ Nhân Tạo!",
                icon: "sparkles",
                theme: "emerald"
              },
              {
                badge: "🔍 THỰC TRẠNG & CĂN CỨ KHOA HỌC",
                title: "Rào Cản Khi Bắt Đầu Bằng Ngữ Pháp Trừu Tượng",
                audioFile: "assets/audio/lecture-buoi-01-slide-1-scene-1.mp3",
                visualType: "neural-blockade",
                insight: "Học công thức khô khan kích hoạt hạch hạnh nhân (Amygdala) phát tín hiệu phòng vệ, làm tê liệt phản xạ nói tự nhiên của vùng Broca.",
                callout: "⚠️ Bắt đầu bằng ngữ pháp khô khan sẽ kích hoạt phản ứng phòng vệ lo âu, làm rơi rụng khả năng tiếp thu tự nhiên!",
                icon: "alert-triangle",
                theme: "amber"
              },
              {
                badge: "💡 BẢN NĂNG HẤP THỤ NÃO BỘ",
                title: "Trẻ Em Bản Xứ Nói Hàng Nghìn Câu Trước Khi Biết Viết Chữ A",
                audioFile: "assets/audio/lecture-buoi-01-slide-1-scene-2.mp3",
                visualType: "human-connection",
                insight: "Trẻ em hấp thụ ngôn ngữ qua âm thanh và cảm xúc kết nối đời thường trước khi học bất kỳ công thức nào. Chỉ 3 cụm câu hạt nhân là đủ mở khóa phản xạ!",
                callout: "💡 Mô phỏng 100% bản năng nguyên thủy: Tiếp thu qua cảm xúc và ngữ cảnh đời thực để nói tự nhiên không cần dịch nhẩm.",
                icon: "heart-handshake",
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
                audioFile: "assets/audio/lecture-buoi-01-slide-2-scene-0.mp3",
                visualType: "vietnamese-habit",
                insight: "Quán tính rụt đầu lưỡi vào chân răng trong biến Thank you thành 'Thanh-kiu', và nuốt sạch âm đuôi /s/, /t/ khiến Nice thành 'Nai', Meet thành 'Mít' người Mỹ không hiểu.",
                callout: "⚠️ Quán tính thụt đầu lưỡi vào chân răng trong là nguyên nhân số 1 biến phát âm tiếng Anh thành tiếng Việt bồi!",
                icon: "mic-off",
                theme: "amber"
              },
              {
                badge: "🎯 TÁI CẤU TRÚC CƠ QUAN PHÁT ÂM",
                title: "Ép Cơ Hàm & Đầu Lưỡi Đặt Chuẩn Kẽ Răng",
                audioFile: "assets/audio/lecture-buoi-01-slide-2-scene-1.mp3",
                visualType: "mouth-kinematics",
                insight: "Kỹ thuật chuẩn: Âm /θ/ kẹp nhẹ đầu lưỡi thổi gió mát; Âm /s/ khép 2 hàm răng xì hơi lốp xe; Âm /t/ nén hơi nướu trên rồi bật tách dứt khoát.",
                callout: "🎯 3 Âm vị này là bài tập vật lý trị liệu cho cơ miệng, đánh thức các nhóm cơ lưỡi chưa từng dùng trong tiếng Việt!",
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
                audioFile: "assets/audio/lecture-buoi-01-slide-3-scene-0.mp3",
                visualType: "pareto-chart",
                insight: "Theo ngữ liệu COCA 1 tỷ từ, /s/ và /t/ xuất hiện ở hầu hết cấu trúc cốt lõi: số nhiều (-s/es), ngôi 3 (-s), quá khứ (-ed) và sở hữu cách ('s).",
                callout: "📊 Làm chủ âm /s/ và /t/ ngay buổi đầu tiên là bạn đã giải quyết dứt điểm hơn 65% nền tảng ngữ pháp thực chiến!",
                icon: "pie-chart",
                theme: "emerald"
              },
              {
                badge: "🏛️ MÓNG TRỤ KIÊN CỐ",
                title: "Xây Móng Vững Chắc Trước Khi Dựng Nhà",
                audioFile: "assets/audio/lecture-buoi-01-slide-3-scene-1.mp3",
                visualType: "foundation-pillar",
                insight: "Tối ưu 20% kỹ thuật cơ miệng cốt lõi sẽ tự động tạo ra 80% kết quả phản xạ ngữ pháp thì quá khứ và số nhiều mà không tốn công ghi nhớ.",
                callout: "🏛️ GS. Paul Nation chứng minh: Đặt móng phát âm chuẩn xác ngay từ đầu giúp tiết kiệm 80% thời gian học sau này!",
                icon: "layers",
                theme: "cyan"
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
                audioFile: "assets/audio/lecture-buoi-01-slide-4-scene-0.mp3",
                visualType: "social-trinity",
                insight: "Bộ ba câu sống còn xóa tan rào cản: Chào hỏi thân thiện nụ cười → Cảm ơn sâu sắc khi nhận trợ giúp → Lời chúc tốt lành để lại thiện cảm.",
                callout: "🤝 Bộ 3 câu sinh tồn xã hội giúp bạn tự tin hòa nhập và nhận được sự hỗ trợ ở bất kỳ sân bay hay đường phố nào trên thế giới!",
                icon: "heart",
                theme: "emerald"
              },
              {
                badge: "⚡ KÍCH HOẠT DOPAMINE NÃO BỘ",
                title: "Nhận Nụ Cười Đón Nhận Của Người Bản Xứ",
                audioFile: "assets/audio/lecture-buoi-01-slide-4-scene-1.mp3",
                visualType: "dopamine-spark",
                insight: "Chỉ cần phát âm đúng 3 câu này, người bản xứ sẽ mỉm cười đón nhận bạn. Nụ cười đối phương kích hoạt Dopamine xóa tan 100% nỗi sợ nói tiếng Anh!",
                callout: "⚡ Phản hồi ấm áp từ người bản xứ là liều thuốc tâm lý mạnh mẽ nhất giúp bạn tự tin nói tiếng Anh suốt đời!",
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
                audioFile: "assets/audio/lecture-buoi-01-slide-5-scene-0.mp3",
                visualType: "multimodal-flow",
                insight: "Kích hoạt đồng thời 6 vùng thần kinh: Vận động miệng, thính giác, thị giác, phản hồi âm thanh tức thì, không gian 3D và tái tạo chữ viết.",
                callout: "🔄 6 Giác quan đồng bộ giúp khắc phục triệt để thói quen học thụ động một chiều chỉ ngồi nhìn chữ!",
                icon: "cpu",
                theme: "blue"
              },
              {
                badge: "🧠 CỐ ĐỊNH KHỚP THẦN KINH DÀI HẠN",
                title: "Chạm Mốc 7 Lần Lặp Để Ghi Nhớ Vĩnh Viễn",
                audioFile: "assets/audio/lecture-buoi-01-slide-5-scene-1.mp3",
                visualType: "synaptic-consolidation",
                insight: "Não bộ cần 7 lần truy xuất ngắt quãng đa giác quan để chuyển cụm từ sang vỏ não dài hạn (LTP), cố định phản xạ tự nhiên mà không bao giờ quên.",
                callout: "🧠 Đạt đủ 7/7 lần lặp ngắt quãng đa giác quan để cố định kiến thức vào vỏ não dài hạn vĩnh viễn!",
                icon: "zap",
                theme: "emerald"
              }
            ]
          }
        ]
      },

      // Module 1: Khẩu hình cơ miệng chuẩn xác kèm nghĩa & ngữ cảnh từng từ
      mouthTechniques: [
        {
          sound: "/θ/ (Âm Theta kẹp lưỡi)",
          example: "Thank you, Think",
          words: [
            { word: "Thank you", ipa: "/ˈθæŋk juː/", meaning: "Cảm ơn bạn", context: "Bày tỏ lòng biết ơn chân thành khi nhận trợ giúp", audioFile: "assets/audio/thank-you.mp3" },
            { word: "Think", ipa: "/θɪŋk/", meaning: "Suy nghĩ / Tôi nghĩ", context: "Bày tỏ ý kiến cá nhân: I think so (Tôi nghĩ vậy)", audioFile: "assets/audio/think.mp3" }
          ],
          guide: "Ký hiệu /θ/ chính là chữ Theta (θ). Người Việt hay nghe nhầm thành 'Th' tiếng Việt, 'S' hoặc 'T'. Cách làm đúng: Thè nhẹ đầu lưỡi ra giữa 2 hàm răng cửa (kẹp nhẹ, không cắn), đẩy luồng gió mát trượt trên bề mặt lưỡi rồi mới phát âm. Tuyệt đối không thụt lưỡi vào trong biến thành 'Thanh-kiu'!",
          tip: "💡 Mẹo vàng: Cắn nhẹ đầu lưỡi, thổi hơi gió mát ra mu bàn tay. Lưỡi phải lộ ra ngoài răng thì mới đúng âm chuẩn người Mỹ!"
        },
        {
          sound: "/s/ (Âm xì răng khép)",
          example: "Nice, Thanks, See",
          words: [
            { word: "Nice", ipa: "/naɪs/", meaning: "Tốt đẹp / Dễ mến", context: "Lời khen ngợi: Nice to meet you", audioFile: "assets/audio/nice.mp3" },
            { word: "Thanks", ipa: "/θæŋks/", meaning: "Cảm ơn nha (thân mật)", context: "Dùng với bạn bè đồng trang lứa", audioFile: "assets/audio/thanks.mp3" },
            { word: "See", ipa: "/siː/", meaning: "Nhìn thấy / Gặp lại", context: "Gặp lại người quen: See you soon", audioFile: "assets/audio/see.mp3" }
          ],
          guide: "Khác với /θ/, âm /s/ yêu cầu lưỡi nằm hoàn toàn BÊN TRONG sau răng cửa dưới. Khép 2 hàm răng lại gần nhau, xì luồng hơi mạnh qua kẽ răng như tiếng xì lốp xe.",
          tip: "💡 Mẹo vàng: Răng khép chặt, lưỡi thụt vào trong, không thè lưỡi như âm /θ/. Mất âm đuôi /s/ giống như tiếng Việt bị mất dấu thanh."
        },
        {
          sound: "/t/ (Âm gõ bật dứt khoát)",
          example: "Meet, Great, Wait",
          words: [
            { word: "Meet", ipa: "/miːt/", meaning: "Gặp gỡ", context: "Gặp ai đó lần đầu hoặc hẹn gặp", audioFile: "assets/audio/meet.mp3" },
            { word: "Great", ipa: "/ɡreɪt/", meaning: "Tuyệt vời", context: "Cảm xúc hào hứng: Have a great day!", audioFile: "assets/audio/great.mp3" },
            { word: "Wait", ipa: "/weɪt/", meaning: "Chờ đợi", context: "Nhờ người khác nán lại: Wait a minute", audioFile: "assets/audio/wait.mp3" }
          ],
          guide: "Khác với /θ/ và /s/ (luồng hơi trượt dài), âm /t/ là âm TẮC BẬT: Đặt đầu lưỡi chạm vào phần nướu hàm trên sau răng cửa, nén hơi lại rồi bật mạnh xuống dứt khoát như tiếng gõ 'tách'.",
          tip: "💡 Mẹo vàng: Bật dứt khoát, gọn gàng, có luồng gió nhỏ bật ra làm rung tờ giấy trước miệng."
        }
      ],

      // Module 2: Mẫu câu cốt lõi & Cách nói mở rộng tình huống (Slot-Filling)
      chunks: [
        {
          phrase: "Hi, nice to meet you!",
          ipa: "/haɪ, naɪs tuː miːt juː/",
          meaning: "Chào bạn, rất vui được gặp bạn!",
          context: "Mẫu câu cốt lõi: Bắt tay làm quen người mới lần đầu tiên",
          audioFile: "assets/audio/hi-nice-to-meet-you.mp3",
          audioText: "Hi, nice to meet you!",
          type: "core",
          repetitionTarget: 7
        },
        {
          phrase: "Hi, great to meet you!",
          ipa: "/haɪ, ɡreɪt tuː miːt juː/",
          meaning: "Chào bạn, thật tuyệt khi được gặp bạn!",
          context: "Cách nói mở rộng: Tạo cảm giác nhiệt tình, hào hứng hơn",
          audioFile: "assets/audio/hi-great-to-meet-you.mp3",
          audioText: "Hi, great to meet you!",
          type: "permutation",
          repetitionTarget: 7
        },
        {
          phrase: "Good to see you again!",
          ipa: "/ɡʊd tuː siː juː əˈɡen/",
          meaning: "Rất vui được gặp lại bạn!",
          context: "Cách nói mở rộng: Khi gặp lại người quen từ lần thứ hai trở đi",
          audioFile: "assets/audio/good-to-see-you-again.mp3",
          audioText: "Good to see you again!",
          type: "permutation",
          repetitionTarget: 7
        },
        {
          phrase: "Thank you so much!",
          ipa: "/ˈθæŋk juː soʊ mʌtʃ/",
          meaning: "Cảm ơn bạn rất nhiều!",
          context: "Mẫu câu cốt lõi: Khi nhận sự giúp đỡ, nói với giọng trầm ấm",
          audioFile: "assets/audio/thank-you-so-much.mp3",
          audioText: "Thank you so much!",
          type: "core",
          repetitionTarget: 7
        },
        {
          phrase: "Thank you for your help!",
          ipa: "/ˈθæŋk juː fər jɔːr help/",
          meaning: "Cảm ơn bạn đã nhiệt tình giúp đỡ tôi!",
          context: "Cách nói mở rộng: Cụ thể hóa lời cảm ơn cho sự trợ giúp vừa nhận",
          audioFile: "assets/audio/thank-you-for-your-help.mp3",
          audioText: "Thank you for your help!",
          type: "permutation",
          repetitionTarget: 7
        },
        {
          phrase: "Thanks a lot!",
          ipa: "/θæŋks ə lɑːt/",
          meaning: "Cảm ơn nhiều nhé! (Thân mật)",
          context: "Cách nói mở rộng: Nói nhanh gọn với bạn bè đồng trang lứa",
          audioFile: "assets/audio/thanks-a-lot.mp3",
          audioText: "Thanks a lot!",
          type: "permutation",
          repetitionTarget: 7
        },
        {
          phrase: "Have a great day!",
          ipa: "/hæv ə ɡreɪt deɪ/",
          meaning: "Chúc bạn một ngày tuyệt vời nhé!",
          context: "Mẫu câu cốt lõi: Khi chào tạm biệt lúc ra về hoặc kết thúc trò chuyện",
          audioFile: "assets/audio/have-a-great-day.mp3",
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

      // Step Guide Audios: Giọng Gia Sư AI Hải Đăng thuyết minh cho từng bước
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
        ]
      },

      // Module 6: Thử thách gõ phản xạ & ghép câu (Active Recall Writing)
      typingChallenges: [
        {
          id: "tc1",
          vietnameseCue: "Chào bạn, rất vui được gặp bạn!",
          audioFile: "assets/audio/hi-nice-to-meet-you.mp3",
          audioText: "Hi, nice to meet you!",
          targetWords: ["Hi,", "nice", "to", "meet", "you!"],
          fullSentence: "Hi, nice to meet you!",
          distractorWords: ["great", "see", "day"]
        },
        {
          id: "tc2",
          vietnameseCue: "Cảm ơn bạn rất nhiều!",
          audioFile: "assets/audio/thank-you-so-much.mp3",
          audioText: "Thank you so much!",
          targetWords: ["Thank", "you", "so", "much!"],
          fullSentence: "Thank you so much!",
          distractorWords: ["for", "help", "very"]
        },
        {
          id: "tc3",
          vietnameseCue: "Chúc bạn một ngày tuyệt vời nhé!",
          audioFile: "assets/audio/have-a-great-day.mp3",
          audioText: "Have a great day!",
          targetWords: ["Have", "a", "great", "day!"],
          fullSentence: "Have a great day!",
          distractorWords: ["nice", "trip", "weekend"]
        }
      ]
    }
  ]
};
