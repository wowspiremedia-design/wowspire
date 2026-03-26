/* ============================================================
   WOWSPIRE V5 — app.js
   Loader Brand Film · Lenis · Content · GSAP Cinematic Scroll
   ============================================================ */

'use strict';

// ── SVG ICONS MAP ─────────────────────────────────────────────
const ICONS = {
  social:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.41" y2="10.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="9.49"/></svg>`,
  content:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></svg>`,
  brand:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  video:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="15" height="16" rx="2"/><path d="M17 9l5-3v12l-5-3V9z"/></svg>`,
  influence:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  ads:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
  leads:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  seo:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  wa:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
  web:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
  auto:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  hotel:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  email:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  biz:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4"/></svg>`
};
const IKEYS = ['social','content','brand','video','influence','ads','search','leads','seo','wa','web','auto','hotel','email','biz'];

// ── ENTRANCE ANIMATION POOL (unpredictable card reveals) ─────
const ENTRANCES = [
  { x:-120, y:0, rotate:-18, scale:.82, rotateY:0 },
  { x:120,  y:0, rotate:18,  scale:.82, rotateY:0 },
  { x:0, y:-90, rotate:0, scale:.86, rotateY:0 },
  { x:0, y:0, rotate:0, scale:.25, rotateY:90 },
  { x:-80, y:-70, rotate:-22, scale:.75, rotateY:0 },
  { x:80,  y:70,  rotate:22,  scale:.75, rotateY:0 },
  { x:0, y:0, rotate:0, scale:1.8, rotateY:0 }, // zoom out entrance
  { x:-90, y:60,  rotate:-15, scale:.88, rotateY:-45 },
];

// ── CONTENT RENDERING ─────────────────────────────────────────
(function render() {
  // Marquee
  const mq = document.getElementById('mqTrack');
  if (mq && D.clients) {
    mq.innerHTML = [...D.clients,...D.clients].map(c=>
      `<div class="mq-item"><img src="assets/images/${c.f}" alt="${c.n}" loading="lazy"><span class="mq-name">${c.n}</span></div>`
    ).join('');
  }
  // Bio
  const bio = document.getElementById('aboutBio');
  if (bio) bio.innerHTML = D.founder.bio.map(p=>`<p>${p}</p>`).join('');
  // Counters
  const cg = document.getElementById('countersGrid');
  if (cg) cg.innerHTML = D.founder.stats.map(s=>
    `<div class="counter-box glass-card"><div class="card-spotlight"></div>
     <div class="counter-val" data-target="${s.v}" data-sfx="${s.s}">0</div>
     <div class="counter-lbl">${s.l}</div></div>`
  ).join('');
  // Services
  const sv = document.getElementById('svcContainer');
  if (sv) {
    let idx=0;
    sv.innerHTML = D.services.map(cat=>
      `<div class="svc-cat">
        <div class="svc-cat-label">${cat.cat}</div>
        <div class="svc-grid">${cat.items.map(s=>{
          const en = idx%ENTRANCES.length;
          const ik = IKEYS[idx++]||'brand';
          return `<div class="glass-card svc-card e-ready" data-en="${en}">
            <div class="card-spotlight"></div>
            <div class="svc-icon">${ICONS[ik]}</div>
            <div class="svc-name">${s.n}</div>
            <div class="svc-short">${s.s}</div>
            <div class="svc-detail">${s.d}</div>
            <div class="svc-cta-text">Get Started →</div>
            <div class="svc-hint">Click to expand</div>
          </div>`;
        }).join('')}</div>
      </div>`
    ).join('');
  }
  // Portfolio
  const pf = document.getElementById('pfGrid');
  if (pf) pf.innerHTML = D.portfolio.map((p,i)=>
    `<div class="glass-card pf-card e-ready" data-en="${(i*3)%ENTRANCES.length}">
      <div class="card-spotlight"></div>
      <div class="pf-logo"><img src="assets/images/${p.f}" alt="${p.n}" loading="lazy"></div>
      <div class="pf-name">${p.n}</div>
      <div class="pf-ind">${p.ind}</div>
      <div class="pf-tags">${p.tags.map(t=>`<span class="pf-tag">${t}</span>`).join('')}</div>
      <span class="pf-arrow">View details →</span>
      <div class="pf-desc">${p.d}</div>
    </div>`
  ).join('');
  // Disney
  const dt = document.getElementById('disneyText');
  if (dt) dt.innerHTML = D.disney.story.map(p=>`<p class="e-ready" data-en="2">${p}</p>`).join('')+
    `<div class="disney-hl e-ready" data-en="0">"${D.disney.hl.replace("'innovative'","'<span>innovative</span>'").replace('Disney','<span>Disney</span>')}"</div>`;
  // Learn
  const lc = document.getElementById('learnContainer');
  if (lc) {
    const [f,...rest] = D.articles;
    lc.innerHTML = `<div class="glass-card article-card learn-featured e-ready" data-en="2">
      <div class="card-spotlight"></div>
      <div class="article-num">01</div>
      <div class="article-title">${f.t}</div>
      <div class="article-preview">${f.p}</div>
      <div class="article-tips"><ul>${f.tips.map(t=>`<li>${t}</li>`).join('')}</ul>
        <a class="article-cta-link" href="#contact">Need help? Let Wowspire handle it →</a>
      </div></div>
      <div class="learn-grid">${rest.map((a,i)=>`
        <div class="glass-card article-card e-ready" data-en="${(i*2+1)%ENTRANCES.length}">
          <div class="card-spotlight"></div>
          <div class="article-num">0${i+2}</div>
          <div class="article-title">${a.t}</div>
          <div class="article-preview">${a.p}</div>
          <div class="article-tips"><ul>${a.tips.map(t=>`<li>${t}</li>`).join('')}</ul>
            <a class="article-cta-link" href="#contact">Need help? Let Wowspire handle it →</a>
          </div></div>`).join('')}</div>`;
  }
})();

