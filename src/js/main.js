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

// Verticales: escenario que cambia solo (círculo de color que cubre la sección + foto circular)
(function () {
  var sec = document.getElementById('vtCard');
  if (!sec) return;
  var wipe = document.getElementById('vtWipe');
  var photo = document.getElementById('vtPhoto');
  var imgs = sec.querySelectorAll('.vt-img');
  var slides = sec.querySelectorAll('.vt-slide');
  var pills = sec.querySelectorAll('.vt-pill');
  var colors = ['#03313F', '#212F5B', '#2D7A7B', '#1A74B8'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUR = 5500;
  var cur = 0, busy = false, timer = null;

  function show(n) {
    [imgs, slides, pills].forEach(function (list) {
      list.forEach(function (el, idx) { el.classList.toggle('on', idx === n); });
    });
  }

  function origin() {
    var r = photo.getBoundingClientRect(), s = sec.getBoundingClientRect();
    return [
      ((r.left + r.width / 2 - s.left) / s.width * 100) + '%',
      ((r.top + r.height / 2 - s.top) / s.height * 100) + '%'
    ];
  }

  function go(n) {
    if (n === cur || busy) return;
    busy = true;
    var o = origin();
    wipe.style.setProperty('--ox', o[0]);
    wipe.style.setProperty('--oy', o[1]);
    wipe.style.backgroundColor = colors[n];
    wipe.classList.remove('run');
    void wipe.offsetWidth;
    wipe.classList.add('run');
    show(n);
    cur = n;
    setTimeout(function () {
      sec.style.backgroundColor = colors[n];
      wipe.classList.remove('run');
      busy = false;
    }, reduce ? 0 : 1050);
  }

  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (reduce) return;
    timer = setInterval(function () { go((cur + 1) % slides.length); }, DUR);
  }

  pills.forEach(function (p, idx) {
    p.addEventListener('click', function () { go(idx); start(); });
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        pills[cur].classList.remove('on');
        void pills[cur].offsetWidth;
        pills[cur].classList.add('on');
        start();
      } else { stop(); }
    }, { threshold: 0.3 }).observe(sec);
  }
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

// MARKO: panel que cambia solo (círculo de color + teléfono que entra deslizándose)
(function () {
  var panel = document.getElementById('mkPanel');
  if (!panel) return;
  var sec = panel;
  var wipe = document.getElementById('mkWipe');
  var slides = panel.querySelectorAll('.mk-slide');
  var pills = panel.querySelectorAll('.vt-pill');
  var colors = ['#0A4A5E', '#2B5F8A'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUR = 5500;
  var cur = 0, busy = false, timer = null;

  function go(n) {
    if (n === cur || busy) return;
    busy = true;
    var prev = cur;
    var circle = slides[n].querySelector('.mk-circle').getBoundingClientRect();
    var r = sec.getBoundingClientRect();
    wipe.style.setProperty('--ox', ((circle.left + circle.width / 2 - r.left) / r.width * 100) + '%');
    wipe.style.setProperty('--oy', ((circle.top + circle.height / 2 - r.top) / r.height * 100) + '%');
    wipe.style.backgroundColor = colors[n];
    wipe.classList.remove('run');
    void wipe.offsetWidth;
    wipe.classList.add('run');
    slides[prev].classList.remove('on');
    slides[prev].classList.add('off');
    slides[n].classList.remove('off');
    slides[n].classList.add('on');
    pills.forEach(function (p, idx) { p.classList.toggle('on', idx === n); });
    cur = n;
    setTimeout(function () {
      sec.style.backgroundColor = colors[n];
      wipe.classList.remove('run');
      slides[prev].classList.remove('off');
      busy = false;
    }, reduce ? 0 : 1050);
  }

  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (reduce) return;
    timer = setInterval(function () { go((cur + 1) % slides.length); }, DUR);
  }

  pills.forEach(function (p, idx) {
    p.addEventListener('click', function () { go(idx); start(); });
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        pills[cur].classList.remove('on');
        void pills[cur].offsetWidth;
        pills[cur].classList.add('on');
        start();
      } else { stop(); }
    }, { threshold: 0.3 }).observe(panel);
  }
})();
// Franja de palabras: Detecta → Conversa → Vende (se disuelven entre sí)
(function () {
  var stage = document.getElementById('wordStage');
  if (!stage) return;
  var words = stage.querySelectorAll('.vw');
  var phrases = stage.querySelectorAll('.vp');
  var dots = stage.querySelectorAll('.vd');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, timer = null;

  function show(n) {
    var prev = cur;
    [words, phrases, dots].forEach(function (list) {
      list.forEach(function (el, idx) { el.classList.toggle('on', idx === n); });
    });
    if (prev !== n) {
      words[prev].classList.add('out');
      setTimeout(function () { words[prev].classList.remove('out'); }, 1000);
    }
    cur = n;
  }
  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (reduce) return;
    timer = setInterval(function () { show((cur + 1) % words.length); }, 2800);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) start(); else stop();
    }, { threshold: 0.3 }).observe(stage);
  }
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
