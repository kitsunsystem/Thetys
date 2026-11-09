// Animations : intro, révélations au défilement, parallaxe, compteurs,
// bandes défilantes, défilement horizontal, liste avec image flottante.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const EXPO = 'expo.out';

// ---------------------------------------------------------------------------
// Découpage des titres en lignes masquées
// ---------------------------------------------------------------------------
const heroSplits = [];
let heroPlayed = false;
function splitHeadings(reduce) {
  for (const el of $$('[data-split]')) {
    el.classList.add('is-split');
    if (reduce) continue;
    const isHero = el.hasAttribute('data-split-hero');
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        if (isHero) {
          // nouveau découpage après redimensionnement : rester visible
          if (heroPlayed) return null;
          gsap.set(self.lines, { yPercent: 110 });
          heroSplits.push(self.lines);
          return null;
        }
        gsap.set(self.lines, { yPercent: 110 });
        return gsap.to(self.lines, {
          yPercent: 0,
          duration: 1.25,
          ease: EXPO,
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  }
  for (const el of $$('[data-split-words]')) {
    el.classList.add('is-split');
    if (reduce) continue;
    SplitText.create(el, {
      type: 'words',
      wordsClass: 'word',
      autoSplit: true,
      onSplit(self) {
        gsap.set(self.words, { opacity: 0, yPercent: 40 });
        return gsap.to(self.words, {
          opacity: 1, yPercent: 0, duration: 1, ease: EXPO, stagger: 0.025,
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        });
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Apparitions simples et en cascade
// ---------------------------------------------------------------------------
function reveals(reduce) {
  const items = [...$$('[data-reveal]'), ...$$('[data-stagger] > *')].filter((el) => !el.closest('[data-hero]') || el.matches('[data-stagger] > *'));
  if (reduce) return;
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: EXPO, stagger: 0.08, overwrite: true }),
  });
}

function mediaReveal(reduce) {
  for (const el of $$('[data-media-reveal]')) {
    if (el.closest('[data-hero]')) continue;
    if (reduce) { el.style.clipPath = 'none'; continue; }
    const img = $('img, video', el);
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.to(el, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.5, ease: 'expo.inOut' });
    if (img) tl.from(img, { scale: 1.3, duration: 1.8, ease: EXPO }, 0);
  }
}

function parallax(reduce) {
  if (reduce) return;
  for (const wrap of $$('[data-parallax-wrap]')) {
    const img = $('.media img, .media video, .player video', wrap);
    if (!img) continue;
    gsap.set(img, { scale: 1.12 });
    gsap.fromTo(img, { yPercent: -5 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }
  for (const el of $$('[data-parallax]')) {
    gsap.fromTo(el, { yPercent: -10 }, {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }
}

// ---------------------------------------------------------------------------
// Compteurs
// ---------------------------------------------------------------------------
function counters(reduce) {
  for (const el of $$('[data-count]')) {
    const raw = el.textContent.trim();
    const m = raw.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
    if (!m || /^[-–]\d/.test(m[2]) || reduce) continue;
    const decimals = (m[1].split(/[.,]/)[1] || '').length;
    const sep = m[1].includes(',') ? ',' : '.';
    const target = parseFloat(m[1].replace(',', '.'));
    const suffix = m[2];
    const obj = { v: 0 };
    const fmt = (v) => v.toFixed(decimals).replace('.', sep) + suffix;
    el.textContent = fmt(0);
    gsap.to(obj, {
      v: target, duration: 2.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = fmt(obj.v); },
    });
  }
}

// ---------------------------------------------------------------------------
// Bandes défilantes (vitesse liée au défilement)
// ---------------------------------------------------------------------------
function marquees(app) {
  for (const mq of $$('[data-marquee]')) {
    const tracks = $$('.marquee__track', mq);
    const speed = parseFloat(mq.dataset.marqueeSpeed || '1');
    const width = tracks[0].offsetWidth;
    const duration = Math.max(18, width / (70 * speed));
    const tl = gsap.to(tracks, { xPercent: -100, repeat: -1, duration, ease: 'none' });
    if (app.reduce) { tl.pause(); continue; }
    let dir = 1;
    ScrollTrigger.create({
      trigger: mq, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity();
        if (v !== 0) dir = v > 0 ? 1 : -1;
        const boost = 1 + Math.min(Math.abs(v) / 450, 5);
        gsap.to(tl, { timeScale: dir * boost, duration: 0.25, overwrite: true });
        gsap.to(tl, { timeScale: dir, duration: 1.2, delay: 0.25 });
      },
      onToggle: (self) => (self.isActive ? tl.resume() : tl.pause()),
    });
  }
}

// ---------------------------------------------------------------------------
// Manifeste : les mots s'allument au fil du défilement
// ---------------------------------------------------------------------------
function scrubWords(reduce) {
  for (const el of $$('[data-scrub-words]')) {
    if (reduce) continue;
    const split = SplitText.create(el, { type: 'words', wordsClass: 'w' });
    gsap.to(split.words, {
      opacity: 1, ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 },
    });
  }
}

// ---------------------------------------------------------------------------
// Plateau technique : défilement horizontal épinglé
// ---------------------------------------------------------------------------
function plateau(app) {
  const sec = $('[data-plateau]');
  if (!sec || app.reduce) return;
  const pin = $('[data-plateau-pin]', sec);
  const track = $('[data-plateau-track]', sec);
  const bar = $('[data-plateau-progress]', sec);
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress }),
      },
    });
    // légère rotation des cartes selon la vitesse
    const cards = $$('.plateau__card .card__media', sec);
    const skew = gsap.quickTo(cards, 'skewX', { duration: 0.5, ease: 'power3' });
    const st = tween.scrollTrigger;
    const tick = () => skew(gsap.utils.clamp(-6, 6, st.getVelocity() / -300));
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });
}

