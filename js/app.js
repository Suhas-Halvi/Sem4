/* =====================================================
   APP.JS
   Core application logic: screen navigation, loading
   sequence, the "Do you love me?" chase button, the
   envelope + letter reveal, the 100 reasons grid, the
   date invitation cards, and the final constellation.
   ===================================================== */

(function(){
  'use strict';

  /* =========================================================
     SCREEN NAVIGATION
     ========================================================= */
  const screens = {
    loading:  document.getElementById('screen-loading'),
    landing:  document.getElementById('screen-landing'),
    question: document.getElementById('screen-question'),
    envelope: document.getElementById('screen-envelope'),
    letter:   document.getElementById('screen-letter'),
    reasons:  document.getElementById('screen-reasons'),
    dates:    document.getElementById('screen-dates'),
    final:    document.getElementById('screen-final')
  };

  function goToScreen(name){
    Object.values(screens).forEach(s => s.classList.remove('active-screen'));
    screens[name].classList.add('active-screen');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  /* Ripple effect for any .ripple button */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ripple');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    circle.className = 'ripple-circle';
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
    circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  });

  /* =========================================================
     LOADING SCREEN
     ========================================================= */
  const loaderFill = document.getElementById('loader-fill');
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 12 + 6;
    if (progress >= 100){
      progress = 100;
      loaderFill.style.width = '100%';
      clearInterval(loadingInterval);
      setTimeout(() => {
        screens.loading.style.animation = 'fadeOut .6s ease forwards';
        setTimeout(() => {
          screens.loading.style.display = 'none';
          goToScreen('landing');
        }, 600);
      }, 400);
    } else {
      loaderFill.style.width = progress + '%';
    }
  }, 260);

  /* =========================================================
     LANDING -> QUESTION
     ========================================================= */
  document.getElementById('btn-open-heart').addEventListener('click', () => {
    goToScreen('question');
  });

  /* =========================================================
     QUESTION PAGE — the chase button
     ========================================================= */
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const questionButtons = document.getElementById('question-buttons');
  const escapeMessage = document.getElementById('escape-message');

  const escapeMessages = [
    'Really? 🥺',
    'Think Again ❤️',
    'Please...',
    "Don't Break My Heart 💔",
    "You're making me sad 😭",
    'Pretty Please 🥹',
    'You already know the answer.',
    'Stop trying 😂',
    "No isn't available today.",
    'Choose wisely ❤️',
    "I'm watching you 👀"
  ];

  let attempts = 0;
  const MAX_ATTEMPTS = escapeMessages.length;
  let noScale = 1;
  let yesScale = 1;

  function moveNoButton(){
    const wrapRect = questionButtons.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxX = wrapRect.width - btnRect.width - 8;
    const maxY = 140; // vertical wander range

    const randX = Math.random() * maxX - maxX / 2;
    const randY = Math.random() * maxY - maxY / 2;

    btnNo.style.position = 'relative';
    btnNo.style.transition = 'transform .35s var(--ease-soft)';
    btnNo.style.transform = `translate(${randX}px, ${randY}px)`;
  }

  function handleNoEscape(){
    if (attempts >= MAX_ATTEMPTS + 4) return; // fully retired
    attempts++;
    moveNoButton();

    // YES grows and glows a little more each time
    yesScale = Math.min(1 + attempts * 0.06, 1.9);
    btnYes.style.transform = `scale(${yesScale})`;
    btnYes.classList.add('glowing');

    // NO shrinks after enough attempts, then disappears
    if (attempts > MAX_ATTEMPTS){
      noScale = Math.max(1 - (attempts - MAX_ATTEMPTS) * 0.3, 0);
      btnNo.style.transform += ` scale(${noScale})`;
      if (noScale <= 0.05){
        btnNo.style.opacity = '0';
        btnNo.style.pointerEvents = 'none';
        escapeMessage.textContent = 'No isn\'t available today. Choose wisely ❤️';
        return;
      }
    }

    const msgIndex = Math.min(attempts - 1, escapeMessages.length - 1);
    escapeMessage.textContent = escapeMessages[msgIndex];
  }

  // Desktop: run away when the cursor comes near
  btnNo.addEventListener('mouseenter', handleNoEscape);
  questionButtons.addEventListener('mousemove', (e) => {
    const rect = btnNo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (dist < 70) handleNoEscape();
  });

  // Mobile / fallback: tapping also makes it run (never actually selects NO)
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleNoEscape();
  }, { passive: false });
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    handleNoEscape();
  });

  btnYes.addEventListener('click', () => {
    const rect = btnYes.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    window.LoveConfetti.heartExplosion(x, y, 50);
    window.LoveConfetti.confettiBurst(y / window.innerHeight);
    window.LoveConfetti.fireworks(1800);

    setTimeout(() => {
      goToScreen('envelope');
    }, 1600);
  });

  /* =========================================================
     ENVELOPE
     ========================================================= */
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelope-hint');
  let envelopeOpened = false;

  envelope.addEventListener('click', () => {
    if (envelopeOpened) return;
    envelopeOpened = true;
    envelope.classList.add('opened');
    envelopeHint.style.opacity = '0';

    setTimeout(() => {
      goToScreen('letter');
      startLetterTypewriter();
    }, 1300);
  });

  /* =========================================================
     LOVE LETTER — typewriter effect
     ========================================================= */
  const letterContent = document.getElementById('letter-content');
  const btnLetterContinue = document.getElementById('btn-letter-continue');

  const loveLetterText =
