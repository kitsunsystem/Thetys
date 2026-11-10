// Gabarit général : <head>, en-tête, méga-menu, menu mobile, pied de page.
import {
  html, esc, site, soins, CATEGORIES, NEW_SOINS, picture, imgUrl, icon, logoSvg, markSvg, wordmarkSvg, telHref, waHref, soinImage,
} from '../../scripts/lib/core.mjs';

const NAV = [
  { href: '/soins/', label: 'Soins', mega: true },
  { href: '/besoins/', label: 'Vos besoins' },
  { href: '/resultats/', label: 'Résultats' },
  { href: '/centres/', label: 'Nos centres' },
  { href: '/qui-sommes-nous/', label: 'Qui sommes-nous' },
  { href: '/journal/', label: 'Journal' },
];

export function btn(label, href, { variant = '', icon: ic = 'arrowUpRight', attrs = '', cls = '', magnetic = true } = {}) {
  const ext = /^https?:\/\//.test(href) && !href.includes('centrethetys.fr');
  return `<a class="btn ${variant ? `btn--${variant}` : ''} ${cls}" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}${magnetic ? ' data-magnetic' : ''} ${attrs}>` +
    `<span class="btn__label"><span data-text="${esc(label)}">${esc(label)}</span></span>` +
    (ic ? `<span class="btn__icon">${icon(ic)}</span>` : '') + '</a>';
}

function announcement() {
  const a = site.announcement;
  if (!a || !a.text) return '';
  return html`<div class="announce" data-announce data-until="${esc(a.until || '')}" hidden>
    <a href="${esc(a.href)}"><span class="announce__text"><em class="sr-only">Offre du moment : </em>${a.text}</span><span class="announce__go" aria-hidden="true">${icon('arrow')}</span></a>
    <button class="announce__close" type="button" aria-label="Fermer l’annonce">${icon('close')}</button>
  </div>`;
}

function mega() {
  const cols = CATEGORIES.map((c) => {
    const items = soins.filter((s) => s.category === c.slug);
    return html`<div class="mega__col">
      <h3>${c.label}</h3>
      <ul>${items.map((s) => html`<li><a href="/soins/${s.slug}/" data-preview="${s.slug}" data-caption="${esc(s.card || '')}">${esc(s.name)}${NEW_SOINS.has(s.slug) ? ' <span class="badge">Nouveau</span>' : ''}</a></li>`)}</ul>
    </div>`;
  });
  const previews = soins.map((s, i) => picture(soinImage(s), {
    alt: '', sizes: '360px', cls: i === 0 ? 'is-active' : '',
  }).replace('<picture', `<picture data-preview-img="${s.slug}"`));
  return html`<div class="mega" id="mega-soins" data-mega>
    <div class="wrap mega__inner">
      ${cols}
      <figure class="mega__preview" data-mega-preview>
        ${previews}
        <figcaption data-preview-caption>${esc(soins[0].card || '')}</figcaption>
      </figure>
    </div>
    <div class="wrap mega__foot">
      <a class="text-link" href="/soins/"><span>Toutes nos solutions</span><span class="arrow">${icon('arrow')}</span></a>
      <a class="text-link" href="/diagnostic/"><span>Faire mon auto-diagnostic</span><span class="arrow">${icon('arrow')}</span></a>
    </div>
  </div>`;
}

function header(current) {
  return html`<header class="site-header" data-header>
    <div class="wrap site-header__inner">
      <a class="brand" href="/" aria-label="Centre Thetys, accueil">${logoSvg({ title: 'Centre Thetys' })}</a>
      <nav class="nav" aria-label="Navigation principale">
        ${NAV.map((n) => n.mega
          ? html`<a class="nav__link" href="${n.href}" data-mega-toggle aria-expanded="false" aria-controls="mega-soins"${current.startsWith(n.href) ? ' aria-current="page"' : ''}>${n.label} ${icon('chevron')}</a>`
          : html`<a class="nav__link" href="${n.href}"${current.startsWith(n.href) ? ' aria-current="page"' : ''}>${n.label}</a>`)}
      </nav>
      <div class="header-actions">
        <a class="icon-btn" href="/rendez-vous/" aria-label="Contacter un centre">${icon('phone')}</a>
        ${btn('Diagnostic offert', '/diagnostic/', { variant: 'gold', cls: 'btn--sm', icon: null })}
        <button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu" data-burger><span></span><span></span></button>
      </div>
    </div>
    ${mega()}
  </header>`;
}

