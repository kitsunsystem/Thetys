// Page d'accueil
import { html, esc, md, site, pages, soins, journal, picture, imgUrl, icon, markSvg, waHref, accent } from '../../scripts/lib/core.mjs';
import { btn } from './layout.mjs';
import { sHead, eyebrow, soinCard, postCard, reviewCard, faqList, centresSection, ctaSection, trustBand, faqSchema } from './partials.mjs';

export function home() {
  const p = pages.home;
  const featured = p.plateau.featured.map((slug) => soins.find((s) => s.slug === slug)).filter(Boolean);
  const results = pages.results.featured.slice(0, 5);
  const posts = [];
  for (const x of journal) { if (posts.length < 3 && !posts.some((y) => y.cover === x.cover)) posts.push(x); }
  const giant = p.marquee.map((t, i) => (i % 3 === 1 ? `<span class="outline">${esc(t)}</span>` : i % 3 === 2 ? `<em>${esc(t)}</em>` : `<span>${esc(t)}</span>`) + markSvg({ cls: 'mk' })).join('');

  const body = html`
  <section class="hero" data-hero-home>
    <div class="hero__media" data-hero-media style="background:#0e1828 url(${imgUrl('poster-hero-ambiance', 1440)}) center / cover no-repeat">
      <video class="hero__video" autoplay muted loop playsinline preload="auto" poster="${imgUrl('poster-hero-ambiance', 1440)}" aria-hidden="true" data-hero-video>
        <source src="/media/video/hero-ambiance.mp4" type="video/mp4">
      </video>
      <div class="hero__veil"></div>
    </div>
    <div class="wrap hero__inner">
      <p class="hero__places" data-hero-fade>${esc(p.places)}</p>
      <h1 class="hero__h1">
        <span class="hero__kicker" data-hero-fade>${esc(p.h1)}</span>
        <span class="hero__title h-hero" data-split data-split-hero>${p.title}</span>
      </h1>
      <div class="hero__bottom">
        <p class="hero__intro" data-hero-fade>${esc(p.intro)}</p>
        <div class="hero__actions" data-hero-fade>
          ${btn('Réserver mon diagnostic', '/rendez-vous/', { variant: 'gold' })}
          ${btn('WhatsApp', waHref(), { variant: 'ghost-light', icon: 'whatsapp' })}
        </div>
      </div>
      <a class="hero__rating" href="#avis" data-hero-fade>
        <span class="hero__stars" aria-hidden="true">${icon('star').repeat(5)}</span>
        <span><strong>${site.rating.value} sur 5</strong> · ${site.rating.count.replace('+', '')} avis Google vérifiés</span>
      </a>
      <div class="hero__scroll" aria-hidden="true" data-hero-fade><span>Défiler</span><i></i></div>
    </div>
    ${markSvg({ cls: 'hero__mark' })}
  </section>

  ${trustBand()}

  <section class="section statement" data-statement>
    <div class="wrap">
      <p class="eyebrow" data-reveal>Les technologistes de beauté · depuis ${site.since}</p>
      <p class="statement__text serif" data-scrub-words>Depuis plus de 17 ans, notre mission est d’unir <em>la technologie</em> et <em>les valeurs humaines,</em> au service de la performance. Nous aidons ainsi les femmes et les hommes à mieux se sentir dans leur peau, durablement.</p>
      <div class="stats mt-l" style="--n:4" data-stagger>
        ${p.stats.map((s) => html`<div class="stats__item"><span class="stats__value" data-count>${esc(s.value)}</span><span class="stats__label">${esc(s.label)}</span></div>`)}
      </div>
    </div>
  </section>

  <section class="section section--white diag-home">
    <div class="wrap">
      ${sHead({ eyebrow: p.diag.eyebrow, title: p.diag.title, lead: p.diag.text, split: true, raw: true })}
      <div class="diag-cards" data-stagger>
        ${p.diag.cards.map((c) => html`<a class="diag-card" href="/diagnostic/?besoin=${c.kind}#quiz" data-cursor="Commencer">
          <div class="diag-card__media">${picture(c.image, { alt: '', sizes: '(max-width: 800px) 100vw, 50vw' })}</div>
          <div class="diag-card__body">
            <span class="diag-card__time"><span>${esc(c.time)}</span></span>
            <h3 class="diag-card__title serif">${esc(c.title)}</h3>
            <p>${esc(c.text)}</p>
            <span class="text-link"><span>${esc(c.cta)}</span><span class="arrow">${icon('arrow')}</span></span>
          </div>
        </a>`)}
      </div>
      <p class="diag-home__expert" data-reveal>${p.diag.expert}</p>
    </div>
  </section>

  <section class="section needs-home" data-hover-list>
    <div class="wrap">
      ${sHead({ eyebrow: p.needs.eyebrow, title: p.needs.title, split: true, raw: true, lead: 'Anti-âge, qualité de peau, silhouette, épilation définitive ou cheveux : choisissez votre point de départ, nous construisons le reste avec vous.' })}
      <ul class="hover-list">
        ${p.needs.items.map((n) => html`<li>
          <a class="hover-list__item" href="${n.href}" data-hover-img="${imgUrl(n.image, 960)}">
            <span class="hover-list__num">${n.num}</span>
            <span class="hover-list__title serif">${esc(n.title)}</span>
            <span class="hover-list__kw">${esc(n.keywords)}</span>
            <span class="hover-list__arrow">${icon('arrowUpRight')}</span>
          </a>
        </li>`)}
      </ul>
      <div class="ce-badge" data-reveal>
        <span class="ce-badge__mark">CE</span>
        <p><strong>${esc(p.needs.badge.title)}</strong> ${esc(p.needs.badge.text)}</p>
      </div>
    </div>
    <div class="hover-list__float" data-hover-float aria-hidden="true"><img alt="" src="${imgUrl(p.needs.items[0].image, 960)}"></div>
  </section>

  <section class="plateau section--dark" data-plateau>
    <div class="plateau__pin" data-plateau-pin>
      <div class="wrap plateau__head">
        <div>
          ${eyebrow(p.plateau.eyebrow)}
          <h2 class="h2" data-split>${p.plateau.title}</h2>
          <p class="lead plateau__lead" data-reveal>${esc(p.plateau.text)}</p>
        </div>
        <div>
          <ol class="plateau__list" data-stagger>
            ${p.plateau.list.map((l) => html`<li><a href="${l.href}"><span>${l.num}</span><strong>${esc(l.title)}</strong><em>${esc(l.text)}</em></a></li>`)}
          </ol>
        </div>
      </div>
      <div class="plateau__track-wrap">
        <div class="plateau__track" data-plateau-track>
          ${featured.map((s, i) => html`<div class="plateau__card"><span class="plateau__idx">${String(i + 1).padStart(2, '0')}</span>${soinCard(s, { sizes: '(max-width: 800px) 75vw, 26vw' })}</div>`)}
          <div class="plateau__card plateau__card--all">
            <a href="/soins/" class="plateau__all" data-cursor="Explorer">
              ${markSvg({ cls: 'plateau__all-mark' })}
              <span class="serif">Les 21 technologies</span>
              <span class="text-link"><span>Toutes nos solutions</span><span class="arrow">${icon('arrow')}</span></span>
            </a>
          </div>
        </div>
      </div>
      <div class="wrap plateau__progress" aria-hidden="true"><i data-plateau-progress></i></div>
    </div>
  </section>

  <div class="marquee marquee--giant" data-marquee data-marquee-speed="0.6" aria-hidden="true">
    <div class="marquee__track">${giant}</div><div class="marquee__track">${giant}</div>
  </div>

  <section class="section proof">
    <div class="wrap">
      ${sHead({ eyebrow: p.proof.eyebrow, title: p.proof.title, lead: p.proof.text, split: true, raw: true })}
      <div class="proof__grid">
        <figure class="proof__main" data-media-reveal>
          <div class="media media--square">${picture(results[0].image, { alt: `Avant / après ${results[0].label} au Centre Thetys`, sizes: '(max-width: 900px) 100vw, 55vw' })}</div>
          <figcaption class="caption">HIFU · Résultat réel</figcaption>
        </figure>
        <div class="proof__side">
          <div class="proof__stack" data-stack>
            ${results.slice(1).map((r, i) => html`<a class="proof__card" href="${r.href}" style="--i:${i}">
              <div class="media media--square">${picture(r.image, { alt: `Avant / après ${r.label} au Centre Thetys`, sizes: '(max-width: 900px) 90vw, 30vw' })}</div>
              <span class="proof__label">${esc(r.label)}</span>
            </a>`)}
          </div>
          <p class="note" data-reveal>${esc(p.proof.note)}</p>
          ${btn('Voir tous les résultats', '/resultats/', { variant: 'ghost' })}
        </div>
      </div>
    </div>
  </section>

  <section class="section section--dark film" data-film>
    <div class="wrap">
      <div class="split">
        <div>
          ${eyebrow(p.film.eyebrow)}
          <h2 class="h2" data-split>${p.film.title}</h2>
          <p class="lead mt-s" data-reveal>${esc(p.film.text)}</p>
          <div class="btn-row mt-m" data-reveal>${btn('Nos centres', '/centres/', { variant: 'ghost-light' })}</div>
        </div>
        <div class="film__frame" data-media-reveal>
          ${filmPlayer()}
        </div>
      </div>
    </div>
  </section>

  <section class="section section--sand" id="avis">
    <div class="wrap">
      ${sHead({ eyebrow: 'Avis Google', title: p.reviewsTitle, raw: true, split: true, lead: `${site.rating.value} sur 5 · ${site.rating.count} avis Google vérifiés sur nos trois centres.` })}
      <div class="reviews" data-stagger>${site.reviews.map(reviewCard)}</div>
    </div>
  </section>

  <section class="section" id="faq">
    <div class="wrap faq-layout">
      <div class="faq-layout__head">${eyebrow(p.faq.eyebrow)}<h2 class="h2" data-split>${p.faq.title}</h2>
        <div class="btn-row mt-m" data-reveal>${btn('Faire mon auto-diagnostic', '/diagnostic/', { variant: 'ghost' })}</div>
      </div>
      ${faqList(p.faq.items)}
    </div>
  </section>

  ${centresSection({ eyebrow: p.centres.eyebrow, title: p.centres.title })}

  <section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'Le journal', title: 'Conseils, protocoles <em>et nouveautés.</em>', raw: true, split: true, lead: 'Nos expertes partagent leurs connaissances sur les technologies, les soins et les bons gestes.' })}
      <div class="grid grid--3" data-stagger>${posts.map((x) => postCard(x))}</div>
      <div class="center mt-m" data-reveal>${btn('Tous les articles', '/journal/', { variant: 'ghost' })}</div>
    </div>
  </section>

  ${ctaSection({ title: p.cta.title, text: p.cta.text, raw: true })}
  `;
  return { body, dark: true, schema: faqSchema(p.faq.items), bodyClass: 'is-home' };
}

function filmPlayer() {
  const poster = imgUrl('poster-film-biologique-recherche', 1440);
  return html`<figure class="player player--film" data-player data-autoplay="0">
    <video playsinline preload="none" poster="${poster}" aria-label="Film : le soin visage sur-mesure au Centre Thetys">
      <source src="/media/video/film-biologique-recherche.mp4" type="video/mp4">
    </video>
    <button class="player__play" type="button" aria-label="Lire le film"><span>${icon('play')}</span></button>
    <div class="player__ui"><span class="player__btn" aria-hidden="true">Le soin visage sur-mesure · 1 min 22</span><span></span></div>
    <div class="player__progress" aria-hidden="true"><i></i></div>
  </figure>`;
}
