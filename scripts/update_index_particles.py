# -*- coding: utf-8 -*-
import re

with open('d:/WEB_HOC_TIENG_ANH_AI/index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# 1. Xóa bỏ hoàn toàn khối tĩnh floating-badge cũ
idx = re.sub(r'<!-- FLOATING LANGUAGE TAGS \(LEFT & RIGHT\) -->.*?</div>\s*</div>\s*</div>', '', idx, flags=re.DOTALL)
print("Cleaned up old static floating tags!")

# 2. Thêm CSS cho Dynamic Multilingual Particles & Scroll-Reveal
enhanced_styles = '''  <style>
    /* Scroll-reveal smooth animations */
    .reveal-on-scroll {
      opacity: 0;
      transform: translateY(35px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .reveal-on-scroll.is-revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    
    /* Multilingual Dynamic Floating Particle Pills */
    .lang-float-pill {
      position: fixed;
      pointer-events: none;
      user-select: none;
      z-index: 15;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      backdrop-filter: blur(8px);
      border-width: 1px;
      white-space: nowrap;
      transition: opacity 1.2s ease, transform 12s cubic-bezier(0.1, 0.3, 0.2, 1);
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 15px -3px rgba(16, 185, 129, 0.2);
    }
  </style>
</head>'''

if '</head>' in idx and 'lang-float-pill' not in idx:
    idx = idx.replace('</head>', enhanced_styles)

# 3. Thêm container cho multilingual floating particles và script điều khiển
particles_script = '''
  <!-- DYNAMIC MULTILINGUAL FLOATING PARTICLES CONTAINER -->
  <div id="multilingualParticlesContainer" class="fixed inset-0 pointer-events-none z-20 overflow-hidden"></div>

  <script>
    // 1. DYNAMIC MULTILINGUAL FLOATING PARTICLES (Bay lơ lửng, đổi góc, xuất hiện & biến mất)
    (function initMultilingualFloatingTags() {
      const container = document.getElementById("multilingualParticlesContainer");
      if (!container) return;

      const languages = [
        { name: "English 🇺🇸", color: "border-emerald-500/40 text-emerald-300 bg-slate-900/80" },
        { name: "Tiếng Việt 🇻🇳", color: "border-cyan-500/40 text-cyan-300 bg-slate-900/80" },
        { name: "日本語 🇯🇵", color: "border-purple-500/40 text-purple-300 bg-slate-900/80" },
        { name: "中文 🇨🇳", color: "border-amber-500/40 text-amber-300 bg-slate-900/80" },
        { name: "한국어 🇰🇷", color: "border-rose-500/40 text-rose-300 bg-slate-900/80" },
        { name: "Deutsch 🇩🇪", color: "border-teal-500/40 text-teal-300 bg-slate-900/80" },
        { name: "Français 🇫🇷", color: "border-blue-500/40 text-blue-300 bg-slate-900/80" },
        { name: "Español 🇪🇸", color: "border-orange-500/40 text-orange-300 bg-slate-900/80" },
        { name: "Italiano 🇮🇹", color: "border-emerald-400/40 text-emerald-200 bg-slate-900/80" },
        { name: "British English 🇬🇧", color: "border-indigo-500/40 text-indigo-300 bg-slate-900/80" }
      ];

      function spawnParticle() {
        const lang = languages[Math.floor(Math.random() * languages.length)];
        const pill = document.createElement("div");
        pill.className = `lang-float-pill ${lang.color}`;
        pill.innerHTML = `<span>${lang.name}</span>`;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const type = Math.floor(Math.random() * 4);

        let startX, startY, endX, endY;

        if (type === 0) {
          // Bottom drifting up
          startX = Math.random() * (vw - 120);
          startY = vh + 20;
          endX = startX + (Math.random() * 120 - 60);
          endY = -60;
        } else if (type === 1) {
          // Top drifting down
          startX = Math.random() * (vw - 120);
          startY = -60;
          endX = startX + (Math.random() * 120 - 60);
          endY = vh + 60;
        } else if (type === 2) {
          // Left drifting right
          startX = -120;
          startY = Math.random() * (vh - 100) + 50;
          endX = vw + 60;
          endY = startY + (Math.random() * 120 - 60);
        } else {
          // Right drifting left
          startX = vw + 30;
          startY = Math.random() * (vh - 100) + 50;
          endX = -130;
          endY = startY + (Math.random() * 120 - 60);
        }

        pill.style.left = `${startX}px`;
        pill.style.top = `${startY}px`;
        pill.style.opacity = "0";
        pill.style.transform = `scale(0.8) rotate(${(Math.random() - 0.5) * 15}deg)`;

        container.appendChild(pill);

        requestAnimationFrame(() => {
          pill.style.opacity = "0.85";
          const duration = 9000 + Math.random() * 5000;
          pill.style.transition = `opacity 1.5s ease, transform ${duration}ms cubic-bezier(0.1, 0.2, 0.2, 1)`;
          pill.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(1) rotate(${(Math.random() - 0.5) * 20}deg)`;

          setTimeout(() => {
            pill.style.opacity = "0";
          }, duration - 1800);

          setTimeout(() => {
            if (pill.parentNode) pill.parentNode.removeChild(pill);
          }, duration);
        });
      }

      for (let i = 0; i < 7; i++) {
        setTimeout(spawnParticle, i * 600);
      }
      setInterval(spawnParticle, 2000);
    })();

    // 2. SCROLL REVEAL OBSERVER (Hiệu ứng thẻ lướt xuất hiện khi cuộn trang)
    (function initScrollReveal() {
      const cards = document.querySelectorAll(".cyber-card, section h2, .grid > div");
      cards.forEach(el => el.classList.add("reveal-on-scroll"));

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px"
      });

      cards.forEach(el => observer.observe(el));
    })();
  </script>
</body>'''

if '</body>' in idx and 'multilingualParticlesContainer' not in idx:
    idx = idx.replace('</body>', particles_script)
    print("Added Multilingual Floating Particles & Scroll-Reveal to index.html!")

with open('d:/WEB_HOC_TIENG_ANH_AI/index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

print("index.html updated successfully!")
