// Génère le site statique dans dist/ : pages HTML, styles, scripts, médias,
// plan du site et table de redirections des anciennes adresses.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import * as esbuild from 'esbuild';
import {
  ROOT, site, soins, besoins, journal, offres, centresContent, pages as pageData, addRoute, routeMap, getUnknownLinks,
  getUsedImages, getUsedVideos, getMissingImages, imageId, images,
} from './lib/core.mjs';

const DIST = path.join(ROOT, 'dist');
const t0 = Date.now();
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// ---------------------------------------------------------------------------
// 1. Table de correspondance des anciennes adresses
// ---------------------------------------------------------------------------
const R = addRoute;
R('/', '/');
R('/nos-solutions-beaute/', '/soins/'); R('/nos-solutions/', '/soins/');
for (const s of soins) R(s.sourceUrl, `/soins/${s.slug}/`);
const LOCAL = {
  hifu: ['hifu-antibes', 'hifu-cannes', 'hifu-pegomas', 'nos-solutions-beaute/hifu-lifting-sans-chirurgie'],
  cryolipolyse: ['cryolipolyse-antibes', 'cryolipolyse-cannes', 'cryolipolyse-pegomas', 'offre-cryolipolyse'],
  'lift-coreen': ['lift-coreen-fil-collagene-antibes', 'lift-coreen-fil-collagene-cannes', 'lift-coreen-fil-collagene-pegomas'],
  microneedling: ['microneedling-mesotherapie-antibes', 'microneedling-mesotherapie-cannes', 'microneedling-mesotherapie-pegomas'],
  'microneedling-cheveux': ['soin-microneedling-cheveux-a-antibes-centre-thetys', 'soin-microneedling-cheveux-a-cannes-centre-thetys', 'soin-microneedling-cheveux-a-pegomas-centre-thetys', 'microneedling-cheveux-cannes-antibes'],
  'biologique-recherche': ['soin-visage-biologique-recherche-cannes-antibes'],
  'radiofrequence-core': ['radiofrequence-multidimensionnelle-core', 'nos-solutions-beaute/radiofrequence-multidimensionnelle-core-raffermissement-par-stimulation-du-collagene'],
  'radiofrequence-fractionnee': ['radiofrequence-fractionnee-soin', 'radiofrequence-fractionnee'],
  'jet-leg-mains': ['jetpeel-jambes-et-mains'],
  'jetpeel-cheveux': ['jetpeel-cuir-chevelu'],
  'epilation-laser': ['nos-solutions-beaute/lumiere-pulsee-shr'],
};
for (const [slug, olds] of Object.entries(LOCAL)) for (const o of olds) R(`/${o}/`, `/soins/${slug}/`);
R('/vos-besoins/', '/besoins/');
R('/vos-besoins/je-veux-agir-sur-ma-silhouette/', '/besoins/silhouette/');
for (const c of besoins.categories) R(c.sourceUrl, `/besoins/${c.slug}/`);
for (const n of besoins.needs) R(n.sourceUrl, `/besoins/${n.category}/${n.slug}/`);
R('/vos-centres-esthetique-minceur-et-visage-sur-la-cote-dazur/', '/centres/');
R('/centre-esthetique-minceur-et-visage-a-antibes/', '/centres/antibes/');
R('/centre-esthetique-minceur-et-visage-a-cannes/', '/centres/cannes-le-cannet/');
R('/centre-esthetique-minceur-et-visage-a-pegomas/', '/centres/pegomas/');
R('/qui-sommes-nous/', '/qui-sommes-nous/');
R('/resultats/', '/resultats/');
for (const o of ['/je-veux-mon-diagnostic/', '/diagnostic-visage-visioderm/', '/diagnostic-corps/', '/diag-peau-pegomas/', '/contour-des-yeux-diagnostic-offert/']) R(o, '/diagnostic/');
R('/auto-diagnostic/', '/diagnostic/');
for (const o of ['/prendre-rdv/', '/rendez-vous/', '/prendre-rdv/confirmation/', '/rdv-confirme/']) R(o, '/rendez-vous/');
R('/nos-gammes-cosmetiques-nutricosmetiques/', '/cosmetiques/');
for (const o of ['/carte-cadeau/', '/panier/', '/commander/', '/mon-compte/']) R(o, '/carte-cadeau/');
R('/recrutement/', '/recrutement/');
R('/mentions-legales/', '/mentions-legales/'); R('/cgv/', '/cgv/'); R('/politique-de-cookies-ue/', '/confidentialite/');
R('/blog/', '/journal/');
for (const p of journal) R(p.sourceUrl, `/journal/${p.slug}/`);
R('/black-friday/', '/offres/black-friday/');
// anciennes adresses encore citées dans les articles
const SIL = { 'je-veux-perdre-du-ventre': 'ventre', 'je-veux-agir-sur-mes-bras': 'bras', 'je-veux-des-fesses-plus-galbees': 'fessiers', 'je-veux-agir-sur-ma-silhouette-post-grossesse': 'post-grossesse', 'je-veux-raffermir-mon-corps': 'raffermir-le-corps', 'je-veux-lisser-ma-peau-dorange': 'peau-d-orange' };
for (const [o, n] of Object.entries(SIL)) R(`/vos-besoins/je-veux-agir-sur-ma-silhouette/${o}/`, `/besoins/silhouette/${n}/`);
R('/technologie-v-core/', '/soins/v-core/');
R('/jetpeel/', '/soins/jet-peel/');
R('/jet-peel-decouvrez-le-soin-elu-innovation-esthetique-2021/', '/soins/jet-peel/');
R('/la-lumiere-pulsee-en-ete-est-ce-une-bonne-idee/', '/soins/epilation-laser/');
R('/2020/08/26/raffermir-les-bras-rapidement-cest-possible-avec-la-radiofrequence/', '/journal/raffermir-les-bras-rapidement-avec-la-radiofrequence/');
R('/2020/07/23/rides-sous-les-yeux-jetpeel/', '/journal/rides-sous-les-yeux-le-jetpeel-meilleure-solution-alternative-aux-injections/');
R('/les-differentes-technologies-de-cryolipolyse-avis-dexperts/', '/journal/les-differentes-technologies-de-cryolipolyse/');
R('/fetes-des-meres-offrez-un-soin-pour-faire-plaisir-a-coup-sur/', '/carte-cadeau/');
R('/comment-avoir-des-levres-pulpeises/', '/besoins/peau-plus-jeune/contour-de-bouche/');
R('/epilation-laser-pegomas-3eme-zone-1-euro/', '/offres/epilation-laser-pegomas/');

