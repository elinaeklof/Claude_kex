(function () {
  var words = document.querySelectorAll('[data-anim-word]');
  if (!words.length) return;
  var current = 0;
  setInterval(function () {
    words[current].classList.remove('hero__anim-word--visible');
    words[current].classList.add('hero__anim-word--exit');
    var prev = current;
    setTimeout(function () { words[prev].classList.remove('hero__anim-word--exit'); }, 380);
    current = (current + 1) % words.length;
    words[current].classList.add('hero__anim-word--visible');
  }, 2200);
}());

/* ─── Mobile nav toggle — hamburger to X ─── */
(function () {
  var toggle = document.getElementById('nav-toggle');
  var links  = document.getElementById('nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('nav__links--open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('nav__hamburger--open', open);
  });
  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('nav__links--open');
      toggle.classList.remove('nav__hamburger--open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}());

/* ─── Shared tab opener ─── */
function openTab(tabValue) {
  document.querySelectorAll('.tab__btn').forEach(function (b) {
    b.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.tab__panel').forEach(function (p) {
    p.setAttribute('aria-hidden', 'true');
  });
  var btn   = document.querySelector('.tab__btn[data-tab="' + tabValue + '"]');
  var panel = document.getElementById('tab-' + tabValue);
  if (btn)   btn.setAttribute('aria-selected', 'true');
  if (panel) panel.setAttribute('aria-hidden', 'false');
}

/* ─── Tab button clicks ─── */
(function () {
  var buttons = document.querySelectorAll('.tab__btn');
  if (!buttons.length) return;
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      openTab(btn.dataset.tab);
    });
  });
}());

/* ─── Nav anchor links that correspond to tabs ───────────────────
   Problem: clicking <a href="#banks"> scrolls to the H2 inside
   the HIDDEN tab panel — the panel never opens.
   Fix: intercept those anchors, open the correct tab first,
   then scroll the #solutions section into view.
   Works for both EN (#banks, #retail) and SV (#banker, #retail).
   ─────────────────────────────────────────────────────────────── */
