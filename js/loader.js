/* ============================================================
   WOWSPIRE LOADER V6 — loader.js
   Minimal JS controller. CSS does all visuals.
   JS only: safety net + particle triggers + split timing.
   ============================================================ */
(function () {
  'use strict';

  var loader = document.getElementById('loader');
  if (!loader) return;

  var top   = loader.querySelector('.ld-top');
  var bot   = loader.querySelector('.ld-bot');
  var flash = loader.querySelector('.ld-flash');
  var logo  = loader.querySelector('.ld-logo img');

  /* ── Block scroll cleanly ─────────────────────────────── */
  document.body.style.overflow = 'hidden';
  document.body.style.height = '100vh';

  /* ── Safety net: always finish by 6s ─────────────────── */
  var done = false;
  function finish() {
    if (done) return;
    done = true;
    loader.classList.add('done');
    document.body.style.overflow = '';
    document.body.style.height = '';
    document.body.classList.remove('loading');
  }
  var safety = setTimeout(finish, 6000);

  /* ── Particle explosion at 0.55s ─────────────────────── */
  setTimeout(function () {
    if (window.ldExplode) window.ldExplode();
  }, 550);

  /* ── Converge particles toward logo at 1.4s ──────────── */
  setTimeout(function () {
    if (window.ldConverge) window.ldConverge();
  }, 1400);

  /* ── SPLIT at 2.65s ──────────────────────────────────── */
  setTimeout(function () {
    /* Stop particle canvas */
    if (window.ldStop) window.ldStop();

    /* Flash — only at this moment */
    if (flash) flash.classList.add('go');

    /* Panels fly away */
    if (top) top.classList.add('go');
    if (bot) bot.classList.add('go');

    /* Logo fades out as panels leave */
    if (logo) {
      logo.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      logo.style.opacity = '0';
      logo.style.transform = 'scale(0.85)';
    }
  }, 2650);

  /* ── Done at 3.5s ─────────────────────────────────────── */
  setTimeout(function () {
    clearTimeout(safety);
    finish();
  }, 3500);

  /* ── BFCache fix: stale tab reload ───────────────────── */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) window.location.reload();
  });

})();
