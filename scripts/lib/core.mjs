// Outils partagés du générateur : échappement, rendu de texte enrichi,
// correspondance des anciennes adresses, images responsives, icônes.
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

// ---------------------------------------------------------------------------
// Données
// ---------------------------------------------------------------------------
export const site = readJSON('content/site.json');
export const pages = readJSON('content/pages.json');
export const centresContent = readJSON('content/centres.json');
export const offres = readJSON('content/offres.json');
export const legal = readJSON('content/legal.json');
export const besoins = readJSON('content/besoins.json');
export const journal = readJSON('content/journal.json');
export const soins = [...readJSON('content/soins-visage.json'), ...readJSON('content/soins-corps.json')];
export const images = readJSON('media/images.json');

export const CATEGORIES = [
  { slug: 'visage', label: 'Visage', title: 'Rajeunir, raffermir, révéler l’éclat', text: 'Des technologies anti-âge non invasives, sans aiguille et sans éviction sociale.', eyebrow: 'Univers visage', image: 'peeling-mesoesthetic-menu' },
  { slug: 'corps', label: 'Corps', title: 'Mincir, sculpter, raffermir', text: 'Des protocoles minceur efficaces et sans douleur, du déstockage au renforcement musculaire.', eyebrow: 'Univers corps', image: 'femme-corps-1' },
  { slug: 'epilation', label: 'Épilation', title: 'Une peau lisse, durablement', text: 'Deux technologies complémentaires pour une épilation définitive sur tous types de poils.', eyebrow: 'Univers épilation', image: 'epilation-definitive-thetys-2-1' },
  { slug: 'cheveux', label: 'Cheveux', title: 'Densifier et revitaliser', text: 'Des soins du cuir chevelu pour freiner la chute et retrouver des cheveux plus denses.', eyebrow: 'Univers cheveux', image: 'micro-meso-cheveux' },
];
// photos de cabine privilégiées pour les cartes (plutôt que machines ou montages)
const CARD_IMAGES = {
  hifu: 'thetys01452-pp', 'jet-peel': 'soin-jetpeel-visage-sans-aiguille-centre-thetys', cryolipolyse: 'cryolipolyse-v2-03',
  'radiofrequence-fractionnee': 'radiofrequence-corps', 'microneedling-cheveux': 'micro-meso-cheveux',
  'radiofrequence-core': 'radiofrequence-multidimensionnelle-core-01',
};
const HERO_IMAGES = { cryolipolyse: 'cryolipolyse-v2-03', 'microneedling-cheveux': 'micro-meso-cheveux', 'radiofrequence-fractionnee': 'radiofrequence-corps' };
export const soinImage = (s) => CARD_IMAGES[s.slug] || s.heroImage?.src || s.heroImage;
export const soinHero = (s) => HERO_IMAGES[s.slug] || s.heroImage?.src || s.heroImage;
// soins signalés « Nouveau » sur la page Nos solutions du site actuel
export const NEW_SOINS = new Set(['lift-coreen', 'microneedling', 'peelings-mesoestetic', 'cosmelan', 'icoone', 'microneedling-cheveux', 'jetpeel-cheveux']);

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------
export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Gabarit : concatène, ignore null/undefined/false, aplatit les tableaux. */
export function html(strings, ...values) {
  let out = '';
  strings.forEach((s, i) => {
    out += s;
    if (i < values.length) out += flat(values[i]);
  });
  return out;
}
function flat(v) {
  if (v === null || v === undefined || v === false || v === true) return '';
  if (Array.isArray(v)) return v.map(flat).join('');
  return String(v);
}
export const when = (cond, fn) => (cond ? fn() : '');

export const slugify = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const stripTags = (s = '') => String(s).replace(/<[^>]+>/g, '').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

