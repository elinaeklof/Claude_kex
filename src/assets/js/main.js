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