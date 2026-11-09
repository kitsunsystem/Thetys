// Auto-diagnostic : 3 questions, coordonnées, plan recommandé envoyé sur WhatsApp.
import gsap from 'gsap';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initQuiz(app) {
  const box = $('[data-quiz]');
  if (!box) return;
  const data = JSON.parse($('[data-quiz-data]', box).textContent);
  const el = {
    bar: $('[data-quiz-bar]', box), step: $('[data-quiz-step]', box), back: $('[data-quiz-back]', box),
    title: $('[data-quiz-title]', box), sub: $('[data-quiz-sub]', box), opts: $('[data-quiz-options]', box),
    cap: $('[data-screen="cap"]', box), err: $('[data-quiz-error]', box), name: $('[data-quiz-name]', box),
    plan: $('[data-quiz-plan]', box), bubble: $('[data-quiz-bubble]', box), finSub: $('[data-quiz-fin-sub]', box),
    note: $('[data-quiz-note]', box), actions: $('[data-quiz-actions]', box),
  };
  let pile = [];
  let parcours = [];
  let res = null;

  const show = (name) => {
    const cur = $('.quiz__screen.is-active', box);
    const next = $(`[data-screen="${name}"]`, box);
    if (cur !== next) {
      cur?.classList.remove('is-active');
      next.classList.add('is-active');
    }
    if (!app.reduce) gsap.fromTo(next.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05 });
    el.back.hidden = name === 'fin' || pile.length <= 1 && name === 'q' && !parcours.length;
  };
  const progress = (p, label) => { el.bar.style.width = `${p}%`; el.step.textContent = label || ''; };

  function question(key) {
    const q = data.tree[key];
    pile.push(key);
    progress(Math.min(22 * pile.length, 66), `Question ${pile.length} sur 3`);
    el.title.textContent = q.t;
    el.sub.textContent = q.s || '';
    el.opts.innerHTML = '';
    el.opts.classList.toggle('is-list', q.o.length > 4);
    for (const o of q.o) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tile';
      b.innerHTML = `<span>${escapeHtml(o.l)}</span>${o.s ? `<small>${escapeHtml(o.s)}</small>` : ''}`;
      b.addEventListener('click', () => {
        parcours.push(o.l);
        if (o.r) { res = o.r; progress(85, 'Dernière étape'); show('cap'); $('#q-prenom', box)?.focus({ preventScroll: true }); }
        else question(o.n);
      });
      el.opts.appendChild(b);
    }
    show('q');
  }

  function start(pre) {
    pile = []; parcours = []; res = null;
    if (pre === 'visage') { parcours = ['Visage']; question('zoneVisage'); }
    else if (pre === 'corps') { parcours = ['Corps']; question('zoneCorps'); }
    else question('besoin');
  }

  el.back.addEventListener('click', () => {
    if ($('[data-screen="cap"]', box).classList.contains('is-active')) {
      parcours.pop();
      const c = pile.pop();
      question(c);
      return;
    }
    parcours.pop();
    pile.pop();
    if (!pile.length) start();
    else question(pile.pop());
  });

  const err = (m) => { el.err.hidden = !m; el.err.textContent = m || ''; };

  el.cap.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = el.cap;
    const prenom = f.prenom.value.trim();
    const brut = f.tel.value.replace(/[^0-9+]/g, '');
    const tel = brut.replace(/^\+?33/, '0');
    if (!prenom) return err('Indiquez votre prénom.');
    const okTel = /^0[67][0-9]{8}$/.test(tel) && tel !== '0612345678' && !/^0([0-9])\1{8}$/.test(tel);
    if (!okTel) return err('Votre plan arrive par WhatsApp : il nous faut un numéro de mobile valide, commençant par 06 ou 07.');
    if (!f.rgpd.checked) return err('Merci de cocher la case de consentement pour recevoir votre plan.');
    err('');
    const cv = f.centre.value;
    const centre = data.centres.find((c) => c.value === cv) || data.centres[0];
    const pj = prenom.charAt(0).toUpperCase() + prenom.slice(1);
    const dj = new Date(); dj.setDate(dj.getDate() + 1);
    const wd = dj.getDay();
    const quand = (wd === 0 || (wd === 6 && cv.includes('Antibes'))) ? 'lundi' : `demain ${JOURS[wd]}`;
    const keys = [res.p, ...res.a];
    const soins = keys.map((k) => data.soins[k]).filter(Boolean);
    const priorite = parcours[parcours.length - 1];

    // plan à l'écran
    el.name.textContent = pj;
    el.plan.innerHTML = soins.map((s, i) => `<a class="plan-item ${i ? '' : 'plan-item--main'}" href="/soins/${s.slug}/">
      ${s.img ? `<img src="${s.img}" alt="" loading="lazy">` : '<span></span>'}
      <span><small>${i ? 'En complément' : 'Pour commencer'}</small><strong>${escapeHtml(s.label)}</strong><p>${escapeHtml(s.card)}</p></span>
      <span aria-hidden="true">→</span></a>`).join('');
    const msg = `Bonjour ${escapeHtml(pj)}, ici l’équipe du Centre Thetys 🤍<br><br>Merci pour votre diagnostic en ligne ! Pour votre priorité <b>${escapeHtml(priorite.toLowerCase())}</b>, voici le plan que nos expertes recommandent :<br><br>1. <b>${escapeHtml(soins[0].label)}</b>, la solution idéale pour commencer<br>2. En complément : ${escapeHtml(soins[1]?.label || '')}${soins[2] ? ` ou ${escapeHtml(soins[2].label)}` : ''}<br><br>La prochaine étape est simple : un bilan de 30 minutes, offert et sans engagement, dans notre centre ${escapeHtml(cv.replace('Centre ', ''))}. Je vous propose un créneau ${quand}, cela vous conviendrait ?`;
    const now = new Date();
    el.bubble.innerHTML = `${msg}<span class="heure">${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}</span>`;

    const payload = {
      prenom: pj, tel, email: f.email.value.trim(), centre: cv, contact_prefere: f.contact.value, moment: f.moment.value,
      parcours: parcours.join(' > '), priorite, cle: res.c || '', soin_principal: soins[0]?.label || '',
      complement_1: soins[1]?.label || '', complement_2: soins[2]?.label || '', quand, lang: 'fr',
    };
    if (data.webhook) {
      try {
        fetch(data.webhook, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(payload).toString() });
      } catch {}
    } else {
      el.finSub.textContent = 'Voici le plan que nos expertes recommandent pour vous :';
      el.note.textContent = 'Envoyez-le à votre centre sur WhatsApp ou réservez directement votre bilan offert.';
    }
    const waText = `Bonjour, je suis ${pj}. Suite à mon diagnostic en ligne (priorité : ${priorite.toLowerCase()}), le plan recommandé est : ${soins.map((s) => s.label).join(', ')}. Je souhaite réserver mon bilan offert au ${cv.replace('Centre ', 'centre ')}.`;
    el.actions.innerHTML = `
      <a class="btn btn--gold" href="${centre.booking}" target="_blank" rel="noopener"><span class="btn__label"><span data-text="Réserver mon bilan offert">Réserver mon bilan offert</span></span></a>
      <a class="btn btn--ghost" href="https://wa.me/${data.whatsapp}?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener"><span class="btn__label"><span data-text="Écrire sur WhatsApp">Écrire sur WhatsApp</span></span></a>
      <a class="btn btn--ghost" href="tel:${centre.tel}"><span class="btn__label"><span data-text="${centre.phone}">${centre.phone}</span></span></a>`;
    progress(100, 'Votre plan');
    show('fin');
    app.scrollTo?.(box);
  });

  $('[data-quiz-restart]', box).addEventListener('click', () => { progress(0, ''); start(); app.scrollTo?.(box); });

  const pre = new URLSearchParams(location.search).get('besoin');
  start(pre);
  progress(pre ? 22 : 0, pre ? 'Question 2 sur 3' : 'Question 1 sur 3');
}
