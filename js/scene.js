/* ============================================================
   WOWSPIRE V16 — scene.js — Complete Rewrite
   Stars · Mobile Touch Ripple · Three.js Anti-Gravity
   NO grey/ash — all pink/violet glowing shapes
   ALL shapes in corners — center zone clear
   ============================================================ */
'use strict';

/* ── STAR FIELD ──────────────────────────────────────────── */
(function () {
  var c = document.getElementById('stars');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H, stars = [], mouse = { x: .5, y: .5 };

  function resize() {
    W = c.width  = window.innerWidth;
    H = c.height = window.innerHeight;
    stars = [];
    var n = Math.min(Math.floor(W * H / 4800), 300);
    for (var i = 0; i < n; i++) {
      stars.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.4 + 0.15,
        a:  Math.random() * 0.55 + 0.2,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.3 + 0.07,
        dx: (Math.random() - .5) * 0.065,
        dy: (Math.random() - .5) * 0.055,
        pink: Math.random() > 0.82
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(function(s) {
      s.ph += s.sp * 0.02;
      var a = s.a * (0.42 + 0.58 * Math.sin(s.ph));
      s.x += s.dx + (mouse.x - .5) * 0.013;
      s.y += s.dy + (mouse.y - .5) * 0.010;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < -4) s.y = H; if (s.y > H + 4) s.y = 0;
      if (s.pink) {
        var g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        g.addColorStop(0, 'rgba(255,77,148,' + (a * .85) + ')');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.pink
        ? 'rgba(255,120,180,' + a + ')'
        : 'rgba(255,255,255,' + a + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  });
  resize(); draw();
}());

/* ── MOBILE TOUCH RIPPLE ─────────────────────────────────── */
(function() {
  if (!('ontouchstart' in window)) return;

  var rc = document.createElement('canvas');
  rc.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;';
  document.body.appendChild(rc);
  var rctx = rc.getContext('2d');
  var rW, rH, ripples = [];

  function resize() { rW = rc.width = window.innerWidth; rH = rc.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function addRipple(x, y) {
    /* Primary ring */
    ripples.push({ x:x, y:y, r:0, maxR:Math.min(rW,rH)*0.28, alpha:.75, spd:7, type:'ring' });
    /* Secondary smaller ring */
    setTimeout(function() {
      ripples.push({ x:x, y:y, r:0, maxR:Math.min(rW,rH)*0.15, alpha:.5, spd:5, type:'ring2' });
    }, 180);
    /* Notify Three.js for magnetic repulsion */
    if (window.touchRepel) window.touchRepel(x, y);
  }

  window.addEventListener('touchstart', function(e) {
    for (var i = 0; i < e.touches.length; i++) {
      addRipple(e.touches[i].clientX, e.touches[i].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0 && Math.random() > 0.8) {
      addRipple(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function drawRipples() {
    rctx.clearRect(0, 0, rW, rH);
    ripples = ripples.filter(function(r) { return r.alpha > 0.02; });
    ripples.forEach(function(r) {
      r.r    += r.spd;
      r.alpha *= 0.91;
      rctx.beginPath();
      rctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      rctx.strokeStyle = 'rgba(255,77,148,' + r.alpha + ')';
      rctx.lineWidth   = r.type === 'ring' ? 2 : 1.2;
      rctx.shadowColor = '#FF4D94';
      rctx.shadowBlur  = 8;
      rctx.stroke();
      rctx.shadowBlur  = 0;
      /* Inner glow */
      if (r.r < r.maxR * 0.5) {
        var grd = rctx.createRadialGradient(r.x,r.y,0,r.x,r.y,r.r);
        grd.addColorStop(0, 'rgba(255,77,148,' + (r.alpha * 0.25) + ')');
        grd.addColorStop(1, 'transparent');
        rctx.fillStyle = grd;
        rctx.beginPath(); rctx.arc(r.x,r.y,r.r,0,Math.PI*2); rctx.fill();
      }
    });
    requestAnimationFrame(drawRipples);
  }
  drawRipples();
}());

/* ── THREE.JS — deferred until after loader ──────────────── */
window.initScene = function() {
  var c = document.getElementById('threeCanvas');
  if (!c || typeof THREE === 'undefined') return;

  var mob = window.innerWidth < 768;

  var renderer = new THREE.WebGLRenderer({ canvas: c, antialias: !mob, alpha: true });
  renderer.setPixelRatio(mob ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 80);
  camera.position.z = 6;

  /* ── LIGHTS ── */
  var pl1 = new THREE.PointLight(0xFF4D94, 6, 28); pl1.position.set(4, 4, 3); scene.add(pl1);
  var pl2 = new THREE.PointLight(0x9B4DFF, 5, 24); pl2.position.set(-5, -3, 2); scene.add(pl2);
  var pl3 = new THREE.PointLight(0xFF4D94, 3, 20); pl3.position.set(0, 0, 4); scene.add(pl3);
  scene.add(new THREE.AmbientLight(0xffffff, 0.08));

  /* ── MATERIALS — all glowing, no grey ── */
  /* Glowing solid — emissive from inside */
  function solidGlow(color, opacity) {
    return new THREE.MeshPhongMaterial({
      color: color, emissive: color,
      emissiveIntensity: 0.5,
      transparent: true, opacity: opacity,
      shininess: 120, side: THREE.DoubleSide
    });
  }
  /* Electric neon wireframe */
  function neonWire(color, opacity) {
    return new THREE.MeshBasicMaterial({
      color: color, wireframe: true,
      transparent: true, opacity: opacity
    });
  }
  /* Bright line */
  function brightLine(color, opacity) {
    return new THREE.LineBasicMaterial({
      color: color, transparent: true, opacity: opacity
    });
  }

  /* ── SHAPE REGISTRY ── */
  var shapes = [];

  function addShape(mesh, x, y, z, rx, ry, fA, fS) {
    mesh.position.set(x, y, z);
    if (rx) mesh.rotation.x = rx;
    if (ry) mesh.rotation.y = ry;
    scene.add(mesh);
    shapes.push({
      mesh: mesh,
      ox: x, oy: y,           /* fixed origin — NEVER changes */
      rx: 0.003 + Math.random() * 0.004,
      ry: 0.004 + Math.random() * 0.005,
      fA: fA || (0.12 + Math.random() * 0.14), /* float amplitude — small */
      fS: fS || (0.18 + Math.random() * 0.32), /* float speed */
      ph: Math.random() * Math.PI * 2,
      vx: 0, vy: 0            /* repulsion velocity */
    });
  }

  if (mob) {
    /* ── MOBILE: 5 shapes in corners — all glowing ── */
    /* Top-left */
    addShape(
      new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.18, 10, 28),
        solidGlow(0xFF4D94, 0.35)),
      -3.0, 2.5, -4.0, 0.4, 0.5
    );
    /* Top-right */
    addShape(
      new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0),
        neonWire(0xFF4D94, 0.6)),
      3.2, 2.2, -3.5, 0.2, 0.8
    );
    /* Bottom-left */
    addShape(
      new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0),
        solidGlow(0x9B4DFF, 0.3)),
      -2.8, -2.5, -4.5, 0.6, 0.3
    );
    /* Bottom-right */
    addShape(
      new THREE.Mesh(new THREE.DodecahedronGeometry(0.45, 0),
        neonWire(0xFF80B4, 0.55)),
      3.0, -2.2, -5.0, 0.3, 0.7
    );
    /* Center-bottom */
    addShape(
      new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.1, 7, 22),
        solidGlow(0xFF4D94, 0.28)),
      0.0, -3.5, -5.5, 1.0, 0.2
    );

  } else {
    /* ── DESKTOP: rich set — ALL in corners, center clear ── */

    /* GLOWING SOLIDS */
    addShape(
      new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.24, 12, 32),
        solidGlow(0xFF4D94, 0.32)),
      -5.2, 2.8, -4.0, 0.4, 0.6
    );
    addShape(
      new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 0),
        solidGlow(0x9B4DFF, 0.28)),
      5.0, -2.0, -3.5, 0.2, 0.8
    );
    addShape(
      new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 0),
        solidGlow(0xFF4D94, 0.25)),
      5.2, 3.5, -5.0, 0.3, 0.5
    );

    /* NEON WIREFRAMES */
    addShape(
      new THREE.Mesh(new THREE.OctahedronGeometry(0.75, 0),
        neonWire(0xFF4D94, 0.65)),
      -4.8, -3.0, -4.5, 0.6, 0.3
    );
    addShape(
      new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.14, 8, 26),
        neonWire(0xFF80B4, 0.55)),
      -5.5, 0.8, -3.5, 1.0, 0.4
    );
    addShape(
      new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0),
        neonWire(0xFFAACC, 0.5)),
      5.5, -0.5, -3.0, 0.7, 0.5
    );

    /* MARKETING THEMED */

    /* Phone frame — neon pink glow */
    (function() {
      var geo   = new THREE.BoxGeometry(0.65, 1.25, 0.07);
      var edges = new THREE.EdgesGeometry(geo);
      var mesh  = new THREE.LineSegments(edges, brightLine(0xFF4D94, 0.65));
      /* Screen glow inside phone */
      var scrn  = new THREE.Mesh(
        new THREE.PlaneGeometry(0.45, 0.85),
        new THREE.MeshBasicMaterial({ color: 0xFF4D94, transparent: true, opacity: 0.08 })
      );
      mesh.add(scrn);
      addShape(mesh, 4.5, 4.2, -5.5, 0.1, 0.2, 0.14, 0.22);
    }());

    /* Chart bars — pulse rhythmically */
    (function() {
      var g = new THREE.Group();
      var heights = [0.35, 0.65, 0.45, 0.80, 0.55, 0.70];
      var colors  = [0xFF4D94, 0xFF80B4, 0xFF4D94, 0x9B4DFF, 0xFF4D94, 0xFF80B4];
      heights.forEach(function(h, i) {
        var bar = new THREE.Mesh(
          new THREE.BoxGeometry(0.10, h, 0.07),
          solidGlow(colors[i], 0.45)
        );
        bar.position.set((i - 2.5) * 0.16, h/2 - 0.45, 0);
        bar._baseH  = h;
        bar._phase  = i * 0.8;
        g.add(bar);
      });
      g.position.set(-5.8, -3.5, -5.0);
      scene.add(g);
      shapes.push({
        mesh: g, ox: -5.8, oy: -3.5,
        rx: 0.001, ry: 0.004,
        fA: 0.10, fS: 0.22,
        ph: Math.random() * Math.PI * 2,
        vx: 0, vy: 0,
        isChart: true
      });
    }());

    /* Radar rings — concentric, rotating */
    (function() {
      var g = new THREE.Group();
      [0.35, 0.62, 0.90].forEach(function(r, i) {
        var ring = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.018, 8, 40),
          solidGlow(i === 1 ? 0x9B4DFF : 0xFF4D94, 0.38 - i * 0.06)
        );
        ring._rotSpd = 0.008 + i * 0.005;
        g.add(ring);
      });
      g.position.set(6.0, -4.0, -5.5);
      scene.add(g);
      shapes.push({
        mesh: g, ox: 6.0, oy: -4.0,
        rx: 0.002, ry: 0.003,
        fA: 0.12, fS: 0.20,
        ph: Math.random() * Math.PI * 2,
        vx: 0, vy: 0,
        isRadar: true
      });
    }());

    /* Point particle cloud — digital dust */
    (function() {
      var ptCount = 90;
      var ptPos   = new Float32Array(ptCount * 3);
      for (var i = 0; i < ptCount; i++) {
        /* Keep in margins — away from center */
        var side  = Math.random() > 0.5 ? 1 : -1;
        var edge  = 4.5 + Math.random() * 3.5;
        ptPos[i*3]     = side * edge;
        ptPos[i*3+1]   = (Math.random() - 0.5) * 14;
        ptPos[i*3+2]   = -3.5 - Math.random() * 7;
      }
      var ptGeo = new THREE.BufferGeometry();
      ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
      scene.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({
        color: 0xFF4D94, size: 0.055,
        transparent: true, opacity: 0.55
      })));
    }());
  }

  /* ── TOUCH REPULSION ── */
  window.touchRepel = function(screenX, screenY) {
    var nx = (screenX / window.innerWidth) * 2 - 1;
    var ny = -(screenY / window.innerHeight) * 2 + 1;
    shapes.forEach(function(s) {
      var dx = s.mesh.position.x - nx * 5;
      var dy = s.mesh.position.y - ny * 5;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 3.5) {
        var force = (3.5 - dist) / 3.5 * 0.9;
        s.vx += (dx / (dist+0.1)) * force;
        s.vy += (dy / (dist+0.1)) * force;
      }
    });
  };

  /* ── MOUSE/TOUCH PARALLAX ── */
  var mx = 0, my = 0, tmx = 0, tmy = 0;
  var scrollY = 0, lastScroll = 0, scrollV = 0;

  window.addEventListener('mousemove', function(e) {
    tmx = (e.clientX / window.innerWidth  - 0.5) * 2;
    tmy = -(e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
      tmx = (e.touches[0].clientX / window.innerWidth  - 0.5) * 1.5;
      tmy = -(e.touches[0].clientY / window.innerHeight - 0.5) * 1.5;
    }
  }, { passive: true });
  window.addEventListener('scroll', function() {
    scrollV     = window.scrollY - lastScroll;
    lastScroll  = scrollY = window.scrollY;
  });
  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  /* ── ANIMATE ── */
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var t  = clock.getElapsedTime();

    mx += (tmx - mx) * 0.04;
    my += (tmy - my) * 0.04;
    scrollV *= 0.86;

    /* Camera gentle parallax — capped */
    camera.position.x += (mx * 0.20 - camera.position.x) * 0.022;
    camera.position.y += (my * 0.14 - camera.position.y) * 0.022;
    camera.lookAt(scene.position);

    var sf = scrollY * 0.00055;

    shapes.forEach(function(s, idx) {
      /* Rotate */
      s.mesh.rotation.x += s.rx;
      s.mesh.rotation.y += s.ry;
      s.ph += 0.012;

      /* Repulsion spring — decay back to origin */
      s.vx *= 0.87; s.vy *= 0.87;

      /* Float — pure sine, origin NEVER mutates */
      var fy  = Math.sin(s.ph * s.fS + idx * 1.1) * s.fA;
      var fx  = Math.cos(s.ph * s.fS * 0.65 + idx * 1.6) * (s.fA * 0.25);

      /* Scroll parallax */
      var depth = Math.max(Math.abs(s.mesh.position.z), 3.5);
      var sp    = sf * (3.5 / depth);

      /* Mouse parallax — hard capped */
      var mpx = Math.max(-0.30, Math.min(0.30, mx * (0.05 / depth * 4)));

      /* Apply — vx/vy is temporary repulsion offset */
      s.mesh.position.y = s.oy + fy - sp + s.vy * 0.15;
      s.mesh.position.x = s.ox + fx + mpx + s.vx * 0.15;

      /* Chart bar pulse */
      if (s.isChart) {
        s.mesh.children.forEach(function(bar) {
          if (bar._baseH === undefined) return;
          var pulse = 1 + Math.sin(t * 1.8 + bar._phase) * 0.18;
          bar.scale.y = pulse;
          bar.position.y = (bar._baseH * pulse) / 2 - 0.45;
        });
      }

      /* Radar ring counter-rotate */
      if (s.isRadar) {
        s.mesh.children.forEach(function(ring) {
          if (ring._rotSpd) ring.rotation.z += ring._rotSpd;
        });
      }
    });

    /* Pulse lights */
    pl1.intensity = 5.5 + Math.sin(t * 1.8) * 1.2;
    pl2.intensity = 4.0 + Math.cos(t * 1.4) * 0.9;
    pl3.intensity = 2.5 + Math.sin(t * 2.2) * 0.7;
    pl1.position.x = 4  + Math.sin(t * 0.45) * 1.8;
    pl2.position.y = -3 + Math.cos(t * 0.38) * 1.8;

    renderer.render(scene, camera);
  }

  animate();
};
