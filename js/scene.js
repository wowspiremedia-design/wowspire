/* ============================================================
   WOWSPIRE V6 — scene.js
   Stars · Loader Particles · Full-Page Three.js Anti-Gravity
   Mobile: reduced shapes, same full experience
   ============================================================ */
'use strict';

/* ── STAR FIELD ────────────────────────────────────────────── */
(function () {
  var c = document.getElementById('stars');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H, stars = [], mouse = { x: .5, y: .5 };

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    stars = [];
    var n = Math.min(Math.floor(W * H / 5000), 300);
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + .15,
        a: Math.random() * .6 + .2,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * .3 + .07,
        dx: (Math.random() - .5) * .07,
        dy: (Math.random() - .5) * .06,
        pink: Math.random() > .82
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(function (s) {
      s.ph += s.sp * .02;
      var a = s.a * (.42 + .58 * Math.sin(s.ph));
      s.x += s.dx + (mouse.x - .5) * .014;
      s.y += s.dy + (mouse.y - .5) * .01;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < -4) s.y = H; if (s.y > H + 4) s.y = 0;
      if (s.pink) {
        var g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        g.addColorStop(0, 'rgba(255,77,148,' + (a * .9) + ')');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.pink ? 'rgba(255,140,180,' + a + ')' : 'rgba(255,255,255,' + a + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  });
  resize(); draw();
}());

