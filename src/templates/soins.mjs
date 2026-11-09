// Nos soins : index et fiche technologie
import { html, esc, md, paras, site, soins, CATEGORIES, picture, icon, accent, stripTags, soinHero } from '../../scripts/lib/core.mjs';
import { btn } from './layout.mjs';
import {
  sHead, eyebrow, renderSections, faqSection, faqSchema, soinCard, relatedPosts, centresSection, ctaSection,
  pageHero, crumbsSchema, trustBand,
} from './partials.mjs';

export function soinsIndex() {
  const body = html`
  ${pageHero({
    eyebrow: 'Antibes · Cannes · Pégomas',
    title: 'L’art des technologies <em>de beauté</em>',
    raw: true,
    intro: 'Depuis 17 ans, le Centre Thetys sélectionne les technologies les plus performantes, certifiées CE Medical, pour le visage, le corps, l’épilation et les cheveux.',
    crumbs: [['Nos soins', '/soins/']],
    actions: btn('Réserver mon bilan offert', '/rendez-vous/', { variant: 'gold' }) + btn('Auto-diagnostic', '/diagnostic/', { variant: 'ghost' }),
    cls: 'page-hero--center',
  })}
  <nav class="universe-nav" aria-label="Univers" data-universe-nav>
    <div class="wrap universe-nav__inner">
      ${CATEGORIES.map((c) => html`<a href="#${c.slug}" class="universe-nav__link"><span class="universe-nav__thumb">${picture(c.image, { alt: '', sizes: '64px' })}</span>${c.label}<small>${soins.filter((s) => s.category === c.slug).length}</small></a>`)}
    </div>
  </nav>
  ${CATEGORIES.map((c, k) => html`<section class="section ${k % 2 ? 'section--white' : ''}" id="${c.slug}">
    <div class="wrap">
      ${sHead({ eyebrow: c.eyebrow, title: c.title, lead: c.text, split: true })}
      <div class="tech-grid" data-stagger>${soins.filter((s) => s.category === c.slug).map((s) => soinCard(s, { withCat: false }))}</div>
    </div>
  </section>`)}
  <section class="section section--dark">
    <div class="wrap split">
      <div class="media media--portrait" data-media-reveal>${picture('soin-visage-br-2', { alt: 'Soin en cabine au Centre Thetys', sizes: '(max-width: 900px) 100vw, 50vw' })}</div>
      <div>
        ${eyebrow('L’expérience Thetys')}
        <h2 class="h2" data-split>Un accompagnement <em>sur mesure</em></h2>
        <p class="lead mt-s" data-reveal>Chaque peau est unique. Votre praticienne construit avec vous un protocole personnalisé, ajusté séance après séance, pour atteindre vos objectifs en toute sécurité.</p>
        <ul class="checklist checklist--light mt-m" data-stagger>
          ${['Diagnostic peau offert, 30 minutes, sans engagement', 'Plan de traitement clair, transparent et adapté', 'Praticiennes formées sur chaque technologie', 'Suivi des résultats à chaque étape du protocole'].map((t) => `<li>${icon('check')}<span>${t}</span></li>`).join('')}
        </ul>
        <div class="btn-row mt-m" data-reveal>${btn('Commencer par un bilan offert', '/rendez-vous/', { variant: 'gold' })}</div>
      </div>
    </div>
  </section>
  <section class="section section--sand">
    <div class="wrap">
      ${sHead({ eyebrow: 'Votre première visite', title: 'Bilan personnalisé + séance découverte <em>offerte*</em>', raw: true, split: true, lead: 'Chaque accompagnement commence par un bilan offert et sans engagement dans nos centres d’Antibes, Cannes ou Pégomas. Vous repartez avec un protocole clair, transparent et adapté.' })}
      <div class="stats" style="--n:4" data-stagger>
        ${[['17', 'ans d’expertise', 'Une relation de confiance depuis 2009 sur la Côte d’Azur.'], ['3', 'centres', 'Antibes, Cannes Le Cannet, Pégomas. Tarifs identiques partout.'], ['CE', 'Medical', 'Des technologies certifiées, sélectionnées pour leur puissance et leur sécurité.'], ['4x', 'sans frais', 'Des facilités de paiement sur tous les protocoles.']]
          .map(([v, l, t]) => html`<div class="stats__item"><span class="stats__value" data-count>${v}</span><span class="stats__label"><strong>${l}</strong><br>${t}</span></div>`)}
      </div>
      <p class="note mt-s">* Selon les résultats du bilan et disponibilités</p>
    </div>
  </section>
  ${centresSection({ cls: '', title: 'Nos 3 centres <em>sur la Côte d’Azur</em>' })}
  <section class="section section--white">
    <div class="wrap gift-teaser" data-reveal>
      <div class="gift-teaser__media media media--wide">${picture('carte-cadeau-thetys', { alt: 'Carte cadeau Centre Thetys', sizes: '(max-width: 900px) 100vw, 50vw' })}</div>
      <div>
        ${eyebrow('Pour offrir')}
        <h2 class="h2" data-split>La carte cadeau <em>Thetys</em></h2>
        <p class="lead mt-s">Une séance, un protocole complet ou un montant libre, à utiliser sur tous nos soins et nos gammes cosmétiques.</p>
        <div class="btn-row mt-m">${btn('Offrir une carte cadeau', '/carte-cadeau/', { variant: 'ghost', icon: 'gift' })}</div>
      </div>
    </div>
  </section>
  ${ctaSection({})}
  `;
  return {
    title: 'Nos soins : technologies esthétiques visage, corps, épilation et cheveux',
    description: 'Toutes les technologies du Centre Thetys : cryolipolyse, JetPeel, HIFU, microneedling, lift coréen, épilation laser, électrolyse et plus. Technologies certifiées CE Medical, diagnostic offert sur la Côte d’Azur.',
    body,
    schema: crumbsSchema([['Nos soins', '/soins/']]),
  };
}