// ---------------------------------------------------------------------------
// 2. Styles et scripts
// ---------------------------------------------------------------------------
const hash = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);
fs.mkdirSync(path.join(DIST, 'assets/fonts'), { recursive: true });
const fontSrc = path.join(ROOT, 'node_modules/@fontsource-variable');
fs.copyFileSync(path.join(fontSrc, 'fraunces/files/fraunces-latin-opsz-normal.woff2'), path.join(DIST, 'assets/fonts/fraunces-normal.woff2'));
fs.copyFileSync(path.join(fontSrc, 'fraunces/files/fraunces-latin-opsz-italic.woff2'), path.join(DIST, 'assets/fonts/fraunces-italic.woff2'));
fs.copyFileSync(path.join(fontSrc, 'manrope/files/manrope-latin-wght-normal.woff2'), path.join(DIST, 'assets/fonts/manrope.woff2'));

const cssOut = await esbuild.build({
  entryPoints: [path.join(ROOT, 'src/styles/main.css')],
  bundle: true, minify: true, write: false, outdir: path.join(DIST, 'assets'),
  external: ['/assets/fonts/*'], target: ['chrome110', 'safari16', 'firefox115'],
  logLevel: 'warning',
});
const css = cssOut.outputFiles[0].contents;
const cssName = `app.${hash(css)}.css`;
fs.writeFileSync(path.join(DIST, 'assets', cssName), css);

