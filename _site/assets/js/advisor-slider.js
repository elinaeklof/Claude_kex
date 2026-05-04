(function () {
  function autoplay(slider, interval) {
    var timeout;
    function next() {
      timeout = setTimeout(function () { slider.next(); }, interval);
    }
    slider.on('created', function () {
      slider.container.addEventListener('mouseenter', function () { clearTimeout(timeout); });
      slider.container.addEventListener('mouseleave', function () { next(); });
      next();
    });
    slider.on('dragStarted', function () { clearTimeout(timeout); });
    slider.on('animationEnded', function () { next(); });
  }

  var el = document.getElementById('advisor-slider');
  if (!el) return;

  var advisorSlider = new KeenSlider('#advisor-slider', {
    loop: true,
    mode: 'snap',
    slides: {
      perView: 3,
      spacing: 24,
      origin: 'center'
    },
    breakpoints: {
      '(max-width: 1100px)': { slides: { perView: 2, spacing: 16, origin: 'center' } },
      '(max-width: 700px)':  { slides: { perView: 1.2, spacing: 12, origin: 'center' } }
    },
    detailsChanged: function (s) {
      var rel = s.track.details.rel;
      var total = s.slides.length;
      s.slides.forEach(function (slide, i) {
        slide.classList.remove('is-active');
        var diff = i - rel;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        if (diff === 0) slide.classList.add('is-active');
      });
    }
  }, [function (slider) { autoplay(slider, 3000); }]);
}());