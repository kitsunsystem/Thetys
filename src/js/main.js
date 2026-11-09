// Point d'entrée : défilement fluide, animations et interactions du site.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { initMotion, playIntro } from './motion.js';
import { initUI } from './ui.js';
import { initQuiz } from './quiz.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) root.classList.add('reduce-motion');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const whenActive = () => new Promise((r) => {
  if (document.prerendering) document.addEventListener('prerenderingchange', () => r(), { once: true });
  else r();
});

/** Défilement fluide (désactivé si l'utilisateur préfère réduire les animations). */
function initScroll() {
  if (reduce) return null;
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

async function boot() {
  const lenis = initScroll();
  window.__lenis = lenis;
  const app = { lenis, reduce, gsap, ScrollTrigger };

  await Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(1400)]);
  initUI(app);
  initMotion(app);
  initQuiz(app);
  root.classList.add('is-ready');

  await whenActive();
  await playIntro(app);

  // ancre dans l'adresse : on y va une fois tout en place
  if (location.hash && location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(() => app.scrollTo(target), 120);
  }
  ScrollTrigger.refresh();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
