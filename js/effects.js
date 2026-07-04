/* =====================================================
   EFFECTS.JS
   Ambient background effects: twinkling stars, cherry
   blossom petals, floating hearts, cursor sparkle trail.
   ===================================================== */

(function(){
  'use strict';

  /* ---------- Twinkling stars (canvas) ---------- */
  const starsCanvas = document.getElementById('stars-canvas');
  const starsCtx = starsCanvas.getContext('2d');
  let stars = [];

  function resizeStarsCanvas(){
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
    const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    stars = Array.from({length: count}, () => ({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height * 0.7, // keep stars in upper sky
      r: Math.random() * 1.6 + 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005
    }));
  }

  function drawStars(t){
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    stars.forEach(s => {
      const twinkle = Math.sin(t * s.speed + s.phase) * 0.5 + 0.5;
      starsCtx.beginPath();
      starsCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      starsCtx.fillStyle = `rgba(255,255,255,${0.25 + twinkle * 0.65})`;
      starsCtx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resizeStarsCanvas);
  resizeStarsCanvas();
  requestAnimationFrame(drawStars);

  /* ---------- Cherry blossom petals ---------- */
  const petalsContainer = document.getElementById('petals-container');
  const PETAL_COUNT = window.innerWidth < 600 ? 10 : 18;

  function spawnPetal(){
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 8 + Math.random() * 10;
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 8;
    const drift = (Math.random() * 120 - 60) + 'px';

    petal.style.left = left + 'vw';
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.background = Math.random() > 0.5
      ? 'radial-gradient(circle at 30% 30%, #FFD9E6, #FF9EC4)'
      : 'radial-gradient(circle at 30% 30%, #F3E2FF, #C9A7EB)';
    petal.style.borderRadius = '0% 60% 0% 60%';
    petal.style.setProperty('--drift', drift);
    petal.style.animation = `petalFall ${duration}s linear forwards`;
    petal.style.opacity = '0';

    petalsContainer.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 200);
  }

  setInterval(spawnPetal, 900);
  for(let i=0;i<PETAL_COUNT/2;i++){ setTimeout(spawnPetal, i * 400); }

  /* ---------- Ambient floating hearts (background) ---------- */
  const heartsBg = document.getElementById('floating-hearts-bg');

  function spawnBgHeart(){
    const heart = document.createElement('div');
    heart.className = 'bg-heart';
    heart.textContent = Math.random() > 0.5 ? '💗' : '💜';
    const left = Math.random() * 100;
    const duration = 10 + Math.random() * 10;
    const scale = 0.5 + Math.random() * 0.8;

    heart.style.left = left + 'vw';
    heart.style.bottom = '-5vh';
    heart.style.fontSize = (14 + scale * 10) + 'px';
    heart.style.setProperty('--hs', scale);
    heart.style.opacity = '0';
    heart.style.animation = `heartFloatUp ${duration}s ease-in forwards`;

    heartsBg.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 200);
  }

  setInterval(spawnBgHeart, 1500);

  /* ---------- Cursor sparkle + heart trail ---------- */
  const cursorGlow = document.getElementById('cursor-glow');
  let lastSparkle = 0;

  if (window.matchMedia('(hover: hover)').matches){
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';

      const now = performance.now();
      if (now - lastSparkle > 90){
        lastSparkle = now;
        spawnSparkle(e.clientX, e.clientY);
      }
    });
  }

  function spawnSparkle(x, y){
    const sparkle = document.createElement('div');
    const isHeart = Math.random() > 0.7;
    sparkle.textContent = isHeart ? '❤' : '✦';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = isHeart ? '12px' : '10px';
    sparkle.style.color = isHeart ? '#FF9EC4' : '#C9A7EB';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9998';
    sparkle.style.transform = 'translate(-50%,-50%)';
    sparkle.style.transition = 'transform .7s ease-out, opacity .7s ease-out';
    document.body.appendChild(sparkle);

    requestAnimationFrame(() => {
      const dx = (Math.random() * 40 - 20);
      const dy = -20 - Math.random() * 20;
      sparkle.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => sparkle.remove(), 750);
  }

  /* Expose a helper other scripts can reuse for one-off heart bursts */
  window.LoveEffects = {
    spawnSparkle
  };

})();
