// Blocs réutilisables : en-têtes de section, rendu des sections de contenu,
// cartes, FAQ, centres, avis, appel à l'action.
import {
  html, esc, md, paras, accent, picture, player, icon, site, soins, journal, mapUrl, imageId, markSvg,
  telHref, frDate, readingTime, CATEGORIES, NEW_SOINS, stripTags, soinImage,
} from '../../scripts/lib/core.mjs';
import { btn } from './layout.mjs';

export const eyebrow = (t, cls = '') => (t ? `<p class="eyebrow ${cls}" data-reveal>${esc(t)}</p>` : '');

/** En-tête de section : sur-titre, titre, chapeau. */
export function sHead({ eyebrow: eb, title, lead, level = 2, cls = '', split = false, center = false, raw = false }) {
  const T = `h${level}`;
  const t = raw ? title : accent(title);
  return html`<header class="s-head ${split ? 's-head--split' : ''} ${center ? 's-head--center' : ''} ${cls}">
    <div>${eyebrow(eb)}${title ? `<${T} class="h2" data-split>${t}</${T}>` : ''}</div>
    ${lead ? `<div class="lead" data-reveal>${Array.isArray(lead) ? paras(lead) : `<p>${md(lead)}</p>`}</div>` : ''}
  </header>`;
}

const figure = (img, { sizes = '(max-width: 900px) 100vw, 50vw', cls = 'media--portrait', reveal = true } = {}) => {
  if (!img) return '';
  const src = img.src || img;
  const pic = picture(src, { alt: img.alt || '', sizes });
  if (!pic) return '';
  return html`<figure class="figure">
    <div class="media ${cls}" ${reveal ? 'data-media-reveal' : ''}>${pic}</div>
    ${img.caption ? `<figcaption class="caption">${esc(img.caption)}</figcaption>` : ''}
  </figure>`;
};

// ---------------------------------------------------------------------------
// Sections de contenu (fiches soins, besoins)
// ---------------------------------------------------------------------------
let flip = false;
export function renderSections(sections = [], ctx = {}) {
  flip = false;
  return sections.map((s, i) => renderSection(s, i, ctx)).join('');
}

function bg(i, s) {
  if (s.type === 'quote') return 'section--dark';
  if (s.type === 'stats') return 'section--sand';
  return i % 2 ? 'section--white' : '';
}

function renderSection(s, i, ctx) {
  const id = s.id ? ` id="${esc(s.id)}"` : '';
  switch (s.type) {
    case 'prose': return prose(s, i, id, ctx);
    case 'features': return features(s, i, id);
    case 'stats': return stats(s, i, id);
    case 'tags': return tags(s, i, id);
    case 'steps': return steps(s, i, id);
    case 'quote': return quote(s, i, id);
    case 'pricing': return pricing(s, i, id);
    case 'list': return list(s, i, id);
    case 'comparison': return comparison(s, i, id);
    case 'gallery': return gallery(s, i, id);
    default: return '';
  }
}

function prose(s, i, id, ctx) {
  const media = s.video ? player(s.video.src || s.video, { label: s.video.caption || ctx.videoLabel || '' }) : figure(s.image);
  const hasMedia = Boolean(media);
  if (!s.title && !s.paragraphs?.length && hasMedia) {
    return html`<section class="section section--tight ${bg(i, s)}"${id}><div class="wrap wrap--narrow">${media}</div></section>`;
  }
  if (!s.paragraphs?.length && !hasMedia) {
    // simple intertitre
    return html`<section class="section section--tight section--title ${bg(i, s)}"${id}><div class="wrap">${sHead({ eyebrow: s.eyebrow, title: s.title, lead: s.subtitle })}</div></section>`;
  }
  flip = !flip;
  return html`<section class="section ${bg(i, s)}"${id}>
    <div class="wrap ${hasMedia ? `split split--top ${flip ? '' : 'split--reverse'}` : 'wrap--text'}">
      <div class="prose-block">
        ${eyebrow(s.eyebrow)}
        ${s.title ? `<h2 class="h2" data-split>${accent(s.title)}</h2>` : ''}
        ${s.subtitle ? `<p class="prose-block__sub serif" data-reveal>${md(s.subtitle)}</p>` : ''}
        <div class="rich" data-reveal>${paras(s.paragraphs)}${s.note ? `<p class="note">${md(s.note)}</p>` : ''}</div>
      </div>
      ${hasMedia ? `<div class="prose-media" data-parallax-wrap>${media}</div>` : ''}
    </div>
  </section>`;
}