function mobileMenu() {
  const links = [
    ['/soins/', 'Nos soins'], ['/besoins/', 'Vos besoins'], ['/resultats/', 'Résultats'], ['/centres/', 'Nos centres'],
    ['/diagnostic/', 'Diagnostic offert'], ['/qui-sommes-nous/', 'Qui sommes-nous'], ['/journal/', 'Journal'], ['/carte-cadeau/', 'Carte cadeau'],
  ];
  return html`<div class="menu" id="menu" data-menu aria-hidden="true">
    <ul class="menu__list">
      ${links.map(([h, l], i) => html`<li><a href="${h}"><span>${String(i + 1).padStart(2, '0')}</span>${l}</a></li>`)}
    </ul>
    <div class="menu__foot">
      ${site.centres.map((c) => html`<div><strong>${esc(c.name)}</strong><a href="${telHref(c.tel)}">${esc(c.phone)}</a></div>`)}
    </div>
  </div>`;
}

function footer() {
  const year = new Date().getFullYear();
  return html`<footer class="footer" data-footer>
    <div class="wrap">
      <div class="footer__cta">
        <p class="eyebrow">Antibes · Cannes Le Cannet · Pégomas</p>
        <p class="footer__claim serif">Les technologistes <em>de beauté.</em></p>
        <div class="btn-row">
          ${btn('Réserver mon diagnostic', '/rendez-vous/', { variant: 'gold' })}
          ${btn('WhatsApp', waHref(), { variant: 'ghost-light', icon: 'whatsapp' })}
        </div>
      </div>
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="/" class="footer__logo" aria-label="Centre Thetys, accueil">${logoSvg()}</a>
          <p>Les technologistes de beauté depuis 2009, à Antibes, Cannes Le Cannet et Pégomas.</p>
          <ul class="footer__social">
            ${site.social.map((s) => html`<li><a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}">${icon(s.name.toLowerCase())}</a></li>`)}
          </ul>
        </div>
        ${site.centres.map((c) => html`<div class="footer__centre">
          <h2 class="footer__title">${esc(c.name)}</h2>
          <address>${esc(c.street)}<br>${esc(c.postcode)} ${esc(c.city)}</address>
          <a class="footer__tel" href="${telHref(c.tel)}">${esc(c.phone)}</a>
          <a href="mailto:${c.email}">${esc(c.email)}</a>
          <p class="footer__hours">${esc(c.hours)}</p>
          <a class="text-link footer__book" href="${esc(c.booking)}" target="_blank" rel="noopener"><span>Réserver</span><span class="arrow">${icon('arrow')}</span></a>
        </div>`)}
        <nav class="footer__nav" aria-label="Plan du site">
          <h2 class="footer__title">Explorer</h2>
          <ul>
            ${[['/soins/', 'Nos soins'], ['/besoins/', 'Vos besoins'], ['/resultats/', 'Résultats'], ['/diagnostic/', 'Diagnostic'], ['/qui-sommes-nous/', 'Qui sommes-nous'], ['/cosmetiques/', 'Cosmétiques'], ['/carte-cadeau/', 'Carte cadeau'], ['/offres/', 'Offres du moment'], ['/journal/', 'Journal'], ['/recrutement/', 'Recrutement']]
              .map(([h, l]) => html`<li><a class="link-u-hover" href="${h}">${l}</a></li>`)}
          </ul>
        </nav>
      </div>
      <div class="footer__word" aria-hidden="true">${wordmarkSvg({ cls: 'footer__wordmark' })}</div>
      <div class="footer__bottom">
        <p>© ${year} Centre Thetys. Tous droits réservés.</p>
        <ul>
          <li><a href="/mentions-legales/">Mentions légales</a></li>
          <li><a href="/cgv/">CGV</a></li>
          <li><a href="/confidentialite/">Confidentialité</a></li>
        </ul>
        <p class="footer__credit">${esc(site.credit.label)} <a href="${site.credit.url}" target="_blank" rel="noopener">${esc(site.credit.name)}</a></p>
      </div>
    </div>
  </footer>`;
}

function loader() {
  return html`<div class="loader" data-loader aria-hidden="true">
    <div class="loader__inner">
      ${markSvg({ cls: 'loader__mark' })}
      ${wordmarkSvg({ cls: 'loader__word' })}
    </div>
    <div class="loader__line"><i></i></div>
    <div class="loader__count" data-loader-count>0</div>
  </div>`;
}

function jsonLd(extra = []) {
  const org = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.baseUrl}/#organization`,
        name: site.name,
        url: `${site.baseUrl}/`,
        logo: `${site.baseUrl}/apple-touch-icon.png`,
        email: site.email,
        foundingDate: String(site.since),
        sameAs: site.social.map((s) => s.url),
        subOrganization: site.centres.map((c) => ({ '@id': `${site.baseUrl}/centres/${c.slug}/#lieu` })),
      },
      ...site.centres.map((c) => ({
        '@type': 'BeautySalon',
        '@id': `${site.baseUrl}/centres/${c.slug}/#lieu`,
        name: c.fullName,
        url: `${site.baseUrl}/centres/${c.slug}/`,
        telephone: c.tel,
        email: c.email,
        image: `${site.baseUrl}${imgUrl(c.image, 1440)}`,
        priceRange: '€€',
        address: { '@type': 'PostalAddress', streetAddress: c.street, postalCode: c.postcode, addressLocality: c.city, addressRegion: 'Alpes-Maritimes', addressCountry: 'FR' },
        ...(c.slug !== 'pegomas' ? { geo: { '@type': 'GeoCoordinates', latitude: c.geo[0], longitude: c.geo[1] } } : {}),
        openingHours: c.openingHours,
        parentOrganization: { '@id': `${site.baseUrl}/#organization` },
      })),
      ...extra,
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(org).replace(/</g, '\\u003c')}</script>`;
}

/**
 * Page complète.
 * @param {object} o
 * @param {string} o.path chemin de la page (ex. « /soins/hifu/ »)
 */
export function layout({ path, title, description, body, ogImage, dark = false, schema = [], noindex = false, bodyClass = '', assets }) {
  const fullTitle = title && !/Centre Thetys/.test(title) ? `${title} | Centre Thetys` : (title || 'Centre Thetys');
  const canonical = `${site.baseUrl}${path}`;
  const og = ogImage ? `${site.baseUrl}${imgUrl(ogImage, 1440)}` : `${site.baseUrl}${imgUrl('home-rdv', 1440)}`;
  return `<!doctype html>
