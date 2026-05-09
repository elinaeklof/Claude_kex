(function () {
  var words = ['STORES', 'HOTELS', 'BANKS'];
  var textEl = document.getElementById('pg-tw-text');
  if (!textEl) return;

  var i = 0;

  function next() {
    i = (i + 1) % words.length;
    textEl.style.animation = 'none';
    textEl.offsetHeight; // triggar reflow
    textEl.textContent = words[i];
    textEl.style.animation = 'slideUp 0.6s ease forwards';
    setTimeout(next, 2400);
  }

  textEl.textContent = words[0];
  textEl.style.animation = 'slideUp 0.6s ease forwards';
  setTimeout(next, 3200);
}());
