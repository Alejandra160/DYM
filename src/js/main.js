// Transiciones al hacer scroll (aparecen al entrar, se resetean al salir del viewport)
(function () {
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();

// Carrusel de Verticales
(function () {
  var track = document.getElementById('vertScroll');
  var dots = document.querySelectorAll('#vertDots .vert-dot');
  if (!track) return;

  function itemWidth() {
    var it = track.querySelector('.vert-item');
    return it ? it.offsetWidth + 16 : 236;
  }

  function setActiveDot(i) {
    dots.forEach(function (d, idx) {
      if (idx === i) {
        d.classList.add('w-7', 'bg-white');
        d.classList.remove('w-2', 'bg-white/25');
      } else {
        d.classList.add('w-2', 'bg-white/25');
        d.classList.remove('w-7', 'bg-white');
      }
    });
  }

  window.vertGoTo = function (i) {
    track.scrollTo({ left: i * itemWidth(), behavior: 'smooth' });
    setActiveDot(i);
  };

  window.vertNext = function () {
    var i = Math.round(track.scrollLeft / itemWidth()) + 1;
    if (i >= dots.length) i = 0;
    vertGoTo(i);
  };

  window.vertPrev = function () {
    var i = Math.round(track.scrollLeft / itemWidth()) - 1;
    if (i < 0) i = dots.length - 1;
    vertGoTo(i);
  };

  track.addEventListener('scroll', function () {
    var i = Math.round(track.scrollLeft / itemWidth());
    setActiveDot(i);
  });
})();

// Carrusel de imágenes de insygt (tarjeta oscura con peek lateral)
(function () {
  var img = document.getElementById('insImg');
  if (!img) return;
  var imgWrap = document.getElementById('insImgWrap');
  var peek = document.getElementById('insPeek');
  var peekWrap = document.getElementById('insPeekWrap');
  var dots = document.querySelectorAll('#insDots .ins-dot');
  var slides = [
    { src: 'assets/images/insygt_1.jpeg', alt: 'Pantalla insygt mostrando una oferta reactiva a una clienta', fit: 'cover' },
    { src: 'assets/images/insygt_2.jpeg', alt: 'insygt detectando edad, género y tiempo de permanencia de una clienta', fit: 'cover' },
    { src: 'assets/images/totem.png', alt: 'Tótems insygt con distintos contenidos en pantalla', fit: 'contain' }
  ];
  var i = 0;

  function applyFit(imgEl, wrapEl, slide) {
    var contain = slide.fit === 'contain';
    imgEl.classList.toggle('object-cover', !contain);
    imgEl.classList.toggle('object-contain', contain);
    wrapEl.classList.toggle('bg-cream', contain);
  }

  function render() {
    var slide = slides[i];
    var peekSlide = slides[(i + 1) % slides.length];

    img.classList.add('opacity-0');
    peek.classList.add('opacity-0');

    setTimeout(function () {
      img.src = slide.src;
      img.alt = slide.alt;
      applyFit(img, imgWrap, slide);
      peek.src = peekSlide.src;
      applyFit(peek, peekWrap, peekSlide);
      img.classList.remove('opacity-0');
      peek.classList.remove('opacity-0');
    }, 400);

    dots.forEach(function (d, idx) {
      d.classList.toggle('w-6', idx === i);
      d.classList.toggle('bg-gold', idx === i);
      d.classList.toggle('w-2', idx !== i);
      d.classList.toggle('bg-navy-deep/20', idx !== i);
    });
  }

  function next() { i = (i + 1) % slides.length; render(); }
  setInterval(next, 4500);
})();

// Carrusel de imágenes de MARKO
(function () {
  var img = document.getElementById('mkImg');
  if (!img) return;
  var dots = document.querySelectorAll('#mkDots .mk-img-dot');
  var slides = [
    { src: 'assets/images/Marko_1.png', alt: 'Conversación de MARKO por chat' },
    { src: 'assets/images/Marko_2.png', alt: 'MARKO enviando promociones por WhatsApp' }
  ];
  var i = 0;

  function render() {
    img.src = slides[i].src;
    img.alt = slides[i].alt;
    dots.forEach(function (d, idx) {
      d.classList.toggle('w-6', idx === i);
      d.classList.toggle('bg-navy-deep', idx === i);
      d.classList.toggle('w-2', idx !== i);
      d.classList.toggle('bg-navy-deep/25', idx !== i);
    });
  }

  window.mkNext = function () { i = (i + 1) % slides.length; render(); };
  window.mkPrev = function () { i = (i - 1 + slides.length) % slides.length; render(); };
})();

// Ventanas modales (Quiénes somos, insygt, MARKO)
function openModal(id) {
  var modal = document.getElementById(id);
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  var modal = document.getElementById(id);
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('[id$="Modal"].flex').forEach(function (modal) {
    closeModal(modal.id);
  });
});

// Botón "volver arriba" — aparece al bajar en la página
(function () {
  var btn = document.getElementById('toTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    var show = window.scrollY > 500;
    btn.classList.toggle('opacity-0', !show);
    btn.classList.toggle('pointer-events-none', !show);
    btn.classList.toggle('translate-y-2', !show);
  });
})();

// Tabs de FAQ
function faqTab(btn) {
  document.querySelectorAll('.faq-tab').forEach(function (t) {
    t.classList.remove('bg-navy-deep/[0.06]', 'text-navy-deep');
    t.classList.add('text-dim', 'bg-transparent');
  });
  btn.classList.add('bg-navy-deep/[0.06]', 'text-navy-deep');
  btn.classList.remove('text-dim', 'bg-transparent');

  var cat = btn.dataset.cat;
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var match = item.dataset.cat === cat;
    item.style.display = match ? '' : 'none';
    if (match) item.open = true;
  });
}