<html lang="fr" class="no-js${dark ? ' on-dark-hero' : ''}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description || site.description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Centre Thetys">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description || site.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0e1828">
<meta name="author" content="Centre Thetys">
<meta name="designer" content="Kitsun System · kitsunsystem.com">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/fraunces-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/manrope.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${assets.css}">
<script>(function(d,s){var h=d.documentElement;h.className=h.className.replace('no-js','js');try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||s.getItem('thetys:seen'))h.classList.add('no-loader');if(s.getItem('thetys:nav')){h.classList.add('is-arriving');s.removeItem('thetys:nav')}}catch(e){h.classList.add('no-loader')}setTimeout(function(){if(!h.classList.contains('is-ready')){h.classList.add('no-loader');h.classList.remove('is-arriving','js')}},4500)})(document,sessionStorage)</script>
<script type="module" src="${assets.js}"></script>
<script type="speculationrules">{"prefetch":[{"where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":"/media/*"}}]},"eagerness":"moderate"}]}</script>
${jsonLd(schema)}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">Aller au contenu</a>
${loader()}
<div class="curtain" data-curtain aria-hidden="true">${markSvg()}</div>
${announcement()}
${header(path)}
${mobileMenu()}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
<div class="cursor" data-cursor-el aria-hidden="true"><div class="cursor__ring"><span data-cursor-label></span></div><div class="cursor__dot"></div></div>
</body>
</html>`;
}
