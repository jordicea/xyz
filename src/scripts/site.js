const root = document.documentElement;
const lang = root.lang || 'en';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- tema: un botón que rota Auto → Claro → Oscuro ---------- */
(() => {
  const btn = $('#theme');
  if (!btn) return;
  const labels = JSON.parse(btn.dataset.label || '{}');
  const order = ['system', 'light', 'dark'];
  const cur = () => {
    try {
      const t = localStorage.getItem('theme');
      return t === 'light' || t === 'dark' ? t : 'system';
    } catch {
      return 'system';
    }
  };
  const paint = () => {
    const c = cur();
    btn.dataset.state = c;
    const l = `${labels.label}: ${labels[c]}`;
    btn.setAttribute('aria-label', l);
    btn.title = l;
  };
  btn.addEventListener('click', () => {
    const n = order[(order.indexOf(cur()) + 1) % 3];
    try {
      if (n === 'system') localStorage.removeItem('theme');
      else localStorage.setItem('theme', n);
    } catch {}
    if (n === 'system') root.removeAttribute('data-theme');
    else root.dataset.theme = n;
    paint();
  });
  paint();
})();

/* ---------- menú móvil ---------- */
(() => {
  const burger = $('#burger'),
    menu = $('#menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    const o = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
  });
  $$('a', menu).forEach((a) =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }),
  );
})();

/* ---------- selector de idioma (enlaces reales a /es/, /ca/, /en/) ---------- */
(() => {
  const box = $('#lang'),
    btn = $('#lbtn');
  if (!box || !btn) return;
  const set = (v) => {
    box.classList.toggle('open', v);
    btn.setAttribute('aria-expanded', v);
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    set(!box.classList.contains('open'));
  });
  document.addEventListener('click', () => set(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') set(false);
  });
})();

/* ---------- aparición al hacer scroll ---------- */
(() => {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  $$('.rv').forEach((e) => io.observe(e));
})();

/* ---------- hero: escritura + escenas (maps → web → automatización) ---------- */
(() => {
  const ty = $('#typed');
  if (!ty) return;
  const q = JSON.parse(ty.dataset.q || '[]');
  let qi = 0,
    ci = 0,
    del = false,
    tm;
  const tick = () => {
    const s = q[qi % q.length];
    ty.textContent = s.slice(0, ci);
    if (!del && ci === s.length) {
      del = true;
      tm = setTimeout(tick, 1800);
      return;
    }
    if (del && ci === 0) {
      del = false;
      qi++;
    }
    ci += del ? -1 : 1;
    tm = setTimeout(tick, del ? 30 : 70);
  };
  if (!reduce && q.length) tick();

  const scenes = $$('.scene'),
    tabs = $('.tabs'),
    tbs = $$('button', tabs);
  const SCN = ['maps', 'web', 'auto'],
    DUR = 8000;
  let cur = 0,
    timer,
    hover = false;
  const runCounts = (sc) =>
    $$('.cnt', sc).forEach((el) => {
      const to = +el.dataset.to,
        dec = +(el.dataset.dec || 0),
        suf = el.dataset.suf || '';
      const fmt = (v) =>
        (dec ? (v / 10).toFixed(1).replace('.', lang === 'en' ? '.' : ',') : Math.round(v).toLocaleString(lang)) + suf;
      if (reduce) {
        el.textContent = fmt(to);
        return;
      }
      const t0 = performance.now(),
        d = 2800;
      (function f(t) {
        const k = Math.max(0, Math.min(1, (t - t0) / d)),
          e = 1 - Math.pow(1 - k, 3);
        el.textContent = fmt(to * e);
        if (k < 1 && sc.classList.contains('on')) requestAnimationFrame(f);
      })(t0);
    });
  const schedule = () => {
    clearTimeout(timer);
    if (reduce) return;
    timer = setTimeout(() => (hover ? schedule() : show(cur + 1)), DUR);
  };
  const show = (i) => {
    cur = (i + 3) % 3;
    scenes.forEach((s) => s.classList.toggle('on', s.dataset.s === SCN[cur]));
    tbs.forEach((b) => b.setAttribute('aria-selected', b.dataset.s === SCN[cur]));
    tabs.classList.remove('play');
    void tabs.offsetWidth;
    if (!reduce) tabs.classList.add('play');
    if (SCN[cur] === 'web') runCounts(scenes[1]);
    schedule();
  };
  tbs.forEach((b) => b.addEventListener('click', () => show(SCN.indexOf(b.dataset.s))));
  const wrap = $('.stage').parentElement;
  wrap.addEventListener('mouseenter', () => {
    hover = true;
    tabs.classList.add('paused');
  });
  wrap.addEventListener('mouseleave', () => {
    hover = false;
    tabs.classList.remove('paused');
  });
  show(0);
})();

/* ---------- formulario: respuesta por email o por teléfono ---------- */
(() => {
  const form = $('#form');
  if (!form) return;
  const call = $('#callfields'),
    phone = $('#phone');
  const sync = () => {
    const isCall = form.reply.value === 'phone';
    call.hidden = !isCall;
    phone.required = isCall;
  };
  $$('input[name=reply]', form).forEach((r) => r.addEventListener('change', sync));
  $$('[data-call]').forEach((a) =>
    a.addEventListener('click', () => {
      form.querySelector('input[name=reply][value=phone]').checked = true;
      sync();
      setTimeout(() => phone.focus({ preventScroll: true }), 400);
    }),
  );
  sync();
})();

/* ---------- Google Analytics con consentimiento ---------- */
(() => {
  const GA = 'G-BZY5CJW9D0',
    KEY = 'cookie-consent';
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  const banner = $('#cookie');
  const get = () => {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  };
  const set = (v) => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
  };
  const load = () => {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (document.querySelector('script[src*="googletagmanager.com/gtag"]')) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA, { anonymize_ip: true });
  };
  const accept = () => {
    set('accepted');
    banner.classList.remove('show');
    load();
  };
  const decline = () => {
    set('declined');
    banner.classList.remove('show');
    gtag('consent', 'update', { analytics_storage: 'denied' });
  };
  $('#ck-accept')?.addEventListener('click', accept);
  $('#ck-decline')?.addEventListener('click', decline);
  $('#cookie-settings')?.addEventListener('click', () => banner.classList.add('show'));
  const c = get();
  if (c === 'accepted') load();
  else if (c !== 'declined') banner.classList.add('show');
})();