`To my Cutuu Sweetu Babyy,

My shonuu monuu sweetu i really love youuuuuuuuu.
I know sometimes i might be annoying ,irritative,and childish 
but its my way of expressing love ,u can say that its my love language and 
u have to deal with it for the rest of your life.
No matter whatever comes in between us we will sort it out 
and be with each other together.

I don't know exactly when it happened, only that somewhere between
ordinary days and quiet conversations, you became the person I look
for in every room.

Thank you for the patience you show me, for the way you listen
before you judge, and for loving me in all the small, steady ways
that matter far more than grand gestures ever could.

Sometimes we fight,but in that fight i hope you dont forget 
 our happy moments and how much i love you and.I know i am bit egoistic and wont text first 
after fights but i am ur cutee little babyy na u must text me first 
and i promise will be gentle with you.

Whatever comes next, I want to face it with you. Not because life
is perfect, but because it is better, softer, and infinitely more
worth living when you are in it.

Stay with me forever my Rakshuu Babyy,

Always yours.`;

  let typewriterStarted = false;

  function startLetterTypewriter(){
    if (typewriterStarted) return;
    typewriterStarted = true;

    let i = 0;
    letterContent.textContent = '';
    btnLetterContinue.classList.add('hidden');

    function typeChar(){
      if (i < loveLetterText.length){
        letterContent.textContent += loveLetterText.charAt(i);
        i++;
        setTimeout(typeChar, 18);
      } else {
        btnLetterContinue.classList.remove('hidden');
      }
    }
    typeChar();
  }

  btnLetterContinue.addEventListener('click', () => {
    goToScreen('reasons');
    buildReasonsGridOnce();
  });

  /* =========================================================
     100 REASONS
     ========================================================= */
  const reasons = [
    "The way you laugh at your own jokes before you finish telling them.",
    "You remember the little things I mention once and forget I said.",
    "Your hugs feel like an exhale I didn't know I needed.",
    "You make ordinary errands feel like an adventure.",
    "The way your eyes soften when you're really listening.",
    "You never let me apologize for taking up space.",
    "Your patience when I explain the same story for the third time.",
    "You cheer for me louder than I cheer for myself.",
    "The way you say my name like it means something.",
    "You make the same playlist feel new every single time.",
    "Your terrible puns that somehow always land.",
    "You notice when I'm quiet and know when to just sit with me.",
    "The way you dance in the kitchen when you think no one's watching.",
    "You never make me feel small for asking questions.",
    "Your handwriting on sticky notes I keep longer than I should.",
    "You remember how I take my coffee without asking.",
    "The way you say 'we' instead of 'you' when things get hard.",
    "You make my bad days feel a little more survivable.",
    "Your honesty, even when it's easier to say nothing.",
    "The way you get excited about things that make you happy.",
    "You never rush me through my feelings.",
    "Your hand finding mine without even looking.",
    "You make plans just so we have something to look forward to.",
    "The way you say sorry and actually mean it.",
    "You laugh at my worst impressions and ask for more.",
    "Your steady voice on my most unsteady days.",
    "You keep every little promise, even the small ones.",
    "The way you introduce me like you're proud to know me.",
    "You ask about my day like the answer actually matters to you.",
    "Your ability to make a plain Tuesday feel like a celebration.",
    "You never compare me to anyone else.",
    "The way you save me the last bite without me asking.",
    "Your quiet confidence that makes me want to be braver.",
    "You remember my playlists better than I do.",
    "The way you say 'come here' when I need it most.",
    "Your ability to find the good in people, including me.",
    "You make me want to be a better version of myself.",
    "The way you text 'thinking of you' for no reason at all.",
    "Your hands, always warm, always finding mine.",
    "You never let an argument turn into something ugly.",
    "The way you remember dates I've forgotten I mentioned.",
    "Your laugh that I could pick out in any crowd.",
    "You make me feel like home, wherever we are.",
    "The way you fight for us even when it's inconvenient.",
    "Your quiet way of taking care of things before I even ask.",
    "You never make my dreams feel too big.",
    "The way you say goodnight like it's a promise to come back.",
    "Your patience with my terrible sense of direction.",
    "You make the mundane feel meaningful.",
    "The way you look at old photos of us and smile.",
    "Your honesty about your own feelings, even the messy ones.",
    "You never let me feel alone in a crowded room.",
    "The way you learned my favorite things without me listing them.",
    "Your quiet strength when everything else feels loud.",
    "You make me laugh until I forget what I was upset about.",
    "The way you say 'I've got you' and actually mean it.",
    "Your endless curiosity about the world, and about me.",
    "You never let a compliment I give you go unnoticed.",
    "The way you remember to ask how a hard day turned out.",
    "Your gentle way of calling me out when I need it.",
    "You make future plans in casual conversation, like we're certain.",
    "The way your voice changes when you talk about something you love.",
    "Your ability to turn a bad day into an inside joke later.",
    "You never make me feel like a burden.",
    "The way you hum without realizing you're doing it.",
    "Your loyalty, quiet and constant.",
    "You make me feel chosen, again and again.",
    "The way you ask 'what do you need right now?' and wait for the answer.",
    "Your habit of saving the good stories to tell me first.",
    "You never let silence between us feel uncomfortable.",
    "The way you remember how I like my eggs.",
    "Your steady hand during turbulence, literal and otherwise.",
    "You make me believe in slow, steady kinds of love.",
    "The way you say my flaws like they're just facts, not failures.",
    "Your ability to make me feel safe enough to be unsure out loud.",
    "You never let me forget how far I've come.",
    "The way you show up, even on your tired days.",
    "Your habit of finding the sunset before I do.",
    "You make quiet Sunday mornings my favorite part of the week.",
    "The way you say thank you for the smallest things.",
    "Your quiet cheerleading from the sidelines of my life.",
    "You never let me carry everything alone.",
    "The way you remember my worries and check back on them.",
    "Your ability to make me feel interesting, even on my dullest days.",
    "You make forever sound like a reasonable plan.",
    "The way you say my name differently when you're being soft with me.",
    "Your patience with the version of me still figuring things out.",
    "You never make love feel like a performance.",
    "The way you hold onto the good memories longer than the bad ones.",
    "Your steady kind of loyalty that never needs an audience.",
    "You make me want to write things like this down.",
    "The way you say 'us' about a future you haven't seen yet.",
    "Your ability to turn ordinary Tuesdays into stories worth telling.",
    "You never let a day end without checking in.",
    "The way you believe in me on days I don't believe in myself.",
    "Your quiet, constant choosing of me, every single day.",
    "You make being loved feel effortless, safe, and entirely real.",
    "The way every single reason on this list is still not enough."
  ];

  const heartsGrid = document.getElementById('hearts-grid');
  const reasonModal = document.getElementById('reason-modal');
  const reasonNumberEl = document.getElementById('reason-number');
  const reasonTextEl = document.getElementById('reason-text');
  const reasonClose = document.getElementById('reason-close');
  let reasonsBuilt = false;

  function buildReasonsGridOnce(){
    if (reasonsBuilt) return;
    reasonsBuilt = true;

    // shuffle indices so the "sweetest" ones aren't always in the same slot
    const order = reasons.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    order.forEach((reasonIndex, gridPos) => {
      const btn = document.createElement('button');
      btn.className = 'mini-heart-btn';
      btn.textContent = '💗';
      btn.style.animationDelay = (gridPos * 0.012) + 's';
      btn.addEventListener('click', () => {
        reasonNumberEl.textContent = 'Reason #' + (reasonIndex + 1);
        reasonTextEl.textContent = reasons[reasonIndex];
        reasonModal.classList.add('active');
        btn.classList.add('revealed');
        btn.textContent = '💖';
      });
      heartsGrid.appendChild(btn);
    });
  }

  reasonClose.addEventListener('click', () => reasonModal.classList.remove('active'));
  reasonModal.addEventListener('click', (e) => {
    if (e.target === reasonModal) reasonModal.classList.remove('active');
  });

  document.getElementById('btn-reasons-continue').addEventListener('click', () => {
    goToScreen('dates');
    buildDatesGridOnce();
  });

  /* =========================================================
     DATE INVITATIONS
     ========================================================= */
  const dateIdeas = [
    { emoji: '🍿', title: 'Movie Night', date: 'Friday', time: '8:00 PM', location: 'Our living room', msg: 'Blankets, popcorn, and your pick of movie.' },
    { emoji: '🍜', title: 'Ramen Date', date: 'Saturday', time: '1:00 PM', location: 'That little ramen place downtown', msg: "You get the extra egg, I'm not fighting you on it." },
    { emoji: '☕', title: 'Coffee Date', date: 'Sunday', time: '10:00 AM', location: 'The corner café', msg: 'Slow mornings and good conversation.' },
    { emoji: '🍕', title: 'Pizza Night', date: 'Friday', time: '7:30 PM', location: 'Home, extra cheese', msg: 'No plates, just the box between us.' },
    { emoji: '🌅', title: 'Sunset Date', date: 'Any evening', time: '7:00 PM', location: 'The hill by the old bridge', msg: "I'll bring the blanket, you bring the playlist." },
    { emoji: '🌊', title: 'Beach Walk', date: 'Saturday', time: '5:00 PM', location: 'The shoreline near the pier', msg: 'Bare feet, salt air, and no rush to leave.' },
    { emoji: '🍦', title: 'Ice Cream', date: 'Any afternoon', time: '4:00 PM', location: 'The little shop on Main Street', msg: "We'll share one, argue about flavors anyway." },
    { emoji: '🎡', title: 'Carnival', date: 'Next weekend', time: '6:00 PM', location: 'The traveling fair in town', msg: 'Ferris wheel views and terrible carnival food.' },
    { emoji: '📚', title: 'Bookstore Date', date: 'Sunday', time: '2:00 PM', location: 'The used bookstore downtown', msg: "We'll get lost in different aisles and meet at the register." },
    { emoji: '🎮', title: 'Gaming Night', date: 'Friday', time: '9:00 PM', location: 'Home, couch co-op', msg: "Loser makes the snacks. I'm still undefeated." },
    { emoji: '🚗', title: 'Long Drive', date: 'Any Saturday', time: 'Morning', location: 'Wherever the road takes us', msg: 'Windows down, no real destination.' },
    { emoji: '🌌', title: 'Stargazing', date: 'Clear night', time: '10:00 PM', location: 'The field past the highway', msg: "I'll point out constellations I'm probably making up." },
    { emoji: '🧺', title: 'Picnic', date: 'Sunday', time: '12:00 PM', location: 'The park by the lake', msg: 'Sandwiches, sunshine, and slow conversation.' }
  ];

  const datesGrid = document.getElementById('dates-grid');
  let datesBuilt = false;

  function buildDatesGridOnce(){
    if (datesBuilt) return;
    datesBuilt = true;

    dateIdeas.forEach(idea => {
      const card = document.createElement('div');
      card.className = 'date-card';
      card.innerHTML = `
        <div class="date-card-inner">
          <div class="date-card-face date-card-front">
            <div class="date-emoji">${idea.emoji}</div>
            <div class="date-title">${idea.title}</div>
          </div>
          <div class="date-card-face date-card-back">
            <div class="db-line">📅 ${idea.date}</div>
            <div class="db-line">⏰ ${idea.time}</div>
            <div class="db-line">📍 ${idea.location}</div>
            <div class="db-msg">${idea.msg}</div>
          </div>
        </div>
      `;
      card.addEventListener('click', () => card.classList.toggle('flipped'));
      datesGrid.appendChild(card);
    });
  }

  document.getElementById('btn-dates-continue').addEventListener('click', () => {
    goToScreen('final');
    startConstellation();
  });

  /* =========================================================
     FINAL PAGE — constellation heart + forever button
     ========================================================= */
  const constellationCanvas = document.getElementById('constellation-canvas');
  const cCtx = constellationCanvas.getContext('2d');
  let constellationStarted = false;
  let heartPoints = [];
  let connectedCount = 0;

  function resizeConstellationCanvas(){
    constellationCanvas.width = constellationCanvas.offsetWidth;
    constellationCanvas.height = constellationCanvas.offsetHeight;
  }

  function computeHeartPoints(){
    const w = constellationCanvas.width;
    const h = constellationCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) / 34;
    const pts = [];
    const numPoints = 26;

    for (let i = 0; i < numPoints; i++){
      const t = (i / numPoints) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      pts.push({
        x: cx + x * scale,
        y: cy + y * scale - 10
      });
    }
    return pts;
  }

  function drawConstellation(){
    cCtx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);

    // background twinkle dots
    cCtx.fillStyle = 'rgba(255,255,255,.5)';

    // draw connected lines
    cCtx.strokeStyle = 'rgba(255,158,196,.85)';
    cCtx.lineWidth = 1.6;
    cCtx.beginPath();
    for (let i = 0; i < connectedCount; i++){
      const p = heartPoints[i];
      if (i === 0) cCtx.moveTo(p.x, p.y);
      else cCtx.lineTo(p.x, p.y);
    }
    cCtx.stroke();

    // draw stars/points
    heartPoints.forEach((p, i) => {
      cCtx.beginPath();
      cCtx.arc(p.x, p.y, i < connectedCount ? 3 : 1.6, 0, Math.PI * 2);
      cCtx.fillStyle = i < connectedCount ? '#FFD9E6' : 'rgba(255,255,255,.6)';
      cCtx.shadowColor = '#FF9EC4';
      cCtx.shadowBlur = i < connectedCount ? 10 : 0;
      cCtx.fill();
      cCtx.shadowBlur = 0;
    });
  }

  function startConstellation(){
    if (constellationStarted) return;
    constellationStarted = true;

    resizeConstellationCanvas();
    heartPoints = computeHeartPoints();
    connectedCount = 0;

    const connectInterval = setInterval(() => {
      connectedCount++;
      drawConstellation();
      if (connectedCount >= heartPoints.length){
        connectedCount = heartPoints.length; // close the loop visually
        clearInterval(connectInterval);
      }
    }, 140);

    window.addEventListener('resize', () => {
      resizeConstellationCanvas();
      heartPoints = computeHeartPoints();
      drawConstellation();
    });
  }

  document.getElementById('btn-forever').addEventListener('click', () => {
    const finalTextWrap = document.getElementById('final-text-wrap');
    const finalLoveText = document.getElementById('final-love-text');

    window.LoveConfetti.heartRain(2600);
    window.LoveConfetti.fireworks(2200);
    window.LoveConfetti.confettiBurst(0.5);

    finalTextWrap.style.transition = 'opacity .8s ease';
    finalTextWrap.style.opacity = '0';

    setTimeout(() => {
      finalTextWrap.classList.add('hidden');
      finalLoveText.classList.remove('hidden');
      finalLoveText.classList.add('showing');
    }, 900);
  });

})();