/* ── LOADER PARTICLE CANVAS ────────────────────────────────── */
(function () {
  var c = document.getElementById('ldCanvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H, pts = [], rings = [], animId;

  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  window.ldExplode = function () {
    pts = []; rings = [];
    var cx = W / 2, cy = H / 2;
    for (var i = 0; i < 100; i++) {
      var ang = (Math.PI * 2 * i / 100) + (Math.random() - .5) * .2;
      var spd = 2.5 + Math.random() * 8;
      pts.push({
        x: cx, y: cy, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        r: 1.5 + Math.random() * 3.5, alpha: 1,
        decay: .006 + Math.random() * .008,
        trail: [], pink: Math.random() > .4, glow: Math.random() > .55,
        converging: false, cx: cx, cy: cy
      });
    }
    for (var j = 0; j < 3; j++) {
      rings.push({ r: 2, max: 300 + j * 140, a: .9, spd: 5 + j * 3.5 });
    }
    cancelAnimationFrame(animId);
    loop();
  };

  window.ldConverge = function () {
    pts.forEach(function (p) {
      p.converging = true;
      p.convStr = .035 + Math.random() * .025;
    });
  };

  function loop() {
    ctx.clearRect(0, 0, W, H);
    var cx = W / 2, cy = H / 2;

    /* Core glow */
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
    g.addColorStop(0, 'rgba(255,77,148,.22)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2); ctx.fill();

    /* Rings */
    rings.forEach(function (r) {
      r.r = Math.min(r.r + r.spd, r.max); r.a = Math.max(0, r.a - .008);
      if (r.a > 0) {
        ctx.beginPath(); ctx.arc(cx, cy, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,77,148,' + r.a + ')';
        ctx.lineWidth = 1.5; ctx.stroke();
      }
    });

    /* Particles */
    var live = pts.filter(function (p) { return p.alpha > .04; });
    live.forEach(function (p) {
      if (p.converging) {
        p.vx += (p.cx - p.x) * p.convStr;
        p.vy += (p.cy - p.y) * p.convStr;
        p.vx *= .88; p.vy *= .88;
      }
      p.trail.push({ x: p.x, y: p.y, a: p.alpha });
      if (p.trail.length > 10) p.trail.shift();

      /* Trail */
      for (var t = 1; t < p.trail.length; t++) {
        var ta = p.trail[t - 1].a * (t / p.trail.length) * .5;
        ctx.beginPath();
        ctx.moveTo(p.trail[t - 1].x, p.trail[t - 1].y);
        ctx.lineTo(p.trail[t].x, p.trail[t].y);
        ctx.strokeStyle = p.pink ? 'rgba(255,77,148,' + ta + ')' : 'rgba(255,255,255,' + (ta * .7) + ')';
        ctx.lineWidth = p.r * .6; ctx.stroke();
      }

      /* Glow */
      if (p.glow) {
        var hg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5.5);
        hg.addColorStop(0, p.pink ? 'rgba(255,77,148,' + (p.alpha * .5) + ')' : 'rgba(255,255,255,' + (p.alpha * .25) + ')');
        hg.addColorStop(1, 'transparent');
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5.5, 0, Math.PI * 2); ctx.fill();
      }

      /* Dot */
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.pink ? 'rgba(255,77,148,' + p.alpha + ')' : 'rgba(255,255,255,' + (p.alpha * .9) + ')';
      ctx.fill();

      p.x += p.vx; p.y += p.vy;
      if (!p.converging) { p.vx *= .97; p.vy *= .97; }
      p.alpha -= p.decay;
    });

    /* Constellation */
    var limit = Math.min(live.length, 45);
    for (var i = 0; i < limit; i++) {
      for (var j = i + 1; j < limit; j++) {
        var dx = live[i].x - live[j].x, dy = live[i].y - live[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(live[i].x, live[i].y); ctx.lineTo(live[j].x, live[j].y);
          ctx.strokeStyle = 'rgba(255,77,148,' + ((1 - dist / 90) * .13) + ')';
          ctx.lineWidth = .4; ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(loop);
  }

  window.ldStop = function () {
    cancelAnimationFrame(animId);
    ctx.clearRect(0, 0, W, H);
  };
}());

/* ── THREE.JS FULL-PAGE ANTI-GRAVITY ───────────────────────── */
(function () {
  var c = document.getElementById('threeCanvas');
  if (!c || typeof THREE === 'undefined') return;

  var isMobile = window.innerWidth < 768;

  var renderer = new THREE.WebGLRenderer({ canvas: c, antialias: !isMobile, alpha: true });
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 80);
  camera.position.z = 6;

  /* Lights */
  var pl1 = new THREE.PointLight(0xFF4D94, 5, 30); pl1.position.set(3, 3, 2); scene.add(pl1);
  var pl2 = new THREE.PointLight(0x9b59f5, 4, 25); pl2.position.set(-4, -2, 2); scene.add(pl2);
  scene.add(new THREE.AmbientLight(0xffffff, .18));

  function wire(col, op) {
    return new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: op });
  }
  function solid(col, op) {
    return new THREE.MeshPhongMaterial({
      color: col, transparent: true, opacity: op,
      emissive: col, emissiveIntensity: .12, shininess: 60
    });
  }

  var shapes = [];

  function addS(mesh, x, y, z) {
    mesh.position.set(x, y, z);
    scene.add(mesh);
    shapes.push({
      mesh: mesh,
      ox: x, oy: y,
      rx: .003 + Math.random() * .005,
      ry: .004 + Math.random() * .006,
      fA: .25 + Math.random() * .35,
      fS: .22 + Math.random() * .4,
      ph: Math.random() * Math.PI * 2
    });
  }

  if (isMobile) {
    /* ── MOBILE: 6 shapes, closer, full opacity ─────────── */
    addS(new THREE.Mesh(new THREE.TorusGeometry(.9, .22, 9, 28),    wire(0xFF4D94, .55)),  -2.8,  1.5, -3.0);
    addS(new THREE.Mesh(new THREE.IcosahedronGeometry(.75, 0),       wire(0xffffff, .35)),   2.6, -1.2, -2.5);
    addS(new THREE.Mesh(new THREE.OctahedronGeometry(.7, 0),         wire(0xFF4D94, .45)),  -2.2, -2.2, -3.5);
    addS(new THREE.Mesh(new THREE.DodecahedronGeometry(.6, 0),       wire(0xFF4D94, .38)),   2.0,  2.2, -4.0);
    addS(new THREE.Mesh(new THREE.TorusGeometry(.55, .14, 7, 20),    wire(0xffffff, .32)),  -0.5, -3.0, -4.5);
    addS(new THREE.Mesh(new THREE.IcosahedronGeometry(.5, 0),        solid(0xFF4D94, .08)),  0.0,  0.0, -6.0);
  } else {
    /* ── DESKTOP: full set — closer and bigger ──────────── */
    /* Geometric */
    addS(new THREE.Mesh(new THREE.TorusGeometry(1.0, .26, 10, 30),  wire(0xFF4D94, .42)), -4.5,  2.2, -3.5);
    addS(new THREE.Mesh(new THREE.IcosahedronGeometry(.9, 0),        wire(0xffffff, .28)),  4.2, -1.6, -3.0);
    addS(new THREE.Mesh(new THREE.OctahedronGeometry(.85, 0),        wire(0xFF4D94, .36)), -3.2, -2.6, -4.0);
    addS(new THREE.Mesh(new THREE.DodecahedronGeometry(.75, 0),      wire(0xFF4D94, .30)), -1.2,  3.2, -4.5);
    addS(new THREE.Mesh(new THREE.TorusGeometry(.65, .16, 8, 24),   wire(0xffffff, .28)),  3.8,  2.8, -4.5);
    addS(new THREE.Mesh(new THREE.IcosahedronGeometry(.6, 0),        wire(0xffffff, .22)), -5.0, -0.8, -3.5);
    addS(new THREE.Mesh(new THREE.OctahedronGeometry(.55, 0),        wire(0xff80b4, .38)),  5.2,  1.2, -3.0);
    addS(new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 0),       solid(0xFF4D94, .05)), -2.0, -1.0, -7.0);

    /* Phone wireframe */
    (function makePhone(x, y, z, col, op) {
      var geo = new THREE.BoxGeometry(.7, 1.35, .08);
      var edges = new THREE.EdgesGeometry(geo);
      var m = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: op }));
      m.position.set(x, y, z);
      scene.add(m);
      shapes.push({ mesh: m, ox: x, oy: y, rx: .002, ry: .004, fA: .22, fS: .28, ph: Math.random() * Math.PI * 2 });
    }(3.8, 3.8, -5.5, 0xFF4D94, .45));
    (function makePhone(x, y, z, col, op) {
      var geo = new THREE.BoxGeometry(.7, 1.35, .08);
      var edges = new THREE.EdgesGeometry(geo);
      var m = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: op }));
      m.position.set(x, y, z);
      scene.add(m);
      shapes.push({ mesh: m, ox: x, oy: y, rx: .002, ry: .004, fA: .22, fS: .28, ph: Math.random() * Math.PI * 2 });
    }(-5.5, -4.0, -6.0, 0xffffff, .25));

    /* Chart bars */
    (function makeChart(x, y, z) {
      var g = new THREE.Group();
      [.4, .7, .5, .85, .6, .75].forEach(function (h, i) {
        var bar = new THREE.Mesh(
          new THREE.BoxGeometry(.12, h, .08),
          wire(i % 2 === 0 ? 0xFF4D94 : 0xffffff, .32)
        );
        bar.position.set((i - 2.5) * .18, h / 2 - .5, 0);
        g.add(bar);
      });
      g.position.set(x, y, z);
      scene.add(g);
      shapes.push({ mesh: g, ox: x, oy: y, rx: .001, ry: .005, fA: .2, fS: .25, ph: Math.random() * Math.PI * 2 });
    }(5.5, -3.0, -5.0));

    /* Radar rings */
    (function makeRadar(x, y, z) {
      var g = new THREE.Group();
      [.4, .7, 1.0].forEach(function (r) {
        g.add(new THREE.Mesh(new THREE.TorusGeometry(r, .022, 7, 36), wire(0xFF4D94, .35 - .08 * (r - .4))));
      });
      g.position.set(x, y, z);
      scene.add(g);
      shapes.push({ mesh: g, ox: x, oy: y, rx: .002, ry: .003, fA: .28, fS: .2, ph: Math.random() * Math.PI * 2 });
    }(-4.5, 4.5, -5.5));
  }

  /* Point cloud */
  var ptCount = isMobile ? 50 : 120;
  var ptPos = new Float32Array(ptCount * 3);
  for (var i = 0; i < ptCount; i++) {
    ptPos[i * 3]     = (Math.random() - .5) * (isMobile ? 12 : 22);
    ptPos[i * 3 + 1] = (Math.random() - .5) * (isMobile ? 10 : 16);
    ptPos[i * 3 + 2] = -2.5 - Math.random() * (isMobile ? 4 : 8);
  }
  var ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
  scene.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({
    color: 0xFF4D94, size: isMobile ? .07 : .055, transparent: true, opacity: .5
  })));

  /* Mouse + scroll */
  var mx = 0, my = 0, tmx = 0, tmy = 0;
  var scrollY = 0, lastScroll = 0, scrollV = 0;

  window.addEventListener('mousemove', function (e) {
    tmx = (e.clientX / window.innerWidth - .5) * 2;
    tmy = -(e.clientY / window.innerHeight - .5) * 2;
  });
  /* Touch parallax for mobile */
  window.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      tmx = (e.touches[0].clientX / window.innerWidth - .5) * 1.5;
      tmy = -(e.touches[0].clientY / window.innerHeight - .5) * 1.5;
    }
  }, { passive: true });
  window.addEventListener('scroll', function () {
    scrollV = window.scrollY - lastScroll;
    lastScroll = scrollY = window.scrollY;
  });
  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    mx += (tmx - mx) * .04;
    my += (tmy - my) * .04;
    scrollV *= .88;

    /* Camera — gentle, capped parallax */
    camera.position.x += (mx * .22 - camera.position.x) * .025;
    camera.position.y += (my * .16 - camera.position.y) * .025;
    camera.lookAt(scene.position);

    var sf = scrollY * .0006;

    shapes.forEach(function (s, idx) {
      s.mesh.rotation.x += s.rx;
      s.mesh.rotation.y += s.ry;
      s.ph += .013;

      /* Pure sine anti-gravity — no accumulation */
      var fy = Math.sin(s.ph * s.fS + idx) * s.fA;
      var fx = Math.cos(s.ph * s.fS * .65 + idx * 1.4) * (s.fA * .3);

      /* Scroll parallax depth-corrected */
      var depth = Math.max(Math.abs(s.mesh.position.z), 3);
      var sp = sf * (3 / depth);

      /* Mouse — strictly capped */
      var mpx = Math.max(-.35, Math.min(.35, mx * (.07 / depth * 4)));

      s.mesh.position.y = s.oy + fy - sp;
      s.mesh.position.x = s.ox + fx + mpx;
      /* s.ox NEVER mutates — baseline is fixed */
    });

    pl1.intensity = 4 + Math.sin(t * 1.7) * 1;
    pl2.intensity = 3 + Math.cos(t * 1.3) * .8;
    pl1.position.x = 3 + Math.sin(t * .45) * 1.5;
    pl2.position.y = -2 + Math.cos(t * .38) * 1.5;

    renderer.render(scene, camera);
  }
  animate();
}());
