/* ============================================================
   WOWSPIRE LOADER V16 — CINEMATIC BRAND FILM
   Complete rewrite. No W lines. Pure particle system.
   
   ACT 1 (0.00–1.30s): EXPLOSION
     Core dot → 120 pink particles blast outward
     3 shockwave rings, pink ambient flood
     True depth: near=large/fast, far=small/slow
   
   ACT 2 (1.30–2.00s): CONVERGENCE
     Particles reverse → magnetic pull to center
     Logo emerges as particles arrive — born from energy
   
   ACT 3 (2.00–4.50s): BRAND IDENTITY
     Logo spring in → rings → WOWSPIRE letters slam in
     Tagline neon letter-by-letter glow
     Line draws → 0.8s HOLD
   
   ACT 4 (4.50–5.30s): REVEAL
     Second explosion from logo
     Panels split → site revealed
     Particles become Three.js shapes (fade handoff)
   ============================================================ */
(function () {
  'use strict';

  /* ── ELEMENTS ──────────────────────────────────────────── */
  var loader  = document.getElementById('loader');
  if (!loader) return;

  var canvas  = document.getElementById('ldCanvas');
  var ctx     = canvas ? canvas.getContext('2d') : null;
  var logoEl  = document.getElementById('ldLogo');
  var textEl  = document.getElementById('ldText');
  var nameEl  = document.getElementById('ldName');
  var tagEl   = document.getElementById('ldTag');
  var lineEl  = document.getElementById('ldLine');
  var topEl   = document.getElementById('ldTop');
  var botEl   = document.getElementById('ldBot');
  var glowEl  = logoEl ? logoEl.querySelector('.ld-glow')  : null;
  var ring1   = logoEl ? logoEl.querySelector('.ld-ring')  : null;
  var ring2   = logoEl ? logoEl.querySelector('.ld-ring2') : null;
  var ltrs    = nameEl ? Array.from(nameEl.querySelectorAll('.ltr')) : [];
  var nltr    = tagEl  ? Array.from(tagEl.querySelectorAll('.nltr')) : [];

  /* ── SETUP ─────────────────────────────────────────────── */
  document.body.style.overflow = 'hidden';

  var W   = window.innerWidth;
  var H   = window.innerHeight;
  var cx  = W / 2;
  var cy  = H / 2;
  var mob = W < 768;

  if (canvas) { canvas.width = W; canvas.height = H; }

  /* ── SAFETY ────────────────────────────────────────────── */
  var finished = false, animId;

  function finish() {
    if (finished) return;
    finished = true;
    if (animId) cancelAnimationFrame(animId);
    loader.classList.add('done');
    document.body.style.overflow = '';
    document.body.classList.remove('loading');
    if (window.initScene) window.initScene();
  }
  setTimeout(finish, 11000); /* absolute safety */

  /* ── EASING ────────────────────────────────────────────── */
  function cl(v)    { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function pr(e,s,d){ return cl((e - s) / d); }
  function eo3(t)   { t=cl(t); return 1 - Math.pow(1-t, 3); }
  function eback(t) {
    t = cl(t);
    var c = 2.5;
    return 1 + (c+1)*Math.pow(t-1,3) + c*Math.pow(t-1,2);
  }

  /* ── PARTICLE SYSTEM ───────────────────────────────────── */
  var pts   = [];
  var rings = [];

  /* Size scale based on depth z (0.2=far, 1.0=near) */
  function pSize(z) { return 1.2 + z * 3.8; }
  function pSpd(z)  { return (mob?2.5:3.5) + z * (mob?5:7); }

  function buildParticles() {
    pts = []; rings = [];
    for (var i = 0; i < 120; i++) {
      var ang = (Math.PI * 2 / 120) * i + (Math.random() - .5) * .25;
      var z   = 0.2 + Math.random() * 0.8; /* depth */
      var spd = pSpd(z);
      pts.push({
        x: cx, y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        z: z,
        r: pSize(z),
        alpha: 0.7 + z * 0.3,
        decay: 0.004 + (1 - z) * 0.004,
        trail: [],
        phase: 'explode',  /* explode | converge | done */
        convStr: 0.025 + Math.random() * 0.02
      });
    }
    /* 3 shockwave rings */
    for (var j = 0; j < 3; j++) {
      rings.push({
        r: 4,
        maxR: Math.max(W, H) * (0.55 + j * 0.28),
        alpha: 0.85 - j * 0.18,
        spd: (mob ? 7 : 9) + j * 4.5
      });
    }
  }

  function convergeParticles() {
    pts.forEach(function(p) {
      if (p.phase === 'done') return;
      p.phase = 'converge';
    });
  }

  /* ── STATE ─────────────────────────────────────────────── */
  var ambA        = 0;
  var exploded    = false;
  var converging  = false;
  var logoStarted = false;
  var ringsShown  = false;
  var nameShown   = false;
  var tagShown    = false;
  var neonRunning = false;
  var neonIdx     = 0;
  var neonTimer   = 0;
  var splitDone   = false;
  var lastTs      = null;
  var elapsed     = 0;

  /* ── NEON LETTER-BY-LETTER ─────────────────────────────── */
  /* Skip spaces when lighting — only visible letters */
  function tickNeon(dt) {
    if (!neonRunning || !nltr.length) return;
    neonTimer += dt;
    if (neonTimer >= 0.13) {
      neonTimer = 0;
      /* Remove lit from previous */
      var prevIdx = (neonIdx - 1 + nltr.length) % nltr.length;
      nltr[prevIdx].classList.remove('lit');
      /* Skip spaces */
      while (nltr[neonIdx] && nltr[neonIdx].textContent === ' ') {
        neonIdx = (neonIdx + 1) % nltr.length;
      }
      nltr[neonIdx].classList.add('lit');
      neonIdx = (neonIdx + 1) % nltr.length;
    }
  }

  /* ── MAIN RAF LOOP ─────────────────────────────────────── */
  function frame(ts) {
    if (!lastTs) lastTs = ts;
    var dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;
    elapsed += dt;

    if (!ctx) { animId = requestAnimationFrame(frame); return; }
    ctx.clearRect(0, 0, W, H);

    /* ── ACT 1A: CORE PULSE (0–0.3s) ── */
    if (elapsed < 0.32) {
      var cp = pr(elapsed, 0.05, 0.27);
      var cr = 3 + eo3(cp) * 14;
      var cg = ctx.createRadialGradient(cx,cy,0,cx,cy,cr*7);
      cg.addColorStop(0, 'rgba(255,77,148,' + (eo3(cp)*0.65) + ')');
      cg.addColorStop(0.3, 'rgba(220,40,120,' + (eo3(cp)*0.3) + ')');
      cg.addColorStop(1, 'transparent');
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.arc(cx,cy,cr*7,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2);
      ctx.fillStyle = 'rgba(255,77,148,' + eo3(cp) + ')';
      ctx.shadowColor = '#FF4D94'; ctx.shadowBlur = 25;
      ctx.fill(); ctx.shadowBlur = 0;
    }

    /* ── ACT 1B: TRIGGER EXPLOSION at 0.3s ── */
    if (elapsed >= 0.3 && !exploded) {
      exploded = true;
      buildParticles();
    }

    /* ── ACT 1C: AMBIENT PINK FLOOD (0.3–1.1s) ── */
    if (elapsed > 0.3 && elapsed < 1.4) {
      var ap = elapsed < 0.65
        ? pr(elapsed, 0.3, 0.35) * 0.22
        : Math.max(0, 0.22 - pr(elapsed, 0.65, 0.75) * 0.22);
      if (ap > 0) {
        var ag = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*0.75);
        ag.addColorStop(0,   'rgba(255,77,148,'+(ap*1.2)+')');
        ag.addColorStop(0.35,'rgba(180,25,90,' +(ap*0.6)+')');
        ag.addColorStop(0.7, 'rgba(100,10,50,' +(ap*0.2)+')');
        ag.addColorStop(1,   'transparent');
        ctx.fillStyle = ag; ctx.fillRect(0,0,W,H);
      }
    }

    /* ── ACT 1D: SHOCKWAVE RINGS ── */
    rings.forEach(function(r) {
      if (r.r < r.maxR) { r.r += r.spd; r.alpha = Math.max(0, r.alpha - 0.007); }
      if (r.alpha > 0.01) {
        ctx.beginPath(); ctx.arc(cx,cy,r.r,0,Math.PI*2);
        ctx.strokeStyle = 'rgba(255,77,148,' + r.alpha + ')';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#FF4D94'; ctx.shadowBlur = 8;
        ctx.stroke(); ctx.shadowBlur = 0;
      }
    });

    /* ── ACT 2A: TRIGGER CONVERGENCE at 1.3s ── */
    if (elapsed >= 1.3 && !converging) {
      converging = true;
      convergeParticles();
    }

    /* ── DRAW PARTICLES ── */
    var arrivedCount = 0;
    var liveCount = 0;

    pts.forEach(function(p) {
      if (p.alpha <= 0.02) { arrivedCount++; return; }
      liveCount++;

      if (p.phase === 'converge') {
        var dx = cx - p.x, dy = cy - p.y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        p.vx += dx * p.convStr;
        p.vy += dy * p.convStr;
        p.vx *= 0.80; p.vy *= 0.80;
        if (dist < 12) {
          p.alpha -= 0.045; /* dissolve near center */
          if (p.alpha < 0) { p.alpha = 0; p.phase = 'done'; }
        }
      }

      /* Trail */
      p.trail.push({ x: p.x, y: p.y, a: p.alpha });
      if (p.trail.length > 12) p.trail.shift();
      for (var t = 1; t < p.trail.length; t++) {
        var ta = p.trail[t-1].a * (t / p.trail.length) * 0.5;
        ctx.beginPath();
        ctx.moveTo(p.trail[t-1].x, p.trail[t-1].y);
        ctx.lineTo(p.trail[t].x,   p.trail[t].y);
        ctx.strokeStyle = 'rgba(255,77,148,' + ta + ')';
        ctx.lineWidth   = p.r * 0.65;
        ctx.stroke();
      }

      /* Volumetric glow halo */
      var hg = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5.5);
      hg.addColorStop(0, 'rgba(255,77,148,' + (p.alpha * 0.5 * p.z) + ')');
      hg.addColorStop(1, 'transparent');
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*5.5,0,Math.PI*2); ctx.fill();

      /* Core dot */
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle   = 'rgba(255,77,148,' + p.alpha + ')';
      ctx.shadowColor = '#FF4D94';
      ctx.shadowBlur  = 8 + p.z * 6;
      ctx.fill(); ctx.shadowBlur = 0;

      /* Move */
      p.x += p.vx; p.y += p.vy;
      if (p.phase === 'explode') { p.vx *= 0.972; p.vy *= 0.972; }
      p.alpha -= p.decay;
      if (p.alpha < 0) { p.alpha = 0; p.phase = 'done'; }
    });

    /* ── ACT 2B: LOGO EMERGES as particles converge ── */
    /* Logo opacity tied to how many particles have arrived */
    if (elapsed > 1.3 && elapsed <= 5.5) {
      var convRatio = converging
        ? cl((120 - liveCount) / 120)
        : 0;
      var logoP  = pr(elapsed, 1.3, 0.75);
      var logoE  = eback(logoP);
      var logoOp = Math.max(convRatio * 0.6, eo3(logoP));
      var sc     = 0.05 + logoE * 0.95;
      if (logoP >= 1) { sc = 1 + Math.sin(elapsed * 2.2) * 0.022; }
      logoEl.style.opacity   = String(Math.min(1, logoOp * 1.1));
      logoEl.style.transform = 'translate(-50%,-50%) scale(' + sc + ')';
      if (!ringsShown && elapsed > 2.05) {
        ringsShown = true;
        if (ring1) ring1.style.opacity = '1';
        if (ring2) ring2.style.opacity = '1';
        if (glowEl) glowEl.style.opacity = '1';
      }
    }

    /* ── ACT 3A: TEXT BLOCK VISIBLE at 2.15s ── */
    if (elapsed > 2.15 && !nameShown) {
      nameShown = true;
      textEl.style.opacity = '1';
    }

    /* ── ACT 3B: LETTERS SLAM IN (2.15–3.05s, 0.11s stagger) ── */
    if (elapsed > 2.15) {
      var letterDirs = [
        {tx:-130,ty:0},   {tx:0,ty:-130}, {tx:130,ty:0},  {tx:0,ty:130},
        {tx:-110,ty:-110},{tx:0,ty:0,s0:.02},{tx:110,ty:-110},{tx:110,ty:110}
      ];
      ltrs.forEach(function(ltr, i) {
        var st  = 2.15 + i * 0.11;
        var p   = pr(elapsed, st, 0.42);
        if (p <= 0) return;
        var e   = eback(p);
        var d   = letterDirs[i] || {tx:0,ty:-100};
        var tx2 = (d.tx||0) * (1-e);
        var ty2 = (d.ty||0) * (1-e);
        var sc2 = d.s0 ? d.s0 + (1-d.s0)*e : 0.15 + 0.85*e;
        ltr.style.opacity   = String(Math.min(1, e * 1.6));
        ltr.style.transform = 'translate('+tx2+'px,'+ty2+'px) scale('+sc2+')';
      });
    }

    /* ── ACT 3C: TAGLINE VISIBLE at 3.1s ── */
    if (elapsed > 3.1 && !tagShown) {
      tagShown = true;
      tagEl.style.opacity = '1';
    }
    /* Tagline fade in */
    if (elapsed > 3.1) {
      var tgP = pr(elapsed, 3.1, 0.4);
      tagEl.style.opacity = String(eo3(tgP));
    }

    /* ── ACT 3D: NEON LETTER GLOW starts at 3.5s ── */
    if (elapsed > 2.8 && !neonRunning) {
      neonRunning = true;
    }
    if (neonRunning) tickNeon(dt);

    /* ── ACT 3E: LINE DRAWS at 3.3s ── */
    if (elapsed > 3.3) {
      var lp = pr(elapsed, 3.3, 0.6);
      lineEl.style.width = (Math.min(mob?160:220, W*0.28) * eo3(lp)) + 'px';
    }

    /* ── ACT 4: SECOND EXPLOSION + REVEAL at 4.5s ── */
    if (elapsed > 5.2 && !splitDone) {
      splitDone = true;
      cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, W, H);

      /* Panels split */
      if (topEl) topEl.classList.add('go');
      if (botEl) botEl.classList.add('go');

      /* Fade ALL loader content */
      [logoEl, textEl].forEach(function(el) {
        if (!el) return;
        el.style.transition = 'opacity 0.35s ease';
        el.style.opacity    = '0';
      });

      setTimeout(finish, 820);
      return;
    }

    animId = requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  /* BFCache fix */
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      finished = false;
      loader.classList.remove('done');
      document.body.style.overflow = 'hidden';
      setTimeout(finish, 250);
    }
  });

}());
