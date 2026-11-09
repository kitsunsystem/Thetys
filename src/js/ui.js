// Interactions : en-tête, menus, ancres, vidéos, FAQ, filtres, comparateur,
// effets de survol, curseur, formulaire de contact, transitions de page.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement;
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------------------------------------------------------------------------
function header(app) {
  const h = $('[data-header]');
  if (!h) return;
  let last = 0;
  const onScroll = (y) => {
    h.classList.toggle('is-scrolled', y > 40);
    const down = y > last && y > 260;
    if (!root.classList.contains('is-menu-open') && !$('[data-mega].is-open')) h.classList.toggle('is-hidden', down);
    last = y;
  };
  if (app.lenis) app.lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  onScroll(window.scrollY);
}

function mega() {
  const panel = $('[data-mega]');
  const toggle = $('[data-mega-toggle]');
  if (!panel || !toggle) return;
  const header = $('[data-header]');
  let timer;
  const open = () => { clearTimeout(timer); panel.classList.add('is-open'); header.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); };
  const close = () => { panel.classList.remove('is-open'); header.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
  const later = () => { clearTimeout(timer); timer = setTimeout(close, 220); };
  if (finePointer()) {
    toggle.addEventListener('pointerenter', open);
    toggle.addEventListener('pointerleave', later);
    panel.addEventListener('pointerenter', open);
    panel.addEventListener('pointerleave', later);
    $$('.nav__link:not([data-mega-toggle])').forEach((l) => l.addEventListener('pointerenter', close));
  }
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); open(); $('a', panel)?.focus(); }
  });
  panel.addEventListener('focusout', (e) => { if (!panel.contains(e.relatedTarget) && e.relatedTarget !== toggle) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('is-open')) { close(); toggle.focus(); } });
  // aperçu de la technologie survolée
  const caption = $('[data-preview-caption]', panel);
  for (const a of $$('[data-preview]', panel)) {
    const show = () => {
      $$('[data-preview-img]', panel).forEach((p) => p.classList.toggle('is-active', p.dataset.previewImg === a.dataset.preview));
      if (caption) caption.textContent = a.dataset.caption || '';
    };
    a.addEventListener('pointerenter', show);
    a.addEventListener('focus', show);
  }
}

