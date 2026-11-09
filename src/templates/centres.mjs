// Nos centres : vue d'ensemble et page de chaque centre
import { html, esc, md, paras, site, soins, centresContent, CATEGORIES, picture, icon, telHref, accent } from '../../scripts/lib/core.mjs';
import { btn } from './layout.mjs';
import {
  sHead, eyebrow, faqSection, faqSchema, centreCard, coastMap, ctaSection, pageHero, crumbsSchema, stepsBlock, trustBand,
} from './partials.mjs';

export function centresIndex() {
  const ix = centresContent.index;
  const body = html`
  ${pageHero({ eyebrow: ix.eyebrow, title: ix.title, intro: ix.intro, crumbs: [['Nos centres', '/centres/']], cls: 'page-hero--center' })}
  <section class="section section--tight">
    <div class="wrap">
      ${coastMap()}
    </div>
  </section>
  <section class="section section--white">
    <div class="wrap">
      <div class="centres-grid" data-stagger>${site.centres.map((c) => centreCard(c))}</div>
    </div>
  </section>
  <section class="section section--dark">
    <div class="wrap split">
      <div>
        ${eyebrow(ix.concept.eyebrow)}
        <h2 class="h2" data-split>Trois centres, <em>un même univers.</em></h2>
        <p class="lead mt-s" data-reveal>${esc(ix.concept.text)}</p>
        <ul class="expertises mt-m" data-stagger>
          ${ix.expertises.map((e) => html`<li><strong class="serif">${esc(e.title)}</strong><span>${esc(e.text)}</span></li>`)}
        </ul>
      </div>
      <div class="mosaic" data-stagger>
        ${['centre-thetys-pegomas2', 'cabine-antibes', 'accueil-thetys-cannes2', 'terrasse-antibes'].map((id) => `<div class="media">${picture(id, { alt: '', sizes: '(max-width: 900px) 50vw, 25vw' })}</div>`).join('')}
      </div>
    </div>
  </section>
  ${ctaSection({})}
  `;
  return {
    title: ix.seoTitle, description: ix.seoDescription, body,
    schema: crumbsSchema([['Nos centres', '/centres/']]), ogImage: 'centre-thetys-pegomas2',
  };
}

