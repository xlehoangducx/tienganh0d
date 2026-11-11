# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/dashboard.html', 'r', encoding='utf-8') as f:
    dash = f.read()

# Add ESP License Key Manager panel in adminView
admin_panel_marker = '<!-- ================= VIEW 2: QUẢN TRỊ ADMIN (DUYỆT USER) ================= -->\n      <div id="adminView" class="hidden space-y-6">'

new_admin_panel = '''<!-- ================= VIEW 2: QUẢN TRỊ ADMIN (DUYỆT USER) ================= -->
      <div id="adminView" class="hidden space-y-6">
        
        <!-- ESP LICENSE KEY MANAGER (CẤP KEY CHUYÊN NGÀNH THEO GMAIL) -->
        <div class="cyber-card p-6 rounded-2xl border-purple-500/40 bg-gradient-to-b from-purple-950/20 to-slate-900/60 shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
                <i data-lucide="key" class="w-6 h-6"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Quản Lý & Cấp License Key Chuyên Ngành (ESP Manager)</h3>
                <p class="text-xs text-purple-300/80 mt-0.5">Tạo Key bản quyền cấp riêng cho từng Gmail học viên để mở khóa đúng chuyên ngành đó</p>
              </div>
            </div>
          </div>

          <!-- Form cấp Key -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Gmail Học Viên Được Cấp:</label>
              <input type="email" id="adminStudentEmail" placeholder="student@gmail.com" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-400 font-mono">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Chọn Chuyên Ngành Muốn Mở:</label>
              <select id="adminStudentField" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-400 cursor-pointer">
                <option value="it">💻 CNTT & Kỹ Sư Phần Mềm (IT)</option>
                <option value="medical">🩺 Y Khoa & Điều Dưỡng (Healthcare)</option>
                <option value="business">📊 Kinh Doanh & Đàm Phán (Business)</option>
                <option value="tourism">✈️ Khách Sạn & Du Lịch (Tourism)</option>
                <option value="logistics">🚢 Xuất Nhập Khẩu & Logistics (Logistics)</option>
              </select>
            </div>
            <div class="flex items-end">
              <button onclick="handleAdminGenerateEspKey()" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-purple-900/40 flex items-center justify-center space-x-1.5 cursor-pointer">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>Sinh Mã & Cấp Key</span>
              </button>
            </div>
          </div>

          <!-- Bảng các Key đã cấp -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="text-xs uppercase bg-slate-800/80 text-slate-400">
                <tr>
                  <th class="px-4 py-3 rounded-l-lg">Gmail Học Viên</th>
                  <th class="px-4 py-3">Chuyên Ngành</th>
                  <th class="px-4 py-3 font-mono">Mã License Key</th>
                  <th class="px-4 py-3">Ngày Cấp</th>
                  <th class="px-4 py-3 text-right rounded-r-lg">Hành Động</th>
                </tr>
              </thead>
              <tbody id="espKeysTableBody" class="divide-y divide-slate-800 text-xs">
                <tr>
                  <td colspan="5" class="px-4 py-4 text-center text-slate-500">Chưa có License Key nào được sinh.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>'''

if admin_panel_marker in dash:
    dash = dash.replace(admin_panel_marker, new_admin_panel)
    print("Added ESP License Manager to adminView in dashboard.html!")
else:
    print("admin_panel_marker not found in dashboard.html")

with open('d:/WEB_HOC_TIENG_ANH_AI/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(dash)

# Now update app.js to include handleAdminGenerateEspKey and renderAdminEspKeysTable
with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

esp_js_code = '''
// ==============================================================
// 15. QUẢN LÝ LICENSE KEY CHUYÊN NGÀNH (ESP LICENSE MANAGER)
// ==============================================================
window.handleAdminGenerateEspKey = function() {
  const email = document.getElementById("adminStudentEmail")?.value.trim().toLowerCase();
  const field = document.getElementById("adminStudentField")?.value;
  if (!email || !field) {
    alert("⚠️ Vui lòng nhập đầy đủ Gmail của học viên!");
    return;
  }

  const rand1 = Math.floor(1000 + Math.random() * 9000);
  const rand2 = Math.floor(1000 + Math.random() * 9000);
  const key = `KEY-${field.toUpperCase()}-${rand1}-${rand2}`;
  const now = new Date().toLocaleDateString('vi-VN');

  let keys = [];
  try {
    keys = JSON.parse(localStorage.getItem("tienganh0d_esp_keys") || "[]");
  } catch (e) {}

  keys.unshift({
    email: email,
    field: field,
    key: key,
    createdAt: now,
    status: 'active'
  });

  localStorage.setItem("tienganh0d_esp_keys", JSON.stringify(keys));
  window.renderAdminEspKeysTable();
  alert(`🎉 Đã cấp License Key thành công cho ${email}!\\nMã Key: ${key}\\nChuyên ngành: ${field.toUpperCase()}`);
};

window.renderAdminEspKeysTable = function() {
  const tbody = document.getElementById("espKeysTableBody");
  if (!tbody) return;
  let keys = [];
  try {
    keys = JSON.parse(localStorage.getItem("tienganh0d_esp_keys") || "[]");
  } catch (e) {}

  if (keys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-4 text-center text-slate-500">Chưa có License Key nào được sinh.</td></tr>`;
    return;
  }

  tbody.innerHTML = keys.map((k) => `
    <tr class="hover:bg-slate-900/60 transition">
      <td class="px-4 py-3 font-semibold text-white">${k.email}</td>
      <td class="px-4 py-3 text-cyan-300 font-bold uppercase">${k.field}</td>
      <td class="px-4 py-3 font-mono font-bold text-amber-300">${k.key}</td>
      <td class="px-4 py-3 text-slate-400">${k.createdAt || ''}</td>
      <td class="px-4 py-3 text-right">
        <button onclick="navigator.clipboard.writeText('${k.key}'); alert('Đã sao chép mã Key: ${k.key}');" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold transition cursor-pointer">
          Sao Chép
        </button>
      </td>
    </tr>
  `).join("");
  if (window.lucide) window.lucide.createIcons();
};
'''

# Add esp_js_code and hook into loadAdminStudents
if 'renderAdminEspKeysTable' not in app_js:
    app_js += esp_js_code
    app_js = app_js.replace('function loadAdminStudents() {', 'function loadAdminStudents() {\n  window.renderAdminEspKeysTable();')
    print("Appended ESP logic to app.js!")

with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Done updating dashboard.html and app.js!")