function features(s, i, id) {
  const n = s.items?.length || 0;
  const cols = n === 2 || n === 4 ? 2 : 3;
  return html`<section class="section ${bg(i, s)}"${id}>
    <div class="wrap">
      ${s.image ? html`<div class="split split--top features__intro">
          <div>${eyebrow(s.eyebrow)}${s.title ? `<h2 class="h2" data-split>${accent(s.title)}</h2>` : ''}<div class="rich mt-s" data-reveal>${paras(s.paragraphs)}</div></div>
          <div data-parallax-wrap>${figure(s.image, { cls: 'media--wide' })}</div>
        </div>`
        : sHead({ eyebrow: s.eyebrow, title: s.title, lead: s.paragraphs?.length ? s.paragraphs : null, split: true })}
      <div class="features features--${cols}" data-stagger>
        ${(s.items || []).map((it, k) => html`<article class="feature">
          ${it.image ? html`<div class="media media--wide feature__media">${picture(it.image.src || it.image, { alt: it.image.alt || '', sizes: '(max-width: 800px) 100vw, 33vw' })}</div>` : ''}
          <div class="feature__top">
            <span class="feature__num">${it.icon ? esc(it.icon) : String(k + 1).padStart(2, '0')}</span>
            ${it.tag ? `<span class="feature__tag">${esc(it.tag)}</span>` : ''}
          </div>
          ${it.eyebrow ? `<p class="feature__eyebrow">${esc(it.eyebrow)}</p>` : ''}
          <h3 class="feature__title">${md(it.title)}</h3>
          ${it.subtitle ? `<p class="feature__sub">${md(it.subtitle)}</p>` : ''}
          <div class="feature__text">${paras(String(it.text || '').split(/\n\n|\n/))}</div>
          ${it.url ? `<a class="text-link feature__link" href="${esc(mapUrl(it.url))}"><span>Découvrir</span><span class="arrow">${icon('arrow')}</span></a>` : ''}
          ${it.tags?.length ? `<ul class="tags tags--sm">${it.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        </article>`)}
      </div>
    </div>
  </section>`;
}

function stats(s, i, id) {
  return html`<section class="section ${bg(i, s)}"${id}>
    <div class="wrap">
      <div class="${s.image ? 'split split--top' : ''}">
        <div>
          ${sHead({ eyebrow: s.eyebrow, title: s.title })}
          <div class="timeline" data-stagger>
            ${(s.items || []).map((it) => html`<div class="timeline__item">
              <span class="timeline__value serif">${esc(it.value)}</span>
              <span class="timeline__label">${md(it.label)}</span>
            </div>`)}
          </div>
          ${s.paragraphs?.length ? `<div class="rich mt-m" data-reveal>${paras(s.paragraphs)}</div>` : ''}
          ${s.note ? `<p class="note mt-m" data-reveal>${md(s.note)}</p>` : ''}
        </div>
        ${s.image ? `<div data-parallax-wrap>${figure(s.image, { cls: 'media--square' })}</div>` : ''}
      </div>
    </div>
  </section>`;
}

function tags(s, i, id) {
  return html`<section class="section section--tight ${bg(i, s)}"${id}>
    <div class="wrap">
      <div class="split split--top">
        <div>${eyebrow(s.eyebrow)}${s.title ? `<h2 class="h2" data-split>${accent(s.title)}</h2>` : ''}</div>
        <div>
          <ul class="tags" data-stagger>${(s.items || []).map((t) => `<li>${md(t)}</li>`).join('')}</ul>
          ${s.note ? `<p class="note mt-s">${md(s.note)}</p>` : ''}
        </div>
      </div>
    </div>
  </section>`;
}

export function stepsBlock(items = [], { dark = false } = {}) {
  return html`<ol class="steps" style="--n:${Math.min(items.length, 4)}" data-stagger>
    ${items.map((it, k) => html`<li class="step">
      <span class="step__num">${String(k + 1).padStart(2, '0')}</span>
      <h3 class="step__title">${md(it.title)}</h3>
      <div class="step__text">${paras(String(it.text || '').split(/\n\n/))}</div>
    </li>`)}
  </ol>`;
}

function steps(s, i, id) {
  return html`<section class="section ${bg(i, s)}"${id}>
    <div class="wrap">
      ${sHead({ eyebrow: s.eyebrow, title: s.title, lead: s.paragraphs?.length ? s.paragraphs : null, split: true })}
      ${stepsBlock(s.items)}
    </div>
  </section>`;
}

function quote(s, i, id) {
  return html`<section class="section section--dark section--quote"${id}>
    <div class="wrap">
      <figure class="pull-quote">
        <blockquote data-split-words>${md(s.text.replace(/^[«“"]\s*|\s*[»”"]$/g, ''))}</blockquote>
        ${s.cite ? `<figcaption data-reveal>${esc(s.cite)}</figcaption>` : ''}
      </figure>
    </div>
  </section>`;
}

function pricing(s, i, id) {
  return html`<section class="section ${bg(i, s)}"${id}>
    <div class="wrap">
      ${sHead({ eyebrow: s.eyebrow, title: s.title, split: true })}
      <div class="pricing" data-stagger>
        ${(s.items || []).map((it) => html`<div class="price">
          <span class="price__label">${md(it.label)}</span>
          <span class="price__value">${md(it.price)}</span>
          ${it.text ? `<p class="price__text">${md(it.text)}</p>` : ''}
        </div>`)}
      </div>
      ${s.note && !/Carte cadeau/i.test(s.note) ? `<p class="note mt-s">${md(s.note)}</p>` : ''}
    </div>
  </section>`;
}

function list(s, i, id) {
  return html`<section class="section ${bg(i, s)}"${id}>
    <div class="wrap ${s.image ? 'split split--top' : 'wrap--text'}">
      <div>
        ${eyebrow(s.eyebrow)}${s.title ? `<h2 class="h2" data-split>${accent(s.title)}</h2>` : ''}
        <div class="rich mt-s" data-reveal>${paras(s.paragraphs)}</div>
        <ul class="checklist mt-s" data-stagger>${(s.items || []).map((t) => `<li>${icon('check')}<span>${md(t)}</span></li>`).join('')}</ul>
      </div>
      ${s.image ? `<div data-parallax-wrap>${figure(s.image)}</div>` : ''}
    </div>
  </section>`;
}

function comparison(s, i, id) {
  const cols = s.columns || [];
  return html`<section class="section ${bg(i, s)}"${id}>
    <div class="wrap">
      ${sHead({ eyebrow: s.eyebrow, title: s.title, lead: s.paragraphs?.length ? s.paragraphs : null, split: true })}
      <div class="table-wrap" data-reveal>
        <table class="table">
          ${cols.length ? `<thead><tr>${cols.map((c) => `<th scope="col">${md(c)}</th>`).join('')}</tr></thead>` : ''}
          <tbody>${(s.rows || []).map((r) => `<tr>${r.map((c, k) => (k === 0 && cols.length > 2 ? `<th scope="row">${md(c)}</th>` : `<td>${md(c)}</td>`)).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
      ${s.note ? `<p class="note mt-s">${md(s.note)}</p>` : ''}
    </div>
  </section>`;
}

function gallery(s, i, id) {
  const imgs = (s.images || []).filter((im) => imageId(im.src || im));
  if (!imgs.length) return '';
  return html`<section class="section ${bg(i, s)}"${id}>
    <div class="wrap">
      ${sHead({ eyebrow: s.eyebrow, title: s.title, lead: s.paragraphs?.length ? s.paragraphs : null, split: true })}
      <div class="gallery gallery--${Math.min(imgs.length, 4)}" data-stagger>
        ${imgs.map((im) => html`<figure class="gallery__item">
          <div class="media media--square">${picture(im.src || im, { alt: im.alt || '', sizes: '(max-width: 800px) 50vw, 25vw' })}</div>
          ${im.caption ? `<figcaption class="caption">${esc(im.caption)}</figcaption>` : ''}
        </figure>`)}
      </div>
    </div>
  </section>`;
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export function faqList(items = []) {
  return html`<div class="faq" data-faq>
    ${items.map((f) => html`<details class="faq__item">
      <summary>${md(f.q)}<span class="faq__icon" aria-hidden="true"></span></summary>
      <div class="faq__answer"><div class="rich">${paras(String(f.a).split(/\n\n/))}</div></div>
    </details>`)}
  </div>`;
}
export function faqSection({ eyebrow: eb = 'Vos questions', title, items, dark = false, cls = '' }) {
  if (!items?.length) return '';
  return html`<section class="section ${dark ? 'section--dark' : ''} ${cls}" id="faq">
    <div class="wrap faq-layout">
      <div class="faq-layout__head">${eyebrow(eb)}<h2 class="h2" data-split>${accent(title || 'Questions fréquentes.')}</h2>
        <p class="muted mt-s" data-reveal>Une autre question ? Nos expertes vous répondent au <a class="link-u" href="${telHref(site.centres[0].tel)}">${site.centres[0].phone}</a> ou lors de votre diagnostic offert.</p>
      </div>
      ${faqList(items)}
    </div>
  </section>`;
}
export const faqSchema = (items = []) => (items.length ? [{
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: stripTags(f.q), acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) } })),
}] : []);