export function centrePage(c) {
  const k = centresContent.pages[c.slug];
  const path = `/centres/${c.slug}/`;
  const cr = [['Nos centres', '/centres/'], [c.name, path]];
  const others = site.centres.filter((x) => x.slug !== c.slug);
  const techs = (cat) => soins.filter((s) => s.category === cat && (s.slug !== 'epilation-laser' || c.slug === 'pegomas'));
  const steps = centresContent.steps.map((s) => ({ ...s, text: s.text.replace('{phone}', c.phone) }));
  const body = html`
  ${pageHero({
    eyebrow: k.eyebrow, title: k.title, intro: k.intro, crumbs: cr, image: c.image, imageAlt: k.about.alt,
    actions: btn('Diagnostic offert · 30 min', c.booking, { variant: 'gold' }) + btn(c.phone, telHref(c.tel), { variant: 'ghost', icon: 'phone' }),
    stats: centresContent.stats,
  })}
  <section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'Infos pratiques', title: 'Nous trouver, <em>nous joindre.</em>', raw: true, split: true })}
      <div class="infos" data-stagger>
        <div class="info"><span class="info__icon">${icon('pin')}</span><h3>Adresse</h3><p>${esc(c.street)}<br>${esc(c.postcode)} ${esc(c.city)}</p><a class="text-link" href="${esc(c.maps)}" target="_blank" rel="noopener"><span>Itinéraire Google Maps</span><span class="arrow">${icon('arrow')}</span></a></div>
        <div class="info"><span class="info__icon">${icon('phone')}</span><h3>Contact</h3><p><a href="${telHref(c.tel)}">${esc(c.phone)}</a><br><a href="mailto:${c.email}">${esc(c.email)}</a></p><a class="text-link" href="${esc(c.booking)}" target="_blank" rel="noopener"><span>Réservation en ligne</span><span class="arrow">${icon('arrow')}</span></a></div>
        <div class="info"><span class="info__icon">${icon('clock')}</span><h3>Horaires</h3><p>${esc(c.hours)}</p><p class="small muted">${esc(c.hoursNote)}</p></div>
        <div class="info"><span class="info__icon">${icon('car')}</span><h3>${esc(c.parkingTitle)}</h3><p>${esc(c.parking)}</p></div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap split split--top">
      <div class="centre-gallery" data-stagger>
        ${c.gallery.slice(0, 4).map((id, i) => `<div class="media ${i === 0 ? 'centre-gallery__main' : ''}">${picture(id, { alt: i === 0 ? k.about.alt : '', sizes: i === 0 ? '(max-width: 900px) 100vw, 50vw' : '25vw' })}</div>`).join('')}
      </div>
      <div>
        ${eyebrow(k.about.eyebrow)}
        <h2 class="h2" data-split>${accent(k.about.title)}</h2>
        <div class="rich mt-s" data-reveal>${paras(k.about.paragraphs)}${k.access ? `<p>${esc(k.access)}</p>` : ''}</div>
        <p class="caption mt-m">${esc(k.about.caption)}</p>
      </div>
    </div>
  </section>
  ${trustBand()}
  <section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: k.techEyebrow, title: k.techTitle, split: true })}
      <div class="centre-techs" data-stagger>
        ${CATEGORIES.map((cat) => {
          const list = techs(cat.slug);
          if (!list.length) return '';
          return html`<div class="centre-techs__col">
            <h3 class="centre-techs__title">${cat.slug === 'epilation' ? 'Épilation définitive' : cat.slug === 'corps' ? 'Corps et silhouette' : cat.label}</h3>
            <ul>${list.map((s) => html`<li><a href="/soins/${s.slug}/"><strong>${esc(s.name)}</strong><span>${md(s.card || '')}</span>${icon('arrowUpRight')}</a></li>`)}</ul>
          </div>`;
        })}
      </div>
    </div>
  </section>
  <section class="section section--sand">
    <div class="wrap">
      ${sHead({ eyebrow: 'Votre premier rendez-vous', title: 'Comment ça se passe, <em>concrètement.</em>', raw: true, split: true })}
      ${stepsBlock(steps)}
    </div>
  </section>
  <section class="section">
    <div class="wrap split">
      <div>
        ${eyebrow(k.around.eyebrow)}
        <h2 class="h2" data-split>${accent(k.around.title)}</h2>
        <p class="lead mt-s" data-reveal>${esc(k.around.text)}</p>
        <ul class="tags mt-m" data-stagger>${k.around.towns.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <p class="muted mt-m" data-reveal>${esc(k.around.others)} ${others.map((o) => `<a class="link-u" href="/centres/${o.slug}/">${esc(o.name)}</a>`).join(' · ')}</p>
      </div>
      <div>${coastMap()}</div>
    </div>
  </section>
  <section class="section section--dark section--quote">
    <div class="wrap"><figure class="pull-quote">
      <blockquote data-split-words>${esc(k.review.text)}</blockquote>
      <figcaption data-reveal>${esc(k.review.author)}</figcaption>
    </figure></div>
  </section>
  ${faqSection({ title: k.faqTitle, items: k.faq })}
  <section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'Nos autres adresses', title: 'Centre Thetys, <em>3 centres sur la Côte d’Azur.</em>', raw: true, split: true })}
      <div class="centres-grid centres-grid--2" data-stagger>${others.map((o) => centreCard(o))}</div>
    </div>
  </section>
  ${ctaSection({ title: k.cta.title, text: k.cta.text, image: c.image, primary: ['Réserver mon diagnostic offert', c.booking], secondary: [`Appeler le ${c.phone}`, telHref(c.tel)] })}
  <p class="wrap disclaimer">Résultats non contractuels, variables selon les personnes.</p>
  `;
  return {
    title: k.seoTitle, description: k.seoDescription, body,
    schema: [...faqSchema(k.faq), ...crumbsSchema(cr)], ogImage: c.image,
  };
}