function menu(app) {
  const burger = $('[data-burger]');
  const m = $('[data-menu]');
  if (!burger || !m) return;
  const items = $$('.menu__list li', m);
  const set = (open) => {
    root.classList.toggle('is-menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    m.setAttribute('aria-hidden', String(!open));
    if (open) {
      app.lenis?.stop();
      if (!app.reduce) gsap.fromTo(items, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.05, delay: 0.25 });
      setTimeout(() => $('a', m)?.focus(), 400);
    } else app.lenis?.start();
  };
  burger.addEventListener('click', () => set(!root.classList.contains('is-menu-open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('is-menu-open')) { set(false); burger.focus(); } });
  $$('a', m).forEach((a) => a.addEventListener('click', () => set(false)));
}

function announcement() {
  const a = $('[data-announce]');
  if (!a) return;
  const until = a.dataset.until;
  const key = `thetys:announce:${$('a', a)?.getAttribute('href')}`;
  let dismissed = false;
  try { dismissed = localStorage.getItem(key) === '1'; } catch {}
  const expired = until && new Date() > new Date(`${until}T23:59:59`);
  if (dismissed || expired) return;
  setTimeout(() => {
    a.hidden = false;
    gsap.fromTo(a, { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out' });
  }, 3200);
  $('.announce__close', a).addEventListener('click', () => {
    try { localStorage.setItem(key, '1'); } catch {}
    gsap.to(a, { y: 90, opacity: 0, duration: 0.5, ease: 'power3.in', onComplete: () => { a.hidden = true; } });
  });
}

// ---------------------------------------------------------------------------
function anchors(app) {
  app.scrollTo = (target) => {
    const offset = -(parseInt(getComputedStyle(root).getPropertyValue('--header-h'), 10) || 84) - 12;
    if (app.lenis) app.lenis.scrollTo(target, { offset, duration: 1.4 });
    else target.scrollIntoView({ behavior: app.reduce ? 'auto' : 'smooth' });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    app.scrollTo(target);
    history.replaceState(null, '', url.hash);
  });
}

// ---------------------------------------------------------------------------
// Vidéos : lecture automatique silencieuse à l'écran, son à la demande
// ---------------------------------------------------------------------------
function players(app) {
  const all = $$('[data-player]');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const fig = e.target;
      const v = $('video', fig);
      if (fig.dataset.autoplay === '1') {
        if (e.isIntersecting && !app.reduce) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
      } else if (!e.isIntersecting && !v.paused) v.pause();
    }
  }, { threshold: 0.35 });
  const pauseOthers = (current) => all.forEach((f) => { const v = $('video', f); if (f !== current && !v.muted) { v.pause(); } });
  for (const fig of all) {
    const v = $('video', fig);
    io.observe(fig);
    const bar = $('.player__progress i', fig);
    v.addEventListener('timeupdate', () => { if (v.duration) bar?.style.setProperty('--p', (v.currentTime / v.duration).toFixed(3)); });
    v.addEventListener('play', () => fig.classList.add('is-playing'));
    v.addEventListener('pause', () => { if (fig.dataset.autoplay !== '1') fig.classList.remove('is-playing'); });
    const play = $('.player__play', fig);
    play?.addEventListener('click', () => {
      pauseOthers(fig);
      v.controls = true; v.muted = false; v.preload = 'auto';
      v.play().catch(() => {});
    });
    const snd = $('[data-sound]', fig);
    snd?.addEventListener('click', () => {
      v.muted = !v.muted;
      snd.setAttribute('aria-pressed', String(!v.muted));
      $('span', snd).textContent = v.muted ? 'Son' : 'Couper';
      if (!v.muted) { pauseOthers(fig); v.play().catch(() => {}); }
    });
  }
  // vidéo d'ambiance de l'accueil : en pause hors écran
  const hv = $('[data-hero-video]');
  if (hv) {
    if (app.reduce) hv.pause();
    new IntersectionObserver(([e]) => { if (app.reduce) return; e.isIntersecting ? hv.play().catch(() => {}) : hv.pause(); }).observe(hv);
  }
}

// ---------------------------------------------------------------------------
function faq(app) {
  for (const d of $$('.faq__item')) {
    const sum = $('summary', d);
    const body = $('.faq__answer', d);
    sum.addEventListener('click', (e) => {
      if (app.reduce) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, duration: 0.55, ease: 'power3.inOut', onComplete: () => { d.open = false; gsap.set(body, { clearProps: 'height' }); ScrollTrigger.refresh(); } });
      } else {
        d.open = true;
        gsap.fromTo(body, { height: 0 }, { height: 'auto', duration: 0.7, ease: 'expo.out', onComplete: () => { gsap.set(body, { clearProps: 'height' }); ScrollTrigger.refresh(); } });
      }
    });
  }
}

function compare() {
  for (const c of $$('[data-compare]')) {
    const r = $('.compare__range', c);
    const set = () => c.style.setProperty('--pos', `${r.value}%`);
    r.addEventListener('input', set);
    set();
  }
}

function filters(app) {
  const bar = $('[data-filters]');
  const grid = $('[data-results]');
  if (!bar || !grid) return;
  const items = $$('.result', grid);
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    $$('[data-filter]', bar).forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', String(x === b)); });
    const f = b.dataset.filter;
    const shown = [];
    items.forEach((it) => { const ok = f === 'tous' || it.dataset.cat === f; it.classList.toggle('is-hidden', !ok); if (ok) shown.push(it); });
    if (!app.reduce) gsap.fromTo(shown, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04 });
    ScrollTrigger.refresh();
  });
}

function universeNav() {
  const nav = $('[data-universe-nav]');
  if (!nav) return;
  const links = $$('a', nav);
  const map = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l === map.get(e.target.id))); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

// ---------------------------------------------------------------------------
function tilt(app) {
  for (const el of $$('[data-tilt]')) {
    if (app.reduce || !finePointer()) continue;
    const card = el.firstElementChild;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', `${x * 22}deg`);
      card.style.setProperty('--rx', `${-y * 18}deg`);
      card.style.setProperty('--shine', `${x * 120}%`);
    });
    el.addEventListener('pointerleave', () => { card.style.removeProperty('--ry'); card.style.removeProperty('--rx'); card.style.removeProperty('--shine'); });
  }
}