export function soinPage(s) {
  const cat = CATEGORIES.find((c) => c.slug === s.category);
  const path = `/soins/${s.slug}/`;
  const cr = [['Nos soins', '/soins/'], [cat.label, `/soins/#${cat.slug}`], [s.name, path]];
  const related = soins.filter((x) => x.category === s.category && x.slug !== s.slug).slice(0, 4);
  const others = related.length < 4 ? soins.filter((x) => x.category !== s.category).slice(0, 4 - related.length) : [];
  // vidéo de la fiche : si elle n'est pas déjà placée dans une section
  const placed = s.sections.some((x) => x.video);
  const videos = s.videos?.length ? s.videos : (EXTRA_VIDEOS[s.slug] ? [EXTRA_VIDEOS[s.slug]] : []);
  const sections = placed || !videos.length ? s.sections : injectVideo(s.sections, videos[0]);
  const body = html`
  ${pageHero({
    eyebrow: s.hero.eyebrow || 'Antibes · Cannes Le Cannet · Pégomas',
    title: s.hero.title,
    intro: s.hero.intro,
    crumbs: cr,
    image: soinHero(s),
    imageAlt: s.heroImage?.alt || s.name,
    actions: btn('Diagnostic offert · 30 min', '/rendez-vous/', { variant: 'gold' }) + btn('Voir les résultats', '/resultats/', { variant: 'ghost' }),
    stats: (s.hero.stats || []).slice(0, 4),
    aside: s.heroImage?.caption ? `<p class="caption page-hero__caption">${esc(s.heroImage.caption)}</p>` : '',
  })}
  ${s.availability ? html`<div class="wrap"><p class="availability" data-reveal>${icon('pin')}<span>${md(s.availability)}</span></p></div>` : ''}
  ${trustBand()}
  ${renderSections(sections, { videoLabel: `${s.name} · En cabine` })}
  ${faqSection({ title: `Tout savoir sur ${articleFor(s)}.`, items: s.faq })}
  ${centresSection({ eyebrow: 'Près de chez vous', title: `${esc(cap(articleFor(s)))} <em>dans nos 3 centres.</em>`, map: false, cls: 'section--sand' })}
  <section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'À découvrir aussi', title: 'D’autres technologies <em>pour vous.</em>', raw: true, split: true })}
      <div class="tech-grid" data-stagger>${[...related, ...others].map((x) => soinCard(x))}</div>
    </div>
  </section>
  ${relatedPosts(s.relatedArticles || [])}
  ${ctaSection({ title: s.cta?.title || 'Et si on commençait par vous écouter ?', text: s.cta?.text })}
  ${s.disclaimer ? `<p class="wrap disclaimer">${md(s.disclaimer)}</p>` : ''}
  `;
  const schema = [
    {
      '@type': 'Service',
      name: s.name,
      serviceType: s.name,
      description: stripTags(s.seoDescription || s.card || ''),
      url: `${site.baseUrl}${path}`,
      provider: { '@id': `${site.baseUrl}/#organization` },
      areaServed: ['Antibes', 'Cannes', 'Le Cannet', 'Pégomas', 'Côte d’Azur'],
    },
    ...faqSchema(s.faq),
    ...crumbsSchema(cr.map(([n, u]) => [n, u.replace(/#.*/, '')])),
  ];
  return {
    title: s.seoTitle || s.name,
    description: s.seoDescription,
    body,
    schema,
    ogImage: s.heroImage?.src || s.heroImage,
  };
}

// reels du centre à afficher sur les fiches qui n'avaient pas de vidéo
const EXTRA_VIDEOS = { microneedling: 'reel-microneedling', 'radiofrequence-core': 'reel-radiofrequence-visage' };

function injectVideo(sections, video) {
  const out = [...sections];
  const k = out.findIndex((x) => x.type === 'prose' && !x.image);
  if (k >= 0) out[k] = { ...out[k], video: { src: video } };
  else out.splice(1, 0, { type: 'prose', eyebrow: 'En cabine', title: null, paragraphs: [], video: { src: video } });
  return out;
}

const ARTICLES = {
  'lift-coreen': 'le Lift Coréen', microneedling: 'le microneedling', 'peelings-mesoestetic': 'les peelings Mesoestetic',
  cosmelan: 'le Cosmelan', hifu: 'le HIFU', 'jet-peel': 'le Jet Peel', 'plasma-pulse': 'le Plasma Pulse',
  'radiofrequence-core': 'la radiofréquence CORE', 'led-esthetic': 'la LED Esthetic', 'biologique-recherche': 'les soins Biologique Recherche',
  thalgo: 'les soins Thalgo', cryolipolyse: 'la cryolipolyse', 'v-core': 'le V-Core®', icoone: 'l’Icoone', ipulse: 'l’iPulse 5.1',
  'radiofrequence-fractionnee': 'la radiofréquence fractionnée', 'jet-leg-mains': 'le Jet Leg & Mains', 'epilation-laser': 'l’épilation laser',
  electrolyse: 'l’électrolyse', 'microneedling-cheveux': 'le microneedling cheveux', 'jetpeel-cheveux': 'le JetPeel cheveux',
};
export const articleFor = (s) => ARTICLES[s.slug] || s.name;
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
