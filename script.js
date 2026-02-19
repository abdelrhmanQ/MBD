// v2: message is written in code, not typed by user.
const SURPRISE_MESSAGE = `Write your birthday message here ✨
(Replace this text later inside script.js)

Example:
Happy Birthday! 🎂🎉
I hope your day is full of smiles and blessings.`;

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');

const gift1 = document.getElementById('gift1');
const messageCard = document.getElementById('messageCard');
const messageText = document.getElementById('messageText');
const heart1 = document.getElementById('heart1');

const gift2 = document.getElementById('gift2');
const hrReveal = document.getElementById('hrReveal');

const heart2 = document.getElementById('heart2');
const finalMsg = document.getElementById('finalMsg');

const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');

function resizeCanvas(){
  confettiCanvas.width = Math.floor(window.innerWidth * devicePixelRatio);
  confettiCanvas.height = Math.floor(window.innerHeight * devicePixelRatio);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function showStep(stepEl){
  document.querySelectorAll('.step').forEach(s=>{
    s.classList.remove('active');
    s.hidden = true;
  });
  stepEl.hidden = false;
  requestAnimationFrame(()=> stepEl.classList.add('active'));
}

// Typewriter effect for the message
function typewriter(el, text, speed=18){
  el.textContent = "";
  let i = 0;
  const tick = () => {
    if (i <= text.length){
      el.textContent = text.slice(0, i);
      i++;
      requestAnimationFrame(() => setTimeout(tick, speed));
    }
  };
  tick();
}

// Confetti
let confetti = [];
let confettiRunning = false;

function spawnConfetti(count = 180){
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;
  confetti = [];
  const colors = ['#ff4d8d','#ffd166','#06d6a0','#7c4dff','#ffffff','#00c2ff','#ff8a00'];
  for(let i=0;i<count;i++){
    confetti.push({
      x: Math.random()*w,
      y: -Math.random()*h*0.4,
      r: (4 + Math.random()*8) * devicePixelRatio,
      vy: (2 + Math.random()*6) * devicePixelRatio,
      vx: (-1.6 + Math.random()*3.2) * devicePixelRatio,
      a: Math.random()*Math.PI*2,
      va: (-0.22 + Math.random()*0.44),
      c: colors[Math.floor(Math.random()*colors.length)],
      life: 220 + Math.random()*160
    });
  }
}

function drawConfetti(){
  if(!confettiRunning) return;
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  confetti.forEach(p=>{
    p.x += p.vx;
    p.y += p.vy;
    p.a += p.va;
    p.vy *= 1.0016;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.a);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
    ctx.restore();
  });
  confetti = confetti.filter(p=> p.life > 0 && p.y < confettiCanvas.height + 60);
  if(confetti.length === 0){
    confettiRunning = false;
    ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    return;
  }
  requestAnimationFrame(drawConfetti);
}

function burstConfetti(){
  spawnConfetti(220);
  confettiRunning = true;
  drawConfetti();
}

gift1.addEventListener('click', ()=>{
  gift1.classList.add('open');
  messageCard.hidden = false;
  typewriter(messageText, SURPRISE_MESSAGE, 14);
  burstConfetti();
  messageCard.scrollIntoView({behavior:'smooth', block:'start'});
});

heart1.addEventListener('click', ()=>{
  messageCard.hidden = true;
  showStep(step2);
  setTimeout(()=> window.scrollTo({top: 0, behavior:'smooth'}), 50);
});

gift2.addEventListener('click', ()=>{
  hrReveal.hidden = false;
  burstConfetti();
  hrReveal.scrollIntoView({behavior:'smooth', block:'start'});
});

heart2.addEventListener('click', ()=>{
  // Hide inline message (if exists) and show cinematic overlay
  if (finalMsg) finalMsg.hidden = true;
  showFinalOverlay();
});
});

// Initial
showStep(step1);


// Dramatic final overlay reveal
const finalOverlay = document.getElementById('finalOverlay');
const finalOverlayText = document.getElementById('finalOverlayText');

function typewriterOverlay(text, speed=18){
  if(!finalOverlayText) return;
  finalOverlayText.innerHTML = "";
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  const tick = () => {
    const slice = text.slice(0, i);
    finalOverlayText.textContent = slice;
    finalOverlayText.appendChild(cursor);
    i++;
    if(i <= text.length){
      setTimeout(tick, speed);
    }
  };
  tick();
}

function showFinalOverlay(){
  if(!finalOverlay) return;
  finalOverlay.hidden = false;
  requestAnimationFrame(()=> finalOverlay.classList.add('show'));
  typewriterOverlay("From Abdelrahman", 16);
  burstConfetti();
}

function hideFinalOverlay(){
  if(!finalOverlay) return;
  finalOverlay.classList.remove('show');
  setTimeout(()=> { finalOverlay.hidden = true; }, 520);
}

if(finalOverlay){
  finalOverlay.addEventListener('click', hideFinalOverlay);
}