// ── LENIS SMOOTH SCROLL — properly integrated ────────────────

// ── CUSTOM CURSOR ─────────────────────────────────────────────
(function() {
  if (window.matchMedia('(hover:none)').matches) return;
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className='cursor-dot'; ring.className='cursor-ring';
  document.body.appendChild(dot); document.body.appendChild(ring);
  const glow = document.querySelector('.cursor-glow');
  let mx=-200,my=-200,rx=-200,ry=-200;
  document.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });
  const hs='a,button,.glass-card,.hero-cta,.ct-btn,.nav-cta,.chat-trig,.btt';
  document.addEventListener('mouseover', e=>{ if(e.target.closest(hs)) ring.classList.add('big'); });
  document.addEventListener('mouseout',  e=>{ if(e.target.closest(hs)) ring.classList.remove('big'); });
  (function tick(){
    dot.style.left=mx+'px'; dot.style.top=my+'px';
    rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    if(glow){ glow.style.left=mx+'px'; glow.style.top=my+'px'; }
    requestAnimationFrame(tick);
  })();
})();

// ── SCROLL EVENTS ─────────────────────────────────────────────
window.addEventListener('scroll', ()=>{
  const sb=document.getElementById('scrollBar');
  if(sb) sb.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%';
  document.querySelector('nav')?.classList.toggle('scrolled', window.scrollY>50);
  const h=document.querySelector('.scroll-hint');
  if(h) h.style.opacity=Math.max(0,.5-window.scrollY/180);
  document.getElementById('btt')?.classList.toggle('show', window.scrollY>450);
});

// ── NAV ACTIVE ────────────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-links a');
(function(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id)); });
  },{ rootMargin:'-40% 0px -50% 0px' });
  document.querySelectorAll('section[id]').forEach(s=>io.observe(s));
})();

// ── MOBILE NAV ────────────────────────────────────────────────
const burger=document.getElementById('burger'), mob=document.getElementById('mobMenu');
if(burger&&mob){
  burger.addEventListener('click',()=>{ burger.classList.toggle('open'); mob.classList.toggle('open'); });
  mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ burger.classList.remove('open'); mob.classList.remove('open'); }));
}

// ── TYPEWRITER ────────────────────────────────────────────────
(function(){
  const el=document.getElementById('typedText');
  if(!el) return;
  const txt="We Create, You Wow";
  let i=0;
  function type(){ if(i<=txt.length){ el.textContent=txt.slice(0,i++); setTimeout(type, 50); } }
  setTimeout(type, 7000);
})();

// ── CARD EXPAND ───────────────────────────────────────────────
document.addEventListener('click', e=>{
  const c=e.target.closest('.svc-card,.pf-card,.article-card');
  if(!c) return;
  c.classList.toggle('expanded');
});

// ── CARD SPOTLIGHT (light follows mouse inside) ───────────────
document.addEventListener('mousemove', e=>{
  const c=e.target.closest('.glass-card');
  if(!c) return;
  const r=c.getBoundingClientRect();
  c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
  c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  const s=c.querySelector('.card-spotlight');
  if(s) s.style.opacity='1';
});
document.addEventListener('mouseleave', e=>{
  const c=e.target.closest&&e.target.closest('.glass-card');
  if(c){ const s=c.querySelector('.card-spotlight'); if(s) s.style.opacity='0'; }
},true);

