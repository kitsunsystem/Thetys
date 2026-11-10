// Worker Cloudflare du site Centre Thetys.
// - sert les fichiers statiques générés dans dist/ (liaison ASSETS) ;
// - redirige (301) les anciennes adresses du site vers la nouvelle arborescence ;
// - reçoit le formulaire « Être rappelé·e » (/api/contact) et le transmet
//   à l'adresse définie dans la variable CONTACT_WEBHOOK_URL (Make, Zapier, n8n…).
import redirects from './redirects.json';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

function normalise(pathname) {
  let p = pathname.toLowerCase();
  try { p = decodeURIComponent(p); } catch {}
  if (!p.endsWith('/') && !/\.[a-z0-9]{2,5}$/.test(p)) p += '/';
  return p;
}

async function handleContact(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Méthode non autorisée' }, 405);
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Requête invalide' }, 400);
  }
  if (data.site) return json({ ok: true }); // champ piège : envoi automatisé
  const required = ['prenom', 'nom', 'telephone', 'email', 'centre'];
  if (required.some((k) => !String(data[k] || '').trim())) return json({ ok: false, error: 'Champs manquants' }, 422);
  if (!env.CONTACT_WEBHOOK_URL) return json({ ok: false, error: 'Envoi non configuré' }, 503);
  const clean = Object.fromEntries(
    ['prenom', 'nom', 'telephone', 'email', 'centre', 'objet', 'solution', 'rappel', 'message']
      .map((k) => [k, String(data[k] || '').slice(0, 2000)]),
  );
  clean.date = new Date().toISOString();
  clean.source = 'site';
  const res = await fetch(env.CONTACT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(clean),
  });
  return res.ok ? json({ ok: true }) : json({ ok: false, error: 'Envoi impossible' }, 502);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') return handleContact(request, env);

    // anciennes adresses du site WordPress
    const to = redirects[normalise(url.pathname)];
    if (to) {
      const target = new URL(to, url.origin);
      return Response.redirect(target.toString(), 301);
    }
    if (/^\/(wp-content|wp-admin|wp-includes|feed|xmlrpc\.php|wp-json)/.test(url.pathname)) {
      return Response.redirect(new URL('/', url.origin).toString(), 301);
    }
    if (url.pathname.startsWith('/en/')) return Response.redirect(new URL('/', url.origin).toString(), 301);

    const res = await env.ASSETS.fetch(request);
    // adresse de démonstration (*.workers.dev) : ne pas indexer, pour ne pas
    // concurrencer le site officiel dans les moteurs de recherche
    if (url.hostname.endsWith('.workers.dev')) {
      const out = new Response(res.body, res);
      out.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return out;
    }
    return res;
  },
};