const jsOut = await esbuild.build({
  entryPoints: [path.join(ROOT, 'src/js/main.js')],
  bundle: true, minify: true, write: false, format: 'esm', target: ['es2020'],
  outdir: path.join(DIST, 'assets'), legalComments: 'none', logLevel: 'warning',
});
const js = jsOut.outputFiles[0].contents;
const jsName = `app.${hash(js)}.js`;
fs.writeFileSync(path.join(DIST, 'assets', jsName), js);
const assets = { css: `/assets/${cssName}`, js: `/assets/${jsName}` };

// ---------------------------------------------------------------------------
// 3. Pages
// ---------------------------------------------------------------------------
const { layout } = await import('../src/templates/layout.mjs');
const { home } = await import('../src/templates/home.mjs');
const { soinsIndex, soinPage } = await import('../src/templates/soins.mjs');
const { besoinsIndex, besoinCategory, besoinPage } = await import('../src/templates/besoins.mjs');
const { centresIndex, centrePage } = await import('../src/templates/centres.mjs');
const { journalIndex, articlePage } = await import('../src/templates/journal.mjs');
const M = await import('../src/templates/misc.mjs');

const sitemap = [];
function emit(urlPath, page, { priority = 0.6, sitemapIt = true, file } = {}) {
  const out = layout({ path: urlPath, assets, ...page });
  const dest = file ? path.join(DIST, file) : path.join(DIST, urlPath, 'index.html');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out);
  if (sitemapIt) sitemap.push({ loc: urlPath, priority });
}

// Résultats : avant / après repérés dans les fiches et besoins
function collectResults() {
  const featured = pageData.results.featured;
  const seen = new Set(featured.map((x) => imageId(x.image)));
  const featuredHrefs = new Set(featured.map((x) => x.href));
  const extra = [];
  const push = (ref, label, href) => {
    const id = imageId(ref);
    if (!id || seen.has(id)) return;
    // uniquement de vrais montages avant / après
    if (!(/avant/.test(id) && /apres/.test(id))) return;
    if (featuredHrefs.has(href)) return;
    if (images[id].w < 500) return;
    seen.add(id);
    extra.push({ image: id, label: label.replace(/\s*\|\s*/g, ', '), href });
  };
  const walk = (sections, label, href) => {
    for (const s of sections || []) {
      for (const im of [s.image, ...(s.images || []), ...(s.items || []).map((it) => it?.image)].filter(Boolean)) push(im.src || im, label, href);
    }
  };
  for (const s of soins) { walk(s.sections, s.name, `/soins/${s.slug}/`); if (s.heroImage) push(s.heroImage.src, s.name, `/soins/${s.slug}/`); }
  for (const n of besoins.needs) {
    const href = `/besoins/${n.category}/${n.slug}/`;
    walk(n.sections, n.title.replace(/^Je veux |^J’ai |^Je suis |^Je manque /, '').replace(/^\w/, (c) => c.toUpperCase()), href);
  }
  return extra;
}

