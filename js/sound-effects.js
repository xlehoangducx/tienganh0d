// HIỆU ỨNG ÂM THANH TRÒ CHƠI HỌC TẬP (WEB AUDIO API 0Đ - CHẠY TỨC THÌ KHÔNG CẦN TẢI FILE)

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Âm thanh KHI TRẢ LỜI ĐÚNG (Tiếng chuông ngân vang vui tai, hào hứng)
export function playCorrectSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Hợp âm Đô trưởng vui tươi)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // Âm sắc ấm, êm tai
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  } catch (err) {
    console.warn("Không phát được âm thanh đúng:", err);
  }
}

// 2. Âm thanh KHI CHƯA ĐÚNG (Âm trầm nhẹ nhàng, mang tính khích lệ, không gây khó chịu)
export function playIncorrectSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (err) {
    console.warn("Không phát được âm thanh sai:", err);
  }
}

// 3. Âm thanh HOÀN THÀNH BÀI HỌC (Fanfare chúc mừng chiến thắng)
export function playVictorySound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Điệp khúc chiến thắng
    const chords = [
      { f: 523.25, t: 0.0 },
      { f: 659.25, t: 0.1 },
      { f: 783.99, t: 0.2 },
      { f: 1046.50, t: 0.35 }
    ];

    chords.forEach(c => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(c.f, now + c.t);

      gain.gain.setValueAtTime(0, now + c.t);
      gain.gain.linearRampToValueAtTime(0.3, now + c.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + c.t);
      osc.stop(now + c.t + 0.55);
    });
  } catch (err) {
    console.warn("Lỗi phát victory sound:", err);
  }
}

// 4. Âm thanh Click nhẹ khi chạm vào nút hoặc lật thẻ
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (err) {}
}
