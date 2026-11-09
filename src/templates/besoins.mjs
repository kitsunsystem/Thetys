// Vos besoins : vue d'ensemble, catégories et besoins détaillés
import { html, esc, md, paras, site, soins, besoins, picture, icon, mapUrl, accent, stripTags, imageId, soinImage } from '../../scripts/lib/core.mjs';
import { btn } from './layout.mjs';
import {
  sHead, eyebrow, renderSections, faqSection, faqSchema, relatedPosts, centresSection, ctaSection, pageHero, crumbsSchema,
  reviewCard, trustBand,
} from './partials.mjs';

const CAT_LABEL = Object.fromEntries(besoins.categories.map((c) => [c.slug, c.shortTitle]));
export const needPath = (n) => `/besoins/${n.category}/${n.slug}/`;
const isCentresBlock = (s) => /dans nos 3 centres|près de chez vous|nos 3 centres/i.test(`${s.title || ''} ${s.eyebrow || ''}`);

function soinFromUrl(url) {
  const to = mapUrl(url || '');
  const m = /^\/soins\/([^/]+)\//.exec(to || '');
  return m ? soins.find((s) => s.slug === m[1]) : null;
}

/** Bloc « nos solutions » : cartes technologies. */
function solutionsBlock(sol, { cls = '' } = {}) {
  if (!sol?.items?.length) return '';
  return html`<section class="section ${cls}">
    <div class="wrap">
      ${sHead({ eyebrow: sol.eyebrow || 'Nos solutions', title: sol.title, lead: sol.intro?.length ? sol.intro : null, split: true })}
      <div class="solutions" data-stagger>
        ${sol.items.map((it, k) => {
          const s = soinFromUrl(it.url);
          const img = it.images?.[0]?.src || it.images?.[0] || (s ? soinImage(s) : null);
          const href = s ? `/soins/${s.slug}/` : (it.url ? mapUrl(it.url) : null);
          const inner = html`
            <div class="solution__media media media--wide">${picture(img, { alt: it.images?.[0]?.alt || '', sizes: '(max-width: 800px) 100vw, 40vw' })}${it.badge ? `<span class="media__tag">${esc(it.badge)}</span>` : ''}</div>
            <div class="solution__body">
              <span class="solution__num">${String(k + 1).padStart(2, '0')}</span>
              <h3 class="solution__title serif">${esc(it.name)}</h3>
              <div class="solution__text rich">${paras(String(it.text || '').split(/\n\n/))}</div>
              ${href ? `<span class="text-link"><span>Découvrir</span><span class="arrow">${icon('arrow')}</span></span>` : ''}
            </div>`;
          return href ? `<a class="solution" href="${esc(href)}" data-cursor="Découvrir">${inner}</a>` : `<div class="solution">${inner}</div>`;
        })}
      </div>
      ${sol.outro ? `<div class="rich mt-m" data-reveal>${paras([].concat(sol.outro))}</div>` : ''}
    </div>
  </section>`;
}

function bilanBlock(b) {
  if (!b) return '';
  return ctaSection({ eyebrow: 'Bilan offert · sans engagement', title: b.title, text: b.text, image: 'diagnostic-centre-thetys' });
}

function testimonialBlock(t) {
  if (!t?.text) return '';
  return html`<section class="section section--dark section--quote">
    <div class="wrap"><figure class="pull-quote">
      <blockquote data-split-words>${md(t.text.replace(/^[«“"]\s*|\s*[»”"]$/g, ''))}</blockquote>
      ${t.author ? `<figcaption data-reveal>${esc(t.author)}</figcaption>` : ''}
    </figure></div>
  </section>`;
}