emit('/', home(), { priority: 1 });
emit('/soins/', soinsIndex(), { priority: 0.9 });
for (const s of soins) emit(`/soins/${s.slug}/`, soinPage(s), { priority: 0.8 });
emit('/besoins/', besoinsIndex(), { priority: 0.8 });
for (const c of besoins.categories) emit(`/besoins/${c.slug}/`, besoinCategory(c), { priority: 0.7 });
for (const n of besoins.needs) emit(`/besoins/${n.category}/${n.slug}/`, besoinPage(n), { priority: 0.6 });
emit('/centres/', centresIndex(), { priority: 0.9 });
for (const c of site.centres) emit(`/centres/${c.slug}/`, centrePage(c), { priority: 0.9 });
emit('/resultats/', M.results(collectResults()), { priority: 0.8 });
emit('/diagnostic/', M.diagnostic(), { priority: 0.9 });
emit('/qui-sommes-nous/', M.about(), { priority: 0.7 });
emit('/cosmetiques/', M.cosmetics(), { priority: 0.5 });
emit('/carte-cadeau/', M.giftcard(), { priority: 0.6 });
emit('/rendez-vous/', M.booking(), { priority: 0.9 });
emit('/recrutement/', M.recruitment(), { priority: 0.4 });
emit('/offres/', M.offersIndex(), { priority: 0.6 });
for (const o of offres.items) emit(`/offres/${o.slug}/`, M.offerPage(o), { priority: 0.6 });
emit('/journal/', journalIndex(), { priority: 0.7 });
for (const p of journal) emit(`/journal/${p.slug}/`, articlePage(p), { priority: 0.5 });
for (const k of ['mentions-legales', 'cgv']) { const pg = M.legalPage(k); emit(pg.path, pg, { priority: 0.2 }); }
emit('/confidentialite/', M.privacy(), { priority: 0.2 });
emit('/404.html', M.notFound(), { sitemapIt: false, file: '404.html' });

// ---------------------------------------------------------------------------
// 4. Médias utilisés uniquement
// ---------------------------------------------------------------------------
const used = getUsedImages();
fs.mkdirSync(path.join(DIST, 'media/img'), { recursive: true });
let imgBytes = 0;
for (const id of used) {
  const m = images[id];
  for (const w of m.widths) for (const ext of ['avif', 'webp']) {
    const f = `${id}-${w}.${ext}`;
    const src = path.join(ROOT, 'media/img', f);
    if (fs.existsSync(src)) { fs.copyFileSync(src, path.join(DIST, 'media/img', f)); imgBytes += fs.statSync(src).size; }
  }
}
fs.mkdirSync(path.join(DIST, 'media/video'), { recursive: true });
let vidBytes = 0;
for (const id of [...getUsedVideos(), 'hero-ambiance', 'film-biologique-recherche']) {
  const src = path.join(ROOT, 'media/video', `${id}.mp4`);
  if (fs.existsSync(src)) { fs.copyFileSync(src, path.join(DIST, 'media/video', `${id}.mp4`)); vidBytes += fs.statSync(src).size; }
}

// ---------------------------------------------------------------------------
// 5. Fichiers statiques, plan du site, redirections
// ---------------------------------------------------------------------------
const staticDir = path.join(ROOT, 'src/static');
for (const f of fs.readdirSync(staticDir)) fs.copyFileSync(path.join(staticDir, f), path.join(DIST, f));
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap
  .map((u) => `  <url><loc>${site.baseUrl}${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority.toFixed(1)}</priority></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.baseUrl}/sitemap.xml\n`);

const redirects = {};
for (const [from, to] of routeMap()) if (from !== to && from !== '/') redirects[from] = to;
fs.writeFileSync(path.join(ROOT, 'worker/redirects.json'), JSON.stringify(redirects, null, 1) + '\n');

// ---------------------------------------------------------------------------
// 6. Rapport
// ---------------------------------------------------------------------------
const mb = (b) => (b / 1048576).toFixed(1) + ' Mo';
console.log(`✓ ${sitemap.length + 1} pages générées en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
console.log(`  CSS ${(css.length / 1024).toFixed(0)} Ko · JS ${(js.length / 1024).toFixed(0)} Ko · images ${used.size} (${mb(imgBytes)}) · vidéos ${mb(vidBytes)}`);
console.log(`  ${Object.keys(redirects).length} redirections d’anciennes adresses`);
const missing = getMissingImages();
if (missing.size) console.log(`  ! ${missing.size} images d’origine introuvables :\n    ${[...missing].slice(0, 30).join('\n    ')}`);
const unknown = getUnknownLinks();
if (unknown.size) console.log(`  ! ${unknown.size} liens internes sans correspondance :\n    ${[...unknown.keys()].slice(0, 40).join('\n    ')}`);