// ---------------------------------------------------------------------------
// Cartes
// ---------------------------------------------------------------------------
export function soinCard(s, { sizes = '(max-width: 480px) 100vw, (max-width: 800px) 50vw, 25vw', withCat = true } = {}) {
  const cat = CATEGORIES.find((c) => c.slug === s.category);
  return html`<a class="card soin-card" href="/soins/${s.slug}/" data-cursor="Découvrir">
    <div class="card__media">${picture(soinImage(s), { alt: s.name, sizes })}
      ${NEW_SOINS.has(s.slug) ? '<span class="media__tag">Nouveau</span>' : ''}
    </div>
    <div class="card__body">
      ${withCat && cat ? `<p class="card__meta">${cat.label}</p>` : ''}
      <h3 class="card__title"><span>${esc(s.name)}</span><span class="arrow-sm">${icon('arrowUpRight')}</span></h3>
      <p class="card__text">${md(s.card || '')}</p>
    </div>
  </a>`;
}

export function postCard(p, { sizes = '(max-width: 800px) 100vw, 33vw', big = false } = {}) {
  return html`<a class="card post-card ${big ? 'post-card--big' : ''}" href="/journal/${p.slug}/" data-cursor="Lire">
    <div class="card__media">${picture(p.cover, { alt: '', sizes })}</div>
    <div class="card__body">
      <p class="card__meta"><time datetime="${p.date}">${frDate(p.date)}</time><span aria-hidden="true">·</span><span>${readingTime(p.words)} min de lecture</span></p>
      <h3 class="card__title"><span>${esc(p.title)}</span><span class="arrow-sm">${icon('arrowUpRight')}</span></h3>
      ${big && p.description ? `<p class="card__text">${esc(p.description)}</p>` : ''}
    </div>
  </a>`;
}

