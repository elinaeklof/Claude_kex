(function () {
  function autoplay(slider, interval) {
    var timeout;

    function next() {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        slider.next();
      }, interval);
    }

    slider.on('created', function () {
      slider.container.addEventListener('mouseenter', function () {
        clearTimeout(timeout);
      });

      slider.container.addEventListener('mouseleave', function () {
        next();
      });

      next();
    });

    slider.on('dragStarted', function () {
      clearTimeout(timeout);
    });

    slider.on('animationEnded', function () {
      next();
    });

    slider.on('updated', function () {
      next();
    });
  }

  var el = document.getElementById('advisor-slider');
  if (!el) return;

  var advisorSlider = new KeenSlider('#advisor-slider', {
    loop: true,
    mode: 'snap',
    selector: '.keen-slider__slide',
    slides: {
      perView: 3,
      spacing: 24,
      origin: 'center'
    },
    breakpoints: {
      '(max-width: 1100px)': {
        slides: { perView: 2, spacing: 16, origin: 'center' }
      },
      '(max-width: 700px)': {
        slides: { perView: 1.15, spacing: 12, origin: 'center' }
      }
    },
    created: function (s) {
      s.slides.forEach(function (slide, i) {
        slide.addEventListener('click', function () {
          s.moveToIdx(i);
        });
      });
    },
    detailsChanged: function (s) {
      var rel = s.track.details.rel;

      s.slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === rel);
      });
    }
  }, [function (slider) { autoplay(slider, 3000); }]);
}());