// ---------------------------------------------------------------------------
// Correspondance anciennes adresses -> nouvelles
// ---------------------------------------------------------------------------
const MAP = new Map();
const unknownLinks = new Map();
export const normPath = (u) => {
  let p = String(u).trim();
  p = p.replace(/^https?:\/\/(www\.)?centrethetys\.fr/i, '').replace(/&#0?38;/g, '&');
  if (!p.startsWith('/')) p = '/' + p;
  const [pathPart, rest = ''] = p.split(/(?=[?#])/);
  let pp = decodeURIComponent(pathPart).replace(/%20/g, '').trim();
  if (!pp.endsWith('/') && !/\.[a-z0-9]{2,4}$/i.test(pp)) pp += '/';
  return { path: pp.toLowerCase(), rest };
};
export function addRoute(oldUrl, newPath) {
  MAP.set(normPath(oldUrl).path, newPath);
}
const FUZZY = [
  [/hifu/, '/soins/hifu/'], [/cryolipolyse|cryo/, '/soins/cryolipolyse/'], [/icoone/, '/soins/icoone/'],
  [/ipulse/, '/soins/ipulse/'], [/v-?core/, '/soins/v-core/'], [/plasma/, '/soins/plasma-pulse/'],
  [/led-esthetic|\/led/, '/soins/led-esthetic/'], [/radiofrequence-fractionnee/, '/soins/radiofrequence-fractionnee/'],
  [/radiofrequence/, '/soins/radiofrequence-core/'], [/biologique/, '/soins/biologique-recherche/'],
  [/thalgo/, '/soins/thalgo/'], [/electrolyse/, '/soins/electrolyse/'],
  [/epilation-laser|lumiere-pulsee|shr|laser/, '/soins/epilation-laser/'], [/peeling/, '/soins/peelings-mesoestetic/'],
  [/microneedling-cheveux|cheveux|capillaire/, '/soins/microneedling-cheveux/'], [/microneedling|micro-needling|mesotherapie/, '/soins/microneedling/'],
  [/cosmelan/, '/soins/cosmelan/'], [/lift-coreen/, '/soins/lift-coreen/'], [/jet-?peel/, '/soins/jet-peel/'],
];
/** Réécrit une adresse du site d'origine vers la nouvelle arborescence. */
export function mapUrl(href) {
  if (!href) return href;
  const h = String(href).trim().replace(/&#0?38;/g, '&');
  if (/^(mailto:|tel:|#)/i.test(h)) return h;
  if (/^https?:\/\//i.test(h) && !/^https?:\/\/(www\.)?centrethetys\.fr/i.test(h)) return h;
  if (/wp-content\/uploads\/.+\.pdf$/i.test(h)) return h.startsWith('http') ? h : 'https://centrethetys.fr' + h;
  const { path: p, rest } = normPath(h);
  const anchor = rest.startsWith('#') ? rest : '';
  if (MAP.has(p)) return MAP.get(p) + (MAP.get(p).includes('#') ? '' : anchor);
  if (p === '/' || p === '/en/') return '/';
  if (/^\/(nos-solutions|nos-solutions-beaute)\//.test(p)) {
    for (const [re, to] of FUZZY) if (re.test(p)) return to;
    return '/soins/';
  }
  if (rest.includes('page_id')) return '/journal/';
  unknownLinks.set(h, (unknownLinks.get(h) || 0) + 1);
  return h.startsWith('http') ? h : 'https://centrethetys.fr' + h;
}
export const getUnknownLinks = () => unknownLinks;
export const routeMap = () => MAP;

// ---------------------------------------------------------------------------
// Texte enrichi minimal : **gras**, *italique*, [lien](url), retours à la ligne
// ---------------------------------------------------------------------------
export function md(text = '') {
  if (!text) return '';
  let s = esc(text);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    const href = mapUrl(url.replace(/&amp;/g, '&'));
    const ext = /^https?:\/\//.test(href);
    return `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  s = s.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>');
  return s;
}
/** Plusieurs paragraphes. */
export const paras = (list = [], cls = '') => (list || []).filter(Boolean)
  .map((p) => `<p${cls ? ` class="${cls}"` : ''}>${md(p)}</p>`).join('');

/** Met en italique la fin d'un titre (après la dernière virgule ou les deux-points). */
export function accent(title = '') {
  if (!title) return '';
  if (/<em>/.test(title)) return title;
  const t = esc(title);
  const m = t.match(/^(.*[,:])\s+(.+)$/);
  if (m) {
    const words = m[2].split(/\s+/).length;
    if (words >= 1 && words <= 7) return `${m[1]} <em>${m[2]}</em>`;
  }
  return t;
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------
const usedImages = new Set();
export const getUsedImages = () => usedImages;
const missingImages = new Set();
export const getMissingImages = () => missingImages;

const src2id = new Map();
for (const [id, m] of Object.entries(images)) src2id.set(m.source.replace(/__/g, '/').toLowerCase(), id);
/** Retrouve l'identifiant d'image à partir d'une adresse du site d'origine. */
export function imageId(ref) {
  if (!ref) return null;
  if (images[ref]) return ref;
  const u = String(ref);
  if (!u.includes('wp-content/uploads/')) return null;
  const p = u.split('wp-content/uploads/')[1].split('?')[0];
  const p2 = p.replace(/-\d{2,5}x\d{2,5}(?=\.\w+$)/, '');
  for (const c of [p2, p, p2.replace(/-scaled(?=\.\w+$)/, '')]) {
    const id = src2id.get(c.toLowerCase());
    if (id) return id;
  }
  missingImages.add(u);
  return null;
}

/**
 * Balise <picture> responsive (AVIF + WebP).
 * @param {string} ref identifiant ou adresse d'origine
 */
export function picture(ref, { alt = '', sizes = '100vw', cls = '', imgCls = '', loading = 'lazy', priority = false, ratio = false } = {}) {
  const id = imageId(ref);
  if (!id) return '';
  const m = images[id];
  usedImages.add(id);
  const set = (fmt) => m.widths.map((w) => `/media/img/${id}-${w}.${fmt} ${w}w`).join(', ');
  const fallbackW = m.widths.find((w) => w >= 960) || m.widths[m.widths.length - 1];
  const h = Math.round((m.h / m.w) * fallbackW);
  const style = m.alpha ? '' : ` style="background-color:${m.color};background-image:url(${m.lqip});background-size:cover;background-position:center"`;
  return `<picture${cls ? ` class="${cls}"` : ''}${ratio ? ` style="aspect-ratio:${m.w}/${m.h}"` : ''}>` +
    `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">` +
    `<source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">` +
    `<img src="/media/img/${id}-${fallbackW}.webp" width="${fallbackW}" height="${h}" alt="${esc(alt)}"${imgCls ? ` class="${imgCls}"` : ''}` +
    ` loading="${priority ? 'eager' : loading}" decoding="async"${priority ? ' fetchpriority="high"' : ''}${style}></picture>`;
}
export const imgUrl = (ref, w = 1440) => {
  const id = imageId(ref);
  if (!id) return null;
  usedImages.add(id);
  const m = images[id];
  const width = m.widths.find((x) => x >= w) || m.widths[m.widths.length - 1];
  return `/media/img/${id}-${width}.webp`;
};
export const imgMeta = (ref) => images[imageId(ref)] || null;

// ---------------------------------------------------------------------------
// Vidéos
// ---------------------------------------------------------------------------
export const VIDEO_MAP = {
  '2024/12/Hifu.mp4': 'reel-hifu',
  '2024/12/Le-Microneedling.mp4': 'reel-microneedling',
  '2024/12/Plasma-Pulse.mp4': 'reel-plasma-pulse',
  '2024/12/49907943-882d-4a45-838e-79793e4c8fe6.mp4': 'reel-peelings',
  '2023/10/REEL-BIOLOGIQUE-RECHERCHE-2.mp4': 'reel-biologique-recherche',
  '2023/12/REEL-ELECTROLYSE-1.mp4': 'reel-electrolyse',
  '2024/02/REEL-ELECTROLYSE-1-1.mp4': 'reel-electrolyse',
  '2023/12/THETYS-Reel-Radiofrequence-corps-2.mp4': 'reel-radiofrequence-corps',
  '2023/12/Thetys-Radiofrequence-visage.mp4': 'reel-radiofrequence-visage',
  '2024/02/REEL-ICOONE-1-2.mp4': 'reel-icoone',
  '2026/07/diag-peau-pegomas.mp4': 'reel-diagnostic-peau',
  '2021/05/Capsule_Hifu_2021.mp4': 'capsule-hifu',
  '2021/05/Capsule_Ipulse_2021.mp4': 'capsule-ipulse',
  '2021/05/Capsule_Jetpeel_2021.mp4': 'capsule-jetpeel',
  '2021/06/Capsule_LED.mp4': 'capsule-led',
  '2021/06/Capsule_V-Core_Femme_2021.mp4': 'capsule-v-core',
  '2022/03/Centre-Thetys-biologique-recherche11.mp4': 'film-biologique-recherche',
  '2024/02/Thalgo-Exception-Marine-FR-1.mp4': 'film-thalgo',
};
const usedVideos = new Set();
export const getUsedVideos = () => usedVideos;
export function videoId(ref) {
  if (!ref) return null;
  if (fs.existsSync(path.join(ROOT, 'media/video', `${ref}.mp4`))) return ref;
  const k = String(ref).split('wp-content/uploads/')[1];
  return VIDEO_MAP[k] || null;
}
export function player(ref, { label = '', kind } = {}) {
  const id = videoId(ref);
  if (!id) return '';
  usedVideos.add(id);
  const type = kind || (id.startsWith('reel') ? 'reel' : 'film');
  const poster = imgUrl(`poster-${id}`, type === 'reel' ? 960 : 1440);
  const auto = type === 'reel';
  return html`<figure class="player player--${type}" data-player data-autoplay="${auto ? '1' : '0'}">
    <video ${auto ? 'muted loop playsinline' : 'playsinline'} preload="none" poster="${poster}" aria-label="${esc(label || 'Vidéo Centre Thetys')}"${auto ? '' : ' controlslist="nodownload"'}>
      <source src="/media/video/${id}.mp4" type="video/mp4">
    </video>
    ${!auto ? `<button class="player__play" type="button" aria-label="Lire la vidéo"><span>${icon('play')}</span></button>` : ''}
    <div class="player__ui">
      ${label ? `<span class="player__btn" aria-hidden="true">${esc(label)}</span>` : '<span></span>'}
      ${auto ? `<button class="player__btn" type="button" data-sound aria-pressed="false">${icon('sound')}<span>Son</span></button>` : ''}
    </div>
    <div class="player__progress" aria-hidden="true"><i></i></div>
  </figure>`;
}

// ---------------------------------------------------------------------------
// Icônes
// ---------------------------------------------------------------------------
const ICONS = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
  arrowUpRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  chevron: '<svg viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="m1 1 4 4 4-4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6.6 3.5h2.6l1.6 4.2-2 1.3a12 12 0 0 0 6.2 6.2l1.3-2 4.2 1.6v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 16h14M6 16v2.5M18 16v2.5M4 16v-3.5l2-5h12l2 5V16"/><circle cx="8" cy="13" r=".8"/><circle cx="16" cy="13" r=".8"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9Z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="26" height="26"><path d="M8 5.5v13l11-6.5Z"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4Z"/><path class="w1" d="M15.5 9.5a3.5 3.5 0 0 1 0 5"/><path class="w2" d="M18 7a7 7 0 0 1 0 10"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.08.8.82-3-.2-.31a8.2 8.2 0 1 1 6.96 3.84Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.55.12-.17.25-.64.8-.78.96-.14.17-.29.19-.53.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.7 2.7 0 0 0-.85 2.02 4.7 4.7 0 0 0 .99 2.5 10.8 10.8 0 0 0 4.14 3.66c1.54.67 2.15.72 2.92.6.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.15-1.17-.06-.11-.22-.17-.47-.29Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.9 8.6H4V20h2.9ZM5.4 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.4c0-3-1.6-4.9-4.3-4.9a3.6 3.6 0 0 0-3.2 1.8V8.6H9.7V20h2.9v-5.9c0-1.6.7-2.7 2.1-2.7s2 1 2 2.7V20H20Z"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.2 2.5a9.5 9.5 0 0 0-3.5 18.3c-.1-.8-.1-2 .1-2.8l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.2 1 .6 1.9 1.6 1.9 1.9 0 3.4-2 3.4-5 0-2.6-1.9-4.4-4.5-4.4a4.7 4.7 0 0 0-4.9 4.7c0 .9.4 1.9.8 2.5l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A9.5 9.5 0 1 0 12.2 2.5Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M2.5 9h19M12 9v11M12 9S10.5 4 8 4.5 7 9 12 9Zm0 0s1.5-5 4-4.5S17 9 12 9Z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z"/></svg>',
};
export const icon = (name) => ICONS[name] || '';

// ---------------------------------------------------------------------------
// Logo (marque vectorielle redessinée d'après l'original)
// ---------------------------------------------------------------------------
const logoPaths = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/templates/logo-paths.json'), 'utf8'));
let markCount = 0;
export function markSvg({ cls = '', title = '' } = {}) {
  const id = `m${++markCount}`;
  const inner = logoPaths.markInner.replace(/id="tq"/, `id="${id}"`).replace(/href="#tq"/g, `href="#${id}"`);
  return `<svg class="${cls}" viewBox="-200 -200 400 400" ${title ? `role="img" aria-label="${esc(title)}"` : 'aria-hidden="true"'}>${inner}</svg>`;
}
export function logoSvg({ cls = '', title = 'Centre Thetys' } = {}) {
  const id = `l${++markCount}`;
  const inner = logoPaths.markInner.replace(/id="tq"/, `id="${id}"`).replace(/href="#tq"/g, `href="#${id}"`);
  return `<svg class="${cls}" viewBox="0 0 392 110" role="img" aria-label="${esc(title)}"><g class="brand__mark" transform="translate(55 55) scale(.2909)">${inner}</g><path fill="currentColor" d="${logoPaths.wordmarkTop}"/><path fill="currentColor" d="${logoPaths.wordmarkBig}"/></svg>`;
}
export function wordmarkSvg({ cls = '' } = {}) {
  // « thetys » seul, recadré
  return `<svg class="${cls}" viewBox="166 34 228 76" aria-hidden="true"><path fill="currentColor" d="${logoPaths.wordmarkBig}"/></svg>`;
}

// ---------------------------------------------------------------------------
// Divers
// ---------------------------------------------------------------------------
export const telHref = (tel) => `tel:${tel}`;
export const waHref = (text = '') => `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const frDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
export const readingTime = (words) => Math.max(2, Math.round(words / 220));
