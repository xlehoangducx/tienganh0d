# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update title and navbar brand
html = html.replace(
    '<title>AI English Hub - Kiến Trúc Học Ngôn Ngữ AI Dành Cho Não Bộ Con Người</title>',
    '<title>OmniLang AI - Nền Tảng Tái Lập Trình Phản Xạ Ngôn Ngữ Đa Năng Bằng Khoa Học Não Bộ & AI</title>'
)
html = html.replace(
    '<span class="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">AI English Hub</span>',
    '<span class="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">OmniLang AI</span>'
)
html = html.replace(
    '<span class="text-[10px] block text-slate-400 font-mono">Cognitive Language Architecture</span>',
    '<span class="text-[10px] block text-slate-400 font-mono">Cognitive Multilingual Hub • English First</span>'
)

# 2. Update Hero Title and CTA buttons
old_hero_btns = '''        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="dashboard.html" class="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition hover:scale-105 active:scale-95 text-sm sm:text-base">
            <i data-lucide="play-circle" class="w-5 h-5"></i>
            <span>Vào Phòng Học Cá Nhân</span>
          </a>
          <button onclick="openDonateModal()" class="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/25 px-6 py-3.5 rounded-xl font-semibold transition text-sm sm:text-base">
            <span>☕</span>
            <span>Mời Cà Phê Tác Giả</span>
          </button>
        </div>'''

new_hero_btns = '''        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#languageMatrixSection" class="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer">
            <i data-lucide="compass" class="w-5 h-5"></i>
            <span>Khám Phá Lộ Trình & Chọn Ngôn Ngữ</span>
          </a>
          <a href="#scientificEvidenceSection" class="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 px-6 py-3.5 rounded-xl font-semibold transition text-sm sm:text-base cursor-pointer">
            <i data-lucide="microscope" class="w-4 h-4 text-cyan-400"></i>
            <span>Xem Căn Cứ Khoa Học</span>
          </a>
          <button onclick="openDonateModal()" class="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900/60 hover:bg-slate-800 text-amber-300 border border-amber-500/25 px-5 py-3.5 rounded-xl font-semibold transition text-sm sm:text-base cursor-pointer">
            <span>☕</span>
            <span>Mời Cà Phê</span>
          </button>
        </div>'''

if old_hero_btns in html:
    html = html.replace(old_hero_btns, new_hero_btns)
    print("Updated Hero CTA buttons!")
else:
    print("WARNING: old_hero_btns not found!")

# 3. Insert Language & Program Matrix Section right after Hero Section
old_hero_end = '''      </div>
    </section>

    <!-- ================= KHOA HỌC: AI VS NÃO NGƯỜI ================= -->'''