export function relatedPosts(urls = [], { title = 'Nos articles sur le sujet', limit = 3 } = {}) {
  const slugs = urls.map((u) => String(u).replace(/^https?:\/\/[^/]+/, '').replace(/^\/|\/$/g, '').split('/').pop());
  const posts = slugs.map((sl) => journal.find((p) => p.slug === sl)).filter(Boolean).slice(0, limit);
  if (!posts.length) return '';
  return html`<section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'Le journal', title, split: true })}
      <div class="grid grid--3" data-stagger>${posts.map((p) => postCard(p))}</div>
    </div>
  </section>`;
}

export function reviewCard(r) {
  return html`<figure class="review">
    <div>
      <div class="review__stars" aria-label="5 étoiles sur 5">${icon('star').repeat(5)}</div>
      <blockquote>« ${esc(r.text)} »</blockquote>
    </div>
    <figcaption>${esc(r.author)}${r.meta ? ` · ${esc(r.meta)}` : ''}</figcaption>
  </figure>`;
}

// ---------------------------------------------------------------------------
// Centres
// ---------------------------------------------------------------------------
export function centreCard(c, { book = true } = {}) {
  return html`<article class="centre-card" data-centre="${c.slug}">
    <a class="centre-card__media media media--wide" href="/centres/${c.slug}/" data-cursor="Visiter" tabindex="-1" aria-hidden="true">${picture(c.image, { alt: '', sizes: '(max-width: 900px) 100vw, 33vw' })}</a>
    <div class="centre-card__body">
      <p class="card__meta">${esc(c.short)}</p>
      <h3 class="centre-card__title"><a href="/centres/${c.slug}/">${esc(c.name)}</a></h3>
      <ul class="centre-card__info">
        <li>${icon('pin')}<span>${esc(c.street)}, ${esc(c.postcode)} ${esc(c.city)}</span></li>
        <li>${icon('phone')}<a href="${telHref(c.tel)}">${esc(c.phone)}</a></li>
        <li>${icon('clock')}<span>${esc(c.hours)}</span></li>
        <li>${icon('car')}<span>${esc(c.parkingTitle)}</span></li>
      </ul>
      <div class="btn-row">
        ${book ? btn('Réserver', c.booking, { variant: 'ink', cls: 'btn--sm' }) : ''}
        <a class="text-link" href="/centres/${c.slug}/"><span>Le centre</span><span class="arrow">${icon('arrow')}</span></a>
      </div>
    </div>
  </article>`;
}

