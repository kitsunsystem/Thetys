// Pages : qui sommes-nous, diagnostic, résultats, cosmétiques, carte cadeau,
// rendez-vous, recrutement, offres, pages légales, 404.
import {
  html, esc, md, paras, site, pages, soins, offres, legal, picture, imgUrl, icon, player, telHref, waHref, markSvg, accent, mapUrl, soinImage,
} from '../../scripts/lib/core.mjs';
import { btn } from './layout.mjs';
import {
  sHead, eyebrow, faqSection, faqSchema, ctaSection, pageHero, crumbsSchema, crumbs, stepsBlock, centreCard, centresSection,
  soinCard, reviewCard, trustBand,
} from './partials.mjs';

// ---------------------------------------------------------------------------
export function about() {
  const a = pages.about;
  const body = html`
  ${pageHero({
    eyebrow: a.eyebrow, title: a.title, raw: true, intro: a.intro, crumbs: [['Qui sommes-nous', '/qui-sommes-nous/']],
    image: 'centre-thetys-fondateurs-elodie-et-alexandre', imageAlt: 'Elodie et Alexandre Vial, fondateurs du Centre Thetys',
    actions: btn('Nos centres', '/centres/', { variant: 'gold' }) + btn('Nos solutions', '/soins/', { variant: 'ghost' }),
  })}
  ${trustBand()}
  <section class="section">
    <div class="wrap">
      ${sHead({ eyebrow: a.values.eyebrow, title: a.values.title, raw: true, split: true })}
      <div class="values" data-stagger>
        ${a.values.items.map((v, k) => html`<article class="value">
          <span class="value__num serif">0${k + 1}</span>
          <h3 class="value__title serif">${esc(v.title)}</h3>
          <p>${esc(v.text)}</p>
        </article>`)}
      </div>
    </div>
  </section>
  <section class="pillars" data-pillars>
    ${a.pillars.map((p, k) => html`<article class="pillar ${k % 2 ? 'pillar--reverse' : ''}">
      <div class="wrap split">
        <div class="pillar__media" data-parallax-wrap><div class="media media--portrait" data-media-reveal>${picture(p.image, { alt: '', sizes: '(max-width: 900px) 100vw, 50vw' })}</div></div>
        <div class="pillar__text">
          <span class="pillar__num serif">${p.num}</span>
          <h2 class="h2" data-split>${esc(p.title)}</h2>
          <p class="mt-s" data-reveal>${esc(p.text)}</p>
          <div class="mt-m" data-reveal><a class="text-link" href="${p.href}"><span>${esc(p.cta)}</span><span class="arrow">${icon('arrow')}</span></a></div>
        </div>
      </div>
    </article>`)}
  </section>
  <section class="section section--dark founders">
    <div class="wrap split split--top">
      <div>
        ${eyebrow(a.founders.eyebrow)}
        <h2 class="h-display" data-split>${a.founders.title}</h2>
        <p class="lead mt-m" data-reveal>${esc(a.founders.text)}</p>
        <div class="btn-row mt-m" data-reveal>${btn('Lire l’interview des fondateurs', a.founders.interview, { variant: 'ghost-light' })}</div>
      </div>
      <ol class="timeline-v" data-stagger>
        ${a.founders.timeline.map((t) => html`<li><span class="timeline-v__year serif">${esc(t.year)}</span><span>${esc(t.text)}</span></li>`)}
      </ol>
    </div>
  </section>
  <section class="section">
    <div class="wrap split">
      <div class="media media--portrait" data-media-reveal>${picture('elodie-vial-centre-thetys', { alt: 'Elodie Vial, cofondatrice du Centre Thetys', sizes: '(max-width: 900px) 100vw, 40vw' })}</div>
      <div>
        ${eyebrow(a.wish.eyebrow)}
        <h2 class="h2" data-split>${a.wish.title}</h2>
        <div class="rich mt-s" data-reveal>${a.wish.paragraphs.map((t) => `<p>${t}</p>`).join('')}</div>
        <ul class="footer__social footer__social--dark mt-m" data-reveal>
          ${site.social.map((s) => html`<li><a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}">${icon(s.name.toLowerCase())}</a></li>`)}
        </ul>
      </div>
    </div>
  </section>
  ${centresSection({ cls: 'section--sand' })}
  ${ctaSection({})}
  `;
  return { title: a.seoTitle, description: a.seoDescription, body, schema: crumbsSchema([['Qui sommes-nous', '/qui-sommes-nous/']]), ogImage: 'centre-thetys-fondateurs-elodie-et-alexandre' };
}

// ---------------------------------------------------------------------------
const QUIZ_SOINS = {
  jetpeel_yeux: ['JetPeel contour des yeux', 'jet-peel'], plasma: ['Plasma Pulse', 'plasma-pulse'], led: ['LED Esthetic', 'led-esthetic'],
  hifu: ['HIFU visage', 'hifu'], lift: ['Lift coréen', 'lift-coreen'], radiof: ['Radiofréquence multidimensionnelle', 'radiofrequence-core'],
  microneedling: ['Microneedling Mesoestetic Axion', 'microneedling'], jetpeel: ['JetPeel visage', 'jet-peel'], cosmelan: ['Cosmelan', 'cosmelan'],
  cryo: ['Cryolipolyse', 'cryolipolyse'], icoone: ['Icoone', 'icoone'], vcore: ['V-Core', 'v-core'], ipulse: ['iPulse', 'ipulse'],
  micro_cap: ['Microneedling capillaire', 'microneedling-cheveux'], jetpeel_cap: ['JetPeel cheveux', 'jetpeel-cheveux'],
  laser: ['Épilation laser', 'epilation-laser'], electrolyse: ['Électrolyse haute fréquence', 'electrolyse'],
};
const QUIZ_TREE = {
  besoin: { t: 'Où se situe votre besoin ?', s: 'Une seule réponse, vous pourrez refaire le test pour une autre zone.', o: [
    { l: 'Visage', s: 'Rides, relâchement, éclat, taches', n: 'zoneVisage' }, { l: 'Corps', s: 'Silhouette, cellulite, fermeté', n: 'zoneCorps' },
    { l: 'Cheveux', s: 'Chute, densité', n: 'pbCheveux' }, { l: 'Épilation', s: 'Laser, électrolyse', r: { p: 'laser', a: ['electrolyse'], c: 'epilation' } }] },
  zoneVisage: { t: 'Quelle zone du visage ?', o: [
    { l: 'Regard', s: 'Yeux, paupières, cernes', n: 'pbYeux' }, { l: 'Ovale et bas du visage', s: 'Bajoues, double menton', r: { p: 'hifu', a: ['lift', 'radiof'], c: 'visage_ovale' } },
    { l: 'Joues et teint', s: 'Taches, imperfections, éclat', n: 'pbTeint' }, { l: 'Cou et décolleté', r: { p: 'hifu', a: ['radiof', 'jetpeel'], c: 'visage_cou' } },
    { l: 'Visage entier', n: 'pbVisage' }] },
  pbYeux: { t: 'Quelle est votre priorité sur le regard ?', o: [
    { l: 'Poches ou cernes', r: { p: 'jetpeel_yeux', a: ['led', 'plasma'], c: 'regard_poches' } }, { l: 'Rides du contour', r: { p: 'plasma', a: ['microneedling', 'led'], c: 'regard_rides' } },
    { l: 'Paupières qui tombent', r: { p: 'plasma', a: ['hifu', 'radiof'], c: 'regard_paupieres' } }] },
  pbTeint: { t: 'Quelle est votre priorité ?', o: [
    { l: 'Taches pigmentaires', r: { p: 'cosmelan', a: ['jetpeel', 'led'], c: 'teint_taches' } }, { l: 'Imperfections, acné', r: { p: 'led', a: ['jetpeel', 'microneedling'], c: 'teint_imperfections' } },
    { l: 'Manque d’éclat', r: { p: 'jetpeel', a: ['led', 'microneedling'], c: 'teint_eclat' } }] },
  pbVisage: { t: 'Quelle est votre priorité ?', o: [
    { l: 'Rides installées', r: { p: 'microneedling', a: ['hifu', 'plasma'], c: 'visage_rides' } }, { l: 'Manque de fermeté', r: { p: 'radiof', a: ['hifu', 'lift'], c: 'visage_fermete' } },
    { l: 'Éclat et peau neuve', r: { p: 'jetpeel', a: ['led', 'microneedling'], c: 'visage_eclat' } }] },
  zoneCorps: { t: 'Quelle zone du corps ?', o: [{ l: 'Ventre', n: 'pbCorps' }, { l: 'Cuisses et fessiers', n: 'pbCorps' }, { l: 'Bras', n: 'pbCorps' }, { l: 'Silhouette globale', n: 'pbCorps' }] },
  pbCorps: { t: 'Quelle est votre priorité ?', o: [
    { l: 'Graisse localisée', s: 'Résiste au sport et aux régimes', r: { p: 'cryo', a: ['icoone', 'vcore'], c: 'corps_graisse' } }, { l: 'Cellulite, peau d’orange', r: { p: 'icoone', a: ['vcore', 'radiof'], c: 'corps_cellulite' } },
    { l: 'Peau relâchée', r: { p: 'radiof', a: ['icoone', 'ipulse'], c: 'corps_relachement' } }, { l: 'Tonicité musculaire', r: { p: 'vcore', a: ['ipulse', 'icoone'], c: 'corps_tonicite' } }] },
  pbCheveux: { t: 'Quelle est votre priorité ?', o: [
    { l: 'Chute de cheveux', r: { p: 'micro_cap', a: ['jetpeel_cap', 'led'], c: 'cheveux_chute' } }, { l: 'Densité, repousse', r: { p: 'micro_cap', a: ['jetpeel_cap', 'led'], c: 'cheveux_densite' } }] },
};

function quiz() {
  const data = {
    tree: QUIZ_TREE,
    soins: Object.fromEntries(Object.entries(QUIZ_SOINS).map(([k, [label, slug]]) => {
      const s = soins.find((x) => x.slug === slug);
      return [k, { label, slug, img: s ? imgUrl(soinImage(s), 480) : null, card: s?.card || '' }];
    })),
    centres: site.centres.map((c) => ({ value: c.slug === 'antibes' ? 'Centre d’Antibes' : c.slug === 'pegomas' ? 'Centre de Pegomas' : 'Centre du Cannet', name: c.name, phone: c.phone, tel: c.tel, booking: c.booking })),
    webhook: site.diagnosticWebhook || '',
    whatsapp: site.whatsapp,
  };
  return html`<div class="quiz" id="quiz" data-quiz>
    <script type="application/json" data-quiz-data>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
    <div class="quiz__bar"><i data-quiz-bar></i></div>
    <div class="quiz__top"><button type="button" class="quiz__back" data-quiz-back hidden>← Retour</button><span class="quiz__step" data-quiz-step>Question 1 sur 3</span></div>
    <div class="quiz__screen is-active" data-screen="q">
      <h3 class="quiz__title serif" data-quiz-title></h3>
      <p class="quiz__sub" data-quiz-sub></p>
      <div class="quiz__options" data-quiz-options></div>
    </div>
    <form class="quiz__screen" data-screen="cap" novalidate>
      <p class="eyebrow">Dernière étape</p>
      <h3 class="quiz__title serif">Votre plan sur-mesure <em>vous attend.</em></h3>
      <p class="quiz__sub">Partagez vos coordonnées : votre plan personnalisé arrive immédiatement sur WhatsApp, préparé selon vos réponses par nos expertes.</p>
      <div class="form-grid mt-s">
        <div class="field"><label for="q-prenom">Votre prénom *</label><input class="input" id="q-prenom" name="prenom" autocomplete="given-name" placeholder="Camille" required></div>
        <div class="field"><label for="q-tel">Votre mobile, pour le WhatsApp *</label><input class="input" id="q-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="06 ou 07..." required></div>
        <div class="field"><label for="q-mail">Votre email, facultatif</label><input class="input" id="q-mail" name="email" type="email" autocomplete="email" placeholder="camille@email.fr"></div>
        <div class="field"><label for="q-centre">Votre centre</label><select class="select" id="q-centre" name="centre">${data.centres.map((c) => `<option value="${esc(c.value)}">${esc(c.value)}</option>`).join('')}</select></div>
        <div class="field"><label for="q-contact">Contact préféré</label><select class="select" id="q-contact" name="contact"><option>WhatsApp</option><option>Appel téléphonique</option></select></div>
        <div class="field"><label for="q-moment">Moment idéal pour vous joindre</label><select class="select" id="q-moment" name="moment"><option>Peu importe</option><option>Matin</option><option>Midi</option><option>Après-midi</option><option>Soir</option></select></div>
        <label class="check full"><input type="checkbox" name="rgpd" id="q-rgpd"><span>J’accepte la <a class="link-u" href="/confidentialite/">politique de confidentialité</a> et consens à être contactée au sujet de mon diagnostic.</span></label>
      </div>
      <p class="form-msg form-msg--error" data-quiz-error hidden></p>
      <div class="btn-row mt-s"><button class="btn btn--gold" type="submit"><span class="btn__label"><span data-text="Révéler mon plan">Révéler mon plan</span></span></button></div>
      <p class="small muted mt-s">Vos informations sont en sécurité et ne seront jamais partagées.</p>
    </form>
    <div class="quiz__screen" data-screen="fin">
      <p class="eyebrow">Plan révélé</p>
      <h3 class="quiz__title serif">C’est parti, <span data-quiz-name></span> !</h3>
      <p class="quiz__sub" data-quiz-fin-sub>Votre plan vient de partir sur WhatsApp. Voici le message envoyé :</p>
      <div class="quiz__plan" data-quiz-plan></div>
      <div class="quiz__bubble" data-quiz-bubble></div>
      <p class="small muted" data-quiz-note>Le message arrive en quelques secondes sur le numéro indiqué. Vous ne le voyez pas ? Vérifiez vos discussions WhatsApp, ou appelez directement votre centre : notre équipe a bien reçu votre demande.</p>
      <div class="btn-row mt-s" data-quiz-actions></div>
      <button type="button" class="quiz__restart" data-quiz-restart>← Refaire le parcours</button>
    </div>
  </div>`;
}

export function diagnostic() {
  const d = pages.diagnostic;
  const body = html`
  ${pageHero({
    eyebrow: d.eyebrow, title: d.title, raw: true, intro: d.intro, crumbs: [['Diagnostic', '/diagnostic/']],
    image: 'image-site-diag-de-peau', imageAlt: 'Scanner de peau et écrans d’analyse du diagnostic Centre Thetys',
    actions: btn('Commencer mon diagnostic', '#quiz', { variant: 'gold', icon: 'arrow' }) + `<span class="small muted">${esc(d.meta)}</span>`,
  })}
  <section class="section section--sand quiz-section">
    <div class="wrap wrap--narrow">${quiz()}</div>
  </section>
  <section class="section">
    <div class="wrap split split--top">
      <div>
        ${eyebrow(d.why.eyebrow)}
        <h2 class="h2" data-split>${d.why.title}</h2>
        <p class="lead mt-s" data-reveal>${esc(d.why.lead)}</p>
      </div>
      <div class="rich" data-reveal>${d.why.paragraphs.map((t) => `<p>${t}</p>`).join('')}</div>
    </div>
  </section>
  <section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'Diagnostic by Centre Thetys', title: d.strengths.title, split: true })}
      <div class="values" data-stagger>
        ${d.strengths.items.map((v, k) => html`<article class="value"><span class="value__num serif">0${k + 1}</span><h3 class="value__title serif">${esc(v.title)}</h3><p>${esc(v.text)}</p></article>`)}
      </div>
    </div>
  </section>
  ${d.kinds.map((k, i) => html`<section class="section ${i ? 'section--white' : ''}">
    <div class="wrap split ${i ? 'split--reverse' : ''}">
      <div class="media media--portrait" data-media-reveal>${picture(k.image, { alt: '', sizes: '(max-width: 900px) 100vw, 50vw' })}</div>
      <div>${eyebrow(i ? 'Corps' : 'Visage')}<h2 class="h2" data-split>${accent(k.title)}</h2><p class="lead mt-s" data-reveal>${esc(k.text)}</p></div>
    </div>
  </section>`)}
  <section class="section section--dark">
    <div class="wrap split">
      <div>
        ${eyebrow('Diagnostic de peau · Pégomas')}
        <h2 class="h2" data-split>Le diagnostic, <em>en images.</em></h2>
        <p class="lead mt-s" data-reveal>Analyse de la peau, écrans d’analyse et conseils personnalisés : découvrez le déroulé d’un diagnostic au Centre Thetys de Pégomas.</p>
      </div>
      <div>${player('reel-diagnostic-peau', { label: 'Diagnostic de peau' })}</div>
    </div>
  </section>
  <section class="section" id="bilan">
    <div class="wrap">
      ${sHead({ eyebrow: d.start.eyebrow, title: d.start.title, raw: true, split: true, lead: 'Nous pouvons commencer le diagnostic par téléphone ou en ligne, et le finaliser sur rendez-vous dans le Centre Thetys de votre choix.' })}
      <div class="ways" data-stagger>
        <div class="way"><span class="way__icon">${icon('phone')}</span><h3 class="serif">Par téléphone</h3>
          <ul>${site.centres.map((c) => html`<li><strong>${esc(c.name)}</strong><a href="${telHref(c.tel)}">${esc(c.phone)}</a></li>`)}</ul></div>
        <div class="way"><span class="way__icon">${icon('calendar')}</span><h3 class="serif">En ligne</h3>
          <p>Choisissez votre créneau, 24h/24, dans le centre de votre choix.</p>
          <ul>${site.centres.map((c) => html`<li><a class="text-link" href="${esc(c.booking)}" target="_blank" rel="noopener"><span>${esc(c.name)}</span><span class="arrow">${icon('arrow')}</span></a></li>`)}</ul></div>
        <div class="way"><span class="way__icon">${icon('whatsapp')}</span><h3 class="serif">En étant rappelé·e</h3>
          <p>Remplissez le formulaire et nous vous rappelons aux horaires d’ouverture, ou écrivez-nous sur WhatsApp.</p>
          <div class="btn-row">${btn('Être rappelé·e', '/rendez-vous/#rappel', { variant: 'ghost', cls: 'btn--sm' })}${btn('WhatsApp', waHref(), { variant: 'ghost', cls: 'btn--sm', icon: 'whatsapp' })}</div></div>
      </div>
    </div>
  </section>
  ${ctaSection({ secondary: ['Nos centres', '/centres/'] })}
  `;
  return { title: d.seoTitle, description: d.seoDescription, body, schema: crumbsSchema([['Diagnostic', '/diagnostic/']]), ogImage: 'image-site-diag-de-peau' };
}

// ---------------------------------------------------------------------------
export function results(extra = []) {
  const r = pages.results;
  const all = [...r.featured.map((x) => ({ ...x, featured: true })), ...extra];
  const groups = [['tous', 'Tous'], ['visage', 'Visage'], ['corps', 'Corps'], ['epilation', 'Épilation']];
  const catOf = (href = '') => {
    const s = soins.find((x) => href.includes(`/soins/${x.slug}/`));
    if (s) return s.category === 'cheveux' ? 'visage' : s.category;
    if (/silhouette/.test(href)) return 'corps';
    if (/pilosite/.test(href)) return 'epilation';
    return 'visage';
  };
  const body = html`
  ${pageHero({ eyebrow: r.eyebrow, title: r.title, raw: true, intro: [r.lead, r.text], crumbs: [['Résultats', '/resultats/']], cls: 'page-hero--center' })}
  <section class="section section--tight results">
    <div class="wrap">
      <div class="filters" role="tablist" data-filters>
        ${groups.map(([k, l], i) => `<button type="button" role="tab" class="filter ${i ? '' : 'is-active'}" data-filter="${k}" aria-selected="${i ? 'false' : 'true'}">${l}</button>`).join('')}
      </div>
      <div class="results-grid" data-results>
        ${all.map((x) => html`<a class="result ${x.featured ? 'result--featured' : ''}" href="${x.href}" data-cat="${catOf(x.href)}" data-cursor="Le soin">
          <div class="media media--square">${picture(x.image, { alt: `Avant / après ${x.label} au Centre Thetys`, sizes: '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw' })}</div>
          <span class="result__label"><span>${esc(x.label)}</span><span class="result__cta">Découvrir le soin ${icon('arrowUpRight')}</span></span>
        </a>`)}
      </div>
      <p class="note mt-m center">${esc(r.note)}</p>
    </div>
  </section>
  ${ctaSection({ title: r.cta.title, text: r.cta.text, raw: true })}
  `;
  return { title: r.seoTitle, description: r.seoDescription, body, schema: crumbsSchema([['Résultats', '/resultats/']]), ogImage: r.featured[0].image };
}

// ---------------------------------------------------------------------------
export function cosmetics() {
  const c = pages.cosmetics;
  const body = html`
  ${pageHero({ eyebrow: c.eyebrow, title: c.title, raw: true, intro: c.intro, crumbs: [['Cosmétiques', '/cosmetiques/']], cls: 'page-hero--center' })}
  <div class="brands-logos" data-stagger>
    <div class="wrap brands-logos__inner">${c.brands.map((b) => `<div class="brands-logos__item">${picture(b.logo, { alt: b.name, sizes: '200px' })}</div>`).join('')}</div>
  </div>
  ${c.brands.map((b, k) => html`<section class="section ${k % 2 ? 'section--white' : ''}">
    <div class="wrap split ${k % 2 ? 'split--reverse' : ''}">
      <div class="brand-media ${b.images.length > 1 ? 'brand-media--duo' : ''}" data-stagger>
        ${b.images.map((id) => `<div class="media media--portrait">${picture(id, { alt: '', sizes: '(max-width: 900px) 50vw, 25vw' })}</div>`).join('')}
      </div>
      <div>
        <p class="eyebrow" data-reveal>0${k + 1}${b.badge ? ` · ${esc(b.badge)}` : ''}</p>
        <h2 class="h2" data-split>${esc(b.name)}</h2>
        <p class="lead mt-s" data-reveal>${esc(b.text)}</p>
        ${b.href ? `<div class="mt-m" data-reveal><a class="text-link" href="${b.href}"><span>En savoir plus</span><span class="arrow">${icon('arrow')}</span></a></div>` : ''}
      </div>
    </div>
  </section>`)}
  ${ctaSection({ eyebrow: 'Une suggestion ?', title: c.more, text: 'Écrivez-nous ou parlez-en lors de votre prochain rendez-vous : nous sommes à l’écoute de toutes vos remarques et suggestions.', primary: ['Nous contacter', '/rendez-vous/#rappel'], secondary: ['Nos centres', '/centres/'] })}
  `;
  return { title: c.seoTitle, description: c.seoDescription, body, schema: crumbsSchema([['Cosmétiques', '/cosmetiques/']]), ogImage: c.brands[1].images[0] };
}

// ---------------------------------------------------------------------------
export function giftcard() {
  const g = pages.giftcard;
  const body = html`
  <section class="page-hero gift-hero" data-hero>
    <div class="wrap page-hero__grid">
      <div class="page-hero__text">
        ${crumbs([['Carte cadeau', '/carte-cadeau/']])}
        ${eyebrow(g.eyebrow)}
        <h1 class="h-display" data-split data-split-hero>${g.title}</h1>
        <p class="lead page-hero__intro" data-reveal>${esc(g.intro)}</p>
        <div class="btn-row page-hero__actions" data-reveal>
          ${btn('Offrir une carte cadeau', site.giftCardUrl, { variant: 'gold', icon: 'gift' })}
          ${btn('Acheter en centre', '/centres/', { variant: 'ghost' })}
        </div>
      </div>
      <div class="gift-card-3d" data-tilt>
        <div class="gift-card-3d__card">
          ${markSvg({ cls: 'gift-card-3d__mark' })}
          <span class="gift-card-3d__label">Carte cadeau</span>
          <span class="gift-card-3d__name serif">Centre <em>Thetys</em></span>
          <span class="gift-card-3d__meta">Antibes · Cannes Le Cannet · Pégomas</span>
          <i class="gift-card-3d__shine"></i>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'Choisissez votre soin', title: 'Un soin, ou <em>un montant libre.</em>', raw: true, split: true, lead: g.lead })}
      <div class="gift-options" data-stagger>
        ${g.options.map((o) => html`<article class="gift-option">
          <div class="media media--wide">${picture(o.image, { alt: '', sizes: '(max-width: 900px) 100vw, 33vw' })}</div>
          <div class="gift-option__body">
            <h3 class="serif">${esc(o.title)}</h3>
            <p class="muted">${esc(o.text)}</p>
            ${o.prices.length ? `<ul class="price-list">${o.prices.map((p) => `<li><span>${esc(p.label)}</span><strong>${esc(p.price)}</strong></li>`).join('')}</ul>` : '<p class="gift-option__free serif">Le montant de votre choix</p>'}
          </div>
        </article>`)}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      ${sHead({ eyebrow: 'Les technologies', title: g.treatmentsTitle, split: true, lead: g.pricesNote })}
      <div class="gift-treatments" data-stagger>
        ${g.treatments.map((t) => html`<article class="gift-treatment">
          <div class="gift-treatment__head"><h3 class="serif"><a href="/soins/${t.slug}/">${esc(t.name)}</a></h3><p>${esc(t.tagline)}</p></div>
          <ul class="price-list">${t.prices.map((p) => `<li><span>${esc(p.label)}</span><strong>${esc(p.price)}</strong></li>`).join('')}</ul>
          <ul class="checks">${t.checks.map((c) => `<li>${icon('check')}${esc(c)}</li>`).join('')}</ul>
        </article>`)}
      </div>
    </div>
  </section>
  <section class="section section--dark">
    <div class="wrap split split--top">
      <div>
        ${eyebrow('La carte cadeau Centre Thetys')}
        <h2 class="h2" data-split>Le cadeau idéal <em>pour toutes les occasions.</em></h2>
        <div class="rich mt-s" data-reveal>${paras(g.details.paragraphs)}</div>
        <p class="gift-warning mt-m" data-reveal><strong>À lire attentivement :</strong> ${esc(g.details.warning)}</p>
      </div>
      <div class="facts" data-stagger>
        ${g.details.facts.map((f) => html`<div class="fact"><span class="fact__value serif">${esc(f.value)}</span><span class="fact__label">${esc(f.label)}</span></div>`)}
      </div>
    </div>
  </section>
  ${faqSection({ title: 'Questions fréquentes.', items: g.faq.map((f) => (/catalogue/.test(f.a) ? { ...f, a: f.a.replace('notre catalogue', `[notre catalogue](${site.catalogueUrl})`) } : f)) })}
  ${ctaSection({ eyebrow: 'Pour offrir', title: 'Offrez une parenthèse <em>Thetys.</em>', raw: true, text: 'Valable un an, dans le centre de votre choix, sur tous nos soins et nos gammes cosmétiques.', image: 'carte-cadeau-thetys-1', primary: ['Offrir une carte cadeau', site.giftCardUrl], secondary: ['Prendre rendez-vous', '/rendez-vous/'] })}
  `;
  return { title: g.seoTitle, description: g.seoDescription, body, schema: [...faqSchema(g.faq), ...crumbsSchema([['Carte cadeau', '/carte-cadeau/']])], ogImage: g.image };
}

// ---------------------------------------------------------------------------
export function booking() {
  const b = pages.booking;
  const body = html`
  ${pageHero({ eyebrow: b.eyebrow, title: b.title, raw: true, intro: b.intro, crumbs: [['Rendez-vous', '/rendez-vous/']], cls: 'page-hero--center' })}
  <section class="section section--tight">
    <div class="wrap">
      <div class="book-grid" data-stagger>
        ${site.centres.map((c) => html`<article class="book-card">
          <div class="media media--wide">${picture(c.image, { alt: '', sizes: '(max-width: 900px) 100vw, 33vw' })}</div>
          <div class="book-card__body">
            <p class="card__meta">Centre Thetys</p>
            <h2 class="book-card__title serif">${esc(c.name)}</h2>
            <ul class="centre-card__info">
              <li>${icon('pin')}<span>${esc(c.street)}, ${esc(c.postcode)} ${esc(c.city)}</span></li>
              <li>${icon('phone')}<a href="${telHref(c.tel)}">${esc(c.phone)}</a></li>
              <li>${icon('mail')}<a href="mailto:${c.email}">${esc(c.email)}</a></li>
              <li>${icon('clock')}<span>${esc(c.hours)}<br><small>${esc(c.hoursNote)}</small></span></li>
              <li>${icon('car')}<span>${esc(c.parkingTitle)}</span></li>
            </ul>
            <div class="btn-row">
              ${btn('Prendre rendez-vous', c.booking, { variant: 'gold' })}
              <a class="text-link" href="${esc(c.maps)}" target="_blank" rel="noopener"><span>Itinéraire</span><span class="arrow">${icon('arrow')}</span></a>
            </div>
          </div>
        </article>`)}
      </div>
    </div>
  </section>
  <section class="section section--white" id="rappel">
    <div class="wrap split split--top">
      <div>
        ${eyebrow('Être rappelé·e')}
        <h2 class="h2" data-split>${esc(b.formTitle)}</h2>
        <p class="lead mt-s" data-reveal>${esc(b.formText)}</p>
        <div class="contact-alt mt-m" data-reveal>
          <a class="contact-alt__item" href="${waHref()}" target="_blank" rel="noopener">${icon('whatsapp')}<span><strong>WhatsApp</strong>${esc(site.whatsappLabel)}</span></a>
          <a class="contact-alt__item" href="mailto:${site.email}">${icon('mail')}<span><strong>E-mail</strong>${esc(site.email)}</span></a>
        </div>
      </div>
      <form class="contact-form" data-contact-form action="/api/contact" method="post" novalidate>
        <div class="form-grid">
          <div class="field"><label for="c-prenom">Prénom *</label><input class="input" id="c-prenom" name="prenom" autocomplete="given-name" required></div>
          <div class="field"><label for="c-nom">Nom *</label><input class="input" id="c-nom" name="nom" autocomplete="family-name" required></div>
          <div class="field"><label for="c-tel">Téléphone *</label><input class="input" id="c-tel" name="telephone" type="tel" autocomplete="tel" required></div>
          <div class="field"><label for="c-mail">Adresse e-mail *</label><input class="input" id="c-mail" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="c-centre">Centre *</label><select class="select" id="c-centre" name="centre" required><option value="">Sélectionnez le centre…</option>${site.centres.map((c) => `<option>${esc(c.name)}</option>`).join('')}</select></div>
          <div class="field"><label for="c-objet">Objet</label><select class="select" id="c-objet" name="objet">${b.subjects.map((s) => `<option>${esc(s)}</option>`).join('')}</select></div>
          <div class="field"><label for="c-solution">Solution concernée</label><select class="select" id="c-solution" name="solution"><option value="">Je ne sais pas encore</option>${soins.map((s) => `<option>${esc(s.name)}</option>`).join('')}</select></div>
          <div class="field"><label for="c-quand">Quand souhaitez-vous être rappelé·e ?</label><select class="select" id="c-quand" name="rappel">${b.callback.map((s) => `<option>${esc(s)}</option>`).join('')}</select></div>
          <div class="field full"><label for="c-msg">Message</label><textarea class="textarea" id="c-msg" name="message" rows="4"></textarea></div>
          <div class="hp" aria-hidden="true"><label for="c-site">Site web</label><input id="c-site" name="site" tabindex="-1" autocomplete="off"></div>
          <label class="check full"><input type="checkbox" name="rgpd" required><span>J’accepte que mes informations soient utilisées pour être recontacté·e, conformément à la <a class="link-u" href="/confidentialite/">politique de confidentialité</a>.</span></label>
        </div>
        <p class="form-msg" data-form-msg hidden></p>
        <div class="btn-row mt-s"><button class="btn btn--gold" type="submit"><span class="btn__label"><span data-text="Envoyer le message">Envoyer le message</span></span></button></div>
      </form>
    </div>
  </section>
  <section class="section section--sand">
    <div class="wrap">
      ${sHead({ eyebrow: 'Votre premier rendez-vous', title: 'Comment ça se passe, <em>concrètement.</em>', raw: true, split: true })}
      ${stepsBlock([
        { title: 'Réservez votre bilan', text: 'En ligne, par téléphone ou directement au centre : choisissez le créneau qui vous arrange, du lundi au samedi.' },
        { title: 'Le diagnostic · 30 min', text: 'Analyse de votre problématique, de vos objectifs et de votre peau. C’est offert et sans engagement.' },
        { title: 'Votre protocole', text: 'Nous composons votre plan personnalisé : technologies, nombre de séances, calendrier et devis clair, avec paiement en 4 fois sans frais.' },
        { title: 'Le suivi', text: 'Votre praticienne suit vos résultats séance après séance et ajuste le protocole si nécessaire, jusqu’à votre objectif.' },
      ])}
    </div>
  </section>
  `;
  return { title: b.seoTitle, description: b.seoDescription, body, schema: crumbsSchema([['Rendez-vous', '/rendez-vous/']]), ogImage: 'accueil-antibes3' };
}

// ---------------------------------------------------------------------------
export function recruitment() {
  const r = pages.recruitment;
  const body = html`
  ${pageHero({ eyebrow: r.eyebrow, title: r.title, raw: true, intro: r.intro, crumbs: [['Recrutement', '/recrutement/']], image: 'centre-thetys-pegomas', imageAlt: 'Le Centre Thetys de Pégomas' })}
  <section class="section section--dark">
    <div class="wrap wrap--narrow center">
      <p class="eyebrow eyebrow--center" data-reveal>${esc(r.question)}</p>
      <h2 class="h-display" data-split>${r.job.title}</h2>
      <p class="lead mt-m" data-reveal>${esc(r.job.text)}</p>
      <p class="mt-m" data-reveal>${esc(r.job.apply)} <a class="link-u gold" href="mailto:${site.email}?subject=${encodeURIComponent('Candidature Centre Thetys')}">${esc(site.email)}</a></p>
      <div class="btn-row btn-row--center mt-m" data-reveal>${btn('Envoyer ma candidature', `mailto:${site.email}?subject=${encodeURIComponent('Candidature Centre Thetys')}`, { variant: 'gold', icon: 'mail' })}</div>
    </div>
  </section>
  ${centresSection({ eyebrow: 'Nos trois centres', title: 'Trois centres, <em>une même équipe.</em>' })}
  `;
  return { title: r.seoTitle, description: r.seoDescription, body, schema: crumbsSchema([['Recrutement', '/recrutement/']]) };
}

// ---------------------------------------------------------------------------
export function offersIndex() {
  const ix = offres.index;
  const body = html`
  ${pageHero({ eyebrow: ix.eyebrow, title: ix.title, raw: true, intro: ix.intro, crumbs: [['Offres', '/offres/']], cls: 'page-hero--center' })}
  <section class="section section--tight">
    <div class="wrap offers-grid" data-stagger>
      ${offres.items.map((o) => html`<a class="offer-card" href="/offres/${o.slug}/" data-until="${o.until || ''}" data-cursor="Découvrir">
        <div class="media media--wide">${picture(o.image, { alt: '', sizes: '(max-width: 900px) 100vw, 50vw' })}<span class="media__tag">${esc(o.dates)}</span></div>
        <div class="offer-card__body">
          <h2 class="serif">${o.title}</h2>
          <p class="muted">${esc(o.card)}</p>
          <span class="offer-card__ended">Offre terminée</span>
          <span class="text-link"><span>Découvrir l’offre</span><span class="arrow">${icon('arrow')}</span></span>
        </div>
      </a>`)}
    </div>
  </section>
  ${ctaSection({})}
  `;
  return { title: ix.seoTitle, description: ix.seoDescription, body, schema: crumbsSchema([['Offres', '/offres/']]) };
}

export function offerPage(o) {
  const path = `/offres/${o.slug}/`;
  const cr = [['Offres', '/offres/'], [o.slug === 'black-friday' ? 'Black Friday' : 'Épilation laser Pégomas', path]];
  const booking = o.booking || '/rendez-vous/';
  const figures = html`<div class="offer-figures" data-stagger>${o.figures.map((f) => html`<div class="offer-figure"><span>${esc(f.label)}</span><strong class="serif">${esc(f.value)}</strong></div>`)}</div>`;
  const parts = [];
  if (o.universes) {
    parts.push(html`<section class="section section--white">
      <div class="wrap">
        ${sHead({ eyebrow: o.universes.eyebrow, title: o.universes.title, raw: true, split: true, lead: o.universes.text })}
        <div class="universes" data-stagger>
          ${o.universes.items.map((u) => html`<article class="universe">
            <div class="media media--wide">${picture(u.image, { alt: '', sizes: '(max-width: 900px) 100vw, 50vw' })}</div>
            <div class="universe__body">
              <p class="card__meta">${esc(u.num)}</p>
              <p class="universe__value"><span>${esc(u.label)}</span> <strong class="serif">${esc(u.value)}</strong></p>
              <p class="muted">${esc(u.sub)}</p>
              <p>${esc(u.text)}</p>
              <ul class="checks">${u.list.map((l) => `<li>${icon('check')}${esc(l)}</li>`).join('')}</ul>
              ${btn(u.cta, u.href, { variant: 'gold' })}
            </div>
          </article>`)}
        </div>
      </div>
    </section>`);
  }
  if (o.offer) {
    parts.push(html`<section class="section section--white">
      <div class="wrap split split--top">
        <div>
          ${eyebrow(o.offer.eyebrow)}
          <h2 class="h2" data-split>${o.offer.title}</h2>
          <p class="lead mt-s" data-reveal>${esc(o.offer.text)}</p>
          <p class="mt-s" data-reveal>${esc(o.offer.detail)}</p>
          <ul class="checklist mt-s" data-stagger>${o.offer.list.map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}</ul>
        </div>
        <div class="offer-example" data-reveal>
          <h3 class="serif">${esc(o.offer.example.title)}</h3>
          <ul class="price-list">${o.offer.example.rows.map(([a, b]) => `<li><span>${esc(a)}</span><strong>${esc(b)}</strong></li>`).join('')}</ul>
          <p class="small muted">${esc(o.offer.example.note)}</p>
          ${btn('Je réserve mon diagnostic offert', booking, { variant: 'gold' })}
        </div>
      </div>
    </section>`);
  }
  if (o.zones) {
    parts.push(html`<section class="section">
      <div class="wrap">
        ${sHead({ eyebrow: o.zones.eyebrow, title: o.zones.title, raw: true, split: true, lead: o.zones.text })}
        <ul class="zones" data-stagger>${o.zones.items.map((z) => `<li><span class="zones__mark">${icon('spark')}</span><strong class="serif">${esc(z.name)}</strong><span>${esc(z.size)}</span></li>`).join('')}</ul>
      </div>
    </section>`);
  }
  if (o.proof) {
    parts.push(html`<section class="section section--sand">
      <div class="wrap split">
        <div>${eyebrow(o.proof.eyebrow)}<h2 class="h2" data-split>${o.proof.title}</h2><p class="lead mt-s" data-reveal>${esc(o.proof.text)}</p><p class="note mt-s">${esc(o.proof.note)}</p></div>
        <div class="duo" data-stagger>
          ${[o.proof.before, o.proof.after].map((x) => html`<figure><div class="media media--portrait">${picture(x.image, { alt: x.alt, sizes: '(max-width: 900px) 50vw, 25vw' })}</div><figcaption class="small mt-s">${x.caption}</figcaption></figure>`)}
        </div>
      </div>
    </section>`);
  }
  if (o.steps) {
    parts.push(html`<section class="section ${o.proof ? '' : 'section--sand'}">
      <div class="wrap">${sHead({ eyebrow: o.steps.eyebrow, title: o.steps.title, raw: true, split: true, lead: o.steps.text })}${stepsBlock(o.steps.items)}</div>
    </section>`);
  }
  if (o.trust) {
    parts.push(html`<section class="section section--dark">
      <div class="wrap">
        ${sHead({ eyebrow: o.trust.eyebrow, title: o.trust.title, raw: true, split: true })}
        <div class="facts facts--4" data-stagger>${o.trust.items.map((f) => html`<div class="fact"><span class="fact__value serif">${esc(f.value)}</span><strong>${esc(f.title)}</strong><span class="fact__label">${esc(f.text)}</span></div>`)}</div>
      </div>
    </section>`);
  }
  if (o.conditions) {
    parts.push(html`<section class="section section--dark">
      <div class="wrap split split--top">
        <div>${eyebrow(o.conditions.eyebrow)}<h2 class="h2" data-split>${o.conditions.title}</h2></div>
        <div>
          <ul class="checklist checklist--light" data-stagger>${o.conditions.list.map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}</ul>
          <p class="small muted mt-m">${esc(o.conditions.legal)}</p>
        </div>
      </div>
    </section>`);
    parts.push(html`<section class="section section--sand">
      <div class="wrap">
        ${sHead({ eyebrow: 'Elles en parlent', title: 'Ce que disent <em>nos clientes.</em>', raw: true, split: true, lead: 'Avis Google sur nos centres.' })}
        <div class="reviews" data-stagger>${site.reviews.map(reviewCard)}</div>
      </div>
    </section>`);
  }
  if (o.experts) {
    parts.push(html`<section class="section section--white">
      <div class="wrap split">
        <div>${eyebrow(o.experts.eyebrow)}<h2 class="h2" data-split>${o.experts.title}</h2><p class="lead mt-s" data-reveal>${esc(o.experts.text)}</p></div>
        <div class="duo" data-stagger>${o.experts.people.map((p) => html`<figure class="person"><div class="media media--portrait">${picture(p.image, { alt: p.alt, sizes: '(max-width: 900px) 50vw, 25vw' })}</div><figcaption><strong class="serif">${esc(p.name)}</strong><span>${esc(p.role)}</span></figcaption></figure>`)}</div>
      </div>
    </section>`);
  }
  const body = html`
  <section class="page-hero offer-hero" data-hero data-until="${o.until || ''}">
    <div class="wrap page-hero__grid">
      <div class="page-hero__text">
        ${crumbs(cr)}
        <p class="eyebrow" data-reveal>${esc(o.eyebrow)}</p>
        <h1 class="h-display" data-split data-split-hero>${o.title}</h1>
        <p class="offer-hero__dates" data-reveal>${esc(o.dates)}</p>
        <p class="lead page-hero__intro" data-reveal>${o.intro}</p>
        ${figures}
        <div class="btn-row page-hero__actions" data-reveal>
          ${btn('Je réserve mon diagnostic offert', booking, { variant: 'gold' })}
          ${o.slug === 'epilation-laser-pegomas' ? btn('04 93 66 21 89', 'tel:+33493662189', { variant: 'ghost', icon: 'phone' }) : btn('Voir nos trois centres', '/centres/', { variant: 'ghost' })}
        </div>
        <ul class="hero-checks" data-reveal>${o.checks.map((c) => `<li>${icon('check')}<span>${c}</span></li>`).join('')}</ul>
      </div>
      <div class="page-hero__media"><div class="media media--tall" data-hero-media>${picture(o.image, { alt: '', sizes: '(max-width: 900px) 100vw, 45vw', priority: true })}</div></div>
    </div>
    <p class="wrap offer-ended" data-offer-ended hidden>Cette offre est terminée. Retrouvez nos <a class="link-u" href="/offres/">offres du moment</a>.</p>
  </section>
  ${parts}
  ${faqSection({ title: 'Questions fréquentes.', items: o.faq })}
  ${o.slug === 'black-friday' ? centresSection({ eyebrow: 'Nos centres', title: 'Trois adresses <em>sur la Côte d’Azur.</em>', lead: 'Les mêmes conditions Black Friday dans chacun de nos centres.' }) : centreBlock()}
  ${ctaSection({ title: o.cta.title, text: o.cta.text, raw: true, primary: ['Je réserve mon diagnostic offert', booking], secondary: o.slug === 'epilation-laser-pegomas' ? ['Appeler le 04 93 66 21 89', 'tel:+33493662189'] : ['Nos centres', '/centres/'] })}
  ${o.legal ? `<p class="wrap disclaimer">${esc(o.legal)}</p>` : ''}
  `;
  return { title: o.seoTitle, description: o.seoDescription, body, schema: [...faqSchema(o.faq), ...crumbsSchema(cr)], ogImage: o.image };
}

function centreBlock() {
  const c = site.centres.find((x) => x.slug === 'pegomas');
  return html`<section class="section section--white">
    <div class="wrap">
      ${sHead({ eyebrow: 'Réserver maintenant', title: 'Centre Thetys <em>Pégomas</em>', raw: true, split: true, lead: 'À 15 minutes de Cannes, de Grasse et de Mandelieu-la-Napoule, dans une ambiance détendue de l’arrière-pays. Nous accueillons les habitantes de Pégomas, Mandelieu-la-Napoule, Auribeau-sur-Siagne, La Roquette-sur-Siagne, Mouans-Sartoux et Grasse.' })}
      <div class="centres-grid centres-grid--1">${centreCard(c)}</div>
    </div>
  </section>`;
}

// ---------------------------------------------------------------------------
export function legalPage(key) {
  const map = {
    'mentions-legales': { path: '/mentions-legales/', title: 'Mentions légales', crumb: 'Mentions légales' },
    cgv: { path: '/cgv/', title: 'Conditions générales de vente', crumb: 'CGV' },
  };
  const m = map[key];
  const L = legal[key];
  let content = L.html;
  if (key === 'mentions-legales') {
    content = content
      .replace('Le site utilise les technologies WordPress, html5, Php, et JavaScript.', 'Le site utilise les technologies HTML5, CSS et JavaScript.')
      .replace(/Le site https:\/\/centrethetys\.fr\/ est hébergé chez un prestataire sur le territoire de l’Union Européenne/, 'Le site https://centrethetys.fr/ est hébergé par Cloudflare, Inc. (101 Townsend Street, San Francisco, CA 94107, États-Unis)');
    const intro = `<h3>Conception, développement et hébergement</h3><p>Conception et développement du site : <a href="${site.credit.url}">${esc(site.credit.name)}</a>.</p><p>Hébergement : Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis — <a href="https://www.cloudflare.com/fr-fr/">cloudflare.com</a>.</p>`;
    content = content.replace(/(<h3>2\.)/, `${intro}$1`);
  }
  content = content.replace(/href="([^"]+)"/g, (_, u) => `href="${esc(mapUrl(u.replace(/&amp;/g, '&')))}"`);
  const body = html`
  <section class="page-hero page-hero--legal" data-hero>
    <div class="wrap wrap--text">
      ${crumbs([[m.crumb, m.path]])}
      <h1 class="h-display" data-split data-split-hero>${esc(m.title)}</h1>
    </div>
  </section>
  <section class="section section--tight">
    <div class="wrap wrap--text"><div class="prose">${content}</div></div>
  </section>`;
  return { path: m.path, title: m.title, description: L.description, body, schema: crumbsSchema([[m.crumb, m.path]]) };
}

export function privacy() {
  const body = html`
  <section class="page-hero page-hero--legal" data-hero>
    <div class="wrap wrap--text">
      ${crumbs([['Confidentialité', '/confidentialite/']])}
      <h1 class="h-display" data-split data-split-hero>Confidentialité <em>& cookies</em></h1>
    </div>
  </section>
  <section class="section section--tight">
    <div class="wrap wrap--text"><div class="prose">
      <h2>Aucun cookie de suivi</h2>
      <p>Ce site n’utilise aucun cookie publicitaire, aucun cookie de réseau social et aucun outil de mesure d’audience. Aucun bandeau de consentement n’est donc nécessaire.</p>
      <p>Pour votre confort, deux informations purement techniques sont conservées dans votre navigateur : le fait que l’animation d’ouverture a déjà été jouée pendant votre visite, et la fermeture éventuelle du bandeau d’annonce. Elles ne permettent pas de vous identifier et ne sont jamais transmises.</p>
      <h2>Polices, images et vidéos</h2>
      <p>Les polices de caractères, les images et les vidéos sont hébergées directement sur ce site : votre navigation ne fait appel à aucune plateforme tierce.</p>
      <h2>Les informations que vous nous confiez</h2>
      <p>Le diagnostic en ligne et le formulaire « Être rappelé·e » vous permettent de nous transmettre votre prénom, votre nom, votre numéro de téléphone, votre adresse e-mail, le centre choisi, vos réponses et votre message. Ces informations servent uniquement à vous recontacter au sujet de votre demande et, lorsque vous le demandez, à vous adresser votre plan beauté par WhatsApp.</p>
      <p>Elles sont conservées pendant une période maximale de 12 mois et ne sont jamais vendues, louées ou cédées à des tiers.</p>
      <h2>Services externes</h2>
      <p>La réservation en ligne s’effectue sur la plateforme Fresha, l’achat de la carte cadeau sur notre boutique en ligne et les échanges WhatsApp via l’application WhatsApp. Lorsque vous utilisez ces services, leur propre politique de confidentialité s’applique.</p>
      <h2>Vos droits</h2>
      <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation et d’opposition sur vos données. Pour les exercer, écrivez-nous à <a href="mailto:${site.email}">${esc(site.email)}</a>. Vous pouvez également adresser une réclamation à la CNIL (<a href="https://www.cnil.fr/fr/plaintes">cnil.fr</a>).</p>
      <h2>Responsable du traitement</h2>
      <p>Centre Thetys, 18 place du Logis, 06580 Pégomas, représenté par son gérant, M. Alexandre Vial. Retrouvez l’ensemble des informations légales dans nos <a href="/mentions-legales/">mentions légales</a>.</p>
    </div></div>
  </section>`;
  return {
    title: 'Confidentialité et cookies',
    description: 'Politique de confidentialité du site du Centre Thetys : aucun cookie de suivi, utilisation de vos données et vos droits.',
    body,
    schema: crumbsSchema([['Confidentialité', '/confidentialite/']]),
  };
}

export function notFound() {
  const body = html`
  <section class="notfound" data-hero>
    <div class="wrap center">
      ${markSvg({ cls: 'notfound__mark' })}
      <p class="eyebrow eyebrow--center" data-reveal>Erreur 404</p>
      <h1 class="h-display" data-split data-split-hero>Cette page s’est <em>évaporée.</em></h1>
      <p class="lead mt-s" data-reveal>La page que vous cherchez n’existe pas ou a changé d’adresse. Le reste du site, lui, vous attend.</p>
      <div class="btn-row btn-row--center mt-m" data-reveal>${btn('Retour à l’accueil', '/', { variant: 'gold' })}${btn('Nos soins', '/soins/', { variant: 'ghost' })}${btn('Nos centres', '/centres/', { variant: 'ghost' })}</div>
    </div>
  </section>`;
  return { title: 'Page introuvable', description: 'Cette page n’existe pas.', body, noindex: true };
}
