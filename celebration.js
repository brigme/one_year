// celebration.js — всё в одном файле

(function () {
  // ---------- БАЗОВЫЕ СТИЛИ И ШРИФТ ----------
  const style = document.createElement('style');
  style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');

  :root{
    --bg1: #8EC5FC;
    --bg2: #E0C3FC;
    --text: #111827;
    --btn-bg: #3FFDEA;
    --btn-text: #0F172A;
    --heart: #FF4D6D;
    --fade-duration: 800ms;
  }

  * { box-sizing: border-box; }
  html, body { height: 100%; margin:0; }
  body {
    font-family: 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    background: linear-gradient(135deg, var(--bg1), var(--bg2));
    overflow: hidden;
  }

  .app {
    position: fixed; inset: 0; display: grid; place-items: center;
  }

  .center {
    display: grid; gap: 24px; place-items: center; text-align: center;
  }

  .btn {
    padding: 16px 28px;
    border: none; border-radius: 9999px;
    background: var(--btn-bg); color: var(--btn-text);
    font-weight: 800; font-size: 20px; letter-spacing: .3px;
    cursor: pointer;
    box-shadow: 0 12px 30px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.08);
    transition: transform .15s ease, box-shadow .2s ease, opacity var(--fade-duration) ease;
  }
  .btn:hover { transform: translateY(-1px) scale(1.02); }
  .btn:active { transform: translateY(1px) scale(.98); }

  .message {
    position: absolute; inset: 0;
    display: grid; place-items: center; text-align: center;
    pointer-events: none;
  }

  .message h1 {
    margin: 0; padding: 0 24px;
    font-size: clamp(32px, 6vw, 64px);
    font-weight: 900;
    color: #0b0b0b;
    text-shadow: 0 1px 0 rgba(255,255,255,.8);
    opacity: 0; transform: translateY(10px);
    transition: opacity var(--fade-duration) ease, transform var(--fade-duration) ease;
    border-radius: 18px;
  }
  .message.show h1 { opacity: 1; transform: translateY(0); }

  .fade-out { opacity: 0 !important; transition: opacity var(--fade-duration) ease; }

  /* Парящие сердечки */
  .heart {
    position: absolute;
    font-size: 18px;
    color: var(--heart);
    opacity: 0;
    transform: translate(-50%, -50%) scale(.8) rotate(0deg);
    animation: floatUp 3.2s ease-out forwards;
    filter: drop-shadow(0 6px 20px rgba(255,77,109,0.4));
    will-change: transform, opacity;
  }
  @keyframes floatUp {
    0%   { opacity: 0; transform: translate(-50%, 0) scale(.7) rotate(0deg); }
    10%  { opacity: .9; }
    60%  { opacity: .9; }
    100% { opacity: 0; transform: translate(-50%, -140px) scale(1.2) rotate(12deg); }
  }

  /* Три сердечка внизу */
  .bottom-hearts {
    position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%);
    display: flex; gap: 18px; opacity: 0; transition: opacity var(--fade-duration) ease;
  }
  .bottom-hearts.show { opacity: 1; }
  .bottom-hearts .bheart {
    font-size: clamp(22px, 3.5vw, 34px);
    color: var(--heart);
    filter: drop-shadow(0 6px 16px rgba(255,77,109,0.35));
    animation: gentle 2.6s ease-in-out infinite;
  }
  .bottom-hearts .bheart:nth-child(2){ animation-delay: .3s; }
  .bottom-hearts .bheart:nth-child(3){ animation-delay: .6s; }
  @keyframes gentle {
    0% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-6px) scale(1.05); }
    100% { transform: translateY(0) scale(1); }
  }

  /* Слой салюта */
  .fireworks-layer {
    position: absolute; inset: 0; pointer-events: none; opacity: 0;
    transition: opacity 900ms ease;
    background: radial-gradient(1200px 800px at 50% 50%, rgba(10,10,20,.25), transparent 65%) ,
                linear-gradient(135deg, #081226, #140A2B 60%, #1B1036);
  }
  .fireworks-layer.show { opacity: 1; }

  .year-title {
    position: absolute; inset: 0; display: grid; place-items: center;
    color: #F8FAFC; text-align: center;
    text-shadow: 0 8px 30px rgba(0,0,0,.55);
    font-size: clamp(36px, 7vw, 84px);
    font-weight: 900;
    letter-spacing: .5px;
    opacity: 0; transform: translateY(16px);
    transition: opacity 900ms ease, transform 900ms ease;
  }
  .year-title.show { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  // ---------- DOM ----------
  const app = document.createElement('div');
  app.className = 'app';
  document.body.appendChild(app);

  const center = el('div', 'center');
  const btn = el('button', 'btn', 'Нажать сюда');
  center.appendChild(btn);
  app.appendChild(center);

  const messageLayer = el('div', 'message');
  const messageH1 = el('h1', '', '');
  messageLayer.appendChild(messageH1);
  app.appendChild(messageLayer);

  const bottomHearts = el('div', 'bottom-hearts');
  bottomHearts.innerHTML = `<span class="bheart">❤️</span><span class="bheart">❤️</span><span class="bheart">❤️</span>`;
  app.appendChild(bottomHearts);

  // Слой для салюта
  const fireworksLayer = el('div', 'fireworks-layer');
  const canvas = document.createElement('canvas');
  fireworksLayer.appendChild(canvas);
  const yearTitle = el('div', 'year-title', 'Нам 1 год');
  fireworksLayer.appendChild(yearTitle);
  app.appendChild(fireworksLayer);

  // ---------- СОСТОЯНИЕ И УТИЛИТЫ ----------
  let heartsTimer = null;
  let spawning = false;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function showMessage(text) {
    messageH1.textContent = text;
    messageLayer.classList.add('show');
    // небольшая задержка, чтобы transition сработал
    requestAnimationFrame(() => {
      messageH1.offsetHeight; // reflow
      messageLayer.classList.add('show');
      messageH1.classList.add('show');
    });
  }

  function hideMessage() {
    messageLayer.classList.remove('show');
    messageH1.classList.remove('show');
  }

  function random(min, max) { return Math.random() * (max - min) + min; }

  function spawnHeart() {
    const h = el('div', 'heart', '❤️');
    const x = random(8, 92); // проценты ширины
    const yStart = random(60, 92);
    h.style.left = x + 'vw';
    h.style.top = yStart + 'vh';
    h.style.fontSize = random(14, 28) + 'px';
    h.style.transform += ` rotate(${random(-12,12)}deg)`;
    document.body.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }

  function startHearts() {
    if (spawning) return;
    spawning = true;
    heartsTimer = setInterval(() => {
      // пачка из нескольких сердечек, чтобы выглядело богаче
      for (let i = 0; i < 3; i++) {
        setTimeout(spawnHeart, i * 120);
      }
    }, 420);
  }

  function stopHearts() {
    spawning = false;
    if (heartsTimer) clearInterval(heartsTimer);
    heartsTimer = null;
  }

  // ---------- ЛОГИКА СЦЕНАРИЯ ----------
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.style.opacity = '0';
    setTimeout(() => btn.remove(), 400);

    // Этап 1: сердца + "Люблю тебя"
    startHearts();
    showMessage('Люблю тебя');

    // Через 3 секунды: "Спасибо что ты есть" + 3 сердечка внизу
    await wait(3000);
    showMessage('Спасибо что ты есть');
    bottomHearts.classList.add('show');

    // Через 5 секунд: плавное исчезновение всего
    await wait(5000);
    bottomHearts.classList.remove('show');
    messageH1.classList.add('fade-out');

    // короткая пауза на fade
    await wait(800);
    hideMessage();
    stopHearts();

    // Этап 2: затемнение, заголовок "Нам 1 год" + салют
    fireworksLayer.classList.add('show');
    await wait(100);
    yearTitle.classList.add('show');
    startFireworks(canvas);
  });

  function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

  // ---------- САЛЮТ (канвас) ----------
  function startFireworks(canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr;

    function resize() {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const rockets = [];
    const particles = [];

    function launch() {
      // стартовая «ракета»
      rockets.push({
        x: random(w * .2, w * .8),
        y: h + 10,
        vx: random(-0.8, 0.8),
        vy: random(-9.2, -11.8),
        color: `hsl(${Math.floor(random(0,360))} 90% 60%)`,
        explodeY: random(h * .25, h * .45)
      });
    }

    function explode(x, y, baseHue) {
      const count = Math.floor(random(60, 100));
      for (let i = 0; i < count; i++) {
        const angle = random(0, Math.PI * 2);
        const speed = Math.pow(Math.random(), 0.35) * random(2, 6.6);
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: random(60, 110),
          age: 0,
          color: `hsl(${(baseHue + random(-18, 18) + 360) % 360} 100% ${Math.floor(random(52, 72))}%)`
        });
      }
      // «искры-шлейф» в центре
      for (let i = 0; i < 16; i++) {
        particles.push({
          x, y,
          vx: random(-1.2, 1.2),
          vy: random(-1.2, 1.2),
          life: random(20, 40),
          age: 0,
          color: `hsl(${baseHue} 100% 85%)`
        });
      }
    }

    let lastTime = 0;
    function tick(t) {
      requestAnimationFrame(tick);
      if (!lastTime) lastTime = t;
      const dt = Math.min(32, t - lastTime) / 16.666; // ~frames
      lastTime = t;

      // фон затухания
      ctx.fillStyle = 'rgba(10, 12, 24, 0.25)';
      ctx.fillRect(0, 0, w, h);

      // новые запуски
      if (Math.random() < 0.05) launch();
      if (Math.random() < 0.03) launch();

      // ракеты
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.vy += 0.12 * dt; // гравитация
        r.x += r.vx * dt * 1.2;
        r.y += r.vy * dt * 1.2;

        // след
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        if (r.vy >= 0 || r.y <= r.explodeY) {
          const hue = parseInt(r.color.match(/hsl\((\d+)/)[1]) || Math.floor(random(0,360));
          explode(r.x, r.y, hue);
          rockets.splice(i, 1);
        }
      }

      // частицы
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        p.vy += 0.08 * dt; // гравитация
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const alpha = Math.max(0, 1 - p.age / p.life);
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';

        if (p.age >= p.life) particles.splice(i, 1);
      }
    }

    requestAnimationFrame(tick);
  }
})();
