# Centre Thetys — site vitrine

Site vitrine du **Centre Thetys**, centres esthétiques minceur, anti-âge et épilation définitive à **Antibes**, **Cannes Le Cannet** et **Pégomas**.

Conception et développement : **[Kitsun System](https://kitsunsystem.com)**.

---

## Ce que contient le site

| Rubrique | Adresse | Contenu |
| --- | --- | --- |
| Accueil | `/` | Vidéo d'ambiance, diagnostic en 60 s, besoins, plateau technique, résultats, avis, FAQ, centres, journal |
| Nos soins | `/soins/` + 21 fiches | Visage, corps, épilation, cheveux : principe, déroulé, zones, tarifs, FAQ, vidéos |
| Vos besoins | `/besoins/` + 4 familles + 21 besoins | Silhouette, peau plus jeune, peau plus belle, pilosité |
| Nos centres | `/centres/` + 3 centres | Adresses, horaires, parking, carte, technologies, FAQ, réservation Fresha |
| Résultats | `/resultats/` | Avant / après filtrables par univers |
| Diagnostic | `/diagnostic/` | Auto-diagnostic interactif (3 questions → plan personnalisé) |
| Qui sommes-nous | `/qui-sommes-nous/` | Valeurs, fondateurs, histoire |
| Cosmétiques | `/cosmetiques/` | Mesoestetic, Biologique Recherche, Thalgo, D-LAB |
| Carte cadeau | `/carte-cadeau/` | Soins à offrir, tarifs, conditions |
| Rendez-vous | `/rendez-vous/` | Réservation en ligne par centre, formulaire de rappel |
| Offres | `/offres/` | Black Friday, épilation laser à Pégomas |
| Journal | `/journal/` + 47 articles | Tous les articles du blog |
| Légal | `/mentions-legales/`, `/cgv/`, `/confidentialite/` | |

Les anciennes adresses du site WordPress (plus de 150) sont redirigées automatiquement (301) vers les nouvelles pages : le référencement est conservé lors de la bascule du nom de domaine.

---

## Démarrage

Prérequis : Node.js 20 ou plus récent.

```bash
npm install          # installe les dépendances
npm run build        # génère le site dans dist/
npm run preview      # aperçu local sur http://localhost:4173
```

## Mise en ligne sur Cloudflare Workers

Le site est servi par un Worker Cloudflare (fichiers statiques + redirections + formulaire).

```bash
npx wrangler login   # une seule fois : connexion au compte Cloudflare
npm run deploy       # construit puis déploie le site
```

Le site est alors en ligne sur `https://centre-thetys.<votre-sous-domaine>.workers.dev`.

**Nom de domaine** : dans le tableau de bord Cloudflare → *Workers & Pages* → `centre-thetys` → *Settings* → *Domains & Routes* → ajouter `centrethetys.fr` (et `www.centrethetys.fr`).

**Déploiement automatique depuis GitHub** (facultatif) : *Workers & Pages* → *Create* → *Import a repository*, choisir ce dépôt. La commande de build `npm run build` est déjà déclarée dans `wrangler.jsonc`.

### Formulaire « Être rappelé·e »

Le formulaire envoie la demande au Worker (`/api/contact`), qui la transmet à un webhook (Make, Zapier, n8n…) :

```bash
npx wrangler secret put CONTACT_WEBHOOK_URL
```

Tant que ce secret n'est pas défini, le formulaire ouvre la messagerie du visiteur avec la demande pré-remplie, adressée au centre choisi.

---

## Modifier le contenu

Tout le texte est dans `content/` (fichiers JSON), puis `npm run build` :

| Fichier | Contenu |
| --- | --- |
| `site.json` | Coordonnées des centres, horaires, liens de réservation, réseaux sociaux, avis, bandeau d'annonce, crédit |
| `pages.json` | Accueil, qui sommes-nous, diagnostic, résultats, cosmétiques, carte cadeau, rendez-vous, recrutement |
| `soins-visage.json`, `soins-corps.json` | Les 21 fiches technologies |
| `besoins.json` | Vos besoins (familles et besoins détaillés) |
| `centres.json` | Pages des trois centres |
| `offres.json` | Offres du moment |
| `journal.json` | Articles du blog |
| `legal.json` | Mentions légales et CGV |

Réglages utiles dans `site.json` :

- `baseUrl` : adresse définitive du site (adresses canoniques, plan du site, partages).
- `announcement` : bandeau flottant (texte, lien, date de fin `until` : il disparaît seul après cette date).
- `diagnosticWebhook` : adresse qui reçoit les réponses de l'auto-diagnostic. Elle reprend le scénario du site actuel, qui envoie le plan sur WhatsApp. Laisser vide pour afficher le plan à l'écran avec un bouton WhatsApp.
- `giftCardUrl` : lien d'achat de la carte cadeau en ligne.

## Images et vidéos

Les images optimisées (AVIF + WebP, plusieurs largeurs) sont dans `media/img/`, décrites par `media/images.json`. Pour en ajouter : déposer les originaux dans `media/originals/`, puis :

```bash
npm run media
```

Les vidéos (MP4 compressées, avec leur image d'aperçu) sont dans `media/video/`.

## Structure

```
content/      textes du site (JSON)
media/        images et vidéos optimisées
scripts/      générateur (build.mjs), optimisation des images, aperçu local
src/
  templates/  gabarits des pages
  styles/     feuilles de style
  js/         animations et interactions (GSAP, ScrollTrigger, Lenis)
  static/     favicon, manifeste, en-têtes HTTP
worker/       Worker Cloudflare (redirections, formulaire)
dist/         site généré (non versionné)
```

## Performances, accessibilité, confidentialité

- Polices, images et vidéos hébergées sur le site : aucun appel à des services tiers pendant la navigation, aucun cookie, pas de bandeau de consentement.
- Images responsives AVIF / WebP avec aperçu flouté, vidéos chargées à l'approche.
- Animations désactivées automatiquement pour les visiteurs qui préfèrent réduire les animations ; navigation complète au clavier.
- Données structurées (établissements, services, FAQ, articles, fil d'Ariane), plan du site et `robots.txt` générés automatiquement.

---

© Centre Thetys — site créé et développé par [Kitsun System](https://kitsunsystem.com).