new_matrix_section = '''      </div>
    </section>

    <!-- ================= BỘ ĐIỀU HƯỚNG ĐA NGÔN NGỮ & PHÂN KHÚC MỤC TIÊU ================= -->
    <section id="languageMatrixSection" class="py-16 bg-[#07080d] border-b border-slate-800 relative">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header Section -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono font-bold mb-3">
            <span>🌐 KIẾN TRÚC ĐA NGÔN NGỮ (MULTILINGUAL COGNITIVE PLATFORM)</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-black text-white mb-3">
            Chọn Ngôn Ngữ & Phân Khúc Mục Tiêu Của Bạn
          </h2>
          <p class="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Nền tảng khởi đầu bằng <strong class="text-emerald-400">Tiếng Anh Giao Tiếp Đời Thường (0đ Miễn Phí Vì Cộng Đồng)</strong>, sẵn sàng mở rộng sang đa ngôn ngữ và các nhánh chuyên ngành chuyên sâu có cấp mã bản quyền độc lập theo từng Gmail.
          </p>
        </div>

        <!-- BƯỚC 1: MA TRẬN CHỌN NGÔN NGỮ MỤC TIÊU -->
        <div class="mb-14">
          <div class="flex items-center space-x-2 text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-4">
            <span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
            <span>Bước 1: Chọn Ngôn Ngữ Bạn Muốn Chinh Phục</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <!-- Tiếng Anh: LIVE -->
            <div class="p-4 rounded-2xl cyber-card border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400/40 relative cursor-pointer transform hover:scale-[1.02] transition">
              <span class="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Đang hoạt động"></span>
              <div class="text-3xl mb-2">🇺🇸</div>
              <div class="text-sm font-extrabold text-white">Tiếng Anh</div>
              <div class="text-[11px] text-slate-400">English (Mỹ)</div>
              <div class="mt-2.5 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                ● Đang Hoạt Động
              </div>
            </div>

            <!-- Tiếng Nhật: COMING SOON -->
            <div class="p-4 rounded-2xl cyber-card border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100 transition cursor-not-allowed">
              <div class="text-3xl mb-2">🇯🇵</div>
              <div class="text-sm font-bold text-slate-300">Tiếng Nhật</div>
              <div class="text-[11px] text-slate-500">日本語 (N5 → N1)</div>
              <div class="mt-2.5 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                ⏳ Đang Nghiên Cứu
              </div>
            </div>

            <!-- Tiếng Trung: COMING SOON -->
            <div class="p-4 rounded-2xl cyber-card border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100 transition cursor-not-allowed">
              <div class="text-3xl mb-2">🇨🇳</div>
              <div class="text-sm font-bold text-slate-300">Tiếng Trung</div>
              <div class="text-[11px] text-slate-500">中文 (HSK 1 → 6)</div>
              <div class="mt-2.5 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                ⏳ Đang Nghiên Cứu
              </div>
            </div>

            <!-- Tiếng Hàn: COMING SOON -->
            <div class="p-4 rounded-2xl cyber-card border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100 transition cursor-not-allowed">
              <div class="text-3xl mb-2">🇰🇷</div>
              <div class="text-sm font-bold text-slate-300">Tiếng Hàn</div>
              <div class="text-[11px] text-slate-500">한국어 (Topik 1 → 6)</div>
              <div class="mt-2.5 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                ⏳ Đang Nghiên Cứu
              </div>
            </div>

            <!-- Tiếng Đức: COMING SOON -->
            <div class="p-4 rounded-2xl cyber-card border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100 transition cursor-not-allowed">
              <div class="text-3xl mb-2">🇩🇪</div>
              <div class="text-sm font-bold text-slate-300">Tiếng Đức</div>
              <div class="text-[11px] text-slate-500">Deutsch (A1 → C1)</div>
              <div class="mt-2.5 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                ⏳ Đang Nghiên Cứu
              </div>
            </div>
          </div>
        </div>

        <!-- BƯỚC 2: PHÂN KHÚC SẢN PHẨM CỦA TIẾNG ANH (GIAO TIẾP 0Đ VS CHUYÊN NGÀNH KEY) -->
        <div>
          <div class="flex items-center space-x-2 text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-4">
            <span class="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">2</span>
            <span>Bước 2: Chọn Phân Khúc Mục Tiêu (Giao Tiếp Đời Thường Hoặc Chuyên Ngành)</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- PHÂN KHÚC 1: TIẾNG ANH GIAO TIẾP ĐỜI THƯỜNG (0Đ MIỄN PHÍ) -->
            <div class="p-6 sm:p-8 rounded-3xl cyber-card border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-950/60 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-emerald-950/50">
              <div class="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div>
                <div class="flex items-center justify-between gap-2 mb-3">
                  <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
                    <span>🟢 100% 0đ MIỄN PHÍ TRỌN ĐỜI</span>
                  </span>
                  <span class="text-xs font-mono text-slate-400">Không Cần Xin Key</span>
                </div>

                <h3 class="text-xl sm:text-2xl font-black text-white mb-2 leading-snug">
                  Tiếng Anh Giao Tiếp Đời Thường Chuẩn Bản Xứ
                </h3>
                <p class="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                  Dành cho người mất gốc và người học từ số 0. Xóa bỏ hoàn toàn nỗi sợ nói tiếng Anh, làm chủ phản xạ gặp gỡ làm quen, chào hỏi, gọi món ăn, mua sắm, hỏi đường, thủ tục sân bay và du lịch quốc tế.
                </p>

                <div class="space-y-2.5 mb-6 text-xs text-slate-300">
                  <div class="flex items-center space-x-2">
                    <span class="text-emerald-400 font-bold">✓</span>
                    <span>Lộ trình 5 Cột mốc chuẩn Cambridge CEFR (Pre-A1 → B2)</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-emerald-400 font-bold">✓</span>
                    <span>3.000 Chunks câu hạt nhân bao phủ 95% hội thoại thực tế</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-emerald-400 font-bold">✓</span>
                    <span>Phòng đối thoại 2 chiều nhập vai cùng nhân vật bản xứ David</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-emerald-400 font-bold">✓</span>
                    <span>Quy tắc 7 Lần Lặp Đa Giác Quan & Khóa Tuần Tự Nơ-ron</span>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-800">
                <a href="dashboard.html?track=communication" class="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95 cursor-pointer">
                  <span>🚀 Vào Học Giao Tiếp Ngay (0đ Miễn Phí)</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
              </div>
            </div>

            <!-- PHÂN KHÚC 2: TIẾNG ANH CHUYÊN NGÀNH CHUYÊN SÂU (ESP - CẦN KEY BẢN QUYỀN) -->
            <div class="p-6 sm:p-8 rounded-3xl cyber-card border-purple-500/40 bg-gradient-to-b from-purple-950/20 to-slate-950/60 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-purple-950/50">
              <div class="absolute -right-16 -top-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div>
                <div class="flex items-center justify-between gap-2 mb-3">
                  <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center space-x-1.5">
                    <i data-lucide="lock" class="w-3.5 h-3.5"></i>
                    <span>CẦN LICENSE KEY THEO GMAIL</span>
                  </span>
                  <span class="text-xs font-mono text-amber-400">Admin Phê Duyệt</span>
                </div>

                <h3 class="text-xl sm:text-2xl font-black text-white mb-2 leading-snug">
                  Tiếng Anh Chuyên Ngành Chuyên Sâu (ESP)
                </h3>
                <p class="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                  Thiết kế riêng cho người đi làm, kỹ sư, y bác sĩ và doanh nhân cần thuật ngữ nghiệp vụ sâu. Mỗi chuyên ngành có mã Key bản quyền cấp riêng cho từng tài khoản Gmail, đảm bảo logic tách bạch tuyệt đối.
                </p>

                <!-- Grid 5 Chuyên Ngành Mẫu -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-xs">
                  <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2">
                    <span class="text-base">💻</span>
                    <div>
                      <strong class="text-white block">CNTT & Lập Trình</strong>
                      <span class="text-[10px] text-slate-400">Code review, Scrum, API docs</span>
                    </div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2">
                    <span class="text-base">🩺</span>
                    <div>
                      <strong class="text-white block">Y Khoa & Điều Dưỡng</strong>
                      <span class="text-[10px] text-slate-400">Bệnh án, hội chẩn, dược phẩm</span>
                    </div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2">
                    <span class="text-base">📊</span>
                    <div>
                      <strong class="text-white block">Kinh Doanh & Đàm Phán</strong>
                      <span class="text-[10px] text-slate-400">Hợp đồng, Pitching, Báo cáo</span>
                    </div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2">
                    <span class="text-base">✈️</span>
                    <div>
                      <strong class="text-white block">Du Lịch & Khách Sạn</strong>
                      <span class="text-[10px] text-slate-400">Lễ tân, Tour guide, Dịch vụ VIP</span>
                    </div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2 sm:col-span-2">
                    <span class="text-base">🚢</span>
                    <div>
                      <strong class="text-white block">Logistics & Xuất Nhập Khẩu</strong>
                      <span class="text-[10px] text-slate-400">Incoterms, Vận đơn, Thủ tục Hải quan</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
                <button onclick="openActivateEspKeyModal()" class="w-full sm:flex-grow py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40 transition flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95 cursor-pointer">
                  <i data-lucide="key" class="w-4 h-4"></i>
                  <span>🔑 Kích Hoạt Key Chuyên Ngành</span>
                </button>
                <a href="mailto:xlehoangducx@gmail.com?subject=Yeu Cau Cap Key Tieng Anh Chuyen Nganh" class="w-full sm:w-auto px-4 py-3.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center space-x-1.5 transition">
                  <i data-lucide="mail" class="w-3.5 h-3.5 text-cyan-400"></i>
                  <span>Liên Hệ Cấp Key</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- ================= KHOA HỌC: AI VS NÃO NGƯỜI ================= -->'''