function beforeAfterBlock(n) {
  const pairs = (n.beforeAfter || []).filter((ba) => imageId(ba.before?.src || ba.before) && imageId(ba.after?.src || ba.after));
  if (!pairs.length) return '';
  n = { ...n, beforeAfter: pairs };
  return html`<section class="section section--sand">
    <div class="wrap split">
      <div>
        ${eyebrow('Nos résultats')}
        <h2 class="h2" data-split>Ce qui compte, <em>ce sont les résultats.</em></h2>
        ${n.resultsText ? `<p class="lead mt-s" data-reveal>${md(n.resultsText)}</p>` : ''}
        <p class="note mt-s">Résultats non contractuels, variables selon les personnes.</p>
      </div>
      <div>
        ${n.beforeAfter.map((ba) => html`<div class="compare" data-compare>
          <div class="compare__img compare__img--after">${picture(ba.after.src || ba.after, { alt: ba.after.alt || 'Après', sizes: '(max-width: 900px) 100vw, 50vw' })}</div>
          <div class="compare__img compare__img--before">${picture(ba.before.src || ba.before, { alt: ba.before.alt || 'Avant', sizes: '(max-width: 900px) 100vw, 50vw' })}</div>
          <span class="compare__tag compare__tag--before">Avant</span><span class="compare__tag compare__tag--after">Après</span>
          <input class="compare__range" type="range" min="0" max="100" value="50" aria-label="Comparer avant et après">
          <span class="compare__handle" aria-hidden="true"><i></i></span>
        </div>`)}
      </div>
    </div>
  </section>`;
}

// ---------------------------------------------------------------------------
export function besoinsIndex() {
  const o = besoins.overview;
  const cats = besoins.categories;
  const body = html`
  ${pageHero({
    eyebrow: o.heroEyebrow, title: o.title, intro: o.intro, crumbs: [['Vos besoins', '/besoins/']],
    image: o.heroImage?.src, imageAlt: o.heroImage?.alt, stats: o.heroStats || [],
    actions: btn('Réserver mon bilan offert', '/rendez-vous/', { variant: 'gold' }) + btn('Auto-diagnostic', '/diagnostic/', { variant: 'ghost' }),
  })}
  <section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'Quatre familles de besoins', title: 'Par où <em>commencer ?</em>', raw: true, split: true, lead: o.updatedNote ? `<span class="small muted">${esc(o.updatedNote)}</span>` : null })}
      <div class="cat-cards" data-stagger>
        ${cats.map((c, k) => html`<a class="cat-card" href="/besoins/${c.slug}/" data-cursor="Explorer">
          <div class="cat-card__media">${picture(c.heroImage?.src || c.heroImage, { alt: '', sizes: '(max-width: 800px) 100vw, 25vw' })}</div>
          <div class="cat-card__body">
            <span class="cat-card__num">0${k + 1}</span>
            <h3 class="serif">${esc(c.shortTitle)}</h3>
            <p>${esc(c.keywords || '')}</p>
          </div>
        </a>`)}
      </div>
    </div>
  </section>
  ${renderSections(o.sections.filter((s) => !isCentresBlock(s)))}
  ${faqSection({ eyebrow: o.faqEyebrow || 'Vos questions', title: o.faqTitle, items: o.faq })}
  ${centresSection({})}
  ${ctaSection({})}
  `;
  return {
    title: 'Vos besoins beauté : silhouette, anti-âge, peau, pilosité',
    description: o.seoDescription,
    body,
    schema: [...faqSchema(o.faq), ...crumbsSchema([['Vos besoins', '/besoins/']])],
    ogImage: o.heroImage?.src,
  };
}