/** Carte stylisée de la côte, avec les trois centres. */
export function coastMap() {
  // projection simple lon/lat -> x/y sur la portion Mandelieu – Cagnes
  const lon0 = 6.86, lon1 = 7.2, lat0 = 43.5, lat1 = 43.66;
  const W = 1000, H = 520;
  const P = (lat, lon) => [((lon - lon0) / (lon1 - lon0)) * W, (1 - (lat - lat0) / (lat1 - lat0)) * H];
  const coast = [
    [43.505, 6.86], [43.508, 6.905], [43.516, 6.932], [43.527, 6.94], [43.535, 6.951], [43.545, 6.972], [43.55, 6.99],
    [43.549, 7.008], [43.548, 7.02], [43.542, 7.032], [43.537, 7.04], [43.545, 7.05], [43.556, 7.062], [43.565, 7.073],
    [43.566, 7.09], [43.563, 7.105], [43.556, 7.115], [43.545, 7.125], [43.548, 7.136], [43.56, 7.14], [43.572, 7.133],
    [43.582, 7.128], [43.592, 7.13], [43.61, 7.137], [43.625, 7.14], [43.64, 7.145], [43.652, 7.155], [43.66, 7.17], [43.665, 7.2],
  ].map(([la, lo]) => P(la, lo));
  const d = coast.map((p, k) => `${k ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const sea = `${d} L${W} ${H} L0 ${H} Z`;
  const isle = (lat, lon, rx, ry) => { const [x, y] = P(lat, lon); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx}" ry="${ry}"/>`; };
  const labels = [['Cannes', 43.556, 7.0, 'middle'], ['Grasse ↑', 43.648, 6.915, 'middle'], ['Mandelieu', 43.548, 6.938, 'middle'], ['Juan-les-Pins', 43.572, 7.104, 'end'], ['Mougins', 43.604, 7.0, 'middle'], ['Golfe-Juan', 43.575, 7.078, 'end'], ['Îles de Lérins', 43.512, 7.075, 'start'], ['Méditerranée', 43.523, 7.15, 'middle']];
  const pinLabel = { antibes: ['end', -18, -16], 'cannes-le-cannet': ['start', 18, -16], pegomas: ['start', 18, -16] };
  return html`<div class="coast" data-coast>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Carte de nos trois centres entre Pégomas, Le Cannet et Antibes">
      <defs>
        <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2942"/><stop offset="1" stop-color="#0e1828"/></linearGradient>
        <pattern id="waves" width="26" height="12" patternUnits="userSpaceOnUse"><path d="M0 8 Q6.5 3 13 8 T26 8" fill="none" stroke="rgba(201,169,120,.16)" stroke-width="1"/></pattern>
      </defs>
      <path class="coast__sea" d="${sea}" fill="url(#seaG)"/>
      <path class="coast__waves" d="${sea}" fill="url(#waves)"/>
      <g class="coast__isles" fill="#1a2942" stroke="rgba(201,169,120,.5)">${isle(43.521, 7.048, 26, 7)}${isle(43.507, 7.046, 14, 5)}</g>
      <path class="coast__line" d="${d}" fill="none" stroke="#c9a978" stroke-width="1.6" data-draw/>
      <g class="coast__labels">${labels.map(([n, la, lo, anchor]) => { const [x, y] = P(la, lo); return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}"${/Méditerranée|Lérins/.test(n) ? ' class="is-sea"' : ''}>${n}</text>`; }).join('')}</g>
      ${site.centres.map((c) => { const [x, y] = P(c.geo[0], c.geo[1]); return html`<a href="/centres/${c.slug}/" class="coast__pin" data-pin="${c.slug}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
        <circle class="coast__pulse" r="18"/><circle r="7"/><text x="${pinLabel[c.slug][1]}" y="${pinLabel[c.slug][2]}" text-anchor="${pinLabel[c.slug][0]}">${esc(c.name)}</text></a>`; })}
    </svg>
  </div>`;
}

export function centresSection({ eyebrow: eb = 'Trois adresses sur la Côte d’Azur', title = 'Votre centre, <em>tout près.</em>', lead = 'Mêmes technologies, mêmes tarifs, même exigence : choisissez le centre le plus proche de vous.', cls = 'section--sand', map = true } = {}) {
  return html`<section class="section ${cls}" id="centres">
    <div class="wrap">
      ${sHead({ eyebrow: eb, title, lead, split: true, raw: true })}
      ${map ? coastMap() : ''}
      <div class="centres-grid" data-stagger>${site.centres.map((c) => centreCard(c))}</div>
    </div>
  </section>`;
}

// ---------------------------------------------------------------------------
// Appel à l'action
// ---------------------------------------------------------------------------
export function ctaSection({ title = 'Et si on commençait <em>par vous écouter ?</em>', text = '30 minutes de diagnostic offertes, dans le centre de votre choix. Sans engagement.', eyebrow: eb = 'Diagnostic offert · 30 min', image = 'home-rdv', primary = ['Réserver mon diagnostic offert', '/rendez-vous/'], secondary = ['Auto-diagnostic en 60 s', '/diagnostic/'], raw = false } = {}) {
  return html`<section class="section section--cta">
    <div class="wrap">
      <div class="cta-block" data-cta>
        <div class="cta-block__bg" data-parallax>${picture(image, { alt: '', sizes: '100vw' })}</div>
        ${markSvg({ cls: 'cta-block__mark' })}
        ${eyebrow(eb, 'eyebrow--center')}
        <h2 class="h-display" data-split>${raw ? title : accent(title)}</h2>
        ${text ? `<p class="lead" data-reveal>${md(text)}</p>` : ''}
        <div class="btn-row" data-reveal>
          ${btn(primary[0], primary[1], { variant: 'gold' })}
          ${secondary ? btn(secondary[0], secondary[1], { variant: 'ghost-light' }) : ''}
        </div>
      </div>
    </div>
  </section>`;
}

/** Bandeau de réassurance défilant. */
export function trustBand(items = site.trust) {
  const row = items.map((t) => `<span>${esc(t)}</span><span class="dot" aria-hidden="true"></span>`).join('');
  return html`<div class="marquee marquee--band" data-marquee aria-label="${esc(items.join(', '))}">
    <div class="marquee__track">${row}${row}</div><div class="marquee__track" aria-hidden="true">${row}${row}</div>
  </div>`;
}

/** Fil d'Ariane + données structurées. */
export function crumbs(items = []) {
  return html`<nav aria-label="Fil d’Ariane"><ol class="crumbs">
    <li><a href="/">Accueil</a></li>
    ${items.map((it, k) => (k === items.length - 1 ? `<li aria-current="page">${esc(it[0])}</li>` : `<li><a href="${it[1]}">${esc(it[0])}</a></li>`))}
  </ol></nav>`;
}
export const crumbsSchema = (items = []) => [{
  '@type': 'BreadcrumbList',
  itemListElement: [['Accueil', '/'], ...items].map(([name, url], k) => ({ '@type': 'ListItem', position: k + 1, name, item: `${site.baseUrl}${url}` })),
}];

/** En-tête de page intérieure. */
export function pageHero({ eyebrow: eb, title, intro, crumbs: cr = [], image, imageAlt = '', actions = '', stats: st = [], aside = '', cls = '', raw = false }) {
  return html`<section class="page-hero ${image ? 'page-hero--media' : ''} ${cls}" data-hero>
    <div class="wrap">
      <div class="page-hero__grid">
        <div class="page-hero__text">
          ${cr.length ? crumbs(cr) : ''}
          ${eyebrow(eb)}
          <h1 class="h-display" data-split data-split-hero>${raw ? title : accent(title)}</h1>
          ${intro ? `<div class="lead page-hero__intro" data-reveal>${Array.isArray(intro) ? paras(intro) : `<p>${md(intro)}</p>`}</div>` : ''}
          ${actions ? `<div class="btn-row page-hero__actions" data-reveal>${actions}</div>` : ''}
        </div>
        ${image ? html`<div class="page-hero__media">
          <div class="media media--tall" data-hero-media>${picture(image, { alt: imageAlt, sizes: '(max-width: 900px) 100vw, 45vw', priority: true })}</div>
          ${aside}
        </div>` : aside}
      </div>
      ${st.length ? html`<div class="stats page-hero__stats" style="--n:${st.length}" data-stagger>
        ${st.map((x) => html`<div class="stats__item"><span class="stats__value${String(x.value).length > 8 ? ' stats__value--long' : ''}" data-count>${esc(x.value)}</span><span class="stats__label">${md(x.label)}${x.note ? ` <em>${md(x.note)}</em>` : ''}</span></div>`)}
      </div>` : ''}
    </div>
  </section>`;
}