// ---------------------------------------------------------------------------
// Liste « Qu'est-ce qui vous amène ? » : image flottante sous le curseur
// ---------------------------------------------------------------------------
function hoverList(app) {
  const sec = $('[data-hover-list]');
  if (!sec || app.reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const float = $('[data-hover-float]', sec);
  const img = $('img', float);
  const xTo = gsap.quickTo(float, 'x', { duration: 0.7, ease: 'power3' });
  const yTo = gsap.quickTo(float, 'y', { duration: 0.7, ease: 'power3' });
  const rTo = gsap.quickTo(float, 'rotation', { duration: 0.9, ease: 'power3' });
  let lastX = 0;
  gsap.set(float, { xPercent: -50, yPercent: -50, scale: 0.6 });
  const cache = new Map();
  window.addEventListener('pointermove', (e) => {
    xTo(e.clientX); yTo(e.clientY);
    rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
    lastX = e.clientX;
  }, { passive: true });
  for (const item of $$('.hover-list__item', sec)) {
    const src = item.dataset.hoverImg;
    if (src && !cache.has(src)) { const i = new Image(); i.src = src; cache.set(src, i); }
    item.addEventListener('pointerenter', () => {
      if (img.getAttribute('src') !== src) {
        gsap.fromTo(img, { scale: 1.25, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.8, ease: EXPO });
        img.src = src;
      }
      gsap.to(float, { autoAlpha: 1, scale: 1, duration: 0.6, ease: EXPO });
    });
  }
  $('.hover-list', sec).addEventListener('pointerleave', () => gsap.to(float, { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: 'power3.out' }));
}

// ---------------------------------------------------------------------------
// Carte de la côte : tracé du littoral, épingles
// ---------------------------------------------------------------------------
function coast(reduce) {
  for (const map of $$('[data-coast]')) {
    const line = $('[data-draw]', map);
    if (line && !reduce) {
      const len = line.getTotalLength();
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(line, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', scrollTrigger: { trigger: map, start: 'top 80%', once: true } });
      gsap.from($$('.coast__pin', map), {
        scale: 0, transformOrigin: 'center', duration: 0.9, ease: 'back.out(2)', stagger: 0.15,
        scrollTrigger: { trigger: map, start: 'top 70%', once: true }, delay: 0.8,
      });
    }
    const section = map.closest('section');
    for (const pin of $$('[data-pin]', map)) {
      const card = section && $(`[data-centre="${pin.dataset.pin}"]`, section);
      if (!card) continue;
      const on = () => { pin.classList.add('is-active'); card.classList.add('is-active'); };
      const off = () => { pin.classList.remove('is-active'); card.classList.remove('is-active'); };
      card.addEventListener('pointerenter', on); card.addEventListener('pointerleave', off);
      pin.addEventListener('pointerenter', on); pin.addEventListener('pointerleave', off);
    }
  }
}

// ---------------------------------------------------------------------------
// Héro de l'accueil : la vidéo se rétracte au défilement
// ---------------------------------------------------------------------------
function heroScroll(reduce) {
  const hero = $('[data-hero-home]');
  if (!hero || reduce) return;
  const media = $('[data-hero-media]', hero);
  const inner = $('.hero__inner', hero);
  gsap.to(media, {
    scale: 0.92, borderRadius: 40, yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to(inner, { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__mark', { rotation: 90, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

// ---------------------------------------------------------------------------
// Pied de page : le mot « thetys » se lève
// ---------------------------------------------------------------------------
function footerWord(reduce) {
  const w = $('.footer__wordmark');
  if (!w || reduce) return;
  gsap.fromTo(w, { yPercent: 40, opacity: 0 }, {
    yPercent: 0, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '.footer__word', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
}

export function initMotion(app) {
  const { reduce } = app;
  splitHeadings(reduce);
  reveals(reduce);
  mediaReveal(reduce);
  parallax(reduce);
  counters(reduce);
  marquees(app);
  scrubWords(reduce);
  plateau(app);
  hoverList(app);
  coast(reduce);
  heroScroll(reduce);
  footerWord(reduce);
}

// ---------------------------------------------------------------------------
// Intro : préchargement (première visite), rideau (navigation), héro
// ---------------------------------------------------------------------------
function heroIn(reduce) {
  const tl = gsap.timeline();
  const hero = $('[data-hero], [data-hero-home]');
  if (reduce || !hero) { heroPlayed = true; gsap.set(heroSplits.flat(), { yPercent: 0 }); return tl; }
  const media = $$('[data-hero-media]');
  if (media.length) {
    tl.fromTo(media, { clipPath: 'inset(14% 10% 14% 10% round 36px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.8, ease: 'expo.inOut' }, 0);
    const inner = media.map((m) => $('img, video', m)).filter(Boolean);
    tl.fromTo(inner, { scale: 1.35 }, { scale: 1.04, duration: 2.4, ease: EXPO }, 0);
    // les médias d'en-tête des pages intérieures gardent leurs coins arrondis
    $$('.page-hero [data-hero-media], .article [data-hero-media]').forEach((m) => tl.set(m, { clipPath: 'none' }, '>'));
  }
  heroSplits.forEach((lines, i) => tl.to(lines, { yPercent: 0, duration: 1.4, ease: EXPO, stagger: 0.1 }, 0.35 + i * 0.1));
  tl.call(() => { heroPlayed = true; }, null, 0.36);
  const fades = $$('[data-hero-fade]');
  if (fades.length) tl.fromTo(fades, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, ease: EXPO, stagger: 0.08 }, 0.7);
  const rev = $$('[data-hero] [data-reveal]');
  if (rev.length) tl.to(rev, { opacity: 1, y: 0, duration: 1.1, ease: EXPO, stagger: 0.07 }, 0.6);
  return tl;
}

function loaderIn() {
  const loader = $('[data-loader]');
  return new Promise((resolve) => {
    const count = $('[data-loader-count]', loader);
    const line = $('.loader__line i', loader);
    const petals = $$('.loader__mark use, .loader__mark g > g', loader);
    const obj = { v: 0 };
    const tl = gsap.timeline({ onComplete: resolve });
    tl.from('.loader__mark', { rotation: -120, scale: 0.4, opacity: 0, duration: 1.6, ease: EXPO }, 0)
      .from(petals, { opacity: 0, scale: 0.6, transformOrigin: '0 0', stagger: 0.08, duration: 0.9, ease: EXPO }, 0.1)
      .from('.loader__word', { opacity: 0, y: 18, duration: 1, ease: EXPO }, 0.5)
      .to(obj, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { count.textContent = Math.round(obj.v); } }, 0.1)
      .to(line, { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0.1)
      .to('.loader__inner', { y: -30, opacity: 0, duration: 0.7, ease: 'power3.in' }, 1.9)
      .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, 2.2)
      .set(loader, { display: 'none' });
  });
}

export async function playIntro(app) {
  const root = document.documentElement;
  const loader = $('[data-loader]');
  const curtain = $('[data-curtain]');
  if (app.reduce) {
    root.classList.remove('is-arriving');
    if (loader) loader.style.display = 'none';
    return;
  }
  if (loader && !root.classList.contains('no-loader')) {
    try { sessionStorage.setItem('thetys:seen', '1'); } catch {}
    app.lenis?.stop();
    window.scrollTo(0, 0);
    const done = loaderIn();
    setTimeout(() => heroIn(false), 2400);
    await done;
    app.lenis?.start();
    return;
  }
  if (loader) loader.style.display = 'none';
  if (root.classList.contains('is-arriving') && curtain) {
    gsap.set(curtain, { clipPath: 'inset(0% 0% 0% 0%)' });
    gsap.to(curtain, {
      clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut', delay: 0.05,
      onComplete: () => { root.classList.remove('is-arriving'); gsap.set(curtain, { clearProps: 'clipPath' }); },
    });
    heroIn(false).delay(0.35);
    return;
  }
  heroIn(false);
}