function magnetic(app) {
  if (app.reduce || !finePointer()) return;
  for (const el of $$('[data-magnetic]')) {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.28);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  }
}

function cursor(app) {
  const c = $('[data-cursor-el]');
  if (!c || app.reduce || !finePointer()) { c?.remove(); return; }
  const label = $('[data-cursor-label]', c);
  const dot = $('.cursor__dot', c);
  const ring = $('.cursor__ring', c);
  const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
  gsap.set([dot, ring], { x: -100, y: -100 });
  window.addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); c.classList.remove('is-hidden'); }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.add('is-hidden'));
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button, summary, label, input, select, textarea');
    const lab = t?.closest('[data-cursor]')?.getAttribute('data-cursor');
    c.classList.toggle('is-hover', Boolean(t));
    c.classList.toggle('has-label', Boolean(lab));
    label.textContent = lab || '';
  });
}

// ---------------------------------------------------------------------------
function contactForm() {
  const form = $('[data-contact-form]');
  if (!form) return;
  const msg = $('[data-form-msg]', form);
  const show = (text, ok) => { msg.hidden = false; msg.textContent = text; msg.className = `form-msg form-msg--${ok ? 'ok' : 'error'}`; };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.prenom || !data.nom || !data.telephone || !data.email || !data.centre) return show('Merci de remplir les champs obligatoires (*).', false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return show('Votre adresse e-mail ne semble pas valide.', false);
    if (!form.rgpd.checked) return show('Merci d’accepter que vos informations soient utilisées pour vous recontacter.', false);
    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      show('Merci ! Votre demande est bien envoyée : votre centre vous recontacte très vite.', true);
    } catch {
      // repli : ouvre la messagerie avec la demande pré-remplie
      const emails = { Antibes: 'antibes@centrethetys.fr', 'Cannes · Le Cannet': 'lecannet@centrethetys.fr', 'Pégomas': 'pegomas@centrethetys.fr' };
      const to = emails[data.centre] || 'contact@centrethetys.fr';
      const body = `Prénom : ${data.prenom}\nNom : ${data.nom}\nTéléphone : ${data.telephone}\nE-mail : ${data.email}\nCentre : ${data.centre}\nObjet : ${data.objet}\nSolution : ${data.solution || '-'}\nRappel souhaité : ${data.rappel}\n\n${data.message || ''}`;
      location.href = `mailto:${to}?subject=${encodeURIComponent(`Demande de rappel · ${data.objet}`)}&body=${encodeURIComponent(body)}`;
      show('Votre messagerie s’ouvre avec votre demande pré-remplie : il ne reste plus qu’à l’envoyer.', true);
    } finally {
      btn.disabled = false;
    }
  });
}

function offers() {
  const now = new Date();
  for (const el of $$('[data-until]')) {
    const u = el.dataset.until;
    if (!u || el.matches('[data-announce]')) continue;
    if (now > new Date(`${u}T23:59:59`)) {
      el.classList.add('is-ended');
      const note = $('[data-offer-ended]', el);
      if (note) note.hidden = false;
    }
  }
}

// ---------------------------------------------------------------------------
// Transitions entre pages : rideau
// ---------------------------------------------------------------------------
function transitions(app) {
  const curtain = $('[data-curtain]');
  if (!curtain || app.reduce) return;
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) { root.classList.remove('is-leaving', 'is-arriving'); gsap.set(curtain, { clearProps: 'all' }); }
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (/\.(pdf|jpe?g|png|webp|avif|mp4|xml|txt)$/i.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    e.preventDefault();
    try { sessionStorage.setItem('thetys:nav', '1'); } catch {}
    root.classList.add('is-leaving');
    gsap.fromTo(curtain, { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut',
      onComplete: () => { location.href = url.href; },
    });
    gsap.fromTo($('svg', curtain), { rotation: -60, scale: 0.6, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.2 });
  });
}

export function initUI(app) {
  anchors(app);
  header(app);
  mega();
  menu(app);
  announcement();
  players(app);
  faq(app);
  compare();
  filters(app);
  universeNav();
  tilt(app);
  magnetic(app);
  cursor(app);
  contactForm();
  offers();
  transitions(app);
}
