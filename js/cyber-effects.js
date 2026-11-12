// ============================================================================
// CYBER EFFECTS ENGINE: LIVING SHADER MESH GRADIENT & NEURAL VECTOR NETWORK
// Tích hợp Shader Gradient (React Bits / Magic UI) & Tương tác ánh sáng 60fps
// ============================================================================

(function () {
  'use strict';

  // 1. LIVING SHADER MESH GRADIENT & NEURAL VECTOR CANVAS
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
    const NODE_COUNT = isMobile ? 30 : 65;
    const MAX_DIST = isMobile ? 85 : 125;
    const nodes = [];

    const mouse = { x: -9999, y: -9999, radius: 150 };

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
          vx: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.6),
          vy: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.6),
          radius: Math.random() * 1.8 + 0.8,
          alpha: Math.random() * 0.5 + 0.25,
          color: Math.random() > 0.4 ? '#10b981' : '#06b6d4'
        });
      }
    }

    initNodes();

    let startTime = performance.now();

    function render() {
      const now = performance.now();
      const time = (now - startTime) * 0.00045;

      // 1.1. LIVING SHADER MESH GRADIENT (SHADER GRADIENT BACKGROUND)
      ctx.fillStyle = '#07080d';
      ctx.fillRect(0, 0, width, height);

      // Gradient 1: Emerald Aura
      const g1x = width * 0.25 + Math.sin(time) * 110;
      const g1y = height * 0.25 + Math.cos(time * 0.8) * 80;
      const rad1 = Math.max(width, height) * 0.42;
      const grad1 = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, rad1);
      grad1.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
      grad1.addColorStop(1, 'rgba(7, 8, 13, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Gradient 2: Cyan Plasma
      const g2x = width * 0.78 + Math.cos(time * 0.9) * 130;
      const g2y = height * 0.65 + Math.sin(time * 1.1) * 100;
      const rad2 = Math.max(width, height) * 0.48;
      const grad2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, rad2);
      grad2.addColorStop(0, 'rgba(6, 182, 212, 0.10)');
      grad2.addColorStop(1, 'rgba(7, 8, 13, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Gradient 3: Indigo / Violet Glow
      const g3x = width * 0.5 + Math.sin(time * 1.2) * 90;
      const g3y = height * 0.88 + Math.cos(time * 0.7) * 70;
      const rad3 = Math.max(width, height) * 0.38;
      const grad3 = ctx.createRadialGradient(g3x, g3y, 0, g3x, g3y, rad3);
      grad3.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      grad3.addColorStop(1, 'rgba(7, 8, 13, 0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // 1.2. NEURAL NETWORK PARTICLES & SYNAPTIC CONNECTIONS
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.8;
          node.x -= (dx / dist) * force * 3;
          node.y -= (dy / dist) * force * 3;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.alpha;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const ndx = node.x - other.x;
          const ndy = node.y - other.y;
          const nDist = Math.sqrt(ndx * ndx + ndy * ndy);

          if (nDist < MAX_DIST) {
            const edgeAlpha = (1 - nDist / MAX_DIST) * 0.22;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = '#10b981';
            ctx.globalAlpha = edgeAlpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(render);
    }

    render();
  }

  // 2. QUANTUM POINTER TRAIL (ÁNH SÁNG THEO DẤU CHUỘT)
  const trailCanvas = document.getElementById('pointerTrailCanvas');
  if (trailCanvas && window.innerWidth >= 768) {
    const tCtx = trailCanvas.getContext('2d');
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    });

    const trail = [];
    const MAX_TRAIL = 12;

    window.addEventListener('mousemove', (e) => {
      trail.push({ x: e.clientX, y: e.clientY, alpha: 0.45, size: 8 });
      if (trail.length > MAX_TRAIL) trail.shift();
    });

    function drawTrail() {
      tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

      for (let i = 0; i < trail.length; i++) {
        const pt = trail[i];
        pt.alpha *= 0.88;
        pt.size *= 0.95;

        tCtx.beginPath();
        tCtx.arc(pt.x, pt.y, Math.max(1, pt.size), 0, Math.PI * 2);
        tCtx.fillStyle = 'rgba(52, 211, 153, ' + pt.alpha + ')';
        tCtx.fill();
      }

      requestAnimationFrame(drawTrail);
    }

    drawTrail();
  }
})();
