function initHeroTypewriter() {
  var el = document.getElementById('hero-typewriter');
  if (!el) return;

  var part1 = 'A CUSTOMER TOUCH POINT HAS 2 SIDES.\nFINALLY, ';
  var part2 = 'BOTH OF THEM WORK.';
  var full = part1 + part2;

  var i = 0;
  var speed = 32;

  var ph = el.querySelector('.hero__placeholder');

  if (ph) {
    var h = el.offsetHeight;
    el.style.minHeight = h + 'px';
    el.innerHTML = '';
  }

  function tick() {
    i++;

    var typed = full.slice(0, i);

    var p1 = typed
      .slice(0, Math.min(i, part1.length))
      .replace('\n', '<br>');

    var p2 =
      typed.length > part1.length
        ? typed.slice(part1.length)
        : '';

    el.innerHTML =
      p1 +
      (p2
        ? '<span class="hero__gradient">' + p2 + '</span>'
        : '');

    if (i < full.length) {
      setTimeout(tick, speed);
    }
  }

  setTimeout(tick, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroTypewriter();
});