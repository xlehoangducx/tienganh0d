// ============================================================================
// CYBER EFFECTS ENGINE: AI NEURAL VECTOR NETWORK & QUANTUM POINTER TRAIL
// Tái hiện phong cách công nghệ cao, 3D sống động từ Nexus Quant Platform
// ============================================================================

(function () {
  'use strict';

  // 1. NEURAL VECTOR NETWORK CANVAS (MẠNG NƠ-RON AI KHÔNG GIAN VECTOR)
  const neuralCanvas = document.getElementById('neuralCanvas');
  if (neuralCanvas) {
    const ctx = neuralCanvas.getContext('2d');
    let width = (neuralCanvas.width = window.innerWidth);
    let height = (neuralCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = neuralCanvas.width = window.innerWidth;
      height = neuralCanvas.height = window.innerHeight;
      initNodes();
    });

    const isMobile = window.innerWidth < 768;
    const NODE_COUNT = isMobile ? 35 : 75;
    const MAX_DIST = isMobile ? 90 : 130;
    const nodes = [];

    const mouse = { x: -9999, y: -9999, radius: 160 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2 + 1.2,
          color: Math.random() > 0.4 ? 'rgba(16, 185, 129, ' : 'rgba(6, 182, 212, '
        });
      }
    }

    initNodes();

    function animateNeural() {
      ctx.clearRect(0, 0, width, height);

      // Cập nhật vị trí nơ-ron
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Tương tác nhẹ với con trỏ chuột
        const dxMouse = mouse.x - n.x;
        const dyMouse = mouse.y - n.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius && distMouse > 0.001) {
          const force = (1 - distMouse / mouse.radius) * 0.6;
          n.x -= (dxMouse / distMouse) * force;
          n.y -= (dyMouse / distMouse) * force;
        }

        // Vẽ điểm nơ-ron
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '0.7)';
        ctx.fill();

        // Nối dây giữa các nơ-ron gần nhau (Synapse Connections)
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateNeural);
    }

    animateNeural();
  }

  // 2. QUANTUM POINTER TRAIL (HIỆU ỨNG VỆT CHUỘT PHÁT QUANG)
  const trailCanvas = document.getElementById('pointerTrailCanvas');
  if (trailCanvas && window.matchMedia('(pointer: fine)').matches) {
    const ctx = trailCanvas.getContext('2d');
    let width = (trailCanvas.width = window.innerWidth);
    let height = (trailCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = trailCanvas.width = window.innerWidth;
      height = trailCanvas.height = window.innerHeight;
    });

    const particles = [];
    const MAX_PARTICLES = 60;

    let lastX = -9999;
    let lastY = -9999;

    window.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const dist = Math.hypot(x - lastX, y - lastY);

      if (dist > 8) {
        lastX = x;
        lastY = y;
        for (let i = 0; i < 2; i++) {
          if (particles.length < MAX_PARTICLES) {
            particles.push({
              x: x + (Math.random() - 0.5) * 6,
              y: y + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 1.2,
              vy: (Math.random() - 0.5) * 1.2 - 0.3,
              size: Math.random() * 3 + 1.5,
              alpha: 0.8,
              color: Math.random() > 0.3 ? '16, 185, 129' : '6, 182, 212'
            });
          }
        }
      }
    });

    function animateTrail() {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        p.size *= 0.96;

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowColor = `rgba(${p.color}, 0.6)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(animateTrail);
    }

    animateTrail();
  }

  // 3. HIỆU ỨNG NGHIÊNG 3D CHO CÁC THẺ (INTERACTIVE 3D PERSPECTIVE TILT)
  function init3DTilt() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cards = document.querySelectorAll('.card-3d');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8; // góc nghiêng trục X
        const rotateY = ((x - centerX) / centerX) * 8;  // góc nghiêng trục Y

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // Khởi chạy 3D Tilt khi trang đã tải xong
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DTilt);
  } else {
    init3DTilt();
  }

  window.reinit3DTilt = init3DTilt;
})();