(function () {
  var tabAnchors = {
    '#banks':  'banks',
    '#banker': 'banker',
    '#retail': 'retail'
  };
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var hash = link.getAttribute('href');
    if (!tabAnchors[hash]) return;
    link.addEventListener('click', function (e) {
      var tabValue = tabAnchors[hash];
      var btn = document.querySelector('.tab__btn[data-tab="' + tabValue + '"]');
      if (!btn) return;
      e.preventDefault();
      openTab(tabValue);
      var section = document.getElementById('solutions');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}());

/* ─── FAQ accordion ─── */
(function () {
  document.querySelectorAll('.faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      if (!item) return;
      var isOpen = item.classList.contains('faq__item--open');
      document.querySelectorAll('.faq__item').forEach(function (i) {
        i.classList.remove('faq__item--open');
        var q = i.querySelector('.faq__question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('faq__item--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}());


/* ─── Hero background ─── */
(function () {
  /* TYPEWRITER */
  var words = ['Stores', 'Hotels', 'Bank offices'];
  var typeSpeed = 72, deleteSpeed = 38, pauseAfter = 1600, pauseBefore = 280;
  var textEl = document.getElementById('tw-text');
  var wordIdx = 0, charIdx = 0, deleting = false;
  function tick() {
    var current = words[wordIdx];
    if (!deleting) {
      charIdx++;
      textEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) { setTimeout(function () { deleting = true; tick(); }, pauseAfter); return; }
    } else {
      charIdx--;
      textEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; setTimeout(tick, pauseBefore); return; }
    }
    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { setTimeout(tick, 700); }); } else { setTimeout(tick, 700); }

  /* SHIMMER PARTICLES — coral dots that drift and pulse over the kaleidoscope */
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, dots = [];

  /* ID24 coral palette */
  var COLORS = [
    [255, 146, 118],  /* --coral       */
    [248, 184, 152],  /* --coral-ghost  */
    [251, 223, 209],  /* --coral-ghost-2*/
    [224, 106,  80],  /* --coral-dark   */
  ];

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function mkDot() {
    var c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:     rnd(0, W),
      y:     rnd(0, H),
      r:     rnd(1, 3.2),
      vx:    rnd(-0.18, 0.18),
      vy:    rnd(-0.22, 0.22),
      alpha: rnd(0.08, 0.28),
      phase: rnd(0, Math.PI * 2),
      speed: rnd(0.4, 1.1),
      c:     c
    };
  }

  function rebuild() {
    dots = [];
    var n = Math.min(Math.max(Math.floor((W * H) / 10000), 40), 110);
    for (var i = 0; i < n; i++) dots.push(mkDot());
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    rebuild();
  }

  var t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.018;

    dots.forEach(function (d) {
      /* pulse alpha gently */
      var a = d.alpha * (0.6 + 0.4 * Math.sin(t * d.speed + d.phase));

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + d.c[0] + ',' + d.c[1] + ',' + d.c[2] + ',' + a + ')';
      ctx.fill();

      d.x += d.vx;
      d.y += d.vy;

      /* wrap edges */
      if (d.x < -4)  d.x = W + 4;
      if (d.x > W+4) d.x = -4;
      if (d.y < -4)  d.y = H + 4;
      if (d.y > H+4) d.y = -4;
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}());


(function () {
  /* ── 1. TYPEWRITER LOOP ─────────────────────────────
     Väntar på att fonten är redo (document.fonts.ready)
     så att det inte hackar vid första render.
     Sekvens: STORES → HOTELS → BANK OFFICES → (loop)
     ─────────────────────────────────────────────────── */
  var words = [
    'Stores',
    'Hotels',
    'Bank offices'
  ];

  var typeSpeed   = 72;   /* ms per tecken vid skrivning */
  var deleteSpeed = 38;   /* ms per tecken vid radering  */
  var pauseAfter  = 1600; /* ms att vänta när ordet är skrivet */
  var pauseBefore = 280;  /* ms att vänta innan nästa ord börjar */

  var textEl   = document.getElementById('tw-text');
  var cursorEl = document.getElementById('tw-cursor');
  var wordIdx  = 0;
  var charIdx  = 0;
  var deleting = false;
  var initialDelay = 700; 

  function tick() {
    var current = words[wordIdx];

    if (!deleting) {
      /* Skriv ett tecken */
      charIdx++;
      textEl.textContent = current.slice(0, charIdx);

      if (charIdx === current.length) {
        /* Ordet är klart — pausa innan radering */
        setTimeout(function () {
          deleting = true;
          tick();
        }, pauseAfter);
        return;
      }
    } else {
      /* Radera ett tecken */
      charIdx--;
      textEl.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        /* Ordet är raderat — nästa ord */
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        setTimeout(tick, pauseBefore);
        return;
      }
    }

    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }

  /* Vänta tills fonten är redo → inga hackningar */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { 
      setTimeout(tick, initialDelay);
    });
  } else {
    /* Fallback för äldre webbläsare */
    setTimeout(tick, initialDelay);
  }
}());

//* ─── Duo Input signature animation ─── */
(function () {
  var keys   = document.querySelectorAll('[data-signature-key]');
  var output = document.getElementById('signatureUseCaseOutput');
  if (!keys.length || !output) return;

  var text = '';
  var seq  = [
    'D','U','O',' ','I','N','P','U','T',
    'BACKSPACE','BACKSPACE','BACKSPACE','BACKSPACE',
    'BACKSPACE','BACKSPACE','BACKSPACE','BACKSPACE','BACKSPACE'
  ];
  var idx = 0;

  function render() { output.textContent = text; }

  function handleKey(val) {
    if (val === 'BACKSPACE') { text = text.slice(0, -1); }
    else { text += val; }
    render();
  }

  function flashKey(val) {
    var matches = document.querySelectorAll('[data-signature-key="' + val + '"]');
    if (!matches.length) return;
    var key = matches[Math.floor(Math.random() * matches.length)];
    key.classList.add('pressed');
    setTimeout(function () { key.classList.remove('pressed'); }, 150);
  }

  keys.forEach(function (key) {
    key.addEventListener('click', function () {
      handleKey(key.dataset.signatureKey);
      key.classList.add('pressed');
      setTimeout(function () { key.classList.remove('pressed'); }, 150);
    });
  });

  setInterval(function () {
    handleKey(seq[idx]);
    flashKey(seq[idx]);
    idx = (idx + 1) % seq.length;
  }, 200);

  render();
}());


(function () {
  const devicePreview = document.querySelector('.device-preview');
  const deviceLabel = document.getElementById('device-size-label');
  const deviceButtons = document.querySelectorAll('.device-chip[data-size]');

  if (!devicePreview || !deviceLabel || !deviceButtons.length) return;

  devicePreview.dataset.size = '10';

  deviceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const size = button.dataset.size;

      devicePreview.dataset.size = size;
      deviceLabel.textContent = size + '”';

      deviceButtons.forEach((btn) => btn.classList.remove('is-active'));
      button.classList.add('is-active');
    });
  });
})();