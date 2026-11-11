# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

track_func = '''
// ==============================================================
// 14.5. KIỂM SOÁT PHÂN KHÚC LỘ TRÌNH (TRACK & ESP LICENSE)
// ==============================================================
function initDashboardTrack() {
  const urlParams = new URLSearchParams(window.location.search);
  const track = urlParams.get('track');
  const field = urlParams.get('field');

  const iconBadge = document.getElementById('trackIconBadge');
  const titleBadge = document.getElementById('trackTitleBadge');
  const subBadge = document.getElementById('trackSubBadge');

  if (track === 'specialized' && field) {
    const fieldNames = {
      it: 'CNTT & Kỹ Sư Phần Mềm (IT)',
      medical: 'Y Khoa & Điều Dưỡng (Healthcare)',
      business: 'Kinh Doanh & Đàm Phán (Business)',
      tourism: 'Khách Sạn & Du Lịch (Tourism)',
      logistics: 'Xuất Nhập Khẩu & Logistics (Logistics)'
    };
    const fieldName = fieldNames[field] || field.toUpperCase();
    
    let unlocked = [];
    try {
      unlocked = JSON.parse(localStorage.getItem('tienganh0d_unlocked_fields') || '[]');
    } catch(e) {}

    const isUnlocked = unlocked.includes(field);

    if (iconBadge) {
      iconBadge.textContent = '💼';
      iconBadge.className = 'w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-base border border-purple-500/30';
    }
    if (titleBadge) {
      if (isUnlocked) {
        titleBadge.innerHTML = `<span>Chuyên Ngành: ${fieldName}</span><span class="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-mono font-bold">ĐÃ MỞ KHÓA BẢN QUYỀN</span>`;
      } else {
        titleBadge.innerHTML = `<span>Chuyên Ngành: ${fieldName}</span><span class="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold">CHƯA KÍCH HOẠT KEY</span>`;
      }
    }
    if (subBadge) {
      if (isUnlocked) {
        subBadge.innerHTML = `License Key hợp lệ • Chương trình tiếng Anh nghề nghiệp chuyên sâu đang được đồng bộ bài học`;
      } else {
        subBadge.innerHTML = `⚠️ Chuyên ngành này cần mã License Key do Admin cấp riêng cho Gmail của bạn. <a href="index.html#languageMatrixSection" class="text-cyan-400 underline">Kích hoạt ngay</a>`;
      }
    }
  }
}
'''

marker = '// 15. BOOTSTRAP HỆ THỐNG'
if 'function initDashboardTrack()' not in app_js:
    app_js = app_js.replace(marker, track_func + '\n// 15. BOOTSTRAP HỆ THỐNG\ninitDashboardTrack();')
    print('Inserted initDashboardTrack() into app.js!')

with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