// ── 3D CARD TILT ──────────────────────────────────────────────
let lastTiltCard=null;
document.addEventListener('mousemove', e=>{
  const c=e.target.closest('.glass-card');
  if(c!==lastTiltCard){
    if(lastTiltCard){ lastTiltCard.style.transform=''; lastTiltCard.style.transition='transform .5s cubic-bezier(.23,1,.32,1)'; }
    lastTiltCard=c;
  }
  if(!c||c.classList.contains('expanded')) return;
  const r=c.getBoundingClientRect();
  const rx=((e.clientY-(r.top+r.height/2))/r.height)*-9;
  const ry=((e.clientX-(r.left+r.width/2))/r.width)*9;
  c.style.transform=`translateY(-12px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  c.style.transition='transform .07s linear';
});
document.addEventListener('mouseleave',()=>{
  if(lastTiltCard){ lastTiltCard.style.transform=''; lastTiltCard.style.transition='transform .5s cubic-bezier(.23,1,.32,1)'; lastTiltCard=null; }
},true);

// ── MAGNETIC BUTTONS ──────────────────────────────────────────
document.querySelectorAll('.hero-cta,.nav-cta,.ct-btn').forEach(b=>{
  b.addEventListener('mousemove', e=>{
    const r=b.getBoundingClientRect();
    b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.28}px,${(e.clientY-r.top-r.height/2)*.28}px)`;
  });
  b.addEventListener('mouseleave',()=>b.style.transform='');
});

// ── CLICK RIPPLE ──────────────────────────────────────────────
document.addEventListener('click', e=>{
  const t=e.target.closest('.glass-card,.hero-cta,.ct-btn,.nav-cta');
  if(!t) return;
  const r=t.getBoundingClientRect(), size=Math.max(r.width,r.height);
  const rip=document.createElement('span');
  rip.className='ripple';
  Object.assign(rip.style,{width:size+'px',height:size+'px',left:(e.clientX-r.left-size/2)+'px',top:(e.clientY-r.top-size/2)+'px',position:'absolute',pointerEvents:'none'});
  t.appendChild(rip); setTimeout(()=>rip.remove(),700);
});

// ── CHATBOT ───────────────────────────────────────────────────
const ct=document.getElementById('chatTrig'), cw=document.getElementById('chatWin'), cx=document.getElementById('chatX');
if(ct&&cw){ ct.addEventListener('click',()=>cw.classList.toggle('open')); cx?.addEventListener('click',()=>cw.classList.remove('open')); setTimeout(()=>{ if(!cw.classList.contains('open')) cw.classList.add('open'); },15000); }
document.getElementById('btt')?.addEventListener('click',()=>{ window.scrollTo({top:0,behavior:'smooth'}); });

// ── COUNTER ANIMATION ─────────────────────────────────────────
function animCounter(el) {
  const target=parseInt(el.dataset.target), sfx=el.dataset.sfx||'', dur=5000, s=performance.now();
  (function t(n){ const p=Math.min((n-s)/dur,1), e=1-Math.pow(1-p,3);
    el.textContent=Math.floor(e*target).toLocaleString('en-IN')+sfx;
    if(p<1) requestAnimationFrame(t); })(performance.now());
}

