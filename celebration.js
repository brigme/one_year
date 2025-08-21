// celebration.js
(function() {
  // ---------- СТИЛИ ----------
  const style = document.createElement('style');
  style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');

  html, body { margin:0; padding:0; height:100%; width:100%; overflow:hidden; font-family:'Nunito', sans-serif; }
  body { background: linear-gradient(135deg, #8EC5FC, #E0C3FC); display:flex; justify-content:center; align-items:center; }

  .app { display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative; width:100%; height:100%; }

  .btn {
    padding:20px 40px;
    border:none;
    border-radius:50px;
    background:#3FFDEA;
    color:#0F172A;
    font-weight:800;
    font-size:1.5rem;
    cursor:pointer;
    z-index:10;
  }

  .message-block { display:flex; flex-direction:column; align-items:center; text-align:center; position:relative; z-index:5; }
  .message-block div { font-size:2.5rem; font-weight:900; margin:0; opacity:0; transition:opacity 0.5s; line-height:1.1; }
  .message-block .show { opacity:1; }

  .hearts-inline { display:flex; gap:10px; font-size:2rem; margin-top:5px; opacity:0; transition:opacity 0.5s; }
  .hearts-inline.show { opacity:1; }

  .heart-bg { position:absolute; inset:0; pointer-events:none; opacity:0; z-index:1; }
  .heart-bg .heart { position:absolute; font-size:18px; color:#FF4D6D; opacity:0; transform:translate(-50%,-50%) scale(0.8); animation:floatUp 3s ease-out infinite; }
  @keyframes floatUp { 0%{opacity:0; transform:translate(-50%,0) scale(0.7);} 10%,60%{opacity:.9;} 100%{opacity:0; transform:translate(-50%,-140px) scale(1.2);} }

  .fireworks-layer { position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity 1s; }
  .fireworks-layer.show { opacity:1; }

  .year-title { position:absolute; inset:0; display:grid; place-items:center; font-size:4rem; font-weight:900; color:white; text-shadow:0 4px 20px rgba(0,0,0,0.6); opacity:0; transition:opacity 1s; }
  .year-title.show { opacity:1; }

  .replay { position:absolute; bottom:10px; right:10px; font-size:14px; color:rgba(255,255,255,0.4); cursor:pointer; }
  .replay:hover { color:rgba(255,255,255,0.8); }
  `;
  document.head.appendChild(style);

  // ---------- DOM ----------
  const app = document.createElement('div');
  app.className='app';
  document.body.appendChild(app);

  const btn = document.createElement('button');
  btn.className='btn';
  btn.textContent='Нажать сюда';
  app.appendChild(btn);

  const messageBlock = document.createElement('div');
  messageBlock.className='message-block';
  const msg1 = document.createElement('div');
  msg1.textContent='Люблю тебя';
  const msg2 = document.createElement('div');
  msg2.textContent='Спасибо, что ты есть';
  const heartsInline = document.createElement('div');
  heartsInline.className='hearts-inline';
  heartsInline.textContent='❤️❤️❤️';
  messageBlock.appendChild(msg1);
  messageBlock.appendChild(msg2);
  messageBlock.appendChild(heartsInline);
  app.appendChild(messageBlock);

  const heartBg = document.createElement('div');
  heartBg.className='heart-bg';
  for(let i=0;i<15;i++){
    const h=document.createElement('div');
    h.className='heart';
    h.textContent='❤️';
    h.style.left=Math.random()*100+'vw';
    h.style.top=(Math.random()*50+40)+'vh';
    h.style.animationDelay=Math.random()*3+'s';
    h.style.fontSize=Math.floor(Math.random()*18+14)+'px';
    heartBg.appendChild(h);
  }
  app.appendChild(heartBg);

  const fireworks = document.createElement('div');
  fireworks.className='fireworks-layer';
  const canvas = document.createElement('canvas');
  fireworks.appendChild(canvas);
  const yearTitle = document.createElement('div');
  yearTitle.className='year-title';
  yearTitle.textContent='Нам 1 год';
  fireworks.appendChild(yearTitle);
  const replay = document.createElement('div');
  replay.className='replay';
  replay.textContent='Смотреть снова';
  fireworks.appendChild(replay);
  app.appendChild(fireworks);

  let fwAnim;

  function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

  async function startSequence(){
    btn.style.display='none';
    heartBg.style.opacity=1;
    msg1.classList.add('show');

    await wait(3000);
    msg2.classList.add('show');
    heartsInline.classList.add('show');

    await wait(5000);
    msg1.classList.remove('show');
    msg2.classList.remove('show');
    heartsInline.classList.remove('show');
    heartBg.style.opacity=0;

    await wait(800);
    fireworks.classList.add('show');
    yearTitle.classList.add('show');
    startFireworks(canvas);

    await wait(2000);
    replay.style.display='block';
  }

  btn.addEventListener('click',startSequence);

  replay.addEventListener('click',()=>{
    fireworks.classList.remove('show');
    yearTitle.classList.remove('show');
    replay.style.display='none';
    stopFireworks();
    btn.style.display='block';
    msg1.classList.remove('show');
    msg2.classList.remove('show');
    heartsInline.classList.remove('show');
    heartBg.style.opacity=0;
  });

  function startFireworks(canvas){
    const ctx=canvas.getContext('2d');
    let w,h;
    function resize(){ w=window.innerWidth; h=window.innerHeight; canvas.width=w; canvas.height=h; }
    resize();
    window.addEventListener('resize',resize);
    const particles=[];
    function addFirework(){
      const x=w/2+(Math.random()-0.5)*w*0.6;
      const y=h*0.4+Math.random()*h*0.3;
      const color=`hsl(${Math.floor(Math.random()*360)},100%,60%)`;
      for(let i=0;i<60;i++){
        const angle=Math.random()*2*Math.PI;
        const speed=Math.random()*5+2;
        particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:100,age:0,color});
      }
    }
    function tick(){
      fwAnim=requestAnimationFrame(tick);
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(0,0,w,h);
      if(Math.random()<0.05) addFirework();
      for(let i=particles.length-1;i>=0;i--){
        const p=particles[i];
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.05; p.age++;
        const alpha=1-p.age/p.life;
        ctx.globalAlpha=alpha;
        ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,2,0,Math.PI*2); ctx.fill();
        if(p.age>=p.life) particles.splice(i,1);
      }
      ctx.globalAlpha=1;
    }
    tick();
  }

  function stopFireworks(){ if(fwAnim) cancelAnimationFrame(fwAnim); const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height);}
})();