export function besoinCategory(c) {
  const path = `/besoins/${c.slug}/`;
  const cr = [['Vos besoins', '/besoins/'], [c.shortTitle, path]];
  const needs = c.needs.map((slug) => besoins.needs.find((n) => n.slug === slug && n.category === c.slug)).filter(Boolean);
  const body = html`
  ${pageHero({
    eyebrow: c.keywords || 'Vos besoins', title: c.title, intro: c.intro, crumbs: cr,
    image: c.heroImage?.src || c.heroImage, imageAlt: c.heroImage?.alt || '',
    actions: btn('Réserver mon bilan offert', '/rendez-vous/', { variant: 'gold' }) + btn('Auto-diagnostic', '/diagnostic/', { variant: 'ghost' }),
  })}
  ${trustBand()}
  ${needs.length ? html`<section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'Votre besoin précis', title: 'Choisissez <em>votre zone.</em>', raw: true, split: true, lead: 'Chaque besoin a sa page : causes, technologies adaptées, déroulé du protocole et réponses à vos questions.' })}
      <div class="need-grid" data-stagger>
        ${needs.map((n) => html`<a class="need-card" href="${needPath(n)}" data-cursor="Découvrir">
          <div class="need-card__media">${picture(n.heroImage?.src || n.heroImage, { alt: '', sizes: '(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw' })}</div>
          <h3 class="need-card__title serif">${esc(n.title)}</h3>
          <span class="need-card__arrow">${icon('arrowUpRight')}</span>
        </a>`)}
      </div>
    </div>
  </section>` : ''}
  ${renderSections(c.sections.filter((s) => !isCentresBlock(s)))}
  ${solutionsBlock(c.solutions, { cls: 'section--sand' })}
  ${testimonialBlock(c.testimonial)}
  ${faqSection({ title: `Vos questions : ${c.shortTitle.toLowerCase()}.`, items: c.faq })}
  ${relatedPosts(c.relatedArticles || [])}
  ${c.bilan ? bilanBlock(c.bilan) : ctaSection({})}
  `;
  return {
    title: c.seoTitle?.replace(/\s*[-|]\s*Centre Thetys.*$/, '') || c.title,
    description: c.seoDescription,
    body,
    schema: [...faqSchema(c.faq), ...crumbsSchema(cr)],
    ogImage: c.heroImage?.src || c.heroImage,
  };
}

export function besoinPage(n) {
  const c = besoins.categories.find((x) => x.slug === n.category);
  const path = needPath(n);
  const cr = [['Vos besoins', '/besoins/'], [c.shortTitle, `/besoins/${c.slug}/`], [n.title, path]];
  const siblings = c.needs.filter((s) => s !== n.slug).map((slug) => besoins.needs.find((x) => x.slug === slug)).filter(Boolean);
  const body = html`
  ${pageHero({
    eyebrow: n.heroEyebrow || c.shortTitle, title: n.heroTitle || n.title, intro: n.intro, crumbs: cr,
    image: n.heroImage?.src || n.heroImage, imageAlt: n.heroImage?.alt || n.title, stats: n.heroStats || [],
    actions: btn('Diagnostic offert · 30 min', '/rendez-vous/', { variant: 'gold' }) + btn('Voir les résultats', '/resultats/', { variant: 'ghost' }),
  })}
  ${trustBand()}
  ${beforeAfterBlock(n)}
  ${renderSections(n.sections.filter((s) => !isCentresBlock(s)))}
  ${solutionsBlock(n.solutions, { cls: 'section--sand' })}
  ${testimonialBlock(n.testimonial)}
  ${faqSection({ eyebrow: n.faqEyebrow || 'Vos questions', title: n.faqTitle || 'Questions fréquentes.', items: n.faq })}
  ${centresSection({ eyebrow: 'Près de chez vous', title: 'Dans nos <em>3 centres.</em>', map: false })}
  ${siblings.length ? html`<section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: c.shortTitle, title: 'Les autres besoins <em>de cette famille.</em>', raw: true, split: true })}
      <div class="need-list" data-stagger>${siblings.map((x) => html`<a class="need-list__item" href="${needPath(x)}"><span class="serif">${esc(x.title)}</span>${icon('arrowUpRight')}</a>`)}</div>
    </div>
  </section>` : ''}
  ${relatedPosts(n.relatedArticles || [])}
  ${n.bilan ? bilanBlock(n.bilan) : ctaSection({})}
  `;
  return {
    title: n.seoTitle?.replace(/\s*[-|]\s*Centre Thetys.*$/, '') || n.title,
    description: n.seoDescription,
    body,
    schema: [...faqSchema(n.faq), ...crumbsSchema(cr)],
    ogImage: n.heroImage?.src || n.heroImage,
  };
}