// ── GSAP CINEMATIC SCROLL ANIMATIONS ─────────────────────────
(function initGSAP(){
  if(typeof gsap==='undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Word-by-word section headers
  gsap.utils.toArray('.sh').forEach(sh=>{
    const sub=sh.querySelector('.sh-sub'), title=sh.querySelector('.sh-title'), line=sh.querySelector('.sh-line');
    const tl=gsap.timeline({scrollTrigger:{trigger:sh, start:'top 88%'}});
    if(sub) tl.from(sub,{opacity:0, y:20, duration:.5, ease:'power3.out'});
    if(title){
      title.innerHTML=title.innerHTML.replace(
        /(<[^>]+>[^<]*<\/[^>]+>|[^\s<]+)/g,
        m=>m.startsWith('<')?m:`<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="wi" style="display:inline-block">${m}</span></span>`
      );
      tl.from(title.querySelectorAll('.wi'),{y:'110%', opacity:0, duration:.75, stagger:.075, ease:'power3.out'},'-=.2');
    }
    if(line) tl.from(line,{scaleX:0, duration:.7, ease:'expo.out', transformOrigin:'left center'},'-=.4');
  });

  // About — left/right cinematic
  const ag=document.querySelector('.about-grid');
  if(ag){
    gsap.from('.about-photo-box',{x:-80, opacity:0, duration:1.2, ease:'power3.out', scrollTrigger:{trigger:ag, start:'top 80%'}});
    gsap.from('.about-content > *',{x:60, opacity:0, stagger:.1, duration:.95, ease:'power3.out', scrollTrigger:{trigger:ag, start:'top 80%'}});
  }

  // Counters
  ScrollTrigger.create({trigger:'.counters', start:'top 80%', onEnter:()=>{
    document.querySelectorAll('.counter-val').forEach(animCounter);
    gsap.from('.counter-box',{opacity:0, y:32, scale:.88, stagger:.14, duration:.75, ease:'back.out(1.6)'});
  }});

  // UNPREDICTABLE card entrances
  function revealCards(selector, triggerEl) {
    const cards=document.querySelectorAll(selector);
    cards.forEach((card,i)=>{
      const en=parseInt(card.dataset.en||0)%ENTRANCES.length;
      const from=ENTRANCES[en];
      ScrollTrigger.create({
        trigger:card, start:'top 88%',
        onEnter:()=>{
          gsap.fromTo(card,
            { x:from.x, y:from.y, rotation:from.rotate, scale:from.scale, rotationY:from.rotateY||0, opacity:0 },
            { x:0, y:0, rotation:0, scale:1, rotationY:0, opacity:1, duration:.85+Math.random()*.3, ease:'power3.out', delay:i*.04 }
          );
        }
      });
    });
  }

  revealCards('.svc-card');
  revealCards('.pf-card');
  revealCards('.article-card');
  revealCards('.disney-text p');
  revealCards('.disney-hl');

  // Disney video — dramatic scale
  gsap.from('.disney-vid',{scale:.78, opacity:0, duration:1.5, ease:'power4.out', scrollTrigger:{trigger:'.disney-vid', start:'top 82%'}});

  // Testimonial — scale bounce
  gsap.from('.test-box',{opacity:0, scale:.85, rotationX:15, duration:1.1, ease:'back.out(1.5)', scrollTrigger:{trigger:'.test-box', start:'top 84%'}});

  // Contact buttons stagger from different directions
  const btns=document.querySelectorAll('.ct-btn');
  btns.forEach((b,i)=>{
    gsap.from(b,{x:i%2===0?-60:60, opacity:0, duration:.7, ease:'power3.out',
      scrollTrigger:{trigger:b, start:'top 88%'}, delay:i*.1});
  });
  gsap.from('.ct-form > *',{y:35, opacity:0, stagger:.08, duration:.7, ease:'power3.out', scrollTrigger:{trigger:'.ct-form', start:'top 88%'}});

  // Footer fade
  gsap.from('.ft-grid > div',{opacity:0, y:40, stagger:.12, duration:.8, ease:'power3.out', scrollTrigger:{trigger:'.ft-grid', start:'top 90%'}});

  // Marquee fade in
  gsap.from('#marquee',{opacity:0, y:30, duration:.8, ease:'power3.out', scrollTrigger:{trigger:'#marquee', start:'top 90%'}});

  // Hero entrance — PREMIUM CRASH IN after loader completes
  const heroTl = gsap.timeline({delay:6.1});
  heroTl
    .from('.hero-logo',    {
      scale:0, rotation:180, opacity:0, duration:1.1,
      ease:'back.out(1.8)',
      transformOrigin:'50% 50%'
    })
    .from('.hero-h1',      {
      x:-100, opacity:0, duration:.85,
      ease:'power3.out',
      skewX:8
    },'-=.5')
    .from('.hero-p',       {
      x:100, opacity:0, duration:.75,
      ease:'power3.out',
      skewX:-8
    },'-=.6')
    .from('.hero-cta',     {
      y:60, scale:.6, opacity:0, duration:.8,
      ease:'back.out(1.6)'
    },'-=.3')
    .from('.hero-quick a', {
      y:40, opacity:0, scale:.4,
      stagger:.12, duration:.6,
      ease:'back.out(1.5)'
    },'-=.4')
    .from('.scroll-hint',  {opacity:0, duration:.5},'-=.2');

  // Scroll-tied parallax on bg orbs
  gsap.utils.toArray('.bg-orb').forEach((orb,i)=>{
    gsap.to(orb,{y:(i+1)*-130, ease:'none', scrollTrigger:{trigger:'body', start:'top top', end:'bottom bottom', scrub:2}});
  });

  // Section dividers — horizontal neon lines sweep across
  gsap.utils.toArray('section').forEach(s=>{
    gsap.from(s,{
      '--opacity':0,
      scrollTrigger:{trigger:s, start:'top 95%', end:'top 70%', scrub:1}
    });
  });
})();

// Loader is handled by loader.js (pure JS, no GSAP dependency)
// ── TESTIMONIAL SEE MORE ──────────────────────────────────
function toggleTestMore(btn) {
  var wrap = btn.closest('.test-quote-wrap');
  var more = wrap.querySelector('.test-more');
  var short = wrap.querySelector('.test-short');
  if (more.style.display === 'none') {
    more.style.display = 'inline';
    btn.textContent = 'See Less';
  } else {
    more.style.display = 'none';
    btn.textContent = 'See More';
  }
}