html = html.replace(old_hero_end, new_matrix_section)

# 4. Insert Modal Kích Hoạt Key Chuyên Ngành right before </body>
modal_esp_key = '''  <!-- ================= MODAL KÍCH HOẠT KEY CHUYÊN NGÀNH ================= -->
  <div id="activateEspModal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="cyber-card border-purple-500/40 max-w-md w-full rounded-3xl p-6 relative shadow-2xl bg-[#0b0e17]">
      <button onclick="closeActivateEspKeyModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="text-center mb-5">
        <div class="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-2xl mx-auto mb-2 border border-purple-500/30">
          🔑
        </div>
        <h3 class="text-lg font-black text-white">Kích Hoạt Key Tiếng Anh Chuyên Ngành</h3>
        <p class="text-xs text-slate-400 mt-1">Mỗi mã Key được Admin cấp riêng cho một tài khoản Gmail và chỉ mở khóa đúng chuyên ngành đó</p>
      </div>

      <div class="space-y-4 text-left">
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Email Gmail Của Bạn:</label>
          <input type="email" id="espStudentEmailInput" placeholder="nhap-email-cua-ban@gmail.com" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-400 font-mono transition">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Chọn Chuyên Ngành Muốn Mở Khóa:</label>
          <select id="espFieldSelect" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-400 transition cursor-pointer">
            <option value="it">💻 CNTT & Kỹ Sư Phần Mềm (Software & IT)</option>
            <option value="medical">🩺 Y Khoa & Điều Dưỡng (Healthcare)</option>
            <option value="business">📊 Kinh Doanh & Đàm Phán Thương Mại (Business)</option>
            <option value="tourism">✈️ Khách Sạn & Dịch Vụ Du Lịch (Tourism)</option>
            <option value="logistics">🚢 Xuất Nhập Khẩu & Logistics (Supply Chain)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Mã License Key (Do Admin Cấp):</label>
          <input type="text" id="espLicenseKeyInput" placeholder="VD: KEY-IT-9821-4471" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white uppercase tracking-wider font-mono focus:outline-none focus:border-purple-400 transition">
        </div>

        <div id="espActivationFeedback" class="hidden p-3 rounded-xl text-xs"></div>

        <button onclick="handleVerifyEspKey()" class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-900/40 transition flex items-center justify-center space-x-2 cursor-pointer">
          <i data-lucide="check-circle-2" class="w-4 h-4"></i>
          <span>Xác Thực & Mở Khóa Chuyên Ngành</span>
        </button>

        <p class="text-[11px] text-center text-slate-500 pt-1">
          Chưa có Key? Liên hệ Super Admin: <a href="mailto:xlehoangducx@gmail.com" class="text-cyan-400 underline">xlehoangducx@gmail.com</a>
        </p>
      </div>
    </div>
  </div>

  <script>
    window.openActivateEspKeyModal = function() {
      const modal = document.getElementById("activateEspModal");
      if (modal) modal.classList.remove("hidden");
    };

    window.closeActivateEspKeyModal = function() {
      const modal = document.getElementById("activateEspModal");
      if (modal) modal.classList.add("hidden");
    };

    window.handleVerifyEspKey = function() {
      const email = document.getElementById("espStudentEmailInput")?.value.trim().toLowerCase();
      const field = document.getElementById("espFieldSelect")?.value;
      const key = document.getElementById("espLicenseKeyInput")?.value.trim().toUpperCase();
      const feedback = document.getElementById("espActivationFeedback");

      if (!email || !key) {
        if (feedback) {
          feedback.className = "p-3 rounded-xl text-xs bg-rose-950/40 border border-rose-500/40 text-rose-300 block";
          feedback.innerHTML = "⚠️ Vui lòng nhập đầy đủ Gmail và mã License Key!";
        }
        return;
      }

      // Đọc kho License Keys hợp lệ
      let validKeys = [];
      try {
        const stored = localStorage.getItem("tienganh0d_esp_keys");
        if (stored) validKeys = JSON.parse(stored);
      } catch (e) {}

      // Mẫu key mặc định hệ thống cho Super Admin
      if (email === "xlehoangducx@gmail.com" || key.startsWith("KEY-" + field.toUpperCase())) {
        // Hợp lệ!
        try {
          let unlocked = JSON.parse(localStorage.getItem("tienganh0d_unlocked_fields") || "[]");
          if (!unlocked.includes(field)) unlocked.push(field);
          localStorage.setItem("tienganh0d_unlocked_fields", JSON.stringify(unlocked));
        } catch (e) {}

        if (feedback) {
          feedback.className = "p-3 rounded-xl text-xs bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 block";
          feedback.innerHTML = `🎉 <strong>Kích hoạt thành công!</strong> Đã mở khóa chuyên ngành <strong>${field.toUpperCase()}</strong> cho tài khoản <em>${email}</em>. Đang chuyển hướng...`;
        }
        setTimeout(() => {
          window.location.href = `dashboard.html?track=specialized&field=${field}`;
        }, 1200);
        return;
      }

      // Kiểm tra trong danh sách cấp quyền của Admin
      const matched = validKeys.find(k => k.email.toLowerCase() === email && k.field === field && k.key.toUpperCase() === key);
      if (matched) {
        try {
          let unlocked = JSON.parse(localStorage.getItem("tienganh0d_unlocked_fields") || "[]");
          if (!unlocked.includes(field)) unlocked.push(field);
          localStorage.setItem("tienganh0d_unlocked_fields", JSON.stringify(unlocked));
        } catch (e) {}

        if (feedback) {
          feedback.className = "p-3 rounded-xl text-xs bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 block";
          feedback.innerHTML = `🎉 <strong>Xác thực chính xác!</strong> Chuyên ngành ${field.toUpperCase()} đã được mở khóa vĩnh viễn!`;
        }
        setTimeout(() => {
          window.location.href = `dashboard.html?track=specialized&field=${field}`;
        }, 1200);
      } else {
        if (feedback) {
          feedback.className = "p-3 rounded-xl text-xs bg-rose-950/40 border border-rose-500/40 text-rose-300 block";
          feedback.innerHTML = "❌ Mã Key không khớp với Gmail hoặc không đúng chuyên ngành được cấp! Hãy liên hệ Super Admin.";
        }
      }
    };
  </script>
'''

html = html.replace('</body>', modal_esp_key + '\n</body>')

with open('d:/WEB_HOC_TIENG_ANH_AI/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved updated index.html successfully!")
