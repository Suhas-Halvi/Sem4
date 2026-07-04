/* =====================================================
   CONFETTI.JS
   Wraps the canvas-confetti library (loaded via CDN in
   index.html) with love-story flavoured presets, plus a
   custom hand-rolled heart-explosion effect on #fx-canvas.
   ===================================================== */

(function(){
  'use strict';

  const PALETTE = ['#FF9EC4', '#C9A7EB', '#E8B4A0', '#FFD9E6', '#FFFFFF'];

  /* ---------- Confetti burst (library) ---------- */
  function confettiBurst(originY = 0.6){
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 90,
      spread: 80,
      startVelocity: 45,
      colors: PALETTE,
      origin: { y: originY }
    });
  }

  /* ---------- Fireworks (library, multi-burst) ---------- */
  function fireworks(duration = 2200){
    if (typeof confetti !== 'function') return;
    const end = Date.now() + duration;

    (function frame(){
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: PALETTE
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: PALETTE
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // A few big center bursts for punctuation
    setTimeout(() => confetti({ particleCount: 60, spread: 100, startVelocity: 55, colors: PALETTE, origin: { y: 0.5 } }), 300);
    setTimeout(() => confetti({ particleCount: 60, spread: 100, startVelocity: 55, colors: PALETTE, origin: { y: 0.4 } }), 900);
  }

  /* ---------- Heart rain (library shapes) ---------- */
  function heartRain(duration = 2500){
    if (typeof confetti !== 'function') return;
    const heartShape = confetti.shapeFromText ? confetti.shapeFromText({ text: '❤️', scalar: 2 }) : null;
    const end = Date.now() + duration;

    (function frame(){
      confetti({
        particleCount: 3,
        startVelocity: 0,
        gravity: 0.4,
        drift: Math.random() - 0.5,
        ticks: 250,
        origin: { x: Math.random(), y: -0.1 },
        colors: PALETTE,
        shapes: heartShape ? [heartShape] : ['circle'],
        scalar: heartShape ? 1 : 1.2
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  /* ---------- Custom heart explosion drawn on #fx-canvas ----------
     Used at the moment YES is clicked — a burst of many small
     hearts expanding outward from the button location, drawn with
     native canvas for full control over shape/easing. */
  const fxCanvas = document.getElementById('fx-canvas');
  const fxCtx = fxCanvas.getContext('2d');
  let particles = [];
  let rafId = null;

  function resizeFxCanvas(){
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeFxCanvas);
  resizeFxCanvas();

  function drawHeartPath(ctx, x, y, size){
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
  }

  function heartExplosion(x, y, count = 36){
    for (let i = 0; i < count; i++){
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 3 + Math.random() * 6;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 10,
        life: 1,
        decay: 0.008 + Math.random() * 0.01,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        gravity: 0.12
      });
    }
    if (!rafId) animateParticles();
  }

  function animateParticles(){
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.life -= p.decay;

      fxCtx.globalAlpha = Math.max(p.life, 0);
      fxCtx.fillStyle = p.color;
      drawHeartPath(fxCtx, p.x, p.y, p.size);
      fxCtx.fill();
    });
    fxCtx.globalAlpha = 1;

    particles = particles.filter(p => p.life > 0);

    if (particles.length > 0){
      rafId = requestAnimationFrame(animateParticles);
    } else {
      rafId = null;
      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    }
  }

  /* Expose to app.js */
  window.LoveConfetti = {
    confettiBurst,
    fireworks,
    heartRain,
    heartExplosion
  };

})();
