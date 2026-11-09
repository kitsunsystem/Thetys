// Journal : liste des articles et page article
import { html, esc, site, journal, picture, imageId, mapUrl, frDate, readingTime, icon } from '../../scripts/lib/core.mjs';
import { btn } from './layout.mjs';
import { sHead, postCard, ctaSection, crumbs, crumbsSchema } from './partials.mjs';

const FALLBACK_COVERS = {
  upcycling: 'upcycling-thetys', chirurgie: 'thetys-alternative-chirurgie', poches: 'jet-peel-yeux', routine: 'thetys-routine-beaute',
  biologique: 'soin-visage-biologique-recherche-cabine-centre-thetys',
};
export function coverFor(p) {
  if (p.cover && imageId(p.cover)) return p.cover;
  for (const [k, v] of Object.entries(FALLBACK_COVERS)) if (p.slug.includes(k) && imageId(v)) return v;
  return 'home-rdv';
}

export function journalIndex() {
  const posts = journal.map((p) => ({ ...p, cover: coverFor(p) }));
  const [first, ...rest] = posts;
  const body = html`
  <section class="page-hero page-hero--center" data-hero>
    <div class="wrap">
      <div class="page-hero__text">
        ${crumbs([['Journal', '/journal/']])}
        <p class="eyebrow" data-reveal>Le journal du Centre Thetys</p>
        <h1 class="h-display" data-split data-split-hero>Conseils, protocoles <em>et nouveautés.</em></h1>
        <p class="lead page-hero__intro" data-reveal>${posts.length} articles écrits par nos expertes : technologies, soins, conseils et réponses à vos questions.</p>
      </div>
    </div>
  </section>
  <section class="section section--tight">
    <div class="wrap">
      ${postCard(first, { big: true, sizes: '(max-width: 900px) 100vw, 60vw' })}
    </div>
  </section>
  <section class="section section--white">
    <div class="wrap">
      <div class="grid grid--3 journal-grid" data-stagger>${rest.map((p) => postCard(p))}</div>
    </div>
  </section>
  ${ctaSection({})}
  `;
  return {
    title: 'Journal : conseils beauté, minceur et anti-âge',
    description: 'Le journal du Centre Thetys : HIFU, cryolipolyse, JetPeel, microneedling, épilation définitive… conseils et guides de nos expertes à Antibes, Cannes et Pégomas.',
    body,
    schema: crumbsSchema([['Journal', '/journal/']]),
  };
}

/** Remplace les balises d'images et réécrit les liens du contenu d'origine. */
function articleHtml(raw) {
  let h = raw.replace(/<thetys-img data-alt="([^"]*)" data-id="([^"]+)"><\/thetys-img>/g, (_, alt, id) =>
    `<figure class="media media--auto">${picture(id, { alt: alt.replace(/&quot;/g, '"'), sizes: '(max-width: 800px) 100vw, 760px' })}</figure>`);
  h = h.replace(/href="([^"]+)"/g, (_, u) => {
    const to = mapUrl(u.replace(/&amp;/g, '&'));
    const ext = /^https?:\/\//.test(to) && !/centrethetys\.fr/.test(to);
    return `href="${esc(to)}"${ext ? ' target="_blank" rel="noopener"' : ''}`;
  });
  return h;
}

export function articlePage(p) {
  const cover = coverFor(p);
  const path = `/journal/${p.slug}/`;
  const others = journal.filter((x) => x.slug !== p.slug).slice(0, 3).map((x) => ({ ...x, cover: coverFor(x) }));
  const body = html`
  <article class="article">
    <header class="article__hero" data-hero>
      <div class="wrap wrap--narrow">
        ${crumbs([['Journal', '/journal/'], [p.title, path]])}
        <p class="eyebrow" data-reveal><time datetime="${p.date}">${frDate(p.date)}</time> · ${readingTime(p.words)} min de lecture</p>
        <h1 class="h-display article__title" data-split data-split-hero>${esc(p.title)}</h1>
        ${p.description ? `<p class="lead" data-reveal>${esc(p.description)}</p>` : ''}
      </div>
      <div class="wrap">
        <div class="media media--cinema article__cover" data-hero-media>${picture(cover, { alt: '', sizes: '100vw', priority: true })}</div>
      </div>
    </header>
    <div class="wrap wrap--text">
      <div class="prose" data-prose>${articleHtml(p.html)}</div>
      <aside class="article__aside" data-reveal>
        <p class="serif">Une question sur ce sujet ? Le diagnostic est offert, dans le centre de votre choix.</p>
        <div class="btn-row">${btn('Réserver mon diagnostic', '/rendez-vous/', { variant: 'gold' })}${btn('Auto-diagnostic', '/diagnostic/', { variant: 'ghost' })}</div>
      </aside>
    </div>
  </article>
  <section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'Continuer la lecture', title: 'Ces articles <em>pourraient vous plaire.</em>', raw: true, split: true })}
      <div class="grid grid--3" data-stagger>${others.map((x) => postCard(x))}</div>
    </div>
  </section>
  `;
  const schema = [{
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.modified || p.date,
    inLanguage: 'fr-FR',
    mainEntityOfPage: `${site.baseUrl}${path}`,
    author: { '@id': `${site.baseUrl}/#organization` },
    publisher: { '@id': `${site.baseUrl}/#organization` },
  }, ...crumbsSchema([['Journal', '/journal/'], [p.title, path]])];
  return { title: p.seoTitle || p.title, description: p.description, body, schema, ogImage: cover };
}
