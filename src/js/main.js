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
// Video "Así se ve en la práctica": se reproduce (sin sonido) al entrar en pantalla y se pausa al salir
(function () {
  var video = document.getElementById('demoVideo');
  if (!video) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    } else {
      video.pause();
    }
  }, { threshold: 0.5 }).observe(video);
})();
// Mercado y referentes: cifras que cuentan al entrar en pantalla y tarjetas que se voltean al tocar
(function () {
  var sec = document.getElementById('mercado');
  if (!sec) return;
  var els = sec.querySelectorAll('[data-count]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rafs = [];

  function fmt(v, el) {
    var d = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var s = el.getAttribute('data-format') === 'int' ? Math.round(v).toLocaleString('en-US') : v.toFixed(d);
    return (el.getAttribute('data-prefix') || '') + s + (el.getAttribute('data-suffix') || '');
  }
  function run() {
    els.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / 1300, 1);
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)), el);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  if (!reduce && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) run();
    }, { threshold: 0.35 }).observe(sec);
  }

  sec.querySelectorAll('.fc[role="button"]').forEach(function (card) {
    card.addEventListener('click', function () { card.classList.toggle('is-flipped'); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('is-flipped'); }
    });
  });
})();
// Oportunidad: las palabras se encienden una a una según el avance del scroll por la sección
(function () {
  var sec = document.getElementById('oportunidad');
  if (!sec) return;
  var words = sec.querySelectorAll('.ow');
  if (!words.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    words.forEach(function (w) { w.classList.add('lit'); });
    return;
  }
  var ticking = false;

  function update() {
    var r = sec.getBoundingClientRect();
    var vh = window.innerHeight;
    // 0 cuando la sección asoma por abajo, 1 cuando su borde superior llega al 35% de la pantalla
    var p = (vh * 0.9 - r.top) / (vh * 0.9 - vh * 0.35);
    p = Math.max(0, Math.min(1, p));
    var n = Math.round(p * words.length);
    words.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
// Retail Data Point: el tótem de ejemplo cambia de oferta según género y rango de edad (contenido ilustrativo)
(function () {
  var sec = document.getElementById('rdp');
  if (!sec) return;
  var screen = document.getElementById('rdScreen');
  var elProfile = document.getElementById('rdProfile');
  var elTitle = document.getElementById('rdTitle');
  var elLine = document.getElementById('rdLine');
  var gens = sec.querySelectorAll('.rd-gen');
  var ages = sec.querySelectorAll('.rd-age');
  var genNames = ['Mujer', 'Hombre'];
  var ageNames = ['15–24', '25–34', '35–44', '45–54', '55–64', '65–74', '75–84', '85+'];
  var bg = [
    ['#1A74B8', '#212F5B'], ['#2D7A7B', '#0A4A5E'], ['#3A4C8C', '#212F5B'], ['#1A74B8', '#0A4A5E'],
    ['#2D7A7B', '#212F5B'], ['#2B5F8A', '#03313F'], ['#3A84A8', '#212F5B'], ['#0A4A5E', '#03313F']
  ];
  var offers = [
    [
      ['Antojos para llevar', 'Botanas, bebidas y algo dulce para el camino.'],
      ['Cena fácil en casa', 'Ingredientes frescos y recetas listas para esta noche.'],
      ['Despensa de la semana', 'Arma tu lista del súper en una sola vuelta.'],
      ['Cuida tu piel', 'Cuidado personal y bienestar con marcas participantes.'],
      ['Frutas y verduras de temporada', 'Lo más fresco, directo a tu carrito.'],
      ['Bienestar de todos los días', 'Vitaminas y productos para cuidarte.'],
      ['Productos fáciles de llevar', 'Presentaciones prácticas para tu hogar.'],
      ['Todo en un solo pasillo', 'Te ayudamos a encontrar lo que necesitas.']
    ],
    [
      ['Bebidas y botanas', 'Para la reunión del fin de semana.'],
      ['Carne para asar', 'Cortes y marinados para el próximo domingo.'],
      ['Todo para el partido', 'Botanas, bebidas y complementos.'],
      ['Cuidado personal', 'Rasurado y aseo con marcas participantes.'],
      ['Café y desayunos', 'Para empezar bien el día.'],
      ['Cuida tu bienestar', 'Vitaminas y productos de todos los días.'],
      ['Compra sin complicaciones', 'Productos prácticos y fáciles de cargar.'],
      ['Todo en un solo pasillo', 'Te ayudamos a encontrar lo que necesitas.']
    ]
  ];
  var auto = [[0, 1], [1, 2], [0, 4]];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var g = 0, a = 1, step = 0, timer = null, userPicked = false;

  function render(animate) {
    gens.forEach(function (b, i) { var on = i === g; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    ages.forEach(function (b, i) { var on = i === a; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    function apply() {
      elProfile.textContent = genNames[g] + ' · ' + ageNames[a];
      elTitle.textContent = offers[g][a][0];
      elLine.textContent = offers[g][a][1];
      screen.style.background = 'linear-gradient(160deg, ' + bg[a][0] + ', ' + bg[a][1] + ')';
      screen.classList.remove('swap');
    }
    if (animate && !reduce) {
      screen.classList.add('swap');
      setTimeout(apply, 220);
    } else { apply(); }
  }

  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (reduce || userPicked) return;
    timer = setInterval(function () {
      step = (step + 1) % auto.length;
      g = auto[step][0]; a = auto[step][1];
      render(true);
    }, 4000);
  }
  function pick() { userPicked = true; stop(); render(true); }

  gens.forEach(function (b, i) { b.addEventListener('click', function () { g = i; pick(); }); });
  ages.forEach(function (b, i) { b.addEventListener('click', function () { a = i; pick(); }); });

  render(false);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) start(); else stop();
    }, { threshold: 0.35 }).observe(sec);
  }
})();
// Retail Agent: chat de ejemplo guionado (ilustrativo). Arranca solo al entrar en pantalla y responde a las respuestas rápidas.
(function () {
  var sec = document.getElementById('ragent');
  if (!sec) return;
  var chat = document.getElementById('raChat');
  var chips = sec.querySelectorAll('.ra-chip');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var flows = {
    intro: [
      ['u', 'Hola, ¿tienen alguna promo en carne para asar este fin?'],
      ['b', '¡Hola, qué gusto! Sí, la arrachera marinada está en oferta esta semana. ¿Para cuántas personas es?'],
      ['u', 'Somos 10!!'],
      ['b', '¡Qué buen plan! Te sugiero unos 3 kilos. ¿Te agrego tortillas y cebollitas a tu lista?']
    ],
    ofertas: [
      ['u', '¿Qué ofertas hay hoy?'],
      ['b', 'Hoy hay promociones en carnes, frutas y lácteos de marcas participantes. ¿Te muestro las de carnes?']
    ],
    lista: [
      ['u', 'Muéstrame mi lista'],
      ['b', 'Tu lista, ordenada por pasillo: carnes (arrachera), tortillería (tortillas) y verduras (cebollitas).']
    ],
    recetas: [
      ['u', 'Dame una receta'],
      ['b', 'Para unos tacos de arrachera necesitas arrachera, tortillas, cebollitas y limón. ¿Los agrego a tu lista?']
    ],
    donde: [
      ['u', '¿Dónde están las tortillas?'],
      ['b', 'Están en el área de panadería y tortillería, al fondo a la derecha.']
    ]
  };
  var busy = false, started = false, timers = [];

  function add(kind, text) {
    var d = document.createElement('div');
    d.className = 'ra-msg ' + (kind === 'u' ? 'ra-user' : 'ra-bot');
    d.textContent = text;
    chat.appendChild(d);
    while (chat.children.length > 8) chat.removeChild(chat.firstChild);
    return d;
  }
  function later(fn, ms) { timers.push(setTimeout(fn, reduce ? 0 : ms)); }
  function setBusy(b) { busy = b; chips.forEach(function (c) { c.disabled = b; }); }

  function play(steps, done) {
    setBusy(true);
    var i = 0;
    (function next() {
      if (i >= steps.length) { setBusy(false); if (done) done(); return; }
      var s = steps[i++];
      if (s[0] === 'u') {
        add('u', s[1]);
        later(next, 650);
      } else {
        var t = document.createElement('div');
        t.className = 'ra-msg ra-bot ra-typing';
        t.innerHTML = '<i></i><i></i><i></i>';
        chat.appendChild(t);
        later(function () { chat.removeChild(t); add('b', s[1]); later(next, 800); }, 1100);
      }
    })();
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      if (busy) return;
      started = true;
      play(flows[c.getAttribute('data-flow')]);
    });
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !started) { started = true; play(flows.intro); }
    }, { threshold: 0.4 }).observe(sec);
  } else { started = true; play(flows.intro); }
})();
// El recorrido del cliente: los 6 pasos se encienden uno a uno según el avance del scroll
(function () {
  var sec = document.getElementById('recorrido');
  if (!sec) return;
  var steps = sec.querySelectorAll('.rc-step');
  if (!steps.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    steps.forEach(function (s) { s.classList.add('on'); });
    return;
  }
  var ticking = false;

  function update() {
    var r = sec.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.85 - r.top) / (vh * 0.85 - vh * 0.3);
    p = Math.max(0, Math.min(1, p));
    var n = Math.round(p * steps.length);
    steps.forEach(function (s, i) { s.classList.toggle('on', i < n); });
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
// Datos por nivel: el rol elegido cambia la decisión y el reporte de ejemplo (alturas ilustrativas, sin cifras reales)
(function () {
  var sec = document.getElementById('datos');
  if (!sec) return;
  var btns = sec.querySelectorAll('.dt-role');
  var elNivel = document.getElementById('dtNivel');
  var elQuien = document.getElementById('dtQuien');
  var elDec = document.getElementById('dtDecision');
  var elRep = document.getElementById('dtReport');
  var elBars = document.getElementById('dtBars');
  var elLabels = document.getElementById('dtLabels');
  var roles = [
    { nivel: 'Operativo', quien: 'Gerente de tienda o de departamento',
      dec: 'Ajustar personal, reposición o degustaciones según afluencia por hora y segmento.',
      rep: 'Afluencia por hora y segmento', labels: ['9 h', '11 h', '13 h', '15 h', '17 h', '19 h'], h: [30, 46, 72, 56, 84, 62] },
    { nivel: 'Táctico', quien: 'Categoría, compras, mercadotecnia',
      dec: 'Elegir qué ofertas mostrar por tienda y horario; detectar demanda de producto regional.',
      rep: 'Interés por oferta y por tienda', labels: ['Tienda A', 'Tienda B', 'Tienda C', 'Tienda D', 'Tienda E'], h: [64, 40, 82, 52, 70] },
    { nivel: 'Estratégico', quien: 'Dirección',
      dec: 'Comparar plazas y formatos; dimensionar la nueva línea de ingresos de medios.',
      rep: 'Comparativo por plaza y formato', labels: ['Plaza 1', 'Plaza 2', 'Plaza 3', 'Plaza 4'], h: [58, 80, 44, 68] },
    { nivel: 'Cadena de valor', quien: 'Proveedores y productores locales',
      dec: 'Reporte de campaña por segmento y tienda.',
      rep: 'Campaña por segmento y tienda', labels: ['Segmento A', 'Segmento B', 'Segmento C', 'Segmento D', 'Segmento E'], h: [48, 76, 60, 86, 42] }
  ];

  function render(i) {
    var r = roles[i];
    btns.forEach(function (b, idx) { var on = idx === i; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    elNivel.textContent = r.nivel;
    elQuien.textContent = r.quien;
    elDec.textContent = r.dec;
    elRep.textContent = r.rep;
    elBars.innerHTML = '';
    elLabels.innerHTML = '';
    r.h.forEach(function (v, idx) {
      var bar = document.createElement('div');
      bar.className = 'dt-bar';
      bar.style.height = '4%';
      elBars.appendChild(bar);
      var lb = document.createElement('span');
      lb.style.flex = '1';
      lb.style.textAlign = 'center';
      lb.textContent = r.labels[idx];
      elLabels.appendChild(lb);
      requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.height = v + '%'; }); });
    });
  }

  btns.forEach(function (b, idx) { b.addEventListener('click', function () { render(idx); }); });
  render(0);
})();
// Escalabilidad: los 4 peldaños y la línea se llenan según el avance del scroll
(function () {
  var sec = document.getElementById('implementacion');
  if (!sec) return;
  var steps = sec.querySelectorAll('.sc-step');
  var fill = document.getElementById('scFill');
  if (!steps.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    steps.forEach(function (s) { s.classList.add('on'); });
    if (fill) fill.style.width = '100%';
    return;
  }
  var ticking = false;

  function update() {
    var r = sec.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.8 - r.top) / (vh * 0.8 - vh * 0.1);
    p = Math.max(0, Math.min(1, p));
    var n = Math.min(steps.length, Math.max(0, Math.ceil(p * steps.length)));
    steps.forEach(function (s, i) { s.classList.toggle('on', i < n); });
    if (fill) fill.style.width = (n <= 1 ? 0 : (n - 1) / (steps.length - 1) * 100) + '%';
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
// Logo del header: oculto mientras se ve el logo grande del hero, aparece al hacer scroll
(function () {
  var navLogo = document.getElementById('navLogo');
  var heroLogo = document.getElementById('heroLogo');
  if (!navLogo || !heroLogo) return;
  if (!('IntersectionObserver' in window)) { navLogo.classList.remove('opacity-0'); return; }
  new IntersectionObserver(function (entries) {
    navLogo.classList.toggle('opacity-0', entries[0].isIntersecting);
  }, { rootMargin: '-70px 0px 0px 0px' }).observe(heroLogo);
})();
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
